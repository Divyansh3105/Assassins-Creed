// Fetch data from data.json
async function fetchGameData() {
  try {
    // Check cache first
    const cachedData = sessionStorage.getItem("ac_game_data");
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const response = await fetch("data/data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // Save to cache
    sessionStorage.setItem("ac_game_data", JSON.stringify(data));
    return data;
  } catch (error) {
    console.error("Could not fetch game data:", error);
    return null;
  }
}

// Get URL parameter by name
function getUrlParameter(name) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

// Load Era Content (for era.html)
async function loadEraContent() {
  const data = await fetchGameData();
  if (!data) return showError({ from: "data" });

  const eraId = getUrlParameter("era");
  if (!eraId) return showError({ from: "era" });

  const eraData = data.eras.find((e) => e.id === eraId);
  if (!eraData) return showError({ from: "era", ref: eraId });

  // Set Page Title
  document.title = `${eraData.title} - Assassin's Creed Tribute`;

  // Update Meta Description dynamically
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content =
    eraData.subtitle || `Explore the Assassin's Creed ${eraData.title} era.`;

  // Update OpenGraph tags if needed
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    document.head.appendChild(ogTitle);
  }
  ogTitle.content = document.title;

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement("meta");
    ogDesc.setAttribute("property", "og:description");
    document.head.appendChild(ogDesc);
  }
  ogDesc.content = metaDesc.content;

  // og:image — use the era's banner, fall back to the site-wide OG image
  let ogImage = document.querySelector('meta[property="og:image"]');
  if (!ogImage) {
    ogImage = document.createElement("meta");
    ogImage.setAttribute("property", "og:image");
    document.head.appendChild(ogImage);
  }
  ogImage.content =
    eraData.banner_image ||
    "https://divyansh3105.github.io/Assassins-Creed/Media/OG.png";

  // og:url — the canonical URL for this era page
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement("meta");
    ogUrl.setAttribute("property", "og:url");
    document.head.appendChild(ogUrl);
  }
  ogUrl.content = window.location.href;
  const heroSection = document.getElementById("hero-dynamic");
  if (eraData.banner_image) {
    heroSection.style.backgroundImage = `url('${eraData.banner_image}')`;
  }

  document.getElementById("era-title").textContent = eraData.title;
  document.getElementById("era-subtitle").textContent = eraData.subtitle;

  // Set About
  document.getElementById("era-about-content").innerHTML = DOMPurify.sanitize(
    eraData.about_html,
  );

  // Set Games
  const gamesGrid = document.getElementById("era-games-grid");
  gamesGrid.innerHTML = "";

  eraData.games.forEach((gameId) => {
    const game = data.games[gameId];
    if (!game) return;

    let statsHtml = "";
    if (game.card_stats && game.card_stats.length > 0) {
      statsHtml = game.card_stats
        .map(
          (stat) =>
            `<span class="stat-badge"><i class="${stat.icon}"></i> ${stat.text}</span>`,
        )
        .join("");
    }

    const cardHtml = `
            <a href="game.html?game=${game.id}" class="assassin-card glass-panel" tabindex="0">
                <img src="${game.card_image}" alt="${game.card_title}" loading="lazy">
                <div class="assassin-info">
                    <h3>${game.card_title}</h3>
                    <p class="assassin-era">${game.card_era}</p>
                    <p class="assassin-desc">${game.card_desc}</p>
                    <div class="assassin-stats">
                        ${statsHtml}
                    </div>
                </div>
            </a>
        `;
    gamesGrid.insertAdjacentHTML("beforeend", DOMPurify.sanitize(cardHtml));
  });

  // Show Content
  document.getElementById("loading-screen").style.display = "none";
  document.getElementById("era-content").style.display = "block";

  // Trigger animations if present in script.js (cards animate-in)
  setTimeout(() => {
    const cards = document.querySelectorAll(".assassin-card, .card");
    cards.forEach((card) => {
      card.classList.add("animate-in");
    });
  }, 100);
}

