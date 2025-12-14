// 1. Initialize AOS Animations
AOS.init({
    duration: 800,  // Animation speed (in ms)
    once: true,     // Whether animation should happen only once
    offset: 50,     // Offset (in px) from the original trigger point
});

// 2. Mobile Menu Logic
const menu = document.getElementById('mobile-menu');
const openBtn = document.getElementById('open-menu');
const closeBtn = document.getElementById('close-menu');
const menuLinks = document.querySelectorAll('#mobile-menu a');

if (openBtn && menu && closeBtn) {
    openBtn.addEventListener('click', function() {
        menu.classList.remove('translate-x-full');
    });

    closeBtn.addEventListener('click', function() {
        menu.classList.add('translate-x-full');
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menu.classList.add('translate-x-full');
        });
    });
}

// 3. Load More / Show Less Courses Logic
const loadMoreBtn = document.getElementById('loadMoreBtn');
const showLessBtn = document.getElementById('showLessBtn');
const hiddenCourses = document.querySelectorAll('.hidden-course');

if (loadMoreBtn && showLessBtn) {
    // Logic for "View All Courses"
    loadMoreBtn.addEventListener('click', function() {
        hiddenCourses.forEach(course => {
            course.classList.remove('hidden'); // Show courses
            course.classList.add('aos-animate'); // Trigger animation
        });
        
        // Swap buttons
        loadMoreBtn.classList.add('hidden');
        showLessBtn.classList.remove('hidden');
    });

    // Logic for "View Less"
    showLessBtn.addEventListener('click', function() {
        hiddenCourses.forEach(course => {
            course.classList.add('hidden'); // Hide courses
        });

        // Swap buttons back
        loadMoreBtn.classList.remove('hidden');
        showLessBtn.classList.add('hidden');

        // Smooth scroll back up to the courses title so user isn't lost
        const coursesSection = document.getElementById('courses');
        if (coursesSection) {
            coursesSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// 4. Form Submission Logic with SMART Validation
const leadForm = document.getElementById("leadForm");

if (leadForm) {
    leadForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const form = e.target;
        const msg = document.getElementById("formMessage");

        // Get Values
        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim();
        const course_interest = form.course_interest.value;

        // --- PHONE VALIDATION 🧠 ---
        // Rule A: Must be 10 digits and start with 6, 7, 8, or 9
        const phoneRegex = /^[6-9]\d{9}$/;
        
        // Rule B: Check if all digits are the same (e.g., 9999999999)
        const isRepeated = new Set(phone).size === 1;

        if (!phoneRegex.test(phone) || isRepeated) {
            msg.textContent = "Please enter a valid, active mobile number.";
            msg.style.backgroundColor = 'rgba(255, 0, 0, 0.7)'; // Red background
            msg.style.padding = '5px 10px';
            msg.style.borderRadius = '5px';
            msg.style.color = 'white';
            return; // 🛑 Stop! Don't send.
        }

        // Prepare Data
        const data = { name, email, phone, course_interest };

        // Show Loading State
        msg.textContent = "Sending enquiry...";
        msg.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; 
        msg.style.color = "white"; 
        msg.style.padding = '5px 10px';
        msg.style.borderRadius = '5px';

        try {
            // Send to Backend API
            const res = await fetch("/api/send-email.js", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            if (!res.ok) {
    console.error("Server responded with error:", res.status);
}

            let result = {};

try {
    result = await res.json();
} catch {
    result.message = res.ok
        ? "Success! We will call you soon."
        : "Server error occurred.";
}

// Show Result Message
msg.textContent = result.message;
msg.style.backgroundColor = res.ok
    ? 'rgba(0, 128, 0, 0.7)'
    : 'rgba(255, 0, 0, 0.7)';


            if (res.ok) {
                form.reset();
                // Clear success message after 5 seconds
                setTimeout(() => {
                    msg.textContent = '';
                    msg.style.backgroundColor = 'transparent';
                }, 5000); 
            }
        } catch (error) {
            console.error(error);
            msg.textContent = "A network error occurred. Please check your connection.";
            msg.style.backgroundColor = 'rgba(255, 0, 0, 0.7)';
        }
    });
}