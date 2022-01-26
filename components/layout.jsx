import { Footer } from "./footer";
import { Navbar } from "./navbar";

const openPortfolio = () => window.open("https://keysijones.vercel.app");

function Layout({ children }) {
  return (
    <div>
      <Navbar openPortfolio={openPortfolio} />
      {children}
      <Footer openPortfolio={openPortfolio} />
    </div>
  );
}

export { Layout };
