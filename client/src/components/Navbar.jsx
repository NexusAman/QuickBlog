import { useNavigate } from "react-router";
import { assets } from "../assets/assets.js";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32">
      <img
        src={assets.logo}
        alt="logo"
        className="w-32 sm:w-44 cursor-pointer"
        onClick={() => navigate("/")}
      />
      <button
        className="flex items-center gap-2 bg-primary rounded-full text-sm cursor-pointer text-white px-5 py-2.5"
        onClick={() => navigate("/admin")}
      >
        Admin Login
        <img src={assets.arrow} alt="arrow" className="w-3" />
      </button>
    </div>
  );
};

export default Navbar;
