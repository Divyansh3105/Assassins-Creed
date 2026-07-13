async function fetchGameData() {
  try {
    const response = await fetch("data/data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Could not fetch game data:", error);
    return null;
  }
}

function getUrlParameter(name) {
  return new URLSearchParams(window.location.search).get(name) || "";
}

const SITE_URL = "https://assassins-creed-tribute.netlify.app/";
const DEFAULT_OG_IMAGE = SITE_URL + "assets/social/OG.png";

function setMeta(attr, key, content) {
  let tag = document.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setPageMeta({ title, description, image }) {
  document.title = title;
  setMeta("name", "description", description);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:image", image || DEFAULT_OG_IMAGE);

  // Always point at the main (Netlify) address, whichever host served the page
  const page = window.location.pathname.split("/").pop() || "index.html";
  const url = SITE_URL + page + window.location.search;
  setMeta("property", "og:url", url);
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

async function loadEraContent() {
  const data = await fetchGameData();
  if (!data) return showError({ from: "data" });

  const eraId = getUrlParameter("era");
  if (!eraId) return showError({ from: "era" });

  const eraData = data.eras.find((e) => e.id === eraId);
  if (!eraData) return showError({ from: "era", ref: eraId });

  setPageMeta({
    title: `${eraData.title} - Assassin's Creed Tribute`,
    description:
      eraData.subtitle || `Explore the Assassin's Creed ${eraData.title} era.`,
    image: eraData.banner_image,
  });

  const heroSection = document.getElementById("hero-dynamic");
  if (eraData.banner_image) {
    heroSection.style.backgroundImage = `url('${eraData.banner_image}')`;
  }

  document.getElementById("era-title").textContent = eraData.title;
  document.getElementById("era-subtitle").textContent = eraData.subtitle;

  document.getElementById("era-about-content").innerHTML = DOMPurify.sanitize(
    eraData.about_html,
  );

  const gamesGrid = document.getElementById("era-games-grid");
  gamesGrid.innerHTML = "";

  eraData.games.forEach((gameId) => {
    const game = Object.hasOwn(data.games, gameId) ? data.games[gameId] : null;
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

  document.getElementById("loading-screen").style.display = "none";
  document.getElementById("era-content").style.display = "block";

  setTimeout(() => {
    const cards = document.querySelectorAll(".assassin-card, .card");
    cards.forEach((card) => {
      card.classList.add("animate-in");
    });
  }, 100);
}

async function loadGameContent() {
  const data = await fetchGameData();
  if (!data) return showError({ from: "data" });

  const gameId = getUrlParameter("game");
  if (!gameId) return showError({ from: "game" });

  const gameData = Object.hasOwn(data.games, gameId) ? data.games[gameId] : null;
  if (!gameData) return showError({ from: "game", ref: gameId });

  let description = `Discover ${gameData.title}`;
  if (gameData.story_desc) {
    const tmp = document.createElement("div");
    tmp.innerHTML = DOMPurify.sanitize(gameData.story_desc);
    description = tmp.textContent.substring(0, 150) + "...";
  }
  setPageMeta({
    title: gameData.title || "Assassin's Creed",
    description,
    image: gameData.banner_image,
  });
  document.getElementById("page-title").textContent = document.title;

  const hero = document.getElementById("game-hero");
  if (gameData.banner_image) {
    hero.style.backgroundImage = `url('${gameData.banner_image}')`;
  }
  document.getElementById("game-title").textContent = gameData.title;

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
        .replaceAll("_", " ")
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

  if (gameData.video_url) {
    // nocookie domain avoids ERR_BLOCKED_BY_CLIENT from tracker blockers
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

  if (gameData.legacy_html) {
    const sec = document.getElementById("game-legacy-section");
    sec.style.display = "block";
    document.getElementById("game-legacy-html").innerHTML = DOMPurify.sanitize(
      gameData.legacy_html,
    );
  }

  if (gameData.play_now_url) {
    document.getElementById("game-play-now").href = gameData.play_now_url;
    document.getElementById("game-cta-subtitle").textContent =
      gameData.cta_subtitle || "";
  } else {
    document.querySelector(".cta-section").style.display = "none";
  }

  document.getElementById("loading-screen").style.display = "none";
  document.getElementById("game-content").style.display = "block";
}

function showError(context = {}) {
  const params = new URLSearchParams();
  if (context.from) params.set("from", context.from);
  if (context.ref) params.set("ref", context.ref);

  window.location.replace(
    "404.html" + (params.toString() ? "?" + params.toString() : ""),
  );
}

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

    const imgSrc = assassin.card_image || "assets/icons/logo.png";
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

  document.getElementById("loading-screen").style.display = "none";
  grid.style.display = "grid";

  // Deep link from search: /assassins.html#ezio scrolls to and highlights that card
  const card =
    location.hash &&
    document.querySelector(
      `[data-assassin="${CSS.escape(location.hash.slice(1))}"]`,
    );
  if (card) {
    setTimeout(() => {
      card.scrollIntoView({ block: "center" });
      card.style.outline = "2px solid var(--animus-blue)";
      card.style.outlineOffset = "4px";
    }, 400);
  }

  // Refresh hover logic bindings from script.js now that cards exist
  if (typeof rebindAssassinHovers === "function") {
    rebindAssassinHovers();
  }

  // Click 'all' so script.js runs the reveal transition (avoids the IntersectionObserver race)
  // This circumvents the IntersectionObserver race condition
  setTimeout(() => {
    const allFilterBtn = document.querySelector(
      '.filter-btn[data-filter="all"]',
    );
    if (allFilterBtn) {
      allFilterBtn.click();
    } else {
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
