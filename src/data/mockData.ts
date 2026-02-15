import type {
  User,
  Course,
  Section,
  Lesson,
  Quiz,
  Question,
  CourseProgress,
  Review,
  StudentStats,
  InstructorStats,
} from '@/types';

// ============================================
// Mock Users
// ============================================

export const mockUsers: User[] = [
  {
    id: 'user-1',
    email: 'student@masashi.edu',
    name: 'Alex Thompson',
    firstName: 'Alex',
    lastName: 'Thompson',
    role: 'student',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    bio: 'Passionate learner exploring programming and data science.',
    createdAt: '2024-01-15T10:00:00Z',
    enrolledCourses: ['course-1', 'course-2', 'course-3'],
  },
  {
    id: 'user-2',
    email: 'instructor@masashi.edu',
    name: 'Dr. Sarah Mitchell',
    firstName: 'Dr. Sarah',
    lastName: 'Mitchell',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    bio: 'Professor of Computer Science with 15 years of teaching experience. Specializing in algorithms and software engineering.',
    createdAt: '2023-06-01T10:00:00Z',
    createdCourses: ['course-1', 'course-4'],
  },
  {
    id: 'user-3',
    email: 'admin@masashi.edu',
    name: 'Michael Chen',
    firstName: 'Michael',
    lastName: 'Chen',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    createdAt: '2023-01-01T10:00:00Z',
  },
  {
    id: 'user-4',
    email: 'instructor2@masashi.edu',
    name: 'Prof. James Anderson',
    firstName: 'Prof. James',
    lastName: 'Anderson',
    role: 'instructor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    bio: 'Data scientist and educator. Former tech lead at major companies.',
    createdAt: '2023-08-15T10:00:00Z',
    createdCourses: ['course-2', 'course-3'],
  },
];

// ============================================
// Sample Lesson Content (Markdown)
// ============================================

const introToPythonContent = `
# Introduction to Python Programming

Python is a high-level, interpreted programming language known for its simplicity and readability. Created by Guido van Rossum and first released in 1991, Python has become one of the most popular programming languages in the world.

## Why Learn Python?

Python's design philosophy emphasizes code readability, and its syntax allows programmers to express concepts in fewer lines of code than would be possible in languages such as C++ or Java.

> "Python is an experiment in how much freedom programmers need. Too much freedom and nobody can read another's code; too little and expressiveness is endangered." — Guido van Rossum

### Key Features

1. **Easy to Learn**: Python has a simple syntax similar to English
2. **Versatile**: Used in web development, data science, AI, and more
3. **Large Community**: Extensive libraries and active support
4. **Cross-Platform**: Works on Windows, macOS, and Linux

## Your First Python Program

Let's write the classic "Hello, World!" program:

\`\`\`python
print("Hello, World!")
\`\`\`

When you run this code, Python will display:

\`\`\`
Hello, World!
\`\`\`

:::info
**Note**: Python uses indentation to define code blocks, which makes the code visually clean and consistent.
:::

## Variables and Data Types

In Python, you don't need to declare variable types explicitly. Python figures out the type based on the value you assign:

\`\`\`python
# String
name = "Alice"

# Integer
age = 25

# Float
height = 5.9

# Boolean
is_student = True
\`\`\`

### Common Data Types

| Type | Example | Description |
|------|---------|-------------|
| str | "hello" | Text strings |
| int | 42 | Whole numbers |
| float | 3.14 | Decimal numbers |
| bool | True/False | Boolean values |
| list | [1, 2, 3] | Ordered collections |
| dict | {"key": "value"} | Key-value pairs |

## Summary

In this lesson, you learned:

- What Python is and why it's popular
- How to write your first Python program
- Basic variable types in Python

In the next lesson, we'll explore control flow with conditions and loops.
`;

