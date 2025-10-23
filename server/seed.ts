import "dotenv/config";
import { storage } from "./storage";

async function seedDatabase() {
  console.log("🌱 Starting database seeding...");

  try {
    // Check if admin user already exists
    let adminUser = await storage.getUserByEmail("admin@lumoraed.com");
    
    if (!adminUser) {
      console.log("👤 Creating admin user...");
      adminUser = await storage.createUser({
        email: "admin@lumoraed.com",
        name: "Admin User",
        firebaseUid: "admin-user-123",
        role: "admin"
      });
      console.log("✅ Admin user created:", adminUser.email);
    } else {
      console.log("✅ Admin user already exists:", adminUser.email);
    }

    // Create comprehensive programming challenges
    console.log("📚 Creating comprehensive programming challenges...");
    
    // 10-Day Challenges
    const python10Day = await storage.createChallenge({
      title: "10 Days Python Bootcamp",
      description: "Intensive 10-day Python programming bootcamp covering fundamentals, data structures, and basic algorithms. Perfect for beginners who want to get started quickly.",
      duration: 10,
      createdBy: adminUser.id
    });

    const javascript10Day = await storage.createChallenge({
      title: "10 Days JavaScript Mastery",
      description: "Fast-track JavaScript learning covering ES6+, DOM manipulation, async programming, and modern JavaScript features.",
      duration: 10,
      createdBy: adminUser.id
    });

    // 30-Day Challenges
    const python30Day = await storage.createChallenge({
      title: "30 Days Python Programming",
      description: "Comprehensive Python programming course covering fundamentals, OOP, data structures, algorithms, web development with Flask/Django, and data analysis.",
      duration: 30,
      createdBy: adminUser.id
    });

    const java30Day = await storage.createChallenge({
      title: "30 Days Java Development",
      description: "Master Java programming from basics to advanced concepts including OOP, collections, multithreading, Spring framework, and enterprise development.",
      duration: 30,
      createdBy: adminUser.id
    });

    const webDev30Day = await storage.createChallenge({
      title: "30 Days Full-Stack Web Development",
      description: "Complete web development course covering HTML, CSS, JavaScript, React, Node.js, databases, and deployment. Build real projects.",
      duration: 30,
      createdBy: adminUser.id
    });

    // 60-Day Challenges
    const python60Day = await storage.createChallenge({
      title: "60 Days Python Data Science",
      description: "Comprehensive data science program with Python covering pandas, numpy, matplotlib, scikit-learn, machine learning, deep learning, and real-world projects.",
      duration: 60,
      createdBy: adminUser.id
    });

    const systemDesign60Day = await storage.createChallenge({
      title: "60 Days System Design & Architecture",
      description: "Master system design principles, microservices, cloud architecture, scalability, databases, caching, and build production-ready systems.",
      duration: 60,
      createdBy: adminUser.id
    });

    const mobileDev60Day = await storage.createChallenge({
      title: "60 Days Mobile App Development",
      description: "Complete mobile development course covering React Native, Flutter, iOS/Android development, app store deployment, and cross-platform solutions.",
      duration: 60,
      createdBy: adminUser.id
    });

    console.log("✅ Challenges created:", [
      python10Day.title, javascript10Day.title,
      python30Day.title, java30Day.title, webDev30Day.title,
      python60Day.title, systemDesign60Day.title, mobileDev60Day.title
    ]);

    // Create tasks for 10-Day Python Bootcamp
    console.log("📝 Creating tasks for 10-Day Python Bootcamp...");
    const python10DayTasks = [
      {
        dayNumber: 1,
        title: "Python Setup & Basics",
        content: "Set up Python environment, learn syntax, variables, data types (int, float, string, boolean), and basic operations. Practice with simple calculations.",
        resourceLinks: [
          { type: "video", title: "Python Tutorial for Beginners", url: "https://www.youtube.com/watch?v=kqtD5dpn9C8" },
          { type: "practice", title: "HackerRank Python Basic", url: "https://www.hackerrank.com/domains/python" },
          { type: "documentation", title: "Python Official Docs", url: "https://docs.python.org/3/tutorial/" }
        ]
      },
      {
        dayNumber: 2,
        title: "Control Structures & Logic",
        content: "Master if/else statements, comparison operators, logical operators, and nested conditions. Practice with real-world scenarios.",
        resourceLinks: [
          { type: "video", title: "Python If/Else Statements", url: "https://www.youtube.com/watch?v=AWek49wXGzI" },
          { type: "practice", title: "LeetCode Easy Problems", url: "https://leetcode.com/problemset/all/?difficulty=Easy" },
          { type: "practice", title: "CodingBat Python", url: "https://codingbat.com/python" }
        ]
      },
      {
        dayNumber: 3,
        title: "Loops & Iteration",
        content: "Learn for loops, while loops, range() function, break/continue statements. Practice with iteration patterns and nested loops.",
        resourceLinks: [
          { type: "video", title: "Python Loops Tutorial", url: "https://www.youtube.com/watch?v=OnDr4JpUXPc" },
          { type: "practice", title: "HackerRank Python Loops", url: "https://www.hackerrank.com/domains/python/py-introduction" },
          { type: "practice", title: "LeetCode Array Problems", url: "https://leetcode.com/tag/array/" }
        ]
      },
      {
        dayNumber: 4,
        title: "Functions & Scope",
        content: "Create reusable code with functions, understand parameters, return values, scope, and lambda functions. Practice with function design.",
        resourceLinks: [
          { type: "video", title: "Python Functions", url: "https://www.youtube.com/watch?v=9Os0o3wzS_I" },
          { type: "practice", title: "HackerRank Functions", url: "https://www.hackerrank.com/domains/python/py-function" },
          { type: "documentation", title: "Python Functions Guide", url: "https://docs.python.org/3/tutorial/controlflow.html#defining-functions" }
        ]
      },
      {
        dayNumber: 5,
        title: "Data Structures - Lists & Tuples",
        content: "Master Python lists, tuples, list methods, list comprehensions, slicing, and common operations. Practice with data manipulation.",
        resourceLinks: [
          { type: "video", title: "Python Lists Tutorial", url: "https://www.youtube.com/watch?v=ohCDWZgNIU0" },
          { type: "practice", title: "HackerRank Lists", url: "https://www.hackerrank.com/domains/python/py-basic-data-types" },
          { type: "practice", title: "LeetCode Array Manipulation", url: "https://leetcode.com/tag/array/" }
        ]
      },
      {
        dayNumber: 6,
        title: "Dictionaries & Sets",
        content: "Learn dictionaries, sets, dictionary methods, set operations, and when to use each data structure. Practice with key-value operations.",
        resourceLinks: [
          { type: "video", title: "Python Dictionaries", url: "https://www.youtube.com/watch?v=daefaLgNkw0" },
          { type: "practice", title: "HackerRank Dictionaries", url: "https://www.hackerrank.com/domains/python/py-basic-data-types" },
          { type: "practice", title: "LeetCode Hash Table", url: "https://leetcode.com/tag/hash-table/" }
        ]
      },
      {
        dayNumber: 7,
        title: "String Manipulation",
        content: "Master string methods, formatting, regular expressions, and text processing. Practice with string algorithms and parsing.",
        resourceLinks: [
          { type: "video", title: "Python Strings", url: "https://www.youtube.com/watch?v=k9TUPpGqYTo" },
          { type: "practice", title: "HackerRank Strings", url: "https://www.hackerrank.com/domains/python/py-strings" },
          { type: "practice", title: "LeetCode String Problems", url: "https://leetcode.com/tag/string/" }
        ]
      },
      {
        dayNumber: 8,
        title: "File I/O & Error Handling",
        content: "Learn file operations, reading/writing files, exception handling with try/except, and best practices for file management.",
        resourceLinks: [
          { type: "video", title: "Python File I/O", url: "https://www.youtube.com/watch?v=Uh2ebFW8OYM" },
          { type: "practice", title: "HackerRank File I/O", url: "https://www.hackerrank.com/domains/python/py-io" },
          { type: "documentation", title: "Python File Operations", url: "https://docs.python.org/3/tutorial/inputoutput.html" }
        ]
      },
      {
        dayNumber: 9,
        title: "Object-Oriented Programming",
        content: "Learn classes, objects, inheritance, polymorphism, and encapsulation. Practice with OOP design principles.",
        resourceLinks: [
          { type: "video", title: "Python OOP", url: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM" },
          { type: "practice", title: "HackerRank Classes", url: "https://www.hackerrank.com/domains/python/py-classes" },
          { type: "practice", title: "LeetCode OOP Problems", url: "https://leetcode.com/tag/object-oriented-programming/" }
        ]
      },
      {
        dayNumber: 10,
        title: "Final Project & Review",
        content: "Build a complete Python project combining all concepts learned. Create a calculator, text analyzer, or simple game. Review and practice.",
        resourceLinks: [
          { type: "video", title: "Python Project Ideas", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "HackerRank Final Challenge", url: "https://www.hackerrank.com/domains/python" },
          { type: "practice", title: "LeetCode Medium Problems", url: "https://leetcode.com/problemset/all/?difficulty=Medium" }
        ]
      }
    ];

    for (const taskData of python10DayTasks) {
      await storage.createTask({
        challengeId: python10Day.id,
        dayNumber: taskData.dayNumber,
        title: taskData.title,
        content: taskData.content,
        resourceLinks: taskData.resourceLinks
      });
    }

    // Create tasks for 30-Day Python Programming
    console.log("📝 Creating tasks for 30-Day Python Programming...");
    const python30DayTasks = [
      // Week 1: Fundamentals
      {
        dayNumber: 1,
        title: "Python Environment & Setup",
        content: "Set up Python development environment, learn about virtual environments, pip, and project structure. Install essential packages.",
        resourceLinks: [
          { type: "video", title: "Python Setup Guide", url: "https://www.youtube.com/watch?v=YYXdXT2l-Gg" },
          { type: "practice", title: "HackerRank Python Basic", url: "https://www.hackerrank.com/domains/python" },
          { type: "documentation", title: "Python Installation", url: "https://docs.python.org/3/using/index.html" }
        ]
      },
      {
        dayNumber: 2,
        title: "Variables, Data Types & Operations",
        content: "Master Python variables, data types (int, float, string, boolean, complex), type conversion, and arithmetic operations.",
        resourceLinks: [
          { type: "video", title: "Python Data Types", url: "https://www.youtube.com/watch?v=cQT33yu9pY8" },
          { type: "practice", title: "LeetCode Easy Problems", url: "https://leetcode.com/problemset/all/?difficulty=Easy" },
          { type: "practice", title: "HackerRank Data Types", url: "https://www.hackerrank.com/domains/python/py-basic-data-types" }
        ]
      },
      {
        dayNumber: 3,
        title: "Control Flow & Logic",
        content: "Learn if/else statements, comparison operators, logical operators, ternary operators, and nested conditions.",
        resourceLinks: [
          { type: "video", title: "Python Control Flow", url: "https://www.youtube.com/watch?v=AWek49wXGzI" },
          { type: "practice", title: "LeetCode Conditional Problems", url: "https://leetcode.com/tag/conditional/" },
          { type: "practice", title: "HackerRank Conditionals", url: "https://www.hackerrank.com/domains/python/py-if-else" }
        ]
      },
      {
        dayNumber: 4,
        title: "Loops & Iteration",
        content: "Master for loops, while loops, range(), enumerate(), zip(), break/continue, and nested loops.",
        resourceLinks: [
          { type: "video", title: "Python Loops", url: "https://www.youtube.com/watch?v=OnDr4JpUXPc" },
          { type: "practice", title: "LeetCode Loop Problems", url: "https://leetcode.com/tag/loop/" },
          { type: "practice", title: "HackerRank Loops", url: "https://www.hackerrank.com/domains/python/py-loops" }
        ]
      },
      {
        dayNumber: 5,
        title: "Functions & Scope",
        content: "Create functions, understand parameters, return values, scope, lambda functions, and function decorators.",
        resourceLinks: [
          { type: "video", title: "Python Functions", url: "https://www.youtube.com/watch?v=9Os0o3wzS_I" },
          { type: "practice", title: "LeetCode Function Problems", url: "https://leetcode.com/tag/function/" },
          { type: "practice", title: "HackerRank Functions", url: "https://www.hackerrank.com/domains/python/py-function" }
        ]
      },
      {
        dayNumber: 6,
        title: "Data Structures - Lists",
        content: "Master Python lists, list methods, list comprehensions, slicing, and advanced list operations.",
        resourceLinks: [
          { type: "video", title: "Python Lists", url: "https://www.youtube.com/watch?v=ohCDWZgNIU0" },
          { type: "practice", title: "LeetCode Array Problems", url: "https://leetcode.com/tag/array/" },
          { type: "practice", title: "HackerRank Lists", url: "https://www.hackerrank.com/domains/python/py-basic-data-types" }
        ]
      },
      {
        dayNumber: 7,
        title: "Data Structures - Tuples & Sets",
        content: "Learn tuples, sets, immutable data structures, set operations, and when to use each structure.",
        resourceLinks: [
          { type: "video", title: "Python Tuples & Sets", url: "https://www.youtube.com/watch?v=daefaLgNkw0" },
          { type: "practice", title: "LeetCode Set Problems", url: "https://leetcode.com/tag/set/" },
          { type: "practice", title: "HackerRank Tuples", url: "https://www.hackerrank.com/domains/python/py-basic-data-types" }
        ]
      },
      // Week 2: Advanced Data Structures
      {
        dayNumber: 8,
        title: "Dictionaries & Hash Tables",
        content: "Master dictionaries, dictionary methods, hash tables, key-value operations, and dictionary comprehensions.",
        resourceLinks: [
          { type: "video", title: "Python Dictionaries", url: "https://www.youtube.com/watch?v=daefaLgNkw0" },
          { type: "practice", title: "LeetCode Hash Table", url: "https://leetcode.com/tag/hash-table/" },
          { type: "practice", title: "HackerRank Dictionaries", url: "https://www.hackerrank.com/domains/python/py-basic-data-types" }
        ]
      },
      {
        dayNumber: 9,
        title: "String Manipulation & Regex",
        content: "Master string methods, formatting, regular expressions, text processing, and string algorithms.",
        resourceLinks: [
          { type: "video", title: "Python Strings", url: "https://www.youtube.com/watch?v=k9TUPpGqYTo" },
          { type: "practice", title: "LeetCode String Problems", url: "https://leetcode.com/tag/string/" },
          { type: "practice", title: "HackerRank Strings", url: "https://www.hackerrank.com/domains/python/py-strings" }
        ]
      },
      {
        dayNumber: 10,
        title: "File I/O & Exception Handling",
        content: "Learn file operations, reading/writing files, exception handling, context managers, and best practices.",
        resourceLinks: [
          { type: "video", title: "Python File I/O", url: "https://www.youtube.com/watch?v=Uh2ebFW8OYM" },
          { type: "practice", title: "HackerRank File I/O", url: "https://www.hackerrank.com/domains/python/py-io" },
          { type: "documentation", title: "Python File Operations", url: "https://docs.python.org/3/tutorial/inputoutput.html" }
        ]
      },
      {
        dayNumber: 11,
        title: "Object-Oriented Programming",
        content: "Learn classes, objects, inheritance, polymorphism, encapsulation, and OOP design principles.",
        resourceLinks: [
          { type: "video", title: "Python OOP", url: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM" },
          { type: "practice", title: "LeetCode OOP Problems", url: "https://leetcode.com/tag/object-oriented-programming/" },
          { type: "practice", title: "HackerRank Classes", url: "https://www.hackerrank.com/domains/python/py-classes" }
        ]
      },
      {
        dayNumber: 12,
        title: "Advanced OOP Concepts",
        content: "Learn abstract classes, interfaces, multiple inheritance, method overriding, and design patterns.",
        resourceLinks: [
          { type: "video", title: "Advanced Python OOP", url: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM" },
          { type: "practice", title: "LeetCode Design Patterns", url: "https://leetcode.com/tag/design/" },
          { type: "documentation", title: "Python OOP Guide", url: "https://docs.python.org/3/tutorial/classes.html" }
        ]
      },
      {
        dayNumber: 13,
        title: "Modules & Packages",
        content: "Learn about modules, packages, imports, __init__.py, and how to structure large Python projects.",
        resourceLinks: [
          { type: "video", title: "Python Modules", url: "https://www.youtube.com/watch?v=1u6G3oybm5M" },
          { type: "practice", title: "HackerRank Modules", url: "https://www.hackerrank.com/domains/python/py-modules" },
          { type: "documentation", title: "Python Modules Guide", url: "https://docs.python.org/3/tutorial/modules.html" }
        ]
      },
      {
        dayNumber: 14,
        title: "Error Handling & Debugging",
        content: "Master exception handling, debugging techniques, logging, and error management best practices.",
        resourceLinks: [
          { type: "video", title: "Python Error Handling", url: "https://www.youtube.com/watch?v=NIWwJbo-9_8" },
          { type: "practice", title: "HackerRank Exceptions", url: "https://www.hackerrank.com/domains/python/py-exceptions" },
          { type: "documentation", title: "Python Error Handling", url: "https://docs.python.org/3/tutorial/errors.html" }
        ]
      },
      // Week 3: Algorithms & Data Structures
      {
        dayNumber: 15,
        title: "Algorithm Fundamentals",
        content: "Learn algorithm analysis, Big O notation, time/space complexity, and basic algorithm design patterns.",
        resourceLinks: [
          { type: "video", title: "Algorithm Analysis", url: "https://www.youtube.com/watch?v=8hly31xKli0" },
          { type: "practice", title: "LeetCode Algorithm Problems", url: "https://leetcode.com/problemset/all/" },
          { type: "practice", title: "HackerRank Algorithms", url: "https://www.hackerrank.com/domains/algorithms" }
        ]
      },
      {
        dayNumber: 16,
        title: "Sorting Algorithms",
        content: "Master bubble sort, selection sort, insertion sort, merge sort, quick sort, and heap sort implementations.",
        resourceLinks: [
          { type: "video", title: "Sorting Algorithms", url: "https://www.youtube.com/watch?v=kPRA0W1kECg" },
          { type: "practice", title: "LeetCode Sorting", url: "https://leetcode.com/tag/sorting/" },
          { type: "practice", title: "HackerRank Sorting", url: "https://www.hackerrank.com/domains/algorithms/sorting" }
        ]
      },
      {
        dayNumber: 17,
        title: "Searching Algorithms",
        content: "Learn linear search, binary search, depth-first search (DFS), breadth-first search (BFS), and graph traversal.",
        resourceLinks: [
          { type: "video", title: "Searching Algorithms", url: "https://www.youtube.com/watch?v=P3YID7liBug" },
          { type: "practice", title: "LeetCode Search Problems", url: "https://leetcode.com/tag/binary-search/" },
          { type: "practice", title: "HackerRank Search", url: "https://www.hackerrank.com/domains/algorithms/search" }
        ]
      },
      {
        dayNumber: 18,
        title: "Dynamic Programming",
        content: "Learn dynamic programming concepts, memoization, tabulation, and solve classic DP problems.",
        resourceLinks: [
          { type: "video", title: "Dynamic Programming", url: "https://www.youtube.com/watch?v=oBt53YbR9Kk" },
          { type: "practice", title: "LeetCode DP Problems", url: "https://leetcode.com/tag/dynamic-programming/" },
          { type: "practice", title: "HackerRank DP", url: "https://www.hackerrank.com/domains/algorithms/dynamic-programming" }
        ]
      },
      {
        dayNumber: 19,
        title: "Graph Algorithms",
        content: "Learn graph representation, DFS, BFS, shortest path algorithms (Dijkstra), and minimum spanning trees.",
        resourceLinks: [
          { type: "video", title: "Graph Algorithms", url: "https://www.youtube.com/watch?v=tWVWeAqZ0WU" },
          { type: "practice", title: "LeetCode Graph Problems", url: "https://leetcode.com/tag/graph/" },
          { type: "practice", title: "HackerRank Graphs", url: "https://www.hackerrank.com/domains/algorithms/graph" }
        ]
      },
      {
        dayNumber: 20,
        title: "Tree Algorithms",
        content: "Master binary trees, tree traversal (preorder, inorder, postorder), BST operations, and tree algorithms.",
        resourceLinks: [
          { type: "video", title: "Tree Algorithms", url: "https://www.youtube.com/watch?v=9RHO6jU--GU" },
          { type: "practice", title: "LeetCode Tree Problems", url: "https://leetcode.com/tag/tree/" },
          { type: "practice", title: "HackerRank Trees", url: "https://www.hackerrank.com/domains/algorithms/trees" }
        ]
      },
      {
        dayNumber: 21,
        title: "Linked Lists & Stacks",
        content: "Learn linked list implementation, stack operations, queue operations, and their applications.",
        resourceLinks: [
          { type: "video", title: "Linked Lists", url: "https://www.youtube.com/watch?v=Hj_rA0dhr2I" },
          { type: "practice", title: "LeetCode Linked List", url: "https://leetcode.com/tag/linked-list/" },
          { type: "practice", title: "HackerRank Linked Lists", url: "https://www.hackerrank.com/domains/algorithms/linked-lists" }
        ]
      },
      // Week 4: Web Development & Projects
      {
        dayNumber: 22,
        title: "Web Development with Flask",
        content: "Learn Flask framework, routing, templates, forms, and build your first web application.",
        resourceLinks: [
          { type: "video", title: "Flask Tutorial", url: "https://www.youtube.com/watch?v=Z1RJmh_OqeA" },
          { type: "practice", title: "Flask Documentation", url: "https://flask.palletsprojects.com/" },
          { type: "practice", title: "Build a Flask App", url: "https://www.youtube.com/watch?v=Z1RJmh_OqeA" }
        ]
      },
      {
        dayNumber: 23,
        title: "Database Integration",
        content: "Learn SQLite, database operations, ORM with SQLAlchemy, and database design principles.",
        resourceLinks: [
          { type: "video", title: "Python Database", url: "https://www.youtube.com/watch?v=pd-0G0MigUA" },
          { type: "practice", title: "SQLAlchemy Tutorial", url: "https://docs.sqlalchemy.org/" },
          { type: "practice", title: "Build a Database App", url: "https://www.youtube.com/watch?v=pd-0G0MigUA" }
        ]
      },
      {
        dayNumber: 24,
        title: "API Development",
        content: "Learn REST API design, HTTP methods, JSON handling, API testing, and documentation.",
        resourceLinks: [
          { type: "video", title: "REST API with Flask", url: "https://www.youtube.com/watch?v=GMppyAP6YPE" },
          { type: "practice", title: "Flask-RESTful", url: "https://flask-restful.readthedocs.io/" },
          { type: "practice", title: "API Testing", url: "https://www.youtube.com/watch?v=GMppyAP6YPE" }
        ]
      },
      {
        dayNumber: 25,
        title: "Data Analysis with Pandas",
        content: "Learn pandas for data manipulation, data cleaning, analysis, and visualization basics.",
        resourceLinks: [
          { type: "video", title: "Pandas Tutorial", url: "https://www.youtube.com/watch?v=vmEHCJofslg" },
          { type: "practice", title: "Pandas Documentation", url: "https://pandas.pydata.org/docs/" },
          { type: "practice", title: "Data Analysis Project", url: "https://www.youtube.com/watch?v=vmEHCJofslg" }
        ]
      },
      {
        dayNumber: 26,
        title: "Testing & Debugging",
        content: "Learn unit testing with pytest, test-driven development, debugging techniques, and code quality.",
        resourceLinks: [
          { type: "video", title: "Python Testing", url: "https://www.youtube.com/watch?v=6tNS--WetLI" },
          { type: "practice", title: "Pytest Documentation", url: "https://docs.pytest.org/" },
          { type: "practice", title: "Write Tests", url: "https://www.youtube.com/watch?v=6tNS--WetLI" }
        ]
      },
      {
        dayNumber: 27,
        title: "Package Management & Deployment",
        content: "Learn pip, virtual environments, requirements.txt, and basic deployment strategies.",
        resourceLinks: [
          { type: "video", title: "Python Deployment", url: "https://www.youtube.com/watch?v=YYXdXT2l-Gg" },
          { type: "practice", title: "Deploy to Heroku", url: "https://devcenter.heroku.com/articles/getting-started-with-python" },
          { type: "documentation", title: "Python Packaging", url: "https://packaging.python.org/" }
        ]
      },
      {
        dayNumber: 28,
        title: "Advanced Python Features",
        content: "Learn decorators, generators, iterators, context managers, and advanced Python concepts.",
        resourceLinks: [
          { type: "video", title: "Advanced Python", url: "https://www.youtube.com/watch?v=HGOBQPFzWKo" },
          { type: "practice", title: "LeetCode Advanced", url: "https://leetcode.com/problemset/all/?difficulty=Hard" },
          { type: "documentation", title: "Python Advanced", url: "https://docs.python.org/3/tutorial/classes.html" }
        ]
      },
      {
        dayNumber: 29,
        title: "Final Project Planning",
        content: "Plan and design a comprehensive Python project that demonstrates all learned concepts.",
        resourceLinks: [
          { type: "video", title: "Python Project Ideas", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Project Planning", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Git & Version Control", url: "https://www.youtube.com/watch?v=8JJ101D3knE" }
        ]
      },
      {
        dayNumber: 30,
        title: "Final Project Implementation",
        content: "Build and deploy your final Python project. Review all concepts and prepare for advanced topics.",
        resourceLinks: [
          { type: "video", title: "Project Deployment", url: "https://www.youtube.com/watch?v=YYXdXT2l-Gg" },
          { type: "practice", title: "Code Review", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Portfolio Development", url: "https://www.youtube.com/watch?v=8ext9G7xspg" }
        ]
      }
    ];

    for (const taskData of python30DayTasks) {
      await storage.createTask({
        challengeId: python30Day.id,
        dayNumber: taskData.dayNumber,
        title: taskData.title,
        content: taskData.content,
        resourceLinks: taskData.resourceLinks
      });
    }

    // Create tasks for 60-Day Python Data Science
    console.log("📝 Creating tasks for 60-Day Python Data Science...");
    const python60DayTasks = [
      // Week 1: Foundation & Setup
      {
        dayNumber: 1,
        title: "Data Science Environment Setup",
        content: "Set up Python data science environment with Anaconda, Jupyter notebooks, and essential libraries (pandas, numpy, matplotlib, seaborn).",
        resourceLinks: [
          { type: "video", title: "Data Science Setup", url: "https://www.youtube.com/watch?v=5JnMutdy6Fw" },
          { type: "practice", title: "Jupyter Tutorial", url: "https://jupyter.org/documentation" },
          { type: "documentation", title: "Anaconda Installation", url: "https://docs.anaconda.com/" }
        ]
      },
      {
        dayNumber: 2,
        title: "Python Fundamentals for Data Science",
        content: "Review Python basics, data types, control structures, functions, and object-oriented programming for data science applications.",
        resourceLinks: [
          { type: "video", title: "Python for Data Science", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI" },
          { type: "practice", title: "Python Data Science Basics", url: "https://www.kaggle.com/learn/python" },
          { type: "practice", title: "HackerRank Python", url: "https://www.hackerrank.com/domains/python" }
        ]
      },
      {
        dayNumber: 3,
        title: "NumPy Fundamentals",
        content: "Master NumPy arrays, mathematical operations, broadcasting, array manipulation, and numerical computing foundations.",
        resourceLinks: [
          { type: "video", title: "NumPy Tutorial", url: "https://www.youtube.com/watch?v=QUT1VHiLmmI" },
          { type: "practice", title: "NumPy Exercises", url: "https://www.w3resource.com/python-exercises/numpy/" },
          { type: "practice", title: "NumPy Practice", url: "https://www.kaggle.com/learn/numpy" }
        ]
      },
      {
        dayNumber: 4,
        title: "Pandas DataFrames - Part 1",
        content: "Learn pandas DataFrames, data loading from CSV/Excel, basic operations, indexing, and data exploration.",
        resourceLinks: [
          { type: "video", title: "Pandas Tutorial", url: "https://www.youtube.com/watch?v=vmEHCJofslg" },
          { type: "practice", title: "Pandas Exercises", url: "https://www.w3resource.com/python-exercises/pandas/" },
          { type: "practice", title: "Kaggle Pandas", url: "https://www.kaggle.com/learn/pandas" }
        ]
      },
      {
        dayNumber: 5,
        title: "Pandas DataFrames - Part 2",
        content: "Advanced pandas operations: data cleaning, handling missing values, data transformation, and grouping operations.",
        resourceLinks: [
          { type: "video", title: "Advanced Pandas", url: "https://www.youtube.com/watch?v=vmEHCJofslg" },
          { type: "practice", title: "Data Cleaning", url: "https://www.kaggle.com/learn/data-cleaning" },
          { type: "practice", title: "Pandas GroupBy", url: "https://pandas.pydata.org/docs/user_guide/groupby.html" }
        ]
      },
      {
        dayNumber: 6,
        title: "Data Visualization with Matplotlib",
        content: "Learn matplotlib for creating plots, charts, histograms, scatter plots, and basic data visualization techniques.",
        resourceLinks: [
          { type: "video", title: "Matplotlib Tutorial", url: "https://www.youtube.com/watch?v=UO98lJQ3QGI" },
          { type: "practice", title: "Matplotlib Exercises", url: "https://www.w3resource.com/python-exercises/matplotlib/" },
          { type: "practice", title: "Data Visualization", url: "https://www.kaggle.com/learn/data-visualization" }
        ]
      },
      {
        dayNumber: 7,
        title: "Advanced Visualization with Seaborn",
        content: "Master seaborn for statistical data visualization, heatmaps, pair plots, and advanced plotting techniques.",
        resourceLinks: [
          { type: "video", title: "Seaborn Tutorial", url: "https://www.youtube.com/watch?v=6GUZXDef2U0" },
          { type: "practice", title: "Seaborn Gallery", url: "https://seaborn.pydata.org/examples/index.html" },
          { type: "practice", title: "Statistical Plots", url: "https://seaborn.pydata.org/tutorial.html" }
        ]
      },
      // Week 2: Data Analysis & Statistics
      {
        dayNumber: 8,
        title: "Descriptive Statistics",
        content: "Learn descriptive statistics, measures of central tendency, variability, distribution analysis, and statistical summaries.",
        resourceLinks: [
          { type: "video", title: "Descriptive Statistics", url: "https://www.youtube.com/watch?v=xxpc-HPKN28" },
          { type: "practice", title: "Statistics with Python", url: "https://www.kaggle.com/learn/statistical-thinking" },
          { type: "practice", title: "Pandas Statistics", url: "https://pandas.pydata.org/docs/user_guide/basic.html#descriptive-statistics" }
        ]
      },
      {
        dayNumber: 9,
        title: "Data Cleaning & Preprocessing",
        content: "Master data cleaning techniques, handling outliers, data validation, and preprocessing for machine learning.",
        resourceLinks: [
          { type: "video", title: "Data Cleaning", url: "https://www.youtube.com/watch?v=8o2s9vXa0Qk" },
          { type: "practice", title: "Data Cleaning Project", url: "https://www.kaggle.com/learn/data-cleaning" },
          { type: "practice", title: "Outlier Detection", url: "https://www.kaggle.com/code/nareshbhat/outlier-the-silent-killer" }
        ]
      },
      {
        dayNumber: 10,
        title: "Exploratory Data Analysis (EDA)",
        content: "Learn EDA techniques, data profiling, correlation analysis, and comprehensive data exploration methods.",
        resourceLinks: [
          { type: "video", title: "EDA Tutorial", url: "https://www.youtube.com/watch?v=xi0vhXFPegw" },
          { type: "practice", title: "EDA Project", url: "https://www.kaggle.com/learn/exploratory-data-analysis" },
          { type: "practice", title: "Pandas Profiling", url: "https://pandas-profiling.github.io/pandas-profiling/docs/" }
        ]
      },
      {
        dayNumber: 11,
        title: "Feature Engineering",
        content: "Learn feature creation, transformation, selection, and engineering techniques for machine learning.",
        resourceLinks: [
          { type: "video", title: "Feature Engineering", url: "https://www.youtube.com/watch?v=z0sJ6xV8ba0" },
          { type: "practice", title: "Feature Engineering", url: "https://www.kaggle.com/learn/feature-engineering" },
          { type: "practice", title: "Feature Selection", url: "https://scikit-learn.org/stable/modules/feature_selection.html" }
        ]
      },
      {
        dayNumber: 12,
        title: "Time Series Analysis",
        content: "Learn time series data handling, decomposition, trend analysis, and seasonal patterns in data.",
        resourceLinks: [
          { type: "video", title: "Time Series Analysis", url: "https://www.youtube.com/watch?v=UFuo7EHI8zc" },
          { type: "practice", title: "Time Series Project", url: "https://www.kaggle.com/learn/time-series" },
          { type: "practice", title: "Pandas Time Series", url: "https://pandas.pydata.org/docs/user_guide/timeseries.html" }
        ]
      },
      {
        dayNumber: 13,
        title: "Statistical Testing",
        content: "Learn hypothesis testing, t-tests, chi-square tests, ANOVA, and statistical significance testing.",
        resourceLinks: [
          { type: "video", title: "Statistical Testing", url: "https://www.youtube.com/watch?v=xxpc-HPKN28" },
          { type: "practice", title: "SciPy Statistics", url: "https://docs.scipy.org/doc/scipy/reference/stats.html" },
          { type: "practice", title: "Statistical Tests", url: "https://www.kaggle.com/code/nareshbhat/statistical-tests" }
        ]
      },
      {
        dayNumber: 14,
        title: "Data Visualization Project",
        content: "Create comprehensive data visualization projects using real datasets and advanced plotting techniques.",
        resourceLinks: [
          { type: "video", title: "Data Viz Project", url: "https://www.youtube.com/watch?v=UO98lJQ3QGI" },
          { type: "practice", title: "Viz Project", url: "https://www.kaggle.com/learn/data-visualization" },
          { type: "practice", title: "Plotly Tutorial", url: "https://plotly.com/python/" }
        ]
      },
      // Week 3: Machine Learning Fundamentals
      {
        dayNumber: 15,
        title: "Introduction to Machine Learning",
        content: "Learn ML concepts, supervised vs unsupervised learning, training/testing data, and model evaluation.",
        resourceLinks: [
          { type: "video", title: "ML Introduction", url: "https://www.youtube.com/watch?v=ukzFI9rgwfU" },
          { type: "practice", title: "ML Basics", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
          { type: "practice", title: "Scikit-learn Tutorial", url: "https://scikit-learn.org/stable/tutorial/index.html" }
        ]
      },
      {
        dayNumber: 16,
        title: "Linear Regression",
        content: "Master linear regression, simple and multiple regression, assumptions, and model interpretation.",
        resourceLinks: [
          { type: "video", title: "Linear Regression", url: "https://www.youtube.com/watch?v=8jazNUpO3lQ" },
          { type: "practice", title: "Regression Project", url: "https://www.kaggle.com/learn/linear-regression" },
          { type: "practice", title: "Scikit-learn Regression", url: "https://scikit-learn.org/stable/modules/linear_model.html" }
        ]
      },
      {
        dayNumber: 17,
        title: "Logistic Regression",
        content: "Learn logistic regression for classification, probability estimation, and binary classification problems.",
        resourceLinks: [
          { type: "video", title: "Logistic Regression", url: "https://www.youtube.com/watch?v=yIYKR4sgzI8" },
          { type: "practice", title: "Classification Project", url: "https://www.kaggle.com/learn/logistic-regression" },
          { type: "practice", title: "Binary Classification", url: "https://scikit-learn.org/stable/modules/linear_model.html#logistic-regression" }
        ]
      },
      {
        dayNumber: 18,
        title: "Decision Trees",
        content: "Learn decision trees, tree construction, pruning, and interpretation of tree-based models.",
        resourceLinks: [
          { type: "video", title: "Decision Trees", url: "https://www.youtube.com/watch?v=ZVR2Way4nwQ" },
          { type: "practice", title: "Tree Project", url: "https://www.kaggle.com/learn/decision-trees" },
          { type: "practice", title: "Scikit-learn Trees", url: "https://scikit-learn.org/stable/modules/tree.html" }
        ]
      },
      {
        dayNumber: 19,
        title: "Random Forests",
        content: "Master random forests, ensemble methods, bagging, and advanced tree-based algorithms.",
        resourceLinks: [
          { type: "video", title: "Random Forests", url: "https://www.youtube.com/watch?v=J4Wdy0Wc_xQ" },
          { type: "practice", title: "Ensemble Methods", url: "https://www.kaggle.com/learn/random-forests" },
          { type: "practice", title: "Random Forest", url: "https://scikit-learn.org/stable/modules/ensemble.html#forest" }
        ]
      },
      {
        dayNumber: 20,
        title: "Model Evaluation & Validation",
        content: "Learn cross-validation, metrics (accuracy, precision, recall, F1), and model evaluation techniques.",
        resourceLinks: [
          { type: "video", title: "Model Evaluation", url: "https://www.youtube.com/watch?v=HBi-p5BqK4I" },
          { type: "practice", title: "Model Validation", url: "https://www.kaggle.com/learn/model-validation" },
          { type: "practice", title: "Evaluation Metrics", url: "https://scikit-learn.org/stable/modules/model_evaluation.html" }
        ]
      },
      {
        dayNumber: 21,
        title: "Clustering Algorithms",
        content: "Learn K-means clustering, hierarchical clustering, and unsupervised learning techniques.",
        resourceLinks: [
          { type: "video", title: "Clustering", url: "https://www.youtube.com/watch?v=4b5d3muHzm4" },
          { type: "practice", title: "Clustering Project", url: "https://www.kaggle.com/learn/clustering" },
          { type: "practice", title: "K-means", url: "https://scikit-learn.org/stable/modules/clustering.html#k-means" }
        ]
      },
      // Week 4: Advanced Machine Learning
      {
        dayNumber: 22,
        title: "Support Vector Machines",
        content: "Learn SVM for classification, kernel methods, and support vector regression.",
        resourceLinks: [
          { type: "video", title: "SVM Tutorial", url: "https://www.youtube.com/watch?v=efR1C6CvhmE" },
          { type: "practice", title: "SVM Project", url: "https://www.kaggle.com/learn/support-vector-machines" },
          { type: "practice", title: "SVM Implementation", url: "https://scikit-learn.org/stable/modules/svm.html" }
        ]
      },
      {
        dayNumber: 23,
        title: "Neural Networks with Scikit-learn",
        content: "Introduction to neural networks, MLPClassifier, and basic deep learning concepts.",
        resourceLinks: [
          { type: "video", title: "Neural Networks", url: "https://www.youtube.com/watch?v=aircAruvnKk" },
          { type: "practice", title: "Neural Networks", url: "https://www.kaggle.com/learn/intro-to-deep-learning" },
          { type: "practice", title: "MLP", url: "https://scikit-learn.org/stable/modules/neural_networks.html" }
        ]
      },
      {
        dayNumber: 24,
        title: "Dimensionality Reduction",
        content: "Learn PCA, t-SNE, LDA, and dimensionality reduction techniques for data visualization and preprocessing.",
        resourceLinks: [
          { type: "video", title: "PCA Tutorial", url: "https://www.youtube.com/watch?v=HMOI_lkzW08" },
          { type: "practice", title: "Dimensionality Reduction", url: "https://www.kaggle.com/learn/dimensionality-reduction" },
          { type: "practice", title: "PCA Implementation", url: "https://scikit-learn.org/stable/modules/decomposition.html#pca" }
        ]
      },
      {
        dayNumber: 25,
        title: "Hyperparameter Tuning",
        content: "Learn grid search, random search, and hyperparameter optimization techniques.",
        resourceLinks: [
          { type: "video", title: "Hyperparameter Tuning", url: "https://www.youtube.com/watch?v=0B5eIE_1vpU" },
          { type: "practice", title: "Parameter Tuning", url: "https://www.kaggle.com/learn/parameter-tuning" },
          { type: "practice", title: "Grid Search", url: "https://scikit-learn.org/stable/modules/grid_search.html" }
        ]
      },
      {
        dayNumber: 26,
        title: "Model Selection & Ensemble Methods",
        content: "Learn model selection, ensemble methods, voting classifiers, and advanced ensemble techniques.",
        resourceLinks: [
          { type: "video", title: "Ensemble Methods", url: "https://www.youtube.com/watch?v=Un9zObFjBH0" },
          { type: "practice", title: "Ensemble Learning", url: "https://www.kaggle.com/learn/ensemble-methods" },
          { type: "practice", title: "Voting Classifier", url: "https://scikit-learn.org/stable/modules/ensemble.html#voting-classifier" }
        ]
      },
      {
        dayNumber: 27,
        title: "Deep Learning with TensorFlow/Keras",
        content: "Introduction to deep learning, neural networks, and building models with TensorFlow/Keras.",
        resourceLinks: [
          { type: "video", title: "Deep Learning", url: "https://www.youtube.com/watch?v=aircAruvnKk" },
          { type: "practice", title: "TensorFlow Tutorial", url: "https://www.tensorflow.org/tutorials" },
          { type: "practice", title: "Keras Guide", url: "https://keras.io/guides/" }
        ]
      },
      {
        dayNumber: 28,
        title: "Natural Language Processing",
        content: "Learn text preprocessing, tokenization, word embeddings, and basic NLP techniques.",
        resourceLinks: [
          { type: "video", title: "NLP Tutorial", url: "https://www.youtube.com/watch?v=oWVTO_69U4o" },
          { type: "practice", title: "NLP Project", url: "https://www.kaggle.com/learn/natural-language-processing" },
          { type: "practice", title: "NLTK Tutorial", url: "https://www.nltk.org/" }
        ]
      },
      {
        dayNumber: 29,
        title: "Computer Vision Basics",
        content: "Introduction to computer vision, image processing, and convolutional neural networks.",
        resourceLinks: [
          { type: "video", title: "Computer Vision", url: "https://www.youtube.com/watch?v=aircAruvnKk" },
          { type: "practice", title: "CV Project", url: "https://www.kaggle.com/learn/computer-vision" },
          { type: "practice", title: "OpenCV Tutorial", url: "https://opencv.org/" }
        ]
      },
      {
        dayNumber: 30,
        title: "Final Data Science Project",
        content: "Complete end-to-end data science project from data collection to model deployment and presentation.",
        resourceLinks: [
          { type: "video", title: "Data Science Project", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Portfolio Project", url: "https://www.kaggle.com/learn/data-science-project" },
          { type: "practice", title: "Project Presentation", url: "https://www.youtube.com/watch?v=8ext9G7xspg" }
        ]
      }
    ];

    for (const taskData of python60DayTasks) {
      await storage.createTask({
        challengeId: python60Day.id,
        dayNumber: taskData.dayNumber,
        title: taskData.title,
        content: taskData.content,
        resourceLinks: taskData.resourceLinks
      });
    }

    // Create tasks for 10-Day JavaScript Mastery
    console.log("📝 Creating tasks for 10-Day JavaScript Mastery...");
    const javascript10DayTasks = [
      {
        dayNumber: 1,
        title: "JavaScript Setup & Basics",
        content: "Set up JavaScript development environment, learn syntax, variables, data types, and basic operations.",
        resourceLinks: [
          { type: "video", title: "JavaScript Tutorial", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c" },
          { type: "practice", title: "HackerRank JavaScript", url: "https://www.hackerrank.com/domains/javascript" },
          { type: "practice", title: "LeetCode Easy Problems", url: "https://leetcode.com/problemset/all/?difficulty=Easy" }
        ]
      },
      {
        dayNumber: 2,
        title: "Functions & Scope",
        content: "Learn function declarations, expressions, arrow functions, scope, closures, and higher-order functions.",
        resourceLinks: [
          { type: "video", title: "JavaScript Functions", url: "https://www.youtube.com/watch?v=N8ap4k_1QEQ" },
          { type: "practice", title: "HackerRank Functions", url: "https://www.hackerrank.com/domains/javascript" },
          { type: "practice", title: "LeetCode Function Problems", url: "https://leetcode.com/tag/function/" }
        ]
      },
      {
        dayNumber: 3,
        title: "Objects & Arrays",
        content: "Master object creation, properties, methods, array methods, destructuring, and spread operator.",
        resourceLinks: [
          { type: "video", title: "JavaScript Objects", url: "https://www.youtube.com/watch?v=PFmuCDHHpwk" },
          { type: "practice", title: "HackerRank Arrays", url: "https://www.hackerrank.com/domains/javascript" },
          { type: "practice", title: "LeetCode Array Problems", url: "https://leetcode.com/tag/array/" }
        ]
      },
      {
        dayNumber: 4,
        title: "ES6+ Features",
        content: "Learn let/const, template literals, destructuring, default parameters, and modern JavaScript features.",
        resourceLinks: [
          { type: "video", title: "ES6 Tutorial", url: "https://www.youtube.com/watch?v=WZQc7RUAg18" },
          { type: "practice", title: "ES6 Exercises", url: "https://www.hackerrank.com/domains/javascript" },
          { type: "documentation", title: "MDN ES6 Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }
        ]
      },
      {
        dayNumber: 5,
        title: "DOM Manipulation",
        content: "Learn DOM selection, manipulation, event handling, and creating interactive web pages.",
        resourceLinks: [
          { type: "video", title: "DOM Tutorial", url: "https://www.youtube.com/watch?v=0ik6X4DJKCc" },
          { type: "practice", title: "DOM Projects", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
          { type: "practice", title: "Interactive Web Pages", url: "https://www.youtube.com/watch?v=0ik6X4DJKCc" }
        ]
      },
      {
        dayNumber: 6,
        title: "Async JavaScript",
        content: "Learn callbacks, promises, async/await, and handling asynchronous operations.",
        resourceLinks: [
          { type: "video", title: "Async JavaScript", url: "https://www.youtube.com/watch?v=PoRJizFvM7s" },
          { type: "practice", title: "Promise Exercises", url: "https://www.hackerrank.com/domains/javascript" },
          { type: "practice", title: "Async Projects", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" }
        ]
      },
      {
        dayNumber: 7,
        title: "Error Handling & Debugging",
        content: "Learn try/catch blocks, error handling, debugging techniques, and best practices.",
        resourceLinks: [
          { type: "video", title: "Error Handling", url: "https://www.youtube.com/watch?v=NIWwJbo-9_8" },
          { type: "practice", title: "Debugging Exercises", url: "https://www.hackerrank.com/domains/javascript" },
          { type: "documentation", title: "JavaScript Debugging", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }
        ]
      },
      {
        dayNumber: 8,
        title: "Modules & Imports",
        content: "Learn ES6 modules, import/export, module systems, and code organization.",
        resourceLinks: [
          { type: "video", title: "JavaScript Modules", url: "https://www.youtube.com/watch?v=s9kNnd6LO7M" },
          { type: "practice", title: "Module Projects", url: "https://www.hackerrank.com/domains/javascript" },
          { type: "documentation", title: "MDN Modules", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules" }
        ]
      },
      {
        dayNumber: 9,
        title: "APIs & Fetch",
        content: "Learn HTTP requests, REST APIs, fetch API, JSON handling, and working with external data.",
        resourceLinks: [
          { type: "video", title: "JavaScript APIs", url: "https://www.youtube.com/watch?v=Oive66jrwBs" },
          { type: "practice", title: "API Projects", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
          { type: "practice", title: "Fetch Exercises", url: "https://www.hackerrank.com/domains/javascript" }
        ]
      },
      {
        dayNumber: 10,
        title: "Final JavaScript Project",
        content: "Build a complete JavaScript application combining all concepts learned. Create an interactive web app.",
        resourceLinks: [
          { type: "video", title: "JavaScript Project Ideas", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Portfolio Project", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
          { type: "practice", title: "Final Challenge", url: "https://www.hackerrank.com/domains/javascript" }
        ]
      }
    ];

    for (const taskData of javascript10DayTasks) {
      await storage.createTask({
        challengeId: javascript10Day.id,
        dayNumber: taskData.dayNumber,
        title: taskData.title,
        content: taskData.content,
        resourceLinks: taskData.resourceLinks
      });
    }

    // Create tasks for 30-Day Java Development
    console.log("📝 Creating tasks for 30-Day Java Development...");
    const java30DayTasks = [
      // Week 1: Java Fundamentals
      {
        dayNumber: 1,
        title: "Java Setup & Environment",
        content: "Set up Java development environment with JDK, IDE (IntelliJ/Eclipse), and understand the Java ecosystem.",
        resourceLinks: [
          { type: "video", title: "Java Setup Guide", url: "https://www.youtube.com/watch?v=H3Q2QRmyYho" },
          { type: "practice", title: "HackerRank Java", url: "https://www.hackerrank.com/domains/java" },
          { type: "documentation", title: "Oracle Java Docs", url: "https://docs.oracle.com/en/java/" }
        ]
      },
      {
        dayNumber: 2,
        title: "Java Basics & Syntax",
        content: "Learn Java syntax, variables, data types, operators, and basic input/output operations.",
        resourceLinks: [
          { type: "video", title: "Java Basics", url: "https://www.youtube.com/watch?v=eIrMbAQSU34" },
          { type: "practice", title: "LeetCode Java", url: "https://leetcode.com/problemset/all/" },
          { type: "practice", title: "Java Exercises", url: "https://www.hackerrank.com/domains/java" }
        ]
      },
      {
        dayNumber: 3,
        title: "Control Structures",
        content: "Master if/else statements, switch cases, loops (for, while, do-while), and control flow.",
        resourceLinks: [
          { type: "video", title: "Java Control Flow", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "Control Flow Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "practice", title: "LeetCode Problems", url: "https://leetcode.com/problemset/all/" }
        ]
      },
      {
        dayNumber: 4,
        title: "Methods & Functions",
        content: "Learn method creation, parameters, return values, method overloading, and recursion.",
        resourceLinks: [
          { type: "video", title: "Java Methods", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "Method Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "practice", title: "Recursion Problems", url: "https://leetcode.com/tag/recursion/" }
        ]
      },
      {
        dayNumber: 5,
        title: "Arrays & Collections",
        content: "Master arrays, ArrayList, LinkedList, and basic collection framework concepts.",
        resourceLinks: [
          { type: "video", title: "Java Arrays", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "Array Problems", url: "https://leetcode.com/tag/array/" },
          { type: "practice", title: "Collection Exercises", url: "https://www.hackerrank.com/domains/java" }
        ]
      },
      {
        dayNumber: 6,
        title: "Object-Oriented Programming",
        content: "Learn classes, objects, constructors, inheritance, polymorphism, and encapsulation.",
        resourceLinks: [
          { type: "video", title: "Java OOP", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "OOP Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "practice", title: "Design Patterns", url: "https://leetcode.com/tag/design/" }
        ]
      },
      {
        dayNumber: 7,
        title: "Advanced OOP Concepts",
        content: "Learn abstract classes, interfaces, method overriding, and advanced OOP principles.",
        resourceLinks: [
          { type: "video", title: "Advanced Java OOP", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "Interface Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "documentation", title: "Java OOP Guide", url: "https://docs.oracle.com/javase/tutorial/java/concepts/" }
        ]
      },
      // Week 2: Data Structures & Algorithms
      {
        dayNumber: 8,
        title: "String Manipulation",
        content: "Master String class, StringBuilder, string methods, and text processing in Java.",
        resourceLinks: [
          { type: "video", title: "Java Strings", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "String Problems", url: "https://leetcode.com/tag/string/" },
          { type: "practice", title: "String Exercises", url: "https://www.hackerrank.com/domains/java" }
        ]
      },
      {
        dayNumber: 9,
        title: "Exception Handling",
        content: "Learn try/catch blocks, custom exceptions, exception hierarchy, and error handling.",
        resourceLinks: [
          { type: "video", title: "Java Exceptions", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "Exception Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "documentation", title: "Java Exception Handling", url: "https://docs.oracle.com/javase/tutorial/essential/exceptions/" }
        ]
      },
      {
        dayNumber: 10,
        title: "File I/O Operations",
        content: "Learn file reading/writing, streams, serialization, and file handling in Java.",
        resourceLinks: [
          { type: "video", title: "Java File I/O", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "File I/O Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "documentation", title: "Java I/O Guide", url: "https://docs.oracle.com/javase/tutorial/essential/io/" }
        ]
      },
      {
        dayNumber: 11,
        title: "Collections Framework",
        content: "Master ArrayList, LinkedList, HashMap, HashSet, TreeMap, and collection interfaces.",
        resourceLinks: [
          { type: "video", title: "Java Collections", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "Collection Problems", url: "https://leetcode.com/tag/hash-table/" },
          { type: "practice", title: "Collection Exercises", url: "https://www.hackerrank.com/domains/java" }
        ]
      },
      {
        dayNumber: 12,
        title: "Generics & Type Safety",
        content: "Learn generic classes, methods, wildcards, and type safety in Java.",
        resourceLinks: [
          { type: "video", title: "Java Generics", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "Generic Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "documentation", title: "Java Generics Guide", url: "https://docs.oracle.com/javase/tutorial/java/generics/" }
        ]
      },
      {
        dayNumber: 13,
        title: "Lambda Expressions & Streams",
        content: "Learn functional programming concepts, lambda expressions, and Java 8+ features.",
        resourceLinks: [
          { type: "video", title: "Java Lambda", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "Lambda Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "documentation", title: "Java 8 Features", url: "https://docs.oracle.com/javase/8/docs/api/" }
        ]
      },
      {
        dayNumber: 14,
        title: "Multithreading Basics",
        content: "Learn Thread class, Runnable interface, synchronization, and basic concurrency.",
        resourceLinks: [
          { type: "video", title: "Java Threading", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "Threading Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "documentation", title: "Java Concurrency", url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/" }
        ]
      },
      // Week 3: Advanced Java & Frameworks
      {
        dayNumber: 15,
        title: "Spring Framework Introduction",
        content: "Learn Spring Boot basics, dependency injection, and building REST APIs.",
        resourceLinks: [
          { type: "video", title: "Spring Boot Tutorial", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Spring Boot Project", url: "https://spring.io/guides" },
          { type: "documentation", title: "Spring Boot Docs", url: "https://spring.io/projects/spring-boot" }
        ]
      },
      {
        dayNumber: 16,
        title: "Spring Data JPA",
        content: "Learn JPA, Hibernate, database operations, and ORM concepts with Spring.",
        resourceLinks: [
          { type: "video", title: "Spring Data JPA", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "JPA Exercises", url: "https://spring.io/guides" },
          { type: "documentation", title: "Spring Data JPA", url: "https://spring.io/projects/spring-data-jpa" }
        ]
      },
      {
        dayNumber: 17,
        title: "Spring Security",
        content: "Learn authentication, authorization, JWT tokens, and security in Spring applications.",
        resourceLinks: [
          { type: "video", title: "Spring Security", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Security Project", url: "https://spring.io/guides" },
          { type: "documentation", title: "Spring Security Docs", url: "https://spring.io/projects/spring-security" }
        ]
      },
      {
        dayNumber: 18,
        title: "RESTful Web Services",
        content: "Learn REST API design, HTTP methods, JSON handling, and API documentation.",
        resourceLinks: [
          { type: "video", title: "REST API Tutorial", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "REST API Project", url: "https://spring.io/guides" },
          { type: "practice", title: "API Testing", url: "https://www.postman.com/" }
        ]
      },
      {
        dayNumber: 19,
        title: "Database Integration",
        content: "Learn MySQL/PostgreSQL integration, connection pooling, and database optimization.",
        resourceLinks: [
          { type: "video", title: "Database Integration", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Database Project", url: "https://spring.io/guides" },
          { type: "documentation", title: "Database Best Practices", url: "https://docs.oracle.com/javase/tutorial/jdbc/" }
        ]
      },
      {
        dayNumber: 20,
        title: "Testing with JUnit",
        content: "Learn unit testing, integration testing, mocking, and test-driven development.",
        resourceLinks: [
          { type: "video", title: "JUnit Testing", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Testing Exercises", url: "https://junit.org/junit5/" },
          { type: "documentation", title: "JUnit Documentation", url: "https://junit.org/junit5/docs/current/user-guide/" }
        ]
      },
      {
        dayNumber: 21,
        title: "Maven & Build Tools",
        content: "Learn Maven, dependency management, build lifecycle, and project structure.",
        resourceLinks: [
          { type: "video", title: "Maven Tutorial", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Maven Project", url: "https://maven.apache.org/guides/" },
          { type: "documentation", title: "Maven Documentation", url: "https://maven.apache.org/guides/" }
        ]
      },
      // Week 4: Enterprise Development
      {
        dayNumber: 22,
        title: "Microservices Architecture",
        content: "Learn microservices concepts, service communication, and distributed systems.",
        resourceLinks: [
          { type: "video", title: "Microservices", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Microservices Project", url: "https://spring.io/guides" },
          { type: "documentation", title: "Spring Cloud", url: "https://spring.io/projects/spring-cloud" }
        ]
      },
      {
        dayNumber: 23,
        title: "Docker & Containerization",
        content: "Learn Docker, containerization, Docker Compose, and deployment strategies.",
        resourceLinks: [
          { type: "video", title: "Docker Tutorial", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Docker Project", url: "https://docs.docker.com/get-started/" },
          { type: "documentation", title: "Docker Documentation", url: "https://docs.docker.com/" }
        ]
      },
      {
        dayNumber: 24,
        title: "Cloud Deployment",
        content: "Learn AWS/Azure deployment, CI/CD pipelines, and cloud-native applications.",
        resourceLinks: [
          { type: "video", title: "Cloud Deployment", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Cloud Project", url: "https://aws.amazon.com/getting-started/" },
          { type: "documentation", title: "AWS Java Guide", url: "https://docs.aws.amazon.com/sdk-for-java/" }
        ]
      },
      {
        dayNumber: 25,
        title: "Performance Optimization",
        content: "Learn JVM tuning, memory management, profiling, and performance optimization.",
        resourceLinks: [
          { type: "video", title: "Java Performance", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Performance Testing", url: "https://www.hackerrank.com/domains/java" },
          { type: "documentation", title: "JVM Tuning", url: "https://docs.oracle.com/javase/8/docs/technotes/guides/vm/" }
        ]
      },
      {
        dayNumber: 26,
        title: "Design Patterns",
        content: "Learn common design patterns, SOLID principles, and architectural patterns.",
        resourceLinks: [
          { type: "video", title: "Design Patterns", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Pattern Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "documentation", title: "Java Design Patterns", url: "https://docs.oracle.com/javase/tutorial/java/concepts/" }
        ]
      },
      {
        dayNumber: 27,
        title: "Code Quality & Best Practices",
        content: "Learn code review, refactoring, clean code principles, and best practices.",
        resourceLinks: [
          { type: "video", title: "Clean Code", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Code Review", url: "https://www.hackerrank.com/domains/java" },
          { type: "documentation", title: "Java Best Practices", url: "https://docs.oracle.com/javase/tutorial/java/concepts/" }
        ]
      },
      {
        dayNumber: 28,
        title: "Advanced Spring Features",
        content: "Learn Spring AOP, caching, scheduling, and advanced Spring framework features.",
        resourceLinks: [
          { type: "video", title: "Advanced Spring", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Advanced Spring Project", url: "https://spring.io/guides" },
          { type: "documentation", title: "Spring Framework", url: "https://spring.io/projects/spring-framework" }
        ]
      },
      {
        dayNumber: 29,
        title: "Final Project Planning",
        content: "Plan and design a comprehensive Java enterprise application using all learned concepts.",
        resourceLinks: [
          { type: "video", title: "Java Project Ideas", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Project Planning", url: "https://spring.io/guides" },
          { type: "practice", title: "Architecture Design", url: "https://www.hackerrank.com/domains/java" }
        ]
      },
      {
        dayNumber: 30,
        title: "Final Project Implementation",
        content: "Build and deploy a complete Java enterprise application with all modern features.",
        resourceLinks: [
          { type: "video", title: "Project Deployment", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Final Project", url: "https://spring.io/guides" },
          { type: "practice", title: "Portfolio Development", url: "https://www.hackerrank.com/domains/java" }
        ]
      }
    ];

    for (const taskData of java30DayTasks) {
      await storage.createTask({
        challengeId: java30Day.id,
        dayNumber: taskData.dayNumber,
        title: taskData.title,
        content: taskData.content,
        resourceLinks: taskData.resourceLinks
      });
    }

    // Create tasks for 30-Day Full-Stack Web Development
    console.log("📝 Creating tasks for 30-Day Full-Stack Web Development...");
    const webDev30DayTasks = [
      // Week 1: Frontend Fundamentals
      {
        dayNumber: 1,
        title: "HTML5 Fundamentals",
        content: "Learn HTML5 structure, semantic elements, forms, accessibility, and modern HTML features.",
        resourceLinks: [
          { type: "video", title: "HTML5 Tutorial", url: "https://www.youtube.com/watch?v=qz0aGYrrlhU" },
          { type: "practice", title: "HTML Exercises", url: "https://www.freecodecamp.org/learn/responsive-web-design/" },
          { type: "documentation", title: "MDN HTML Guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" }
        ]
      },
      {
        dayNumber: 2,
        title: "CSS3 & Styling",
        content: "Master CSS3 properties, flexbox, grid, animations, and responsive design principles.",
        resourceLinks: [
          { type: "video", title: "CSS3 Tutorial", url: "https://www.youtube.com/watch?v=1Rs2ND1ryYc" },
          { type: "practice", title: "CSS Grid Garden", url: "https://cssgridgarden.com/" },
          { type: "practice", title: "Flexbox Froggy", url: "https://flexboxfroggy.com/" }
        ]
      },
      {
        dayNumber: 3,
        title: "JavaScript ES6+",
        content: "Learn modern JavaScript, ES6+ features, modules, and advanced JavaScript concepts.",
        resourceLinks: [
          { type: "video", title: "JavaScript ES6", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c" },
          { type: "practice", title: "JavaScript Exercises", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
          { type: "practice", title: "LeetCode JavaScript", url: "https://leetcode.com/problemset/all/" }
        ]
      },
      {
        dayNumber: 4,
        title: "DOM Manipulation",
        content: "Master DOM selection, manipulation, event handling, and creating interactive web pages.",
        resourceLinks: [
          { type: "video", title: "DOM Tutorial", url: "https://www.youtube.com/watch?v=0ik6X4DJKCc" },
          { type: "practice", title: "DOM Projects", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
          { type: "practice", title: "Interactive Web Pages", url: "https://www.youtube.com/watch?v=0ik6X4DJKCc" }
        ]
      },
      {
        dayNumber: 5,
        title: "Responsive Design",
        content: "Learn responsive design principles, media queries, mobile-first approach, and CSS frameworks.",
        resourceLinks: [
          { type: "video", title: "Responsive Design", url: "https://www.youtube.com/watch?v=srvUrASLq0" },
          { type: "practice", title: "Responsive Projects", url: "https://www.freecodecamp.org/learn/responsive-web-design/" },
          { type: "practice", title: "Bootstrap Tutorial", url: "https://getbootstrap.com/docs/5.0/getting-started/introduction/" }
        ]
      },
      {
        dayNumber: 6,
        title: "CSS Preprocessors",
        content: "Learn Sass/SCSS, variables, mixins, nesting, and advanced CSS preprocessing.",
        resourceLinks: [
          { type: "video", title: "Sass Tutorial", url: "https://www.youtube.com/watch?v=Zz6eOVaaelI" },
          { type: "practice", title: "Sass Exercises", url: "https://sass-lang.com/guide" },
          { type: "documentation", title: "Sass Documentation", url: "https://sass-lang.com/documentation" }
        ]
      },
      {
        dayNumber: 7,
        title: "Build Tools & Bundlers",
        content: "Learn Webpack, Vite, npm scripts, and modern build tools for web development.",
        resourceLinks: [
          { type: "video", title: "Webpack Tutorial", url: "https://www.youtube.com/watch?v=MpGLUVbqoYQ" },
          { type: "practice", title: "Build Tool Setup", url: "https://webpack.js.org/guides/getting-started/" },
          { type: "documentation", title: "Vite Documentation", url: "https://vitejs.dev/guide/" }
        ]
      },
      // Week 2: Frontend Frameworks
      {
        dayNumber: 8,
        title: "React Fundamentals",
        content: "Learn React basics, components, JSX, props, state, and React hooks.",
        resourceLinks: [
          { type: "video", title: "React Tutorial", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "React Exercises", url: "https://reactjs.org/tutorial/tutorial.html" },
          { type: "documentation", title: "React Documentation", url: "https://reactjs.org/docs/getting-started.html" }
        ]
      },
      {
        dayNumber: 9,
        title: "React Hooks & State",
        content: "Master useState, useEffect, custom hooks, and advanced React state management.",
        resourceLinks: [
          { type: "video", title: "React Hooks", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "Hooks Projects", url: "https://reactjs.org/docs/hooks-intro.html" },
          { type: "practice", title: "State Management", url: "https://reactjs.org/docs/hooks-state.html" }
        ]
      },
      {
        dayNumber: 10,
        title: "React Router & Navigation",
        content: "Learn React Router, navigation, routing, and single-page application concepts.",
        resourceLinks: [
          { type: "video", title: "React Router", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "Router Projects", url: "https://reactrouter.com/en/main" },
          { type: "documentation", title: "React Router Docs", url: "https://reactrouter.com/en/main" }
        ]
      },
      {
        dayNumber: 11,
        title: "State Management (Redux)",
        content: "Learn Redux, Redux Toolkit, global state management, and predictable state updates.",
        resourceLinks: [
          { type: "video", title: "Redux Tutorial", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "Redux Projects", url: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts" },
          { type: "documentation", title: "Redux Toolkit", url: "https://redux-toolkit.js.org/" }
        ]
      },
      {
        dayNumber: 12,
        title: "API Integration",
        content: "Learn fetch API, axios, REST API integration, and handling asynchronous data.",
        resourceLinks: [
          { type: "video", title: "API Integration", url: "https://www.youtube.com/watch?v=Oive66jrwBs" },
          { type: "practice", title: "API Projects", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
          { type: "practice", title: "Axios Tutorial", url: "https://axios-http.com/docs/intro" }
        ]
      },
      {
        dayNumber: 13,
        title: "Testing Frontend",
        content: "Learn Jest, React Testing Library, unit testing, and testing best practices.",
        resourceLinks: [
          { type: "video", title: "React Testing", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "Testing Exercises", url: "https://testing-library.com/docs/react-testing-library/intro/" },
          { type: "documentation", title: "Jest Documentation", url: "https://jestjs.io/docs/getting-started" }
        ]
      },
      {
        dayNumber: 14,
        title: "Frontend Project",
        content: "Build a complete React application with routing, state management, and API integration.",
        resourceLinks: [
          { type: "video", title: "React Project", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Portfolio Project", url: "https://reactjs.org/tutorial/tutorial.html" },
          { type: "practice", title: "Project Ideas", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" }
        ]
      },
      // Week 3: Backend Development
      {
        dayNumber: 15,
        title: "Node.js Fundamentals",
        content: "Learn Node.js, npm, modules, file system operations, and server-side JavaScript.",
        resourceLinks: [
          { type: "video", title: "Node.js Tutorial", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
          { type: "practice", title: "Node.js Exercises", url: "https://nodejs.org/en/docs/guides/" },
          { type: "documentation", title: "Node.js Documentation", url: "https://nodejs.org/en/docs/" }
        ]
      },
      {
        dayNumber: 16,
        title: "Express.js Framework",
        content: "Learn Express.js, routing, middleware, request/response handling, and REST API creation.",
        resourceLinks: [
          { type: "video", title: "Express.js Tutorial", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
          { type: "practice", title: "Express Projects", url: "https://expressjs.com/en/starter/installing.html" },
          { type: "documentation", title: "Express Documentation", url: "https://expressjs.com/en/4x/api.html" }
        ]
      },
      {
        dayNumber: 17,
        title: "Database Integration",
        content: "Learn MongoDB, Mongoose, database operations, and NoSQL database concepts.",
        resourceLinks: [
          { type: "video", title: "MongoDB Tutorial", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
          { type: "practice", title: "Database Projects", url: "https://mongoosejs.com/docs/" },
          { type: "documentation", title: "MongoDB Documentation", url: "https://docs.mongodb.com/" }
        ]
      },
      {
        dayNumber: 18,
        title: "Authentication & Security",
        content: "Learn JWT tokens, bcrypt, authentication, authorization, and security best practices.",
        resourceLinks: [
          { type: "video", title: "Authentication Tutorial", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
          { type: "practice", title: "Auth Projects", url: "https://jwt.io/introduction" },
          { type: "documentation", title: "JWT Documentation", url: "https://jwt.io/introduction" }
        ]
      },
      {
        dayNumber: 19,
        title: "RESTful API Design",
        content: "Learn REST API design principles, HTTP methods, status codes, and API documentation.",
        resourceLinks: [
          { type: "video", title: "REST API Tutorial", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
          { type: "practice", title: "API Projects", url: "https://expressjs.com/en/guide/routing.html" },
          { type: "practice", title: "API Testing", url: "https://www.postman.com/" }
        ]
      },
      {
        dayNumber: 20,
        title: "GraphQL Introduction",
        content: "Learn GraphQL, queries, mutations, resolvers, and modern API development.",
        resourceLinks: [
          { type: "video", title: "GraphQL Tutorial", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
          { type: "practice", title: "GraphQL Projects", url: "https://graphql.org/learn/" },
          { type: "documentation", title: "GraphQL Documentation", url: "https://graphql.org/learn/" }
        ]
      },
      {
        dayNumber: 21,
        title: "Testing Backend",
        content: "Learn Jest, Supertest, API testing, integration testing, and backend testing strategies.",
        resourceLinks: [
          { type: "video", title: "Backend Testing", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
          { type: "practice", title: "Testing Exercises", url: "https://jestjs.io/docs/getting-started" },
          { type: "documentation", title: "Supertest Documentation", url: "https://github.com/visionmedia/supertest" }
        ]
      },
      // Week 4: Full-Stack Integration
      {
        dayNumber: 22,
        title: "Full-Stack Project Setup",
        content: "Set up a complete full-stack project with frontend, backend, and database integration.",
        resourceLinks: [
          { type: "video", title: "Full-Stack Setup", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Project Setup", url: "https://expressjs.com/en/starter/generator.html" },
          { type: "documentation", title: "Full-Stack Guide", url: "https://developer.mozilla.org/en-US/docs/Learn/Server-side" }
        ]
      },
      {
        dayNumber: 23,
        title: "Deployment & DevOps",
        content: "Learn deployment strategies, Heroku, Vercel, Docker, and production deployment.",
        resourceLinks: [
          { type: "video", title: "Deployment Tutorial", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Deployment Project", url: "https://devcenter.heroku.com/articles/getting-started-with-nodejs" },
          { type: "documentation", title: "Docker Documentation", url: "https://docs.docker.com/get-started/" }
        ]
      },
      {
        dayNumber: 24,
        title: "Performance Optimization",
        content: "Learn frontend optimization, backend optimization, caching, and performance monitoring.",
        resourceLinks: [
          { type: "video", title: "Performance Optimization", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Optimization Projects", url: "https://web.dev/performance/" },
          { type: "documentation", title: "Performance Guide", url: "https://web.dev/performance/" }
        ]
      },
      {
        dayNumber: 25,
        title: "Security Best Practices",
        content: "Learn web security, HTTPS, CORS, input validation, and security vulnerabilities.",
        resourceLinks: [
          { type: "video", title: "Web Security", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Security Projects", url: "https://owasp.org/www-project-top-ten/" },
          { type: "documentation", title: "OWASP Guide", url: "https://owasp.org/www-project-top-ten/" }
        ]
      },
      {
        dayNumber: 26,
        title: "Modern Development Tools",
        content: "Learn Git, GitHub, CI/CD, code quality tools, and modern development workflows.",
        resourceLinks: [
          { type: "video", title: "Git Tutorial", url: "https://www.youtube.com/watch?v=8JJ101D3knE" },
          { type: "practice", title: "Git Exercises", url: "https://learngitbranching.js.org/" },
          { type: "documentation", title: "Git Documentation", url: "https://git-scm.com/doc" }
        ]
      },
      {
        dayNumber: 27,
        title: "Advanced React Patterns",
        content: "Learn advanced React patterns, context API, render props, and higher-order components.",
        resourceLinks: [
          { type: "video", title: "Advanced React", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "Advanced Patterns", url: "https://reactjs.org/docs/context.html" },
          { type: "documentation", title: "React Patterns", url: "https://reactpatterns.com/" }
        ]
      },
      {
        dayNumber: 28,
        title: "Microservices & Architecture",
        content: "Learn microservices architecture, service communication, and scalable application design.",
        resourceLinks: [
          { type: "video", title: "Microservices", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Architecture Projects", url: "https://microservices.io/" },
          { type: "documentation", title: "Microservices Guide", url: "https://microservices.io/" }
        ]
      },
      {
        dayNumber: 29,
        title: "Final Project Planning",
        content: "Plan and design a comprehensive full-stack web application with modern features.",
        resourceLinks: [
          { type: "video", title: "Project Planning", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Project Design", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
          { type: "practice", title: "Architecture Planning", url: "https://microservices.io/" }
        ]
      },
      {
        dayNumber: 30,
        title: "Final Project Implementation",
        content: "Build and deploy a complete full-stack web application with all modern features.",
        resourceLinks: [
          { type: "video", title: "Project Implementation", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Final Project", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
          { type: "practice", title: "Portfolio Development", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" }
        ]
      }
    ];

    for (const taskData of webDev30DayTasks) {
      await storage.createTask({
        challengeId: webDev30Day.id,
        dayNumber: taskData.dayNumber,
        title: taskData.title,
        content: taskData.content,
        resourceLinks: taskData.resourceLinks
      });
    }

    // Create comprehensive certifications
    console.log("🏆 Creating comprehensive certifications...");
    const certifications = [
      // Programming Certifications
      {
        title: "Python Institute PCAP",
        provider: "Python Institute",
        link: "https://pythoninstitute.org/certification/pcap-certification-associate-python-programmer/"
      },
      {
        title: "Oracle Java SE 11 Developer",
        provider: "Oracle",
        link: "https://education.oracle.com/java/java-se/product_267"
      },
      {
        title: "Microsoft C# Developer",
        provider: "Microsoft",
        link: "https://docs.microsoft.com/en-us/learn/certifications/"
      },
      // Cloud Certifications
      {
        title: "AWS Cloud Practitioner",
        provider: "Amazon Web Services",
        link: "https://aws.amazon.com/certification/certified-cloud-practitioner/"
      },
      {
        title: "AWS Solutions Architect",
        provider: "Amazon Web Services",
        link: "https://aws.amazon.com/certification/certified-solutions-architect-associate/"
      },
      {
        title: "Microsoft Azure Fundamentals",
        provider: "Microsoft",
        link: "https://docs.microsoft.com/en-us/learn/certifications/azure-fundamentals/"
      },
      {
        title: "Google Cloud Professional",
        provider: "Google Cloud",
        link: "https://cloud.google.com/certification"
      },
      // Data Science Certifications
      {
        title: "Google Data Analytics Certificate",
        provider: "Google",
        link: "https://www.coursera.org/professional-certificates/google-data-analytics"
      },
      {
        title: "IBM Data Science Professional",
        provider: "IBM",
        link: "https://www.coursera.org/professional-certificates/ibm-data-science"
      },
      {
        title: "Microsoft Data Analyst Associate",
        provider: "Microsoft",
        link: "https://docs.microsoft.com/en-us/learn/certifications/azure-data-fundamentals/"
      },
      // Web Development Certifications
      {
        title: "Meta Front-End Developer",
        provider: "Meta",
        link: "https://www.coursera.org/professional-certificates/meta-front-end-developer"
      },
      {
        title: "Google UX Design Certificate",
        provider: "Google",
        link: "https://www.coursera.org/professional-certificates/google-ux-design"
      },
      {
        title: "AWS Developer Associate",
        provider: "Amazon Web Services",
        link: "https://aws.amazon.com/certification/certified-developer-associate/"
      },
      // Cybersecurity Certifications
      {
        title: "CompTIA Security+",
        provider: "CompTIA",
        link: "https://www.comptia.org/certifications/security"
      },
      {
        title: "CISSP",
        provider: "ISC2",
        link: "https://www.isc2.org/Certifications/CISSP"
      },
      {
        title: "CEH (Certified Ethical Hacker)",
        provider: "EC-Council",
        link: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/"
      },
      // DevOps Certifications
      {
        title: "Docker Certified Associate",
        provider: "Docker",
        link: "https://training.mirantis.com/certification/dca-certification-exam/"
      },
      {
        title: "Kubernetes Administrator",
        provider: "CNCF",
        link: "https://www.cncf.io/certification/cka/"
      },
      {
        title: "AWS DevOps Engineer",
        provider: "Amazon Web Services",
        link: "https://aws.amazon.com/certification/certified-devops-engineer-professional/"
      }
    ];

    for (const certData of certifications) {
      await storage.createCertification(certData);
    }

    console.log("✅ Comprehensive certifications created");

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- Admin user: admin@lumoraed.com`);
    console.log(`- Challenges: 8 created (10-day, 30-day, 60-day programs)`);
    console.log(`- Tasks: ${python10DayTasks.length + python30DayTasks.length + python60DayTasks.length} created`);
    console.log(`- Certifications: ${certifications.length} created`);
    console.log("\n🚀 Features included:");
    console.log("  ✅ Admin authentication system");
    console.log("  ✅ Comprehensive programming challenges");
    console.log("  ✅ Real-world practice resources (HackerRank, LeetCode)");
    console.log("  ✅ Video tutorials and documentation");
    console.log("  ✅ Progress tracking and streaks");
    console.log("  ✅ Certification management");
    console.log("  ✅ Student enrollment system");
    console.log("\n💡 Next steps:");
    console.log("  1. Set up your database with DATABASE_URL");
    console.log("  2. Run: npm run db:push");
    console.log("  3. Run: npm run db:seed");
    console.log("  4. Start the application: npm run dev");
    console.log("  5. Login with admin@lumoraed.com / Admin@123");

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("✅ Seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Seeding failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
