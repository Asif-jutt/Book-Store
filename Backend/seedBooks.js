/**
 * Seed script to populate database with 20 sample books
 * Run: node seedBooks.js
 */

const mongoose = require("mongoose");
require("dotenv").config();

// Connect to MongoDB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/bookstore",
);

const bookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    description: String,
    price: Number,
    originalPrice: Number,
    category: String,
    image: String,
    thumbnail: String,
    content: String,
    chapters: [
      {
        title: String,
        content: String,
        duration: Number,
        order: Number,
      },
    ],
    totalDuration: Number,
    totalChapters: Number,
    level: String,
    language: String,
    tags: [String],
    rating: Number,
    totalRatings: Number,
    totalStudents: Number,
    isPublished: Boolean,
  },
  { timestamps: true },
);

const Book = mongoose.model("Book", bookSchema);

const books = [
  // FREE BOOKS (5)
  {
    title: "JavaScript Fundamentals",
    author: "Sarah Mitchell",
    description:
      "Master the basics of JavaScript programming. This comprehensive guide covers variables, data types, functions, loops, and DOM manipulation. Perfect for beginners starting their web development journey.",
    price: 0,
    originalPrice: 29.99,
    category: "free",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400",
    level: "beginner",
    language: "English",
    tags: ["javascript", "programming", "web development", "frontend"],
    rating: 4.5,
    totalRatings: 1250,
    totalStudents: 15420,
    isPublished: true,
    chapters: [
      {
        title: "Introduction to JavaScript",
        content: `<h2>Welcome to JavaScript</h2>
        <p>JavaScript is the programming language of the web. It powers interactive websites, web applications, and even server-side applications through Node.js.</p>
        <h3>What You'll Learn</h3>
        <ul>
          <li>Variables and Data Types</li>
          <li>Operators and Expressions</li>
          <li>Control Flow Statements</li>
          <li>Functions and Scope</li>
        </ul>
        <h3>Setting Up Your Environment</h3>
        <p>To get started, all you need is a web browser and a text editor. We recommend Visual Studio Code for the best development experience.</p>
        <pre><code>console.log("Hello, JavaScript!");</code></pre>`,
        duration: 15,
        order: 1,
      },
      {
        title: "Variables and Data Types",
        content: `<h2>Understanding Variables</h2>
        <p>Variables are containers for storing data values. In JavaScript, we use <code>let</code>, <code>const</code>, and <code>var</code> to declare variables.</p>
        <h3>Declaration Keywords</h3>
        <pre><code>let name = "John";      // Can be reassigned
const age = 25;         // Cannot be reassigned
var oldWay = "legacy";  // Function-scoped (avoid)</code></pre>
        <h3>Data Types</h3>
        <ul>
          <li><strong>String:</strong> Text data - "Hello World"</li>
          <li><strong>Number:</strong> Numeric data - 42, 3.14</li>
          <li><strong>Boolean:</strong> true or false</li>
          <li><strong>Array:</strong> List of values - [1, 2, 3]</li>
          <li><strong>Object:</strong> Key-value pairs - {name: "John"}</li>
        </ul>`,
        duration: 20,
        order: 2,
      },
      {
        title: "Functions and Scope",
        content: `<h2>Working with Functions</h2>
        <p>Functions are reusable blocks of code that perform specific tasks.</p>
        <h3>Function Declaration</h3>
        <pre><code>function greet(name) {
  return "Hello, " + name + "!";
}

// Arrow Function
const greetArrow = (name) => "Hello, " + name + "!";</code></pre>
        <h3>Scope</h3>
        <p>Scope determines the accessibility of variables. JavaScript has global scope and local scope.</p>
        <pre><code>let globalVar = "I'm global";

function example() {
  let localVar = "I'm local";
  console.log(globalVar);  // Accessible
  console.log(localVar);   // Accessible
}

console.log(localVar);  // Error: not defined</code></pre>`,
        duration: 25,
        order: 3,
      },
      {
        title: "DOM Manipulation",
        content: `<h2>Interacting with HTML</h2>
        <p>The Document Object Model (DOM) allows JavaScript to interact with HTML elements.</p>
        <h3>Selecting Elements</h3>
        <pre><code>// By ID
const element = document.getElementById("myId");

// By Class
const elements = document.getElementsByClassName("myClass");

// Query Selector
const element = document.querySelector(".myClass");
const elements = document.querySelectorAll("p");</code></pre>
        <h3>Modifying Elements</h3>
        <pre><code>element.textContent = "New text";
element.innerHTML = "<strong>Bold text</strong>";
element.style.color = "blue";
element.classList.add("active");</code></pre>`,
        duration: 30,
        order: 4,
      },
    ],
  },
  {
    title: "HTML & CSS Crash Course",
    author: "Michael Chen",
    description:
      "Learn the building blocks of web development. This free course covers HTML5 semantic elements, CSS styling, flexbox, grid, and responsive design principles.",
    price: 0,
    originalPrice: 24.99,
    category: "free",
    image: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400",
    level: "beginner",
    language: "English",
    tags: ["html", "css", "web design", "frontend"],
    rating: 4.7,
    totalRatings: 2100,
    totalStudents: 28500,
    isPublished: true,
    chapters: [
      {
        title: "HTML Basics",
        content: `<h2>Introduction to HTML</h2>
        <p>HTML (HyperText Markup Language) is the standard markup language for creating web pages.</p>
        <h3>Basic Structure</h3>
        <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="en"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;My Page&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Hello World&lt;/h1&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`,
        duration: 20,
        order: 1,
      },
      {
        title: "CSS Fundamentals",
        content: `<h2>Styling with CSS</h2>
        <p>CSS (Cascading Style Sheets) controls the visual presentation of HTML elements.</p>
        <h3>Selectors and Properties</h3>
        <pre><code>/* Element Selector */
p { color: blue; }

/* Class Selector */
.highlight { background: yellow; }

/* ID Selector */
#header { font-size: 24px; }</code></pre>`,
        duration: 25,
        order: 2,
      },
      {
        title: "Flexbox Layout",
        content: `<h2>Modern Layouts with Flexbox</h2>
        <p>Flexbox provides a more efficient way to lay out, align, and distribute space among items in a container.</p>
        <pre><code>.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}</code></pre>`,
        duration: 30,
        order: 3,
      },
    ],
  },
  {
    title: "Git Version Control",
    author: "David Kim",
    description:
      "Essential Git commands and workflows for developers. Learn branching, merging, rebasing, and collaborative development using GitHub.",
    price: 0,
    originalPrice: 19.99,
    category: "free",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400",
    level: "beginner",
    language: "English",
    tags: ["git", "github", "version control", "devops"],
    rating: 4.6,
    totalRatings: 890,
    totalStudents: 12300,
    isPublished: true,
    chapters: [
      {
        title: "Getting Started with Git",
        content: `<h2>What is Git?</h2>
        <p>Git is a distributed version control system that tracks changes in source code during software development.</p>
        <h3>Basic Commands</h3>
        <pre><code>git init                 # Initialize repository
git add .                # Stage all changes
git commit -m "message"  # Commit changes
git push origin main     # Push to remote</code></pre>`,
        duration: 20,
        order: 1,
      },
      {
        title: "Branching and Merging",
        content: `<h2>Working with Branches</h2>
        <p>Branches allow you to develop features isolated from the main codebase.</p>
        <pre><code>git branch feature-login    # Create branch
git checkout feature-login  # Switch to branch
git merge feature-login     # Merge branch
git branch -d feature-login # Delete branch</code></pre>`,
        duration: 25,
        order: 2,
      },
    ],
  },
  {
    title: "Python for Beginners",
    author: "Emily Watson",
    description:
      "Start your programming journey with Python. This beginner-friendly course covers syntax, data structures, functions, and basic algorithms.",
    price: 0,
    originalPrice: 34.99,
    category: "free",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400",
    level: "beginner",
    language: "English",
    tags: ["python", "programming", "data science", "automation"],
    rating: 4.8,
    totalRatings: 3200,
    totalStudents: 45000,
    isPublished: true,
    chapters: [
      {
        title: "Python Basics",
        content: `<h2>Welcome to Python</h2>
        <p>Python is known for its simplicity and readability, making it perfect for beginners.</p>
        <pre><code># Variables
name = "Python"
version = 3.11

# Print statement
print(f"Hello, {name} {version}!")

# Lists
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)</code></pre>`,
        duration: 25,
        order: 1,
      },
      {
        title: "Functions in Python",
        content: `<h2>Defining Functions</h2>
        <pre><code>def greet(name, greeting="Hello"):
    """Return a greeting message."""
    return f"{greeting}, {name}!"

# Usage
message = greet("World")
print(message)  # Hello, World!</code></pre>`,
        duration: 30,
        order: 2,
      },
    ],
  },
  {
    title: "Command Line Basics",
    author: "Alex Turner",
    description:
      "Master the terminal and become a power user. Learn essential commands for file management, navigation, and productivity on Mac, Linux, and Windows.",
    price: 0,
    originalPrice: 14.99,
    category: "free",
    image: "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=400",
    level: "beginner",
    language: "English",
    tags: ["terminal", "bash", "command line", "linux"],
    rating: 4.4,
    totalRatings: 650,
    totalStudents: 8900,
    isPublished: true,
    chapters: [
      {
        title: "Navigation Commands",
        content: `<h2>Moving Around</h2>
        <pre><code>pwd         # Print working directory
ls          # List files
cd folder   # Change directory
cd ..       # Go up one level
cd ~        # Go to home</code></pre>`,
        duration: 15,
        order: 1,
      },
      {
        title: "File Operations",
        content: `<h2>Managing Files</h2>
        <pre><code>touch file.txt    # Create file
mkdir folder      # Create directory
cp file1 file2    # Copy file
mv old new        # Move/rename
rm file.txt       # Delete file</code></pre>`,
        duration: 20,
        order: 2,
      },
    ],
  },

  // PAID BOOKS (10)
  {
    title: "React.js Complete Guide",
    author: "Jennifer Lopez",
    description:
      "Build modern web applications with React. This comprehensive course covers components, hooks, state management, routing, and best practices for production apps.",
    price: 49.99,
    originalPrice: 99.99,
    category: "paid",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    level: "intermediate",
    language: "English",
    tags: ["react", "javascript", "frontend", "web development"],
    rating: 4.9,
    totalRatings: 4500,
    totalStudents: 32000,
    isPublished: true,
    chapters: [
      {
        title: "React Fundamentals",
        content: `<h2>Getting Started with React</h2>
        <p>React is a JavaScript library for building user interfaces, developed by Facebook.</p>
        <h3>Creating Your First Component</h3>
        <pre><code>import React from 'react';

function Welcome({ name }) {
  return (
    &lt;div className="welcome"&gt;
      &lt;h1&gt;Hello, {name}!&lt;/h1&gt;
      &lt;p&gt;Welcome to React&lt;/p&gt;
    &lt;/div&gt;
  );
}

export default Welcome;</code></pre>
        <h3>JSX Syntax</h3>
        <p>JSX allows you to write HTML-like code in JavaScript. It gets compiled to regular JavaScript.</p>`,
        duration: 30,
        order: 1,
      },
      {
        title: "Hooks Deep Dive",
        content: `<h2>React Hooks</h2>
        <p>Hooks let you use state and other React features in functional components.</p>
        <h3>useState Hook</h3>
        <pre><code>import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    &lt;button onClick={() => setCount(count + 1)}&gt;
      Count: {count}
    &lt;/button&gt;
  );
}</code></pre>
        <h3>useEffect Hook</h3>
        <pre><code>import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(setData);
  }, []);
  
  return data ? &lt;div&gt;{data.title}&lt;/div&gt; : &lt;p&gt;Loading...&lt;/p&gt;;
}</code></pre>`,
        duration: 45,
        order: 2,
      },
      {
        title: "State Management",
        content: `<h2>Managing Application State</h2>
        <h3>Context API</h3>
        <pre><code>import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    &lt;ThemeContext.Provider value={{ theme, setTheme }}&gt;
      {children}
    &lt;/ThemeContext.Provider&gt;
  );
}

export const useTheme = () => useContext(ThemeContext);</code></pre>`,
        duration: 40,
        order: 3,
      },
      {
        title: "React Router",
        content: `<h2>Client-Side Routing</h2>
        <pre><code>import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    &lt;BrowserRouter&gt;
      &lt;nav&gt;
        &lt;Link to="/"&gt;Home&lt;/Link&gt;
        &lt;Link to="/about"&gt;About&lt;/Link&gt;
      &lt;/nav&gt;
      &lt;Routes&gt;
        &lt;Route path="/" element={&lt;Home /&gt;} /&gt;
        &lt;Route path="/about" element={&lt;About /&gt;} /&gt;
      &lt;/Routes&gt;
    &lt;/BrowserRouter&gt;
  );
}</code></pre>`,
        duration: 35,
        order: 4,
      },
    ],
  },
  {
    title: "Node.js Backend Development",
    author: "Robert Johnson",
    description:
      "Build scalable server-side applications with Node.js and Express. Learn REST APIs, authentication, database integration, and deployment strategies.",
    price: 59.99,
    originalPrice: 119.99,
    category: "paid",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400",
    level: "intermediate",
    language: "English",
    tags: ["nodejs", "express", "backend", "api"],
    rating: 4.7,
    totalRatings: 2800,
    totalStudents: 18500,
    isPublished: true,
    chapters: [
      {
        title: "Node.js Fundamentals",
        content: `<h2>Introduction to Node.js</h2>
        <p>Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.</p>
        <h3>Creating a Simple Server</h3>
        <pre><code>const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, Node.js!');
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});</code></pre>`,
        duration: 30,
        order: 1,
      },
      {
        title: "Express.js Framework",
        content: `<h2>Building APIs with Express</h2>
        <pre><code>const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/users', (req, res) => {
  res.json([{ id: 1, name: 'John' }]);
});

app.post('/api/users', (req, res) => {
  const user = req.body;
  res.status(201).json(user);
});

app.listen(3000);</code></pre>`,
        duration: 40,
        order: 2,
      },
      {
        title: "MongoDB Integration",
        content: `<h2>Working with Databases</h2>
        <pre><code>const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/myapp');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Create user
const user = await User.create({ name: 'John', email: 'john@example.com' });

// Find users
const users = await User.find({ name: /john/i });</code></pre>`,
        duration: 45,
        order: 3,
      },
    ],
  },
  {
    title: "MongoDB Mastery",
    author: "Lisa Park",
    description:
      "Deep dive into MongoDB database design, queries, aggregation pipelines, indexing, and performance optimization for production applications.",
    price: 44.99,
    originalPrice: 89.99,
    category: "paid",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400",
    level: "intermediate",
    language: "English",
    tags: ["mongodb", "database", "nosql", "backend"],
    rating: 4.6,
    totalRatings: 1200,
    totalStudents: 9800,
    isPublished: true,
    chapters: [
      {
        title: "MongoDB Basics",
        content: `<h2>Introduction to MongoDB</h2>
        <p>MongoDB is a document-oriented NoSQL database designed for scalability and flexibility.</p>
        <h3>CRUD Operations</h3>
        <pre><code>// Insert
db.users.insertOne({ name: "John", age: 30 });

// Find
db.users.find({ age: { $gt: 25 } });

// Update
db.users.updateOne({ name: "John" }, { $set: { age: 31 } });

// Delete
db.users.deleteOne({ name: "John" });</code></pre>`,
        duration: 35,
        order: 1,
      },
      {
        title: "Aggregation Pipeline",
        content: `<h2>Data Aggregation</h2>
        <pre><code>db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: {
      _id: "$customerId",
      totalSpent: { $sum: "$amount" },
      orderCount: { $sum: 1 }
    }
  },
  { $sort: { totalSpent: -1 } },
  { $limit: 10 }
]);</code></pre>`,
        duration: 45,
        order: 2,
      },
    ],
  },
  {
    title: "TypeScript for Professionals",
    author: "Mark Anderson",
    description:
      "Level up your JavaScript with TypeScript. Learn type safety, interfaces, generics, decorators, and integration with React and Node.js.",
    price: 39.99,
    originalPrice: 79.99,
    category: "paid",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
    level: "intermediate",
    language: "English",
    tags: ["typescript", "javascript", "programming", "frontend"],
    rating: 4.8,
    totalRatings: 1800,
    totalStudents: 14200,
    isPublished: true,
    chapters: [
      {
        title: "TypeScript Basics",
        content: `<h2>Getting Started with TypeScript</h2>
        <h3>Basic Types</h3>
        <pre><code>// Primitive types
let name: string = "John";
let age: number = 30;
let isActive: boolean = true;

// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array&lt;string&gt; = ["a", "b"];

// Objects
interface User {
  name: string;
  age: number;
  email?: string; // Optional
}

const user: User = { name: "John", age: 30 };</code></pre>`,
        duration: 30,
        order: 1,
      },
      {
        title: "Generics",
        content: `<h2>Generic Types</h2>
        <pre><code>// Generic function
function identity&lt;T&gt;(arg: T): T {
  return arg;
}

// Generic interface
interface ApiResponse&lt;T&gt; {
  data: T;
  status: number;
  message: string;
}

// Usage
const response: ApiResponse&lt;User[]&gt; = {
  data: [{ name: "John", age: 30 }],
  status: 200,
  message: "Success"
};</code></pre>`,
        duration: 40,
        order: 2,
      },
    ],
  },
  {
    title: "Tailwind CSS Complete",
    author: "Sophie Williams",
    description:
      "Master utility-first CSS with Tailwind. Build beautiful, responsive designs quickly with modern CSS techniques and component patterns.",
    price: 34.99,
    originalPrice: 69.99,
    category: "paid",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400",
    level: "beginner",
    language: "English",
    tags: ["tailwind", "css", "design", "frontend"],
    rating: 4.7,
    totalRatings: 2200,
    totalStudents: 19500,
    isPublished: true,
    chapters: [
      {
        title: "Tailwind Fundamentals",
        content: `<h2>Getting Started with Tailwind</h2>
        <p>Tailwind CSS is a utility-first CSS framework for rapid UI development.</p>
        <h3>Basic Classes</h3>
        <pre><code>&lt;div class="p-4 bg-blue-500 text-white rounded-lg shadow-md"&gt;
  &lt;h1 class="text-2xl font-bold mb-2"&gt;Hello Tailwind&lt;/h1&gt;
  &lt;p class="text-blue-100"&gt;This is a card component&lt;/p&gt;
&lt;/div&gt;</code></pre>`,
        duration: 25,
        order: 1,
      },
      {
        title: "Responsive Design",
        content: `<h2>Building Responsive Layouts</h2>
        <pre><code>&lt;div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"&gt;
  &lt;div class="p-4 bg-white rounded shadow"&gt;Card 1&lt;/div&gt;
  &lt;div class="p-4 bg-white rounded shadow"&gt;Card 2&lt;/div&gt;
  &lt;div class="p-4 bg-white rounded shadow"&gt;Card 3&lt;/div&gt;
&lt;/div&gt;

&lt;!-- Responsive text --&gt;
&lt;h1 class="text-xl md:text-2xl lg:text-4xl"&gt;
  Responsive Heading
&lt;/h1&gt;</code></pre>`,
        duration: 35,
        order: 2,
      },
    ],
  },
  {
    title: "Full-Stack MERN Development",
    author: "Chris Evans",
    description:
      "Build complete web applications from scratch using MongoDB, Express, React, and Node.js. Includes authentication, payments, and deployment.",
    price: 79.99,
    originalPrice: 149.99,
    category: "paid",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
    level: "advanced",
    language: "English",
    tags: ["mern", "fullstack", "react", "nodejs"],
    rating: 4.9,
    totalRatings: 3800,
    totalStudents: 25600,
    isPublished: true,
    chapters: [
      {
        title: "Project Setup",
        content: `<h2>Setting Up MERN Stack</h2>
        <h3>Backend Setup</h3>
        <pre><code>mkdir mern-app && cd mern-app
mkdir backend && cd backend
npm init -y
npm install express mongoose cors dotenv bcryptjs jsonwebtoken</code></pre>
        <h3>Frontend Setup</h3>
        <pre><code>cd ..
npm create vite@latest frontend -- --template react
cd frontend
npm install axios react-router-dom</code></pre>`,
        duration: 30,
        order: 1,
      },
      {
        title: "Authentication System",
        content: `<h2>Building Auth with JWT</h2>
        <h3>User Model</h3>
        <pre><code>const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String
});

userSchema.pre('save', async function() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};</code></pre>`,
        duration: 50,
        order: 2,
      },
      {
        title: "API Development",
        content: `<h2>RESTful API Design</h2>
        <pre><code>// routes/auth.js
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.create({ email, password });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ user, token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await user.comparePassword(password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ user, token });
});</code></pre>`,
        duration: 45,
        order: 3,
      },
    ],
  },
  {
    title: "AWS Cloud Practitioner",
    author: "James Miller",
    description:
      "Prepare for AWS certification with this comprehensive guide. Learn cloud concepts, core services, security, pricing, and architecture best practices.",
    price: 54.99,
    originalPrice: 109.99,
    category: "paid",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
    level: "beginner",
    language: "English",
    tags: ["aws", "cloud", "devops", "certification"],
    rating: 4.6,
    totalRatings: 2600,
    totalStudents: 21000,
    isPublished: true,
    chapters: [
      {
        title: "Cloud Concepts",
        content: `<h2>Introduction to Cloud Computing</h2>
        <p>Cloud computing delivers computing services over the internet.</p>
        <h3>Cloud Service Models</h3>
        <ul>
          <li><strong>IaaS</strong> - Infrastructure as a Service (EC2)</li>
          <li><strong>PaaS</strong> - Platform as a Service (Elastic Beanstalk)</li>
          <li><strong>SaaS</strong> - Software as a Service (Gmail)</li>
        </ul>`,
        duration: 30,
        order: 1,
      },
      {
        title: "Core AWS Services",
        content: `<h2>Essential AWS Services</h2>
        <h3>Compute</h3>
        <ul>
          <li><strong>EC2</strong> - Virtual servers</li>
          <li><strong>Lambda</strong> - Serverless functions</li>
          <li><strong>ECS</strong> - Container service</li>
        </ul>
        <h3>Storage</h3>
        <ul>
          <li><strong>S3</strong> - Object storage</li>
          <li><strong>EBS</strong> - Block storage</li>
          <li><strong>EFS</strong> - File storage</li>
        </ul>`,
        duration: 45,
        order: 2,
      },
    ],
  },
  {
    title: "Docker & Kubernetes",
    author: "Kevin Brown",
    description:
      "Master containerization and orchestration. Learn Docker fundamentals, compose, Kubernetes deployments, services, and production strategies.",
    price: 64.99,
    originalPrice: 129.99,
    category: "paid",
    image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400",
    level: "advanced",
    language: "English",
    tags: ["docker", "kubernetes", "devops", "containers"],
    rating: 4.8,
    totalRatings: 1500,
    totalStudents: 11200,
    isPublished: true,
    chapters: [
      {
        title: "Docker Basics",
        content: `<h2>Introduction to Docker</h2>
        <h3>Dockerfile</h3>
        <pre><code>FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]</code></pre>
        <h3>Commands</h3>
        <pre><code>docker build -t myapp .
docker run -p 3000:3000 myapp
docker ps
docker logs container_id</code></pre>`,
        duration: 35,
        order: 1,
      },
      {
        title: "Docker Compose",
        content: `<h2>Multi-Container Applications</h2>
        <pre><code>version: '3.8'
services:
  web:
    build: .
    ports:
      - "3000:3000"
    depends_on:
      - db
  db:
    image: mongo:6
    volumes:
      - mongodb_data:/data/db

volumes:
  mongodb_data:</code></pre>`,
        duration: 40,
        order: 2,
      },
    ],
  },
  {
    title: "GraphQL API Design",
    author: "Amanda Davis",
    description:
      "Build flexible APIs with GraphQL. Learn schemas, resolvers, mutations, subscriptions, and integration with React using Apollo Client.",
    price: 49.99,
    originalPrice: 99.99,
    category: "paid",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400",
    level: "intermediate",
    language: "English",
    tags: ["graphql", "api", "apollo", "backend"],
    rating: 4.7,
    totalRatings: 980,
    totalStudents: 7800,
    isPublished: true,
    chapters: [
      {
        title: "GraphQL Basics",
        content: `<h2>Introduction to GraphQL</h2>
        <h3>Schema Definition</h3>
        <pre><code>type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String
  author: User!
}

type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(name: String!, email: String!): User!
}</code></pre>`,
        duration: 35,
        order: 1,
      },
      {
        title: "Resolvers",
        content: `<h2>Writing Resolvers</h2>
        <pre><code>const resolvers = {
  Query: {
    users: () => User.find(),
    user: (_, { id }) => User.findById(id)
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      return User.create({ name, email });
    }
  },
  User: {
    posts: (user) => Post.find({ authorId: user.id })
  }
};</code></pre>`,
        duration: 40,
        order: 2,
      },
    ],
  },
  {
    title: "Next.js 14 Complete",
    author: "Daniel White",
    description:
      "Build production-ready React applications with Next.js 14. Learn App Router, Server Components, data fetching, and deployment.",
    price: 54.99,
    originalPrice: 109.99,
    category: "paid",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
    level: "intermediate",
    language: "English",
    tags: ["nextjs", "react", "fullstack", "ssr"],
    rating: 4.9,
    totalRatings: 2100,
    totalStudents: 16800,
    isPublished: true,
    chapters: [
      {
        title: "App Router",
        content: `<h2>Next.js 14 App Router</h2>
        <h3>File-based Routing</h3>
        <pre><code>app/
├── page.tsx          # /
├── about/
│   └── page.tsx      # /about
├── blog/
│   ├── page.tsx      # /blog
│   └── [slug]/
│       └── page.tsx  # /blog/:slug
└── layout.tsx        # Root layout</code></pre>`,
        duration: 30,
        order: 1,
      },
      {
        title: "Server Components",
        content: `<h2>React Server Components</h2>
        <pre><code>// Server Component (default)
async function BlogPosts() {
  const posts = await fetch('https://api.example.com/posts', {
    cache: 'force-cache'  // Static
  }).then(res => res.json());

  return (
    &lt;ul&gt;
      {posts.map(post => (
        &lt;li key={post.id}&gt;{post.title}&lt;/li&gt;
      ))}
    &lt;/ul&gt;
  );
}

// Client Component
'use client';
function LikeButton() {
  const [likes, setLikes] = useState(0);
  return &lt;button onClick={() =&gt; setLikes(likes + 1)}&gt;{likes}&lt;/button&gt;;
}</code></pre>`,
        duration: 45,
        order: 2,
      },
    ],
  },

  // PREMIUM BOOKS (5)
  {
    title: "System Design Masterclass",
    author: "Dr. Richard Lee",
    description:
      "Learn to design scalable distributed systems. Covers load balancing, caching, databases, microservices, and real-world case studies from FAANG companies.",
    price: 129.99,
    originalPrice: 249.99,
    category: "premium",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400",
    level: "advanced",
    language: "English",
    tags: ["system design", "architecture", "scalability", "interview"],
    rating: 4.9,
    totalRatings: 1800,
    totalStudents: 8900,
    isPublished: true,
    chapters: [
      {
        title: "Scalability Fundamentals",
        content: `<h2>Building Scalable Systems</h2>
        <h3>Horizontal vs Vertical Scaling</h3>
        <p><strong>Vertical Scaling:</strong> Adding more power to existing machines (CPU, RAM)</p>
        <p><strong>Horizontal Scaling:</strong> Adding more machines to the pool</p>
        <h3>Load Balancing Strategies</h3>
        <ul>
          <li>Round Robin</li>
          <li>Least Connections</li>
          <li>IP Hash</li>
          <li>Weighted Round Robin</li>
        </ul>`,
        duration: 50,
        order: 1,
      },
      {
        title: "Database Design",
        content: `<h2>Database Scaling Patterns</h2>
        <h3>Sharding</h3>
        <p>Distribute data across multiple databases based on a shard key.</p>
        <h3>Replication</h3>
        <ul>
          <li><strong>Master-Slave:</strong> One write node, multiple read nodes</li>
          <li><strong>Master-Master:</strong> Multiple write/read nodes</li>
        </ul>
        <h3>CAP Theorem</h3>
        <p>You can only guarantee 2 of 3: Consistency, Availability, Partition Tolerance</p>`,
        duration: 60,
        order: 2,
      },
      {
        title: "Case Study: Twitter",
        content: `<h2>Designing Twitter</h2>
        <h3>Requirements</h3>
        <ul>
          <li>500M users, 200M daily active</li>
          <li>500M tweets per day</li>
          <li>View timeline, post tweets, follow users</li>
        </ul>
        <h3>Architecture</h3>
        <p>Fan-out on write for timeline delivery, caching hot users, separate storage for tweets and media.</p>`,
        duration: 75,
        order: 3,
      },
    ],
  },
  {
    title: "Machine Learning with Python",
    author: "Dr. Sarah Thompson",
    description:
      "Comprehensive machine learning course covering supervised/unsupervised learning, neural networks, deep learning with TensorFlow, and real-world projects.",
    price: 149.99,
    originalPrice: 299.99,
    category: "premium",
    image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=400",
    level: "advanced",
    language: "English",
    tags: ["machine learning", "python", "tensorflow", "ai"],
    rating: 4.8,
    totalRatings: 3200,
    totalStudents: 15400,
    isPublished: true,
    chapters: [
      {
        title: "ML Fundamentals",
        content: `<h2>Introduction to Machine Learning</h2>
        <h3>Types of Learning</h3>
        <ul>
          <li><strong>Supervised:</strong> Labeled data (classification, regression)</li>
          <li><strong>Unsupervised:</strong> Unlabeled data (clustering, dimensionality reduction)</li>
          <li><strong>Reinforcement:</strong> Learning from environment feedback</li>
        </ul>
        <h3>Workflow</h3>
        <pre><code>1. Data Collection
2. Data Preprocessing
3. Feature Engineering
4. Model Selection
5. Training
6. Evaluation
7. Deployment</code></pre>`,
        duration: 45,
        order: 1,
      },
      {
        title: "Scikit-Learn",
        content: `<h2>Machine Learning with Scikit-Learn</h2>
        <pre><code>from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Accuracy: {accuracy:.2f}")</code></pre>`,
        duration: 55,
        order: 2,
      },
      {
        title: "Deep Learning",
        content: `<h2>Neural Networks with TensorFlow</h2>
        <pre><code>import tensorflow as tf
from tensorflow.keras import layers, models

# Build model
model = models.Sequential([
    layers.Dense(128, activation='relu', input_shape=(784,)),
    layers.Dropout(0.2),
    layers.Dense(64, activation='relu'),
    layers.Dense(10, activation='softmax')
])

# Compile
model.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

# Train
model.fit(X_train, y_train, epochs=10, validation_split=0.2)</code></pre>`,
        duration: 70,
        order: 3,
      },
    ],
  },
  {
    title: "Cybersecurity Essentials",
    author: "Marcus Security",
    description:
      "Protect your applications and infrastructure. Learn ethical hacking, penetration testing, OWASP top 10, secure coding, and incident response.",
    price: 119.99,
    originalPrice: 239.99,
    category: "premium",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400",
    level: "advanced",
    language: "English",
    tags: ["security", "hacking", "penetration testing", "owasp"],
    rating: 4.7,
    totalRatings: 1400,
    totalStudents: 7200,
    isPublished: true,
    chapters: [
      {
        title: "Security Fundamentals",
        content: `<h2>Introduction to Cybersecurity</h2>
        <h3>CIA Triad</h3>
        <ul>
          <li><strong>Confidentiality:</strong> Preventing unauthorized access</li>
          <li><strong>Integrity:</strong> Ensuring data accuracy</li>
          <li><strong>Availability:</strong> Ensuring systems are accessible</li>
        </ul>
        <h3>Attack Vectors</h3>
        <ul>
          <li>Phishing</li>
          <li>SQL Injection</li>
          <li>XSS (Cross-Site Scripting)</li>
          <li>CSRF (Cross-Site Request Forgery)</li>
        </ul>`,
        duration: 40,
        order: 1,
      },
      {
        title: "OWASP Top 10",
        content: `<h2>Common Web Vulnerabilities</h2>
        <h3>1. Injection</h3>
        <pre><code>// Vulnerable
const query = "SELECT * FROM users WHERE id = " + userId;

// Secure (parameterized)
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [userId]);</code></pre>
        <h3>2. Broken Authentication</h3>
        <ul>
          <li>Use strong password hashing (bcrypt)</li>
          <li>Implement multi-factor authentication</li>
          <li>Secure session management</li>
        </ul>`,
        duration: 55,
        order: 2,
      },
    ],
  },
  {
    title: "iOS Development with Swift",
    author: "Apple Developer Expert",
    description:
      "Build beautiful iOS applications with Swift and SwiftUI. Covers UIKit, Core Data, networking, animations, and App Store deployment.",
    price: 139.99,
    originalPrice: 279.99,
    category: "premium",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400",
    level: "intermediate",
    language: "English",
    tags: ["ios", "swift", "swiftui", "mobile"],
    rating: 4.8,
    totalRatings: 1600,
    totalStudents: 9500,
    isPublished: true,
    chapters: [
      {
        title: "Swift Basics",
        content: `<h2>Introduction to Swift</h2>
        <pre><code>// Variables
var name = "Swift"
let version = 5.9

// Functions
func greet(name: String) -> String {
    return "Hello, \(name)!"
}

// Optionals
var optional: String? = nil
if let value = optional {
    print(value)
}

// Closures
let numbers = [1, 2, 3]
let doubled = numbers.map { $0 * 2 }</code></pre>`,
        duration: 40,
        order: 1,
      },
      {
        title: "SwiftUI",
        content: `<h2>Building UIs with SwiftUI</h2>
        <pre><code>struct ContentView: View {
    @State private var count = 0
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Count: \(count)")
                .font(.largeTitle)
            
            Button("Increment") {
                count += 1
            }
            .buttonStyle(.borderedProminent)
        }
        .padding()
    }
}</code></pre>`,
        duration: 50,
        order: 2,
      },
    ],
  },
  {
    title: "Blockchain Development",
    author: "Crypto Expert Team",
    description:
      "Build decentralized applications on Ethereum. Learn Solidity, smart contracts, Web3.js, NFTs, DeFi protocols, and blockchain security.",
    price: 159.99,
    originalPrice: 319.99,
    category: "premium",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400",
    level: "advanced",
    language: "English",
    tags: ["blockchain", "ethereum", "solidity", "web3"],
    rating: 4.6,
    totalRatings: 980,
    totalStudents: 5400,
    isPublished: true,
    chapters: [
      {
        title: "Blockchain Fundamentals",
        content: `<h2>Understanding Blockchain</h2>
        <h3>Key Concepts</h3>
        <ul>
          <li><strong>Decentralization:</strong> No central authority</li>
          <li><strong>Immutability:</strong> Data cannot be changed</li>
          <li><strong>Transparency:</strong> All transactions visible</li>
          <li><strong>Consensus:</strong> Agreement mechanisms (PoW, PoS)</li>
        </ul>`,
        duration: 35,
        order: 1,
      },
      {
        title: "Solidity Programming",
        content: `<h2>Smart Contracts with Solidity</h2>
        <pre><code>// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleToken {
    mapping(address => uint256) public balances;
    
    constructor() {
        balances[msg.sender] = 1000000;
    }
    
    function transfer(address to, uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance");
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }
}</code></pre>`,
        duration: 55,
        order: 2,
      },
    ],
  },
];

const seedBooks = async () => {
  try {
    // Clear existing books
    await Book.deleteMany({});
    console.log("🗑️  Cleared existing books");

    // Calculate totalChapters and totalDuration for each book
    const booksWithStats = books.map((book) => ({
      ...book,
      totalChapters: book.chapters.length,
      totalDuration: book.chapters.reduce((sum, ch) => sum + ch.duration, 0),
    }));

    // Insert books
    await Book.insertMany(booksWithStats);
    console.log(`✅ Successfully seeded ${books.length} books!`);

    console.log("\n📚 Books Summary:");
    console.log("================");
    console.log(`   Free Books: 5`);
    console.log(`   Paid Books: 10`);
    console.log(`   Premium Books: 5`);
    console.log("================\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding books:", error);
    process.exit(1);
  }
};

seedBooks();
