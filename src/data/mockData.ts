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
// React Course Lesson Content (Markdown)
// ============================================

const reactIntroContent = `
# Introduction to React

React is a powerful JavaScript library for building user interfaces. Created by Facebook (now Meta) in 2013, React has become the most popular front-end library in the world, powering applications like Instagram, Netflix, Airbnb, and countless others.

## What is React?

React is a **declarative**, **component-based** library that makes it painless to create interactive UIs. Instead of manipulating the DOM directly, you describe what you want to see, and React efficiently updates the view when your data changes.

> "React makes it painless to create interactive UIs. Design simple views for each state in your application, and React will efficiently update and render just the right components when your data changes." — React Documentation

### Why React?

1. **Component-Based**: Build encapsulated components that manage their own state
2. **Declarative**: Design simple views for each state in your application
3. **Learn Once, Write Anywhere**: Use React for web, mobile (React Native), and desktop
4. **Virtual DOM**: Efficient rendering through a lightweight DOM representation
5. **Massive Ecosystem**: Thousands of libraries, tools, and community resources

## How React Works

React uses a **Virtual DOM** — a lightweight copy of the actual DOM. When state changes occur:

1. React creates a new Virtual DOM tree
2. It compares it with the previous one (called "diffing")
3. Only the changed elements are updated in the real DOM (called "reconciliation")

This makes React incredibly fast, even for complex applications.

:::info
**Key Concept**: React follows a unidirectional data flow. Data flows from parent components to child components via props, making your app predictable and easier to debug.
:::

## Setting Up Your First React Project

The recommended way to start a new React project is using **Vite**:

\`\`\`bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev
\`\`\`

This creates a project with:
- React 18+ with TypeScript
- Vite for fast development builds
- Hot Module Replacement (HMR)

## Your First React Component

Let's create a simple component:

\`\`\`tsx
function Welcome() {
  return (
    <div>
      <h1>Welcome to React!</h1>
      <p>This is your first component.</p>
    </div>
  );
}

export default Welcome;
\`\`\`

### What is JSX?

The HTML-like syntax you see above is called **JSX** (JavaScript XML). It lets you write UI code that looks like HTML but is actually JavaScript:

\`\`\`tsx
// JSX gets compiled to:
const element = React.createElement(
  'h1',
  null,
  'Hello, World!'
);

// But you write it as:
const element = <h1>Hello, World!</h1>;
\`\`\`

:::tip
**JSX Rules**: Every JSX expression must have a single root element. Use fragments \`<></>\` when you don't want an extra DOM wrapper.
:::

## React Project Structure

A typical React project looks like this:

| File/Folder | Purpose |
|-------------|---------|
| src/App.tsx | Root component |
| src/main.tsx | Entry point |
| src/components/ | Reusable UI components |
| src/pages/ | Page-level components |
| src/hooks/ | Custom React hooks |
| src/types/ | TypeScript type definitions |
| public/ | Static assets |

## Summary

In this lesson, you learned:

- What React is and why it's popular
- How the Virtual DOM works
- How to set up a React project with Vite
- How to write your first JSX component
- The typical React project structure

In the next lesson, we'll dive deep into components and props!
`;

