import React, { useState } from 'react';
import './Sidebar.css';
import { AiOutlineDashboard, AiOutlineUser, AiOutlineShopping, AiOutlineFundProjectionScreen } from "react-icons/ai";
import { FaListCheck } from "react-icons/fa6";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../Assets/hyperial_logo_only.png';
import toggleLogo from '../../Assets/hyperial_logo_only.png';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const vendorId = localStorage.getItem('vendorId');
  const role = localStorage.getItem('role');
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  // Kondisi untuk menentukan apakah sidebar perlu ditampilkan
  const shouldDisplaySidebar = location.pathname !== '/login';

  if (!shouldDisplaySidebar) {
    return null;
  }

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="container">
      <div style={{ width: isOpen ? "250px" : "80px" }} className="Sidebar">
        <div className="top_section">
          <div className="sidebarHeader" onClick={toggle}>
            <img src={logo} alt="Hyperial Logo" className="logo" style={{ display: isOpen ? "block" : "none" }} />
            <div className="title" style={{ display: isOpen ? "block" : "none" }}>
              Hyperial
            </div>
            <div className="bars" onClick={toggle}>
              {!isOpen && <img src={toggleLogo} alt="Toggle Logo" className="toggleLogo" />}
            </div>
          </div>
        </div>
        <div className="sidebarItems">
          {vendorId && (
            <Link to={`/dashboard/${vendorId}`} style={{ textDecoration: "none" }}>
              <div
                className={`sidebarItem ${location.pathname === `/dashboard/${vendorId}` ? 'active' : ''}`}
                onClick={() => handleItemClick('dashboard')}
              >
                <AiOutlineDashboard className="icon" />
                <span style={{ display: isOpen ? "block" : "none" }}>Dashboard</span>
              </div>
            </Link>
          )}
          {vendorId && (
            <Link to={`/profiles/${vendorId}`} style={{ textDecoration: "none" }}>
              <div
                className={`sidebarItem ${location.pathname === `/profiles/${vendorId}` ? 'active' : ''}`}
                onClick={() => handleItemClick('profiles')}
              >
                <AiOutlineUser className="icon" />
                <span style={{ display: isOpen ? "block" : "none" }}>Profile</span>
              </div>
            </Link>
          )}
          {vendorId && (
            <Link to={`/material/${vendorId}`} style={{ textDecoration: "none" }}>
              <div
                className={`sidebarItem ${location.pathname === `/material/${vendorId}` ? 'active' : ''}`}
                onClick={() => handleItemClick('material')}
              >
                <AiOutlineShopping className="icon" />
                <span style={{ display: isOpen ? "block" : "none" }}>Material</span>
              </div>
            </Link>
          )}
          {role === 'ProjectManager' && (
            <Link to={`/projectList`} style={{ textDecoration: "none" }}>
              <div
                className={`sidebarItem ${location.pathname === `/projectList` ? 'active' : ''}`}
                onClick={() => handleItemClick('projectList')}
              >
                <FaListCheck className="icon" />
                <span style={{ display: isOpen ? "block" : "none" }}>Project List</span>
              </div>
            </Link>
          )}
          {role === 'ProjectManager' && (
            <Link to={`/projectManager/createProject`} style={{ textDecoration: "none" }}>
              <div
                className={`sidebarItem ${location.pathname === `/projectManager/createProject` ? 'active' : ''}`}
                onClick={() => handleItemClick('createProject')}
              >
                <AiOutlineFundProjectionScreen className="icon" />
                <span style={{ display: isOpen ? "block" : "none" }}>Project</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
