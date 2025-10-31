// Using HTTP backend only to avoid duplicate requests
const API_BASES = ["http://localhost:5000/api"];

async function requestJson(path: string, init?: RequestInit) {
  let lastError: any = null;
  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, init);
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`API Error (${res.status}):`, errorText);
        throw new Error(`${res.status} ${res.statusText}: ${errorText}`);
      }
      const data = await res.json();
      return data; // Successfully got response, return immediately
    } catch (err) {
      console.error("Request failed:", err);
      lastError = err;
      // Continue to next base only if this one failed
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
      return; // Successfully completed, return immediately
    } catch (err) {
      lastError = err;
      // Continue to next base only if this one failed
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

// AUTH
export async function login(userId: string, password: string) {
  return requestJson("/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ UserId: userId, Password: password }),
  });
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string, confirmPassword: string) {
  return requestJson("/users/change-password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      currentPassword,
      newPassword,
      confirmPassword
    }),
  });
}

// ROOMS
export async function getRooms() {
  return requestJson("/rooms");
}

export async function getRoomById(id: string) {
  return requestJson(`/rooms/${id}`);
}

export async function addRoom(room: any) {
  return requestJson("/rooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(room),
  });
}

export async function updateRoom(id: string, room: any) {
  return requestJson(`/rooms/${id}`, {
    method: "PUT",
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

