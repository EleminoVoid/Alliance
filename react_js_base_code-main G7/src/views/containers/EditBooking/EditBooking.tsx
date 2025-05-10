import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PATHS } from "../../../constant"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface Booking {
  id: string
  roomId: string
  roomName: string
  roomFloor: string
  roomCapacity: number
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  isRecurring: boolean
  recurringDays?: string[]
  createdBy: User
  attendees: User[]
  purpose: string
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
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
    avatar: "/placeholder.svg?height=40&width=40",
  },
  attendees: [
    {
      id: "user-1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ],
  purpose: "Weekly Team Meeting",
  status: "confirmed",
  createdAt: "2025-04-01T10:30:00Z",
}

export const EditBooking: React.FC = () => {
  const navigate = useNavigate()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // In a real application, you would fetch the booking data based on the ID from the URL
    // For this example, we'll use the mock data
    setBooking(mockBooking)

    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  const handleEditBooking = () => {
    // Navigate to edit booking page
    navigate(`/edit-booking/${booking?.id}`)
  }

  const handleCancelBooking = () => {
    // In a real application, you would call an API to cancel the booking
    if (confirm("Are you sure you want to cancel this booking?")) {
      alert("Booking cancelled successfully")
      navigate("/bookings")
    }
  }

  const handleBackToBookings = () => {
    navigate("/bookings")
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":")
    const date = new Date()
    date.setHours(Number.parseInt(hours, 10))
    date.setMinutes(Number.parseInt(minutes, 10))
    return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  }

  if (!booking) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#eef7f8",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p>Loading booking details...</p>
      </div>
    )
  }

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
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "10px" : "0",
    },
    title: {
      fontSize: "24px",
      fontWeight: "bold",
      color: "#56697F",
      margin: "0",
    },
    buttonGroup: {
      display: "flex",
      gap: "10px",
      width: isMobile ? "100%" : "auto",
    },
    backButton: {
      padding: "8px 16px",
      backgroundColor: "#5a6b81",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background-color 0.2s ease",
      flex: isMobile ? "1" : "none",
    },
    editButton: {
      padding: "8px 16px",
      backgroundColor: "#593F62",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background-color 0.2s ease",
      flex: isMobile ? "1" : "none",
    },
    cancelButton: {
      padding: "8px 16px",
      backgroundColor: "#d32f2f",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "14px",
      transition: "background-color 0.2s ease",
      flex: isMobile ? "1" : "none",
    },
    bookingCard: {
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      marginBottom: "20px",
    },
    bookingHeader: {
      backgroundColor: "#56697F",
      color: "white",
      padding: "15px 20px",
      borderTopLeftRadius: "8px",
      borderTopRightRadius: "8px",
    },
    bookingStatus: {
      display: "inline-block",
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "bold",
      marginLeft: "10px",
      backgroundColor: "#4CAF50",
      color: "white",
    },
    bookingContent: {
      padding: "20px",
    },
    bookingSection: {
      marginBottom: "20px",
    },
    sectionTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      color: "#593F62",
      marginBottom: "10px",
      borderBottom: "1px solid #eee",
      paddingBottom: "5px",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "15px",
    },
    infoItem: {
      marginBottom: "10px",
    },
    infoLabel: {
      fontWeight: "bold",
      color: "#666",
      marginBottom: "5px",
      fontSize: "14px",
    },
    infoValue: {
      color: "#333",
      fontSize: "16px",
    },
    attendeesList: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    attendeeItem: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px",
      backgroundColor: "#f5f5f5",
      borderRadius: "4px",
    },
    attendeeAvatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      objectFit: "cover",
    },
    attendeeInfo: {
      display: "flex",
      flexDirection: "column",
    },
    attendeeName: {
      fontWeight: "bold",
      fontSize: "14px",
    },
    attendeeEmail: {
      color: "#666",
      fontSize: "12px",
    },
    recurringInfo: {
      backgroundColor: "#f5f5f5",
      padding: "10px 15px",
      borderRadius: "4px",
      marginTop: "10px",
    },
    recurringDays: {
      display: "flex",
      flexWrap: "wrap",
      gap: "5px",
      marginTop: "5px",
    },
    dayTag: {
      padding: "4px 8px",
      backgroundColor: "#e0e0e0",
      borderRadius: "4px",
      fontSize: "12px",
    },
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Booking Details</h1>
        <div style={styles.buttonGroup}>
          <button
            style={styles.backButton}
            onClick={handleBackToBookings}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4a5a6e")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#5a6b81")}
          >
            Back to Bookings
          </button>
          <button
            style={styles.editButton}
            onClick={handleEditBooking}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#4a3450")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#593F62")}
          >
            Edit Booking
          </button>
          <button
            style={styles.cancelButton}
            onClick={handleCancelBooking}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#b71c1c")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#d32f2f")}
          >
            Cancel Booking
          </button>
        </div>
      </div>

      <div style={styles.bookingCard}>
        <div style={styles.bookingHeader}>
          <h2 style={{ margin: 0, fontSize: "20px" }}>
            {booking.purpose}
            <span style={styles.bookingStatus}>{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
          </h2>
        </div>

        <div style={styles.bookingContent}>
          <div style={styles.bookingSection}>
            <h3 style={styles.sectionTitle}>Room Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Room Name</div>
                <div style={styles.infoValue}>{booking.roomName}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Floor</div>
                <div style={styles.infoValue}>{booking.roomFloor}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Capacity</div>
                <div style={styles.infoValue}>{booking.roomCapacity} people</div>
              </div>
            </div>
          </div>

          <div style={styles.bookingSection}>
            <h3 style={styles.sectionTitle}>Booking Schedule</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Start Date</div>
                <div style={styles.infoValue}>{formatDate(booking.startDate)}</div>
              </div>
              {booking.isRecurring && (
                <div style={styles.infoItem}>
                  <div style={styles.infoLabel}>End Date</div>
                  <div style={styles.infoValue}>{formatDate(booking.endDate)}</div>
                </div>
              )}
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Time</div>
                <div style={styles.infoValue}>
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Booking Type</div>
                <div style={styles.infoValue}>{booking.isRecurring ? "Recurring" : "One-time"}</div>
              </div>
            </div>

            {booking.isRecurring && (
              <div style={styles.recurringInfo}>
                <div style={{ fontWeight: "bold", marginBottom: "5px" }}>Recurring Pattern:</div>
                <div style={styles.recurringDays}>
                  {booking.recurringDays?.map((day) => (
                    <span key={day} style={styles.dayTag}>
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={styles.bookingSection}>
            <h3 style={styles.sectionTitle}>Attendees ({booking.attendees.length})</h3>
            <div style={styles.attendeesList}>
              {booking.attendees.map((attendee) => (
                <div key={attendee.id} style={styles.attendeeItem}>
                  <img src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} style={styles.attendeeAvatar} />
                  <div style={styles.attendeeInfo}>
                    <span style={styles.attendeeName}>{attendee.name}</span>
                    <span style={styles.attendeeEmail}>{attendee.email}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.bookingSection}>
            <h3 style={styles.sectionTitle}>Additional Information</h3>
            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Created By</div>
                <div style={styles.infoValue}>{booking.createdBy.name}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Created On</div>
                <div style={styles.infoValue}>
                  {new Date(booking.createdAt).toLocaleDateString()} at{" "}
                  {new Date(booking.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div style={{ ...styles.infoItem, gridColumn: "1 / -1" }}>
                <div style={styles.infoLabel}>Purpose</div>
                <div style={styles.infoValue}>{booking.purpose}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditBooking
