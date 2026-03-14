/**
 * Comprehensive Seed Script - 100 Sample Books
 * Populates database with books across 5 genres:
 * - Programming
 * - AI/Machine Learning
 * - Data Science
 * - Business
 * - Self Development
 *
 * Run: node seed100Books.js
 */

const mongoose = require("mongoose");
const Book = require("./models/Book");
const Category = require("./models/Category");
require("dotenv").config();

// Book data organized by genre (20 books each = 100 total)
const booksByGenre = {
  programming: [
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      description:
        "A handbook of agile software craftsmanship covering best practices for writing readable, maintainable code.",
    },
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas & Andrew Hunt",
      description:
        "From journeyman to master, this book covers tips and techniques for modern software development.",
    },
    {
      title: "Design Patterns",
      author: "Gang of Four",
      description:
        "Elements of Reusable Object-Oriented Software - the classic guide to design patterns.",
    },
    {
      title: "JavaScript: The Good Parts",
      author: "Douglas Crockford",
      description:
        "Unearthing the excellence in JavaScript and how to use the language effectively.",
    },
    {
      title: "You Don't Know JS: Scope & Closures",
      author: "Kyle Simpson",
      description:
        "Deep dive into JavaScript mechanisms including scope, closures, and hoisting.",
    },
    {
      title: "Eloquent JavaScript",
      author: "Marijn Haverbeke",
      description:
        "A modern introduction to programming with JavaScript and web development.",
    },
    {
      title: "Python Crash Course",
      author: "Eric Matthes",
      description:
        "A hands-on, project-based introduction to programming with Python.",
    },
    {
      title: "Effective Java",
      author: "Joshua Bloch",
      description:
        "Best practices for the Java platform with practical guidance.",
    },
    {
      title: "Learning React",
      author: "Alex Banks & Eve Porcello",
      description: "Modern patterns for developing React applications.",
    },
    {
      title: "Node.js Design Patterns",
      author: "Mario Casciaro",
      description:
        "Master best practices for building modular and scalable server-side applications.",
    },
    {
      title: "TypeScript Quickly",
      author: "Yakov Fain & Anton Moiseev",
      description: "Learn TypeScript by building real-world applications.",
    },
    {
      title: "Go Programming Language",
      author: "Alan Donovan & Brian Kernighan",
      description: "Authoritative guide to the Go programming language.",
    },
    {
      title: "Rust Programming Language",
      author: "Steve Klabnik & Carol Nichols",
      description: "The official guide to Rust programming.",
    },
    {
      title: "C++ Primer",
      author: "Stanley Lippman",
      description: "Comprehensive introduction to C++ programming.",
    },
    {
      title: "Structure and Interpretation of Computer Programs",
      author: "Harold Abelson & Gerald Sussman",
      description: "Classic textbook on computer science fundamentals.",
    },
    {
      title: "Code Complete",
      author: "Steve McConnell",
      description: "A practical handbook of software construction.",
    },
    {
      title: "Refactoring",
      author: "Martin Fowler",
      description: "Improving the design of existing code.",
    },
    {
      title: "The Art of Computer Programming",
      author: "Donald Knuth",
      description: "Fundamental algorithms and data structures.",
    },
    {
      title: "Introduction to Algorithms",
      author: "Thomas Cormen",
      description: "Comprehensive guide to algorithms and their analysis.",
    },
    {
      title: "Head First Design Patterns",
      author: "Eric Freeman",
      description: "A brain-friendly guide to design patterns.",
    },
  ],
  ai: [
    {
      title: "Deep Learning",
      author: "Ian Goodfellow",
      description:
        "Comprehensive textbook on deep learning fundamentals and techniques.",
    },
    {
      title: "Hands-On Machine Learning",
      author: "Aurélien Géron",
      description:
        "Practical guide to machine learning with Scikit-Learn and TensorFlow.",
    },
    {
      title: "Artificial Intelligence: A Modern Approach",
      author: "Stuart Russell & Peter Norvig",
      description: "The standard AI textbook covering all major concepts.",
    },
    {
      title: "Neural Networks and Deep Learning",
      author: "Michael Nielsen",
      description: "Intuitive introduction to neural networks.",
    },
    {
      title: "Pattern Recognition and Machine Learning",
      author: "Christopher Bishop",
      description: "Statistical approach to machine learning.",
    },
    {
      title: "Reinforcement Learning",
      author: "Richard Sutton & Andrew Barto",
      description: "Introduction to reinforcement learning algorithms.",
    },
    {
      title: "Natural Language Processing with Python",
      author: "Steven Bird",
      description: "Analyzing text with the Natural Language Toolkit.",
    },
    {
      title: "Computer Vision: Algorithms and Applications",
      author: "Richard Szeliski",
      description: "Comprehensive guide to computer vision.",
    },
    {
      title: "Generative Deep Learning",
      author: "David Foster",
      description: "Teaching machines to paint, write, compose, and play.",
    },
    {
      title: "Machine Learning Yearning",
      author: "Andrew Ng",
      description: "Technical strategy for AI and ML projects.",
    },
    {
      title: "The Hundred-Page Machine Learning Book",
      author: "Andriy Burkov",
      description: "Concise introduction to machine learning concepts.",
    },
    {
      title: "Building Machine Learning Powered Applications",
      author: "Emmanuel Ameisen",
      description: "Going from idea to product.",
    },
    {
      title: "Deep Learning with Python",
      author: "François Chollet",
      description: "Introduction to deep learning using Keras.",
    },
    {
      title: "GPT-3: Building Innovative NLP Products",
      author: "Sandra Kublik",
      description: "Leveraging large language models for applications.",
    },
    {
      title: "Practical Deep Learning for Cloud",
      author: "Anirudh Koul",
      description: "Real-world deep learning applications.",
    },
    {
      title: "AI Superpowers",
      author: "Kai-Fu Lee",
      description:
        "China, Silicon Valley, and the new world order in artificial intelligence.",
    },
    {
      title: "Life 3.0",
      author: "Max Tegmark",
      description: "Being human in the age of artificial intelligence.",
    },
    {
      title: "Human Compatible",
      author: "Stuart Russell",
      description: "Artificial intelligence and the problem of control.",
    },
    {
      title: "Transformers for Natural Language Processing",
      author: "Denis Rothman",
      description: "Build state-of-the-art NLP models with transformers.",
    },
    {
      title: "Applied Machine Learning",
      author: "David Forsyth",
      description: "Practical techniques for machine learning applications.",
    },
  ],
  "data-science": [
    {
      title: "Python for Data Analysis",
      author: "Wes McKinney",
      description: "Data wrangling with Pandas, NumPy, and IPython.",
    },
    {
      title: "Data Science from Scratch",
      author: "Joel Grus",
      description: "First principles with Python for learning data science.",
    },
    {
      title: "Storytelling with Data",
      author: "Cole Nussbaumer Knaflic",
      description: "A data visualization guide for business professionals.",
    },
    {
      title: "Naked Statistics",
      author: "Charles Wheelan",
      description: "Stripping the dread from the data.",
    },
    {
      title: "The Art of Statistics",
      author: "David Spiegelhalter",
      description: "Learning from data in a world of uncertainty.",
    },
    {
      title: "Practical Statistics for Data Scientists",
      author: "Peter Bruce",
      description: "50+ essential concepts using R and Python.",
    },
    {
      title: "R for Data Science",
      author: "Hadley Wickham",
      description: "Import, tidy, transform, visualize, and model data.",
    },
    {
      title: "Big Data: A Revolution",
      author: "Viktor Mayer-Schönberger",
      description: "How big data transforms how we work and live.",
    },
    {
      title: "Data Mining: Concepts and Techniques",
      author: "Jiawei Han",
      description: "Comprehensive guide to data mining methods.",
    },
    {
      title: "Feature Engineering for Machine Learning",
      author: "Alice Zheng",
      description: "Principles and techniques for data scientists.",
    },
    {
      title: "SQL for Data Scientists",
      author: "Renee Teate",
      description: "A beginner's guide for building datasets.",
    },
    {
      title: "The Data Warehouse Toolkit",
      author: "Ralph Kimball",
      description: "Definitive guide to dimensional modeling.",
    },
    {
      title: "Designing Data-Intensive Applications",
      author: "Martin Kleppmann",
      description: "Big ideas behind reliable, scalable systems.",
    },
    {
      title: "Data Visualization with Python",
      author: "Jake VanderPlas",
      description: "Handbook for matplotlib, seaborn, and more.",
    },
    {
      title: "Bayesian Methods for Hackers",
      author: "Cameron Davidson-Pilon",
      description: "Probabilistic programming and Bayesian inference.",
    },
    {
      title: "Think Stats",
      author: "Allen Downey",
      description: "Exploratory data analysis with Python.",
    },
    {
      title: "Data Smart",
      author: "John Foreman",
      description: "Using data science to transform information into insight.",
    },
    {
      title: "Weapons of Math Destruction",
      author: "Cathy O'Neil",
      description: "How big data increases inequality and threatens democracy.",
    },
    {
      title: "The Signal and the Noise",
      author: "Nate Silver",
      description: "Why so many predictions fail but some don't.",
    },
    {
      title: "Factfulness",
      author: "Hans Rosling",
      description:
        "Ten reasons we're wrong about the world and why things are better.",
    },
  ],
  business: [
    {
      title: "The Lean Startup",
      author: "Eric Ries",
      description: "How today's entrepreneurs use continuous innovation.",
    },
    {
      title: "Zero to One",
      author: "Peter Thiel",
      description: "Notes on startups, or how to build the future.",
    },
    {
      title: "Good to Great",
      author: "Jim Collins",
      description: "Why some companies make the leap and others don't.",
    },
    {
      title: "The E-Myth Revisited",
      author: "Michael Gerber",
      description: "Why most small businesses don't work.",
    },
    {
      title: "The Hard Thing About Hard Things",
      author: "Ben Horowitz",
      description: "Building a business when there are no easy answers.",
    },
    {
      title: "Start with Why",
      author: "Simon Sinek",
      description: "How great leaders inspire everyone to take action.",
    },
    {
      title: "Built to Last",
      author: "Jim Collins",
      description: "Successful habits of visionary companies.",
    },
    {
      title: "Crossing the Chasm",
      author: "Geoffrey Moore",
      description: "Marketing and selling disruptive products.",
    },
    {
      title: "The Innovator's Dilemma",
      author: "Clayton Christensen",
      description: "When new technologies cause great firms to fail.",
    },
    {
      title: "Blue Ocean Strategy",
      author: "W. Chan Kim",
      description: "How to create uncontested market space.",
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      description: "Two systems that drive the way we think.",
    },
    {
      title: "Influence",
      author: "Robert Cialdini",
      description: "The psychology of persuasion.",
    },
    {
      title: "The 4-Hour Workweek",
      author: "Tim Ferriss",
      description: "Escape 9-5, live anywhere, and join the new rich.",
    },
    {
      title: "Rework",
      author: "Jason Fried",
      description: "Change the way you work forever.",
    },
    {
      title: "Measure What Matters",
      author: "John Doerr",
      description: "How Google, Bono, and the Gates Foundation rock OKRs.",
    },
    {
      title: "The Personal MBA",
      author: "Josh Kaufman",
      description: "Master the art of business.",
    },
    {
      title: "Hooked",
      author: "Nir Eyal",
      description: "How to build habit-forming products.",
    },
    {
      title: "Sprint",
      author: "Jake Knapp",
      description: "How to solve big problems in just five days.",
    },
    {
      title: "Principles",
      author: "Ray Dalio",
      description: "Life and work principles from Bridgewater founder.",
    },
    {
      title: "Radical Candor",
      author: "Kim Scott",
      description: "Be a kick-ass boss without losing your humanity.",
    },
  ],
  "self-development": [
    {
      title: "Atomic Habits",
      author: "James Clear",
      description: "An easy and proven way to build good habits.",
    },
    {
      title: "The 7 Habits of Highly Effective People",
      author: "Stephen Covey",
      description: "Powerful lessons in personal change.",
    },
    {
      title: "Deep Work",
      author: "Cal Newport",
      description: "Rules for focused success in a distracted world.",
    },
    {
      title: "Mindset",
      author: "Carol Dweck",
      description: "The new psychology of success.",
    },
    {
      title: "The Power of Habit",
      author: "Charles Duhigg",
      description: "Why we do what we do in life and business.",
    },
    {
      title: "How to Win Friends and Influence People",
      author: "Dale Carnegie",
      description: "Timeless techniques for handling people.",
    },
    {
      title: "Think and Grow Rich",
      author: "Napoleon Hill",
      description: "The landmark bestseller on achieving success.",
    },
    {
      title: "The Subtle Art of Not Giving a F*ck",
      author: "Mark Manson",
      description: "A counterintuitive approach to living a good life.",
    },
    {
      title: "Grit",
      author: "Angela Duckworth",
      description: "The power of passion and perseverance.",
    },
    {
      title: "Drive",
      author: "Daniel Pink",
      description: "The surprising truth about what motivates us.",
    },
    {
      title: "Emotional Intelligence",
      author: "Daniel Goleman",
      description: "Why it can matter more than IQ.",
    },
    {
      title: "The One Thing",
      author: "Gary Keller",
      description:
        "The surprisingly simple truth behind extraordinary results.",
    },
    {
      title: "Essentialism",
      author: "Greg McKeown",
      description: "The disciplined pursuit of less.",
    },
    {
      title: "Flow",
      author: "Mihaly Csikszentmihalyi",
      description: "The psychology of optimal experience.",
    },
    {
      title: "Man's Search for Meaning",
      author: "Viktor Frankl",
      description: "Finding purpose in suffering.",
    },
    {
      title: "12 Rules for Life",
      author: "Jordan Peterson",
      description: "An antidote to chaos.",
    },
    {
      title: "The Miracle Morning",
      author: "Hal Elrod",
      description: "The secret guaranteed to transform your life.",
    },
    {
      title: "Ikigai",
      author: "Héctor García",
      description: "The Japanese secret to a long and happy life.",
    },
    {
      title: "Can't Hurt Me",
      author: "David Goggins",
      description: "Master your mind and defy the odds.",
    },
    {
      title: "The Compound Effect",
      author: "Darren Hardy",
      description: "Jumpstart your income, your life, your success.",
    },
  ],
};

