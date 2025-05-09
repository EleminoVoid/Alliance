// ViewRooms.tsx
import React, { useState } from "react";
import { PATHS } from "../../../constant";

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

const mockRooms: Room[] = [
  { id: "room-101", name: "Room 101", floor: "ground", capacity: 4, available: true, amenities: ["wifi", "monitor"], description: "Small meeting room", image: "/placeholder.svg" },
  { id: "room-102", name: "Room 102", floor: "ground", capacity: 6, available: false, amenities: ["wifi", "monitor", "coffee"], description: "Medium-sized meeting room", image: "/placeholder.svg" },
  { id: "conference-a", name: "Conference Room A", floor: "ground", capacity: 20, available: true, amenities: ["wifi", "video"], description: "Large conference room", image: "/placeholder.svg" },
  { id: "room-201", name: "Room 201", floor: "mezzanine", capacity: 8, available: true, amenities: ["wifi", "monitor"], description: "Medium-sized meeting room", image: "/placeholder.svg" },
  { id: "room-301", name: "Room 301", floor: "first", capacity: 10, available: true, amenities: ["wifi", "monitor", "video"], description: "Large meeting room", image: "/placeholder.svg" },
];

export const ViewRooms: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFloor, setActiveFloor] = useState("ground");

  const filteredRooms = mockRooms.filter(
    (room) =>
      room.floor === activeFloor &&
      (room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleBookNow = (roomId: string) => {
    // Use window.location to navigate
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