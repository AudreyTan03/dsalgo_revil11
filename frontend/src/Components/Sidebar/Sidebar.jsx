import React, { useState } from "react";
import "./Sidebar.css";
import Logo from "./../imgs/logo.png";
import { UilSignOutAlt } from "@iconscout/react-unicons";
import { SidebarData } from "./../Data/Data";
import { UilBars } from "@iconscout/react-unicons";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(true);

  const toggleSidebar = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };
  
  const sidebarVariants = {
    true: {
      left: '0%'
    },
    false: {
      left: '-60%'
    }
  };

  return (
    <>
      <div
        className="bars"
        style={expanded ? { left: '8.5%' } : { right: 'auto' }}
        onClick={toggleSidebar}
      >
        <UilBars />
      </div>
      <motion.div
  className="sidebar"
  variants={sidebarVariants}
  animate={expanded ? "true" : "false"}
>
        {/* logo */}
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span>Revil</span>
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => (
            <div
              className={selected === index ? "menuItem active" : "menuItem"}
              key={index}
              onClick={() => setSelected(index)}
            >
              <item.icon />
              <span>{item.heading}</span>
            </div>
          ))}
          {/* signoutIcon */}
          <div className="menuItem">
            <UilSignOutAlt />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;
