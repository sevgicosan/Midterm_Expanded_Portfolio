import Image from "next/image";
import Link from "next/link";
import SectionNavRow from "@/components/SectionNavRow";
import {
  MailIcon,
  PhoneIcon,
  GitHubIcon,
  LinkedInIcon,
  PersonIcon,
  BriefcaseIcon,
  CodeIcon,
  PaperPlaneIcon,
  PinIcon,
  TableauIcon,
} from "@/components/icons";
import styles from "./page.module.css";

const contactDetails = [
  {
    icon: <MailIcon size={18} />,
    label: "Email",
    text: "sevgicosan@gmail.com",
    href: "mailto:sevgicosan@gmail.com",
    external: false,
  },
  {
    icon: <PhoneIcon size={18} />,
    label: "Phone",
    text: "+1 323 847 4532",
    href: "tel:+13238474532",
    external: false,
  },
  {
    icon: <GitHubIcon size={18} />,
    label: "GitHub",
    text: "github.com/sevgicosan",
    href: "https://github.com/sevgicosan",
    external: true,
  },
  {
    icon: <LinkedInIcon size={18} />,
    label: "LinkedIn",
    text: "linkedin.com/in/sevgicosan",
    href: "https://www.linkedin.com/in/sevgicosan",
    external: true,
  },
  {
    icon: <TableauIcon size={18} />,
    label: "Tableau Public",
    text: "public.tableau.com/app/profile/sevgi.cosan",
    href: "https://public.tableau.com/app/profile/sevgi.cosan/vizzes",
    external: true,
  },
];

export default function Home() {
  return (
    <div className="container">
      <div className={styles.layout}>
        {/* Left column — profile photo and contact details */}
        <aside className={styles.profile} aria-label="Profile and contact information">
          <Image
            src="/images/profile.jpg"
            alt="Portrait of Sevgi Cosan Senbaslar"
            width={768}
            height={1024}
            priority
            className={styles.photo}
          />

          <ul className={styles.contactList}>
            {contactDetails.map((contact) => (
              <li key={contact.label}>
                <a
                  href={contact.href}
                  className={styles.contactLink}
                  {...(contact.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  <span className={styles.contactIcon}>{contact.icon}</span>
                  <span>{contact.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right column — introduction, section rows, contact band */}
        <div className={styles.content}>
          <section className={styles.hero} aria-label="Introduction">
            <h1 className={styles.heroTitle}>
              <em>Hi, I&apos;m Sevgi!</em>
            </h1>

            <p className={styles.heroParagraph}>
              Thanks for stopping by! I&apos;m so happy you&apos;re here, and I
              hope you find what you&apos;re looking for.
            </p>

            <p className={styles.heroParagraph}>
              <strong>Fun fact!</strong> Cosan is actually not my middle name
              and if you have ever wondered what kind of name it is, it&apos;s
              Turkish! 🇹🇷
            </p>

            <p className={styles.heroParagraph}>
              Feel free to explore! If you&apos;re curious about who I am, head
              over to <Link href="/#about-me" className="text-link">About Me</Link>.
              Want to know what I&apos;ve been up to professionally? Check
              out <Link href="/#work-experience" className="text-link">Work Experience</Link>.
              And if you&apos;d like to see what I&apos;ve been working on,
              take a peek at <Link href="/#projects" className="text-link">My Projects</Link>.
            </p>

            <p className={styles.heroParagraph}>
              Have a question, an idea, or just feel like saying hi? Don&apos;t
              be a stranger! The <Link href="/#contact" className="text-link">Contact page</Link> is
              always there for you.
            </p>

            <p className={styles.heroSignoff}>
              <em>Have fun!</em>
            </p>
          </section>

          <SectionNavRow
            id="about-me"
            icon={<PersonIcon size={26} />}
            label="About Me"
            title="A little about me."
            description="My background, education, interests, and the experiences that have shaped my journey."
            href="/about-me"
          />

          <SectionNavRow
            id="work-experience"
            icon={<BriefcaseIcon size={26} />}
            label="Work Experience"
            title="My professional journey."
            description="A look at my professional journey, key responsibilities, and the impact I've made."
            href="/work-experience"
          />

          <SectionNavRow
            id="projects"
            icon={<CodeIcon size={26} />}
            label="Projects"
            title="Selected projects."
            description="Hands-on projects that highlight my technical skills, problem-solving approach, and analytical thinking."
            href="/projects"
          />

          <SectionNavRow
            id="learning-exchange"
            icon={<PinIcon size={26} />}
            label="Learning Exchange"
            title="Learning Exchange."
            description="Recommend a course, book, podcast, or talk worth sharing? Add it to the board, explore others’ recommendations, and bookmark your favorites for later."
            href="/learning-exchange"
          />

          <section id="contact" className={styles.contactBand} aria-label="Contact">
            <span className={styles.contactIconCircle} aria-hidden="true">
              <PaperPlaneIcon size={22} />
            </span>

            <div className={styles.contactText}>
              <h2 className={styles.contactHeading}>Let&apos;s connect.</h2>
              <p className={styles.contactDescription}>
                Have a question, an opportunity, or an idea? I&apos;d love to
                hear from you.
              </p>
            </div>

            <Link href="/contact-me-server-form" className="button button-light">
              Contact Me
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
