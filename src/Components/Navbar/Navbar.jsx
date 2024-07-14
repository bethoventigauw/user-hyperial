import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from "axios";
import { Modal } from 'antd';
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Kondisi untuk menentukan apakah navbar perlu ditampilkan
  const shouldDisplayNavbar = location.pathname !== '/login';

  if (!shouldDisplayNavbar) {
    return null;
  }

  const showLogoutConfirm = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    axios.get('http://localhost:5000/logout')
      .then(res => {
        if (res.data === "success") {
          localStorage.removeItem('token');
          localStorage.removeItem('vendorId');
          navigate('/login', { replace: true });
        }
      })
      .catch(err => console.log(err));
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="navbar">
      <div className="navbarContainer">
        <div className="items">
          <div className="item">
            <HomeIcon className="icon" />
          </div>
        </div>
        <div className="logout" onClick={showLogoutConfirm}>
          <LogoutIcon className="icon logoutIcon" />
        </div>
      </div>
      <Modal
        title="Confirm Logout"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        cancelText="No"
      >
        <p>Are you sure you want to log out?</p>
      </Modal>
    </div>
  );
};

export default Navbar;
