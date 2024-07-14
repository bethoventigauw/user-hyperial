import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import './CSS/Signup.css';

function Signup() {
  const [values, setValues] = useState({
    Username: '',
    Email: '',
    Password: '',
    Role: '',
    // Additional vendor fields
    VendorName: '',
    Address: '',
    PhoneNumber: '',
    // Add more vendor fields as needed
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('http://localhost:5000/authen/register', values)
      .then(res => {
        if (res.status === 201) {
          alert("Signup successful!");
        } else {
          alert("Signup failed!");
        }
      })
      .catch(err => {
        console.error("Signup error:", err);
        alert("Signup failed!");
      });
  };

  return (
    <div className="wrapper">
      <div className="signup-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2 className="signup-title">Signup</h2>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="Username"
              value={values.Username}
              onChange={handleInput}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="Email"
              value={values.Email}
              onChange={handleInput}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="Password"
              value={values.Password}
              onChange={handleInput}
              required
            />
          </div>
          <div className="form-group">
            <label>Role</label>
            <select
              name="Role"
              value={values.Role}
              onChange={handleInput}
              required
            >
              <option value="" disabled>Select role</option>
              <option value="vendor">Vendor</option>
              <option value="ProjectManager">Project Manager</option>
            </select>
          </div>
          {/* Additional fields for vendor */}
          {values.Role === 'vendor' && (
            <>
              <div className="form-group">
                <label>Vendor Name</label>
                <input
                  type="text"
                  name="VendorName"
                  value={values.VendorName}
                  onChange={handleInput}
                  required={values.Role === 'vendor'}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="Address"
                  value={values.Address}
                  onChange={handleInput}
                  required={values.Role === 'vendor'}
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="PhoneNumber"
                  value={values.PhoneNumber}
                  onChange={handleInput}
                  required={values.Role === 'vendor'}
                />
              </div>
              {/* Add more fields for vendor as needed */}
            </>
          )}
          <button type="submit" className="signup-button">Signup</button>
        </form>
        <p className="login-link">
          Have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;