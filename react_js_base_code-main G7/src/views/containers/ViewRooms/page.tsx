"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Monitor, Wifi, Coffee, Video } from "lucide-react"
import { Input } from "@/components/ui/input"

// Mock data for rooms
const mockRooms = [
  {
    id: "room-101",
    name: "Room 101",
    floor: "ground",
    capacity: 4,
    available: true,
    amenities: ["wifi", "monitor"],
    description: "Small meeting room ideal for quick team discussions",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "room-102",
    name: "Room 102",
    floor: "ground",
    capacity: 6,
    available: false,
    amenities: ["wifi", "monitor", "coffee"],
    description: "Medium-sized meeting room with refreshment facilities",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "conference-a",
    name: "Conference Room A",
    floor: "ground",
    capacity: 20,
    available: true,
    amenities: ["wifi", "monitor", "video", "coffee"],
    description: "Large conference room with video conferencing capabilities",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "room-201",
    name: "Room 201",
    floor: "mezzanine",
    capacity: 8,
    available: true,
    amenities: ["wifi", "monitor"],
    description: "Medium-sized meeting room on the mezzanine floor",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "room-202",
    name: "Room 202",
    floor: "mezzanine",
    capacity: 4,
    available: true,
    amenities: ["wifi"],
    description: "Small meeting room for quick discussions",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "room-301",
    name: "Room 301",
    floor: "first",
    capacity: 10,
    available: true,
    amenities: ["wifi", "monitor", "video"],
    description: "Large meeting room with video conferencing setup",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "conference-b",
    name: "Conference Room B",
    floor: "first",
    capacity: 16,
    available: true,
    amenities: ["wifi", "monitor", "video", "coffee"],
    description: "Spacious conference room for larger meetings",
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function ViewRooms() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchCapacity, setSearchCapacity] = useState<number | null>(null)

  const filteredRooms = mockRooms
    .filter(
      (room) =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((room) => (searchCapacity ? room.capacity >= searchCapacity : true))

  return (
    <div className="container">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Available Rooms</h1>
        <Link href="/calendar">
          <Button>Book a Room</Button>
        </Link>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Capacity:</span>
          <Button
            variant={searchCapacity === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchCapacity(null)}
          >
            All
          </Button>
          <Button variant={searchCapacity === 4 ? "default" : "outline"} size="sm" onClick={() => setSearchCapacity(4)}>
            4+
          </Button>
          <Button variant={searchCapacity === 8 ? "default" : "outline"} size="sm" onClick={() => setSearchCapacity(8)}>
            8+
          </Button>
          <Button
            variant={searchCapacity === 15 ? "default" : "outline"}
            size="sm"
            onClick={() => setSearchCapacity(15)}
          >
            15+
          </Button>
        </div>
      </div>

      <Tabs defaultValue="ground">
        <TabsList className="mb-6">
          <TabsTrigger value="ground">Ground Floor</TabsTrigger>
          <TabsTrigger value="mezzanine">Mezzanine Floor</TabsTrigger>
          <TabsTrigger value="first">First Floor</TabsTrigger>
        </TabsList>

        <TabsContent value="ground" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms
            .filter((room) => room.floor === "ground")
            .map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
        </TabsContent>

        <TabsContent value="mezzanine" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms
            .filter((room) => room.floor === "mezzanine")
            .map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
        </TabsContent>

        <TabsContent value="first" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms
            .filter((room) => room.floor === "first")
            .map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface RoomCardProps {
  room: {
    id: string
    name: string
    floor: string
    capacity: number
    available: boolean
    amenities: string[]
    description: string
    image: string
  }
}

function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="room-card">
      <img src={room.image || "/placeholder.svg"} alt={room.name} className="room-image" />
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between">
          <div>
            <h3 className="font-semibold">{room.name}</h3>
            <p className="text-sm text-muted-foreground">Capacity: {room.capacity}</p>
          </div>
          <Badge variant={room.available ? "default" : "destructive"}>{room.available ? "Available" : "Booked"}</Badge>
        </div>

        <div className="mb-3 flex flex-wrap gap-1">
          {room.amenities.includes("wifi") && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Wifi className="h-3 w-3" /> WiFi
            </Badge>
          )}
          {room.amenities.includes("monitor") && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Monitor className="h-3 w-3" /> Display
            </Badge>
          )}
          {room.amenities.includes("video") && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Video className="h-3 w-3" /> Video
            </Badge>
          )}
          {room.amenities.includes("coffee") && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Coffee className="h-3 w-3" /> Coffee
            </Badge>
          )}
        </div>

        <Button className="w-full" disabled={!room.available} asChild>
          <Link href={`/calendar?room=${room.id}`}>{room.available ? "Book Now" : "Unavailable"}</Link>
        </Button>
      </div>
    </div>
  )
}
