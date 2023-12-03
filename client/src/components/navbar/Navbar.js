import { Link, useLocation } from "react-router-dom";
import { SlArrowRight } from "react-icons/sl";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  return (
    <header>
      <div className="navbar">
        <h1>
          <span>Pages</span>
        </h1>
        <Link to="/" className={location.pathname === "/" ? "active" : ""}>
          <h4>
            <span>setting page</span>
            <SlArrowRight />
          </h4>
        </Link>
        <Link
          to="/chat-interface"
          className={location.pathname === "/chat-interface" ? "active" : ""}
        >
          <h4>
            <span>agent interface</span>
            <SlArrowRight />
          </h4>
        </Link>
        <a href="https://chat-app-customer.web.app/" target="_blank">
          <h4>
            <span>customer chat widget</span>
            <SlArrowRight />
          </h4>
        </a>
      </div>
    </header>
  );
};

export default Navbar;
