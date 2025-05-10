import type React from "react"
import { useState } from "react"

interface FAQItem {
  question: string
  answer: React.ReactNode
}

export const Faq: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null)

  const toggleItem = (index: number): void => {
    setOpenItem(openItem === index ? null : index)
  }

  return (
    <div style={ styles.container }>
      <h1 style={ styles.title }> Frequently Asked Questions </h1>
      <div style={ styles.questionContainer }>
        <div style={ styles.questionHeader}>
          <h2 style={ styles.questionHeaderTitle }> Room Booking FAQ </h2>
          <p style={ styles.questionHeaderSubTitle }> Find answers to common questions about our room booking system </p>
        </div>
        <div>
          {faqItems.map((item, index) => (
            <div key={index} style={{ borderBottom: index < faqItems.length - 1 ? "1px solid #ddd" : "none" }}>
              <button
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "15px 20px",
                  background: "none",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: openItem === index ? "bold" : "normal",
                  color: openItem === index ? "#4a3450" : "#333",
                  transition: "background-color 0.2s ease",
                  backgroundColor: openItem === index ? "#f9f5fa" : "transparent",
                }}
                onClick={() => toggleItem(index)}
                onMouseOver={(e) => {
                  if (openItem !== index) {
                    e.currentTarget.style.backgroundColor = "#f5f5f5"
                  }
                }}
                onMouseOut={(e) => {
                  if (openItem !== index) {
                    e.currentTarget.style.backgroundColor = "transparent"
                  }
                }}
              >
                {item.question}
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    transition: "transform 0.3s ease",
                    transform: openItem === index ? "rotate(45deg)" : "none",
                    display: "inline-block",
                  }}
                >
                  {openItem === index ? "−" : "+"}
                </span>
              </button>
              <div
                style={{
                  maxHeight: openItem === index ? "1000px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.3s ease-out, padding 0.3s ease-out",
                  padding: openItem === index ? "0 20px 15px" : "0 20px",
                  backgroundColor: openItem === index ? "#f9f5fa" : "transparent",
                }}
              >
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  
}

const faqItems: FAQItem[] = [
  {
    question: "How do I book a room?",
    answer: (
      <div>
        <p
          style={{
            margin: "0 0 10px 0",
          }}
        >
          To book a room, follow these steps:
        </p>
        <ol
          style={{
            marginTop: "10px",
            paddingLeft: "20px",
          }}
        >
          <li>Navigate to the Calendar page</li>
          <li>Select your desired date</li>
          <li>Choose a room from the dropdown menu</li>
          <li>Select your start and end times</li>
          <li>Toggle the recurring option if needed</li>
          <li>Click the "Book Room" button to confirm</li>
        </ol>
      </div>
    ),
  },
  {
    question: "What is the difference between single and recurring bookings?",
    answer: (
      <p
        style={{
          margin: "0 0 10px 0",
        }}
      >
        A single booking reserves a room for one specific date and time. A recurring booking automatically reserves
        the room for multiple instances following a pattern (daily, weekly, bi-weekly, or monthly) starting from the
        selected date.
      </p>
    ),
  },
  {
    question: "How can I modify or cancel my booking?",
    answer: (
      <p
        style={{
          margin: "0 0 10px 0",
        }}
      >
        To modify or cancel a booking, go to the "My Bookings" page where you'll see all your current reservations.
        Each booking has a cancel button that allows you to remove the reservation. To modify a booking, you'll need
        to cancel it and create a new one with the updated details.
      </p>
    ),
  },
  {
    question: "How far in advance can I book a room?",
    answer: (
      <p
        style={{
          margin: "0 0 10px 0",
        }}
      >
        Rooms can be booked up to 3 months in advance. This policy helps ensure fair access to meeting spaces for all
        team members.
      </p>
    ),
  },
  {
    question: "What if I need to extend my meeting?",
    answer: (
      <p
        style={{
          margin: "0 0 10px 0",
        }}
      >
        If you need to extend your meeting, check the room's availability for the additional time on the Calendar
        page. If the room is available, you can create a new booking for the extended time. If the room is already
        booked, you may need to find an alternative space.
      </p>
    ),
  },
  {
    question: "How do I report issues with a room?",
    answer: (
      <p
        style={{
          margin: "0 0 10px 0",
        }}
      >
        If you encounter any issues with a room (equipment not working, cleanliness concerns, etc.), please contact
        the facilities team at facilities@company.com or call extension 1234. Please provide the room number, date,
        time, and a description of the issue.
      </p>
    ),
  },
  {
    question: "Can I book multiple rooms for the same time?",
    answer: (
      <p
        style={{
          margin: "0 0 10px 0",
        }}
      >
        Yes, you can book multiple rooms for the same time period. Simply create separate bookings for each room you
        need.
      </p>
    ),
  },
  {
    question: "Who should I contact for support?",
    answer: (
      <div>
        <p
          style={{
            margin: "0 0 10px 0",
          }}
        >
          For support with the room booking system, please contact:
        </p>
        <ul
          style={{
            marginTop: "10px",
            paddingLeft: "20px",
          }}
        >
          <li>Technical issues: helpdesk@company.com or ext. 5678</li>
          <li>Booking policies: office-admin@company.com or ext. 5432</li>
          <li>Room equipment: facilities@company.com or ext. 1234</li>
        </ul>
        <p
          style={{
            margin: "10px 0 0 0",
          }}
        >
          For urgent matters, please call the front desk at extension 1000.
        </p>
      </div>
    ),
  },
]

const styles = { 
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
    minHeight: "100vh",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "20px",
    color: "#5a6b81",
    textAlign: "center",
    borderBottom: "2px solid #b1cddd",
    paddingBottom: "10px",
  },
  questionContainer: {
    maxWidth: "800px",
    margin: "0 auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    overflow: "hidden",
    backgroundColor: "white",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  questionHeader: {
    padding: "20px 20px 0",
    margin: "0",
    backgroundColor: "#f5f5f5",
    borderBottom: "1px solid #ddd",
  },
  questionHeaderTitle: {
    margin: "0",
    fontSize: "20px",
    color: "#604b66",
    fontWeight: "600",
  },
  questionHeaderSubTitle: {
    padding: "10px 0 20px",
    margin: "0",
    color: "#666",
    fontSize: "16px",
  }
}