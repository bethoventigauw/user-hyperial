import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { notification } from "antd";
import './CSS/Login.css';

function Login() {
  const [values, setValues] = useState({
    Email: '',
    Password: '',
  });
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(values); // Log values to ensure data is sent

    axios.post('http://localhost:5000/authen/login', values)
      .then(res => {
        console.log(res.data); // Log server response
        if (res.data.valid) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('role', res.data.role); // Save user role

          if (res.data.role === 'vendor') {
            localStorage.setItem('vendorId', res.data.vendorId); // Save Vendor ID
            navigate('/vendor');
          } else if (res.data.role === 'ProjectManager') {
            navigate('/projectManager');
          } else {
            navigate('/');
          }

          notification.success({
            message: 'Login Successful',
            description: 'Welcome back!',
          });
        } else {
          notification.error({
            message: 'Login Failed',
            description: 'Invalid credentials. Please try again.',
          });
        }
      })
      .catch(err => {
        console.log(err);
        notification.error({
          message: 'Login Error',
          description: 'Input a valid email and password!',
        });
      });
  };

  return (
    <div className="wrapper">
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-title">Login</h2>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="Email"
              placeholder="Enter your email"
              value={values.Email}
              onChange={handleInput}
              required
            />
            <FaUser className="icon"/>

          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="Password"
              placeholder="Enter your password"
              value={values.Password}
              onChange={handleInput}
              required
            />
            <FaLock className="icon"/>

          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="signup-link">
         <Link to="https://hyperial.my.id">Back to Landing Page</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
