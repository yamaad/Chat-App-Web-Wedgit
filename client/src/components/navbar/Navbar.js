import { Link } from "react-router-dom";
import { SlArrowRight } from "react-icons/sl";
import "./Navbar.css";

const Navbar = ({ path, page }) => {
  return (
    <header>
      <div className="navbar">
        <Link to={path}>
          <h1>
            <span>{page} </span>
            <SlArrowRight />
          </h1>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
