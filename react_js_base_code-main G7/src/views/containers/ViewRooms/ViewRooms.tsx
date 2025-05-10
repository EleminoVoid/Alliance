import React, { useEffect, useState } from "react";
import axios from "axios";
import { PATHS } from "../../../constant";
import "./ViewRooms.css";

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

  useEffect(() => {
    axios.get("http://localhost:3001/rooms").then((response) => {
      setRooms(response.data);
    });
  }, []);

  const filteredRooms = rooms.filter(
    (room) =>
      room.floor === activeFloor &&
      (room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBookNow = (roomId: string) => {
    window.location.href = `${PATHS.CALENDAR.path}?room=${roomId}`;
  };

  return (
    <div className="rooms-page-wrapper">
      <div className="rooms-page-header">
        <h1>Available Rooms</h1>
        <button
          className="rooms-book-button"
          onClick={() => (window.location.href = PATHS.CALENDAR.path)}
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
              className={`rooms-tabs-button ${
                activeFloor === floor ? "active" : ""
              }`}
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
                  className={`room-badge ${
                    room.available ? "available" : "booked"
                  }`}
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

export default ViewRooms;
