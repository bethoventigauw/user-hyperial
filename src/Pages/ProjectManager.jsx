import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Project from "../Components/Project/Project";

function ProjectManager() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    axios.get('https://backend.hyperial.my.id/authen/proyekManager', {
      headers: {
        'Authorization': token
      }
    })
    .then(res => {
      setData(res.data);
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
        <div className="projectManagerPages">
          <Project />
        </div>
  );
}

export default ProjectManager;