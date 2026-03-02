// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  // Skip tab navigation links
  if (anchor.classList.contains("nav-link")) {
    return;
  }

  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ==================== SCROLL ANIMATIONS ====================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
    }
  });
}, observerOptions);

// Observe all sections and cards
document.addEventListener("DOMContentLoaded", () => {
  const animatedElements = document.querySelectorAll(
    "section, .card, .assassin-card, .stat-item",
  );
  animatedElements.forEach((el) => observer.observe(el));
});

// ==================== PARALLAX HERO EFFECT ====================
const hero = document.querySelector("#hero, #hero-assassins");
if (hero) {
  const parallax = hero.querySelector(".hero-overlay, .hero-content");
  if (parallax) {
    // Promote to GPU layer upfront to avoid per-frame compositing cost
    parallax.style.willChange = "transform";

    let ticking = false;
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          parallax.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
}

// ==================== ANIMATED COUNTER ====================
function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = formatNumber(target);
      clearInterval(timer);
    } else {
      element.textContent = formatNumber(Math.floor(current));
    }
  }, 16);
}

function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + "M+";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K+";
  }
  return num.toString();
}

// Trigger counters when stats section is visible
const statsSection = document.querySelector("#legacy");
if (statsSection) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statNumbers = entry.target.querySelectorAll(".stat-number");
          statNumbers.forEach((stat) => {
            const text = stat.textContent.trim();
            if (text.includes("M+")) {
              const num = parseInt(text) * 1000000;
              animateCounter(stat, num);
            } else if (text.includes("+") && !text.includes("–")) {
              const num = parseInt(text);
              animateCounter(stat, num);
            }
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  statsObserver.observe(statsSection);
}

// ==================== TAB SWITCHING WITH ANIMATION ====================
const tabLinks = document.querySelectorAll(".nav-link");
const tabPanes = document.querySelectorAll(".tab-pane");

tabLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent event bubbling

    // Remove active from all
    tabLinks.forEach((l) => l.classList.remove("active"));
    tabPanes.forEach((p) => {
      p.classList.remove("show", "active");
    });

    // Add active to clicked
    link.classList.add("active");
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      target.classList.add("show", "active");
    }
  });
});

// ==================== CARD HOVER EFFECTS ====================
const cards = document.querySelectorAll(".card, .assassin-card");
cards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-10px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// ==================== MUSIC CONTROL ====================
const bgMusic = document.getElementById("bg-music");
let musicButton;

if (bgMusic) {
  // Create music control button
  musicButton = document.createElement("button");
  musicButton.id = "music-toggle";
  musicButton.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
  musicButton.setAttribute("aria-label", "Toggle background music");
  document.body.appendChild(musicButton);

  // Start muted by default (better UX)
  bgMusic.volume = 0.3;
  bgMusic.muted = true;
  musicButton.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';

  musicButton.addEventListener("click", () => {
    if (bgMusic.muted) {
      bgMusic.muted = false;
      bgMusic.play();
      musicButton.innerHTML = '<i class="bi bi-volume-up-fill"></i>';
    } else {
      bgMusic.muted = true;
      musicButton.innerHTML = '<i class="bi bi-volume-mute-fill"></i>';
    }
  });
}

// ==================== MOBILE MENU TOGGLE ====================
const menuToggle = document.getElementById("menu-toggle");
const navElement = document.querySelector("header nav");
const menuLinks = document.querySelectorAll(".content a:not(.dropdownto)");
const overlay = document.querySelector(".overlay");

