// js/isu.js - Isu Lore Page JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // ---- Scroll-reveal for sections ----
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  document
    .querySelectorAll("section")
    .forEach((sec) => revealObserver.observe(sec));

  // ---- Animate artifact progress bars on scroll ----
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target.querySelector(".isu-artifact-bar-fill");
          if (bar) {
            const target = bar.dataset.width || "75%";
            bar.style.width = target;
          }
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  document
    .querySelectorAll(".isu-artifact-card")
    .forEach((card) => barObserver.observe(card));

  // ---- CTA form sync button ----
  const ctaBtn = document.getElementById("isu-sync-btn");
  const ctaInput = document.getElementById("isu-email");

  if (ctaBtn && ctaInput) {
    ctaBtn.addEventListener("click", () => {
      const email = ctaInput.value.trim();
      if (!email || !email.includes("@")) {
        ctaInput.style.borderColor = "rgba(255,51,51,0.7)";
        ctaInput.placeholder = "Invalid sequence — enter a valid email";
        setTimeout(() => {
          ctaInput.style.borderColor = "";
          ctaInput.placeholder = "Enter your genetic memory sequence (Email)";
        }, 2500);
        return;
      }
      ctaBtn.textContent = "SYNCHRONIZED ✓";
      ctaBtn.style.background = "#2ecc71";
      ctaInput.value = "";
      setTimeout(() => {
        ctaBtn.textContent = "SYNCHRONIZE";
        ctaBtn.style.background = "";
      }, 3000);
    });
  }

  // ---- Scroll-to-top / music toggle (inherit from script.js if present) ----
});
