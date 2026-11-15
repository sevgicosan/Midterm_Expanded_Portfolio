import styles from "./page.module.css";

export const metadata = {
  title: "About Me",
  description:
    "Sevgi Cosan Senbaslar's journey: mathematics, EV product data at Rivian and Lucid, and business analytics at Santa Clara University.",
};

export default function AboutMePage() {
  return (
    <div className="container">
      <header className="page-header">
        <h1 className="page-title">About Me</h1>
      </header>

      <article className={styles.story}>
        <p>
          I studied Mathematics at Middle East Technical University in Ankara,
          Turkey, and graduated in 2020. Later that year, I moved to Los
          Angeles, California. I took the pandemic shutdown as an opportunity
          to explore some of my personal interests. I took a data bootcamp on
          Udemy and learned the fundamentals of coding, data, and statistics.
        </p>

        <p>
          About a year later, I got my first job and joined Rivian&apos;s PDM
          team as a Junior Analyst. That&apos;s where I was introduced to the
          EV industry and learned all about PLM and PDM. I also made some great
          friends along the way! Overall, it was a really great experience and
          an exciting project to be part of.
        </p>

        <p>
          After two years, in 2024, I moved to the Bay Area and joined
          Lucid&apos;s Engineering Tools team, where I worked on the 3DX
          transition project. I met more amazing people, built new connections,
          and developed a whole new set of skills.
        </p>

        <p>
          After wrapping up that project, I joined Lucid&apos;s Vehicle Safety
          team as a Technical Program Manager in 2025. This one was{" "}
          <strong>my favorite!</strong> It opened up a whole new world for me.
          I&apos;ve always enjoyed watching car crash test videos (I know, a
          little unusual!), and suddenly I had the chance to actually work with
          the people who make those tests happen. How cool is that?!
        </p>

        <p>
          Later in 2025, I started my master&apos;s in Business Analytics at
          Santa Clara University. I spent some time juggling work and school,
          but eventually decided to focus on my studies and go back to being a
          full-time student.
        </p>

        <p>
          And that brings us to today! I&apos;m currently a graduate student,
          learning more about data analytics, programming, and all the fun
          things that come with them.
        </p>

        <p className={styles.signoff}>
          I&apos;m graduating this December... fingers crossed! 🤞
        </p>
      </article>
    </div>
  );
}