// Sample cover images
const coverImages = [
  "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
  "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
  "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
  "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400",
  "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400",
  "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400",
  "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400",
  "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
];

// Publishers
const publishers = [
  "O'Reilly Media",
  "Manning Publications",
  "Packt Publishing",
  "Addison-Wesley",
  "Pearson Education",
  "Wiley Publishing",
  "McGraw-Hill",
  "No Starch Press",
  "Apress",
  "Springer",
  "HarperCollins",
  "Penguin Random House",
  "Simon & Schuster",
];

// Helper functions
const randomPrice = (min = 9.99, max = 49.99) =>
  parseFloat((Math.random() * (max - min) + min).toFixed(2));

const randomPages = (min = 100, max = 600) =>
  Math.floor(Math.random() * (max - min) + min);

const generateISBN = () => {
  const prefix = "978";
  const group = Math.floor(Math.random() * 10);
  const publisher = Math.floor(Math.random() * 90000) + 10000;
  const title = Math.floor(Math.random() * 900) + 100;
  const checkDigit = Math.floor(Math.random() * 10);
  return `${prefix}-${group}-${publisher}-${title}-${checkDigit}`;
};

const seed100Books = async () => {
  try {
    // Connect to MongoDB
    const mongoUri =
      process.env.MongoDBURI || "mongodb://localhost:27017/bookstore";
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // Ask for confirmation
    console.log(
      "\n⚠️  WARNING: This will clear all existing books and categories!",
    );
    console.log("Press Ctrl+C within 3 seconds to cancel...\n");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Clear existing data
    await Book.deleteMany({});
    await Category.deleteMany({});
    console.log("🗑️  Cleared existing books and categories");

    // Create categories
    const categoryData = [
      {
        name: "Programming",
        slug: "programming",
        icon: "💻",
        description: "Software development and coding books",
      },
      {
        name: "Artificial Intelligence",
        slug: "ai",
        icon: "🤖",
        description: "AI, ML, and deep learning resources",
      },
      {
        name: "Data Science",
        slug: "data-science",
        icon: "📊",
        description: "Analytics, statistics, and data visualization",
      },
      {
        name: "Business",
        slug: "business",
        icon: "📈",
        description: "Entrepreneurship, startups, and business strategy",
      },
      {
        name: "Self Development",
        slug: "self-development",
        icon: "🎯",
        description: "Personal growth and productivity",
      },
    ];

    const categories = await Category.insertMany(categoryData);
    console.log("📁 Created 5 categories");

    // Create books
    const allBooks = [];
    let bookCount = 0;

    for (const [genre, books] of Object.entries(booksByGenre)) {
      for (const book of books) {
        const isFree = Math.random() < 0.15; // 15% free
        const isFeatured = Math.random() < 0.2; // 20% featured
        const publicationYear = Math.floor(
          Math.random() * (2024 - 2015) + 2015,
        );

        allBooks.push({
          title: book.title,
          author: book.author,
          name: book.title,
          description: book.description,
          category: isFree ? "free" : "paid",
          genre: genre,
          price: isFree ? 0 : randomPrice(),
          image: coverImages[Math.floor(Math.random() * coverImages.length)],
          totalPages: randomPages(),
          isbn: generateISBN(),
          publisher: publishers[Math.floor(Math.random() * publishers.length)],
          publicationYear: publicationYear,
          isFeatured: isFeatured,
          isPublished: true,
          totalStudents: Math.floor(Math.random() * 1000),
          rating: parseFloat((Math.random() * 2 + 3).toFixed(1)),
          totalReviews: Math.floor(Math.random() * 500),
        });
        bookCount++;
      }
    }

    await Book.insertMany(allBooks);
    console.log(`📚 Created ${bookCount} books`);

    // Update category book counts
    for (const [genre, books] of Object.entries(booksByGenre)) {
      await Category.findOneAndUpdate(
        { slug: genre },
        { bookCount: books.length },
      );
    }

    // Print summary
    console.log("\n" + "=".repeat(50));
    console.log("✅ DATABASE SEEDED SUCCESSFULLY!");
    console.log("=".repeat(50));
    console.log(`\n📊 Summary:`);
    console.log(`   Total Books: ${bookCount}`);
    console.log(`   Total Categories: ${categories.length}`);
    console.log(`\n📁 Books by Genre:`);
    for (const [genre, books] of Object.entries(booksByGenre)) {
      console.log(`   - ${genre}: ${books.length} books`);
    }
    console.log("\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run
seed100Books();
