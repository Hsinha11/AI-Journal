// src/components/Header.jsx

function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <h2 className="text-2xl font-bold text-slate-800">AI Journal</h2>
      <nav className="flex gap-6">
        <a href="#" className="text-slate-600 hover:text-blue-600">Home</a>
        <a href="#" className="text-slate-600 hover:text-blue-600">New Entry</a>
        <a href="#" className="text-slate-600 hover:text-blue-600">Login</a>
      </nav>
    </header>
  );
}

export default Header;