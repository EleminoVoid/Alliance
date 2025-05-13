import { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Rooms.css";

export const Rooms = () => {
  const [currentPage, setCurrentPage] = useState(1);

  // Mock data for rooms
  const rooms = [
    { id: 1, name: "First Floor - Backrooms", capacity: 15, location: "Building A" },
    { id: 2, name: "First Floor - Frontrooms", capacity: 20, location: "Building A" },
    { id: 3, name: "SCP - 173", capacity: 5, location: "Building B" },
    { id: 4, name: "Second? Room", capacity: 10, location: "Building C" },
    { id: 5, name: "Room", capacity: 8, location: "Building A" },
    { id: 6, name: "mooR", capacity: 12, location: "Building D" },
    { id: 7, name: "oRoM", capacity: 25, location: "Building B" },
    { id: 8, name: "mr", capacity: 6, location: "Building C" },
  ];

  return (
    <div className="room-management-container">
      <div className="room-management-header">
        <h1>Room Management</h1>
        <div className="room-count">
          <h2>All Rooms</h2>
          <span className="room-count-number">105</span>
        </div>
        <button className="add-room-button">
          <span>+</span> Add Room
        </button>
      </div>

      <div className="room-table">
        <div className="room-table-header">
          <div className="room-name-column">Room Name</div>
          <div className="capacity-column">Capacity</div>
          <div className="location-column">Location</div>
          <div className="actions-column">Actions</div>
        </div>

        <div className="room-table-body">
          {rooms.map((room) => (
            <div key={room.id} className="room-table-row">
              <div className="room-name-column">
                <div className="room-avatar"></div>
                {room.name}
              </div>
              <div className="capacity-column">{room.capacity}</div>
              <div className="location-column">{room.location}</div>
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
