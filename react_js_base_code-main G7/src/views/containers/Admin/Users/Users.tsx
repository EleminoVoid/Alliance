import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import "./Users.css";
import { ADMIN_PATHS } from "../../../../constant/constants";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUsers, deleteUser } from "../../../../api";
import type { User } from "../../../../types";

export const Users: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUsers()
      .then((data) => {
        console.log("Users data from API:", data);
        setUsers(data || []);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
        toast.error("Failed to load users");
      });
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const openDeleteModal = (id: string) => {
    setUserToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUser(userToDelete);
      setUsers((prev) => prev.filter((u: any) => (u.Id || u.id || u._id) !== userToDelete));
      toast.success("User deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    } finally {
      setShowModal(false);
      setUserToDelete(null);
    }
  };

  const filtered = users.filter((u) =>
    (u.Username || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-management-container">
      <ToastContainer />
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
          <div className="name-column">Name</div>
          <div className="role-column">Role / Access</div>
          <div className="date-column">Email</div>
          <div className="actions-column">Actions</div>
        </div>

        <div className="user-table-body">
          {filtered.map((user: any) => {
            console.log("Rendering user:", user);
            const username = user.Username || user.username || 'N/A';
            const email = user.Email || user.email || 'N/A';
            const role = user.Role || user.role || 'N/A';
            const userId = user.Id || user.id || user._id;

            return (
              <div key={userId} className="user-table-row">
                <div className="name-column">
                  {username}
                </div>

                <div className="role-column">
                  <span className={`role-badge ${role?.toLowerCase()}`}>{role}</span>
                </div>

                <div className="date-column">{email}</div>

                <div className="actions-column">
                  <button
                    className="edit-button"
                    onClick={() => navigate(ADMIN_PATHS.EDIT_USER.path.replace(":id", userId))}
                  >
                    <EditIcon style={{ color: "green" }} />
                  </button>

                  <button className="delete-button" onClick={() => openDeleteModal(userId)}>
                    <DeleteIcon style={{ color: "red" }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pagination">
        <button className={`pagination-button ${currentPage === 1 ? "active" : ""}`}>1</button>
        <button className={`pagination-button ${currentPage === 2 ? "active" : ""}`}>2</button>
        <button className={`pagination-button ${currentPage === 3 ? "active" : ""}`}>3</button>
      </div>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <p>Are you sure you want to delete this user?</p>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="modal-confirm">
                Delete
              </button>
              <button onClick={() => setShowModal(false)} className="modal-cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
