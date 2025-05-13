import type React from "react"

import { useState } from "react"
import EditIcon from "@mui/icons-material/Edit";
import "./AddRoom.css"

export const AddRoom = () => {
  const [roomData, setRoomData] = useState({
    name: "",
    location: "",
    capacity: "",
    features: {
      airCondition: false,
      projector: false,
      whiteBoard: false,
      tv: false,
      speaker: false,
      wifi: false,
      powerOutlets: false,
      videoConferencing: false,
    },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRoomData({
      ...roomData,
      [name]: value,
    })
  }

  const handleFeatureToggle = (feature: string) => {
    setRoomData({
      ...roomData,
      features: {
        ...roomData.features,
        [feature]: !roomData.features[feature as keyof typeof roomData.features],
      },
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Room data submitted:", roomData)
    // Add API call here
  }

  return (
    <div className="room-form-container">
      <h1>Add room</h1>

      <form onSubmit={handleSubmit}>
        <div className="avatar-section">
          <div className="room-avatar">
            <EditIcon />
          </div>
        </div>

        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="name">Room Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Room Name 101"
              value={roomData.name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="First Floor"
                value={roomData.location}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-field">
              <label htmlFor="capacity">Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                placeholder="20"
                value={roomData.capacity}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="features-section">
            <label>Features</label>
            <div className="features-grid">
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="airCondition"
                  checked={roomData.features.airCondition}
                  onChange={() => handleFeatureToggle("airCondition")}
                />
                <label htmlFor="airCondition">Air Condition</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="speaker"
                  checked={roomData.features.speaker}
                  onChange={() => handleFeatureToggle("speaker")}
                />
                <label htmlFor="speaker">Speaker</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="projector"
                  checked={roomData.features.projector}
                  onChange={() => handleFeatureToggle("projector")}
                />
                <label htmlFor="projector">Projector</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="wifi"
                  checked={roomData.features.wifi}
                  onChange={() => handleFeatureToggle("wifi")}
                />
                <label htmlFor="wifi">WIFI</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="whiteBoard"
                  checked={roomData.features.whiteBoard}
                  onChange={() => handleFeatureToggle("whiteBoard")}
                />
                <label htmlFor="whiteBoard">White Board</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="powerOutlets"
                  checked={roomData.features.powerOutlets}
                  onChange={() => handleFeatureToggle("powerOutlets")}
                />
                <label htmlFor="powerOutlets">Power Outlets</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="tv"
                  checked={roomData.features.tv}
                  onChange={() => handleFeatureToggle("tv")}
                />
                <label htmlFor="tv">TV</label>
              </div>
              <div className="feature-item">
                <input
                  type="checkbox"
                  id="videoConferencing"
                  checked={roomData.features.videoConferencing}
                  onChange={() => handleFeatureToggle("videoConferencing")}
                />
                <label htmlFor="videoConferencing">Video Conferencing Setup</label>
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button">
            Submit
          </button>
          <button type="button" className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
