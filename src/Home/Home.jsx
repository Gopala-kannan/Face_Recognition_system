import React, { useState } from 'react';
import Navbar from './Navbar';
import './Home.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import History from './History';

function Home() {
    const [name, setName] = useState('');
    const [faceImage, setFaceImage] = useState('');
    const [preview, setPreview] = useState('');
    const [upload, setUpload] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFaceImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !faceImage) {
            alert("Please enter name and upload a face image.");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', faceImage);

        try {
            const {data} = await axios.post('http://localhost:8000/api/facerecognition/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setUpload({
                name: data.name,
                image_url: `http://localhost:8000/${data.image_url}`,
                result_image: `http://localhost:8000${data.result_image}`,
                faceLocations: data.face_locations,
                message: data.message,
            });

            toast.success("Face processed successfully!");
            setName('');
            setFaceImage('');
            setPreview('');
        } catch (error) {
            toast.error("Face recognition failed.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="container d-block py-5">
                <h2 className="text-center mb-4 fw-bold">Face Recognition System</h2>
                <p className="text-center text-muted mb-5">Upload an image to detect and recognize faces</p>

                <section className="mb-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8 col-lg-6">
                            <form className="bg-white p-4 rounded shadow-sm" onSubmit={handleSubmit}>
                                <div className="mb-3 text-start">
                                    <label htmlFor="name" className="form-label">
                                        Name <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="mb-3 text-start">
                                    <label htmlFor="face" className="form-label">
                                        Face Image <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="face"
                                        className="form-control"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        required
                                    />
                                </div>

                                {preview && (
                                    <div className="mb-3 text-center">
                                        <img src={preview} alt="Preview" className="img-fluid rounded" style={{ maxWidth: '260px' }} />
                                    </div>
                                )}

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-dark">Submit</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </section>

                {upload && (
                    <section className="mt-5">
                        <h4 className="text-success mb-3">Face Detection / Recognition</h4>
                        <div className="bg-light p-4 rounded shadow-sm text-start">

                            {upload.result_image && (
                                <div className="mb-3">
                                    <p><strong>Image URL:</strong> {upload.image_url}</p>
                                    <img
                                        src={upload.result_image}
                                        alt="Detected Result"
                                        className="img-fluid rounded mb-3"
                                        style={{ maxWidth: '260px' }}
                                    />
                                </div>
                            )}

                            <p><strong>Name:</strong> {upload.name}</p>

                            {upload.faceLocations?.length > 0 ? (
                                <>
                                    <strong>Face Locations:</strong>
                                    <ul>
                                        {upload.faceLocations.map(([top, right, bottom, left], index) => (
                                            <li key={index}>
                                                Top: {top}, Right: {right}, Bottom: {bottom}, Left: {left}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <p className="text-danger">No faces found in the image.</p>
                            )}

                            <p className="text-success"><strong>{upload.message}</strong></p>
                        </div>
                    </section>
                )}
                <ToastContainer position="top-center" autoClose={3000} />
                <History />
            </div>
        </>
    );
}

export default Home;
