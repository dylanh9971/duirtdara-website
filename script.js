// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections, articles, and buttons
document.querySelectorAll('section, article, .cta-button, .submit-btn').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// Smooth scrolling for navigation links
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

// Form submission handler
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        level: document.getElementById('level').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        message: document.getElementById('message').value
    };

    // Validate form
    if (!validateForm(formData)) {
        showMessage('Please fill in all required fields correctly.', 'error');
        return;
    }

    // Simulate sending data (in a real application, you would send this to a server)
    sendBookingRequest(formData);
});

// Form validation
function validateForm(data) {
    if (!data.name || !data.email || !data.level || !data.date || !data.time) {
        return false;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return false;
    }

    return true;
}

// Send booking request (simulated)
function sendBookingRequest(formData) {
    // Show loading state
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate API call with timeout
    setTimeout(() => {
        // In a real application, you would send data to a server here
        console.log('Booking request:', formData);

        // Show success message
        showMessage(
            `Thank you, ${formData.name}! Your class request has been received. I'll contact you shortly at ${formData.email} to confirm your booking.`,
            'success'
        );

        // Reset form
        document.getElementById('bookingForm').reset();

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1000);
}

// Show message function
function showMessage(message, type) {
    const messageElement = document.getElementById('bookingMessage');
    messageElement.textContent = message;
    messageElement.className = `booking-message ${type}`;

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'booking-message';
        }, 5000);
    }
}

// Newsletter form submission handler
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) newsletterForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Get form data
    const name = document.getElementById('newsletter-name').value;
    const email = document.getElementById('newsletter-email').value;

    // Validate form
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !emailRegex.test(email)) {
        showNewsletterMessage('Please enter a valid name and email.', 'error');
        return;
    }

    // Simulate sending data
    const submitBtn = document.querySelector('.newsletter-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing up...';
    submitBtn.disabled = true;

    // Simulate API call with timeout
    setTimeout(() => {
        console.log('Newsletter signup:', { name, email });

        // Show success message
        showNewsletterMessage(
            `Thank you, ${name}! You've been added to our newsletter. Check your email for a welcome message!`,
            'success'
        );

        // Reset form
        document.getElementById('newsletterForm').reset();

        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1000);
});

// Show newsletter message function
function showNewsletterMessage(message, type) {
    const messageElement = document.getElementById('newsletterMessage');
    messageElement.textContent = message;
    messageElement.className = `newsletter-message ${type}`;

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'newsletter-message';
        }, 5000);
    }
}



// Add scroll effects to navigation and update logo color

function updateHeaderAndLogoAndNav() {
    const header = document.querySelector('header');
    const logoImg = document.getElementById('logo-img');
    const navLinks = document.querySelector('.nav-links');
    const socialIcons = document.querySelector('.social-icons-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
        if (logoImg) {
            logoImg.classList.add('logo-dark');
            logoImg.classList.remove('logo-white');
        }
        if (navLinks) {
            navLinks.classList.add('nav-dark');
            navLinks.classList.remove('nav-white');
        }
        if (socialIcons) {
            socialIcons.classList.add('social-dark');
            socialIcons.classList.remove('social-white');
        }
    } else {
        header.classList.remove('scrolled');
        if (logoImg) {
            logoImg.classList.add('logo-white');
            logoImg.classList.remove('logo-dark');
        }
        if (navLinks) {
            navLinks.classList.add('nav-white');
            navLinks.classList.remove('nav-dark');
        }
        if (socialIcons) {
            socialIcons.classList.add('social-white');
            socialIcons.classList.remove('social-dark');
        }
    }
}
window.addEventListener('scroll', updateHeaderAndLogoAndNav);
window.addEventListener('DOMContentLoaded', updateHeaderAndLogoAndNav);

// Add animation on page load
window.addEventListener('load', () => {
    document.querySelectorAll('.blog-post').forEach((post, index) => {
        post.style.animation = `fadeIn 0.6s ease forwards`;
        post.style.animationDelay = `${index * 0.1}s`;
    });
});

// Infinite draggable marquee
(function () {
    const container = document.querySelector('.marquee-container');
    const track = document.querySelector('.marquee-track');
    if (!container || !track) return;

    const speed = 0.8;
    let x = 0;
    let halfWidth = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartTranslate = 0;

    function init() {
        halfWidth = track.scrollWidth / 2;
        requestAnimationFrame(animate);
    }

    function animate() {
        if (!isDragging) {
            x -= speed;
            if (x <= -halfWidth) x += halfWidth;
            track.style.transform = `translateX(${x}px)`;
        }
        requestAnimationFrame(animate);
    }

    function dragStart(clientX) {
        isDragging = true;
        dragStartX = clientX;
        dragStartTranslate = x;
        container.style.cursor = 'grabbing';
    }

    function dragMove(clientX) {
        if (!isDragging) return;
        x = dragStartTranslate + (clientX - dragStartX);
        while (x > 0) x -= halfWidth;
        while (x <= -halfWidth) x += halfWidth;
        track.style.transform = `translateX(${x}px)`;
    }

    function dragEnd() {
        isDragging = false;
        container.style.cursor = 'grab';
    }

    container.addEventListener('mousedown', e => { dragStart(e.clientX); e.preventDefault(); });
    window.addEventListener('mousemove', e => dragMove(e.clientX));
    window.addEventListener('mouseup', dragEnd);

    container.addEventListener('touchstart', e => { dragStart(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('touchmove', e => { if (isDragging) dragMove(e.touches[0].clientX); });
    window.addEventListener('touchend', dragEnd);

    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();

// Add CSS animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);
