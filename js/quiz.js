// js/quiz.js — Personality Quiz Logic

// =======================
// QUIZ DATA & LOGIC
// =======================

const questions = [
  {
    title: "How do you prefer to handle a primary target?",
    options: [
      {
        text: "Shadow and Blade (Stealth)",
        desc: "Strike from the darkness, disappear into the crowd.",
        icon: "bi-eye-slash-fill",
        type: "ezio",
      },
      {
        text: "Open Combat (Aggressive)",
        desc: "Face them head-on with overwhelming force.",
        icon: "bi-shield-shaded",
        type: "eivor",
      },
      {
        text: "Command & Conquer (Tactical)",
        desc: "Control the environment, utilize traps and allies.",
        icon: "bi-diagram-3-fill",
        type: "arno",
      },
      {
        text: "Hunter's Mark (Wilderness)",
        desc: "Track them relentlessly across untamed lands.",
        icon: "bi-tree-fill",
        type: "connor",
      },
    ],
  },
  {
    title: "What is your greatest asset in a mission?",
    options: [
      {
        text: "My Charisma",
        desc: "I can talk my way into or out of any situation.",
        icon: "bi-people-fill",
        type: "ezio",
      },
      {
        text: "My Brute Strength",
        desc: "I shatter through defenses and shatter morale.",
        icon: "bi-hammer",
        type: "eivor",
      },
      {
        text: "My Preparedness",
        desc: "I always have the right tool, poison, or gadget.",
        icon: "bi-tools",
        type: "arno",
      },
      {
        text: "My Resilience",
        desc: "I outlast my enemies, no matter the environment.",
        icon: "bi-heart-pulse-fill",
        type: "connor",
      },
    ],
  },
  {
    title: "Where do you feel most at home?",
    options: [
      {
        text: "Thriving Cities",
        desc: "Amidst art, commerce, and towering monuments.",
        icon: "bi-buildings-fill",
        type: "ezio",
      },
      {
        text: "The High Seas / Open Water",
        desc: "Commanding a crew, raiding distant shores.",
        icon: "bi-water",
        type: "eivor",
      },
      {
        text: "The Shadows of High Society",
        desc: "Infiltrating galas, palaces, and political circles.",
        icon: "bi-cup-hot-fill",
        type: "arno",
      },
      {
        text: "The Deep Wilderness",
        desc: "High in the trees, surrounded by nature.",
        icon: "bi-compass-fill",
        type: "connor",
      },
    ],
  },
  {
    title: "Why do you fight the Templar Order?",
    options: [
      {
        text: "For Family & Justice",
        desc: "Revenge led me here, but justice guides my blade.",
        icon: "bi-house-heart-fill",
        type: "ezio",
      },
      {
        text: "For Glory & Clan",
        desc: "To secure a future and prosperity for my people.",
        icon: "bi-shield-plus",
        type: "eivor",
      },
      {
        text: "For Redemption",
        desc: "To atone for past mistakes and protect the innocent.",
        icon: "bi-arrow-counterclockwise",
        type: "arno",
      },
      {
        text: "For Freedom",
        desc: "To ensure liberty for those who cannot fight for themselves.",
        icon: "bi-flag-fill",
        type: "connor",
      },
    ],
  },
  {
    title: "Choose your primary secondary weapon:",
    options: [
      {
        text: "Throwing Knives",
        desc: "Silent, accurate, lethal at medium range.",
        icon: "bi-crosshair",
        type: "ezio",
      },
      {
        text: "Heavy Axes",
        desc: "Brutal and effective for clearing space.",
        icon: "bi-cone-striped",
        type: "eivor",
      },
      {
        text: "Phantom Blade",
        desc: "A concealed crossbow for quiet, rapid assassination.",
        icon: "bi-crosshair2",
        type: "arno",
      },
      {
        text: "Bow and Arrow",
        desc: "The ultimate hunting tool.",
        icon: "bi-bullseye",
        type: "connor",
      },
    ],
  },
];

