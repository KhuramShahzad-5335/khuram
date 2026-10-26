import { InformationPage } from "@/components/information-page";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
export const metadata = pageMetadata(
  "Contact Khuram Shahzad",
  "Contact Khuram Shahzad about development projects, collaborations, article corrections, and privacy questions.",
  "/contact/",
);
export default function Page() {
  return (
    <InformationPage
      title="Let’s talk."
      intro="Development projects, a useful idea, or something in an article that needs fixing—here’s how to reach me."
    >
      <section>
        <h2>Email</h2>
        <p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <p>
          For project enquiries, include the goal, scope, timeline, and any
          existing website. For an article correction, include the page URL, the
          disputed statement, and a supporting source.
        </p>
      </section>
      <section>
        <h2>Other ways to connect</h2>
        <p>
          <a href={site.linkedin}>LinkedIn</a> ·{" "}
          <a href={site.github}>GitHub</a> ·{" "}
          <a href={site.whatsapp}>WhatsApp</a>
        </p>
        <p>
          Based in Lahore, Pakistan. These links open third-party services with
          their own privacy policies.
        </p>
      </section>
      <section>
        <h2>Privacy and rights enquiries</h2>
        <p>
          Use the same email with “Privacy” or “Content rights” in the subject.
          Please describe the request without sending passwords, identity
          documents, or other unnecessary sensitive information.
        </p>
      </section>
    </InformationPage>
  );
}
