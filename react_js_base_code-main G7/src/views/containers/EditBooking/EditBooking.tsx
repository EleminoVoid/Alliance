import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../../constant";
import "./EditBooking.css";
import { getBookingById, getRooms, updateBooking } from "../../../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Booking {
  id: string;
  userId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  type: "single" | "recurring";
}

interface Room {
  id: string;
  name: string;
  amenities?: string[];
}

export const EditBooking: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    roomId: "",
    startDate: "",
    endDate: "",
    type: "single",
  });

  // Fetch booking by ID and rooms
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch rooms
        const roomsData = await getRooms();
        const normalizedRooms: Room[] = (roomsData || []).map((room: any) => ({
          id: room.id || room.Id,
          name: room.name || room.Name || "",
          amenities: room.amenities || room.Amenities || []
        }));
        setRooms(normalizedRooms);

        if (!id) {
          setError("No booking ID provided in the URL.");
          setLoading(false);
          return;
        }

        // Fetch booking by ID
        const data = await getBookingById(id);

        if (!data || Object.keys(data).length === 0) {
          setError("Booking not found");
          setLoading(false);
          return;
        }

        // Normalize booking data to handle PascalCase from C# backend
        const bookingData: Booking = {
          id: data.id || data.Id,
          userId: data.userId || data.UserId || "",
          roomId: data.roomId || data.RoomId || "",
          startDate: data.startDate || data.StartDate || "",
          endDate: data.endDate || data.EndDate || "",
          type: (data.type || data.Type || "single") as "single" | "recurring"
        };

        setBooking(bookingData);
        setForm({
          roomId: bookingData.roomId,
          startDate: bookingData.startDate ? bookingData.startDate.slice(0, 16) : "",
          endDate: bookingData.endDate ? bookingData.endDate.slice(0, 16) : "",
          type: bookingData.type,
        });
      } catch (err: any) {
        setError(err.message || "Error loading booking");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Get all unique amenities from rooms
  const getAllFeatures = (rooms: Room[]) => {
    const featureSet = new Set<string>();
    rooms.forEach((room) => {
      if (Array.isArray(room.amenities)) {
        room.amenities.forEach((f: string) => featureSet.add(f));
      }
    });
    return Array.from(featureSet);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!booking) return;

    // Ensure dates are in proper format with seconds
    const updatedBooking = {
      userId: booking.userId,
      roomId: form.roomId,
      startDate: form.startDate.includes(":") ? `${form.startDate}:00` : form.startDate,
      endDate: form.endDate.includes(":") ? `${form.endDate}:00` : form.endDate,
      type: form.type as "single" | "recurring",
    };

    console.log("Updating booking:", updatedBooking);

    try {
      const result = await updateBooking(booking.id, updatedBooking);
      console.log("Update result:", result);
      toast.success("Booking updated successfully!");
      setTimeout(() => {
        navigate(PATHS.BOOKINGS?.path || "/bookings");
      }, 1500);
    } catch (err: any) {
      console.error("Error updating booking:", err);
      toast.error(err.message || "Error updating booking. Please try again.");
      setError(err.message || "Error updating booking");
    }
  };

  if (loading)
    return (
      <div className="edit-booking-loading">
        <p>Loading booking details...</p>
      </div>
    );
  if (error) return <div className="edit-booking-error">{error}</div>;
  if (!booking) return null;

  return (
    <div className="edit-booking-container">
      <ToastContainer />
      <h1>Edit Booking</h1>
      <form className="edit-booking-form" onSubmit={handleSubmit}>
        <div>
          <label>Room:</label>
          <select
            name="roomId"
            value={form.roomId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a room
            </option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Start Date & Time:</label>
          <input
            type="datetime-local"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>End Date & Time:</label>
          <input
            type="datetime-local"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="single">Single</option>
            <option value="recurring">Recurring</option>
          </select>
        </div>
        <button type="submit">Save Changes</button>
        <button
          type="button"
          onClick={() => navigate(PATHS.BOOKINGS?.path || "/bookings")}
        >
          Cancel
        </button>
        {error && <div className="edit-booking-error">{error}</div>}
      </form>
    </div>
  );
};

export default EditBooking;
