import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  FileText,
  Home,
  LayoutDashboard,
  Search,
  Settings,
  User,
  Users,
  Award,
  GraduationCap,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { useAuthStore } from '@/stores/authStore';
import { mockCourses } from '@/data/mockData';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  href: string;
  icon: React.ReactNode;
  category: string;
}

export function SearchCommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Open on Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Build searchable items
  const searchItems = useMemo(() => {
    const items: SearchResult[] = [];

    // Navigation items
    const navItems: SearchResult[] = [
      { id: 'nav-home', title: 'Home', href: '/', icon: <Home className="h-4 w-4" />, category: 'Navigation' },
      { id: 'nav-catalog', title: 'Browse Courses', href: '/catalog', icon: <BookOpen className="h-4 w-4" />, category: 'Navigation' },
    ];

    // Role-specific navigation
    if (user?.role === 'student') {
      navItems.push(
        { id: 'nav-dashboard', title: 'My Dashboard', href: '/student/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, category: 'Navigation' },
        { id: 'nav-my-courses', title: 'My Courses', href: '/student/courses', icon: <GraduationCap className="h-4 w-4" />, category: 'Navigation' },
        { id: 'nav-bookmarks', title: 'Bookmarks', href: '/student/bookmarks', icon: <FileText className="h-4 w-4" />, category: 'Navigation' },
        { id: 'nav-notes', title: 'Notes', href: '/student/notes', icon: <FileText className="h-4 w-4" />, category: 'Navigation' },
        { id: 'nav-settings', title: 'Settings', href: '/student/settings', icon: <Settings className="h-4 w-4" />, category: 'Navigation' },
      );
    } else if (user?.role === 'instructor') {
      navItems.push(
        { id: 'nav-instructor-dashboard', title: 'Instructor Dashboard', href: '/instructor/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, category: 'Navigation' },
        { id: 'nav-create-course', title: 'Create New Course', href: '/instructor/courses/new', icon: <BookOpen className="h-4 w-4" />, category: 'Navigation' },
      );
    } else if (user?.role === 'admin') {
      navItems.push(
        { id: 'nav-admin-dashboard', title: 'Admin Dashboard', href: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4" />, category: 'Navigation' },
        { id: 'nav-admin-users', title: 'Manage Users', href: '/admin/users', icon: <Users className="h-4 w-4" />, category: 'Navigation' },
        { id: 'nav-admin-courses', title: 'Manage Courses', href: '/admin/courses', icon: <BookOpen className="h-4 w-4" />, category: 'Navigation' },
        { id: 'nav-admin-analytics', title: 'Analytics', href: '/admin/analytics', icon: <Award className="h-4 w-4" />, category: 'Navigation' },
      );
    }

    items.push(...navItems);

    // Courses
    mockCourses.forEach((course) => {
      items.push({
        id: `course-${course.id}`,
        title: course.title,
        description: course.shortDescription,
        href: `/courses/${course.id}`,
        icon: <BookOpen className="h-4 w-4" />,
        category: 'Courses',
      });

      // Lessons from this course
      course.sections.forEach((section) => {
        section.lessons.forEach((lesson) => {
          items.push({
            id: `lesson-${lesson.id}`,
            title: lesson.title,
            description: `${course.title} → ${section.title}`,
            href: `/learn/${course.id}/${lesson.id}`,
            icon: <FileText className="h-4 w-4" />,
            category: 'Lessons',
          });
        });
      });
    });

    return items;
  }, [user]);

  // Filter based on query
  const filteredItems = useMemo(() => {
    if (!query.trim()) return searchItems;
    
    const lowerQuery = query.toLowerCase();
    return searchItems.filter(
      (item) =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description?.toLowerCase().includes(lowerQuery)
    );
  }, [searchItems, query]);

  // Group by category
  const groupedItems = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery('');
    navigate(href);
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search courses, lessons, pages..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {Object.entries(groupedItems).map(([category, items], idx) => (
          <div key={category}>
            {idx > 0 && <CommandSeparator />}
            <CommandGroup heading={category}>
              {items.slice(0, category === 'Lessons' ? 5 : 10).map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.title} ${item.description || ''}`}
                  onSelect={() => handleSelect(item.href)}
                  className="gap-3"
                >
                  <span className="text-muted-foreground">{item.icon}</span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-medium truncate">{item.title}</span>
                    {item.description && (
                      <span className="text-xs text-muted-foreground truncate">
                        {item.description}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
