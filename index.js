function toggleTheme() {
    if (document.body.classList.contains("dark"))
        document.body.classList.remove("dark");
    else
        document.body.classList.add("dark");
}

// Carousel Functionality
document.addEventListener('DOMContentLoaded', function() {
    const carouselContainer = document.querySelector('.carousel-container');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    const glowingArrow = document.querySelector('.glowing-arrow');
    
    let currentSlide = 0;
    
    // Function to go to specific slide
    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;
        
        currentSlide = index;
        const slideWidth = carouselContainer.clientWidth;
        carouselContainer.scrollTo({
            left: slideWidth * index,
            behavior: 'smooth'
        });
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
    
    // Glowing arrow click
    if (glowingArrow) {
        glowingArrow.addEventListener('click', () => {
            goToSlide(1);
        });
    }
    
    // Mouse wheel scroll
    carouselContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            // Vertical scroll - convert to horizontal
            if (e.deltaY > 0 && currentSlide < slides.length - 1) {
                goToSlide(currentSlide + 1);
            } else if (e.deltaY < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        } else {
            // Horizontal scroll
            if (e.deltaX > 0 && currentSlide < slides.length - 1) {
                goToSlide(currentSlide + 1);
            } else if (e.deltaX < 0 && currentSlide > 0) {
                goToSlide(currentSlide - 1);
            }
        }
    }, { passive: false });
    
    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentSlide < slides.length - 1) {
                // Swipe left - next slide
                goToSlide(currentSlide + 1);
            } else if (diff < 0 && currentSlide > 0) {
                // Swipe right - previous slide
                goToSlide(currentSlide - 1);
            }
        }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentSlide > 0) {
            goToSlide(currentSlide - 1);
        } else if (e.key === 'ArrowRight' && currentSlide < slides.length - 1) {
            goToSlide(currentSlide + 1);
        }
    });
    
    // Detect scroll position to update current slide
    let scrollTimeout;
    carouselContainer.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const slideWidth = carouselContainer.clientWidth;
            const newSlide = Math.round(carouselContainer.scrollLeft / slideWidth);
            
            if (newSlide !== currentSlide) {
                currentSlide = newSlide;
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === currentSlide);
                });
            }
        }, 100);
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        goToSlide(currentSlide);
    });
});

// Section Navigation Indicator
document.addEventListener('DOMContentLoaded', function() {
    const main = document.querySelector('main');
    const sections = document.querySelectorAll('main > section');
    const navItems = document.querySelectorAll('.section-nav-item');
    
    // Split headings into individual letters
    function splitLetters(element) {
        const text = element.textContent;
        element.innerHTML = '';
        text.split('').forEach(char => {
            const span = document.createElement('span');
            span.className = 'letter';
            span.textContent = char === ' ' ? '\u00A0' : char;
            element.appendChild(span);
        });
    }
    
    // Apply letter splitting to all headings
    document.querySelectorAll('.section-title, .project-heading').forEach(heading => {
        splitLetters(heading);
    });
    
    // Observer for section visibility with delayed transitions
    const observerOptions = {
        root: main,
        threshold: 0.2
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        sectionObserver.observe(section);
        // Make first section visible immediately
        if (section.classList.contains('hero')) {
            section.classList.add('visible');
        }
    });
    
    // Update active section on scroll
    main.addEventListener('scroll', () => {
        let currentSection = 0;
        const scrollPosition = main.scrollTop + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = index;
            }
        });
        
        // Update active class
        navItems.forEach((item, index) => {
            item.classList.toggle('active', index === currentSection);
        });
    });
    
    // Click navigation
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            sections[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
});

// Contact Form Handling with EmailJS
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
    emailjs.init('YOUR_PUBLIC_KEY');
    
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const formData = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span>Sending...</span>';
            submitBtn.disabled = true;
            
            // Send email using EmailJS
            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual IDs
            emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', formData)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                }, function(error) {
                    console.log('FAILED...', error);
                    formStatus.textContent = 'Failed to send message. Please try again or contact me directly via social media.';
                    formStatus.className = 'form-status error';
                })
                .finally(function() {
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                    
                    // Hide status message after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = 'none';
                    }, 5000);
                });
        });
    }
});
