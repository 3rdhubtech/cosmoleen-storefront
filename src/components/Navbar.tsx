import logo from "../assets/Maped.png";

export default function Navbar() {
  return (
    <div>
      <header className="h-12 w-full bg-primary-500 flex items-center justify-between p-2">
        <nav className="flex gap-2 items-center">
          <div className="bg-brand-500 h-9 max-w-[9rem] inline-block flex items-center gap-2">
            <img src={logo} className="w-full p-1" />
          </div>
          <h1 className="font-bold text-xl flex flex-col">
            كوزملين
            <span className="text-xs hidden md:inline-block">
              بن عاشور,طرابلس,طرابلس,ليبيا.
            </span>
          </h1>
        </nav>
      </header>
    </div>
  );
}