const reactComponentsPropsContent = `
# Components and Props

Components are the building blocks of every React application. In this lesson, you'll learn how to create reusable components and pass data between them using props.

## What Are Components?

A React component is a **self-contained piece of UI** that can be reused throughout your application. Think of components as custom HTML elements with their own logic and styling.

### Function Components

Modern React uses **function components** exclusively:

\`\`\`tsx
// Simple component
function Greeting() {
  return <h1>Hello, World!</h1>;
}

// Arrow function component
const Greeting = () => {
  return <h1>Hello, World!</h1>;
};
\`\`\`

:::info
**Best Practice**: Always start component names with a capital letter. React treats lowercase tags as HTML elements and uppercase as components.
:::

## Understanding Props

Props (short for "properties") are how you pass data from a parent component to a child component. They are **read-only** — a component should never modify its own props.

\`\`\`tsx
// Defining a component with props
interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
  isOnline: boolean;
}

function UserCard({ name, email, avatar, isOnline }: UserCardProps) {
  return (
    <div className="user-card">
      {avatar && <img src={avatar} alt={name} />}
      <h3>{name}</h3>
      <p>{email}</p>
      <span>{isOnline ? '🟢 Online' : '⚫ Offline'}</span>
    </div>
  );
}
\`\`\`

### Using the Component

\`\`\`tsx
function App() {
  return (
    <div>
      <UserCard
        name="Alice Johnson"
        email="alice@example.com"
        avatar="/avatars/alice.jpg"
        isOnline={true}
      />
      <UserCard
        name="Bob Smith"
        email="bob@example.com"
        isOnline={false}
      />
    </div>
  );
}
\`\`\`

## The Children Prop

The special \`children\` prop lets you pass content between a component's opening and closing tags:

\`\`\`tsx
interface CardProps {
  title: string;
  children: React.ReactNode;
}

function Card({ title, children }: CardProps) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
}

// Usage
function App() {
  return (
    <Card title="Welcome">
      <p>This is the card content!</p>
      <button>Click me</button>
    </Card>
  );
}
\`\`\`

## Conditional Rendering

React gives you several ways to conditionally render content:

\`\`\`tsx
function Dashboard({ user, notifications }: DashboardProps) {
  return (
    <div>
      {/* Ternary operator */}
      {user ? <UserProfile user={user} /> : <LoginForm />}

      {/* Logical AND */}
      {notifications.length > 0 && (
        <NotificationBadge count={notifications.length} />
      )}

      {/* Early return pattern */}
      {!user && <p>Please log in to continue.</p>}
    </div>
  );
}
\`\`\`

:::warning
**Avoid this pitfall**: \`{count && <Component />}\` will render \`0\` when count is 0. Use \`{count > 0 && <Component />}\` instead.
:::

## Rendering Lists

Use \`.map()\` to render arrays of data:

\`\`\`tsx
interface Course {
  id: string;
  title: string;
  instructor: string;
}

function CourseList({ courses }: { courses: Course[] }) {
  return (
    <ul>
      {courses.map((course) => (
        <li key={course.id}>
          <h3>{course.title}</h3>
          <p>By {course.instructor}</p>
        </li>
      ))}
    </ul>
  );
}
\`\`\`

:::tip
**Always provide a unique \`key\` prop** when rendering lists. Use a stable identifier like \`id\`, never use array index as key if the list can change.
:::

## Component Composition Patterns

### Container / Presentational Pattern

Separate your logic from your UI:

\`\`\`tsx
// Presentational: Only handles display
function CourseCard({ title, description, rating }: CourseCardProps) {
  return (
    <div className="course-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <StarRating value={rating} />
    </div>
  );
}

// Container: Handles data fetching and logic
function CourseCardContainer({ courseId }: { courseId: string }) {
  const course = useCourse(courseId);
  
  if (!course) return <Skeleton />;
  
  return (
    <CourseCard
      title={course.title}
      description={course.description}
      rating={course.rating}
    />
  );
}
\`\`\`

## Summary

Key takeaways:

- Components are reusable, self-contained pieces of UI
- Props pass data from parent to child components (read-only)
- Use TypeScript interfaces to type your props
- The \`children\` prop enables flexible component composition
- Always use unique \`key\` props when rendering lists
- Follow composition patterns for clean, maintainable code

Next up: State management with useState and useEffect!
`;

