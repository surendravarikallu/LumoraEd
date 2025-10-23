import { storage } from "./storage";

async function seedRoadmaps() {
  console.log("🗺️ Starting roadmap seeding...");

  try {
    // Get admin user
    const adminUser = await storage.getUserByEmail("admin@lumoraed.com");
    if (!adminUser) {
      throw new Error("Admin user not found. Please run the main seed script first.");
    }

    // 1. Python Fundamentals Roadmap (Beginner)
    console.log("🐍 Creating Python Fundamentals Roadmap...");
    const pythonFundamentals = await storage.createRoadmap({
      title: "Python Fundamentals for Beginners",
      description: "Start your coding journey with Python! Learn the basics of programming, data structures, and build your first projects. Perfect for complete beginners who want to learn programming in a fun and engaging way.",
      category: "Programming",
      difficulty: "Beginner",
      estimatedDuration: 8, // 8 weeks
      createdBy: adminUser.id
    });

    const pythonFundamentalsSteps = [
      {
        stepNumber: 1,
        title: "Welcome to Python! 🐍",
        description: "Set up your Python environment and write your first 'Hello World' program. Learn about variables, data types, and basic operations.",
        resourceLinks: [
          { type: "video", title: "Python Setup Tutorial", url: "https://www.youtube.com/watch?v=kqtD5dpn9C8" },
          { type: "practice", title: "Python Basics on Codecademy", url: "https://www.codecademy.com/learn/learn-python-3" },
          { type: "interactive", title: "Python Interactive Tutorial", url: "https://www.learnpython.org/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 2,
        title: "Control the Flow 🔄",
        description: "Master if/else statements, loops, and logical thinking. Learn to make decisions in your code and repeat actions efficiently.",
        resourceLinks: [
          { type: "video", title: "Python Control Flow", url: "https://www.youtube.com/watch?v=AWek49wXGzI" },
          { type: "practice", title: "CodingBat Python", url: "https://codingbat.com/python" },
          { type: "game", title: "Python Challenge Game", url: "https://www.pythonchallenge.com/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 3,
        title: "Functions & Reusability ♻️",
        description: "Learn to write reusable code with functions. Understand parameters, return values, and how to organize your code better.",
        resourceLinks: [
          { type: "video", title: "Python Functions Explained", url: "https://www.youtube.com/watch?v=9Os0o3wzS_I" },
          { type: "practice", title: "Function Practice on HackerRank", url: "https://www.hackerrank.com/domains/python/py-function" },
          { type: "interactive", title: "Interactive Function Tutorial", url: "https://www.learnpython.org/en/Functions" }
        ],
        isOptional: false
      },
      {
        stepNumber: 4,
        title: "Data Structures - Lists & Dictionaries 📊",
        description: "Master Python's powerful data structures. Learn lists, dictionaries, and when to use each one. Build your first data manipulation skills.",
        resourceLinks: [
          { type: "video", title: "Python Data Structures", url: "https://www.youtube.com/watch?v=ohCDWZgNIU0" },
          { type: "practice", title: "Data Structure Exercises", url: "https://www.hackerrank.com/domains/python/py-basic-data-types" },
          { type: "interactive", title: "Data Structure Visualizer", url: "https://visualgo.net/en" }
        ],
        isOptional: false
      },
      {
        stepNumber: 5,
        title: "Object-Oriented Programming 🏗️",
        description: "Learn classes, objects, and inheritance. Understand how to model real-world concepts in code and write more organized programs.",
        resourceLinks: [
          { type: "video", title: "Python OOP Tutorial", url: "https://www.youtube.com/watch?v=ZDa-Z5JzLYM" },
          { type: "practice", title: "OOP Practice Problems", url: "https://www.hackerrank.com/domains/python/py-classes" },
          { type: "interactive", title: "OOP Interactive Guide", url: "https://www.learnpython.org/en/Classes_and_Objects" }
        ],
        isOptional: false
      },
      {
        stepNumber: 6,
        title: "File Handling & Error Management 📁",
        description: "Learn to read and write files, handle errors gracefully, and make your programs more robust and user-friendly.",
        resourceLinks: [
          { type: "video", title: "File I/O in Python", url: "https://www.youtube.com/watch?v=Uh2ebFW8OYM" },
          { type: "practice", title: "File Handling Exercises", url: "https://www.hackerrank.com/domains/python/py-io" },
          { type: "interactive", title: "Error Handling Tutorial", url: "https://www.learnpython.org/en/Exception_Handling" }
        ],
        isOptional: false
      },
      {
        stepNumber: 7,
        title: "Your First Python Project 🚀",
        description: "Build a complete Python project! Create a calculator, text analyzer, or simple game. Apply everything you've learned in a real project.",
        resourceLinks: [
          { type: "video", title: "Python Project Ideas", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Project Templates", url: "https://github.com/topics/python-beginner-projects" },
          { type: "community", title: "Share Your Project", url: "https://www.reddit.com/r/learnpython/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 8,
        title: "Next Steps & Advanced Topics 🎯",
        description: "Explore advanced Python topics like web development, data science, or automation. Plan your learning path forward.",
        resourceLinks: [
          { type: "video", title: "Python Career Paths", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Advanced Python Topics", url: "https://realpython.com/" },
          { type: "community", title: "Python Community", url: "https://www.python.org/community/" }
        ],
        isOptional: true
      }
    ];

    for (const stepData of pythonFundamentalsSteps) {
      await storage.createRoadmapStep({
        roadmapId: pythonFundamentals.id,
        stepNumber: stepData.stepNumber,
        title: stepData.title,
        description: stepData.description,
        resourceLinks: stepData.resourceLinks,
        isOptional: stepData.isOptional
      });
    }

    // 2. Java Programming Roadmap
    console.log("☕ Creating Java Programming Roadmap...");
    const javaProgramming = await storage.createRoadmap({
      title: "Java Programming Mastery",
      description: "Master Java programming from basics to advanced concepts. Learn object-oriented programming, data structures, algorithms, and build enterprise-level applications. Perfect for aspiring software developers.",
      category: "Programming",
      difficulty: "Intermediate",
      estimatedDuration: 12, // 12 weeks
      createdBy: adminUser.id
    });

    const javaProgrammingSteps = [
      {
        stepNumber: 1,
        title: "Java Environment & Basics ☕",
        description: "Set up Java development environment, learn syntax, variables, data types, and write your first Java program.",
        resourceLinks: [
          { type: "video", title: "Java Setup Guide", url: "https://www.youtube.com/watch?v=H3Q2QRmyYho" },
          { type: "practice", title: "Java Basics on Codecademy", url: "https://www.codecademy.com/learn/learn-java" },
          { type: "interactive", title: "Java Interactive Tutorial", url: "https://www.learnjavaonline.org/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 2,
        title: "Object-Oriented Programming 🏗️",
        description: "Master classes, objects, inheritance, polymorphism, and encapsulation. Learn the core principles of OOP.",
        resourceLinks: [
          { type: "video", title: "Java OOP Tutorial", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "OOP Practice on HackerRank", url: "https://www.hackerrank.com/domains/java" },
          { type: "interactive", title: "OOP Interactive Guide", url: "https://www.learnjavaonline.org/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 3,
        title: "Data Structures & Collections 📊",
        description: "Learn ArrayList, LinkedList, HashMap, HashSet, and other Java collections. Master data manipulation and storage.",
        resourceLinks: [
          { type: "video", title: "Java Collections", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "Collection Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "interactive", title: "Collection Framework Guide", url: "https://docs.oracle.com/javase/tutorial/collections/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 4,
        title: "Exception Handling & File I/O 🛡️",
        description: "Learn try-catch blocks, custom exceptions, file operations, and robust error handling in Java applications.",
        resourceLinks: [
          { type: "video", title: "Java Exception Handling", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "Exception Handling Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "interactive", title: "File I/O Tutorial", url: "https://docs.oracle.com/javase/tutorial/essential/io/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 5,
        title: "Multithreading & Concurrency ⚡",
        description: "Learn Thread class, Runnable interface, synchronization, and concurrent programming concepts.",
        resourceLinks: [
          { type: "video", title: "Java Multithreading", url: "https://www.youtube.com/watch?v=ldY1g6M75Xo" },
          { type: "practice", title: "Threading Exercises", url: "https://www.hackerrank.com/domains/java" },
          { type: "interactive", title: "Concurrency Guide", url: "https://docs.oracle.com/javase/tutorial/essential/concurrency/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 6,
        title: "Spring Framework 🌱",
        description: "Learn Spring Boot, dependency injection, REST APIs, and modern Java web development.",
        resourceLinks: [
          { type: "video", title: "Spring Boot Tutorial", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Spring Boot Projects", url: "https://spring.io/guides" },
          { type: "interactive", title: "Spring Framework Guide", url: "https://spring.io/projects/spring-framework" }
        ],
        isOptional: false
      },
      {
        stepNumber: 7,
        title: "Database Integration with JPA 🗄️",
        description: "Learn JPA, Hibernate, database operations, and ORM concepts for enterprise applications.",
        resourceLinks: [
          { type: "video", title: "Spring Data JPA", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "JPA Exercises", url: "https://spring.io/guides" },
          { type: "interactive", title: "JPA Documentation", url: "https://spring.io/projects/spring-data-jpa" }
        ],
        isOptional: false
      },
      {
        stepNumber: 8,
        title: "Testing & Quality Assurance 🧪",
        description: "Learn JUnit, Mockito, testing strategies, and ensure code quality in Java applications.",
        resourceLinks: [
          { type: "video", title: "Java Testing", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Testing Exercises", url: "https://junit.org/junit5/" },
          { type: "interactive", title: "Testing Guide", url: "https://junit.org/junit5/docs/current/user-guide/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 9,
        title: "Microservices & Cloud ☁️",
        description: "Learn microservices architecture, Docker, cloud deployment, and modern Java development practices.",
        resourceLinks: [
          { type: "video", title: "Java Microservices", url: "https://www.youtube.com/watch?v=9SGDpanrc8U" },
          { type: "practice", title: "Microservices Projects", url: "https://spring.io/guides" },
          { type: "interactive", title: "Cloud Deployment Guide", url: "https://spring.io/projects/spring-cloud" }
        ],
        isOptional: false
      },
      {
        stepNumber: 10,
        title: "Final Enterprise Project 🏢",
        description: "Build a complete enterprise Java application with all modern features and best practices.",
        resourceLinks: [
          { type: "video", title: "Enterprise Java Project", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Project Templates", url: "https://github.com/topics/java-spring-boot" },
          { type: "community", title: "Java Community", url: "https://www.reddit.com/r/java/" }
        ],
        isOptional: false
      }
    ];

    for (const stepData of javaProgrammingSteps) {
      await storage.createRoadmapStep({
        roadmapId: javaProgramming.id,
        stepNumber: stepData.stepNumber,
        title: stepData.title,
        description: stepData.description,
        resourceLinks: stepData.resourceLinks,
        isOptional: stepData.isOptional
      });
    }

    // 3. Full Stack Development Roadmap
    console.log("🌐 Creating Full Stack Development Roadmap...");
    const fullStackDev = await storage.createRoadmap({
      title: "Full Stack Web Development",
      description: "Master both frontend and backend development! Learn HTML, CSS, JavaScript, React, Node.js, databases, and deployment. Build complete web applications from scratch.",
      category: "Web Development",
      difficulty: "Intermediate",
      estimatedDuration: 16, // 16 weeks
      createdBy: adminUser.id
    });

    const fullStackDevSteps = [
      {
        stepNumber: 1,
        title: "Frontend Fundamentals 🎨",
        description: "Learn HTML5, CSS3, JavaScript ES6+, and responsive design. Build beautiful, interactive web pages.",
        resourceLinks: [
          { type: "video", title: "Web Development Basics", url: "https://www.youtube.com/watch?v=qz0aGYrrlhU" },
          { type: "practice", title: "FreeCodeCamp Frontend", url: "https://www.freecodecamp.org/learn/responsive-web-design/" },
          { type: "interactive", title: "Interactive Web Tutorial", url: "https://www.w3schools.com/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 2,
        title: "React Development ⚛️",
        description: "Master React, components, hooks, state management, and modern frontend development patterns.",
        resourceLinks: [
          { type: "video", title: "React Tutorial", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "React Exercises", url: "https://reactjs.org/tutorial/tutorial.html" },
          { type: "interactive", title: "React Interactive Guide", url: "https://reactjs.org/docs/getting-started.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 3,
        title: "Backend with Node.js 🚀",
        description: "Learn Node.js, Express.js, REST APIs, and server-side JavaScript development.",
        resourceLinks: [
          { type: "video", title: "Node.js Tutorial", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
          { type: "practice", title: "Node.js Projects", url: "https://expressjs.com/en/starter/installing.html" },
          { type: "interactive", title: "Node.js Guide", url: "https://nodejs.org/en/docs/guides/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 4,
        title: "Database Integration 🗄️",
        description: "Learn MongoDB, SQL databases, ORMs, and data persistence in web applications.",
        resourceLinks: [
          { type: "video", title: "Database Tutorial", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
          { type: "practice", title: "Database Exercises", url: "https://mongoosejs.com/docs/" },
          { type: "interactive", title: "Database Guide", url: "https://docs.mongodb.com/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 5,
        title: "Authentication & Security 🔐",
        description: "Learn JWT tokens, bcrypt, authentication, authorization, and web security best practices.",
        resourceLinks: [
          { type: "video", title: "Web Security Tutorial", url: "https://www.youtube.com/watch?v=Oe421EPjeBE" },
          { type: "practice", title: "Security Exercises", url: "https://jwt.io/introduction" },
          { type: "interactive", title: "Security Guide", url: "https://owasp.org/www-project-top-ten/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 6,
        title: "State Management & APIs 🔄",
        description: "Learn Redux, API integration, data flow, and state management in complex applications.",
        resourceLinks: [
          { type: "video", title: "Redux Tutorial", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "State Management Exercises", url: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts" },
          { type: "interactive", title: "API Integration Guide", url: "https://developer.mozilla.org/en-US/docs/Web/API" }
        ],
        isOptional: false
      },
      {
        stepNumber: 7,
        title: "Testing & Quality 🧪",
        description: "Learn Jest, React Testing Library, API testing, and ensure code quality in web applications.",
        resourceLinks: [
          { type: "video", title: "Web Testing Tutorial", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "Testing Exercises", url: "https://testing-library.com/docs/react-testing-library/intro/" },
          { type: "interactive", title: "Testing Guide", url: "https://jestjs.io/docs/getting-started" }
        ],
        isOptional: false
      },
      {
        stepNumber: 8,
        title: "Deployment & DevOps 🚀",
        description: "Learn deployment strategies, Docker, CI/CD, and production deployment of web applications.",
        resourceLinks: [
          { type: "video", title: "Deployment Tutorial", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Deployment Projects", url: "https://devcenter.heroku.com/articles/getting-started-with-nodejs" },
          { type: "interactive", title: "DevOps Guide", url: "https://docs.docker.com/get-started/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 9,
        title: "Performance Optimization ⚡",
        description: "Learn frontend optimization, backend optimization, caching, and performance monitoring.",
        resourceLinks: [
          { type: "video", title: "Performance Tutorial", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Optimization Exercises", url: "https://web.dev/performance/" },
          { type: "interactive", title: "Performance Guide", url: "https://web.dev/performance/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 10,
        title: "Final Full-Stack Project 🌟",
        description: "Build a complete full-stack web application with all modern features and best practices.",
        resourceLinks: [
          { type: "video", title: "Full-Stack Project", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Project Ideas", url: "https://github.com/topics/full-stack" },
          { type: "community", title: "Web Dev Community", url: "https://www.reddit.com/r/webdev/" }
        ],
        isOptional: false
      }
    ];

    for (const stepData of fullStackDevSteps) {
      await storage.createRoadmapStep({
        roadmapId: fullStackDev.id,
        stepNumber: stepData.stepNumber,
        title: stepData.title,
        description: stepData.description,
        resourceLinks: stepData.resourceLinks,
        isOptional: stepData.isOptional
      });
    }

    // 4. AI/ML Roadmap
    console.log("🤖 Creating AI/ML Roadmap...");
    const aiMlRoadmap = await storage.createRoadmap({
      title: "Artificial Intelligence & Machine Learning",
      description: "Dive into the world of AI and ML! Learn Python for data science, machine learning algorithms, deep learning, and build intelligent applications. Perfect for future AI engineers and data scientists.",
      category: "Artificial Intelligence",
      difficulty: "Intermediate",
      estimatedDuration: 20, // 20 weeks
      createdBy: adminUser.id
    });

    const aiMlSteps = [
      {
        stepNumber: 1,
        title: "Python for Data Science 🐍",
        description: "Master Python fundamentals for data science. Learn NumPy, Pandas, and data manipulation techniques.",
        resourceLinks: [
          { type: "video", title: "Python Data Science", url: "https://www.youtube.com/watch?v=LHBE6Q9XlzI" },
          { type: "practice", title: "Kaggle Learn Python", url: "https://www.kaggle.com/learn/python" },
          { type: "interactive", title: "Data Science Tutorial", url: "https://www.learnpython.org/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 2,
        title: "Data Analysis & Visualization 📊",
        description: "Learn data exploration, statistical analysis, and create beautiful visualizations with Matplotlib and Seaborn.",
        resourceLinks: [
          { type: "video", title: "Data Visualization", url: "https://www.youtube.com/watch?v=UO98lJQ3QGI" },
          { type: "practice", title: "Kaggle Data Visualization", url: "https://www.kaggle.com/learn/data-visualization" },
          { type: "interactive", title: "Visualization Guide", url: "https://seaborn.pydata.org/tutorial.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 3,
        title: "Machine Learning Fundamentals 🧠",
        description: "Learn supervised vs unsupervised learning, training/testing data, and model evaluation techniques.",
        resourceLinks: [
          { type: "video", title: "ML Introduction", url: "https://www.youtube.com/watch?v=ukzFI9rgwfU" },
          { type: "practice", title: "Kaggle ML Course", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
          { type: "interactive", title: "ML Guide", url: "https://scikit-learn.org/stable/tutorial/index.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 4,
        title: "Supervised Learning Algorithms 📈",
        description: "Master linear regression, logistic regression, decision trees, and random forests for classification and regression.",
        resourceLinks: [
          { type: "video", title: "Supervised Learning", url: "https://www.youtube.com/watch?v=8hly31xKli0" },
          { type: "practice", title: "ML Algorithms Practice", url: "https://www.kaggle.com/learn/machine-learning" },
          { type: "interactive", title: "Algorithm Guide", url: "https://scikit-learn.org/stable/supervised_learning.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 5,
        title: "Unsupervised Learning 🔍",
        description: "Learn clustering algorithms, dimensionality reduction, and pattern discovery in unlabeled data.",
        resourceLinks: [
          { type: "video", title: "Unsupervised Learning", url: "https://www.youtube.com/watch?v=4b5d3muHzm4" },
          { type: "practice", title: "Clustering Exercises", url: "https://www.kaggle.com/learn/clustering" },
          { type: "interactive", title: "Clustering Guide", url: "https://scikit-learn.org/stable/unsupervised_learning.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 6,
        title: "Deep Learning with TensorFlow 🧠",
        description: "Introduction to neural networks, TensorFlow/Keras, and building deep learning models.",
        resourceLinks: [
          { type: "video", title: "Deep Learning", url: "https://www.youtube.com/watch?v=aircAruvnKk" },
          { type: "practice", title: "TensorFlow Tutorials", url: "https://www.tensorflow.org/tutorials" },
          { type: "interactive", title: "Keras Guide", url: "https://keras.io/guides/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 7,
        title: "Natural Language Processing 🗣️",
        description: "Learn text preprocessing, tokenization, word embeddings, and NLP applications.",
        resourceLinks: [
          { type: "video", title: "NLP Tutorial", url: "https://www.youtube.com/watch?v=oWVTO_69U4o" },
          { type: "practice", title: "NLP Projects", url: "https://www.kaggle.com/learn/natural-language-processing" },
          { type: "interactive", title: "NLP Guide", url: "https://www.nltk.org/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 8,
        title: "Computer Vision 👁️",
        description: "Learn image processing, convolutional neural networks, and computer vision applications.",
        resourceLinks: [
          { type: "video", title: "Computer Vision", url: "https://www.youtube.com/watch?v=aircAruvnKk" },
          { type: "practice", title: "CV Projects", url: "https://www.kaggle.com/learn/computer-vision" },
          { type: "interactive", title: "OpenCV Guide", url: "https://opencv.org/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 9,
        title: "Model Deployment & MLOps 🚀",
        description: "Learn model deployment, monitoring, and MLOps practices for production AI systems.",
        resourceLinks: [
          { type: "video", title: "MLOps Tutorial", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Deployment Projects", url: "https://www.kaggle.com/learn/intro-to-deep-learning" },
          { type: "interactive", title: "MLOps Guide", url: "https://ml-ops.org/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 10,
        title: "Final AI Project 🤖",
        description: "Build a complete AI/ML project from data collection to model deployment and presentation.",
        resourceLinks: [
          { type: "video", title: "AI Project Ideas", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Portfolio Projects", url: "https://www.kaggle.com/learn/data-science-project" },
          { type: "community", title: "AI Community", url: "https://www.reddit.com/r/MachineLearning/" }
        ],
        isOptional: false
      }
    ];

    for (const stepData of aiMlSteps) {
      await storage.createRoadmapStep({
        roadmapId: aiMlRoadmap.id,
        stepNumber: stepData.stepNumber,
        title: stepData.title,
        description: stepData.description,
        resourceLinks: stepData.resourceLinks,
        isOptional: stepData.isOptional
      });
    }

    // 5. Data Science Roadmap
    console.log("📊 Creating Data Science Roadmap...");
    const dataScienceRoadmap = await storage.createRoadmap({
      title: "Data Science & Analytics",
      description: "Become a data scientist! Learn data analysis, statistics, machine learning, and data visualization. Master the complete data science workflow from data collection to insights.",
      category: "Data Science",
      difficulty: "Intermediate",
      estimatedDuration: 18, // 18 weeks
      createdBy: adminUser.id
    });

    const dataScienceSteps = [
      {
        stepNumber: 1,
        title: "Data Science Environment Setup 🛠️",
        description: "Set up your data science environment with Python, Jupyter notebooks, and essential libraries.",
        resourceLinks: [
          { type: "video", title: "Data Science Setup", url: "https://www.youtube.com/watch?v=5JnMutdy6Fw" },
          { type: "practice", title: "Jupyter Tutorial", url: "https://jupyter.org/documentation" },
          { type: "interactive", title: "Environment Guide", url: "https://docs.anaconda.com/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 2,
        title: "Data Collection & Cleaning 🧹",
        description: "Learn data collection methods, data cleaning techniques, and handling missing values.",
        resourceLinks: [
          { type: "video", title: "Data Cleaning", url: "https://www.youtube.com/watch?v=8o2s9vXa0Qk" },
          { type: "practice", title: "Data Cleaning Project", url: "https://www.kaggle.com/learn/data-cleaning" },
          { type: "interactive", title: "Cleaning Guide", url: "https://pandas.pydata.org/docs/user_guide/missing_data.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 3,
        title: "Exploratory Data Analysis (EDA) 🔍",
        description: "Master EDA techniques, data profiling, correlation analysis, and comprehensive data exploration.",
        resourceLinks: [
          { type: "video", title: "EDA Tutorial", url: "https://www.youtube.com/watch?v=xi0vhXFPegw" },
          { type: "practice", title: "EDA Project", url: "https://www.kaggle.com/learn/exploratory-data-analysis" },
          { type: "interactive", title: "EDA Guide", url: "https://pandas-profiling.github.io/pandas-profiling/docs/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 4,
        title: "Statistical Analysis 📈",
        description: "Learn descriptive statistics, hypothesis testing, and statistical modeling techniques.",
        resourceLinks: [
          { type: "video", title: "Statistics Tutorial", url: "https://www.youtube.com/watch?v=xxpc-HPKN28" },
          { type: "practice", title: "Statistical Thinking", url: "https://www.kaggle.com/learn/statistical-thinking" },
          { type: "interactive", title: "Stats Guide", url: "https://docs.scipy.org/doc/scipy/reference/stats.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 5,
        title: "Data Visualization 📊",
        description: "Master data visualization with Matplotlib, Seaborn, and Plotly. Create compelling data stories.",
        resourceLinks: [
          { type: "video", title: "Data Visualization", url: "https://www.youtube.com/watch?v=UO98lJQ3QGI" },
          { type: "practice", title: "Viz Projects", url: "https://www.kaggle.com/learn/data-visualization" },
          { type: "interactive", title: "Viz Guide", url: "https://seaborn.pydata.org/tutorial.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 6,
        title: "Machine Learning for Data Science 🤖",
        description: "Learn supervised and unsupervised learning algorithms for data science applications.",
        resourceLinks: [
          { type: "video", title: "ML for Data Science", url: "https://www.youtube.com/watch?v=ukzFI9rgwfU" },
          { type: "practice", title: "ML Projects", url: "https://www.kaggle.com/learn/intro-to-machine-learning" },
          { type: "interactive", title: "ML Guide", url: "https://scikit-learn.org/stable/tutorial/index.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 7,
        title: "Feature Engineering 🔧",
        description: "Learn feature creation, transformation, selection, and engineering techniques for better models.",
        resourceLinks: [
          { type: "video", title: "Feature Engineering", url: "https://www.youtube.com/watch?v=z0sJ6xV8ba0" },
          { type: "practice", title: "Feature Engineering", url: "https://www.kaggle.com/learn/feature-engineering" },
          { type: "interactive", title: "Engineering Guide", url: "https://scikit-learn.org/stable/modules/feature_selection.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 8,
        title: "Time Series Analysis ⏰",
        description: "Learn time series data handling, forecasting, and temporal pattern analysis.",
        resourceLinks: [
          { type: "video", title: "Time Series", url: "https://www.youtube.com/watch?v=UFuo7EHI8zc" },
          { type: "practice", title: "Time Series Project", url: "https://www.kaggle.com/learn/time-series" },
          { type: "interactive", title: "Time Series Guide", url: "https://pandas.pydata.org/docs/user_guide/timeseries.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 9,
        title: "Big Data & Cloud Computing ☁️",
        description: "Learn big data tools, cloud platforms, and scalable data processing techniques.",
        resourceLinks: [
          { type: "video", title: "Big Data Tutorial", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Cloud Projects", url: "https://www.kaggle.com/learn/intro-to-deep-learning" },
          { type: "interactive", title: "Big Data Guide", url: "https://spark.apache.org/docs/latest/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 10,
        title: "Final Data Science Project 📊",
        description: "Complete end-to-end data science project from data collection to insights and presentation.",
        resourceLinks: [
          { type: "video", title: "Data Science Project", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Portfolio Project", url: "https://www.kaggle.com/learn/data-science-project" },
          { type: "community", title: "Data Science Community", url: "https://www.reddit.com/r/datascience/" }
        ],
        isOptional: false
      }
    ];

    for (const stepData of dataScienceSteps) {
      await storage.createRoadmapStep({
        roadmapId: dataScienceRoadmap.id,
        stepNumber: stepData.stepNumber,
        title: stepData.title,
        description: stepData.description,
        resourceLinks: stepData.resourceLinks,
        isOptional: stepData.isOptional
      });
    }

    // 6. Advanced Python Roadmap
    console.log("🐍 Creating Advanced Python Roadmap...");
    const advancedPythonRoadmap = await storage.createRoadmap({
      title: "Advanced Python Development",
      description: "Take your Python skills to the next level! Learn advanced concepts, design patterns, performance optimization, and build enterprise-level applications. Perfect for experienced developers.",
      category: "Programming",
      difficulty: "Advanced",
      estimatedDuration: 14, // 14 weeks
      createdBy: adminUser.id
    });

    const advancedPythonSteps = [
      {
        stepNumber: 1,
        title: "Advanced Python Features 🚀",
        description: "Master decorators, generators, context managers, and advanced Python language features.",
        resourceLinks: [
          { type: "video", title: "Advanced Python", url: "https://www.youtube.com/watch?v=HGOBQPFzWKo" },
          { type: "practice", title: "Advanced Exercises", url: "https://www.hackerrank.com/domains/python" },
          { type: "interactive", title: "Advanced Guide", url: "https://docs.python.org/3/tutorial/classes.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 2,
        title: "Design Patterns & Architecture 🏗️",
        description: "Learn design patterns, SOLID principles, and architectural patterns for scalable Python applications.",
        resourceLinks: [
          { type: "video", title: "Python Design Patterns", url: "https://www.youtube.com/watch?v=HGOBQPFzWKo" },
          { type: "practice", title: "Pattern Exercises", url: "https://www.hackerrank.com/domains/python" },
          { type: "interactive", title: "Patterns Guide", url: "https://refactoring.guru/design-patterns" }
        ],
        isOptional: false
      },
      {
        stepNumber: 3,
        title: "Performance Optimization ⚡",
        description: "Learn profiling, optimization techniques, memory management, and high-performance Python programming.",
        resourceLinks: [
          { type: "video", title: "Python Performance", url: "https://www.youtube.com/watch?v=HGOBQPFzWKo" },
          { type: "practice", title: "Performance Exercises", url: "https://www.hackerrank.com/domains/python" },
          { type: "interactive", title: "Optimization Guide", url: "https://docs.python.org/3/library/profile.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 4,
        title: "Concurrency & Parallelism 🔄",
        description: "Master threading, multiprocessing, async/await, and concurrent programming in Python.",
        resourceLinks: [
          { type: "video", title: "Python Concurrency", url: "https://www.youtube.com/watch?v=HGOBQPFzWKo" },
          { type: "practice", title: "Concurrency Exercises", url: "https://www.hackerrank.com/domains/python" },
          { type: "interactive", title: "Concurrency Guide", url: "https://docs.python.org/3/library/asyncio.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 5,
        title: "Web Frameworks & APIs 🌐",
        description: "Learn Django, FastAPI, Flask, and build scalable web applications and REST APIs.",
        resourceLinks: [
          { type: "video", title: "Python Web Frameworks", url: "https://www.youtube.com/watch?v=HGOBQPFzWKo" },
          { type: "practice", title: "Web Projects", url: "https://docs.djangoproject.com/" },
          { type: "interactive", title: "Framework Guide", url: "https://fastapi.tiangolo.com/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 6,
        title: "Testing & Quality Assurance 🧪",
        description: "Master pytest, test-driven development, mocking, and ensure code quality in Python applications.",
        resourceLinks: [
          { type: "video", title: "Python Testing", url: "https://www.youtube.com/watch?v=6tNS--WetLI" },
          { type: "practice", title: "Testing Exercises", url: "https://docs.pytest.org/" },
          { type: "interactive", title: "Testing Guide", url: "https://docs.pytest.org/en/stable/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 7,
        title: "Package Development & Distribution 📦",
        description: "Learn to create, package, and distribute Python libraries and applications.",
        resourceLinks: [
          { type: "video", title: "Python Packaging", url: "https://www.youtube.com/watch?v=HGOBQPFzWKo" },
          { type: "practice", title: "Package Projects", url: "https://packaging.python.org/" },
          { type: "interactive", title: "Packaging Guide", url: "https://packaging.python.org/tutorials/packaging-projects/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 8,
        title: "DevOps & Deployment 🚀",
        description: "Learn Docker, CI/CD, cloud deployment, and production deployment strategies for Python applications.",
        resourceLinks: [
          { type: "video", title: "Python DevOps", url: "https://www.youtube.com/watch?v=HGOBQPFzWKo" },
          { type: "practice", title: "DevOps Projects", url: "https://docs.docker.com/get-started/" },
          { type: "interactive", title: "Deployment Guide", url: "https://devcenter.heroku.com/articles/getting-started-with-python" }
        ],
        isOptional: false
      },
      {
        stepNumber: 9,
        title: "Microservices & Architecture 🏢",
        description: "Learn microservices architecture, service communication, and scalable application design.",
        resourceLinks: [
          { type: "video", title: "Python Microservices", url: "https://www.youtube.com/watch?v=HGOBQPFzWKo" },
          { type: "practice", title: "Architecture Projects", url: "https://microservices.io/" },
          { type: "interactive", title: "Architecture Guide", url: "https://microservices.io/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 10,
        title: "Final Advanced Project 🎯",
        description: "Build a complete enterprise Python application with all advanced features and best practices.",
        resourceLinks: [
          { type: "video", title: "Advanced Project Ideas", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Enterprise Projects", url: "https://github.com/topics/python-enterprise" },
          { type: "community", title: "Python Community", url: "https://www.reddit.com/r/Python/" }
        ],
        isOptional: false
      }
    ];

    for (const stepData of advancedPythonSteps) {
      await storage.createRoadmapStep({
        roadmapId: advancedPythonRoadmap.id,
        stepNumber: stepData.stepNumber,
        title: stepData.title,
        description: stepData.description,
        resourceLinks: stepData.resourceLinks,
        isOptional: stepData.isOptional
      });
    }

    // 7. Web Development Roadmap
    console.log("🌐 Creating Web Development Roadmap...");
    const webDevRoadmap = await storage.createRoadmap({
      title: "Modern Web Development",
      description: "Master modern web development! Learn HTML5, CSS3, JavaScript, React, Vue.js, and build responsive, interactive web applications. Perfect for aspiring frontend and full-stack developers.",
      category: "Web Development",
      difficulty: "Beginner",
      estimatedDuration: 12, // 12 weeks
      createdBy: adminUser.id
    });

    const webDevSteps = [
      {
        stepNumber: 1,
        title: "HTML5 & Semantic Markup 📝",
        description: "Learn modern HTML5, semantic elements, accessibility, and create well-structured web pages.",
        resourceLinks: [
          { type: "video", title: "HTML5 Tutorial", url: "https://www.youtube.com/watch?v=qz0aGYrrlhU" },
          { type: "practice", title: "HTML Exercises", url: "https://www.freecodecamp.org/learn/responsive-web-design/" },
          { type: "interactive", title: "HTML Guide", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" }
        ],
        isOptional: false
      },
      {
        stepNumber: 2,
        title: "CSS3 & Styling 🎨",
        description: "Master CSS3, flexbox, grid, animations, and create beautiful, responsive designs.",
        resourceLinks: [
          { type: "video", title: "CSS3 Tutorial", url: "https://www.youtube.com/watch?v=1Rs2ND1ryYc" },
          { type: "practice", title: "CSS Grid Garden", url: "https://cssgridgarden.com/" },
          { type: "interactive", title: "Flexbox Froggy", url: "https://flexboxfroggy.com/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 3,
        title: "JavaScript Fundamentals ⚡",
        description: "Learn modern JavaScript, ES6+ features, DOM manipulation, and interactive web development.",
        resourceLinks: [
          { type: "video", title: "JavaScript Tutorial", url: "https://www.youtube.com/watch?v=hdI2bqOjy3c" },
          { type: "practice", title: "JavaScript Exercises", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
          { type: "interactive", title: "JS Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" }
        ],
        isOptional: false
      },
      {
        stepNumber: 4,
        title: "Responsive Design 📱",
        description: "Learn responsive design principles, media queries, mobile-first approach, and cross-device compatibility.",
        resourceLinks: [
          { type: "video", title: "Responsive Design", url: "https://www.youtube.com/watch?v=srvUrASLq0" },
          { type: "practice", title: "Responsive Projects", url: "https://www.freecodecamp.org/learn/responsive-web-design/" },
          { type: "interactive", title: "Responsive Guide", url: "https://web.dev/responsive-web-design-basics/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 5,
        title: "React Development ⚛️",
        description: "Master React, components, hooks, state management, and modern frontend development patterns.",
        resourceLinks: [
          { type: "video", title: "React Tutorial", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "React Exercises", url: "https://reactjs.org/tutorial/tutorial.html" },
          { type: "interactive", title: "React Guide", url: "https://reactjs.org/docs/getting-started.html" }
        ],
        isOptional: false
      },
      {
        stepNumber: 6,
        title: "Vue.js Alternative 🟢",
        description: "Learn Vue.js as an alternative to React. Understand component-based architecture and modern frameworks.",
        resourceLinks: [
          { type: "video", title: "Vue.js Tutorial", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "Vue.js Projects", url: "https://vuejs.org/tutorial/" },
          { type: "interactive", title: "Vue Guide", url: "https://vuejs.org/guide/" }
        ],
        isOptional: true
      },
      {
        stepNumber: 7,
        title: "State Management 🔄",
        description: "Learn Redux, Vuex, state management patterns, and managing complex application state.",
        resourceLinks: [
          { type: "video", title: "State Management", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "Redux Exercises", url: "https://redux.js.org/tutorials/essentials/part-1-overview-concepts" },
          { type: "interactive", title: "State Guide", url: "https://vuex.vuejs.org/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 8,
        title: "API Integration 🌐",
        description: "Learn REST APIs, GraphQL, fetch API, and integrating with backend services.",
        resourceLinks: [
          { type: "video", title: "API Integration", url: "https://www.youtube.com/watch?v=Oive66jrwBs" },
          { type: "practice", title: "API Projects", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
          { type: "interactive", title: "API Guide", url: "https://developer.mozilla.org/en-US/docs/Web/API" }
        ],
        isOptional: false
      },
      {
        stepNumber: 9,
        title: "Testing & Quality 🧪",
        description: "Learn Jest, Vue Test Utils, testing strategies, and ensure code quality in web applications.",
        resourceLinks: [
          { type: "video", title: "Web Testing", url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8" },
          { type: "practice", title: "Testing Exercises", url: "https://testing-library.com/docs/react-testing-library/intro/" },
          { type: "interactive", title: "Testing Guide", url: "https://jestjs.io/docs/getting-started" }
        ],
        isOptional: false
      },
      {
        stepNumber: 10,
        title: "Performance & Optimization ⚡",
        description: "Learn web performance optimization, lazy loading, code splitting, and modern optimization techniques.",
        resourceLinks: [
          { type: "video", title: "Web Performance", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Performance Projects", url: "https://web.dev/performance/" },
          { type: "interactive", title: "Performance Guide", url: "https://web.dev/performance/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 11,
        title: "Build Tools & Workflow 🛠️",
        description: "Learn Webpack, Vite, npm, modern build tools, and development workflows.",
        resourceLinks: [
          { type: "video", title: "Build Tools", url: "https://www.youtube.com/watch?v=MpGLUVbqoYQ" },
          { type: "practice", title: "Build Tool Setup", url: "https://webpack.js.org/guides/getting-started/" },
          { type: "interactive", title: "Vite Guide", url: "https://vitejs.dev/guide/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 12,
        title: "Final Web Project 🌟",
        description: "Build a complete modern web application with all features and best practices.",
        resourceLinks: [
          { type: "video", title: "Web Project Ideas", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Portfolio Projects", url: "https://github.com/topics/web-development" },
          { type: "community", title: "Web Dev Community", url: "https://www.reddit.com/r/webdev/" }
        ],
        isOptional: false
      }
    ];

    for (const stepData of webDevSteps) {
      await storage.createRoadmapStep({
        roadmapId: webDevRoadmap.id,
        stepNumber: stepData.stepNumber,
        title: stepData.title,
        description: stepData.description,
        resourceLinks: stepData.resourceLinks,
        isOptional: stepData.isOptional
      });
    }

    // 8. Cybersecurity Roadmap
    console.log("🔒 Creating Cybersecurity Roadmap...");
    const cybersecurityRoadmap = await storage.createRoadmap({
      title: "Cybersecurity & Ethical Hacking",
      description: "Protect the digital world! Learn cybersecurity fundamentals, ethical hacking, network security, and become a cybersecurity professional. Perfect for aspiring security experts and ethical hackers.",
      category: "Cybersecurity",
      difficulty: "Intermediate",
      estimatedDuration: 16, // 16 weeks
      createdBy: adminUser.id
    });

    const cybersecuritySteps = [
      {
        stepNumber: 1,
        title: "Cybersecurity Fundamentals 🛡️",
        description: "Learn the basics of cybersecurity, threat landscape, security principles, and the CIA triad.",
        resourceLinks: [
          { type: "video", title: "Cybersecurity Basics", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Security Fundamentals", url: "https://www.coursera.org/learn/intro-cyber-security" },
          { type: "interactive", title: "Security Guide", url: "https://www.cybrary.it/course/cyber-security-fundamentals/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 2,
        title: "Network Security 🌐",
        description: "Learn network protocols, firewalls, intrusion detection, and network security best practices.",
        resourceLinks: [
          { type: "video", title: "Network Security", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Network Exercises", url: "https://www.coursera.org/learn/network-security" },
          { type: "interactive", title: "Network Guide", url: "https://www.cybrary.it/course/network-security/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 3,
        title: "Operating System Security 💻",
        description: "Learn Windows and Linux security, user management, file permissions, and system hardening.",
        resourceLinks: [
          { type: "video", title: "OS Security", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "OS Security Labs", url: "https://www.coursera.org/learn/operating-system-security" },
          { type: "interactive", title: "OS Security Guide", url: "https://www.cybrary.it/course/operating-system-security/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 4,
        title: "Web Application Security 🌐",
        description: "Learn OWASP Top 10, SQL injection, XSS, CSRF, and web application security testing.",
        resourceLinks: [
          { type: "video", title: "Web App Security", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Web Security Labs", url: "https://portswigger.net/web-security" },
          { type: "interactive", title: "OWASP Guide", url: "https://owasp.org/www-project-top-ten/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 5,
        title: "Cryptography & Encryption 🔐",
        description: "Learn encryption algorithms, digital signatures, certificates, and cryptographic protocols.",
        resourceLinks: [
          { type: "video", title: "Cryptography Tutorial", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Crypto Exercises", url: "https://www.coursera.org/learn/cryptography" },
          { type: "interactive", title: "Crypto Guide", url: "https://www.cybrary.it/course/cryptography/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 6,
        title: "Ethical Hacking & Penetration Testing 🔍",
        description: "Learn ethical hacking methodologies, penetration testing, vulnerability assessment, and security testing.",
        resourceLinks: [
          { type: "video", title: "Ethical Hacking", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Hacking Labs", url: "https://www.hackthebox.eu/" },
          { type: "interactive", title: "Hacking Guide", url: "https://www.cybrary.it/course/ethical-hacking/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 7,
        title: "Malware Analysis & Reverse Engineering 🦠",
        description: "Learn malware analysis techniques, reverse engineering, and understanding malicious software.",
        resourceLinks: [
          { type: "video", title: "Malware Analysis", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Malware Labs", url: "https://www.coursera.org/learn/malware-analysis" },
          { type: "interactive", title: "Analysis Guide", url: "https://www.cybrary.it/course/malware-analysis/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 8,
        title: "Incident Response & Forensics 🔍",
        description: "Learn digital forensics, incident response procedures, and evidence collection techniques.",
        resourceLinks: [
          { type: "video", title: "Digital Forensics", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Forensics Labs", url: "https://www.coursera.org/learn/digital-forensics" },
          { type: "interactive", title: "Forensics Guide", url: "https://www.cybrary.it/course/digital-forensics/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 9,
        title: "Security Tools & Technologies 🛠️",
        description: "Learn security tools, SIEM, IDS/IPS, vulnerability scanners, and security automation.",
        resourceLinks: [
          { type: "video", title: "Security Tools", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Tool Labs", url: "https://www.coursera.org/learn/security-tools" },
          { type: "interactive", title: "Tools Guide", url: "https://www.cybrary.it/course/security-tools/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 10,
        title: "Cloud Security ☁️",
        description: "Learn cloud security principles, AWS/Azure security, and cloud-native security practices.",
        resourceLinks: [
          { type: "video", title: "Cloud Security", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Cloud Security Labs", url: "https://www.coursera.org/learn/cloud-security" },
          { type: "interactive", title: "Cloud Security Guide", url: "https://www.cybrary.it/course/cloud-security/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 11,
        title: "Compliance & Risk Management 📋",
        description: "Learn security frameworks, compliance standards, risk assessment, and security governance.",
        resourceLinks: [
          { type: "video", title: "Risk Management", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Compliance Labs", url: "https://www.coursera.org/learn/risk-management" },
          { type: "interactive", title: "Compliance Guide", url: "https://www.cybrary.it/course/risk-management/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 12,
        title: "Security Operations Center (SOC) 🏢",
        description: "Learn SOC operations, threat hunting, security monitoring, and incident management.",
        resourceLinks: [
          { type: "video", title: "SOC Operations", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "SOC Labs", url: "https://www.coursera.org/learn/soc-operations" },
          { type: "interactive", title: "SOC Guide", url: "https://www.cybrary.it/course/soc-operations/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 13,
        title: "Threat Intelligence & Analysis 🕵️",
        description: "Learn threat intelligence, threat modeling, and security analysis techniques.",
        resourceLinks: [
          { type: "video", title: "Threat Intelligence", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Threat Analysis Labs", url: "https://www.coursera.org/learn/threat-intelligence" },
          { type: "interactive", title: "Threat Guide", url: "https://www.cybrary.it/course/threat-intelligence/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 14,
        title: "Security Automation & Scripting 🤖",
        description: "Learn security automation, Python for security, and scripting for security tasks.",
        resourceLinks: [
          { type: "video", title: "Security Automation", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Automation Labs", url: "https://www.coursera.org/learn/security-automation" },
          { type: "interactive", title: "Automation Guide", url: "https://www.cybrary.it/course/security-automation/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 15,
        title: "Mobile Security 📱",
        description: "Learn mobile security, Android/iOS security, and mobile application security testing.",
        resourceLinks: [
          { type: "video", title: "Mobile Security", url: "https://www.youtube.com/watch?v=inWWhr5tnEA" },
          { type: "practice", title: "Mobile Security Labs", url: "https://www.coursera.org/learn/mobile-security" },
          { type: "interactive", title: "Mobile Security Guide", url: "https://www.cybrary.it/course/mobile-security/" }
        ],
        isOptional: false
      },
      {
        stepNumber: 16,
        title: "Final Cybersecurity Project 🛡️",
        description: "Complete a comprehensive cybersecurity project demonstrating all learned skills and knowledge.",
        resourceLinks: [
          { type: "video", title: "Cybersecurity Project Ideas", url: "https://www.youtube.com/watch?v=8ext9G7xspg" },
          { type: "practice", title: "Portfolio Projects", url: "https://github.com/topics/cybersecurity" },
          { type: "community", title: "Cybersecurity Community", url: "https://www.reddit.com/r/cybersecurity/" }
        ],
        isOptional: false
      }
    ];

    for (const stepData of cybersecuritySteps) {
      await storage.createRoadmapStep({
        roadmapId: cybersecurityRoadmap.id,
        stepNumber: stepData.stepNumber,
        title: stepData.title,
        description: stepData.description,
        resourceLinks: stepData.resourceLinks,
        isOptional: stepData.isOptional
      });
    }

    console.log("🎉 All roadmaps created successfully!");
    console.log("\n📊 Summary:");
    console.log("✅ 8 comprehensive roadmaps created:");
    console.log("  1. 🐍 Python Fundamentals for Beginners (8 weeks)");
    console.log("  2. ☕ Java Programming Mastery (12 weeks)");
    console.log("  3. 🌐 Full Stack Web Development (16 weeks)");
    console.log("  4. 🤖 Artificial Intelligence & Machine Learning (20 weeks)");
    console.log("  5. 📊 Data Science & Analytics (18 weeks)");
    console.log("  6. 🐍 Advanced Python Development (14 weeks)");
    console.log("  7. 🌐 Modern Web Development (12 weeks)");
    console.log("  8. 🔒 Cybersecurity & Ethical Hacking (16 weeks)");
    console.log("\n🚀 Features included:");
    console.log("  ✅ Gen Z-friendly content with emojis and engaging descriptions");
    console.log("  ✅ Progressive difficulty levels (Beginner → Intermediate → Advanced)");
    console.log("  ✅ Comprehensive resource links (videos, practice, interactive)");
    console.log("  ✅ Real-world projects and portfolio building");
    console.log("  ✅ Community engagement and career guidance");
    console.log("  ✅ Industry-relevant technologies and frameworks");
    console.log("\n💡 Next steps:");
    console.log("  1. Run: npm run db:push");
    console.log("  2. Run: npm run db:seed:roadmaps");
    console.log("  3. Start the application: npm run dev");
    console.log("  4. Explore the roadmaps in the application!");

  } catch (error) {
    console.error("❌ Error seeding roadmaps:", error);
    throw error;
  }
}

// Run the seeding if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedRoadmaps()
    .then(() => {
      console.log("✅ Roadmap seeding completed");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Roadmap seeding failed:", error);
      process.exit(1);
    });
}

export { seedRoadmaps };