const resultsDB = {
  ezio: {
    id: "ezio",
    name: "Ezio Auditore",
    sub: "Da Firenze",
    title: "The Mentor",
    img: "../Media/Ezio.webp",
    desc: "Charismatic, skilled, and driven by a deep sense of justice. Like Ezio, you are a natural leader who values family and loyalty above all. Your journey is one of growth, transforming from a carefree youth into a wise mentor who guides others from the shadows.",
    tags: ["Florence", "1459 – 1524", "Master Assassin"],
    stats: { stealth: 95, combat: 88, charisma: 100 },
    traits: [
      {
        icon: "bi-incognito",
        name: "Master of Disguise",
        desc: "You prefer to blend in with the crowd rather than strike openly.",
      },
      {
        icon: "bi-people-fill",
        name: "Natural Leader",
        desc: "Others instinctively look to you for guidance and direction.",
      },
      {
        icon: "bi-suit-heart-fill",
        name: "Passionate Spirit",
        desc: "You feel deeply and fight passionately for those you love.",
      },
    ],
  },
  connor: {
    id: "connor",
    name: "Connor Kenway",
    sub: "Ratonhnhaké:ton",
    title: "The Champion",
    img: "../Media/Connor.webp",
    desc: "Stoic, fierce, and utterly devoted to liberty. Like Connor, you have a powerful connection to nature and a strong moral compass. You are a solitary but formidable force of nature, relentlessly pursuing justice and freedom for the marginalized.",
    tags: ["America", "1756 – 1804", "Master Assassin"],
    stats: { stealth: 80, combat: 98, charisma: 65 },
    traits: [
      {
        icon: "bi-tree-fill",
        name: "One With Nature",
        desc: "You thrive in the wilderness and move silently through the trees.",
      },
      {
        icon: "bi-hammer",
        name: "Brutal Efficiency",
        desc: "You rely on raw strength and pragmatic, heavy weapons.",
      },
      {
        icon: "bi-flag-fill",
        name: "Idealistic Core",
        desc: "You strongly believe in freedom and refuse to compromise your ethics.",
      },
    ],
  },
  arno: {
    id: "arno",
    name: "Arno Dorian",
    sub: "Victor",
    title: "The Ghost",
    img: "../Media/Arno.webp",
    desc: "Tactical, quick-witted, and highly mobile. Like Arno, your greatest strength is exploiting the environment and striking with precision. You navigate complex social and physical structures with ease, turning urban chaos to your advantage.",
    tags: ["Paris", "1768 – ?", "Master Assassin"],
    stats: { stealth: 100, combat: 75, charisma: 85 },
    traits: [
      {
        icon: "bi-building",
        name: "Urban Navigator",
        desc: "You view the city as your playground, moving seamlessly across rooftops.",
      },
      {
        icon: "bi-crosshair2",
        name: "Phantom Strike",
        desc: "You prefer precision and stealth tools like the phantom blade.",
      },
      {
        icon: "bi-puzzle",
        name: "Tactical Mind",
        desc: "You meticulously plan your approach rather than rushing in blindly.",
      },
    ],
  },
  eivor: {
    id: "eivor",
    name: "Eivor Varinsdottir",
    sub: "Wolf-Kissed",
    title: "The Conqueror",
    img: "../Media/Eivor.webp",
    desc: "Fierce, honorable, and unyielding. Like Eivor, you are a natural warrior who leads from the front. You value your clan above all else and aren't afraid to confront obstacles head-on. You are a force to be reckoned with.",
    tags: ["England", "847 – ?", "Jarl"],
    stats: { stealth: 60, combat: 100, charisma: 80 },
    traits: [
      {
        icon: "bi-shield-fill",
        name: "Vanguard",
        desc: "You lead the charge in battle, inspiring allies with your ferocity.",
      },
      {
        icon: "bi-house-fill",
        name: "Clan Builder",
        desc: "You dedicate your life to establishing a prosperous home for your people.",
      },
      {
        icon: "bi-cone-striped",
        name: "Direct Confrontation",
        desc: "You prefer a straightforward, brutal fight over subtlety and shadows.",
      },
    ],
  },
};

