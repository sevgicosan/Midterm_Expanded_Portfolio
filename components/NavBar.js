"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./NavBar.module.css";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about-me", label: "About Me" },
  { href: "/work-experience", label: "Work Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blogs", label: "Blog" },
  { href: "/contact-me-server-form", label: "Contact Me" },
  { href: "/contact-me", label: "Get in Touch" },
];

// Decides whether a nav item should be highlighted. "Home" is
// exact-matched; other items match their route (and child
// routes, e.g. /projects matches /projects/product-inventory).
function isActive(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
}

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" className={styles.brand}>
          Sevgi Cosan Senbaslar
        </Link>
        <ul className={styles.links}>
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={
                    active ? `${styles.link} ${styles.activeLink}` : styles.link
                  }
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
