export interface DrawEvent {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  userId: string;
}

export interface UserJoinEvent {
  userId: string;
  username: string;
}
