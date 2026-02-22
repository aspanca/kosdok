import React, { ReactNode, useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { AppBar } from "../app-bar/app-bar";
import { Footer } from "../footer/footer";
import { ContactDisclaimer } from "../contact-disclaimer/contact-disclaimer";

type LayoutProps = {
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div>
      <AppBar />
      <main>{children}</main>
      <ContactDisclaimer />
      <Footer />
    </div>
  );
};
