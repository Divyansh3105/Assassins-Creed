const TYPES = ["Game", "Assassin", "Character", "Era"];
const qInput = document.getElementById("dx-q");
const filtersEl = document.getElementById("dx-filters");
const statusEl = document.getElementById("dx-status");
const resultsEl = document.getElementById("dx-results");
let index = [];
let activeType = "All";

const plain = (html) =>
  new DOMParser().parseFromString(html || "", "text/html").body.textContent;

function buildIndex(data) {
  const entries = [];
  const seen = new Set();

  data.eras.forEach((e) =>
    entries.push({
      type: "Era",
      title: e.title,
      sub: e.subtitle,
      text: plain(e.about_html),
      url: `era.html?era=${encodeURIComponent(e.id)}`,
      img: e.banner_image,
    }),
  );

  data.assassins.forEach((a) => {
    seen.add(a.card_title.toLowerCase());
    entries.push({
      type: "Assassin",
      title: a.card_title,
      sub: a.card_era,
      text: [a.card_desc, ...(a.card_stats || []).map((s) => s.text)].join(" "),
      url: `assassins.html#${encodeURIComponent(a.id)}`,
      img: a.card_image,
    });
  });

  Object.values(data.games).forEach((g) => {
    const info = g.info || {};
    entries.push({
      type: "Game",
      title: g.title,
      sub: g.card_era,
      text: [g.card_desc, info.setting, info.platforms, g.story_subtitle]
        .filter(Boolean)
        .join(" "),
      url: `game.html?game=${encodeURIComponent(g.id)}`,
      img: g.banner_image,
    });
    (g.characters || []).forEach((c) => {
      const key = c.name.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      entries.push({
        type: "Character",
        title: c.name,
        sub: g.title,
        text: "",
        url: `game.html?game=${encodeURIComponent(g.id)}`,
        img: c.image,
      });
    });
  });
  return entries;
}

function search(query) {
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  return index
    .map((e) => {
      const t = e.title.toLowerCase();
      const s = (e.sub || "").toLowerCase();
      const x = e.text.toLowerCase();
      let score = 0;
      for (const tok of tokens) {
        if (t.includes(tok)) score += t.startsWith(tok) ? 5 : 3;
        else if (s.includes(tok)) score += 2;
        else if (x.includes(tok)) score += 1;
        else return null; // every word must match somewhere
      }
      return { e, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.e);
}

// Wrap matches in <mark> using text nodes only (no innerHTML)
function highlight(el, text, tokens) {
  if (!tokens.length) return void (el.textContent = text);
  const re = new RegExp(
    `(${tokens.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "gi",
  );
  text.split(re).forEach((part, i) => {
    if (i % 2) {
      const m = document.createElement("mark");
      m.textContent = part;
      el.appendChild(m);
    } else if (part) {
      el.appendChild(document.createTextNode(part));
    }
  });
}

function snippet(text, tokens) {
  const clean = text.replace(/\s+/g, " ").trim();
  const at = tokens
    .map((t) => clean.toLowerCase().indexOf(t))
    .find((i) => i >= 0);
  const start = Math.max(0, (at ?? 0) - 40);
  const out = clean.slice(start, start + 140);
  return (start ? "…" : "") + out + (start + 140 < clean.length ? "…" : "");
}

function renderFilters(results) {
  filtersEl.replaceChildren();
  ["All", ...TYPES].forEach((type) => {
    const n =
      type === "All"
        ? results.length
        : results.filter((r) => r.type === type).length;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "dx-chip";
    b.setAttribute("aria-pressed", String(type === activeType));
    b.append(type);
    const c = document.createElement("span");
    c.className = "dx-count";
    c.textContent = n;
    b.append(c);
    b.addEventListener("click", () => {
      activeType = type;
      run();
    });
    filtersEl.appendChild(b);
  });
}

function render(results, tokens) {
  resultsEl.replaceChildren();
  results.slice(0, 60).forEach((r) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.className = "dx-result glass-panel";
    a.href = r.url;
    if (r.img) {
      const img = document.createElement("img");
      img.className = "dx-thumb";
      img.src = r.img;
      img.alt = "";
      img.loading = "lazy";
      a.appendChild(img);
    }
    const box = document.createElement("div");
    const h = document.createElement("h3");
    const tag = document.createElement("span");
    tag.className = "dx-tag";
    tag.textContent = r.type;
    h.appendChild(tag);
    const name = document.createElement("span");
    highlight(name, r.title, tokens);
    h.appendChild(name);
    const p = document.createElement("p");
    highlight(
      p,
      [r.sub, snippet(r.text, tokens)].filter(Boolean).join(" — "),
      tokens,
    );
    box.append(h, p);
    a.appendChild(box);
    li.appendChild(a);
    resultsEl.appendChild(li);
  });
}

function run() {
  const query = qInput.value.trim();
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
  const all = search(query);
  const shown =
    activeType === "All" ? all : all.filter((r) => r.type === activeType);
  renderFilters(all);
  render(shown, tokens);
  statusEl.textContent = !query
    ? `${index.length} entries in the archives.`
    : shown.length
      ? `${shown.length} result${shown.length === 1 ? "" : "s"} for “${query}”.`
      : "";
  if (query && !shown.length) {
    const li = document.createElement("li");
    li.className = "dx-empty";
    li.textContent = `Nothing found for “${query}”. Try a character, a game or a place.`;
    resultsEl.appendChild(li);
  }
  const url = new URL(location.href);
  query ? url.searchParams.set("q", query) : url.searchParams.delete("q");
  history.replaceState(null, "", url);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "/" && document.activeElement !== qInput) {
    e.preventDefault();
    qInput.focus();
  }
});
qInput.addEventListener("input", () => {
  activeType = "All";
  run();
});

fetch("data/data.json")
  .then((r) => r.json())
  .then((data) => {
    index = buildIndex(data);
    qInput.value = new URLSearchParams(location.search).get("q") || "";
    run();
  })
  .catch(() => {
    statusEl.textContent =
      "The archives could not be loaded. Please try again.";
  });