const reactStateEffectsContent = `
# State and Side Effects

State is what makes React applications interactive. In this lesson, you'll learn how to manage component state with \`useState\` and handle side effects with \`useEffect\`.

## What is State?

State is **data that changes over time** within a component. When state changes, React automatically re-renders the component to reflect the new data.

### useState Hook

\`\`\`tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}
\`\`\`

:::info
**How it works**: \`useState\` returns an array with two elements — the current value and a function to update it. We use array destructuring to name them.
:::

### State with Complex Types

\`\`\`tsx
interface FormData {
  name: string;
  email: string;
  message: string;
}

function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form>
      <input
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        placeholder="Your name"
      />
      <input
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        placeholder="Your email"
      />
      <textarea
        value={formData.message}
        onChange={(e) => handleChange('message', e.target.value)}
        placeholder="Your message"
      />
    </form>
  );
}
\`\`\`

:::warning
**Never mutate state directly!** Always use the setter function. \`state.push(item)\` won't trigger a re-render — use \`setState([...state, item])\` instead.
:::

## Understanding useEffect

\`useEffect\` lets you perform **side effects** — things like fetching data, setting up subscriptions, or manually changing the DOM.

### Basic Usage

\`\`\`tsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const response = await fetch(\\\`/api/users/\\\${userId}\\\`);
      const data = await response.json();
      setUser(data);
      setLoading(false);
    }

    fetchUser();
  }, [userId]); // Re-run when userId changes

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return <div>{user.name}</div>;
}
\`\`\`

### Dependency Array Rules

| Dependency Array | Behavior |
|-----------------|----------|
| \`useEffect(() => {}, [])\` | Runs once on mount |
| \`useEffect(() => {}, [a, b])\` | Runs when a or b changes |
| \`useEffect(() => {})\` | Runs after every render (avoid!) |

### Cleanup Function

Effects can return a cleanup function that runs before the effect re-runs or when the component unmounts:

\`\`\`tsx
function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    // Cleanup: clear interval when component unmounts
    return () => clearInterval(interval);
  }, []);

  return <p>Timer: {seconds}s</p>;
}
\`\`\`

:::tip
**Always clean up** subscriptions, timers, and event listeners to prevent memory leaks.
:::

## Lifting State Up

When two components need to share state, move the state to their closest common parent:

\`\`\`tsx
function TemperatureConverter() {
  const [celsius, setCelsius] = useState(0);
  const fahrenheit = (celsius * 9) / 5 + 32;

  return (
    <div>
      <TemperatureInput
        label="Celsius"
        value={celsius}
        onChange={setCelsius}
      />
      <TemperatureDisplay
        celsius={celsius}
        fahrenheit={fahrenheit}
      />
    </div>
  );
}
\`\`\`

## Summary

Key takeaways:

- \`useState\` manages local component state
- Always use the setter function — never mutate state directly
- \`useEffect\` handles side effects like data fetching
- The dependency array controls when effects re-run
- Always clean up effects that create subscriptions
- Lift state up to share data between sibling components

Next lesson: React hooks deep dive!
`;

const reactHooksContent = `
# React Hooks Deep Dive

Hooks are functions that let you "hook into" React features. Beyond \`useState\` and \`useEffect\`, React provides several powerful hooks and lets you create your own.

## useRef — Persistent References

\`useRef\` creates a mutable reference that persists across renders without causing re-renders:

\`\`\`tsx
import { useRef, useEffect } from 'react';

function SearchInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the input on mount
    inputRef.current?.focus();
  }, []);

  return <input ref={inputRef} placeholder="Search..." />;
}
\`\`\`

### useRef for Values

\`\`\`tsx
function StopWatch() {
  const [time, setTime] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setTime(prev => prev + 1);
    }, 1000);
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  return (
    <div>
      <p>{time} seconds</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
\`\`\`

## useMemo — Expensive Computations

\`useMemo\` caches the result of an expensive calculation:

\`\`\`tsx
import { useMemo } from 'react';

function CourseList({ courses, searchQuery }: Props) {
  const filteredCourses = useMemo(() => {
    return courses.filter(course =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [courses, searchQuery]);

  return (
    <ul>
      {filteredCourses.map(course => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

:::tip
**When to use useMemo**: Only for genuinely expensive computations. Don't wrap every calculation — React is fast enough for most operations without memoization.
:::

## useCallback — Stable Function References

\`useCallback\` returns a memoized function that only changes when its dependencies change:

\`\`\`tsx
import { useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  return <ChildComponent onClick={handleClick} />;
}
\`\`\`

## Custom Hooks

Custom hooks let you extract component logic into reusable functions:

\`\`\`tsx
// Custom hook for local storage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    const valueToStore = value instanceof Function 
      ? value(storedValue) 
      : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  
  return (
    <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  );
}
\`\`\`

### Custom Hook for Data Fetching

\`\`\`tsx
function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const json = await response.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}
\`\`\`

## Rules of Hooks

| Rule | Explanation |
|------|-------------|
| Only call at the top level | Don't call inside loops, conditions, or nested functions |
| Only call from React functions | Use in function components or custom hooks |
| Start custom hooks with "use" | Convention that enables linting and tooling |

## Summary

- \`useRef\` for DOM references and mutable values that don't trigger re-renders
- \`useMemo\` for caching expensive computations
- \`useCallback\` for stable function references
- Custom hooks extract and share logic between components
- Always follow the Rules of Hooks

Next: Styling and building real-world layouts with Tailwind CSS!
`;

