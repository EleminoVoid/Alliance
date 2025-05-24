import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import "./AddRoom.css"

export const AddRoom = () => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    name: "",
    location: "",
    capacity: "",
    features: {
      airCondition: false,
      projector: false,
      whiteboard: false,
      tv: false,
      speaker: false,
      wifi: false,
      powerOutlets: false,
      videoConferencing: false,
    },
  })
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRoomData({
      ...roomData,
      [name]: value,
    });
  }

  const handleFeatureToggle = (feature: string) => {
    setRoomData({
      ...roomData,
      features: {
        ...roomData.features,
        [feature]: !roomData.features[feature as keyof typeof roomData.features],
      },
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amenities = Object.entries(roomData.features)
      .filter(([_, checked]) => checked)
      .map(([feature]) => feature);

    try {
      const res = await fetch("http://localhost:3000/rooms");
      const existingRooms = await res.json();

      // Check for duplicate name
      if (existingRooms.some((room: any) => room.name.toLowerCase() === roomData.name.trim().toLowerCase())) {
        setError("A room with this name already exists.");
        return;
      }

      const newId = Date.now().toString(16);

      // Check for duplicate id
      if (existingRooms.some((room: any) => room.id === newId)) {
        setError("A room with this ID already exists. Please try again.");
        return;
      }

      const newRoom = {
        id: newId,
        name: roomData.name.trim(),
        location: roomData.location,
        capacity: roomData.capacity,
        amenities,
        features: roomData.features,
      };

      const response = await fetch("http://localhost:3000/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });

      if (!response.ok) throw new Error("Failed to add room");
    } catch (err: any) {
      setError(err.message || "Error adding room");
    }
  }

  return (
    <div className="room-form-container">
      <h1>Add room</h1>

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
              placeholder="Room Name 101"
              value={roomData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="location">Location</label>
              <select
                id="location"
                name="location"
                value={roomData.location}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Floor</option>
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
                placeholder="20"
                value={roomData.capacity}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="features-section">
            <label>Features</label>
            <div className="features-grid">
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="airCondition"
                  checked={roomData.features.airCondition}
                  onChange={() => handleFeatureToggle("airCondition")}
                />
                <label htmlFor="airCondition">Air Condition</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="speaker"
                  checked={roomData.features.speaker}
                  onChange={() => handleFeatureToggle("speaker")}
                />
                <label htmlFor="speaker">Speaker</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="projector"
                  checked={roomData.features.projector}
                  onChange={() => handleFeatureToggle("projector")}
                />
                <label htmlFor="projector">Projector</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="wifi"
                  checked={roomData.features.wifi}
                  onChange={() => handleFeatureToggle("wifi")}
                />
                <label htmlFor="wifi">WIFI</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="whiteboard"
                  checked={roomData.features.whiteboard}
                  onChange={() => handleFeatureToggle("whiteboard")}
                />
                <label htmlFor="whiteboard">White Board</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="powerOutlets"
                  checked={roomData.features.powerOutlets}
                  onChange={() => handleFeatureToggle("powerOutlets")}
                />
                <label htmlFor="powerOutlets">Power Outlets</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="tv"
                  checked={roomData.features.tv}
                  onChange={() => handleFeatureToggle("tv")}
                />
                <label htmlFor="tv">TV</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="videoConferencing"
                  checked={roomData.features.videoConferencing}
                  onChange={() => handleFeatureToggle("videoConferencing")}
                />
                <label htmlFor="videoConferencing">Video Conferencing Setup</label>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Submit
          </button>
          <button type="button" className="cancel-button" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
