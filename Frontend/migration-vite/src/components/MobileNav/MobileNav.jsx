import React from "react";
import MobileHome from "../../assets/mobileNavIcons/MobileHome.svg";

const MobileNav = () => {
  return (
    <nav className="bottom-nav">
      <button>
        <img src={MobileHome} alt="Home" width={24} height={24} />
      </button>
    </nav>
  );
};

export default MobileNav;
