export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  savedDestinations: string[];
  language: string;
  createdAt: string;
  phone?: string;
  bio?: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  region: string;
  costIndex: number; // 1-5
  popularity: number; // 1-100
  image: string;
  description: string;
  avgDailyCost: number;
}

export interface ActivityTemplate {
  id: string;
  name: string;
  cityId: string;
  type: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'shopping' | 'nightlife' | 'nature';
  cost: number;
  duration: number; // hours
  description: string;
  image: string;
  rating: number;
}

export interface Activity {
  id: string;
  name: string;
  type: 'sightseeing' | 'food' | 'adventure' | 'culture' | 'shopping' | 'nightlife' | 'nature';
  cost: number;
  duration: number;
  description: string;
  image: string;
  time?: string;
}

export interface Stop {
  id: string;
  cityId: string;
  cityName: string;
  country: string;
  countryCode: string;
  image: string;
  startDate: string;
  endDate: string;
  activities: Activity[];
  accommodation: number;
  transport: number;
  meals: number;
  order: number;
}

export interface Note {
  id: string;
  tripId: string;
  stopId?: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'clothing' | 'documents' | 'electronics' | 'toiletries' | 'medical' | 'other';
  isPacked: boolean;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  coverImage: string;
  isPublic: boolean;
  stops: Stop[];
  notes: Note[];
  packingList: PackingItem[];
  totalBudget: number;
  currency: string;
  createdAt: string;
  tags: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

export interface TripState {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id' | 'createdAt'>) => string;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  getTrip: (id: string) => Trip | undefined;
  addStop: (tripId: string, stop: Omit<Stop, 'id'>) => void;
  updateStop: (tripId: string, stopId: string, updates: Partial<Stop>) => void;
  deleteStop: (tripId: string, stopId: string) => void;
  reorderStops: (tripId: string, stops: Stop[]) => void;
  addActivity: (tripId: string, stopId: string, activity: Omit<Activity, 'id'>) => void;
  removeActivity: (tripId: string, stopId: string, activityId: string) => void;
  addNote: (tripId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (tripId: string, noteId: string, updates: Partial<Note>) => void;
  deleteNote: (tripId: string, noteId: string) => void;
  addPackingItem: (tripId: string, item: Omit<PackingItem, 'id'>) => void;
  togglePackingItem: (tripId: string, itemId: string) => void;
  deletePackingItem: (tripId: string, itemId: string) => void;
  resetPackingList: (tripId: string) => void;
}
