import React from "react";
import Header from "./header";
import Footer from "./footer";

const Layout: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <div className="app-container">
    <Header />
    <main>{children}</main>
    <Footer />
  </div>
);

export default Layout;
