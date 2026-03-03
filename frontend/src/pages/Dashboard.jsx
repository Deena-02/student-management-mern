import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { LogOut, LayoutDashboard, Users, UserPlus, Moon, Sun, Settings } from 'lucide-react';
import StudentList from '../components/StudentList';
import './Dashboard.css';

const Dashboard = () => {
    const { logout, admin } = useContext(AuthContext);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [activeTab, setActiveTab] = useState('students');

    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar glass-panel">
                <div className="sidebar-header">
                    <div className="logo-icon bg-gradient">SM</div>
                    <h2>EduAdmin</h2>
                </div>

                <nav className="sidebar-nav">
                    <button
                        className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard size={20} />
                        <span>Overview</span>
                    </button>
                    <button
                        className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
                        onClick={() => setActiveTab('students')}
                    >
                        <Users size={20} />
                        <span>Students</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-profile">
                        <div className="avatar">{admin?.username?.charAt(0).toUpperCase()}</div>
                        <div className="admin-info">
                            <p className="admin-name">{admin?.username}</p>
                            <p className="admin-role">Administrator</p>
                        </div>
                    </div>
                    <button onClick={logout} className="btn-logout" title="Logout">
                        <LogOut size={20} />
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="topbar glass-panel">
                    <div className="topbar-left">
                        <h1 className="page-title">
                            {activeTab === 'dashboard' ? 'Dashboard Overview' : 'Student Management'}
                        </h1>
                    </div>
                    <div className="topbar-right">
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle"
                            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                    </div>
                </header>

                <div className="content-area animate-fade-in">
                    {activeTab === 'dashboard' && (
                        <div className="overview-tab">
                            <div className="stat-card glass-panel">
                                <div className="stat-icon">
                                    <Users size={24} color="var(--accent-primary)" />
                                </div>
                                <div className="stat-info">
                                    <h3>Total Students</h3>
                                    <p className="stat-value">Manage your roster</p>
                                </div>
                            </div>
                            {/* More stats can be added here */}
                        </div>
                    )}

                    {activeTab === 'students' && <StudentList />}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
