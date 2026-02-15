import { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, BookOpen, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { mockCourses } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { CourseCard, CourseCardSkeleton } from '@/components/course';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'programming', label: 'Programming' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'design', label: 'Design' },
  { value: 'business', label: 'Business' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'personal-development', label: 'Personal Development' },
  { value: 'mathematics', label: 'Mathematics' },
  { value: 'science', label: 'Science' },
];

const levels = [
  { value: 'all', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
];

const COURSES_PER_PAGE = 9;

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFreeOnly, setShowFreeOnly] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [isLevelOpen, setIsLevelOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedLevel, sortBy, showFreeOnly]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedLevel, sortBy, showFreeOnly]);

  const publishedCourses = mockCourses.filter(c => c.status === 'published');

  const filteredCourses = useMemo(() => {
    let courses = [...publishedCourses];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      courses = courses.filter(
        c =>
          c.title.toLowerCase().includes(query) ||
          c.description.toLowerCase().includes(query) ||
          c.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      courses = courses.filter(c => c.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'all') {
      courses = courses.filter(c => c.level === selectedLevel);
    }

    // Free only filter
    if (showFreeOnly) {
      courses = courses.filter(c => c.price === 0);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        courses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'rating':
        courses.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        courses.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        courses.sort((a, b) => b.price - a.price);
        break;
      default:
        courses.sort((a, b) => b.enrolledCount - a.enrolledCount);
    }

    return courses;
  }, [searchQuery, selectedCategory, selectedLevel, sortBy, showFreeOnly, publishedCourses]);

  // Pagination
  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE);
  const paginatedCourses = useMemo(() => {
    const start = (currentPage - 1) * COURSES_PER_PAGE;
    return filteredCourses.slice(start, start + COURSES_PER_PAGE);
  }, [filteredCourses, currentPage]);

  const activeFiltersCount = [
    selectedCategory !== 'all',
    selectedLevel !== 'all',
    showFreeOnly,
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedLevel('all');
    setShowFreeOnly(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search - Mobile only */}
      <div className="lg:hidden relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      <Collapsible open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold text-foreground hover:text-primary transition-colors">
          <span>Categories</span>
          <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isCategoryOpen && 'rotate-180')} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-1">
          {categories.map((category) => (
            <button
              key={category.value}
              onClick={() => {
                setSelectedCategory(category.value);
                setMobileFiltersOpen(false);
              }}
              className={cn(
                'block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
                selectedCategory === category.value
                  ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {category.label}
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Levels */}
      <Collapsible open={isLevelOpen} onOpenChange={setIsLevelOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-semibold text-foreground hover:text-primary transition-colors">
          <span>Skill Level</span>
          <ChevronDown className={cn('h-4 w-4 transition-transform duration-200', isLevelOpen && 'rotate-180')} />
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2 space-y-1">
          {levels.map((level) => (
            <button
              key={level.value}
              onClick={() => {
                setSelectedLevel(level.value);
                setMobileFiltersOpen(false);
              }}
              className={cn(
                'block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200',
                selectedLevel === level.value
                  ? 'bg-primary/10 text-primary font-medium border-l-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {level.label}
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>

      {/* Free Only */}
      <div className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-muted transition-colors">
        <Checkbox
          id="free-only"
          checked={showFreeOnly}
          onCheckedChange={(checked) => setShowFreeOnly(checked === true)}
        />
        <label
          htmlFor="free-only"
          className="text-sm font-medium cursor-pointer flex-1"
        >
          Free courses only
        </label>
      </div>

      {/* Clear filters button */}
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="w-full text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-2" />
          Clear all filters
        </Button>
      )}
    </div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('ellipsis');
      }
      
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('ellipsis');
      }
      
      pages.push(totalPages);
    }

    return (
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className={cn(currentPage === 1 && 'pointer-events-none opacity-50', 'cursor-pointer')}
            />
          </PaginationItem>
          
          {pages.map((page, idx) => (
            <PaginationItem key={idx}>
              {page === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className={cn(currentPage === totalPages && 'pointer-events-none opacity-50', 'cursor-pointer')}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-muted/30 border-b border-border py-12">
        <div className="container mx-auto px-4">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Course Catalog
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            Explore our comprehensive library of text-based courses designed for deep learning and lasting comprehension.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background"
                />
              </div>

              <FilterContent />
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredCourses.length}</span> courses
                </p>
                
                {/* Active filters badges */}
                {activeFiltersCount > 0 && (
                  <div className="hidden sm:flex items-center gap-2">
                    {selectedCategory !== 'all' && (
                      <Badge 
                        variant="secondary" 
                        className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setSelectedCategory('all')}
                      >
                        {categories.find(c => c.value === selectedCategory)?.label}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                    {selectedLevel !== 'all' && (
                      <Badge 
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setSelectedLevel('all')}
                      >
                        {levels.find(l => l.value === selectedLevel)?.label}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                    {showFreeOnly && (
                      <Badge 
                        variant="secondary"
                        className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setShowFreeOnly(false)}
                      >
                        Free only
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Filters
                      {activeFiltersCount > 0 && (
                        <Badge variant="default" className="ml-2 h-5 w-5 p-0 justify-center">
                          {activeFiltersCount}
                        </Badge>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filter Courses</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-background">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <CourseCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredCourses.length === 0 ? (
              /* Empty State */
              <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed border-border">
                <BookOpen className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="font-serif text-xl font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any courses matching your criteria. Try adjusting your filters or search query.
                </p>
                <Button onClick={clearAllFilters}>
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Course Grid */}
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                {/* Pagination */}
                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
