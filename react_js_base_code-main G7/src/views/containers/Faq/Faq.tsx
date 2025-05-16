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
          <li>Go to the <b>Calendar</b> page.</li>
          <li>Select a room from the dropdown at the top right of the calendar.</li>
          <li>Click on your desired date in the calendar.</li>
          <li>In the sidebar, fill in the time, and (optionally) enable "Recurring Booking" and select days/range.</li>
          <li>Click <b>Book</b>. Your booking will appear on the calendar and in your bookings list.</li>
        </ol>
      </div>
    ),
  },
  {
    question: "What is the difference between single and recurring bookings?",
    answer: (
      <p>
        <b>Single booking:</b> Reserves a room for one specific date and time.<br />
        <b>Recurring booking:</b> Reserves the room for multiple dates based on the days and date range you select (e.g., every Monday and Wednesday for a month).
      </p>
    ),
  },
  {
    question: "How can I modify or cancel my booking?",
    answer: (
      <div>
        <p>
          Go to the <b>Your Bookings</b> page. Find your booking in the table or mobile list.
        </p>
        <ul>
          <li>Click <b>Edit booking</b> to change details, or <b>Delete</b> (trash icon) to remove it.</li>
          <li>To change a booking, edit and save; to cancel, just delete.</li>
        </ul>
      </div>
    ),
  },
  {
    question: "How far in advance can I book a room?",
    answer: (
      <p>
        There is no strict limit enforced in the code, but you can select any future date using the calendar and date pickers.
      </p>
    ),
  },
  {
    question: "What if I need to extend my meeting?",
    answer: (
      <p>
        Check the room’s availability for the extra time on the Calendar page. If available, create a new booking for the additional time. If not available, you may need to choose another room or time.
      </p>
    ),
  },
  {
    question: "How do I report issues with a room?",
    answer: (
      <p>
        There is no in-app reporting feature. Please contact your facilities team directly (e.g., by email or phone) as listed in your company directory.
      </p>
    ),
  },
  {
    question: "Can I book multiple rooms for the same time?",
    answer: (
      <p>
        Yes. You can create separate bookings for different rooms at the same time by repeating the booking process for each room.
      </p>
    ),
  },
  {
    question: "Who should I contact for support?",
    answer: (
      <div>
        <p>
          For technical issues with the booking system, contact your IT/helpdesk team.<br />
          For booking policies or room equipment, contact your office admin or facilities team.<br />
          There are no in-app support or chat features; use your organization’s standard support channels.
        </p>
      </div>
    ),
  },
];