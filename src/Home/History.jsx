import React, { useState, useEffect} from 'react'
import axios from 'axios';

function History() {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const { data } = await axios.get('http://localhost:8000/api/uploadhistory/');
                setHistory(data);
            } catch (error) {
                console.error('Error fetching history:', error);
            }
        };
        fetchHistory();
    }, []);

  return (
    <div>

        {history.length > 0 && (
    <section className="mt-5">
        <h2 className="text-dark mb-3">Upload History</h2>
        <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Uploaded Image</th>
                        <th>Result Image</th>
                        <th>Uploaded At</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>
                                <img
                                    src={`http://localhost:8000/${item.image}`}
                                    alt="Uploaded"
                                    className="img-thumbnail"
                                    style={{ width: '80px', height: 'auto' }}
                                />
                            </td>
                            <td>
                                
                                    <img
                                        src={`http://localhost:8000/${item.result_image}`}
                                        alt="Result"
                                        className="img-thumbnail"
                                        style={{ width: '80px', height: 'auto' }}
                                    />
                                
                            </td>
                            <td>{new Date(item.uploaded_at).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </section>
)}

    </div>
  )
}

export default History