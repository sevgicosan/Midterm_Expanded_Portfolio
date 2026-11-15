import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import styles from "./SectionNavRow.module.css";

// A clickable navigation row: an icon (or number) in a soft
// beige square, optional small uppercase label, elegant serif
// heading, short description, and a right-facing arrow on the
// far right. Rows are separated by thin horizontal lines.
export default function SectionNavRow({ id, icon, label, title, description, href }) {
  return (
    <section id={id} className={styles.section} aria-label={label || title}>
      <Link href={href} className={styles.row}>
        <span className={styles.iconSquare}>{icon}</span>

        <span className={styles.text}>
          {label && <span className={styles.label}>{label}</span>}
          <span className={styles.title}>{title}</span>
          <span className={styles.description}>{description}</span>
        </span>

        <span className={styles.arrow} aria-hidden="true">
          <ArrowRightIcon size={22} />
        </span>
      </Link>
    </section>
  );
}
