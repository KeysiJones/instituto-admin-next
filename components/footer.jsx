function Footer({ openPortfolio }) {
  return (
    <footer className="p-2w-full text-center text-gray-700 text-2xl mb-8">
      <span className="hover:cursor-pointer font-bold" onClick={openPortfolio}>
        Made with &hearts; by <span className="underline">Keysi Jones</span>
      </span>
    </footer>
  );
}

export { Footer };
