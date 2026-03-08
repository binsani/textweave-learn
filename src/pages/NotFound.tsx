import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { BookOpen, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const NotFound = () => {
  const location = useLocation();
  useDocumentTitle("Page Not Found - MasashiLearn");

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center py-20">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="font-serif text-5xl font-bold text-foreground mb-3">404</h1>
        <p className="text-xl text-muted-foreground mb-2">Page not found</p>
        <p className="text-sm text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="outline" asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button asChild>
            <Link to="/courses">
              Browse Courses
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