// Load Game Content (for game.html)
async function loadGameContent() {
  const data = await fetchGameData();
  if (!data) return showError({ from: "data" });

  const gameId = getUrlParameter("game");
  if (!gameId) return showError({ from: "game" });

  const gameData = data.games[gameId];
  if (!gameData) return showError({ from: "game", ref: gameId });

  // Base info
  document.title = gameData.title || `Assassin's Creed`;
  document.getElementById("page-title").textContent = document.title;

  // Update Meta Description dynamically
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement("meta");
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }

  // create a plain text summary from story_desc
  if (gameData.story_desc) {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = DOMPurify.sanitize(gameData.story_desc);
    metaDesc.content = tempDiv.textContent.substring(0, 150) + "...";
  } else {
    metaDesc.content = `Discover ${gameData.title}`;
  }

  // Update OpenGraph tags if needed
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement("meta");
    ogTitle.setAttribute("property", "og:title");
    document.head.appendChild(ogTitle);
  }
  ogTitle.content = document.title;

  let ogDesc = document.querySelector('meta[property="og:description"]');
  if (!ogDesc) {
    ogDesc = document.createElement("meta");
    ogDesc.setAttribute("property", "og:description");
    document.head.appendChild(ogDesc);
  }
  ogDesc.content = metaDesc.content;

  // og:image — use the game's banner, fall back to the site-wide OG image
  let ogImage = document.querySelector('meta[property="og:image"]');
  if (!ogImage) {
    ogImage = document.createElement("meta");
    ogImage.setAttribute("property", "og:image");
    document.head.appendChild(ogImage);
  }
  ogImage.content =
    gameData.banner_image ||
    "https://divyansh3105.github.io/Assassins-Creed/Media/OG.png";

  // og:url — the canonical URL for this game page
  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement("meta");
    ogUrl.setAttribute("property", "og:url");
    document.head.appendChild(ogUrl);
  }
  ogUrl.content = window.location.href;
  const hero = document.getElementById("game-hero");
  if (gameData.banner_image) {
    hero.style.backgroundImage = `url('${gameData.banner_image}')`;
  }
  document.getElementById("game-title").textContent = gameData.title;

  // Info Cards
  if (gameData.info) {
    const infoGrid = document.getElementById("game-info-cards");
    const iconMap = {
      release_date: "bi-calendar-event",
      platforms: "bi-controller",
      setting: "bi-geo-alt-fill",
      era: "bi-clock-history",
    };

    for (const [key, value] of Object.entries(gameData.info)) {
      const icon = iconMap[key] || "bi-info-circle";
      const title = key
        .replace("_", " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      infoGrid.insertAdjacentHTML(
        "beforeend",
        DOMPurify.sanitize(`
                <div class="info-card animate-in" style="opacity:1; transform:translateY(0);">
                    <i class="bi ${icon}"></i>
                    <h4>${title}</h4>
                    <p>${value}</p>
                </div>
            `),
      );
    }
  }

  // Video & Story
  if (gameData.video_url) {
    // Use nocookie domain to resolveERR_BLOCKED_BY_CLIENT errors from tracking blockers
    const safeVideoUrl = gameData.video_url.replace(
      "www.youtube.com",
      "www.youtube-nocookie.com",
    );
    document.getElementById("game-video").src = safeVideoUrl;
  } else {
    document.querySelector(".video-responsive").style.display = "none";
  }

  document.getElementById("game-story-subtitle").textContent =
    gameData.story_subtitle || "Story";
  document.getElementById("game-story-desc").innerHTML = DOMPurify.sanitize(
    gameData.story_desc || "",
  );

  if (gameData.story_highlights) {
    document.getElementById("game-story-highlights").innerHTML =
      DOMPurify.sanitize(gameData.story_highlights);
  } else {
    document.querySelector(".story-highlights").style.display = "none";
  }

  // Features
  if (gameData.features && gameData.features.length > 0) {
    const sec = document.getElementById("game-features-section");
    sec.style.display = "block";
    const grid = document.getElementById("game-features");
    gameData.features.forEach((f) => {
      grid.insertAdjacentHTML(
        "beforeend",
        DOMPurify.sanitize(`
                <div class="feature-item animate-in" style="opacity:1; transform:translateY(0);">
                    <i class="${f.icon}"></i>
                    <h5>${f.title}</h5>
                    <p>${f.desc}</p>
                </div>
            `),
      );
    });
  }

  // Characters
  if (gameData.characters && gameData.characters.length > 0) {
    const sec = document.getElementById("game-characters-section");
    sec.style.display = "block";
    const grid = document.getElementById("game-characters");
    gameData.characters.forEach((c) => {
      grid.insertAdjacentHTML(
        "beforeend",
        DOMPurify.sanitize(`
                <div class="character-card animate-in" style="opacity:1; transform:translateY(0);">
                    <img src="${c.image}" alt="${c.name}" loading="lazy"/>
                    <h5>${c.name}</h5>
                </div>
            `),
      );
    });
  }

  // Mechanics
  if (gameData.mechanics && gameData.mechanics.length > 0) {
    const sec = document.getElementById("game-mechanics-section");
    sec.style.display = "block";
    const grid = document.getElementById("game-mechanics");
    gameData.mechanics.forEach((m) => {
      grid.insertAdjacentHTML(
        "beforeend",
        DOMPurify.sanitize(`
                <div class="mechanic-card animate-in" style="opacity:1; transform:translateY(0);">
                    <i class="${m.icon}"></i>
                    <h4>${m.title}</h4>
                    <p>${m.desc}</p>
                </div>
            `),
      );
    });
  }

  // Gallery
  if (gameData.gallery && gameData.gallery.length > 0) {
    const sec = document.getElementById("game-gallery-section");
    sec.style.display = "block";
    const grid = document.getElementById("game-gallery");
    gameData.gallery.forEach((imgUrl) => {
      grid.insertAdjacentHTML(
        "beforeend",
        DOMPurify.sanitize(`
                <div class="gallery-item animate-in" style="opacity:1; transform:translateY(0);">
                    <img src="${imgUrl}" alt="${gameData.title} Gameplay Screenshot" loading="lazy"/>
                </div>
            `),
      );
    });
  }

  // Legacy
  if (gameData.legacy_html) {
    const sec = document.getElementById("game-legacy-section");
    sec.style.display = "block";
    document.getElementById("game-legacy-html").innerHTML = DOMPurify.sanitize(
      gameData.legacy_html,
    );
  }

  // CTA
  if (gameData.play_now_url) {
    document.getElementById("game-play-now").href = gameData.play_now_url;
    document.getElementById("game-cta-subtitle").textContent =
      gameData.cta_subtitle || "";
  } else {
    document.querySelector(".cta-section").style.display = "none";
  }

  // Show Content
  document.getElementById("loading-screen").style.display = "none";
  document.getElementById("game-content").style.display = "block";
}

