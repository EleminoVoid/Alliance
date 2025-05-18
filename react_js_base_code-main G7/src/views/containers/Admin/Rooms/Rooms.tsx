import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { ADMIN_PATHS, ADMIN_SIDE_BAR_MENU } from "../../../../constant";
import "./Rooms.css";

export const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error("Error fetching rooms:", err));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredRooms = rooms.filter((room: any) =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditRoom = (roomId: string) => {
    navigate(ADMIN_PATHS.EDIT_ROOM.path.replace(":id", roomId));
  };

  const handleDeleteRoom = (roomId: string) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    fetch(`http://localhost:3000/rooms/${roomId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete room");
        setRooms((prev) => prev.filter((room: any) => room.id !== roomId));
      })
      .catch((err) => {
        alert("Error deleting room.");
        console.error(err);
      });
  };

  return (
    <div className="room-management-container">
      <div className="room-management-header">
        <h1>Room Management</h1>
        <div className="room-count">
          <h2>All Rooms</h2>
          <span className="room-count-number">{rooms.length}</span>
        </div>
        <div className="header-actions">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search room"
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
            <SearchIcon className="search-icon" />
          </div>
          <button
            className="add-room-button"
            onClick={() => navigate(ADMIN_PATHS.ADD_ROOM.path)}
          >
            <span>+</span> Add room
          </button>
        </div>
      </div>

      <div className="room-table">
        <div className="room-table-header">
          <div className="name-column">Name</div>
          <div className="amenities-column">Amenities</div>
          <div className="actions-column">Edit</div>
          <div className="actions-column">Delete</div>
        </div>

        <div className="room-table-body">
          {filteredRooms.map((room: any) => (
            <div key={room.id} className="room-table-row">
              <div className="name-column">{room.name}</div>
              <div className="amenities-column">
                {Array.isArray(room.amenities)
                ? room.amenities.join(", ")
                : room.amenities || "-"}
              </div>
              <div className="actions-column">
                <button
                  className="edit-button"
                  onClick={() => handleEditRoom(room.id)}
                >
                  <EditIcon style={{color: 'green'}} />
                </button>
              </div>
              <div className="actions-column">
                <button
                  className="delete-button"
                  onClick={() => handleDeleteRoom(room.id)}
                >
                  <DeleteIcon style={{color: 'red'}} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pagination">
        <button
          className={`pagination-button ${currentPage === 1 ? "active" : ""}`}
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>
        <button
          className={`pagination-button ${currentPage === 2 ? "active" : ""}`}
          onClick={() => setCurrentPage(2)}
        >
          2
        </button>
        <button
          className={`pagination-button ${currentPage === 3 ? "active" : ""}`}
          onClick={() => setCurrentPage(3)}
        >
          3
        </button>
      </div>
    </div>
  );
};
