// js/factions.js — Factions Page JavaScript

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
    { threshold: 0.08 },
  );

  document
    .querySelectorAll("section")
    .forEach((sec) => revealObserver.observe(sec));

  // ---- Figure card hover audio cue (optional subtle visual feedback) ----
  document.querySelectorAll(".figure-card").forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.zIndex = "2";
    });
    card.addEventListener("mouseleave", () => {
      card.style.zIndex = "";
    });
  });

  // ---- CTA faction choice buttons ----
  const assassinsBtn = document.getElementById("join-assassins");
  const templarsBtn = document.getElementById("join-templars");

  if (assassinsBtn) {
    assassinsBtn.addEventListener("click", () => {
      assassinsBtn.textContent = "⚔ SWORN IN";
      assassinsBtn.style.background = "rgba(0,210,255,0.3)";
      setTimeout(() => {
        assassinsBtn.textContent = "Join the Brotherhood";
        assassinsBtn.style.background = "";
      }, 2500);
    });
  }

  if (templarsBtn) {
    templarsBtn.addEventListener("click", () => {
      templarsBtn.textContent = "✠ INITIATED";
      templarsBtn.style.background = "rgba(255,51,51,0.3)";
      setTimeout(() => {
        templarsBtn.textContent = "Join the Order";
        templarsBtn.style.background = "";
      }, 2500);
    });
  }
});
