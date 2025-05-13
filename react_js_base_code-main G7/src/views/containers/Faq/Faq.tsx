import React, { useState } from "react";
import "./Faq.css";

interface FAQItem {
  question: string;
  answer: React.ReactNode;
}

export const Faq: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);

  const toggleItem = (index: number): void => {
    setOpenItem(openItem === index ? null : index);
  };

  return (
    <div className="faq-container">
      <h1 className="faq-title">Frequently Asked Questions</h1>
      <div className="faq-questionContainer">
        <div className="faq-questionHeader">
          <h2 className="faq-questionHeaderTitle">Room Booking FAQ</h2>
          <p className="faq-questionHeaderSubTitle">
            Find answers to common questions about our room booking system
          </p>
        </div>
        <div>
          {faqItems.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${openItem === index ? "faq-item-open" : ""}`}
            >
              <button
                className="faq-questionButton"
                onClick={() => toggleItem(index)}
              >
                {item.question}
                <span className="faq-toggleIcon">
                  {openItem === index ? "−" : "+"}
                </span>
              </button>
              <div className="faq-answer">{item.answer}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const faqItems: FAQItem[] = [
  {
    question: "How do I book a room?",
    answer: (
      <div>
        <p>To book a room, follow these steps:</p>
        <ol>
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
      <p>
        A single booking reserves a room for one specific date and time. A
        recurring booking automatically reserves the room for multiple
        instances following a pattern (daily, weekly, bi-weekly, or monthly)
        starting from the selected date.
      </p>
    ),
  },
  {
    question: "How can I modify or cancel my booking?",
    answer: (
      <p>
        To modify or cancel a booking, go to the "My Bookings" page where you'll
        see all your current reservations. Each booking has a cancel button
        that allows you to remove the reservation. To modify a booking, you'll
        need to cancel it and create a new one with the updated details.
      </p>
    ),
  },
  {
    question: "How far in advance can I book a room?",
    answer: (
      <p>
        Rooms can be booked up to 3 months in advance. This policy helps ensure
        fair access to meeting spaces for all team members.
      </p>
    ),
  },
  {
    question: "What if I need to extend my meeting?",
    answer: (
      <p>
        If you need to extend your meeting, check the room's availability for
        the additional time on the Calendar page. If the room is available, you
        can create a new booking for the extended time. If the room is already
        booked, you may need to find an alternative space.
      </p>
    ),
  },
  {
    question: "How do I report issues with a room?",
    answer: (
      <p>
        If you encounter any issues with a room (equipment not working,
        cleanliness concerns, etc.), please contact the facilities team at
        facilities@company.com or call extension 1234. Please provide the room
        number, date, time, and a description of the issue.
      </p>
    ),
  },
  {
    question: "Can I book multiple rooms for the same time?",
    answer: (
      <p>
        Yes, you can book multiple rooms for the same time period. Simply create
        separate bookings for each room you need.
      </p>
    ),
  },
  {
    question: "Who should I contact for support?",
    answer: (
      <div>
        <p>For support with the room booking system, please contact:</p>
        <ul>
          <li>Technical issues: helpdesk@company.com or ext. 5678</li>
          <li>Booking policies: office-admin@company.com or ext. 5432</li>
          <li>Room equipment: facilities@company.com or ext. 1234</li>
        </ul>
        <p>For urgent matters, please call the front desk at extension 1000.</p>
      </div>
    ),
  },
];