const reactTailwindContent = `
# Styling React with Tailwind CSS

Tailwind CSS is a utility-first CSS framework that pairs perfectly with React's component model. Instead of writing custom CSS, you compose styles using pre-built utility classes.

## Why Tailwind CSS?

Traditional CSS approaches often lead to:
- Naming conflicts and specificity wars
- Unused styles accumulating over time
- Context-switching between CSS and component files

Tailwind solves these by putting styles directly in your markup:

\`\`\`tsx
// Traditional CSS approach
<div className="card">
  <h2 className="card-title">Hello</h2>
</div>

// Tailwind approach
<div className="rounded-lg border bg-white p-6 shadow-sm">
  <h2 className="text-xl font-bold text-gray-900">Hello</h2>
</div>
\`\`\`

## Setting Up Tailwind with React

\`\`\`bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
\`\`\`

Configure \`tailwind.config.js\`:

\`\`\`js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
      },
    },
  },
  plugins: [],
};
\`\`\`

## Core Tailwind Concepts

### Responsive Design

Tailwind uses mobile-first breakpoint prefixes:

\`\`\`tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {courses.map(course => (
    <CourseCard key={course.id} course={course} />
  ))}
</div>
\`\`\`

| Prefix | Min-width | Common devices |
|--------|-----------|---------------|
| (none) | 0px | Mobile |
| sm: | 640px | Large phones |
| md: | 768px | Tablets |
| lg: | 1024px | Laptops |
| xl: | 1280px | Desktops |
| 2xl: | 1536px | Large screens |

### Hover, Focus, and State Variants

\`\`\`tsx
<button className="bg-blue-600 hover:bg-blue-700 focus:ring-2 
  focus:ring-blue-500 active:bg-blue-800 disabled:opacity-50
  transition-colors duration-200">
  Click Me
</button>
\`\`\`

### Dark Mode

\`\`\`tsx
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">
    This adapts to dark mode!
  </h1>
</div>
\`\`\`

## Building a Reusable Component

\`\`\`tsx
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

function Button({ 
  variant = "primary", 
  size = "md", 
  className, 
  children, 
  ...props 
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        {
          "bg-primary text-white hover:bg-primary/90": variant === "primary",
          "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
          "border border-input bg-background hover:bg-accent": variant === "outline",
        },
        {
          "h-8 px-3 text-sm": size === "sm",
          "h-10 px-4": size === "md",
          "h-12 px-6 text-lg": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
\`\`\`

:::tip
**The \`cn()\` utility** merges Tailwind classes intelligently, handling conflicts. Use \`clsx\` + \`tailwind-merge\` for this. It's essential for building flexible components.
:::

## Common Layout Patterns

### Flexbox Layouts

\`\`\`tsx
// Centered content
<div className="flex items-center justify-center min-h-screen">
  <div>Centered!</div>
</div>

// Navbar
<nav className="flex items-center justify-between px-6 py-4">
  <Logo />
  <div className="flex items-center gap-4">
    <NavLinks />
    <UserMenu />
  </div>
</nav>
\`\`\`

### Grid Layouts

\`\`\`tsx
// Dashboard grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard title="Users" value="1,234" />
  <StatCard title="Revenue" value="$5,678" />
  <StatCard title="Courses" value="42" />
  <StatCard title="Rating" value="4.8" />
</div>
\`\`\`

## Summary

- Tailwind CSS uses utility classes for styling directly in JSX
- Responsive design is mobile-first with breakpoint prefixes
- Use \`cn()\` utility for merging classes in reusable components
- Dark mode, hover states, and animations are built-in
- Combine Tailwind with component libraries like shadcn/ui for rapid development

Congratulations on completing the React fundamentals course!
`;

