import type React from "react";
import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "./Users.css";

export const Users = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");

    // Mock data for users
    const users = [
        { id: 1, name: "Name", role: "Admin", dateCreated: "2023-05-15" },
        { id: 2, name: "Name", role: "User", dateCreated: "2023-06-20" },
        { id: 3, name: "Name", role: "User", dateCreated: "2023-07-10" },
        { id: 4, name: "Name", role: "Manager", dateCreated: "2023-08-05" },
        { id: 5, name: "Name", role: "User", dateCreated: "2023-09-12" },
        { id: 6, name: "Name", role: "User", dateCreated: "2023-10-18" },
        { id: 7, name: "Name", role: "Admin", dateCreated: "2023-11-22" },
        { id: 8, name: "Name", role: "User", dateCreated: "2023-12-30" },
    ];

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="user-management-container">
            <div className="user-management-header">
                <h1>User Management</h1>
                <div className="user-count">
                    <h2>All Users</h2>
                    <span className="user-count-number">105</span>
                </div>
                <div className="header-actions">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search user"
                            value={searchQuery}
                            onChange={handleSearch}
                            className="search-input"
                        />
                        <SearchIcon className="search-icon" />
                    </div>
                    <button className="add-user-button">
                        <span>+</span> Add user
                    </button>
                </div>
            </div>

            <div className="user-table">
                <div className="user-table-header">
                    <div className="checkbox-column">
                        <input type="checkbox" />
                    </div>
                    <div className="name-column">Name</div>
                    <div className="role-column">Role / Access</div>
                    <div className="date-column">Date Created</div>
                    <div className="actions-column">Actions</div>
                </div>

                <div className="user-table-body">
                    {users.map((user) => (
                        <div key={user.id} className="user-table-row">
                            <div className="checkbox-column">
                                <input type="checkbox" />
                            </div>
                            <div className="name-column">
                                <div className="user-avatar"></div>
                                {user.name}
                            </div>
                            <div className="role-column">
                                {user.role === "Admin" && <span className="role-badge admin">{user.role}</span>}
                                {user.role === "Manager" && <span className="role-badge manager">{user.role}</span>}
                                {user.role === "User" && <span className="role-badge user">{user.role}</span>}
                            </div>
                            <div className="date-column">{user.dateCreated}</div>
                            <div className="actions-column">
                                <button className="edit-button">
                                    <EditIcon />
                                </button>
                                <button className="delete-button">
                                    <DeleteIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pagination">
                <button className={`pagination-button ${currentPage === 1 ? "active" : ""}`}>1</button>
                <button className={`pagination-button ${currentPage === 2 ? "active" : ""}`}>2</button>
                <button className={`pagination-button ${currentPage === 3 ? "active" : ""}`}>3</button>
                <button className={`pagination-button ${currentPage === 4 ? "active" : ""}`}>4</button>
                <button className={`pagination-button ${currentPage === 5 ? "active" : ""}`}>5</button>
            </div>
        </div>
    );
};
