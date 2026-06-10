const topics = [
  "Physics",
  "Biology",
  "Geology",
  "Mathematics",
  "Computer Science",
  "Engineering",
  "History",
  "Economics",
  "Game Theory",
  "Chemistry",
  "Climate Science",
  "Medicine/Health",
  "Music Theory",
  "Cryptography",
  "Materials Science",
  "Robotics",
  "Linguistics",
  "Architecture",
  "Probability"
];

const articles = [
  {
    id: "climate-feedbacks",
    title: "Climate Feedback Systems",
    topic: "Climate Science",
    difficulty: "Intermediate",
    words: 1650,
    prerequisites: ["Differential equations", "Energy balance", "Probability"],
    summary: "A metadata-driven slot for a user-provided article about feedback loops.",
    tags: ["modeling", "systems", "earth science"]
  },
  {
    id: "zero-knowledge",
    title: "Zero-Knowledge Proofs",
    topic: "Cryptography",
    difficulty: "Advanced",
    words: 2400,
    prerequisites: ["Discrete mathematics", "Algorithms", "Probability"],
    summary: "A placeholder for a technical explanation with proofs and embedded demos.",
    tags: ["security", "math", "computer science"]
  },
  {
    id: "cell-materials",
    title: "Cells and Smart Materials",
    topic: "Materials Science",
    difficulty: "Beginner",
    words: 980,
    prerequisites: ["Cell biology", "Chemical bonds"],
    summary: "A bridge article showing how metadata can connect biology and engineering.",
    tags: ["biology", "engineering", "medicine"]
  },
  {
    id: "game-theory-markets",
    title: "Game Theory in Market Design",
    topic: "Game Theory",
    difficulty: "Intermediate",
    words: 1450,
    prerequisites: ["Utility", "Equilibrium", "Microeconomics"],
    summary: "A user-content container for examples, diagrams, and references.",
    tags: ["economics", "strategy", "math"]
  },
  {
    id: "robot-motion",
    title: "Robot Motion Planning",
    topic: "Robotics",
    difficulty: "Advanced",
    words: 2100,
    prerequisites: ["Graph search", "Linear algebra", "Control systems"],
    summary: "An article template ready for simulations, figures, and code snippets.",
    tags: ["engineering", "computer science", "math"]
  },
  {
    id: "music-symmetry",
    title: "Symmetry in Music Theory",
    topic: "Music Theory",
    difficulty: "Beginner",
    words: 1120,
    prerequisites: ["Intervals", "Modular arithmetic"],
    summary: "A crossover example for math, history, and music analysis content.",
    tags: ["music", "mathematics", "history"]
  }
];

const storage = {
  saved: "knowledge-atlas-saved",
  complete: "knowledge-atlas-complete",
  theme: "knowledge-atlas-theme"
};

const state = {
  saved: readList(storage.saved),
  complete: readList(storage.complete),
  theme: localStorage.getItem(storage.theme) || "system"
};

const topicGrid = document.querySelector("#topic-grid");
const articleGrid = document.querySelector("#article-grid");
const relatedList = document.querySelector("#related-list");
const searchInput = document.querySelector("#site-search");
const difficultyFilter = document.querySelector("#difficulty-filter");
const themeToggle = document.querySelector(".theme-toggle");
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#primary-nav");
const year = document.querySelector("#year");
const markFeatured = document.querySelector("#mark-featured");
const saveFeatured = document.querySelector("#save-featured");
const copyLink = document.querySelector("#copy-link");
const newsletter = document.querySelector(".newsletter");

init();

function init() {
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  applyTheme();
  renderTopics();
  renderArticles();
  renderRelated();
  updateDashboard();
  bindEvents();
}

function bindEvents() {
  searchInput?.addEventListener("input", renderArticles);
  difficultyFilter?.addEventListener("change", renderArticles);

  themeToggle?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    state.theme = next;
    localStorage.setItem(storage.theme, next);
    applyTheme();
    updateDashboard();
  });

  navToggle?.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    document.body.classList.toggle("nav-open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav?.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });

  markFeatured?.addEventListener("click", () => {
    toggleItem(state.complete, articles[0].id);
    writeList(storage.complete, state.complete);
    updateDashboard();
    renderArticles();
  });

  saveFeatured?.addEventListener("click", () => {
    toggleItem(state.saved, articles[0].id);
    writeList(storage.saved, state.saved);
    updateDashboard();
    renderArticles();
  });

  copyLink?.addEventListener("click", async () => {
    const url = window.location.href.split("#")[0] + "#article-template";
    try {
      await navigator.clipboard.writeText(url);
      copyLink.textContent = "Copied";
      setTimeout(() => {
        copyLink.textContent = "Copy link";
      }, 1600);
    } catch {
      copyLink.textContent = "Copy failed";
    }
  });

  newsletter?.addEventListener("submit", event => {
    event.preventDefault();
    const note = newsletter.querySelector(".form-note");
    if (note) {
      note.textContent = "Signup captured as a placeholder. Connect your newsletter provider here.";
    }
  });
}

