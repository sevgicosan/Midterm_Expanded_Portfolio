import { Carlito } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";

// Georgia (a system font, no download needed) is the serif for headings
// and editorial accents, wired through --font-serif in globals.css.
// Carlito: body text, navigation, and UI elements (metric-compatible
// with Calibri).
const carlito = Carlito({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: {
    default: "Sevgi Cosan Senbaslar | Portfolio",
    template: "%s | Sevgi Cosan Senbaslar",
  },
  description:
    "Portfolio of Sevgi Cosan Senbaslar: technical program management, product data, and business analytics.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${carlito.variable}`}
    >
      <body>
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
