// Floating Contact Button Functionality - Single source of truth
document.addEventListener('DOMContentLoaded', function() {
    const contactBtn = document.getElementById('contactBtn');
    const socialLinks = document.getElementById('socialLinks');

    if (contactBtn && socialLinks) {
        // Toggle social links
        contactBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            contactBtn.classList.toggle('active');
            socialLinks.classList.toggle('show');
        });

        // Close social links when clicking outside
        document.addEventListener('click', function(e) {
            if (!contactBtn.contains(e.target) && !socialLinks.contains(e.target)) {
                contactBtn.classList.remove('active');
                socialLinks.classList.remove('show');
            }
        });

        // Prevent social links from closing when clicking inside
        socialLinks.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
}); 