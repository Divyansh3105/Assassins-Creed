const listEl = document.getElementById("tl");
const erasEl = document.getElementById("tl-eras");
const sortEl = document.getElementById("tl-sort");
const statusEl = document.getElementById("tl-status");
let games = [];
let eraId = "all";
let sortBy = "story";

// "Ptolemaic Egypt — 49-43 BCE" -> { year: -49, label: "49 BCE" }
function storyYear(cardEra) {
  const m = cardEra.match(/(\d{1,4})(?:\s*[-–]\s*\d{1,4})?\s*(BCE|CE)?\s*$/);
  if (!m) return { year: Infinity, label: "—" };
  const bce = m[2] === "BCE";
  return { year: bce ? -m[1] : +m[1], label: `${m[1]} ${bce ? "BCE" : "CE"}` };
}

function releaseYear(g) {
  return +((g.info && g.info.release_date) || "").slice(-4) || Infinity;
}

function el(tag, cls, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
}

function chip(label, pressed, onClick) {
  const b = el("button", "dx-chip", label);
  b.type = "button";
  b.setAttribute("aria-pressed", String(pressed));
  b.addEventListener("click", onClick);
  return b;
}

function card(g, i) {
  const li = el("li", "tl-item");
  const head = el("button", "tl-head glass-panel");
  head.type = "button";
  head.setAttribute("aria-expanded", "false");
  const yearLabel = sortBy === "story" ? g.story.label : String(g.release);
  const chevron = el("i", "bi bi-chevron-down");
  chevron.setAttribute("aria-hidden", "true");
  head.append(el("span", "tl-year", yearLabel), el("h3", "", g.title), chevron);

  const body = el("div", "tl-body glass-panel");
  body.id = `tl-body-${i}`;
  head.setAttribute("aria-controls", body.id);
  if (g.banner_image) {
    const img = el("img");
    img.src = g.banner_image;
    img.alt = "";
    img.loading = "lazy";
    body.appendChild(img);
  }
  const text = el("div");
  const info = g.info || {};
  text.append(
    el("p", "", g.card_desc),
    el(
      "p",
      "tl-facts",
      [
        g.card_era,
        info.release_date && `Released ${info.release_date}`,
        info.platforms,
      ]
        .filter(Boolean)
        .join(" · "),
    ),
  );
  const link = el("a", "tl-link", "Open dossier →");
  link.href = `game.html?game=${encodeURIComponent(g.id)}`;
  text.appendChild(link);
  body.appendChild(text);

  head.addEventListener("click", () => {
    const open = li.classList.toggle("is-open");
    head.setAttribute("aria-expanded", String(open));
  });
  li.append(head, body);
  return li;
}

function render() {
  const shown = games
    .filter((g) => eraId === "all" || g.era_id === eraId)
    .sort((a, b) =>
      sortBy === "story" ? a.story.year - b.story.year : a.release - b.release,
    );
  listEl.replaceChildren(...shown.map(card));
  statusEl.textContent = `${shown.length} of ${games.length} games, ${
    sortBy === "story" ? "in story order" : "in release order"
  }.`;
}

sortEl.querySelectorAll("[data-sort]").forEach((b) =>
  b.addEventListener("click", () => {
    sortBy = b.dataset.sort;
    sortEl
      .querySelectorAll("[data-sort]")
      .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    render();
  }),
);

fetch("data/data.json")
  .then((r) => r.json())
  .then((data) => {
    games = Object.values(data.games).map((g) => ({
      ...g,
      story: storyYear(g.card_era),
      release: releaseYear(g),
    }));
    const options = [{ id: "all", title: "All eras" }, ...data.eras];
    options.forEach((o) =>
      erasEl.appendChild(
        chip(o.title, o.id === eraId, () => {
          eraId = o.id;
          erasEl
            .querySelectorAll(".dx-chip")
            .forEach((c) =>
              c.setAttribute("aria-pressed", String(c.textContent === o.title)),
            );
          render();
        }),
      ),
    );
    render();
  })
  .catch(() => {
    statusEl.textContent =
      "The timeline could not be loaded. Please try again.";
  });
