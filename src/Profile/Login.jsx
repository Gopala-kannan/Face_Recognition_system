import React, { useState } from 'react'
import './Profile.css'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import axios from 'axios'

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })


    function handleChange(e) {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/api/login/', {
                username: formData.username,
                password: formData.password
            });
            toast.success(res.data.message);
            setTimeout(() => {
                navigate('/home');
            }, 1000);
        } catch (err) {
            toast.error(err.response.data.message || "Login failed. Please try again.");
        }
        
    };

    return (
        <>
            <div className="container">
                <div className="form-container">
                    <div className="user">
                        <h1>User Login</h1> <i className="fa-solid fa-right-to-bracket"></i>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="username" placeholder='username' value={formData.username} onChange={handleChange} />
                        <input type="password" name="password" placeholder='password' value={formData.password} onChange={handleChange} />
                        <button type="submit">Login</button>
                    </form>
                    <ToastContainer position="top-center" autoClose={3000} />
                    <div className='register'>
                        <p>Don't have an account? <Link to='/' className='register'>Register</Link></p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login
