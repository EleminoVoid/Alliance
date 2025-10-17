export interface User {
  Id: string;
  Email: string;
  Username: string;
  Password: string;
  Role: string;
  Avatar?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface Room {
  Id: string;
  Name: string;
  Floor?: string;
  Capacity?: number;
  Available?: boolean;
  Description?: string;
  Image?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface RoomAmenity {
  RoomId: string;
  Amenity: string;
}

export interface Booking {
  Id: string;
  UserId: string;
  RoomId: string;
  StartDate: string;
  EndDate: string;
  Type: string;
  Status?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}