function renderTopics() {
  if (!topicGrid) return;

  topicGrid.innerHTML = topics
    .map(topic => {
      const count = articles.filter(article => article.topic === topic).length;
      const crossoverCount = articles.filter(article => article.tags.join(" ").includes(topic.toLowerCase())).length;
      return `
        <article class="topic-card">
          <span>${count} article slot${count === 1 ? "" : "s"} &middot; ${crossoverCount} crossover${crossoverCount === 1 ? "" : "s"}</span>
          <h3><a href="#library">${topic}</a></h3>
          <p>Landing page shell for article lists, prerequisites, learning paths, glossary terms, and topic FAQ.</p>
        </article>
      `;
    })
    .join("");
}

function renderArticles() {
  if (!articleGrid) return;

  const query = (searchInput?.value || "").trim().toLowerCase();
  const difficulty = difficultyFilter?.value || "all";
  const filtered = articles.filter(article => {
    const searchable = [
      article.title,
      article.topic,
      article.difficulty,
      article.summary,
      article.prerequisites.join(" "),
      article.tags.join(" ")
    ]
      .join(" ")
      .toLowerCase();

    const matchesQuery = !query || searchable.includes(query);
    const matchesDifficulty = difficulty === "all" || article.difficulty === difficulty;
    return matchesQuery && matchesDifficulty;
  });

  articleGrid.innerHTML = filtered.length
    ? filtered.map(renderArticleCard).join("")
    : `<p>No article metadata matches the current search and filter.</p>`;

  articleGrid.querySelectorAll("[data-save]").forEach(button => {
    button.addEventListener("click", () => {
      toggleItem(state.saved, button.dataset.save);
      writeList(storage.saved, state.saved);
      updateDashboard();
      renderArticles();
    });
  });

  articleGrid.querySelectorAll("[data-complete]").forEach(button => {
    button.addEventListener("click", () => {
      toggleItem(state.complete, button.dataset.complete);
      writeList(storage.complete, state.complete);
      updateDashboard();
      renderArticles();
    });
  });
}

function renderArticleCard(article) {
  const saved = state.saved.includes(article.id);
  const complete = state.complete.includes(article.id);
  const difficultyClass = article.difficulty === "Advanced" ? " advanced" : "";

  return `
    <article class="article-card">
      <span class="badge${difficultyClass}">${article.difficulty}</span>
      <div>
        <p class="meta-line">${article.topic} &middot; ${readTime(article.words)} min read</p>
        <h3><a href="#article-template">${article.title}</a></h3>
        <p>${article.summary}</p>
      </div>
      <p class="meta-line">Prerequisites: ${article.prerequisites.join(", ")}</p>
      <div class="card-actions">
        <button class="small-action" type="button" data-save="${article.id}" aria-pressed="${saved}">
          ${saved ? "Saved" : "Save"}
        </button>
        <button class="small-action" type="button" data-complete="${article.id}" aria-pressed="${complete}">
          ${complete ? "Complete" : "Mark complete"}
        </button>
      </div>
    </article>
  `;
}

function renderRelated() {
  if (!relatedList) return;

  const seed = articles[0];
  const related = articles
    .filter(article => article.id !== seed.id)
    .map(article => ({
      ...article,
      score: article.tags.filter(tag => seed.tags.includes(tag)).length
    }))
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, 4);

  relatedList.innerHTML = related
    .map(article => `<li><a href="#library">${article.title}</a></li>`)
    .join("");
}

function updateDashboard() {
  const completePercent = articles.length ? Math.round((state.complete.length / articles.length) * 100) : 0;
  setText("#saved-count", state.saved.length);
  setText("#progress-count", `${completePercent}%`);
  setText("#dashboard-saved", state.saved.length);
  setText("#dashboard-complete", state.complete.length);
  setText("#dashboard-theme", labelTheme());

  if (markFeatured) {
    markFeatured.textContent = state.complete.includes(articles[0].id)
      ? "Sample complete"
      : "Mark sample complete";
  }

  if (saveFeatured) {
    saveFeatured.textContent = state.saved.includes(articles[0].id)
      ? "Sample saved"
      : "Save sample article";
  }
}

function applyTheme() {
  if (state.theme === "system") {
    document.documentElement.removeAttribute("data-theme");
    return;
  }

  document.documentElement.dataset.theme = state.theme;
}

function labelTheme() {
  if (state.theme !== "system") return capitalize(state.theme);
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "System dark" : "System light";
}

function readTime(words) {
  return Math.max(1, Math.ceil(words / 220));
}

function readList(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeList(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function toggleItem(list, value) {
  const index = list.indexOf(value);
  if (index >= 0) {
    list.splice(index, 1);
  } else {
    list.push(value);
  }
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) {
    element.textContent = value;
  }
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
