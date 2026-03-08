import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  isLeftSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapse: () => void;
  toggleLeftSidebar: () => void;
  
  // Mobile
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  
  // Learning Interface
  lessonSidebarOpen: boolean;
  notesPanelOpen: boolean;
  toggleLessonSidebar: () => void;
  toggleNotesPanel: () => void;
  
  // Dev Mode
  devMode: boolean;
  toggleDevMode: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      },
      setTheme: (theme) => {
        set({ theme });
        document.documentElement.classList.toggle('dark', theme === 'dark');
      },
      
      // Sidebar
      sidebarOpen: true,
      sidebarCollapsed: false,
      isLeftSidebarOpen: true,
      toggleSidebar: () => set({ sidebarOpen: !get().sidebarOpen }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarCollapse: () => set({ sidebarCollapsed: !get().sidebarCollapsed }),
      toggleLeftSidebar: () => set({ isLeftSidebarOpen: !get().isLeftSidebarOpen }),
      
      // Mobile
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      toggleMobileMenu: () => set({ isMobileMenuOpen: !get().isMobileMenuOpen }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      
      // Learning Interface
      lessonSidebarOpen: true,
      notesPanelOpen: false,
      toggleLessonSidebar: () => set({ lessonSidebarOpen: !get().lessonSidebarOpen }),
      toggleNotesPanel: () => set({ notesPanelOpen: !get().notesPanelOpen }),
      
      // Dev Mode
      devMode: true, // Enable by default for development
      toggleDevMode: () => set({ devMode: !get().devMode }),
    }),
    {
      name: 'masashilearn-ui',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        devMode: state.devMode,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme on rehydration
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      },
    }
  )
);
