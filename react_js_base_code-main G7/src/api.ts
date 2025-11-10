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

export async function getUserById(id: string) {
  return requestJson(`/users/${id}`);
}

export async function searchUsers(query: string) {
  return requestJson(`/users/search?query=${encodeURIComponent(query)}`);
}

export async function addUser(user: any) {
  return requestJson("/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
}

export async function updateUser(id: string, user: any) {
  return requestJson(`/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
}

export async function deleteUser(id: string) {
  return requestEmpty(`/users/${id}`, { method: "DELETE" });
}

export async function resetUserPassword(id: string, newPassword: string) {
  return requestJson(`/users/${id}/reset-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ newPassword }),
  });
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
export async function getAllRoomAmenities() {
  return requestJson("/roomamenities");
}

export async function getRoomAmenities(roomId: string) {
  return requestJson(`/roomamenities/room/${roomId}`);
}

export async function getRoomAmenitiesList(roomId: string) {
  return requestJson(`/roomamenities/room/${roomId}/list`);
}

export async function getUniqueAmenities() {
  return requestJson("/roomamenities/unique");
}

export async function addRoomAmenity(roomId: string, amenity: string) {
  return requestJson(`/roomamenities`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ roomId, amenity }),
  });
}

// BOOKINGS
// Get all bookings
export async function getBookings() {
  return requestJson("/bookings");
}

// Get booking by ID
export async function getBookingById(id: string) {
  return requestJson(`/bookings/${id}`);
}

// Get user's bookings
export async function getUserBookings(userId: string) {
  return requestJson(`/bookings/user/${userId}`);
}

// Get room's bookings
export async function getRoomBookings(roomId: string) {
  return requestJson(`/bookings/room/${roomId}`);
}

// Get pending bookings
export async function getPendingBookings() {
  return requestJson("/bookings/pending");
}

// Get upcoming bookings
export async function getUpcomingBookings() {
  return requestJson("/bookings/upcoming");
}

// Get bookings in date range
export async function getBookingsByDateRange(startDate: string, endDate: string) {
  return requestJson(`/bookings/date-range?startDate=${startDate}&endDate=${endDate}`);
}

// Check room availability
export async function checkAvailability(roomId: string, startDate: string, endDate: string) {
  return requestJson(`/bookings/check-availability?roomId=${roomId}&startDate=${startDate}&endDate=${endDate}`);
}

// Get available dates for a room
export async function getAvailableDates(roomId: string, startDate: string, endDate: string) {
  return requestJson(`/bookings/available-dates?roomId=${roomId}&startDate=${startDate}&endDate=${endDate}`);
}

// Create single booking
export async function addBooking(booking: any) {
  return requestJson("/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
}

// Create recurring booking
export async function addRecurringBooking(booking: any) {
  return requestJson("/bookings/recurring", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
}

// Update booking
export async function updateBooking(id: string, booking: any) {
  return requestJson(`/bookings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(booking),
  });
}

// Approve booking (Admin)
export async function approveBooking(id: string) {
  return requestJson(`/bookings/${id}/approve`, {
    method: "PUT",
  });
}

// Reject booking (Admin)
export async function rejectBooking(id: string) {
  return requestJson(`/bookings/${id}/reject`, {
    method: "PUT",
  });
}

// Cancel booking
export async function cancelBooking(id: string) {
  return requestJson(`/bookings/${id}/cancel`, {
    method: "PUT",
  });
}

// Delete single booking
export async function deleteBooking(id: string) {
  let lastError: any = null;
  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}/bookings/${id}`, { method: "DELETE" });
      console.log("Delete response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Delete API Error (${res.status}):`, errorText);
        throw new Error(`${res.status} ${res.statusText}: ${errorText}`);
      }

      // Try to parse JSON response if there is one
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        console.log("Delete response data:", data);
        return data;
      }

      // If no JSON, just return success
      return { success: true };
    } catch (err) {
      console.error("Delete request failed:", err);
      lastError = err;
      // Continue to next base only if this one failed
    }
  }
  throw lastError || new Error("Delete request failed");
}

// Delete recurring booking
export async function deleteRecurringBooking(id: string) {
  let lastError: any = null;
  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}/bookings/${id}/recurring`, { method: "DELETE" });
      console.log("Delete recurring response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Delete recurring API Error (${res.status}):`, errorText);
        throw new Error(`${res.status} ${res.statusText}: ${errorText}`);
      }

      // Try to parse JSON response if there is one
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        console.log("Delete recurring response data:", data);
        return data;
      }

      // If no JSON, just return success
      return { success: true };
    } catch (err) {
      console.error("Delete recurring request failed:", err);
      lastError = err;
      // Continue to next base only if this one failed
    }
  }
  throw lastError || new Error("Delete recurring request failed");
}

