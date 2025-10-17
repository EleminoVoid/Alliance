const API_BASE = "https://localhost:5001/api"; 

// USERS
export async function getUsers() {
  const res = await fetch(`${API_BASE}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function addUser(user: any) {
  const res = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to add user");
  return res.json();
}

export async function deleteUser(id: string) {
  const res = await fetch(`${API_BASE}/users/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
}

// ROOMS
export async function getRooms() {
  const res = await fetch(`${API_BASE}/rooms`);
  if (!res.ok) throw new Error("Failed to fetch rooms");
  return res.json();
}

export async function addRoom(room: any) {
  const res = await fetch(`${API_BASE}/rooms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(room),
  });
  if (!res.ok) throw new Error("Failed to add room");
  return res.json();
}

export async function deleteRoom(id: string) {
  const res = await fetch(`${API_BASE}/rooms/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete room");
}

// AMENITIES
export async function getRoomAmenities(roomId: string) {
  const res = await fetch(`${API_BASE}/roomamenities/${roomId}`);
  if (!res.ok) throw new Error("Failed to fetch amenities");
  return res.json();
}

export async function addRoomAmenity(roomId: string, amenity: string) {
  const res = await fetch(`${API_BASE}/roomamenities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomId, amenity }),
  });
  if (!res.ok) throw new Error("Failed to add amenity");
  return res.json();
}

// BOOKINGS
export async function getBookings() {
  const res = await fetch(`${API_BASE}/bookings`);
  if (!res.ok) throw new Error("Failed to fetch bookings");
  return res.json();
}

export async function addBooking(booking: any) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
  if (!res.ok) throw new Error("Failed to add booking");
  return res.json();
}

export async function deleteBooking(id: string) {
  const res = await fetch(`${API_BASE}/bookings/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete booking");
}

