import { Link, Outlet } from 'react-router-dom';
import { 
  BookOpen, 
  LayoutDashboard, 
  Users, 
  BookCheck, 
  Shield, 
  Settings, 
  LogOut,
  Menu,
  Moon,
  Sun,
  ChevronRight,
  BarChart3,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/courses', label: 'Course Moderation', icon: BookCheck },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout() {
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
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-destructive shrink-0">
              <Shield className="h-5 w-5 text-destructive-foreground" />
            </div>
            {(sidebarOpen || isMobile) && (
              <div className="flex items-center gap-2">
                <span className="font-serif text-xl font-bold text-foreground">MasashiLearn</span>
                <Badge variant="destructive" className="text-xs">Admin</Badge>
              </div>
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
              activeClassName="bg-destructive/10 text-destructive hover:bg-destructive/15 hover:text-destructive"
            >
              <link.icon className="h-5 w-5 shrink-0" />
              {(sidebarOpen || isMobile) && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Theme Toggle */}
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

          {/* Admin Warning Banner */}
          <div className="hidden md:flex items-center gap-2 text-sm text-destructive">
            <Shield className="h-4 w-4" />
            <span className="font-medium">Admin Panel</span>
          </div>

          <div className="flex-1" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-destructive/10 text-destructive font-medium">
                    {user?.name ? getInitials(user.name) : 'A'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <Badge variant="destructive" className="mt-1 text-xs">Admin</Badge>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/settings" className="cursor-pointer">
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