const variablesAndTypesContent = `
# Variables and Data Types in Python

Understanding variables and data types is fundamental to programming in Python. In this lesson, we'll explore how Python handles data.

## What Are Variables?

A variable is a named container that stores data. Think of it as a labeled box where you can put information.

\`\`\`python
# Creating variables
message = "Welcome to Masashi LMS!"
student_count = 150
course_rating = 4.8
\`\`\`

:::tip
**Naming Convention**: Use lowercase letters with underscores for variable names (snake_case). This is the Python standard.
:::

## Dynamic Typing

Python is dynamically typed, meaning you don't need to declare the type of a variable. The interpreter determines the type at runtime:

\`\`\`python
x = 10          # x is an integer
x = "ten"       # now x is a string
x = 10.0        # now x is a float
\`\`\`

While flexible, it's good practice to be consistent with types in your code.

## Working with Strings

Strings are sequences of characters enclosed in quotes:

\`\`\`python
# String creation
single = 'Hello'
double = "World"
multi_line = """This is a
multi-line string"""

# String concatenation
greeting = single + " " + double  # "Hello World"

# String formatting (f-strings - recommended)
name = "Alice"
age = 30
intro = f"My name is {name} and I'm {age} years old."
\`\`\`

### Useful String Methods

| Method | Example | Result |
|--------|---------|--------|
| upper() | "hello".upper() | "HELLO" |
| lower() | "HELLO".lower() | "hello" |
| strip() | " hi ".strip() | "hi" |
| split() | "a,b,c".split(",") | ["a","b","c"] |
| join() | "-".join(["a","b"]) | "a-b" |

## Numbers and Math

Python handles both integers and floating-point numbers:

\`\`\`python
# Basic arithmetic
a = 10
b = 3

print(a + b)    # Addition: 13
print(a - b)    # Subtraction: 7
print(a * b)    # Multiplication: 30
print(a / b)    # Division: 3.333...
print(a // b)   # Floor division: 3
print(a % b)    # Modulo: 1
print(a ** b)   # Exponentiation: 1000
\`\`\`

:::warning
**Integer Division**: Use \`//\` for integer division. Regular \`/\` always returns a float, even for whole numbers.
:::

## Collections: Lists and Dictionaries

### Lists

Lists are ordered, mutable collections:

\`\`\`python
fruits = ["apple", "banana", "cherry"]

# Accessing elements
print(fruits[0])      # "apple"
print(fruits[-1])     # "cherry" (last element)

# Modifying
fruits.append("date")
fruits.remove("banana")
\`\`\`

### Dictionaries

Dictionaries store key-value pairs:

\`\`\`python
student = {
    "name": "Alex",
    "age": 22,
    "enrolled": True,
    "courses": ["Python", "Data Science"]
}

# Accessing values
print(student["name"])         # "Alex"
print(student.get("age"))      # 22
\`\`\`

## Type Checking and Conversion

\`\`\`python
# Check types
x = 42
print(type(x))  # <class 'int'>

# Convert types
str_num = "123"
int_num = int(str_num)    # 123 (integer)
float_num = float("3.14") # 3.14 (float)
\`\`\`

## Summary

Key takeaways from this lesson:

- Variables are containers for data
- Python uses dynamic typing
- Strings, numbers, lists, and dictionaries are core data types
- Type conversion is straightforward with built-in functions

Practice these concepts before moving on to control flow!
`;

// ============================================
// Mock Lessons
// ============================================

const pythonLessons: Lesson[] = [
  {
    id: 'lesson-1-1',
    sectionId: 'section-1-1',
    courseId: 'course-1',
    title: 'Introduction to Python',
    slug: 'introduction-to-python',
    content: introToPythonContent,
    order: 1,
    readingTime: 8,
    isFree: true,
    hasQuiz: true,
    quizId: 'quiz-1',
  },
  {
    id: 'lesson-1-2',
    sectionId: 'section-1-1',
    courseId: 'course-1',
    title: 'Variables and Data Types',
    slug: 'variables-and-data-types',
    content: variablesAndTypesContent,
    order: 2,
    readingTime: 12,
    isFree: true,
    hasQuiz: true,
    quizId: 'quiz-2',
  },
  {
    id: 'lesson-1-3',
    sectionId: 'section-1-1',
    courseId: 'course-1',
    title: 'Control Flow: Conditionals',
    slug: 'control-flow-conditionals',
    content: '# Control Flow: Conditionals\n\nLearn how to make decisions in your code...',
    order: 3,
    readingTime: 10,
    isFree: false,
    hasQuiz: true,
  },
  {
    id: 'lesson-1-4',
    sectionId: 'section-1-2',
    courseId: 'course-1',
    title: 'Loops: For and While',
    slug: 'loops-for-and-while',
    content: '# Loops in Python\n\nMaster iteration with for and while loops...',
    order: 1,
    readingTime: 15,
    isFree: false,
    hasQuiz: true,
  },
  {
    id: 'lesson-1-5',
    sectionId: 'section-1-2',
    courseId: 'course-1',
    title: 'Functions and Scope',
    slug: 'functions-and-scope',
    content: '# Functions\n\nLearn to write reusable code with functions...',
    order: 2,
    readingTime: 18,
    isFree: false,
    hasQuiz: true,
  },
];