function showError(context = {}) {
  // Build a descriptive redirect so 404.html can show context-aware messaging
  const params = new URLSearchParams();
  if (context.from) params.set("from", context.from);
  if (context.ref) params.set("ref", context.ref);

  // Redirect to the dedicated 404 page
  window.location.replace(
    "404.html" + (params.toString() ? "?" + params.toString() : ""),
  );
}

// Load Assassins Content (for Assassins.html)
async function loadAssassinsContent() {
  const data = await fetchGameData();
  if (!data || !data.assassins) return showError({ from: "data" });

  const grid = document.getElementById("main-assassins-grid");
  if (!grid) return;

  grid.innerHTML = "";

  data.assassins.forEach((assassin, index) => {
    let statsHtml = "";
    if (assassin.card_stats && assassin.card_stats.length > 0) {
      statsHtml = assassin.card_stats
        .map(
          (stat) =>
            `<div class="stat-badge"><i class="${stat.icon}"></i><span>${stat.text}</span></div>`,
        )
        .join("");
    }

    const imgSrc = assassin.card_image || "Media/Unavailable.cur";
    const imgAlt = assassin.card_title || "Unknown Assassin";
    const cardTitle = assassin.card_title || "Unknown Assassin";
    const cardEra = assassin.card_era || "Era Unknown";
    const cardDesc = assassin.card_desc || "No description available.";

    const html = `
      <div class="assassin-card glass-panel" data-assassin="${assassin.id}" data-era="${assassin.card_era_filter}" data-role="${assassin.card_role}" tabindex="0">
          <img src="${imgSrc}" alt="${imgAlt}" loading="lazy">
          <div class="assassin-info">
              <h3>${cardTitle}</h3>
              <div class="assassin-era">${cardEra}</div>
              <p class="assassin-desc">${cardDesc}</p>
              <div class="assassin-stats">
                  ${statsHtml}
              </div>
          </div>
      </div>
    `;
    grid.insertAdjacentHTML("beforeend", DOMPurify.sanitize(html));
  });

  // Show Content
  document.getElementById("loading-screen").style.display = "none";
  grid.style.display = "grid";

  // Refresh hover logic bindings from script.js now that cards exist
  if (typeof rebindAssassinHovers === "function") {
    rebindAssassinHovers();
  }

  // Trigger the 'all' filter programmatically so script.js handles the opacity transition
  // This circumvents the IntersectionObserver race condition
  setTimeout(() => {
    const allFilterBtn = document.querySelector(
      '.filter-btn[data-filter="all"]',
    );
    if (allFilterBtn) {
      allFilterBtn.click();
    } else {
      // Fallback if the button is missing
      const cards = document.querySelectorAll(".assassin-card");
      cards.forEach((card) => {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 10);
      });
    }
  }, 50);
}
