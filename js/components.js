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
                <!-- Mobile / Toggled Hamburger -->
                <button id="menu-toggle" class="hamburger" aria-label="Toggle menu" aria-expanded="false">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <!-- Left Links -->
                <ul class="content nav-left">
                    <li><a href="index.html" class="home-link">Home</a></li>
                    <li><a href="Assassins.html">Assassins</a></li>
                </ul>

                <!-- Center Logo -->
                <div class="nav-center">
                    <a href="index.html">
                        <img id="logo" src="Media/logo.png" alt="logo">
                    </a>
                </div>

                <!-- Right Links -->
                <ul class="content nav-right">
                    <li class="dropdown">
                        <input type="checkbox" id="games-toggle">
                        <label for="games-toggle" class="dropdownto">Games</label>

                        <ul class="dropdown-menu">
                            <li><a href="era.html?era=the-desmond-saga">The Desmond Saga</a></li>
                            <li><a href="era.html?era=colonial-era">Colonial Era</a></li>
                            <li><a href="era.html?era=european-revolution-era">European Revolution Era</a></li>
                            <li><a href="era.html?era=ancient-trilogy">Ancient Trilogy</a></li>
                            <li><a href="era.html?era=modern-classic-return">Modern Classic Return</a></li>
                        </ul>
                    </li>
                    <li class="cta-nav-item">
                        <a href="index.html" class="btn-cta-gold">Join the Creed</a>
                    </li>
                </ul>

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
        // Match exact path or path + query string (like era.html?era=colonial-era)
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
        <footer class="main-footer">
            <div class="container">
                <p>© 2025 Assassin’s Creed Tribute. Reliving the memories of legends.</p>
                <p>
                    🧠 Brain + 💻 Keyboard =
                    <a href="https://github.com/Divyansh3105" target="_blank">Divyansh Garg</a>
                </p>
                <div class="footer-icons">
                    <a href="https://github.com/Divyansh3105" target="_blank" aria-label="GitHub"><i
                            class="bi bi-github"></i></a>
                    <a href="https://www.linkedin.com/in/divyanshgarg3105/" target="_blank" aria-label="LinkedIn"><i
                            class="bi bi-linkedin"></i></a>
                </div>
            </div>
        </footer>
        `;
  }
}
customElements.define("site-footer", SiteFooter);
