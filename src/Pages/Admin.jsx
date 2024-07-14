import React from 'react';
import './CSS/Admin.css'
import AdminSidebar from '../Components/Admin-Content/AdminSidebar/AdminSidebar';
import AdminNavbar from '../Components/Admin-Content/AdminNavbar/AdminNavbar';

const Admin = () => {
  return (
    <div className='adminSidebar'>
      <AdminSidebar/>
      <div className='adminNavbar'>
        <AdminNavbar/>
        <div className='adminContent'>
          Welcome to Staff Pages!
        </div>
      </div>
    </div>
  );
}

export default Admin;