// ============================================
// Mock Sections
// ============================================

const pythonSections: Section[] = [
  {
    id: 'section-1-1',
    courseId: 'course-1',
    title: 'Getting Started with Python',
    description: 'Learn the fundamentals of Python programming',
    order: 1,
    lessons: pythonLessons.filter(l => l.sectionId === 'section-1-1'),
  },
  {
    id: 'section-1-2',
    courseId: 'course-1',
    title: 'Control Structures',
    description: 'Master loops, conditionals, and functions',
    order: 2,
    lessons: pythonLessons.filter(l => l.sectionId === 'section-1-2'),
  },
  {
    id: 'section-1-3',
    courseId: 'course-1',
    title: 'Data Structures',
    description: 'Work with lists, dictionaries, and more',
    order: 3,
    lessons: [],
  },
];

// ============================================
// Mock Courses
// ============================================

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Python Programming Fundamentals',
    slug: 'python-programming-fundamentals',
    description: 'A comprehensive introduction to Python programming. Learn the fundamentals of one of the most popular programming languages in the world. This course covers everything from basic syntax to advanced concepts.',
    shortDescription: 'Master Python from scratch with hands-on examples and projects.',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
    instructorId: 'user-2',
    instructor: mockUsers.find(u => u.id === 'user-2'),
    category: 'programming',
    tags: ['python', 'programming', 'beginner', 'coding'],
    level: 'beginner',
    status: 'published',
    sections: pythonSections,
    totalLessons: 15,
    totalDuration: 180,
    enrolledCount: 2547,
    enrollmentCount: 2547,
    estimatedHours: 3,
    learningObjectives: [
      'Understand Python syntax and basic programming concepts',
      'Work with variables, data types, and operators',
      'Write functions and organize code effectively',
      'Handle files and exceptions',
      'Build simple Python applications'
    ],
    requirements: [
      'No prior programming experience needed',
      'A computer with internet access',
      'Willingness to learn and practice'
    ],
    rating: 4.8,
    reviewCount: 342,
    price: 0,
    isFree: true,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-06-15T10:00:00Z',
    publishedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'course-2',
    title: 'Data Science with Python',
    slug: 'data-science-python',
    description: 'Learn data analysis, visualization, and machine learning with Python. This comprehensive course covers pandas, numpy, matplotlib, and scikit-learn.',
    shortDescription: 'From data analysis to machine learning - become a data scientist.',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
    instructorId: 'user-4',
    instructor: mockUsers.find(u => u.id === 'user-4'),
    category: 'data-science',
    tags: ['data science', 'python', 'machine learning', 'analytics'],
    level: 'intermediate',
    status: 'published',
    sections: [],
    totalLessons: 24,
    totalDuration: 320,
    enrolledCount: 1823,
    enrollmentCount: 1823,
    estimatedHours: 5,
    learningObjectives: [
      'Master data manipulation with pandas',
      'Create compelling visualizations',
      'Build machine learning models',
      'Analyze real-world datasets'
    ],
    requirements: [
      'Basic Python programming knowledge',
      'Understanding of basic statistics'
    ],
    rating: 4.7,
    reviewCount: 256,
    price: 49.99,
    isFree: false,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-06-20T10:00:00Z',
    publishedAt: '2024-02-15T10:00:00Z',
  },
  {
    id: 'course-3',
    title: 'Advanced JavaScript Patterns',
    slug: 'advanced-javascript-patterns',
    description: 'Master advanced JavaScript concepts including closures, prototypes, async patterns, and design patterns for building scalable applications.',
    shortDescription: 'Take your JavaScript skills to the next level.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800',
    instructorId: 'user-4',
    instructor: mockUsers.find(u => u.id === 'user-4'),
    category: 'programming',
    tags: ['javascript', 'advanced', 'design patterns', 'web development'],
    level: 'advanced',
    status: 'published',
    sections: [],
    totalLessons: 18,
    totalDuration: 240,
    enrolledCount: 956,
    enrollmentCount: 956,
    estimatedHours: 4,
    learningObjectives: [
      'Master JavaScript closures and scope',
      'Understand prototypes and inheritance',
      'Implement async patterns effectively',
      'Apply design patterns in real projects'
    ],
    requirements: [
      'Intermediate JavaScript knowledge',
      'Experience with ES6+ features'
    ],
    rating: 4.9,
    reviewCount: 128,
    price: 59.99,
    isFree: false,
    createdAt: '2024-03-01T10:00:00Z',
    updatedAt: '2024-06-10T10:00:00Z',
    publishedAt: '2024-03-20T10:00:00Z',
  },
  {
    id: 'course-4',
    title: 'Software Engineering Best Practices',
    slug: 'software-engineering-best-practices',
    description: 'Learn professional software development practices including version control, testing, CI/CD, code review, and architectural patterns.',
    shortDescription: 'Write professional, maintainable code like industry experts.',
    thumbnail: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800',
    instructorId: 'user-2',
    instructor: mockUsers.find(u => u.id === 'user-2'),
    category: 'programming',
    tags: ['software engineering', 'best practices', 'testing', 'architecture'],
    level: 'intermediate',
    status: 'published',
    sections: [],
    totalLessons: 20,
    totalDuration: 280,
    enrolledCount: 1245,
    enrollmentCount: 1245,
    estimatedHours: 5,
    learningObjectives: [
      'Master version control with Git',
      'Write effective unit and integration tests',
      'Set up CI/CD pipelines',
      'Apply SOLID principles'
    ],
    requirements: [
      'Basic programming knowledge',
      'Familiarity with at least one programming language'
    ],
    rating: 4.6,
    reviewCount: 189,
    price: 39.99,
    isFree: false,
    createdAt: '2024-04-01T10:00:00Z',
    updatedAt: '2024-06-25T10:00:00Z',
    publishedAt: '2024-04-15T10:00:00Z',
  },
  {
    id: 'course-5',
    title: 'Introduction to Business Analytics',
    slug: 'introduction-business-analytics',
    description: 'Learn how to use data to make better business decisions. Covers Excel, data visualization, and basic statistical analysis.',
    shortDescription: 'Data-driven decision making for business professionals.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    instructorId: 'user-4',
    instructor: mockUsers.find(u => u.id === 'user-4'),
    category: 'business',
    tags: ['business', 'analytics', 'data', 'excel'],
    level: 'beginner',
    status: 'published',
    sections: [],
    totalLessons: 12,
    totalDuration: 150,
    enrolledCount: 2134,
    enrollmentCount: 2134,
    estimatedHours: 3,
    learningObjectives: [
      'Analyze business data effectively',
      'Create professional dashboards',
      'Make data-driven decisions',
      'Present findings to stakeholders'
    ],
    requirements: [
      'Basic Excel knowledge',
      'Interest in business analytics'
    ],
    rating: 4.5,
    reviewCount: 312,
    price: 29.99,
    isFree: false,
    createdAt: '2024-05-01T10:00:00Z',
    updatedAt: '2024-06-28T10:00:00Z',
    publishedAt: '2024-05-10T10:00:00Z',
  },
  {
    id: 'course-6',
    title: 'UI/UX Design Fundamentals',
    slug: 'ui-ux-design-fundamentals',
    description: 'Master the principles of user interface and user experience design. Learn design thinking, wireframing, and prototyping.',
    shortDescription: 'Create beautiful, user-friendly digital experiences.',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
    instructorId: 'user-2',
    instructor: mockUsers.find(u => u.id === 'user-2'),
    category: 'design',
    tags: ['design', 'UI', 'UX', 'user experience'],
    level: 'beginner',
    status: 'published',
    sections: [],
    totalLessons: 16,
    totalDuration: 200,
    enrolledCount: 1678,
    enrollmentCount: 1678,
    estimatedHours: 4,
    learningObjectives: [
      'Apply design thinking methodology',
      'Create wireframes and prototypes',
      'Design intuitive user interfaces',
      'Conduct user research and testing'
    ],
    requirements: [
      'No prior design experience needed',
      'Access to design software (free options available)'
    ],
    rating: 4.7,
    reviewCount: 234,
    price: 44.99,
    isFree: false,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-06-22T10:00:00Z',
    publishedAt: '2024-02-01T10:00:00Z',
  },
];


