// Try the HTTPS backend first, then HTTP. Update these if your backend runs elsewhere.
const API_BASES = ["https://localhost:5001/api", "http://localhost:5000/api"];

async function requestJson(path: string, init?: RequestInit) {
  let lastError: any = null;
  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, init);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return await res.json();
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("Network request failed");
}

async function requestEmpty(path: string, init?: RequestInit) {
  let lastError: any = null;
  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, init);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      return;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("Network request failed");
}

// USERS
export async function getUsers() {
  return requestJson("/users");
}

export async function addUser(user: any) {
  return requestJson("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
}

export async function deleteUser(id: string) {
  return requestEmpty(`/users/${id}`, { method: "DELETE" });
}

// ROOMS
export async function getRooms() {
  return requestJson("/rooms");
}

export async function addRoom(room: any) {
  return requestJson("/rooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(room),
  });
}

export async function deleteRoom(id: string) {
  return requestEmpty(`/rooms/${id}`, { method: "DELETE" });
}

// AMENITIES
export async function getRoomAmenities(roomId: string) {
  return requestJson(`/roomamenities/${roomId}`);
}

export async function addRoomAmenity(roomId: string, amenity: string) {
  return requestJson(`/roomamenities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomId, amenity }),
  });
}

// BOOKINGS
export async function getBookings() {
  return requestJson("/bookings");
}

export async function addBooking(booking: any) {
  return requestJson("/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
}

export async function deleteBooking(id: string) {
  return requestEmpty(`/bookings/${id}`, { method: "DELETE" });
}

