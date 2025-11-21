import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { getRoomById, updateRoom, getRoomAmenities } from "../../../../api";
import { useAuth } from "../../../../contexts/AuthContext";
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
  createdBy?: string;
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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const auth = useAuth();

  // Fetch this room's data
  useEffect(() => {
    if (!id) return;
    const loadRoom = async () => {
      try {
        const room: any = await getRoomById(id);
        console.log("Loaded room data:", room);

        setRoomData(room);
        setImagePreview(room.image || room.Image || "");

        // Fetch amenities from the amenities endpoint
        try {
          const amenitiesData = await getRoomAmenities(id);
          console.log("Amenities data from API:", amenitiesData);

          // Extract amenity names from the response
          let roomAmenities: string[] = [];
          if (Array.isArray(amenitiesData)) {
            // If it returns array of objects with Amenity property
            roomAmenities = amenitiesData.map((item: any) => item.Amenity || item.amenity).filter(Boolean);
          }
          console.log("Processing amenities:", roomAmenities);

          const state: Record<string, boolean> = {};
          AMENITIES_LIST.forEach((a) => {
            state[a.key] = roomAmenities.includes(a.key);
          });
          console.log("Amenities state:", state);
          setAmenitiesState(state);
        } catch (amenityErr) {
          console.error("Error loading amenities:", amenityErr);
          toast.error("Failed to load room amenities");
          // If amenities fetch fails, initialize all as unchecked
          const state: Record<string, boolean> = {};
          AMENITIES_LIST.forEach((a) => {
            state[a.key] = false;
          });
          setAmenitiesState(state);
        }
      } catch (err) {
        console.error("Error loading room:", err);
        toast.error("Failed to load room details");
      }
    };
    loadRoom();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!roomData) return;
    const { name, value } = e.target;
    setRoomData({ ...roomData, [name]: name === "capacity" ? Number(value) : value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

    // Convert new image to base64 if uploaded, otherwise keep existing
    let imageData = roomData.image;
    if (imageFile) {
      imageData = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(imageFile);
      });
    }

    const updatedRoom = {
      name: roomData.name.trim(),
      floor: roomData.floor,
      capacity: Number(roomData.capacity),
      description: roomData.description || "",
      image: imageData,
      available: roomData.available,
      amenities: AMENITIES_LIST.filter((a) => amenitiesState[a.key]).map((a) => a.key),
      createdBy: roomData.createdBy || auth.user?.username || auth.user?.Username || "admin"
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
              value={roomData.name}
              onChange={handleInputChange}
              required
            />
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
              <label htmlFor="floor">Floor</label>
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
