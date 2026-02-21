import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // 1. Create instructor user via auth
    const instructorEmail = "instructor@masashi.edu";
    const adminEmail = "admin@masashi.edu";

    let instructorId: string;
    let adminId: string;

    // Create instructor
    const { data: instrAuth, error: instrErr } = await supabase.auth.admin.createUser({
      email: instructorEmail,
      password: "Instructor123!",
      email_confirm: true,
      user_metadata: { first_name: "Sarah", last_name: "Chen" },
    });
    if (instrErr && !instrErr.message.includes("already been registered")) throw instrErr;
    
    if (instrAuth?.user) {
      instructorId = instrAuth.user.id;
    } else {
      // User already exists, find them
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existing = users?.find((u) => u.email === instructorEmail);
      if (!existing) throw new Error("Cannot find instructor user");
      instructorId = existing.id;
    }

    // Create admin
    const { data: adminAuth, error: adminErr } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: "Admin123!",
      email_confirm: true,
      user_metadata: { first_name: "Michael", last_name: "Chen" },
    });
    if (adminErr && !adminErr.message.includes("already been registered")) throw adminErr;

    if (adminAuth?.user) {
      adminId = adminAuth.user.id;
    } else {
      const { data: { users } } = await supabase.auth.admin.listUsers();
      const existing = users?.find((u) => u.email === adminEmail);
      if (!existing) throw new Error("Cannot find admin user");
      adminId = existing.id;
    }

    // 2. Assign roles (upsert)
    await supabase.from("user_roles").upsert(
      [
        { user_id: instructorId, role: "instructor" },
        { user_id: adminId, role: "admin" },
      ],
      { onConflict: "user_id,role" }
    );

    // 3. Create courses
    const courses = [
      {
        title: "Python Programming Fundamentals",
        slug: "python-fundamentals",
        description: "A comprehensive introduction to Python programming covering variables, control flow, functions, and object-oriented programming.",
        short_description: "Learn Python from scratch with hands-on examples and projects.",
        instructor_id: instructorId,
        category: "programming",
        level: "beginner",
        status: "published",
        estimated_hours: 15,
        is_free: true,
        price: 0,
        rating: 4.7,
        review_count: 42,
        enrolled_count: 256,
        learning_objectives: ["Understand Python syntax", "Write functions and classes", "Work with data structures", "Handle files and exceptions"],
        requirements: ["No prior programming experience needed", "A computer with internet access"],
        tags: ["python", "programming", "beginner"],
        published_at: new Date().toISOString(),
      },
      {
        title: "React Development Masterclass",
        slug: "react-masterclass",
        description: "Master modern React development including hooks, state management, and building full-stack applications.",
        short_description: "Build modern web applications with React, TypeScript, and best practices.",
        instructor_id: instructorId,
        category: "programming",
        level: "intermediate",
        status: "published",
        estimated_hours: 24,
        is_free: false,
        price: 49.99,
        rating: 4.9,
        review_count: 67,
        enrolled_count: 189,
        learning_objectives: ["Build React components", "Manage state with hooks", "Implement routing", "Connect to APIs"],
        requirements: ["Basic JavaScript knowledge", "HTML/CSS fundamentals"],
        tags: ["react", "javascript", "web-development"],
        published_at: new Date().toISOString(),
      },
      {
        title: "Data Science with Python",
        slug: "data-science-python",
        description: "Learn data analysis, visualization, and machine learning fundamentals using Python and popular libraries.",
        short_description: "Analyze data and build ML models with pandas, matplotlib, and scikit-learn.",
        instructor_id: instructorId,
        category: "data-science",
        level: "intermediate",
        status: "published",
        estimated_hours: 30,
        is_free: false,
        price: 59.99,
        rating: 4.6,
        review_count: 38,
        enrolled_count: 142,
        learning_objectives: ["Analyze data with pandas", "Create visualizations", "Build ML models", "Work with real datasets"],
        requirements: ["Basic Python knowledge", "High school mathematics"],
        tags: ["data-science", "python", "machine-learning"],
        published_at: new Date().toISOString(),
      },
    ];

    const { data: insertedCourses, error: courseErr } = await supabase
      .from("courses")
      .upsert(courses, { onConflict: "slug" })
      .select("id, slug");
    if (courseErr) throw courseErr;

    // 4. Create sections & lessons for each course
    for (const course of insertedCourses ?? []) {
      const sectionData = getSectionsForCourse(course.slug, course.id);
      
      for (let si = 0; si < sectionData.length; si++) {
        const sec = sectionData[si];
        const { data: section, error: secErr } = await supabase
          .from("sections")
          .upsert({ course_id: course.id, title: sec.title, description: sec.description, order: si }, { onConflict: "course_id,order" })
          .select("id")
          .single();
        if (secErr) throw secErr;

        for (let li = 0; li < sec.lessons.length; li++) {
          const lesson = sec.lessons[li];
          await supabase.from("lessons").upsert(
            {
              section_id: section.id,
              title: lesson.title,
              slug: lesson.slug,
              content: lesson.content,
              order: li,
              reading_time: lesson.readingTime,
              is_free: lesson.isFree,
            },
            { onConflict: "section_id,order" }
          );
        }
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Database seeded successfully",
        instructorEmail,
        instructorPassword: "Instructor123!",
        adminEmail,
        adminPassword: "Admin123!",
        coursesCreated: insertedCourses?.length ?? 0,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getSectionsForCourse(slug: string, courseId: string) {
  if (slug === "python-fundamentals") {
    return [
      {
        title: "Getting Started with Python",
        description: "Set up your environment and learn the basics",
        lessons: [
          {
            title: "Introduction to Python",
            slug: "intro-to-python",
            content: "# Introduction to Python\n\nPython is a high-level, interpreted programming language known for its simplicity and readability.\n\n## Why Learn Python?\n\n- Easy to learn syntax\n- Versatile: web, data science, AI, automation\n- Large community and ecosystem\n- Cross-platform compatibility\n\n## Your First Program\n\n```python\nprint(\"Hello, World!\")\n```\n\nThis simple line demonstrates Python's clean syntax.",
            readingTime: 8,
            isFree: true,
          },
          {
            title: "Variables and Data Types",
            slug: "variables-data-types",
            content: "# Variables and Data Types\n\nVariables store data in Python. You don't need to declare types explicitly.\n\n```python\nname = \"Alice\"    # String\nage = 25          # Integer\nheight = 5.9      # Float\nis_student = True # Boolean\n```\n\n## Common Data Types\n\n| Type | Example |\n|------|--------|\n| str | \"hello\" |\n| int | 42 |\n| float | 3.14 |\n| bool | True |\n| list | [1,2,3] |\n| dict | {\"a\":1} |",
            readingTime: 10,
            isFree: true,
          },
          {
            title: "Control Flow",
            slug: "control-flow",
            content: "# Control Flow\n\nControl flow statements let you make decisions in your code.\n\n## If Statements\n\n```python\nage = 18\nif age >= 18:\n    print(\"Adult\")\nelif age >= 13:\n    print(\"Teenager\")\nelse:\n    print(\"Child\")\n```\n\n## Loops\n\n```python\n# For loop\nfor i in range(5):\n    print(i)\n\n# While loop\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n```",
            readingTime: 12,
            isFree: false,
          },
        ],
      },
      {
        title: "Functions and Modules",
        description: "Learn to organize code with functions",
        lessons: [
          {
            title: "Defining Functions",
            slug: "defining-functions",
            content: "# Defining Functions\n\nFunctions are reusable blocks of code.\n\n```python\ndef greet(name):\n    return f\"Hello, {name}!\"\n\nresult = greet(\"Alice\")\nprint(result)  # Hello, Alice!\n```\n\n## Default Parameters\n\n```python\ndef power(base, exponent=2):\n    return base ** exponent\n\nprint(power(3))    # 9\nprint(power(3, 3)) # 27\n```",
            readingTime: 10,
            isFree: false,
          },
          {
            title: "Working with Modules",
            slug: "working-with-modules",
            content: "# Working with Modules\n\nModules help organize code into separate files.\n\n```python\nimport math\nprint(math.sqrt(16))  # 4.0\n\nfrom datetime import datetime\nnow = datetime.now()\nprint(now)\n```\n\n## Creating Your Own Module\n\nSave functions in a `.py` file and import them:\n\n```python\n# mymodule.py\ndef add(a, b):\n    return a + b\n\n# main.py\nfrom mymodule import add\nprint(add(2, 3))\n```",
            readingTime: 8,
            isFree: false,
          },
        ],
      },
    ];
  }

  if (slug === "react-masterclass") {
    return [
      {
        title: "React Fundamentals",
        description: "Core concepts of React development",
        lessons: [
          {
            title: "Introduction to React",
            slug: "intro-to-react",
            content: "# Introduction to React\n\nReact is a JavaScript library for building user interfaces.\n\n## Key Concepts\n\n- **Components**: Reusable UI building blocks\n- **JSX**: HTML-like syntax in JavaScript\n- **Virtual DOM**: Efficient rendering\n- **Unidirectional data flow**\n\n## Your First Component\n\n```tsx\nfunction Welcome() {\n  return <h1>Hello, React!</h1>;\n}\n```",
            readingTime: 10,
            isFree: true,
          },
          {
            title: "Components and Props",
            slug: "components-props",
            content: "# Components and Props\n\nProps pass data from parent to child components.\n\n```tsx\ninterface CardProps {\n  title: string;\n  description: string;\n}\n\nfunction Card({ title, description }: CardProps) {\n  return (\n    <div>\n      <h2>{title}</h2>\n      <p>{description}</p>\n    </div>\n  );\n}\n```\n\nProps are **read-only** — never modify them directly.",
            readingTime: 12,
            isFree: true,
          },
          {
            title: "State and Hooks",
            slug: "state-hooks",
            content: "# State and Hooks\n\nState lets components remember information between renders.\n\n```tsx\nimport { useState } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  return (\n    <button onClick={() => setCount(count + 1)}>\n      Count: {count}\n    </button>\n  );\n}\n```\n\n## useEffect\n\n```tsx\nuseEffect(() => {\n  document.title = `Count: ${count}`;\n}, [count]);\n```",
            readingTime: 15,
            isFree: false,
          },
        ],
      },
    ];
  }

  // data-science-python
  return [
    {
      title: "Introduction to Data Science",
      description: "Getting started with data analysis",
      lessons: [
        {
          title: "What is Data Science?",
          slug: "what-is-data-science",
          content: "# What is Data Science?\n\nData science combines statistics, programming, and domain expertise to extract insights from data.\n\n## The Data Science Process\n\n1. **Define the question**\n2. **Collect data**\n3. **Clean and explore**\n4. **Model and analyze**\n5. **Communicate results**\n\n## Tools We'll Use\n\n- Python\n- pandas\n- matplotlib\n- scikit-learn",
          readingTime: 8,
          isFree: true,
        },
        {
          title: "Introduction to pandas",
          slug: "intro-pandas",
          content: "# Introduction to pandas\n\npandas is the core library for data manipulation in Python.\n\n```python\nimport pandas as pd\n\n# Create a DataFrame\ndf = pd.DataFrame({\n    'name': ['Alice', 'Bob', 'Charlie'],\n    'age': [25, 30, 35],\n    'city': ['NYC', 'LA', 'Chicago']\n})\n\nprint(df.head())\nprint(df.describe())\n```",
          readingTime: 12,
          isFree: true,
        },
      ],
    },
  ];
}