// State
let currentStep = 0;
let answers = new Array(questions.length).fill(null); // stores each step's chosen type

// =======================
// UI CONTROLLERS
// =======================

document.addEventListener("DOMContentLoaded", () => {
  // ==== Reveal animations
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("animate-in");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.1 },
  );
  document
    .querySelectorAll(
      ".quiz-wrapper, .qr-wrapper, .qr-stat-col, .qr-trait-card",
    )
    .forEach((el) => revealObs.observe(el));

  // ==== Quiz Hub Logic
  const quizContainer = document.getElementById("quiz-container");
  if (quizContainer) {
    initQuiz();

    document
      .getElementById("quiz-next-btn")
      .addEventListener("click", handleNext);
    document
      .getElementById("quiz-prev-btn")
      .addEventListener("click", handlePrev);
  }

  // ==== Quiz Results Logic
  const resName = document.getElementById("res-name");
  if (resName) {
    loadResults();

    // Share button interaction
    const shareBtn = document.getElementById("qr-share-btn");
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        const origHTML = shareBtn.innerHTML;
        shareBtn.innerHTML = '<i class="bi bi-check2"></i> LINK COPIED';
        shareBtn.style.background = "#2ecc71";
        shareBtn.style.color = "#000";
        setTimeout(() => {
          shareBtn.innerHTML = origHTML;
          shareBtn.style.background = "";
          shareBtn.style.color = "";
        }, 3000);
      });
    }
  }
});

// =======================
// QUIZ ENGINE
// =======================

function initQuiz() {
  currentStep = 0;
  answers = new Array(questions.length).fill(null);
  renderStep();
}

function renderStep() {
  const q = questions[currentStep];

  // Update Header
  document.getElementById("quiz-step").innerText =
    `Sequence ${currentStep + 1} of ${questions.length}`;
  document.getElementById("quiz-progress").style.width =
    `${(currentStep / questions.length) * 100}%`;
  document.getElementById("quiz-question-title").innerText = q.title;

  // Body
  const optsContainer = document.getElementById("quiz-options");
  optsContainer.innerHTML = "";

  q.options.forEach((opt, index) => {
    const label = document.createElement("label");
    label.className = "quiz-label";

    label.innerHTML = `
            <input type="radio" name="quiz_q" class="quiz-radio" value="${opt.type}" id="q_opt_${index}">
            <div class="quiz-opt-text">
                <span class="quiz-opt-title">${opt.text}</span>
                <span class="quiz-opt-desc">${opt.desc}</span>
            </div>
            <i class="bi ${opt.icon} quiz-opt-icon"></i>
        `;

    const input = label.querySelector("input");

    // Restore previously saved answer when navigating back
    if (answers[currentStep] === opt.type) {
      input.checked = true;
    }

    input.addEventListener("change", () => {
      document.getElementById("quiz-next-btn").disabled = false;
    });

    optsContainer.appendChild(label);
  });

  // Buttons
  document.getElementById("quiz-prev-btn").style.visibility =
    currentStep === 0 ? "hidden" : "visible";

  const nextBtn = document.getElementById("quiz-next-btn");
  // If this step was already answered (navigating back), enable Next immediately
  nextBtn.disabled = answers[currentStep] === null;

  if (currentStep === questions.length - 1) {
    nextBtn.innerHTML = 'Complete Sync <i class="bi bi-cpu-fill"></i>';
  } else {
    nextBtn.innerHTML = 'Next Sequence <i class="bi bi-chevron-right"></i>';
  }
}

