import { InformationPage } from "@/components/information-page";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
export const metadata = pageMetadata(
  "Privacy notice",
  "How this portfolio handles preferences, analytics, hosting, contact messages, and the private publishing studio.",
  "/privacy/",
);
export default function Page() {
  return (
    <InformationPage
      title="Privacy, in plain language."
      intro="Last updated: 26 October 2026. This notice covers khuramshahzad.dev, operated by Khuram Shahzad in Lahore, Pakistan."
    >
      <section>
        <h2>Visiting the site</h2>
        <p>
          Vercel hosts the site and its images. Delivering pages involves
          technical request information such as IP addresses, requested URLs,
          browser details, and timestamps. Hosting and security providers may
          process request logs to deliver and protect the service.
        </p>
        <p>
          The production site uses Vercel Web Analytics and Speed Insights to
          understand page visits and performance. Vercel describes Web Analytics
          as cookie-free. Performance measurements help identify slow pages and
          layout problems. See{" "}
          <a href="https://vercel.com/docs/analytics/privacy-policy">
            Vercel’s analytics privacy documentation
          </a>{" "}
          and{" "}
          <a href="https://vercel.com/legal/privacy-policy">
            Vercel’s privacy policy
          </a>{" "}
          for provider details.
        </p>
      </section>
      <section>
        <h2>Preferences and storage</h2>
        <p>
          Theme, palette, and typography preferences are stored in your browser
          so they can persist across visits. You can clear them using your
          browser’s site-data controls. The owner-only publishing studio uses an
          authentication cookie; public readers do not need an account.
        </p>
        <p>
          MongoDB stores article content and publishing records. Vercel Blob
          stores uploaded article images. The public blog does not provide
          reader registration or a comment database.
        </p>
      </section>
      <section>
        <h2>Contact and third-party links</h2>
        <p>
          Email and social links take you to your chosen mail provider or an
          external service. If you send a message, its contents and contact
          information are used to respond and manage the conversation. Avoid
          sending sensitive information you do not need to share.
        </p>
        <p>
          External sites control their own data practices. Service providers may
          process information outside your country. Provider retention periods
          and account settings vary; this site does not promise a universal
          deletion period for provider logs.
        </p>
      </section>
      <section>
        <h2>Advertising status</h2>
        <p>
          Google advertising is not currently enabled. Preparing account
          verification and an ads.txt file does not load advertising code or set
          advertising cookies.
        </p>
        <p>
          Before advertising is activated, this notice must be updated to
          describe the actual ad providers, their collection and use of
          information, cookies or similar identifiers, and available choices.
          Applicable consent requirements and a Google-certified consent
          platform must be addressed before ad serving begins.
        </p>
      </section>
      <section>
        <h2>Your choices and questions</h2>
        <p>
          You can clear browser storage, use browser privacy controls, or
          contact <a href={`mailto:${site.email}`}>{site.email}</a> about
          information you have shared or an access, correction, or deletion
          request. The available response depends on the data involved and
          applicable requirements.
        </p>
        <p>
          This notice will be revised when the site’s data practices change.
        </p>
      </section>
    </InformationPage>
  );
}