// ============================================
// Mock Quizzes
// ============================================

export const mockQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    lessonId: 'lesson-1-1',
    title: 'Python Basics Quiz',
    description: 'Test your understanding of Python fundamentals',
    passingScore: 70,
    questions: [
      {
        id: 'q-1-1',
        quizId: 'quiz-1',
        type: 'multiple_choice',
        question: 'What is Python primarily known for?',
        options: [
          'Its complexity and verbosity',
          'Its simplicity and readability',
          'Being exclusively for web development',
          'Only working on Windows',
        ],
        correctAnswer: '1',
        explanation: 'Python is famous for its clean, readable syntax that emphasizes simplicity.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-1-2',
        quizId: 'quiz-1',
        type: 'true_false',
        question: 'Python uses indentation to define code blocks.',
        options: ['True', 'False'],
        correctAnswer: '0',
        explanation: 'Unlike many other languages that use braces, Python uses indentation.',
        points: 10,
        order: 2,
      },
      {
        id: 'q-1-3',
        quizId: 'quiz-1',
        type: 'multiple_choice',
        question: 'Which function is used to display output in Python?',
        options: ['echo()', 'console.log()', 'print()', 'display()'],
        correctAnswer: '2',
        explanation: 'The print() function is used to output text and values in Python.',
        points: 10,
        order: 3,
      },
    ],
  },
];

