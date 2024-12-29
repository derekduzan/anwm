// Move this function outside of DOMContentLoaded
function sendEmail(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    const mailtoLink = `mailto:derekduzan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )}`;
    
    window.location.href = mailtoLink;
}

function handleRSVP(button) {
    const eventName = button.dataset.eventName;
    const eventDate = button.dataset.eventDate;
    const eventTime = button.dataset.eventTime;
    const eventLocation = button.dataset.eventLocation;
    
    const subject = `RSVP for ${eventName}`;
    const body = `I would like to RSVP for the following event:%0D%0A%0D%0A` +
        `Event: ${eventName}%0D%0A` +
        `Date: ${eventDate}%0D%0A` +
        `Time: ${eventTime}%0D%0A` +
        `Location: ${eventLocation}%0D%0A%0D%0A` +
        `Name: %0D%0A` +
        `Number of Guests: `;
    
    window.location.href = `mailto:derekduzan@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
}

function addToCalendar(button) {
    const event = {
        title: button.dataset.eventName,
        start: new Date(button.dataset.eventDate),
        end: new Date(button.dataset.eventEnd),
        location: button.dataset.eventLocation,
        description: button.dataset.eventDescription
    };

    // Create Google Calendar URL
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${formatDateForGoogle(event.start)}/${formatDateForGoogle(event.end)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}`;
    
    window.open(googleUrl, '_blank');
}

function formatDateForGoogle(date) {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
}

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Carousel functionality
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.carousel-button.next');
    const prevButton = document.querySelector('.carousel-button.prev');
    const dotsNav = document.querySelector('.carousel-nav');
    const dots = Array.from(dotsNav.children);

    const slideWidth = slides[0].getBoundingClientRect().width;

    // Arrange the slides next to one another
    const setSlidePosition = (slide, index) => {
        slide.style.left = slideWidth * index + 'px';
    };
    slides.forEach(setSlidePosition);

    const moveToSlide = (track, currentSlide, targetSlide) => {
        const targetIndex = slides.findIndex(slide => slide === targetSlide);
        track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
        currentSlide.classList.remove('current-slide');
        targetSlide.classList.add('current-slide');

        // Update dots
        const currentDot = dotsNav.querySelector('.active');
        const targetDot = dots[targetIndex];
        currentDot.classList.remove('active');
        targetDot.classList.add('active');
    };

    // Infinite scroll functionality
    const moveToNextSlide = () => {
        const currentSlide = track.querySelector('.current-slide');
        let nextSlide = currentSlide.nextElementSibling;
        if (!nextSlide) {
            track.style.transition = 'none';
            track.style.transform = 'translateX(0)';
            nextSlide = slides[0];
        }
        moveToSlide(track, currentSlide, nextSlide);
    };

    const moveToPrevSlide = () => {
        const currentSlide = track.querySelector('.current-slide');
        let prevSlide = currentSlide.previousElementSibling;
        if (!prevSlide) {
            track.style.transition = 'none';
            track.style.transform = `translateX(-${(slides.length - 1) * slideWidth}px)`;
            prevSlide = slides[slides.length - 1];
        }
        moveToSlide(track, currentSlide, prevSlide);
    };

    // Click events
    nextButton.addEventListener('click', moveToNextSlide);
    prevButton.addEventListener('click', moveToPrevSlide);

    // Dot navigation
    dotsNav.addEventListener('click', e => {
        const targetDot = e.target.closest('button');
        if (!targetDot) return;

        const currentSlide = track.querySelector('.current-slide');
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];

        moveToSlide(track, currentSlide, targetSlide);
    });

    // Auto-advance slides
    setInterval(moveToNextSlide, 5000);

    // Add current-slide class to first slide
    slides[0].classList.add('current-slide');

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitButton = this.querySelector('.submit-btn');
            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';

            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                alert(data);
                if (data.includes('Thank You')) {
                    contactForm.reset();
                }
            })
            .catch(error => {
                alert('Error sending message. Please try again.');
                console.error('Error:', error);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            });
        });
    }

    function animateNumbers() {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 50; // Adjust for animation speed
            
            const updateNumber = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateNumber();
        });
    }

    // Use Intersection Observer to trigger animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                observer.unobserve(entry.target);
            }
        });
    });

    document.querySelector('.about-stats').forEach(stat => {
        observer.observe(stat);
    });

    // Add smooth scrolling to all navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add intersection observer for section animations
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('section-animate');
        sectionObserver.observe(section);
    });

    // Hero section mouse movement effect
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX;
        const windowCenter = window.innerWidth / 2;
        const offset = (mouseX - windowCenter) / 50;  // Smaller number = more subtle movement
        
        if (heroContent) {
            heroContent.style.transform = `translateX(${offset}px)`;
        }
    });

    hero.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'rotateY(0deg)';
    });
}); 