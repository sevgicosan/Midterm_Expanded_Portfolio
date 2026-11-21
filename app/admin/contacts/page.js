import ContactRequestsAdmin from "./ContactRequestsAdmin";

export const metadata = {
  title: "Contact Requests Admin",
  description: "Manage messages received through Let's Get in Touch.",
  // Personal admin page — keep it out of search results.
  robots: { index: false, follow: false },
};

export default function ContactAdminPage() {
  return (
    <div className="container">
      <ContactRequestsAdmin />
    </div>
  );
}
