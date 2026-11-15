import ContactFormApi from "./ContactFormApi";

export const metadata = {
  title: "Get in Touch",
  description:
    "Get in touch with Sevgi Cosan Senbaslar — this form sends your message through the /api/contacts endpoint.",
};

export default function GetInTouchPage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Get in Touch</h1>
        <p className="page-intro">
          Prefer the classic way? This form sends your message as JSON to the{" "}
          <code>POST /api/contacts</code> endpoint — same inbox, different
          route.
        </p>
      </header>

      <ContactFormApi />
    </div>
  );
}
