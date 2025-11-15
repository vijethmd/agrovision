// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const isNavVisible = navLinks.style.display === 'flex';
            navLinks.style.display = isNavVisible ? 'none' : 'flex';
            authButtons.style.display = isNavVisible ? 'none' : 'flex';
            
            // Adjust for mobile layout
            if (window.innerWidth <= 768) {
                if (!isNavVisible) {
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '100%';
                    navLinks.style.left = '0';
                    navLinks.style.right = '0';
                    navLinks.style.background = 'white';
                    navLinks.style.padding = '20px';
                    navLinks.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    
                    authButtons.style.flexDirection = 'column';
                    authButtons.style.position = 'absolute';
                    authButtons.style.top = 'calc(100% + 200px)';
                    authButtons.style.left = '0';
                    authButtons.style.right = '0';
                    authButtons.style.background = 'white';
                    authButtons.style.padding = '20px';
                    authButtons.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                }
            }
        });
    }

    // File upload functionality
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById('previewImage');
    const analyzeBtn = document.getElementById('analyzeBtn');
    const changeImageBtn = document.getElementById('changeImageBtn');
    const resultContainer = document.getElementById('resultContainer');

    if (uploadArea && fileInput) {
        // Click to upload
        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        // Drag and drop functionality
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary)';
            uploadArea.style.backgroundColor = 'rgba(46, 125, 50, 0.05)';
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#ccc';
            uploadArea.style.backgroundColor = 'transparent';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#ccc';
            uploadArea.style.backgroundColor = 'transparent';
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                handleFileSelect(e.target.files[0]);
            }
        });

        // Change image button
        if (changeImageBtn) {
            changeImageBtn.addEventListener('click', () => {
                previewContainer.style.display = 'none';
                uploadArea.style.display = 'block';
                if (resultContainer) resultContainer.style.display = 'none';
            });
        }

        // Analyze button
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', function() {
                analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Analyzing...';
                analyzeBtn.disabled = true;
                
                // Simulate AI processing
                setTimeout(() => {
                    analyzeBtn.innerHTML = '<i class="fas fa-search"></i> Analyze Image';
                    analyzeBtn.disabled = false;
                    if (resultContainer) {
                        resultContainer.style.display = 'block';
                        resultContainer.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 2000);
            });
        }
    }

    function handleFileSelect(file) {
        if (file && file.type.match('image.*')) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                previewImage.src = e.target.result;
                previewContainer.style.display = 'block';
                uploadArea.style.display = 'none';
                
                // Reset results if any
                if (resultContainer) resultContainer.style.display = 'none';
            };
            
            reader.readAsDataURL(file);
        } else {
            alert('Please select an image file (JPEG, PNG, etc.)');
        }
    }

    // Disease search and filter
    const diseaseSearch = document.getElementById('diseaseSearch');
    const cropFilter = document.getElementById('cropFilter');
    const typeFilter = document.getElementById('typeFilter');
    const diseaseItems = document.querySelectorAll('.disease-item');

    if (diseaseSearch) {
        diseaseSearch.addEventListener('input', filterDiseases);
    }
    if (cropFilter) {
        cropFilter.addEventListener('change', filterDiseases);
    }
    if (typeFilter) {
        typeFilter.addEventListener('change', filterDiseases);
    }

    function filterDiseases() {
        const searchTerm = diseaseSearch.value.toLowerCase();
        const cropValue = cropFilter.value.toLowerCase();
        const typeValue = typeFilter.value.toLowerCase();

        diseaseItems.forEach(item => {
            const diseaseName = item.querySelector('h3').textContent.toLowerCase();
            const cropType = item.getAttribute('data-crop');
            const diseaseType = item.getAttribute('data-type');
            
            const matchesSearch = diseaseName.includes(searchTerm);
            const matchesCrop = !cropValue || cropType.includes(cropValue);
            const matchesType = !typeValue || diseaseType.includes(typeValue);
            
            if (matchesSearch && matchesCrop && matchesType) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // Solutions category filtering
    const categoryBtns = document.querySelectorAll('.category-btn');
    const solutionItems = document.querySelectorAll('.solution-item');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            
            // Filter solutions
            solutionItems.forEach(item => {
                const categories = item.getAttribute('data-categories').split(' ');
                
                if (category === 'all' || categories.includes(category)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Animate stats counter
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = Math.round(current);
            }, 16);
        });
    }
    
    // Intersection Observer for stats animation
    const statsSection = document.getElementById('stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(statsSection);
    }

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate form submission
            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // Add loading animation to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});

// Password toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Password visibility toggle
    const passwordToggles = document.querySelectorAll('.password-toggle');
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                passwordInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });

    // Password strength indicator
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (passwordInput && strengthFill && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            let strength = 0;
            let text = 'Password strength';
            let color = '#ff4757';
            let width = '0%';
            
            if (password.length >= 6) strength += 25;
            if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
            if (password.match(/\d/)) strength += 25;
            if (password.match(/[^a-zA-Z\d]/)) strength += 25;
            
            if (strength >= 75) {
                text = 'Strong password';
                color = '#2ed573';
                width = '100%';
            } else if (strength >= 50) {
                text = 'Good password';
                color = '#ffa502';
                width = '75%';
            } else if (strength >= 25) {
                text = 'Weak password';
                color = '#ff7f50';
                width = '50%';
            } else if (password.length > 0) {
                text = 'Very weak password';
                color = '#ff4757';
                width = '25%';
            }
            
            strengthFill.style.width = width;
            strengthFill.style.background = color;
            strengthText.textContent = text;
            strengthText.style.color = color;
        });
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const requiredFields = this.querySelectorAll('[required]');
            let valid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.style.borderColor = '#ff4757';
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!valid) {
                e.preventDefault();
                alert('Please fill in all required fields.');
            }
        });
    });
});
