// js/components.js

class LoadingScreen extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <div id="loading-screen">
            <div class="loading-content">
                <img src="Media/logo.png" alt="Assassin's Creed Logo" class="loading-logo">
                <div class="loading-spinner"></div>
                <p class="loading-text">Synchronizing...</p>
            </div>
        </div>
        `;

    // Self-encapsulate the loader fadeout logic to prevent stalling
    const removeLoader = () => {
      setTimeout(() => {
        const ls = this.querySelector("#loading-screen");
        if (ls) {
          ls.classList.add("fade-out");
          document.body.classList.add("loaded");
          setTimeout(() => {
            ls.style.display = "none";
          }, 500);
        } else {
          document.body.classList.add("loaded"); // Failsafe
        }
      }, 500);
    };

    if (document.readyState === "complete") {
      removeLoader();
    } else {
      window.addEventListener("load", removeLoader);
    }
  }
}
customElements.define("loading-screen", LoadingScreen);

class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <header class="sticky-header animus-glass">
            <nav class="desktop-nav">
                <!-- Mobile Hamburger -->
                <button id="menu-toggle" class="hamburger" aria-label="Toggle menu" aria-expanded="false">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <!-- Left: Logo + Brand -->
                <div class="nav-brand">
                    <a href="index.html" class="nav-brand-link">
                        <img id="logo" src="Media/logo.png" alt="Assassin's Creed Logo">
                        <span class="nav-brand-text">Assassin's<br>Creed</span>
                    </a>
                </div>

                <!-- Center: All Nav Links -->
                <ul class="content nav-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="Assassins.html">Assassins</a></li>
                    <li><a href="isu.html">Isu Lore</a></li>
                    <li><a href="factions.html">Factions</a></li>
                    <li><a href="quiz_hub.html">Quiz</a></li>
                    <li class="dropdown">
                        <input type="checkbox" id="games-toggle">
                        <label for="games-toggle" class="dropdownto">Games ▾</label>
                        <ul class="dropdown-menu">
                            <li><a href="era.html?era=the-desmond-saga">The Desmond Saga</a></li>
                            <li><a href="era.html?era=colonial-era">Colonial Era</a></li>
                            <li><a href="era.html?era=european-revolution-era">European Revolution Era</a></li>
                            <li><a href="era.html?era=ancient-trilogy">Ancient Trilogy</a></li>
                            <li><a href="era.html?era=modern-classic-return">Modern Classic Return</a></li>
                        </ul>
                    </li>
                </ul>

                <!-- Right: CTA -->
                <div class="nav-cta">
                    <a href="index.html" class="btn-cta-animus">Join the Creed</a>
                </div>

                <div class="overlay"></div>
            </nav>
        </header>
        `;

    // Accessibility: Set aria-current="page" on the active navigation link
    setTimeout(() => {
      const currentPath =
        window.location.pathname.split("/").pop() || "index.html";
      const currentSearch = window.location.search;

      const navLinks = this.querySelectorAll("nav a");
      navLinks.forEach((link) => {
        const linkHref = link.getAttribute("href");
        if (
          linkHref === currentPath ||
          linkHref === currentPath + currentSearch
        ) {
          link.setAttribute("aria-current", "page");
        }
      });
    }, 0);
  }
}
customElements.define("site-header", SiteHeader);

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
        <footer class="main-footer animus-footer">
            <div class="footer-grid-overlay"></div>
            <div class="container footer-content">
                <div class="footer-status-panel">
                    <span class="status-dot online"></span>
                    <span class="status-text">ANIMUS v4.5 // SYSTEM ONLINE</span>
                </div>

                <div class="footer-main-text">
                    <p class="crypto-text">© 2025 ABSTERGO ENTERTAINMENT. ALL RIGHTS RESERVED.</p>
                    <p class="quote-text">"We work in the dark to serve the light."</p>
                </div>

                <div class="footer-credits">
                    <p>
                        <span class="muted">Operator //</span>
                        <a href="https://github.com/Divyansh3105" target="_blank" class="glow-link">Divyansh Garg</a>
                    </p>
                </div>

                <div class="footer-icons">
                    <a href="https://github.com/Divyansh3105" target="_blank" aria-label="GitHub">
                        <i class="bi bi-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/divyanshgarg3105/" target="_blank" aria-label="LinkedIn">
                        <i class="bi bi-linkedin"></i>
                    </a>
                </div>
            </div>
        </footer>
        `;
  }
}
customElements.define("site-footer", SiteFooter);
