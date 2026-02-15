import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'icon' | 'full';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useUIStore();

  if (variant === 'full') {
    return (
      <button
        onClick={toggleTheme}
        className={cn(
          'flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
          'text-muted-foreground hover:text-foreground hover:bg-muted',
          className
        )}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className="relative h-5 w-5">
          <Sun className={cn(
            'h-5 w-5 absolute inset-0 transition-all duration-300',
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          )} />
          <Moon className={cn(
            'h-5 w-5 absolute inset-0 transition-all duration-300',
            theme === 'dark' ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
          )} />
        </div>
        <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn('relative overflow-hidden', className)}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <Sun className={cn(
        'h-5 w-5 transition-all duration-300',
        theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
      )} />
      <Moon className={cn(
        'h-5 w-5 absolute transition-all duration-300',
        theme === 'dark' ? '-rotate-90 scale-0' : 'rotate-0 scale-100'
      )} />
    </Button>
  );
}
