function Navbar({ openPortfolio }) {
  return (
    <nav className="p-2 bg-crimson relative w-full text-center text-white text-2xl">
      <span>
        Instituto Admin made with &hearts; by{" "}
        <span
          className="underline hover:cursor-pointer"
          onClick={openPortfolio}
        >
          Keysi Jones
        </span>
      </span>
    </nav>
  );
}

export { Navbar };