// ============================================
// Mock Progress Data
// ============================================

export const mockCourseProgress: CourseProgress[] = [
  {
    courseId: 'course-1',
    userId: 'user-1',
    enrolledAt: '2024-06-01T10:00:00Z',
    completedLessons: ['lesson-1-1'],
    totalLessons: 15,
    progressPercentage: 7,
    lastAccessedAt: '2024-06-28T14:30:00Z',
    lastLessonId: 'lesson-1-2',
    certificateEarned: false,
  },
  {
    courseId: 'course-2',
    userId: 'user-1',
    enrolledAt: '2024-06-10T10:00:00Z',
    completedLessons: [],
    totalLessons: 24,
    progressPercentage: 0,
    lastAccessedAt: '2024-06-15T09:00:00Z',
    certificateEarned: false,
  },
  {
    courseId: 'course-3',
    userId: 'user-1',
    enrolledAt: '2024-05-01T10:00:00Z',
    completedLessons: ['l-3-1', 'l-3-2', 'l-3-3', 'l-3-4', 'l-3-5'],
    totalLessons: 18,
    progressPercentage: 28,
    lastAccessedAt: '2024-06-20T16:45:00Z',
    lastLessonId: 'l-3-6',
    certificateEarned: false,
  },
];

// ============================================
// Mock Reviews
// ============================================

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    courseId: 'course-1',
    userId: 'user-1',
    user: mockUsers.find(u => u.id === 'user-1'),
    rating: 5,
    comment: 'Excellent course! The explanations are clear and the examples are practical. Highly recommended for beginners.',
    createdAt: '2024-06-25T10:00:00Z',
    updatedAt: '2024-06-25T10:00:00Z',
  },
  {
    id: 'review-2',
    courseId: 'course-1',
    userId: 'user-5',
    rating: 4,
    comment: 'Great content overall. Would love to see more advanced topics covered.',
    createdAt: '2024-06-20T10:00:00Z',
    updatedAt: '2024-06-20T10:00:00Z',
  },
];

// ============================================
// Mock Statistics
// ============================================

export const mockStudentStats: StudentStats = {
  enrolledCourses: 3,
  completedCourses: 0,
  inProgressCourses: 3,
  totalLearningTime: 45,
  certificatesEarned: 0,
  averageQuizScore: 85,
};

export const mockInstructorStats: InstructorStats = {
  totalCourses: 2,
  publishedCourses: 2,
  draftCourses: 0,
  totalStudents: 3792,
  averageRating: 4.7,
  totalReviews: 531,
  totalRevenue: 45230,
};

// ============================================
// Categories for filtering
// ============================================

export const courseCategories = [
  { value: 'programming', label: 'Programming', count: 45 },
  { value: 'data-science', label: 'Data Science', count: 28 },
  { value: 'business', label: 'Business', count: 32 },
  { value: 'design', label: 'Design', count: 24 },
  { value: 'marketing', label: 'Marketing', count: 18 },
  { value: 'personal-development', label: 'Personal Development', count: 15 },
  { value: 'mathematics', label: 'Mathematics', count: 12 },
  { value: 'science', label: 'Science', count: 20 },
  { value: 'humanities', label: 'Humanities', count: 16 },
  { value: 'language', label: 'Language', count: 22 },
];

export const courseLevels = [
  { value: 'beginner', label: 'Beginner', count: 85 },
  { value: 'intermediate', label: 'Intermediate', count: 95 },
  { value: 'advanced', label: 'Advanced', count: 52 },
];
