// FAQ.tsx
import React, { useState } from "react";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export const Faq: React.FC = () => {
  // FAQ data
  const faqItems: FAQItem[] = [
    {
      question: "How do I book a room?",
      answer: (
        <div>
          <p style={styles.answerText}>To book a room, follow these steps:</p>
          <ol style={styles.answerList}>
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
        <p style={styles.answerText}>
          A single booking reserves a room for one specific date and time. A recurring booking automatically reserves the
          room for multiple instances following a pattern (daily, weekly, bi-weekly, or monthly) starting from the
          selected date.
        </p>
      ),
    },
    {
      question: "How can I modify or cancel my booking?",
      answer: (
        <p style={styles.answerText}>
          To modify or cancel a booking, go to the "My Bookings" page where you'll see all your current reservations. Each
          booking has a cancel button that allows you to remove the reservation. To modify a booking, you'll need to
          cancel it and create a new one with the updated details.
        </p>
      ),
    },
    {
      question: "How far in advance can I book a room?",
      answer: (
        <p style={styles.answerText}>
          Rooms can be booked up to 3 months in advance. This policy helps ensure fair access to meeting spaces for all
          team members.
        </p>
      ),
    },
    {
      question: "What if I need to extend my meeting?",
      answer: (
        <p style={styles.answerText}>
          If you need to extend your meeting, check the room's availability for the additional time on the Calendar page.
          If the room is available, you can create a new booking for the extended time. If the room is already booked, you
          may need to find an alternative space.
        </p>
      ),
    },
    {
      question: "How do I report issues with a room?",
      answer: (
        <p style={styles.answerText}>
          If you encounter any issues with a room (equipment not working, cleanliness concerns, etc.), please contact the
          facilities team at facilities@company.com or call extension 1234. Please provide the room number, date, time,
          and a description of the issue.
        </p>
      ),
    },
    {
      question: "Can I book multiple rooms for the same time?",
      answer: (
        <p style={styles.answerText}>
          Yes, you can book multiple rooms for the same time period. Simply create separate bookings for each room you
          need.
        </p>
      ),
    },
    {
      question: "Who should I contact for support?",
      answer: (
        <div>
          <p style={styles.answerText}>For support with the room booking system, please contact:</p>
          <ul style={styles.answerList}>
            <li>Technical issues: helpdesk@company.com or ext. 5678</li>
            <li>Booking policies: office-admin@company.com or ext. 5432</li>
            <li>Room equipment: facilities@company.com or ext. 1234</li>
          </ul>
          <p style={{...styles.answerText, marginTop: '10px'}}>For urgent matters, please call the front desk at extension 1000.</p>
        </div>
      ),
    },
  ];

  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number): void => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div style={styles.faqPage}>
      <h1 style={styles.pageTitle}>Frequently Asked Questions</h1>

      <div style={styles.faqContainer}>
        <h2 style={styles.sectionTitle}>Room Booking FAQ</h2>
        <p style={styles.sectionDescription}>Find answers to common questions about our room booking system</p>
        
        <div style={styles.faqList}>
          {faqItems.map((item, index) => (
            <div key={index} style={styles.faqItem}>
              <button
                style={{
                  ...styles.faqQuestion,
                  ...(openItem === index ? styles.faqQuestionActive : {})
                }}
                onClick={() => toggleItem(index)}
              >
                {item.question}
                <span>{openItem === index ? "−" : "+"}</span>
              </button>
              <div style={{
                ...styles.faqAnswer,
                ...(openItem === index ? styles.faqAnswerOpen : {})
              }}>
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  faqPage: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  faqContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #ddd',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  sectionTitle: {
    padding: '20px 20px 0',
    margin: '0',
    backgroundColor: '#f5f5f5',
    fontSize: '20px',
  },
  sectionDescription: {
    padding: '0 20px 20px',
    margin: '0',
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  faqList: {
    padding: '0',
  },
  faqItem: {
    borderBottom: '1px solid #ddd',
  },
  faqQuestion: {
    width: '100%',
    textAlign: 'left' as const,
    padding: '15px 20px',
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestionActive: {
    fontWeight: 'bold',
    color: '#4a3450',
  },
  faqAnswer: {
    maxHeight: '0',
    overflow: 'hidden',
    transition: 'max-height 0.3s ease-out',
    padding: '0 20px',
  },
  faqAnswerOpen: {
    maxHeight: '1000px',
    padding: '0 20px 15px',
  },
  answerText: {
    margin: '0 0 10px 0',
  },
  answerList: {
    marginTop: '10px',
    paddingLeft: '20px',
  },
};
export default Faq;