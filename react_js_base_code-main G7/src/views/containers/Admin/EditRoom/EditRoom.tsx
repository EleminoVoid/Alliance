import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { getRoomById, updateRoom } from "../../../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    const loadRoom = async () => {
      try {
        const room: Room = await getRoomById(id);
        setRoomData(room);
        const state: Record<string, boolean> = {};
        AMENITIES_LIST.forEach((a) => {
          state[a.key] = room.amenities?.includes(a.key) ?? false;
        });
        setAmenitiesState(state);
      } catch (err) {
        console.error("Error loading room:", err);
      }
    };
    loadRoom();
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
      name: roomData.name,
      location: roomData.floor,
      capacity: Number(roomData.capacity),
      amenities: AMENITIES_LIST.filter((a) => amenitiesState[a.key]).map((a) => a.key),
      description: roomData.description,
      available: roomData.available,
    };
    try {
      await updateRoom(roomData.id, updatedRoom);
      toast.success("Room updated successfully!");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      toast.error("Error updating room");
      console.error("Update error:", err);
    }
  };

  if (!roomData) return <div>Loading...</div>;

  return (
    <div className="room-form-container">
      <ToastContainer />
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
