// Game Page Enhancements for Colonial Era

document.addEventListener('DOMContentLoaded', function() {

    // Animate info cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.info-card, .feature-item, .character-card, .gallery-item, .mechanic-card, .award-badge'
    );

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Enhanced character cards with role detection
    const characterCards = document.querySelectorAll('.character-card');

    // Define character roles based on names
    const characterRoles = {
        'Bayek of Siwa': 'Founder of the Brotherhood',
        'Bayek': 'Founder of the Brotherhood',
        'Aya': 'Co-Founder & Warrior',
        'Ptolemy XIII': 'Pharaoh of Egypt',
        'Ptolemy': 'Pharaoh of Egypt',
        'Alexios': 'Spartan Mercenary',
        'Kassandra': 'Spartan Mercenary',
        'Deimos': 'Cult Champion',
        'Eivor': 'Viking Raider',
        'Sigurd': 'Clan Leader',
        'Basim': 'Hidden One'
    };

    characterCards.forEach(card => {
        const nameElement = card.querySelector('h5');
        if (nameElement) {
            const characterName = nameElement.textContent.trim();
            const role = characterRoles[characterName] || 'Key Character';
            card.setAttribute('data-role', role);
        }

        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Gallery lightbox effect
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${this.src}" alt="${this.alt}">
                </div>
            `;
            document.body.appendChild(lightbox);

            setTimeout(() => lightbox.classList.add('active'), 10);

            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.className === 'lightbox-close') {
                    lightbox.classList.remove('active');
                    setTimeout(() => lightbox.remove(), 300);
                }
            });
        });

        img.style.cursor = 'pointer';
    });

    // Animate progress bars for game info
    const infoCards = document.querySelectorAll('.info-card');
    infoCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Smooth scroll for internal links
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

    // Add tooltip functionality to award badges
    const awardBadges = document.querySelectorAll('.award-badge');
    awardBadges.forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });

        badge.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Animate story highlights on reveal
    const storyHighlights = document.querySelector('.story-highlights');
    if (storyHighlights) {
        const listItems = storyHighlights.querySelectorAll('li');
        listItems.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
            item.style.transition = `all 0.5s ease ${index * 0.1}s`;

            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, 500);
        });
    }

    // Add interactive hover to feature items
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
        });

        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });

    // Add loading animation complete callback
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);

    // Video responsive enhancement
    const videoContainers = document.querySelectorAll('.video-responsive');
    videoContainers.forEach(container => {
        const iframe = container.querySelector('iframe');
        if (iframe) {
            iframe.addEventListener('load', function() {
                container.classList.add('video-loaded');
            });
        }
    });

    // CTA button pulse effect
    const ctaButtons = document.querySelectorAll('.cta-section .btn');
    ctaButtons.forEach(btn => {
        setInterval(() => {
            btn.style.animation = 'pulse 1s ease';
            setTimeout(() => {
                btn.style.animation = '';
            }, 1000);
        }, 5000);
    });

    console.log('Game enhancements loaded successfully!');
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in-up {
        animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }

    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    .lightbox.active {
        opacity: 1;
    }

    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }

    .lightbox-content img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
        box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
    }

    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        font-size: 40px;
        color: white;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .lightbox-close:hover {
        transform: rotate(90deg);
    }

    .character-card, .feature-item, .mechanic-card, .award-badge {
        transition: all 0.3s ease;
    }

    .info-card {
        animation: slideInFromBottom 0.6s ease forwards;
        opacity: 0;
    }

    @keyframes slideInFromBottom {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .story-highlights ul {
        list-style: none;
        padding-left: 0;
    }

    .story-highlights li {
        padding-left: 25px;
        position: relative;
        margin-bottom: 10px;
    }

    .story-highlights li:before {
        content: "⚔";
        position: absolute;
        left: 0;
        color: #c9a961;
        font-size: 18px;
    }

    .video-loaded {
        animation: videoFadeIn 0.5s ease;
    }

    @keyframes videoFadeIn {
        from {
            opacity: 0.5;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
