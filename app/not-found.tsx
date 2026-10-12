import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="page-main">
      <span className="eyebrow">404 / WRONG TURN</span>
      <h1>
        This tab went
        <br />
        <span className="muted">off on a tangent.</span>
      </h1>
      <p className="page-intro">
        The page is missing. Your curiosity is doing fine.
      </p>
      <Link href="/" className="button primary">
        Back to home →
      </Link>
    </main>
  );
}
