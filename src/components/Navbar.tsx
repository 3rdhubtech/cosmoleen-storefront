import logo from "../assets/logo.png";
import { changeView } from "../stores";

function GridIcon() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="8" height="8" rx="1" fill="#00A884" />
      <rect x="12" width="8" height="8" rx="1" fill="#00A884" />
      <rect x="12" y="12" width="8" height="8" rx="1" fill="#00A884" />
      <rect y="12" width="8" height="8" rx="1" fill="#00A884" />
    </svg>
  );
}
function ListIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4"
      viewBox="0 0 24 28"
      fill="none"
    >
      <path
        fill="#00A884"
        d="M14 23H0v2h14v-2Zm6.83 1 2.58 2.58L22 28l-4-4 4-4 1.42 1.41L20.83 24ZM14 13H0v2h14v-2Zm6.83 1 2.58 2.58L22 18l-4-4 4-4 1.42 1.41L20.83 14ZM14 3H0v2h14V3Zm6.83 1 2.58 2.58L22 8l-4-4 4-4 1.42 1.41L20.83 4Z"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 27 27"
      className="h-4 w-4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.69296 26.0232L11.0625 17.6417C11.8098 18.2404 12.6692 18.7143 13.6406 19.0636C14.6121 19.4128 15.6459 19.5874 16.7419 19.5874C19.457 19.5874 21.7546 18.6455 23.6348 16.7617C25.515 14.8778 26.4555 12.5769 26.4565 9.85892C26.4565 7.13993 25.516 4.83902 23.6348 2.95618C21.7536 1.07335 19.456 0.13143 16.7419 0.130432C14.0267 0.130432 11.7291 1.07235 9.84893 2.95618C7.96877 4.84002 7.02819 7.14093 7.0272 9.85892C7.0272 10.9565 7.20156 11.9917 7.55029 12.9646C7.89903 13.9374 8.3723 14.798 8.97013 15.5463L0.563201 23.9652C0.289198 24.2396 0.152196 24.5764 0.152196 24.9755C0.152196 25.3746 0.301654 25.7238 0.600567 26.0232C0.874571 26.2976 1.2233 26.4348 1.64676 26.4348C2.07022 26.4348 2.41895 26.2976 2.69296 26.0232ZM16.7419 16.594C14.8737 16.594 13.2854 15.939 11.9772 14.6289C10.669 13.3188 10.0153 11.7288 10.0163 9.85892C10.0163 7.98806 10.6704 6.39758 11.9787 5.08747C13.2869 3.77737 14.8747 3.12282 16.7419 3.12381C18.6101 3.12381 20.1983 3.77887 21.5065 5.08897C22.8148 6.39907 23.4684 7.98906 23.4674 9.85892C23.4674 11.7298 22.8133 13.3203 21.505 14.6304C20.1968 15.9405 18.6091 16.595 16.7419 16.594Z"
        fill="#8696A0"
      />
    </svg>
  );
}

export default function Navbar() {
  return (
    <header className="h-12 w-full bg-primary-500 flex items-center justify-between p-2">
      <nav className="flex gap-2 items-center">
        <div className="bg-brand-500 h-6 max-w-[6rem] inline-block">
          <img src={logo} className="w-full h-full p-1 object-fit" />
        </div>
        <button onClick={() => changeView("list")}>
          <ListIcon />
        </button>
        <button onClick={() => changeView("grid")}>
          <GridIcon />
        </button>
      </nav>
      <div>
        <SearchIcon />
      </div>
    </header>
  );
}