if (menuToggle && navElement) {
  const toggleMenu = () => {
    navElement.classList.toggle("nav-active");
    const isExpanded = navElement.classList.contains("nav-active");
    menuToggle.setAttribute("aria-expanded", isExpanded);
  };

  menuToggle.addEventListener("click", toggleMenu);

  if (overlay) {
    overlay.addEventListener("click", () => {
      navElement.classList.remove("nav-active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  }

  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navElement.classList.remove("nav-active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ==================== SCROLL TO TOP BUTTON ====================
// Use an existing #scroll-top element (e.g. hardcoded in HTML) or create one
const scrollTopBtn =
  document.getElementById("scroll-top") ||
  (() => {
    const btn = document.createElement("button");
    btn.id = "scroll-top";
    btn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    btn.setAttribute("aria-label", "Scroll to top");
    document.body.appendChild(btn);
    return btn;
  })();

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Loading screen logic abstracted to js/components.js
// ==================== ASSASSIN CARD STAGGER ANIMATION ====================
document.addEventListener("DOMContentLoaded", () => {
  const assassinCards = document.querySelectorAll(".assassin-card");

  const assassinObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("animate-in");
          }, index * 100); // Stagger animation
          assassinObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  assassinCards.forEach((card) => assassinObserver.observe(card));
});

// ==================== ASSASSIN CARD HOVER EFFECTS ====================
function rebindAssassinHovers() {
  const cardsHover = document.querySelectorAll(".assassin-card");
  if (cardsHover.length > 0) {
    cardsHover.forEach((card) => {
      // Clone block to strip any previously bound old listeners
      const newCard = card.cloneNode(true);
      if (card.parentNode) {
        card.parentNode.replaceChild(newCard, card);
      }

      newCard.addEventListener("mouseenter", function () {
        const badges = this.querySelectorAll(".stat-badge");
        badges.forEach((badge, index) => {
          setTimeout(() => {
            badge.style.transform = "translateY(-2px) scale(1.05)";
          }, index * 50);
        });
      });

      newCard.addEventListener("mouseleave", function () {
        const badges = this.querySelectorAll(".stat-badge");
        badges.forEach((badge) => {
          badge.style.transform = "translateY(0) scale(1)";
        });
      });
    });
  }
}

// Call initially for static pages
document.addEventListener("DOMContentLoaded", () => {
  rebindAssassinHovers();
});

// ==================== ASSASSIN FILTER FUNCTIONALITY ====================
const filterButtons = document.querySelectorAll(".filter-btn");

if (filterButtons.length > 0) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter");

      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");

      // Dynamically query cards since they might be injected asynchronously
      const currentCards = document.querySelectorAll(".assassin-card");

      // Apply Glitch Effect
      currentCards.forEach((card) => {
        card.classList.add("glitch-anim");

        // Wait for glitch to play to halfway before hiding/showing
        setTimeout(() => {
          const role = card.dataset.role || "";
          const era = card.dataset.era || "";
          let shouldShow = false;

          if (filter === "all") {
            shouldShow = true;
          } else if (filter === "mentor" && role === "mentor") {
            shouldShow = true;
          } else if (filter === "founder" && role === "founder") {
            shouldShow = true;
          } else if (filter === "ancient" && era === "ancient") {
            shouldShow = true;
          } else if (filter === "modern" && era === "modern") {
            shouldShow = true;
          }

          if (shouldShow) {
            card.style.display = "block";
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0)";
            }, 10);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";
            setTimeout(() => {
              card.style.display = "none";
            }, 200);
          }

          // Remove glitch class when animation finishes
          setTimeout(() => {
            card.classList.remove("glitch-anim");
          }, 200);
        }, 200); // Trigger toggle midway through the 0.4s glitch animation
      });
    });
  });
}

// ==================== DYNAMIC GREETING ====================
const heroContent = document.querySelector(".hero-content p");
if (heroContent && heroContent.textContent === "History is our playground.") {
  const hour = new Date().getHours();
  let greeting = "History is our playground.";

  if (hour >= 5 && hour < 12) {
    greeting = "Good morning, Assassin. History awaits.";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Good afternoon, Assassin. The Creed calls.";
  } else if (hour >= 18 && hour < 22) {
    greeting = "Good evening, Assassin. Shadows are your ally.";
  } else {
    greeting = "The night is yours, Assassin. Strike from the darkness.";
  }

  heroContent.textContent = greeting;
}

// ==================== PARTICLES.JS BACKGROUND ====================
if (typeof particlesJS !== "undefined") {
  particlesJS("particles-js", {
    particles: {
      number: {
        value: 80,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: ["#00d2ff", "#0088cc", "#0055aa", "#ffffff"],
      },
      shape: {
        type: ["circle", "triangle", "edge"],
        stroke: {
          width: 0,
          color: "#000000",
        },
      },
      opacity: {
        value: 0.5,
        random: true,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      size: {
        value: 3,
        random: true,
        anim: {
          enable: true,
          speed: 2,
          size_min: 0.1,
          sync: false,
        },
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#00d2ff",
        opacity: 0.4,
        width: 1,
      },
      move: {
        enable: true,
        speed: 2,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200,
        },
      },
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab",
        },
        onclick: {
          enable: true,
          mode: "push",
        },
        resize: true,
      },
      modes: {
        grab: {
          distance: 140,
          line_linked: {
            opacity: 1,
          },
        },
        push: {
          particles_nb: 4,
        },
      },
    },
    retina_detect: true,
  });
}

// ==================== ANIMUS CHARACTER SLIDER INFINITE LOOP ====================
document.addEventListener("DOMContentLoaded", () => {
  const sliderTracks = document.querySelectorAll(".assassins-slider-track");

  sliderTracks.forEach((track) => {
    // Clone all children to create a seamless loop
    const children = Array.from(track.children);
    children.forEach((child) => {
      const clone = child.cloneNode(true);
      track.appendChild(clone);
    });
  });
});
