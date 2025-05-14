import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../constant";
import "./ViewBooking.css";

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
  type: "One-time" | "Recurring";
  startDate: string;
  endDate?: string;
  recurringDays?: string;
  startTime: string;
  endTime: string;
  createdBy: User;
}

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    id: "booking-123",
    roomId: "room-101",
    roomName: "Room 1",
    roomFloor: "Second Floor",
    type: "Recurring",
    startDate: "2025-04-12",
    endDate: "2025-04-20",
    recurringDays: "MWF", // Monday, Wednesday, Friday
    startTime: "16:30",
    endTime: "17:30",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
  },
  {
    id: "booking-124",
    roomId: "room-102",
    roomName: "Conference Room A",
    roomFloor: "First Floor",
    type: "One-time",
    startDate: "2025-04-15",
    startTime: "10:00",
    endTime: "11:30",
    createdBy: {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
    },
  },
  {
    id: "booking-125",
    roomId: "room-103",
    roomName: "Room 3",
    roomFloor: "Third Floor",
    type: "Recurring",
    startDate: "2025-04-14",
    endDate: "2025-05-14",
    recurringDays: "TR", // Tuesday, Thursday
    startTime: "13:00",
    endTime: "14:00",
    createdBy: {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
    },
  },
];

export const ViewBookings: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("All Users");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setBookings(mockBookings);

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleEditBooking = (bookingId: string) => {
    navigate(PATHS.EDIT_BOOKING.path);
  };

  const handleAddUser = () => {
    alert("Add user functionality would be implemented here");
  };

  const formatDateRange = (booking: Booking) => {
    const startDate = new Date(booking.startDate);
    const formattedStart = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;

    if (booking.type === "One-time") {
      return formattedStart;
    }

    if (booking.endDate) {
      const endDate = new Date(booking.endDate);
      const formattedEnd = `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`;
      return `${formattedStart} - ${formattedEnd} ${booking.recurringDays}`;
    }

    return formattedStart;
  };

  const formatTimeRange = (startTime: string, endTime: string) => {
    const formatTime = (timeString: string) => {
      const [hours, minutes] = timeString.split(":");
      const hour = Number.parseInt(hours, 10);
      const period = hour >= 12 ? "PM" : "AM";
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      return `${displayHour}:${minutes} ${period}`;
    };

    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  return (
    <div className="view-bookings-container">
      <div className="view-bookings-header">
        <h1 className="view-bookings-title">Your Bookings</h1>
        <div className="view-bookings-filter">
          <button
            className={`filter-tab ${activeFilter === "All Users" ? "active" : ""}`}
            onClick={() => setActiveFilter("All Users")}
          >
            All Users
            <span className="filter-count">{bookings.length}</span>
          </button>
        </div>
      </div>

      {!isMobile ? (
        <div className="table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th className="table-header">Room</th>
                <th className="table-header">Type</th>
                <th className="table-header">Date/s</th>
                <th className="table-header">Time</th>
                <th className="table-header"></th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id} className="table-row">
                    <td className="table-cell">{`${booking.roomFloor} - ${booking.roomName}`}</td>
                    <td className="table-cell">{booking.type}</td>
                    <td className="table-cell">{formatDateRange(booking)}</td>
                    <td className="table-cell">{formatTimeRange(booking.startTime, booking.endTime)}</td>
                    <td className="table-cell">
                      <button
                        className="edit-button"
                        onClick={() => handleEditBooking(booking.id)}
                      >
                        Edit booking
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="table-cell no-bookings">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mobile-bookings">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} className="mobile-booking-card">
                <div className="mobile-booking-header">
                  <span>{`${booking.roomFloor} - ${booking.roomName}`}</span>
                </div>
                <div className="mobile-booking-details">
                  <div>
                    <span className="detail-label">Type</span>
                    <span className="detail-value">{booking.type}</span>
                  </div>
                  <div>
                    <span className="detail-label">Time</span>
                    <span className="detail-value">{formatTimeRange(booking.startTime, booking.endTime)}</span>
                  </div>
                  <div>
                    <span className="detail-label">Date/s</span>
                    <span className="detail-value">{formatDateRange(booking)}</span>
                  </div>
                </div>
                <button
                  className="edit-button"
                  onClick={() => handleEditBooking(booking.id)}
                >
                  Edit booking
                </button>
              </div>
            ))
          ) : (
            <div className="no-bookings">No bookings found</div>
          )}
        </div>
      )}
    </div>
  );
};