function handleNext() {
  const selected = document.querySelector('input[name="quiz_q"]:checked');
  if (!selected) return;

  // Overwrite (or set) the answer for this step — handles changed answers on back-navigation
  answers[currentStep] = selected.value;

  if (currentStep < questions.length - 1) {
    currentStep++;
    renderStep();
  } else {
    finishQuiz();
  }
}

function handlePrev() {
  if (currentStep > 0) {
    currentStep--;
    renderStep(); // renderStep restores the saved answer for this step
  }
}

function finishQuiz() {
  // 1. Recalculate scores from scratch using the answers array
  //    This ensures changed answers (via "Previous") are correctly reflected
  const scores = { ezio: 0, connor: 0, arno: 0, eivor: 0 };
  answers.forEach((ans) => {
    if (ans && scores[ans] !== undefined) scores[ans]++;
  });

  // 2. Find winner
  let winner = "ezio";
  let max = -1;
  for (let key in scores) {
    if (scores[key] > max) {
      max = scores[key];
      winner = key;
    }
  }

  // 3. Loading state
  const nextBtn = document.getElementById("quiz-next-btn");
  nextBtn.innerHTML = '<i class="bi bi-hourglass-split spin"></i> Syncing...';
  nextBtn.disabled = true;

  // 4. Complete progress bar
  document.getElementById("quiz-progress").style.width = `100%`;

  // 5. Redirect
  setTimeout(() => {
    window.location.href = `quiz_results.html?profile=${winner}`;
  }, 1000);
}

// =======================
// RESULTS ENGINE
// =======================

function loadResults() {
  const params = new URLSearchParams(window.location.search);
  const profileId = params.get("profile") || "ezio"; // default fallback
  const data = resultsDB[profileId] || resultsDB["ezio"];

  // 1. Text & Hero
  document.getElementById("res-img").style.backgroundImage =
    `url('${data.img}')`;
  document.getElementById("res-name").innerText = data.name;
  document.getElementById("res-sub").innerText = data.sub;
  document.getElementById("res-title").innerText = data.title;
  document.getElementById("res-desc").innerText = data.desc;

  // 2. Tags
  const tagsBox = document.getElementById("res-tags");
  tagsBox.innerHTML = "";
  data.tags.forEach((t) => {
    const span = document.createElement("span");
    span.className = "qr-tag";
    span.innerText = t;
    tagsBox.appendChild(span);
  });

  // 3. Stats (will animate to full later)
  setTimeout(() => {
    document.getElementById("res-stat-stealth-bar").style.width =
      `${data.stats.stealth}%`;
    document.getElementById("res-stat-stealth").innerText =
      `${data.stats.stealth}%`;

    document.getElementById("res-stat-combat-bar").style.width =
      `${data.stats.combat}%`;
    document.getElementById("res-stat-combat").innerText =
      `${data.stats.combat}%`;

    document.getElementById("res-stat-charisma-bar").style.width =
      `${data.stats.charisma}%`;
    document.getElementById("res-stat-charisma").innerText =
      `${data.stats.charisma}%`;

    // Color Max stat
    ["stealth", "combat", "charisma"].forEach((k) => {
      if (data.stats[k] === 100) {
        document.getElementById(`res-stat-${k}-bar`).classList.add("max");
        document.getElementById(`res-stat-${k}`).style.color = "#f4c025";
      }
    });
  }, 300); // slight delay for animation trigger

  // 4. Traits
  const traitsBox = document.getElementById("res-traits");
  traitsBox.innerHTML = "";
  data.traits.forEach((t, i) => {
    const dv = document.createElement("div");
    dv.className = "qr-trait-card";
    // Stagger entrance animation
    dv.style.animationDelay = `${i * 0.15}s`;
    dv.innerHTML = `
            <div class="qr-trait-icon"><i class="bi ${t.icon}"></i></div>
            <h4 class="qr-trait-name">${t.name}</h4>
            <p class="qr-trait-desc">${t.desc}</p>
        `;
    traitsBox.appendChild(dv);
  });
}
