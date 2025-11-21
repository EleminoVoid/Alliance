import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { USER_PATHS } from "../../../constant";
import { useNavigate } from "react-router-dom";
import "./ViewRooms.css";
import { getRooms } from "../../../api";

interface Room {
  id: string;
  name: string;
  floor: string;
  capacity: number;
  available: boolean;
  amenities: string[];
  description: string;
  image: string;
}

export const ViewRooms: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFloor, setActiveFloor] = useState("ground");
  const [rooms, setRooms] = useState<Room[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRooms()
      .then((data: any[]) => {
        console.log("Rooms data from API:", data);
        // Normalize the data to handle both PascalCase and camelCase
        const normalizedRooms = (data || []).map((room: any) => ({
          id: room.id || room.Id,
          name: room.name || room.Name || "",
          floor: (room.floor || room.Floor || "").toLowerCase(),
          capacity: room.capacity || room.Capacity || 0,
          available: room.available !== undefined ? room.available : room.Available !== undefined ? room.Available : true,
          amenities: room.amenities || room.Amenities || [],
          description: room.description || room.Description || "",
          image: room.image || room.Image || "https://via.placeholder.com/400x300?text=Room+Image"
        }));
        console.log("Normalized rooms:", normalizedRooms);
        setRooms(normalizedRooms);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        toast.error("Failed to load rooms");
      });
  }, []);

  const filteredRooms = rooms.filter(
    (room) =>
      room.floor === activeFloor &&
      (room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBookNow = (roomId: string) => {
    navigate(`/calendar/${roomId}`);
  };

  return (
    <div className="rooms-page-wrapper">
      <ToastContainer />
      <div className="rooms-page-header">
        <h1>Available Rooms</h1>
        <button
          className="rooms-book-button"
          onClick={() => (navigate(USER_PATHS.CALENDAR.path))}
        >
          Book a Room
        </button>
      </div>

      <div className="rooms-search-container">
        <div className="rooms-search-input">
          <input
            type="text"
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="rooms-tabs">
          {["ground", "mezzanine", "first"].map((floor) => (
            <button
              key={floor}
              className={`rooms-tabs-button ${activeFloor === floor ? "active" : ""}`}
              onClick={() => setActiveFloor(floor)}
            >
              {floor.charAt(0).toUpperCase() + floor.slice(1)} Floor
            </button>
          ))}
        </div>
      </div>

      <div className="rooms-grid">
        {filteredRooms.map((room) => (
          <div key={room.id} className="room-card">
            <img src={room.image} alt={room.name} className="room-image" />
            <div className="room-card-content">
              <div className="room-card-header">
                <div>
                  <h3>{room.name}</h3>
                  <p>Capacity: {room.capacity}</p>
                </div>
                <span
                  className={`room-badge ${room.available ? "available" : "booked"}`}
                >
                  {room.available ? "Available" : "Booked"}
                </span>
              </div>
              <div className="room-amenities">
                {room.amenities.map((amenity) => (
                  <span key={amenity} className="room-amenity">
                    {amenity}
                  </span>
                ))}
              </div>
              <button
                className="room-book-button"
                onClick={() => handleBookNow(room.id)}
                disabled={!room.available}
              >
                {room.available ? "Book Now" : "Unavailable"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
