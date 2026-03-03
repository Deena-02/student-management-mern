import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit2, Trash2, Plus, Search, X } from 'lucide-react';
import './StudentList.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        email: '',
        course: '',
        grade: '',
        status: 'Active'
    });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const { data } = await axios.get(`${API_URL}/students`);
            setStudents(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching students:', error);
            setLoading(false);
        }
    };

    const handleOpenModal = (student = null) => {
        setFormError('');
        if (student) {
            setCurrentStudent(student);
            setFormData({
                name: student.name,
                rollNumber: student.rollNumber,
                email: student.email,
                course: student.course,
                grade: student.grade,
                status: student.status
            });
        } else {
            setCurrentStudent(null);
            setFormData({
                name: '',
                rollNumber: '',
                email: '',
                course: '',
                grade: '',
                status: 'Active'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        try {
            if (currentStudent) {
                // Update
                const { data } = await axios.put(`${API_URL}/students/${currentStudent._id}`, formData);
                setStudents(students.map(s => s._id === currentStudent._id ? data : s));
            } else {
                // Create
                const { data } = await axios.post(`${API_URL}/students`, formData);
                setStudents([data, ...students]);
            }
            handleCloseModal();
        } catch (error) {
            setFormError(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                await axios.delete(`${API_URL}/students/${id}`);
                setStudents(students.filter(s => s._id !== id));
            } catch (error) {
                console.error('Error deleting student:', error);
                alert(error.response?.data?.message || 'Failed to delete student');
            }
        }
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loader" style={{ margin: '40px auto' }}></div>;

    return (
        <div className="student-list-container fade-in">
            <div className="student-actions glass-panel">
                <div className="search-bar">
                    <Search size={20} color="var(--text-secondary)" />
                    <input
                        type="text"
                        placeholder="Search students by name, roll number or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                    <Plus size={18} /> Add Student
                </button>
            </div>

            <div className="table-responsive glass-panel">
                <table className="student-table">
                    <thead>
                        <tr>
                            <th>Roll No.</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Course</th>
                            <th>Grade</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStudents.length > 0 ? (
                            filteredStudents.map((student) => (
                                <tr key={student._id} className="table-row">
                                    <td><span className="roll-badge">{student.rollNumber}</span></td>
                                    <td>
                                        <div className="student-name-col">
                                            <div className="avatar-sm">{student.name.charAt(0).toUpperCase()}</div>
                                            {student.name}
                                        </div>
                                    </td>
                                    <td>{student.email}</td>
                                    <td>{student.course}</td>
                                    <td>{student.grade}</td>
                                    <td>
                                        <span className={`status-badge status-${student.status.toLowerCase()}`}>
                                            {student.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-icon text-accent" onClick={() => handleOpenModal(student)} title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="btn-icon text-danger" onClick={() => handleDelete(student._id)} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="empty-state">
                                    No students found. Add a new student to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content glass-panel animate-fade-in">
                        <div className="modal-header">
                            <h2>{currentStudent ? 'Edit Student' : 'Add New Student'}</h2>
                            <button className="btn-close" onClick={handleCloseModal}>
                                <X size={20} />
                            </button>
                        </div>

                        {formError && <div className="error-message" style={{ marginBottom: '1rem' }}>{formError}</div>}

                        <form onSubmit={handleSubmit} className="student-form">
                            <div className="form-grid">
                                <div className="input-group">
                                    <label>Full Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                                </div>

                                <div className="input-group">
                                    <label>Roll Number</label>
                                    <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleInputChange} required />
                                </div>

                                <div className="input-group">
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required />
                                </div>

                                <div className="input-group">
                                    <label>Course / Program</label>
                                    <input type="text" name="course" value={formData.course} onChange={handleInputChange} required />
                                </div>

                                <div className="input-group">
                                    <label>Grade / Year</label>
                                    <input type="text" name="grade" value={formData.grade} onChange={handleInputChange} required />
                                </div>

                                <div className="input-group">
                                    <label>Status</label>
                                    <select name="status" value={formData.status} onChange={handleInputChange}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Graduated">Graduated</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline" onClick={handleCloseModal}>Cancel</button>
                                <button type="submit" className="btn btn-primary">
                                    {currentStudent ? 'Update Details' : 'Save Student'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentList;
