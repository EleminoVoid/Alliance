import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { getRooms, addRoom } from "../../../../api";
import { useAuth } from "../../../../contexts/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddRoom.css"
import { getErrorMessage } from "../../../../utils/error";

export const AddRoom = () => {
  const navigate = useNavigate();
  const [roomData, setRoomData] = useState({
    name: "",
    floor: "",
    capacity: "",
    description: "",
    available: true,
    amenities: [] as string[],
  })
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const auth = useAuth();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRoomData({
      ...roomData,
      [name]: value,
    });
  }

  const handleAmenityToggle = (amenity: string) => {
    setRoomData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
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
    setValidationErrors({});

    const trimmedName = roomData.name.trim();
    const numericCapacity = Number(roomData.capacity);

    const errors: Record<string, string> = {};

    if (!trimmedName) {
      errors.name = "Room Name is required.";
    }

    if (!roomData.floor) {
      errors.floor = "Location is required.";
    }

    if (!roomData.capacity) {
      errors.capacity = "Capacity is required.";
    } else if (Number.isNaN(numericCapacity) || numericCapacity <= 0) {
      errors.capacity = "Capacity must be a positive number.";
    }

    if (roomData.amenities.length === 0) {
      errors.amenities = "Select at least one amenity.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      const allErrors = Object.values(errors);
      allErrors.forEach((errMsg) => toast.error(errMsg));
      setError(allErrors[0]);
      return;
    }

    try {
      const existingRooms = await getRooms();

      // Check for duplicate name
      if (existingRooms.some((room: any) => room.name?.toLowerCase() === trimmedName.toLowerCase())) {
        const duplicateError = "A room with this name already exists.";
        setValidationErrors({ name: duplicateError });
        setError(duplicateError);
        toast.error(duplicateError);
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

  const currentUser = auth.user;

      const newRoom = {
        name: trimmedName,
        floor: roomData.floor,
        capacity: numericCapacity,
        description: roomData.description || "",
        image: imageData,
        available: true,
        amenities: roomData.amenities,
        createdBy: currentUser?.username || currentUser?.Username || "admin"
      };

      await addRoom(newRoom);
      toast.success("Room added successfully!");
      setTimeout(() => navigate(-1), 1500);
    } catch (err: any) {
      const msg = getErrorMessage(err, "Error adding room");
      setError(msg);
      toast.error(msg);
      console.error("Error adding room:", err);
    }
  }

  return (
    <div className="room-form-container">
      <ToastContainer />
      <h1>Add room</h1>

      <form onSubmit={handleSubmit} noValidate>
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
            <label htmlFor="name">
              Room Name <span className="required-indicator">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Room Name 101"
              value={roomData.name}
              onChange={handleInputChange}
              required
            />
            {validationErrors.name && (
              <p className="field-error">{validationErrors.name}</p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter room description"
              value={roomData.description}
              onChange={handleInputChange}
              rows={3}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="floor">
                Location <span className="required-indicator">*</span>
              </label>
              <select
                id="floor"
                name="floor"
                value={roomData.floor}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>Select Floor</option>
                <option value="ground">Ground Floor</option>
                <option value="mezzanine">Mezzanine Floor</option>
                <option value="first">First Floor</option>
              </select>
              {validationErrors.floor && (
                <p className="field-error">{validationErrors.floor}</p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="capacity">
                Capacity <span className="required-indicator">*</span>
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                placeholder="20"
                value={roomData.capacity}
                onChange={handleInputChange}
                required
                min={1}
              />
              {validationErrors.capacity && (
                <p className="field-error">{validationErrors.capacity}</p>
              )}
            </div>
          </div>

          <div className="features-section">
            <label>
              Amenities <span className="required-indicator">*</span>
            </label>
            <div className="features-grid">
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="airCondition"
                  checked={roomData.amenities.includes("airCondition")}
                  onChange={() => handleAmenityToggle("airCondition")}
                />
                <label htmlFor="airCondition">Air Condition</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="speaker"
                  checked={roomData.amenities.includes("speaker")}
                  onChange={() => handleAmenityToggle("speaker")}
                />
                <label htmlFor="speaker">Speaker</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="projector"
                  checked={roomData.amenities.includes("projector")}
                  onChange={() => handleAmenityToggle("projector")}
                />
                <label htmlFor="projector">Projector</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="wifi"
                  checked={roomData.amenities.includes("wifi")}
                  onChange={() => handleAmenityToggle("wifi")}
                />
                <label htmlFor="wifi">WIFI</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="whiteboard"
                  checked={roomData.amenities.includes("whiteboard")}
                  onChange={() => handleAmenityToggle("whiteboard")}
                />
                <label htmlFor="whiteboard">White Board</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="powerOutlets"
                  checked={roomData.amenities.includes("powerOutlets")}
                  onChange={() => handleAmenityToggle("powerOutlets")}
                />
                <label htmlFor="powerOutlets">Power Outlets</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="tv"
                  checked={roomData.amenities.includes("tv")}
                  onChange={() => handleAmenityToggle("tv")}
                />
                <label htmlFor="tv">TV</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="videoConferencing"
                  checked={roomData.amenities.includes("videoConferencing")}
                  onChange={() => handleAmenityToggle("videoConferencing")}
                />
                <label htmlFor="videoConferencing">Video Conferencing Setup</label>
              </div>
            </div>
            {validationErrors.amenities && (
              <p className="field-error">{validationErrors.amenities}</p>
            )}
          </div>
        </div>

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
