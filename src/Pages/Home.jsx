import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Jika tidak ada token, arahkan ke halaman login
      navigate('/login');
      return;
    }

    // Periksa token dan ambil data dari backend
    axios.get('https://backend.hyperial.my.id/authen/home', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      setData(res.data.user);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      // Jika token tidak valid, hapus dari localStorage dan arahkan ke login
      localStorage.removeItem('token');
      navigate('/login');
    });
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Home Page</h1>
      {/* Render data yang diterima dari backend */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Home;
