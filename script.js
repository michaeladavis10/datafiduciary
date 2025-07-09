document.addEventListener('DOMContentLoaded', function () {

    // --- Mobile Menu Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.getElementById('main-nav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            mainNav.classList.toggle('nav-open');
            navToggle.classList.toggle('nav-open');
        });
    }

    // --- Close Mobile Menu on Link Click ---
    const allNavLinks = document.querySelectorAll('.main-nav a');
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 992 && mainNav.classList.contains('nav-open')) {
                mainNav.classList.remove('nav-open');
                navToggle.classList.remove('nav-open');
            }
        });
    });

    // --- Active Nav Link on Current Page ---
    const currentPath = window.location.pathname.split('/').pop();
    const navLinksPage = document.querySelectorAll('.main-nav a');

    navLinksPage.forEach(link => {
        link.classList.remove('active-nav'); // Remove active-nav from all links first
        const linkPath = link.getAttribute('href').split('/').pop();
        if (linkPath === currentPath) {
            link.classList.add('active-nav');
        } else if (currentPath === '' && linkPath === 'index.html') { // Handle root path for index.html
            link.classList.add('active-nav');
        }
    });

    // --- Contact Form Submission ---
    const contactForm = document.getElementById('contact-form');
    const formSuccessMessage = document.getElementById('form-success-message'); // Renamed to avoid conflict

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            const json = JSON.stringify(object);

            // IMPORTANT: Replace 'YOUR_FORM_ID' with your actual Formspree form ID
            fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                body: json,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        formSuccessMessage.style.display = 'block';
                        contactForm.reset();
                        contactForm.style.display = 'none';
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                alert(data["errors"].map(error => error["message"]).join(", "));
                            } else {
                                alert('Oops! There was a problem submitting your form.');
                            }
                        })
                    }
                })
                .catch(error => {
                    console.error('Form submission error:', error);
                    alert('Oops! There was a problem submitting your form.');
                });
        });
    }

    // --- Hover Prompt for Problem and Analogy Cards ---
    const hoverCards = document.querySelectorAll('.problem-card, .philosophy-item');
    let hoverTimer;
    const hoverPromptCloud = document.getElementById('hover-prompt-cloud');

    hoverCards.forEach(card => {
        card.addEventListener('mouseenter', (event) => {
            hoverTimer = setTimeout(() => {
                hoverPromptCloud.textContent = "Click in the box to contact us to solve it!"; // Updated text
                
                // Position the cloud relative to the hovered card
                const cardRect = card.getBoundingClientRect();
                const cloudWidth = hoverPromptCloud.offsetWidth;
                const cloudHeight = hoverPromptCloud.offsetHeight;

                // Calculate position to center above the card
                let top = cardRect.top + window.scrollY - cloudHeight - 20; // 20px offset above card
                let left = cardRect.left + window.scrollX + (cardRect.width / 2) - (cloudWidth / 2);

                // Ensure cloud stays within viewport (basic check)
                if (top < 0) top = cardRect.bottom + window.scrollY + 10; // If too high, position below
                if (left < 0) left = 0;
                if (left + cloudWidth > window.innerWidth) left = window.innerWidth - cloudWidth;

                hoverPromptCloud.style.top = `${top}px`;
                hoverPromptCloud.style.left = `${left}px`;
                hoverPromptCloud.style.opacity = '1';
                hoverPromptCloud.style.visibility = 'visible';
            }, 3000); // 3 seconds
        });

        card.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            hoverPromptCloud.style.opacity = '0';
            hoverPromptCloud.style.visibility = 'hidden';
        });
    });

    // --- Click to Prefill Contact Form (now just redirects and stores data) ---
    const prefillCards = document.querySelectorAll('.problem-card, .philosophy-item');

    prefillCards.forEach(card => {
        card.addEventListener('click', () => {
            // Only proceed if the hover prompt cloud is visible
            if (hoverPromptCloud.style.visibility === 'visible' && hoverPromptCloud.style.opacity === '1') {
                let challengeText = '';

                if (card.classList.contains('problem-card')) {
                    const h3 = card.querySelector('h3');
                    const p = card.querySelector('p');
                    if (h3 && p) {
                        challengeText = h3.textContent.trim() + '\n\n' + p.textContent.trim();
                    }
                } else if (card.classList.contains('philosophy-item')) {
                    const h2 = card.querySelector('h2');
                    const paragraphs = card.querySelectorAll('p');
                    if (h2 && paragraphs.length > 0) {
                        challengeText = h2.textContent.trim();
                        paragraphs.forEach(p => {
                            challengeText += '\n\n' + p.textContent.trim();
                        });
                    }
                }

                if (challengeText) {
                    sessionStorage.setItem('clickedChallenge', challengeText); // Store in sessionStorage
                    window.location.href = 'contact.html'; // Redirect to contact page
                }
            }
        });
    });

    // --- Populate hidden field on Contact Page Load ---
    const hiddenChallengeInput = document.getElementById('clicked-challenge-input');
    if (hiddenChallengeInput && window.location.pathname.endsWith('contact.html')) {
        const storedChallenge = sessionStorage.getItem('clickedChallenge');
        if (storedChallenge) {
            hiddenChallengeInput.value = storedChallenge;
            sessionStorage.removeItem('clickedChallenge'); // Clear after use
        }
    }

});