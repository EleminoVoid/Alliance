import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATHS } from "../../../constant";
import "./EditBooking.css";

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
    fetch("http://localhost:3000/rooms")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch(() => setRooms([]));

    if (!id) {
      setError("No booking ID provided in the URL.");
      setLoading(false);
      return;
    }
    fetch(`http://localhost:3000/bookings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Booking not found");
        return res.json();
      })
      .then((data) => {
        // If the booking is not found, data will be empty or undefined
        if (!data || Object.keys(data).length === 0) {
          setError("Booking not found");
          setLoading(false);
          return;
        }
        let bookingData = data;
        const numericKeys = Object.keys(data).filter((k) => !isNaN(Number(k)));
        if (numericKeys.length > 0) {
          // Recurring booking: get all startDates and endDates
          const allStartDates = numericKeys
            .map((k) => data[k]?.startDate)
            .filter(Boolean)
            .sort();
          const allEndDates = numericKeys
            .map((k) => data[k]?.endDate)
            .filter(Boolean)
            .sort();
          bookingData = data[numericKeys[0]];
          if (!bookingData.id && data.id) bookingData.id = data.id;
          if (bookingData.type === "recurring" && allStartDates.length > 1) {
            bookingData.startDate = allStartDates[0];
            bookingData.endDate = allEndDates[allEndDates.length - 1];
          }
        } else if (data[0]) {
          bookingData = data[0];
        }
        setBooking(bookingData);
        setForm({
          roomId: bookingData.roomId,
          startDate: bookingData.startDate
            ? bookingData.startDate.slice(0, 16)
            : "",
          endDate: bookingData.endDate ? bookingData.endDate.slice(0, 16) : "",
          type: bookingData.type,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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

    const updatedBooking = {
      ...booking,
      roomId: form.roomId,
      startDate: form.startDate,
      endDate: form.endDate,
      type: form.type as "single" | "recurring",
    };

    try {
      const res = await fetch(`http://localhost:3000/bookings/${booking.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBooking),
      });
      if (!res.ok) throw new Error("Failed to update booking");
      alert("Booking updated successfully!");
      navigate(PATHS.BOOKINGS?.path || "/bookings");
    } catch (err: any) {
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
