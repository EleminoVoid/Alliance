import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { ADMIN_PATHS, ADMIN_SIDE_BAR_MENU } from "../../../../constant";
import { getRooms, deleteRoom, getRoomAmenitiesList } from "../../../../api";
import { joinAmenityList } from '../../../../utils/format';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Rooms.css";

export const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomAmenities, setRoomAmenities] = useState<{ [key: string]: string[] }>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await getRooms();
      console.log("Rooms data from API:", data);
      setRooms(data);

      // Fetch amenities for each room
      const amenitiesMap: { [key: string]: string[] } = {};
      for (const room of data) {
        const roomId = room.id || room.Id;
        try {
          console.log(`Fetching amenities for room ${roomId}`);
          const amenities = await getRoomAmenitiesList(roomId);
          console.log(`Amenities for room ${roomId}:`, amenities);
          amenitiesMap[roomId] = amenities;
        } catch (err) {
          console.error(`Error fetching amenities for room ${roomId}:`, err);
          amenitiesMap[roomId] = [];
        }
      }
      console.log("Final amenitiesMap:", amenitiesMap);
      setRoomAmenities(amenitiesMap);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredRooms = rooms.filter((room: any) =>
    (room.name || room.Name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEditRoom = (roomId: string) => {
    navigate(ADMIN_PATHS.EDIT_ROOM.path.replace(":id", roomId));
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await deleteRoom(roomId);
      setRooms((prev) => prev.filter((room: any) => (room.id || room.Id) !== roomId));
      toast.success("Room deleted successfully!");
    } catch (err) {
      toast.error("Error deleting room.");
      console.error(err);
    }
  };

  return (
    <div className="room-management-container">
      <ToastContainer />
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
          <div className="number-column">No.</div>
          <div className="name-column">Name</div>
          <div className="amenities-column">Amenities</div>
          <div className="actions-column">Edit</div>
          <div className="actions-column">Delete</div>
        </div>

        <div className="room-table-body">
          {filteredRooms.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((room: any, idx: number) => {
            const roomId = room.id || room.Id;
            const roomName = room.name || room.Name;
            const amenities = roomAmenities[roomId] || [];
            const number = (currentPage - 1) * pageSize + idx + 1;
            console.log(`Displaying room ${roomId}, amenities:`, amenities);
            return (
              <div key={roomId} className="room-table-row">
                <div className="number-column">{number}</div>
                <div className="name-column">{roomName}</div>
                <div className="amenities-column">
                  {amenities && amenities.length > 0 ? joinAmenityList(amenities) : "-"}
                </div>
                <div className="actions-column">
                  <button
                    className="edit-button"
                    title="Edit room"
                    aria-label={`Edit room ${roomName}`}
                    onClick={() => handleEditRoom(roomId)}
                  >
                    <EditIcon />
                  </button>
                </div>
                <div className="actions-column">
                  <button
                    className="delete-button"
                    title="Delete room"
                    aria-label={`Delete room ${roomName}`}
                    onClick={() => handleDeleteRoom(roomId)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pagination">
        {Array.from({ length: Math.max(1, Math.ceil(filteredRooms.length / pageSize)) }, (_, i) => (
          <button
            key={i}
            className={`pagination-button ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};
