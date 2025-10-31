import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { getRooms, addRoom } from "../../../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const amenities = Object.entries(roomData.features)
      .filter(([_, checked]) => checked)
      .map(([feature]) => feature);

    try {
      const existingRooms = await getRooms();

      // Check for duplicate name
      if (existingRooms.some((room: any) => room.name?.toLowerCase() === roomData.name.trim().toLowerCase())) {
        setError("A room with this name already exists.");
        return;
      }

      // Convert image to base64 if uploaded
      let imageData = "https://via.placeholder.com/400x300?text=Room+Image";
      if (imageFile) {
        imageData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      const newRoom = {
        name: roomData.name.trim(),
        location: roomData.location,
        capacity: parseInt(roomData.capacity),
        image: imageData,
        amenities,
      };

      await addRoom(newRoom);
      toast.success("Room added successfully!");
      setTimeout(() => navigate(-1), 1500);
    } catch (err: any) {
      setError(err.message || "Error adding room");
      toast.error("Error adding room");
      console.error("Error adding room:", err);
    }
  }

  return (
    <div className="room-form-container">
      <ToastContainer />
      <h1>Add room</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="image">Room Image</label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img
                  src={imagePreview}
                  alt="Room preview"
                  style={{
                    width: '200px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '2px solid #ddd'
                  }}
                />
              </div>
            )}
          </div>

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
