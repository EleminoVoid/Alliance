import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../constant";

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
    // In a real application, you would fetch the bookings data from an API
    // For this example, we'll use the mock data
    setBookings(mockBookings);

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const handleEditBooking = (bookingId: string) => {
    navigate(PATHS.EDIT_BOOKING.path);
  };

  const handleAddUser = () => {
    // In a real application, this would open a modal or navigate to add user page
    alert("Add user functionality would be implemented here");
  };

  // Format date range for display
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

  // Format time range for display
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
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Bookings</h1>
        <div style={styles.filterContainer}>
          <div style={styles.filterTabs}>
            <button
              style={{
                ...styles.filterTab,
                ...(activeFilter === "All Users" ? styles.activeFilterTab : {}),
              }}
              onClick={() => setActiveFilter("All Users")}
            >
              All Users
              <span style={styles.filterCount}>{bookings.length}</span>
            </button>
          </div>
        </div>
      </div>

      {!isMobile ? (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={{ ...styles.tableHeader, ...styles.tableHeaderFirst }}>Room</th>
                <th style={styles.tableHeader}>Type</th>
                <th style={styles.tableHeader}>Date/s</th>
                <th style={styles.tableHeader}>Time</th>
                <th style={{ ...styles.tableHeader, ...styles.tableHeaderLast }}></th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id} style={styles.tableRow}>
                    <td style={{ ...styles.tableCell, width: "25%" }}>
                      <div style={styles.roomCell}>
                        <div style={styles.roomIcon}></div>
                        <span>{`${booking.roomFloor} - ${booking.roomName}`}</span>
                      </div>
                    </td>
                    <td style={{ ...styles.tableCell, width: "15%" }}>{booking.type}</td>
                    <td style={{ ...styles.tableCell, width: "30%" }}>{formatDateRange(booking)}</td>
                    <td style={{ ...styles.tableCell, width: "15%" }}>
                      {formatTimeRange(booking.startTime, booking.endTime)}
                    </td>
                    <td style={{ ...styles.tableCell, width: "15%", textAlign: "right" }}>
                      <button
                        style={styles.editButton}
                        onClick={() => handleEditBooking(booking.id)}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c0392b")}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e74c3c")}
                      >
                        Edit booking
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ ...styles.tableCell, textAlign: "center" }}>
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        // Mobile view
        <div>
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <div key={booking.id} style={styles.mobileBookingCard}>
                <div style={styles.mobileBookingHeader}>
                  <div style={styles.mobileRoomName}>
                    <div style={styles.roomIcon}></div>
                    <span>{`${booking.roomFloor} - ${booking.roomName}`}</span>
                  </div>
                </div>
                <div style={styles.mobileBookingDetails}>
                  <div>
                    <div style={styles.mobileDetailLabel}>Type</div>
                    <div style={styles.mobileDetailValue}>{booking.type}</div>
                  </div>
                  <div>
                    <div style={styles.mobileDetailLabel}>Time</div>
                    <div style={styles.mobileDetailValue}>{formatTimeRange(booking.startTime, booking.endTime)}</div>
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <div style={styles.mobileDetailLabel}>Date/s</div>
                    <div style={styles.mobileDetailValue}>{formatDateRange(booking)}</div>
                  </div>
                </div>
                <div style={styles.mobileActions}>
                  <button
                    style={styles.editButton}
                    onClick={() => handleEditBooking(booking.id)}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c0392b")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#e74c3c")}
                  >
                    Edit booking
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>No bookings found</div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
    container: {
      padding: "20px",
      maxWidth: "1200px",
      margin: "0 auto",
      backgroundColor: "#eef7f8",
      minHeight: "calc(100vh - 60px)", // Assuming nav is 60px
      fontFamily: "Arial, sans-serif",
    },
    header: {
      marginBottom: "20px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#333",
      margin: "0 0 15px 0",
    },
    filterContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    filterTabs: {
      display: "flex",
      alignItems: "center",
    },
    filterTab: {
      padding: "8px 16px",
      backgroundColor: "#e0e0e0",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      marginRight: "10px",
      display: "flex",
      alignItems: "center",
    },
    activeFilterTab: {
      backgroundColor: "#5a6b81",
      color: "white",
    },
    filterCount: {
      display: "inline-block",
      backgroundColor: "#593F62",
      color: "white",
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      textAlign: "center",
      lineHeight: "20px",
      fontSize: "12px",
      marginLeft: "8px",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: "#56697F",
      padding: "12px 15px",
      textAlign: "left",
      fontSize: "14px",
      fontWeight: "bold",
      color: "white",
    },
    tableHeaderFirst: {
      borderTopLeftRadius: "8px",
    },
    tableHeaderLast: {
      borderTopRightRadius: "8px",
    },
    tableRow: {
      borderBottom: "1px solid #eee",
    },
    tableCell: {
      padding: "12px 15px",
      fontSize: "14px",
      color: "#333",
    },
    roomCell: {
      display: "flex",
      alignItems: "center",
    },
    roomIcon: {
      width: "24px",
      height: "24px",
      borderRadius: "50%",
      backgroundColor: "#e0e0e0",
      marginRight: "10px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    editButton: {
      padding: "6px 12px",
      backgroundColor: "#e74c3c",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "12px",
    },
    mobileBookingCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      padding: "15px",
      marginBottom: "15px",
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
    },
    mobileBookingHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    mobileRoomName: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#333",
      display: "flex",
      alignItems: "center",
    },
    mobileBookingDetails: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
      marginBottom: "10px",
    },
    mobileDetailLabel: {
      fontSize: "12px",
      color: "#666",
    },
    mobileDetailValue: {
      fontSize: "14px",
      color: "#333",
    },
    mobileActions: {
      display: "flex",
      justifyContent: "flex-end",
    },
    emptyState: {
      textAlign: "center",
      padding: "40px 0",
      color: "#666",
    },
  };