const reactRoutingContent = `
# Routing in React

Single-page applications (SPAs) need client-side routing to navigate between different views without full page reloads. React Router is the standard routing library for React applications.

## Installing React Router

\`\`\`bash
npm install react-router-dom
\`\`\`

## Basic Setup

Wrap your app with \`BrowserRouter\` and define routes:

\`\`\`tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
\`\`\`

## Navigation

Use the \`Link\` component instead of anchor tags:

\`\`\`tsx
import { Link, NavLink } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <NavLink 
        to="/courses" 
        className={({ isActive }) => 
          isActive ? 'text-primary font-bold' : 'text-muted'
        }
      >
        Courses
      </NavLink>
    </nav>
  );
}
\`\`\`

:::info
**NavLink vs Link**: Use \`NavLink\` when you need active state styling (like in navigation menus). Use \`Link\` for regular navigation.
:::

## Dynamic Routes and URL Parameters

\`\`\`tsx
import { useParams } from 'react-router-dom';

function CourseDetail() {
  const { id } = useParams<{ id: string }>();

  return <h1>Course ID: {id}</h1>;
}
\`\`\`

## Programmatic Navigation

\`\`\`tsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    navigate('/dashboard');
  };

  return <button onClick={handleLogin}>Log In</button>;
}
\`\`\`

## Nested Routes and Layouts

\`\`\`tsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Route>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

function PublicLayout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </div>
  );
}
\`\`\`

## Protected Routes

\`\`\`tsx
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

// Usage
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  } 
/>
\`\`\`

## Summary

- React Router handles client-side navigation in SPAs
- Use \`Link\` and \`NavLink\` for declarative navigation
- \`useParams\` extracts URL parameters
- \`useNavigate\` enables programmatic navigation
- Nested routes with \`Outlet\` create layout hierarchies
- Protected routes guard authenticated content
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

const reactLessons: Lesson[] = [
  {
    id: 'lesson-7-1',
    sectionId: 'section-7-1',
    courseId: 'course-7',
    title: 'Introduction to React',
    slug: 'introduction-to-react',
    content: reactIntroContent,
    order: 1,
    readingTime: 12,
    isFree: true,
    hasQuiz: true,
    quizId: 'quiz-3',
  },
  {
    id: 'lesson-7-2',
    sectionId: 'section-7-1',
    courseId: 'course-7',
    title: 'Components and Props',
    slug: 'components-and-props',
    content: reactComponentsPropsContent,
    order: 2,
    readingTime: 15,
    isFree: true,
    hasQuiz: true,
    quizId: 'quiz-4',
  },
  {
    id: 'lesson-7-3',
    sectionId: 'section-7-2',
    courseId: 'course-7',
    title: 'State and Side Effects',
    slug: 'state-and-side-effects',
    content: reactStateEffectsContent,
    order: 1,
    readingTime: 14,
    isFree: false,
    hasQuiz: true,
    quizId: 'quiz-5',
  },
  {
    id: 'lesson-7-4',
    sectionId: 'section-7-2',
    courseId: 'course-7',
    title: 'React Hooks Deep Dive',
    slug: 'react-hooks-deep-dive',
    content: reactHooksContent,
    order: 2,
    readingTime: 16,
    isFree: false,
    hasQuiz: false,
  },
  {
    id: 'lesson-7-5',
    sectionId: 'section-7-3',
    courseId: 'course-7',
    title: 'Routing in React',
    slug: 'routing-in-react',
    content: reactRoutingContent,
    order: 1,
    readingTime: 10,
    isFree: false,
    hasQuiz: false,
  },
  {
    id: 'lesson-7-6',
    sectionId: 'section-7-3',
    courseId: 'course-7',
    title: 'Styling with Tailwind CSS',
    slug: 'styling-with-tailwind-css',
    content: reactTailwindContent,
    order: 2,
    readingTime: 13,
    isFree: false,
    hasQuiz: false,
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

const reactSections: Section[] = [
  {
    id: 'section-7-1',
    courseId: 'course-7',
    title: 'React Fundamentals',
    description: 'Core concepts: JSX, components, and props',
    order: 1,
    lessons: reactLessons.filter(l => l.sectionId === 'section-7-1'),
  },
  {
    id: 'section-7-2',
    courseId: 'course-7',
    title: 'State Management & Hooks',
    description: 'Managing state, side effects, and custom hooks',
    order: 2,
    lessons: reactLessons.filter(l => l.sectionId === 'section-7-2'),
  },
  {
    id: 'section-7-3',
    courseId: 'course-7',
    title: 'Building Real Applications',
    description: 'Routing, styling, and production patterns',
    order: 3,
    lessons: reactLessons.filter(l => l.sectionId === 'section-7-3'),
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
  {
    id: 'course-7',
    title: 'Web Development with React',
    slug: 'web-development-with-react',
    description: 'A comprehensive guide to building modern web applications with React. Learn component architecture, state management, hooks, routing, and styling with Tailwind CSS. This text-based course takes you from React fundamentals to building production-ready applications.',
    shortDescription: 'Build modern web apps with React, hooks, and Tailwind CSS.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    instructorId: 'user-2',
    instructor: mockUsers.find(u => u.id === 'user-2'),
    category: 'programming',
    tags: ['react', 'javascript', 'typescript', 'tailwind', 'web development', 'frontend'],
    level: 'intermediate',
    status: 'published',
    sections: reactSections,
    totalLessons: 6,
    totalDuration: 80,
    enrolledCount: 3182,
    enrollmentCount: 3182,
    estimatedHours: 2,
    learningObjectives: [
      'Understand React component architecture and JSX',
      'Master state management with useState and useEffect',
      'Build custom hooks for reusable logic',
      'Implement client-side routing with React Router',
      'Style applications using Tailwind CSS utility classes',
      'Follow best practices for production React applications'
    ],
    requirements: [
      'Basic HTML, CSS, and JavaScript knowledge',
      'Familiarity with ES6+ syntax (arrow functions, destructuring)',
      'Node.js installed on your computer',
      'A code editor (VS Code recommended)'
    ],
    rating: 4.9,
    reviewCount: 487,
    price: 0,
    isFree: true,
    createdAt: '2025-01-10T10:00:00Z',
    updatedAt: '2025-02-15T10:00:00Z',
    publishedAt: '2025-01-20T10:00:00Z',
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
  {
    id: 'quiz-3',
    lessonId: 'lesson-7-1',
    title: 'React Fundamentals Quiz',
    description: 'Test your understanding of React basics and JSX',
    passingScore: 70,
    questions: [
      {
        id: 'q-3-1',
        quizId: 'quiz-3',
        type: 'multiple_choice',
        question: 'What does React use to efficiently update the DOM?',
        options: ['Shadow DOM', 'Virtual DOM', 'Real DOM manipulation', 'Web Workers'],
        correctAnswer: '1',
        explanation: 'React uses a Virtual DOM — a lightweight JavaScript representation of the real DOM — to calculate the minimal set of changes needed.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-3-2',
        quizId: 'quiz-3',
        type: 'true_false',
        question: 'JSX is a separate language from JavaScript.',
        options: ['True', 'False'],
        correctAnswer: '1',
        explanation: 'JSX is not a separate language — it\'s a syntax extension that gets compiled to regular JavaScript (React.createElement calls).',
        points: 10,
        order: 2,
      },
      {
        id: 'q-3-3',
        quizId: 'quiz-3',
        type: 'multiple_choice',
        question: 'Which tool is recommended for creating a new React project?',
        options: ['Create React App', 'Webpack', 'Vite', 'Parcel'],
        correctAnswer: '2',
        explanation: 'Vite is the modern recommended tool for new React projects, offering fast builds and hot module replacement.',
        points: 10,
        order: 3,
      },
    ],
  },
  {
    id: 'quiz-4',
    lessonId: 'lesson-7-2',
    title: 'Components & Props Quiz',
    description: 'Test your knowledge of React components and props',
    passingScore: 70,
    questions: [
      {
        id: 'q-4-1',
        quizId: 'quiz-4',
        type: 'multiple_choice',
        question: 'What is the correct way to pass data from a parent to a child component?',
        options: ['State', 'Props', 'Context', 'Refs'],
        correctAnswer: '1',
        explanation: 'Props (properties) are the primary mechanism for passing data from parent to child components in React.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-4-2',
        quizId: 'quiz-4',
        type: 'true_false',
        question: 'A React component can modify the props it receives.',
        options: ['True', 'False'],
        correctAnswer: '1',
        explanation: 'Props are read-only. A component should never modify its own props — this is a core principle of React.',
        points: 10,
        order: 2,
      },
      {
        id: 'q-4-3',
        quizId: 'quiz-4',
        type: 'multiple_choice',
        question: 'Why is the "key" prop important when rendering lists?',
        options: [
          'It makes the list look better',
          'It helps React identify which items changed, were added, or removed',
          'It sorts the list automatically',
          'It is required by JavaScript'
        ],
        correctAnswer: '1',
        explanation: 'Keys help React identify which items have changed, been added, or removed, enabling efficient re-rendering of lists.',
        points: 10,
        order: 3,
      },
    ],
  },
  {
    id: 'quiz-5',
    lessonId: 'lesson-7-3',
    title: 'State & Effects Quiz',
    description: 'Test your understanding of useState and useEffect',
    passingScore: 70,
    questions: [
      {
        id: 'q-5-1',
        quizId: 'quiz-5',
        type: 'multiple_choice',
        question: 'What happens when you call a setState function in React?',
        options: [
          'The page reloads',
          'The component re-renders with the new state',
          'Nothing visible happens',
          'The DOM is directly modified'
        ],
        correctAnswer: '1',
        explanation: 'Calling a state setter triggers a re-render of the component with the updated state value.',
        points: 10,
        order: 1,
      },
      {
        id: 'q-5-2',
        quizId: 'quiz-5',
        type: 'true_false',
        question: 'useEffect with an empty dependency array [] runs after every render.',
        options: ['True', 'False'],
        correctAnswer: '1',
        explanation: 'An empty dependency array means the effect runs only once — after the initial mount. It does NOT run after every render.',
        points: 10,
        order: 2,
      },
      {
        id: 'q-5-3',
        quizId: 'quiz-5',
        type: 'multiple_choice',
        question: 'What is the purpose of the cleanup function returned from useEffect?',
        options: [
          'To reset state to initial values',
          'To cancel subscriptions and prevent memory leaks',
          'To log errors to the console',
          'To re-run the effect immediately'
        ],
        correctAnswer: '1',
        explanation: 'The cleanup function runs before the effect re-runs or when the component unmounts, preventing memory leaks from subscriptions, timers, etc.',
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
