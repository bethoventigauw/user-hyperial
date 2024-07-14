import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './CSS/Vendor.css'

function Vendor() {
  const [vendorName, setVendorName] = useState("");
  const [data, setData] = useState(null); // Menambah state untuk menyimpan data dari server
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('http://localhost:5000/authen/vendor', {
      headers: {
        'Authorization': token
      }
    })
    .then(res => {
      setVendorName(res.data.VendorName);
      setData(res.data); // Menyimpan data dari server ke dalam state
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      localStorage.removeItem('token');
      navigate('/login');
    });
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
  <div>
    <div className="vendorSidebar">
      <div className="vendorNavbar">
        <div className="vendorPages">
          <h1>Welcome, {vendorName}</h1>
        </div>
      </div>
    </div>
  </div>
  );
}

export default Vendor;
