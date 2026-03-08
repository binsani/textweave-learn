import { Link, Outlet } from 'react-router-dom';
import { 
  BookOpen, 
  LayoutDashboard, 
  GraduationCap, 
  BookMarked, 
  FileText, 
  Settings, 
  LogOut,
  Menu,
  Moon,
  Sun,
  ChevronRight,
  X,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';
import { NavLink } from '@/components/NavLink';
import { useIsMobile } from '@/hooks/use-mobile';

const sidebarLinks = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/courses', label: 'My Courses', icon: GraduationCap },
  { to: '/student/bookmarks', label: 'Bookmarks', icon: BookMarked },
  { to: '/student/notes', label: 'Notes', icon: FileText },
  { to: '/student/certificates', label: 'Certificates', icon: Award },
  { to: '/student/settings', label: 'Settings', icon: Settings },
];

export function StudentLayout() {
  const { theme, toggleTheme, isMobileMenuOpen, setMobileMenuOpen, isLeftSidebarOpen, toggleLeftSidebar } = useUIStore();
  const { user, logout } = useAuthStore();
  const isMobile = useIsMobile();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Use mobile menu state for mobile, sidebar state for desktop
  const sidebarOpen = isMobile ? isMobileMenuOpen : isLeftSidebarOpen;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile backdrop overlay */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r border-border bg-card transition-all duration-300',
          // Mobile styles
          isMobile && 'fixed inset-y-0 left-0 z-50 w-72 shadow-xl',
          isMobile && (isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'),
          // Desktop styles
          !isMobile && 'relative',
          !isMobile && (isLeftSidebarOpen ? 'w-64' : 'w-16')
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link 
            to="/" 
            className={cn('flex items-center gap-2', !sidebarOpen && !isMobile && 'justify-center')}
            onClick={isMobile ? closeMobileMenu : undefined}
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shrink-0">
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            </div>
            {(sidebarOpen || isMobile) && (
              <span className="font-serif text-xl font-bold text-foreground">MasashiLearn</span>
            )}
          </Link>
          
          {/* Mobile close button */}
          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={closeMobileMenu}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close menu</span>
            </Button>
          ) : (
            <button
              onClick={toggleLeftSidebar}
              aria-label={isLeftSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              className={cn(
                'p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
                !isLeftSidebarOpen && 'absolute -right-3 top-6 bg-card border border-border shadow-sm'
              )}
            >
              <ChevronRight className={cn('h-4 w-4 transition-transform', isLeftSidebarOpen && 'rotate-180')} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {sidebarLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={isMobile ? closeMobileMenu : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                'text-muted-foreground hover:text-foreground hover:bg-muted',
                !isMobile && !isLeftSidebarOpen && 'justify-center px-2'
              )}
              activeClassName="bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {(sidebarOpen || isMobile) && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-border">
          <button
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              'text-muted-foreground hover:text-foreground hover:bg-muted',
              !isMobile && !isLeftSidebarOpen && 'justify-center px-2'
            )}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 shrink-0" />
            ) : (
              <Moon className="h-5 w-5 shrink-0" />
            )}
            {(sidebarOpen || isMobile) && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/95 backdrop-blur px-4 md:px-6">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Breadcrumb placeholder */}
          <div className="flex-1" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/student/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
