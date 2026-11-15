import styles from "./page.module.css";

export const metadata = {
  title: "Work Experience",
  description:
    "Sevgi Cosan Senbaslar's professional experience at Lucid Motors and Rivian, plus her technical skills.",
};

// ============================================================
// Professional experience, most recent first.
// ============================================================

const summary =
  "Technical Program/Project and Product Operations professional with years of experience across EV product development, PLM/product data, engineering change management, and cross-functional program execution at Rivian and Lucid. Experienced in supporting product lifecycle activities from design release through validation and production readiness, with a strong ability to organize complex technical information, align engineering and business stakeholders, track risks, and turn scattered inputs into clear execution plans. Currently pursuing an M.S. in Business Analytics to further strengthen data, AI, coding, and analytical skills for more strategic product planning and business decision-making roles.";

const experiences = [
  {
    company: "Lucid Motors",
    location: "Newark, CA",
    jobTitle: "Technical Program Manager (Contract)",
    dates: "Mar 2025 – Oct 2025",
    intro:
      "Managed program execution across Vehicle Safety, CAE, and Electromagnetic Compatibility, aligning cross-functional teams on validation timelines, launch milestones, risks, budget visibility, and execution priorities.",
    bullets: [
      "Built a centralized Smartsheet budget tracking system for a ~$200M program budget, integrating SAP data and inputs from 7 engineering teams to track cost-center purchases, monitor team-level allocated vs. actual spend, and improve leadership visibility while reducing manual reporting.",
      "Improved execution efficiency by standardizing program reporting, workflow templates, and data inputs, increasing data accuracy, improving cross-functional alignment, and making execution gaps easier to identify and resolve.",
      "Mitigated supply chain risks for critical validation milestones by executing alternative sourcing strategies, including reallocating internal inventory and rapidly onboarding international vendors, while evaluating cost, quality, and delivery timelines across the full PR/PO lifecycle to ensure on-time test execution.",
      "Created 3DX/CAD configurations for 20+ test vehicles and provided suppliers with the latest design data to support timely quoting and execution against current design releases.",
      "Partnered with engineering, supply chain, material planning, finance, and suppliers to track risks, remove blockers, and support validation readiness for vehicle launch milestones.",
    ],
  },
  {
    company: "Lucid Motors",
    location: "Newark, CA",
    jobTitle:
      "Product Systems & Process Integration Consultant – 3DX Transition (Contract)",
    dates: "Apr 2024 – Jan 2025",
    intro:
      "Supported Lucid's Engineering Change Management transition from JIRA to 3DX ENOVIA, contributing across process definition, system development support, validation, launch readiness, and user adoption.",
    bullets: [
      "Partnered with engineering, supply chain, manufacturing, NPI, and other approval teams to gather ECR process needs, document current-state gaps, and define future-state PLM workflow requirements.",
      "Supported system development by translating business process needs into functional design inputs, validating implemented features against requirements, documenting issues, and partnering with technical teams to resolve gaps before launch.",
      "Executed 1,000+ UAT and system test scenarios, maintaining functional specifications, test documentation, and issue-tracking records to support readiness and traceability.",
      "Led user adoption for approximately 1,000 stakeholders through 46 training sessions, 30+ Confluence user guides and FAQs, and role-based training materials for cross-functional teams.",
    ],
  },
  {
    company: "Rivian Automotive",
    location: "Irvine, CA",
    jobTitle: "Product Data Management Analyst (Contract)",
    dates: "Oct 2022 – Mar 2024",
    intro:
      "Managed complex vehicle BOM data in 3DX, maintaining accurate part structures and configuration logic through quality checks, engineering change alignment, early risk identification, and product structure validation to support build readiness and prevent downstream production issues.",
    bullets: [
      "Managed part releases/updates and configuration data from design release through manufacturing by processing engineering change actions (ECO/MCO) in 3DX and aligning BOM structures with manufacturing and program requirements.",
      "Released 1,000+ parts into the Manufacturing BOM within 15 hours to support urgent production readiness and downstream manufacturing execution.",
      "Identified a Finance platform data-flow issue causing BOM inaccuracies and resolved 100+ BOM and product structure issues within one week by validating records in 3DX, correcting system flow errors, and supporting downstream workstream continuity.",
    ],
  },
];

const skillCategories = [
  {
    name: "Product & Business Operations",
    skills: [
      "Requirements Gathering",
      "Process Improvement",
      "Stakeholder Management",
      "Engineering Change Management",
      "Supplier Readiness",
      "BOM Management",
      "PLM/PDM",
    ],
  },
  {
    name: "Tools & Systems",
    skills: [
      "Smartsheet",
      "Excel",
      "Word",
      "PowerPoint",
      "SAP",
      "3DX Dassault Systèmes",
      "ENOVIA",
      "CATIA",
      "JIRA",
      "Confluence",
      "Lucidchart",
    ],
  },
  {
    name: "Data & AI",
    skills: [
      "Data Analysis",
      "Data Cleaning",
      "Machine Learning",
      "Natural Language Processing",
      "Deep Learning",
    ],
  },
  {
    name: "Programming & Analytics",
    skills: [
      "Python",
      "SQL",
      "R",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "Matplotlib",
      "Seaborn",
      "Tableau",
    ],
  },
];

function SerifTitle({ text }) {
  const parts = text.split("&");
  if (parts.length === 1) return text;
  return parts.map((part, index) => (
    <span key={index}>
      {part}
      {index < parts.length - 1 && <span className={styles.amp}>&amp;</span>}
    </span>
  ));
}

export default function WorkExperiencePage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">Work Experience</h1>
      </header>

      <section className={`section ${styles.summarySection}`} aria-label="Professional summary">
        <h2 className={styles.label}>Professional Summary</h2>
        <p className={styles.summary}>{summary}</p>
      </section>

      <section className="section" aria-label="Experience">
        {experiences.map((experience) => (
          <article key={experience.jobTitle} className={styles.experienceItem}>
            <header className={styles.rowHeader}>
              <span className={styles.rowTitles}>
                <span className={styles.jobTitle}>
                  <SerifTitle text={experience.jobTitle} />
                </span>
                <span className={styles.company}>
                  {experience.company} — {experience.location}
                </span>
              </span>

              <span className={styles.dates}>{experience.dates}</span>
            </header>

            <div className={styles.rowBody}>
              <p className={styles.roleIntro}>{experience.intro}</p>

              <ul className={styles.bullets}>
                {experience.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="section" aria-label="Technical skills">
        <h2 className={styles.label}>Technical Skills</h2>

        <div className={styles.skillsGrid}>
          {skillCategories.map((category) => (
            <div key={category.name} className={styles.skillGroup}>
              <h3 className={styles.skillCategory}>{category.name}</h3>
              <ul className={styles.skillTags}>
                {category.skills.map((skill) => (
                  <li key={skill} className="tag">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
