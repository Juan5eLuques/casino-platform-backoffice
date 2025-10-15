import { create } from 'zustand';
import type { Notification } from '@/types';

interface UIState {
   sidebarCollapsed: boolean;
   darkMode: boolean;
   notifications: Notification[];
   searchOpen: boolean;
}

interface UIActions {
   toggleSidebar: () => void;
   setSidebarCollapsed: (collapsed: boolean) => void;
   toggleDarkMode: () => void;
   setDarkMode: (darkMode: boolean) => void;
   addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
   markNotificationAsRead: (id: string) => void;
   removeNotification: (id: string) => void;
   clearNotifications: () => void;
   toggleSearch: () => void;
   setSearchOpen: (open: boolean) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>((set, get) => ({
   // State - Sidebar cerrado por defecto en mobile
   sidebarCollapsed: typeof window !== 'undefined' ? window.innerWidth < 1024 : true,
   darkMode: localStorage.getItem('darkMode') === 'true',
   notifications: [],
   searchOpen: false,

   // Actions
   toggleSidebar: () => {
      set(state => ({ sidebarCollapsed: !state.sidebarCollapsed }));
   },

   setSidebarCollapsed: (collapsed: boolean) => {
      set({ sidebarCollapsed: collapsed });
   },

   toggleDarkMode: () => {
      const newDarkMode = !get().darkMode;
      set({ darkMode: newDarkMode });
      localStorage.setItem('darkMode', newDarkMode.toString());

      // Apply dark mode to document
      if (newDarkMode) {
         document.documentElement.classList.add('dark');
      } else {
         document.documentElement.classList.remove('dark');
      }
   },

   setDarkMode: (darkMode: boolean) => {
      set({ darkMode });
      localStorage.setItem('darkMode', darkMode.toString());

      // Apply dark mode to document
      if (darkMode) {
         document.documentElement.classList.add('dark');
      } else {
         document.documentElement.classList.remove('dark');
      }
   },

   addNotification: (notification) => {
      const newNotification: Notification = {
         ...notification,
         id: Date.now().toString(),
         createdAt: new Date().toISOString(),
         read: false,
      };

      set(state => ({
         notifications: [newNotification, ...state.notifications],
      }));
   },

   markNotificationAsRead: (id: string) => {
      set(state => ({
         notifications: state.notifications.map(notification =>
            notification.id === id ? { ...notification, read: true } : notification
         ),
      }));
   },

   removeNotification: (id: string) => {
      set(state => ({
         notifications: state.notifications.filter(notification => notification.id !== id),
      }));
   },

   clearNotifications: () => {
      set({ notifications: [] });
   },

   toggleSearch: () => {
      set(state => ({ searchOpen: !state.searchOpen }));
   },

   setSearchOpen: (open: boolean) => {
      set({ searchOpen: open });
   },
}));

// Initialize dark mode on app start
if (typeof window !== 'undefined') {
   const isDark = localStorage.getItem('darkMode') === 'true';
   if (isDark) {
      document.documentElement.classList.add('dark');
   }
}