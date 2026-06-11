import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import { Providers } from "./providers";
import "../index.css";

const titillium = Titillium_Web({
  subsets: ["latin", "latin-ext"],
  weight: ["200", "300", "400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-titillium",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kosdok",
    template: "%s | Kosdok",
  },
  description:
    "Kosdok ndihmon përdoruesit në Kosovë të gjejnë doktorë, spitale, klinika dhe barnatore — me rezervim terminësh, vlerësime dhe evente të dhurimit të gjakut.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sq" className={titillium.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
