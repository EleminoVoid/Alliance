import type React from "react"

import { useState, useEffect } from "react"
import EditIcon from "@mui/icons-material/Edit";
import "./EditRoom.css"

interface RoomData {
  id: number
  name: string
  location: string
  capacity: string
  features: {
    airCondition: boolean
    projector: boolean
    whiteBoard: boolean
    tv: boolean
    speaker: boolean
    wifi: boolean
    powerOutlets: boolean
    videoConferencing: boolean
  }
}

export const EditRoom = ({ roomId = 1 }: { roomId?: number }) => {
  const [roomData, setRoomData] = useState<RoomData>({
    id: roomId,
    name: "Room Name 101",
    location: "First Floor",
    capacity: "20",
    features: {
      airCondition: true,
      projector: true,
      whiteBoard: true,
      tv: true,
      speaker: true,
      wifi: true,
      powerOutlets: true,
      videoConferencing: true,
    },
  })

  useEffect(() => {
    // Fetch room data based on roomId
    // This would be an API call in a real application
    console.log(`Fetching room data for room ID: ${roomId}`)
  }, [roomId])

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
    console.log("Room data updated:", roomData)
    // Add API call here
  }

  return (
    <div className="room-form-container">
      <h1>Edit room</h1>

      <form onSubmit={handleSubmit}>
        <div className="avatar-section">
          <div className="room-avatar">
            <EditIcon />
          </div>
        </div>

        <div className="form-fields">
          <div className="form-field">
            <label htmlFor="name">Room Name</label>
            <input type="text" id="name" name="name" value={roomData.name} onChange={handleInputChange} />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="location">Location</label>
              <input type="text" id="location" name="location" value={roomData.location} onChange={handleInputChange} />
            </div>

            <div className="form-field">
              <label htmlFor="capacity">Capacity</label>
              <input
                type="number"
                id="capacity"
                name="capacity"
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
            Save
          </button>
          <button type="button" className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
