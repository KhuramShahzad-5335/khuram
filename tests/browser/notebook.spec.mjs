import { test, expect } from "@playwright/test";

for (const width of [320, 390, 1280]) {
  test(`one article per row, readable on ${width}px screens and reload`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/blog/");
    const list = page.locator("[data-notebook-list]");
    await expect(list.locator("a")).toHaveCount(3);
    const boxes = await list.locator("a").evaluateAll((cards) =>
      cards.map((card) => {
        const { x, y, width, height } = card.getBoundingClientRect();
        return { x, y, width, height };
      }),
    );
    for (let i = 1; i < boxes.length; i++) {
      expect(boxes[i].y).toBeGreaterThanOrEqual(
        boxes[i - 1].y + boxes[i - 1].height,
      );
      expect(boxes[i].x).toBe(boxes[0].x);
    }
    await expect(list.getByText("By Khuram Shahzad").first()).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(list).toBeVisible();
    expect(errors).toEqual([]);
    await list.locator("a").first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: testInfo.outputPath("article-layout.png") });
  });
}

test("topics, search, empty results and clear filters work by keyboard", async ({
  page,
}) => {
  await page.goto("/blog/");
  const group = page.getByRole("group", { name: "Filter articles by topic" });
  const topic = group.getByRole("button").nth(1);
  await expect(topic).toBeEnabled();
  await topic.focus();
  await page.keyboard.press("Enter");
  await expect(topic).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("status")).toContainText("matching");
  await page
    .getByLabel("Search the notebook", { exact: true })
    .fill("zzznomatchingarticlezzz");
  await expect(
    page.getByRole("heading", { name: "No notes found." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(
    group.getByRole("button", { name: "All topics" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("[data-notebook-list] > a")).toHaveCount(3);
  await page.getByRole("link", { name: "Older notes" }).click();
  await expect(page).toHaveURL(/\/blog\/page\/2\//);
  await expect(page.getByRole("link", { name: "Newer notes" })).toBeVisible();
});

test("failed search keeps articles available and can retry", async ({
  page,
}) => {
  await page.goto("/blog/");
  await page.route("**/blog/search/?*", (route) =>
    route.fulfill({ status: 503, json: { error: "Unavailable" } }),
  );
  await page.getByLabel("Search the notebook", { exact: true }).fill("color");
  await expect(
    page.getByRole("button", { name: "Retry search" }),
  ).toBeVisible();
  await expect(page.locator("[data-notebook-list] > a")).toHaveCount(3);
  await page.unroute("**/blog/search/?*");
  await page.getByRole("button", { name: "Retry search" }).click();
  await expect(page.getByRole("status")).toContainText("matching");
  await expect(page.getByRole("button", { name: "Retry search" })).toHaveCount(
    0,
  );
});

test("reduced motion, mobile navigation and palette keyboard recovery", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/blog/");
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Main navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Blog", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Open navigation" }),
  ).toHaveAttribute("aria-expanded", "false");
  const palette = page.getByRole("button", { name: "Edit website colors" });
  await palette.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Paper", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(palette).toBeFocused();
  const background = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--background"),
  );
  await page.reload();
  await expect
    .poll(() =>
      page.evaluate(() =>
        getComputedStyle(document.documentElement).getPropertyValue(
          "--background",
        ),
      ),
    )
    .toBe(background);
});

test("archive and articles are readable without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(baseURL + "/blog/");
  await expect(page.locator("[data-notebook-list] > a")).toHaveCount(3);
  await page.locator("[data-notebook-list] > a").first().click();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("article").first()).toBeVisible();
  await context.close();
});
