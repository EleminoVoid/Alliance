import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import "./EditRoom.css";

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

// Use the same static list as AddRoom
const AMENITIES_LIST = [
  { key: "airCondition", label: "Air Condition" },
  { key: "speaker", label: "Speaker" },
  { key: "projector", label: "Projector" },
  { key: "wifi", label: "WIFI" },
  { key: "whiteboard", label: "White Board" },
  { key: "powerOutlets", label: "Power Outlets" },
  { key: "tv", label: "TV" },
  { key: "videoConferencing", label: "Video Conferencing Setup" },
];

export const EditRoom: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState<Room | null>(null);
  const [amenitiesState, setAmenitiesState] = useState<Record<string, boolean>>({});

  // Fetch this room's data
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/rooms/${id}`)
      .then((res) => res.json())
      .then((room: Room) => {
        setRoomData(room);
        // Set amenities state for checkboxes
        const state: Record<string, boolean> = {};
        AMENITIES_LIST.forEach((a) => {
          state[a.key] = room.amenities?.includes(a.key) ?? false;
        });
        setAmenitiesState(state);
      });
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!roomData) return;
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: name === "capacity" ? Number(value) : value });
  };

  const handleAmenityToggle = (amenity: string) => {
    setAmenitiesState((prev) => ({
      ...prev,
      [amenity]: !prev[amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomData) return;
    const updatedRoom = {
      ...roomData,
      amenities: AMENITIES_LIST.filter((a) => amenitiesState[a.key]).map((a) => a.key),
    };
    try {
      const res = await fetch(`http://localhost:3000/rooms/${roomData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRoom),
      });
      if (!res.ok) throw new Error("Failed to update room");
      alert("Room updated successfully!");
      navigate(-1);
    } catch (err) {
      alert("Error updating room");
    }
  };

  if (!roomData) return <div>Loading...</div>;

  return (
    <div className="room-form-container">
      <h1>Edit room</h1>
      <form onSubmit={handleSubmit}>
        <div className="avatar-section">
          <div className="room-avatar">
            <EditIcon />
          </div>
        </div>
        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="name">Room Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={roomData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="floor">Location</label>
              <select
                id="floor"
                name="floor"
                value={roomData.floor}
                onChange={handleInputChange}
                required
              >
                <option value="ground">Ground Floor</option>
                <option value="mezzanine">Mezzanine Floor</option>
                <option value="first">First Floor</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="capacity">Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={roomData.capacity}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="features-section">
            <label>Amenities</label>
            <div className="features-grid">
              {AMENITIES_LIST.map((amenity) => (
                <div className="feature-item" key={amenity.key}>
                  <input
                    type="checkbox"
                    id={amenity.key}
                    checked={!!amenitiesState[amenity.key]}
                    onChange={() => handleAmenityToggle(amenity.key)}
                  />
                  <label htmlFor={amenity.key}>{amenity.label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-button">
            Save
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
