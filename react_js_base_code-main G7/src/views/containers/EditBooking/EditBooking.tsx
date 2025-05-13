import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../constant";
import "./EditBooking.css";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  roomFloor: string;
  roomCapacity: number;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
  recurringDays?: string[];
  createdBy: User;
  purpose: string;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
}

// Mock data for demonstration
const mockBooking: Booking = {
  id: "booking-123",
  roomId: "room-101",
  roomName: "Room 1",
  roomFloor: "Second Floor",
  roomCapacity: 8,
  startDate: "2025-04-12",
  endDate: "2025-04-20",
  startTime: "16:30",
  endTime: "17:30",
  isRecurring: true,
  recurringDays: ["Monday", "Wednesday", "Friday"],
  createdBy: {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@example.com",
  },
  purpose: "Weekly Team Meeting",
  status: "confirmed",
  createdAt: "2025-04-01T10:30:00Z",
};

export const EditBooking: React.FC = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setBooking(mockBooking);

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleEditBooking = () => {
    navigate(`/edit-booking/${booking?.id}`);
  };

  const handleCancelBooking = () => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      alert("Booking cancelled successfully");
      navigate("/bookings");
    }
  };

  const handleBackToBookings = () => {
    navigate("/bookings");
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(Number.parseInt(hours, 10));
    date.setMinutes(Number.parseInt(minutes, 10));
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  };

  if (!booking) {
    return (
      <div className="edit-booking-loading">
        <p>Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="edit-booking-container">
      <div className="edit-booking-header">
        <h1 className="edit-booking-title">Booking Details</h1>
        <div className="edit-booking-buttonGroup">
          <button className="edit-booking-backButton" onClick={handleBackToBookings}>
            Back to Bookings
          </button>
          <button className="edit-booking-editButton" onClick={handleEditBooking}>
            Edit Booking
          </button>
          <button className="edit-booking-cancelButton" onClick={handleCancelBooking}>
            Cancel Booking
          </button>
        </div>
      </div>

      <div className="edit-booking-card">
        <div className="edit-booking-header">
          <h2 className="edit-booking-purpose">
            {booking.purpose}
            <span className={`edit-booking-status ${booking.status}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </h2>
        </div>

        <div className="edit-booking-content">
          <div className="edit-booking-section">
            <h3 className="edit-booking-sectionTitle">Room Information</h3>
            <div className="edit-booking-infoGrid">
              <div className="edit-booking-infoItem">
                <div className="edit-booking-infoLabel">Room Name</div>
                <div className="edit-booking-infoValue">{booking.roomName}</div>
              </div>
              <div className="edit-booking-infoItem">
                <div className="edit-booking-infoLabel">Floor</div>
                <div className="edit-booking-infoValue">{booking.roomFloor}</div>
              </div>
              <div className="edit-booking-infoItem">
                <div className="edit-booking-infoLabel">Capacity</div>
                <div className="edit-booking-infoValue">{booking.roomCapacity} people</div>
              </div>
            </div>
          </div>

          <div className="edit-booking-section">
            <h3 className="edit-booking-sectionTitle">Booking Schedule</h3>
            <div className="edit-booking-infoGrid">
              <div className="edit-booking-infoItem">
                <div className="edit-booking-infoLabel">Start Date</div>
                <div className="edit-booking-infoValue">{formatDate(booking.startDate)}</div>
              </div>
              {booking.isRecurring && (
                <div className="edit-booking-infoItem">
                  <div className="edit-booking-infoLabel">End Date</div>
                  <div className="edit-booking-infoValue">{formatDate(booking.endDate)}</div>
                </div>
              )}
              <div className="edit-booking-infoItem">
                <div className="edit-booking-infoLabel">Time</div>
                <div className="edit-booking-infoValue">
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </div>
              </div>
              <div className="edit-booking-infoItem">
                <div className="edit-booking-infoLabel">Booking Type</div>
                <div className="edit-booking-infoValue">{booking.isRecurring ? "Recurring" : "One-time"}</div>
              </div>
            </div>

            {booking.isRecurring && (
              <div className="edit-booking-recurringInfo">
                <div className="edit-booking-recurringPattern">Recurring Pattern:</div>
                <div className="edit-booking-recurringDays">
                  {booking.recurringDays?.map((day) => (
                    <span key={day} className="edit-booking-dayTag">
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="edit-booking-section">
            <h3 className="edit-booking-sectionTitle">Additional Information</h3>
            <div className="edit-booking-infoGrid">
              <div className="edit-booking-infoItem">
                <div className="edit-booking-infoLabel">Created By</div>
                <div className="edit-booking-infoValue">{booking.createdBy.name}</div>
              </div>
              <div className="edit-booking-infoItem">
                <div className="edit-booking-infoLabel">Created On</div>
                <div className="edit-booking-infoValue">
                  {new Date(booking.createdAt).toLocaleDateString()} at{" "}
                  {new Date(booking.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div className="edit-booking-infoItem edit-booking-purposeItem">
                <div className="edit-booking-infoLabel">Purpose</div>
                <div className="edit-booking-infoValue">{booking.purpose}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBooking;
