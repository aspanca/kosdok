"use client";

import React, { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AppBar } from "../app-bar/app-bar";
import { Footer } from "../footer/footer";
import { ContactDisclaimer } from "../contact-disclaimer/contact-disclaimer";

type LayoutProps = {
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div>
      <AppBar />
      <main>{children}</main>
      <ContactDisclaimer />
      <Footer />
    </div>
  );
};
