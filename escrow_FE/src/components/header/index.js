import React from "react";
import { Link } from "react-router-dom";
import styles from "./header.module.css";
import { FiHelpCircle } from "react-icons/fi";

const Header = () => {
  const {
    app_header,
    left_header_link,
    logo_image,
    logo_text,
    right_header,
    right_header_link,
  } = styles;
  return (
    <header className={app_header}>
      <aside>
        <Link to='/' className={left_header_link}>
          <div className='logo'>
            <img
              src='/assets/icons/header-icon.svg'
              alt='logo'
              className={logo_image}
            />
          </div>
          <div className={logo_text}>Escro</div>
        </Link>
      </aside>
      <aside className={right_header}>
        <Link to='/help' className={right_header_link}>
          <div>
            <FiHelpCircle color='#032f76' />
          </div>
        </Link>
      </aside>
    </header>
  );
};

export default Header;
