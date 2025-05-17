import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "./Users.css";
import { ADMIN_PATHS } from "../../../../constant/constants";

export const Users = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [users, setUsers] = useState<any[]>([]); // you can create a proper type later
    const navigate = useNavigate();

    // Fetch users from backend
    useEffect(() => {
        fetch("http://localhost:3000/users")
            .then((res) => res.json())
            .then((data) => {
                console.log("Fetched users:", data);
                if (Array.isArray(data)) {
                    setUsers(data);
                } else if (Array.isArray(data.users)) {
                    setUsers(data.users);
                } else {
                    setUsers([]);
                }
            })
            .catch((error) => console.error("Error fetching users:", error));
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="user-management-container">
            <div className="user-management-header">
                <h1>User Management</h1>
                <div className="user-count">
                    <h2>All Users</h2>
                    <span className="user-count-number">{users.length}</span>
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
                    <button
                        className="add-user-button"
                        onClick={() => navigate(ADMIN_PATHS.ADD_USER.path)}
                    >
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
                    <div className="date-column">Email</div>
                    <div className="actions-column">Actions</div>
                </div>

                <div className="user-table-body">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="user-table-row">
                            <div className="checkbox-column">
                                <input type="checkbox" />
                            </div>
                            <div className="name-column">
                                <div className="user-avatar">
                                    <img src={user.avatar} alt="avatar" />
                                </div>
                                {user.username}
                            </div>
                            <div className="role-column">
                                {user.role === "admin" && <span className="role-badge admin">Admin</span>}
                                {user.role === "manager" && <span className="role-badge manager">Manager</span>}
                                {user.role === "user" && <span className="role-badge user">User</span>}
                            </div>
                            <div className="date-column">{user.email}</div>
                            <div className="actions-column">
                                <button
                                    className="edit-button"
                                    onClick={() =>
                                        navigate(ADMIN_PATHS.EDIT_USER.path.replace(":id", user.id))
                                    }
                                >
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
            </div>
        </div>
    );
};
