import React from 'react'
import { Link } from 'react-router-dom'

function Navbar() {

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-dark ">
                <div className="container-fluid">
                    <Link className="navbar-brand text-white ps-5" to="/home"><i className="fa-solid fa-users-viewfinder me-2"></i> Face Recognition</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav pe-5">
                            <li className="nav-item">
                                <Link className="nav-link active text-white" aria-current="page" to="/home"><i className="fa-solid fa-house-chimney me-2"></i> Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link text-white" to='/' ><i className="fa-solid fa-door-open me-2"></i> Logout</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
