import { CourseApprovalList } from '@/components/admin';

export default function AdminCourses() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
          Course Moderation
        </h1>
        <p className="text-muted-foreground">
          Review and approve course submissions from instructors
        </p>
      </div>

      {/* Course Approval List */}
      <CourseApprovalList />
    </div>
  );
}
