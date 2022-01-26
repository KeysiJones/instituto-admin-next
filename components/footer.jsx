function Footer({ openPortfolio }) {
  return (
    <footer className="p-2 bg-crimson w-full text-center text-white text-2xl">
      <span className="hover:cursor-pointer" onClick={openPortfolio}>
        &copy; Keysi Jones - {new Date().getFullYear()}
      </span>
    </footer>
  );
}

export { Footer };
