// src/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import './Profile.css';
import axios from 'axios';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirm_password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            toast.danger("Passwords do not match");
            return;
        }
        try {
            const res = await axios.post('http://localhost:8000/api/register/', formData);
            toast.success(res.data.message);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (err) {
            toast.error(err.response.data.errors?.confirm_password || err.response.data.message);
        }
    };

    return (
        <div className="container">
            <div className="form-container">
                <div className="user">
                    <h1>User Register</h1> <i className="fa-solid fa-user-plus"></i>
                </div>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                    <input type="password" name="confirm_password" placeholder="Confirm Password" onChange={handleChange} required />
                    <button type="submit">Register</button>
                </form>
                <ToastContainer position="top-center" autoClose={3000} />
                <div className='login'>
                    <p>Already have an account? <Link to='/login' className='login'>Login</Link></p>
                </div>
            </div>
        </div>
    );
}

export default Register;

