const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Helper function to render pages with layout
function renderPage(res, page, data = {}) {
  // First render the specific page content
  res.render(page, { ...data, layout: false }, (err, content) => {
    if (err) {
      console.error('Error rendering page:', err);
      return res.status(500).send('Error rendering page');
    }
    
    // Then render the layout with the content
    res.render('layout', {
      ...data,
      content: content
    });
  });
}

// Routes
app.get('/', (req, res) => {
  renderPage(res, 'index', {
    title: 'Home',
    currentPage: 'home',
    user: null
  });
});

// Auth Routes
app.get('/login', (req, res) => {
  renderPage(res, 'login', {
    title: 'Login',
    currentPage: 'login',
    user: null
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple validation
  if (!email || !password) {
    return renderPage(res, 'login', {
      title: 'Login',
      currentPage: 'login',
      user: null,
      error: 'Please fill in all fields'
    });
  }
  
  // Here you would typically validate against a database
  // For demo purposes, we'll use a simple check
  if (email === 'demo@agrovision.com' && password === 'password') {
    // Successful login - in real app, set session/token
    return res.redirect('/dashboard');
  } else {
    return renderPage(res, 'login', {
      title: 'Login',
      currentPage: 'login',
      user: null,
      error: 'Invalid email or password'
    });
  }
});

app.get('/register', (req, res) => {
  renderPage(res, 'register', {
    title: 'Register',
    currentPage: 'register',
    user: null
  });
});

app.post('/register', (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, userType } = req.body;
  
  // Validation
  if (!firstName || !lastName || !email || !password || !confirmPassword || !userType) {
    return renderPage(res, 'register', {
      title: 'Register',
      currentPage: 'register',
      user: null,
      error: 'Please fill in all required fields'
    });
  }
  
  if (password !== confirmPassword) {
    return renderPage(res, 'register', {
      title: 'Register',
      currentPage: 'register',
      user: null,
      error: 'Passwords do not match'
    });
  }
  
  if (password.length < 6) {
    return renderPage(res, 'register', {
      title: 'Register',
      currentPage: 'register',
      user: null,
      error: 'Password must be at least 6 characters long'
    });
  }
  
  // Here you would typically save to database
  // For demo, we'll just redirect to login with success message
  
  res.redirect('/login?message=Registration successful! Please sign in.');
});

app.get('/logout', (req, res) => {
  // Here you would typically clear session/token
  res.redirect('/');
});

// Dashboard route (protected)
app.get('/dashboard', (req, res) => {
  // In real app, check if user is authenticated
  renderPage(res, 'dashboard', {
    title: 'Dashboard',
    currentPage: 'dashboard',
    user: { name: 'Demo User', email: 'demo@agrovision.com' }
  });
});

app.get('/detect', (req, res) => {
  renderPage(res, 'detect', {
    title: 'Detect Disease',
    currentPage: 'detect',
    user: null
  });
});

app.post('/detect', upload.single('cropImage'), (req, res) => {
  // Handle file upload errors
  if (req.fileValidationError) {
    return renderPage(res, 'detect', {
      title: 'Detect Disease',
      currentPage: 'detect',
      user: null,
      error: req.fileValidationError
    });
  }

  // Simulate analysis results
  const results = {
    confidence: 92,
    cropType: 'Tomato',
    plantPart: 'Leaf',
    diseases: [
      {
        name: 'Late Blight',
        confidence: 92,
        description: 'A serious fungal disease that affects tomatoes and potatoes, causing rapid plant destruction.',
        solutions: '/solutions/late-blight'
      },
      {
        name: 'Early Blight',
        confidence: 45,
        description: 'A common fungal disease characterized by concentric rings on leaves.',
        solutions: '/solutions/early-blight'
      }
    ]
  };
  
  renderPage(res, 'detect', {
    title: 'Detect Disease',
    currentPage: 'detect',
    user: null,
    results: results,
    uploadedImage: req.file ? `/uploads/${req.file.filename}` : null
  });
});

app.get('/diseases', (req, res) => {
  renderPage(res, 'diseases', {
    title: 'Disease Library',
    currentPage: 'diseases',
    user: null
  });
});

app.get('/solutions', (req, res) => {
  renderPage(res, 'solutions', {
    title: 'Treatment Solutions',
    currentPage: 'solutions',
    user: null
  });
});

app.get('/about', (req, res) => {
  renderPage(res, 'about', {
    title: 'About Us',
    currentPage: 'about',
    user: null
  });
});

app.get('/contact', (req, res) => {
  renderPage(res, 'contact', {
    title: 'Contact Us',
    currentPage: 'contact',
    user: null
  });
});

app.post('/contact', (req, res) => {
  // Handle contact form submission
  console.log('Contact form submitted:', req.body);
  
  renderPage(res, 'contact', {
    title: 'Contact Us',
    currentPage: 'contact',
    user: null,
    message: 'Thank you for your message! We will get back to you soon.'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return renderPage(res, 'detect', {
        title: 'Detect Disease',
        currentPage: 'detect',
        user: null,
        error: 'File too large. Please upload an image smaller than 5MB.'
      });
    }
  }
  console.error(err);
  res.status(500).send('Something went wrong!');
});

// 404 handler
app.use((req, res) => {
  renderPage(res, 'index', {
    title: 'Page Not Found',
    currentPage: 'home',
    user: null,
    error: 'The page you are looking for does not exist.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AgroVision server running on http://localhost:${PORT}`);
  console.log(`📁 Views directory: ${path.join(__dirname, 'views')}`);
  console.log(`📂 Public directory: ${path.join(__dirname, 'public')}`);
});