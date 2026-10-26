import { test, expect } from "@playwright/test";

test("publisher pages are readable on mobile without advertising requests", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const adRequests = [];
  page.on("request", (request) => {
    if (
      /googlesyndication|doubleclick|fundingchoicesmessages/.test(request.url())
    )
      adRequests.push(request.url());
  });
  for (const route of ["about", "contact", "privacy", "editorial"]) {
    const response = await page.goto(`/${route}/`);
    expect(response.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(
      page
        .getByRole("navigation", { name: "Footer navigation" })
        .getByRole("link", { name: "Privacy", exact: true }),
    ).toBeVisible();
  }
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "AI assistance", exact: true }),
  ).toBeVisible();
  expect(adRequests).toEqual([]);
});

test("article publisher and correction links are available", async ({
  page,
}) => {
  await page.goto("/blog/");
  await page.locator("[data-notebook-list] > a").first().click();
  await expect(
    page.locator(".article-meta").getByRole("link", { name: "Khuram Shahzad" }),
  ).toHaveAttribute("href", "/about/");
  await expect(
    page.getByRole("link", { name: "Report a correction" }),
  ).toHaveAttribute("href", "/contact/");
  await expect(page.locator(".article-cover img")).toBeVisible();
});
