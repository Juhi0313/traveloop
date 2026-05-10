import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthState, TripState, User, Trip, Stop, Activity, Note, PackingItem } from '../types';
import { DEMO_USERS, DEMO_TRIPS } from '../data/mockData';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        const found = DEMO_USERS.find(u => u.email === email && u.password === password);
        if (found) {
          const { password: _, ...user } = found;
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      signup: (name: string, email: string, _password: string) => {
        const existing = DEMO_USERS.find(u => u.email === email);
        if (existing) return false;
        const newUser: User = {
          id: generateId(),
          name,
          email,
          isAdmin: false,
          savedDestinations: [],
          language: 'English',
          createdAt: new Date().toISOString().split('T')[0],
        };
        set({ user: newUser, isAuthenticated: true });
        return true;
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) set({ user: { ...user, ...updates } });
      },
    }),
    { name: 'traveloop-auth' }
  )
);

export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      trips: DEMO_TRIPS,

      addTrip: (trip) => {
        const id = generateId();
        const newTrip: Trip = {
          ...trip,
          id,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set(state => ({ trips: [...state.trips, newTrip] }));
        return id;
      },

      updateTrip: (id, updates) => {
        set(state => ({
          trips: state.trips.map(t => t.id === id ? { ...t, ...updates } : t),
        }));
      },

      deleteTrip: (id) => {
        set(state => ({ trips: state.trips.filter(t => t.id !== id) }));
      },

      getTrip: (id) => get().trips.find(t => t.id === id),

      addStop: (tripId, stop) => {
        const newStop: Stop = { ...stop, id: generateId() };
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId ? { ...t, stops: [...t.stops, newStop] } : t
          ),
        }));
      },

      updateStop: (tripId, stopId, updates) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, stops: t.stops.map(s => s.id === stopId ? { ...s, ...updates } : s) }
              : t
          ),
        }));
      },

      deleteStop: (tripId, stopId) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, stops: t.stops.filter(s => s.id !== stopId) }
              : t
          ),
        }));
      },

      reorderStops: (tripId, stops) => {
        set(state => ({
          trips: state.trips.map(t => t.id === tripId ? { ...t, stops } : t),
        }));
      },

      addActivity: (tripId, stopId, activity) => {
        const newActivity: Activity = { ...activity, id: generateId() };
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? {
                  ...t,
                  stops: t.stops.map(s =>
                    s.id === stopId
                      ? { ...s, activities: [...s.activities, newActivity] }
                      : s
                  ),
                }
              : t
          ),
        }));
      },

      removeActivity: (tripId, stopId, activityId) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? {
                  ...t,
                  stops: t.stops.map(s =>
                    s.id === stopId
                      ? { ...s, activities: s.activities.filter(a => a.id !== activityId) }
                      : s
                  ),
                }
              : t
          ),
        }));
      },

      addNote: (tripId, note) => {
        const now = new Date().toISOString();
        const newNote: Note = { ...note, id: generateId(), createdAt: now, updatedAt: now };
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId ? { ...t, notes: [...t.notes, newNote] } : t
          ),
        }));
      },

      updateNote: (tripId, noteId, updates) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? {
                  ...t,
                  notes: t.notes.map(n =>
                    n.id === noteId ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
                  ),
                }
              : t
          ),
        }));
      },

      deleteNote: (tripId, noteId) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId ? { ...t, notes: t.notes.filter(n => n.id !== noteId) } : t
          ),
        }));
      },

      addPackingItem: (tripId, item) => {
        const newItem: PackingItem = { ...item, id: generateId() };
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId ? { ...t, packingList: [...t.packingList, newItem] } : t
          ),
        }));
      },

      togglePackingItem: (tripId, itemId) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? {
                  ...t,
                  packingList: t.packingList.map(p =>
                    p.id === itemId ? { ...p, isPacked: !p.isPacked } : p
                  ),
                }
              : t
          ),
        }));
      },

      deletePackingItem: (tripId, itemId) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, packingList: t.packingList.filter(p => p.id !== itemId) }
              : t
          ),
        }));
      },

      resetPackingList: (tripId) => {
        set(state => ({
          trips: state.trips.map(t =>
            t.id === tripId
              ? { ...t, packingList: t.packingList.map(p => ({ ...p, isPacked: false })) }
              : t
          ),
        }));
      },
    }),
    { name: 'traveloop-trips' }
  )
);
