import { create } from 'zustand';

export type NotificationType = 'enrollment' | 'review' | 'completion' | 'certificate' | 'purchase';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  courseName: string;
  userName: string;
  rating?: number;
  read: boolean;
  createdAt: Date;
}

export interface NotificationPreferences {
  inApp: Record<NotificationType, boolean>;
  email: Record<NotificationType, boolean>;
  emailMaster: boolean;
  marketingEmails: boolean;
}

const defaultPreferences: NotificationPreferences = {
  inApp: { enrollment: true, review: true, completion: true, certificate: true, purchase: true },
  email: { enrollment: true, review: true, completion: false, certificate: true, purchase: true },
  emailMaster: true,
  marketingEmails: false,
};

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  setInAppPref: (type: NotificationType, enabled: boolean) => void;
  setEmailPref: (type: NotificationType, enabled: boolean) => void;
}

// Seed with a few initial notifications
const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'enrollment',
    title: 'New Enrollment',
    message: 'Sarah Chen enrolled in your course',
    courseName: 'Python Programming Fundamentals',
    userName: 'Sarah Chen',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: '2',
    type: 'review',
    title: 'New Review',
    message: 'Michael Brown left a 5-star review',
    courseName: 'Data Science with Python',
    userName: 'Michael Brown',
    rating: 5,
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: '3',
    type: 'enrollment',
    title: 'New Enrollment',
    message: 'Emma Wilson enrolled in your course',
    courseName: 'Machine Learning Basics',
    userName: 'Emma Wilson',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: '4',
    type: 'review',
    title: 'New Review',
    message: 'James Lee left a 4-star review',
    courseName: 'Python Programming Fundamentals',
    userName: 'James Lee',
    rating: 4,
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: '5',
    type: 'completion',
    title: 'Course Completed',
    message: 'Lisa Anderson completed your course',
    courseName: 'Advanced Python Techniques',
    userName: 'Lisa Anderson',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
  },
];

// Simulated real-time notifications
const randomNames = ['Alex Turner', 'Priya Sharma', 'Jordan Blake', 'Mei Tanaka', 'Carlos Ruiz', 'Fatima Al-Hassan'];
const randomCourses = ['Python Programming Fundamentals', 'Data Science with Python', 'Machine Learning Basics', 'Advanced Python Techniques'];

let nextId = 10;

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter(n => !n.read).length,
  preferences: { ...defaultPreferences },

  addNotification: (notification) => {
    const { preferences } = get();
    if (!preferences.inApp[notification.type]) return;
    const newNotification: Notification = {
      ...notification,
      id: String(nextId++),
      read: false,
      createdAt: new Date(),
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications].slice(0, 50),
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) =>
    set((state) => {
      const n = state.notifications.find(n => n.id === id);
      if (!n || n.read) return state;
      return {
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        unreadCount: Math.max(0, state.unreadCount - 1),
      };
    }),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  clearAll: () => set({ notifications: [], unreadCount: 0 }),

  updatePreferences: (prefs) =>
    set((state) => ({ preferences: { ...state.preferences, ...prefs } })),

  setInAppPref: (type, enabled) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        inApp: { ...state.preferences.inApp, [type]: enabled },
      },
    })),

  setEmailPref: (type, enabled) =>
    set((state) => ({
      preferences: {
        ...state.preferences,
        email: { ...state.preferences.email, [type]: enabled },
      },
    })),
}));

// Simulate real-time notifications every 30-90 seconds
let intervalId: ReturnType<typeof setInterval> | null = null;

export function startNotificationSimulation() {
  if (intervalId) return;
  intervalId = setInterval(() => {
    const store = useNotificationStore.getState();
    const name = randomNames[Math.floor(Math.random() * randomNames.length)];
    const course = randomCourses[Math.floor(Math.random() * randomCourses.length)];
    const isReview = Math.random() > 0.5;

    if (isReview) {
      const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5
      store.addNotification({
        type: 'review',
        title: 'New Review',
        message: `${name} left a ${rating}-star review`,
        courseName: course,
        userName: name,
        rating,
      });
    } else {
      store.addNotification({
        type: 'enrollment',
        title: 'New Enrollment',
        message: `${name} enrolled in your course`,
        courseName: course,
        userName: name,
      });
    }
  }, Math.random() * 60000 + 30000); // 30-90s
}

export function stopNotificationSimulation() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
