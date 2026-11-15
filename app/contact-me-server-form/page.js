import { Suspense } from "react";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Me",
  description: "Send a message to Sevgi Cosan Senbaslar through the contact form.",
};

export default async function ContactMePage({ searchParams }) {
  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Contact Me</h1>
        <p className="page-intro">
          Have a question or want to work together? Fill in the form below and
          your message will come straight to me.
        </p>
      </header>

      <Suspense fallback={null}>
        <SentBanner searchParams={searchParams} />
      </Suspense>

      <ContactForm />
    </div>
  );
}

// After a successful submission the Server Action redirects here
// with ?sent=1, which shows this confirmation banner. Reading
// searchParams requires a Suspense boundary under Cache
// Components, hence the separate async component above.
async function SentBanner({ searchParams }) {
  const params = await searchParams;

  if (params.sent !== "1") {
    return null;
  }

  return (
    <div className="card sent-banner" role="status">
      <h2>Message sent!</h2>
      <p>Thank you for your message! I will get back to you soon.</p>
    </div>
  );
}
