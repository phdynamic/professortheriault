# PHIL 1301 Course Shell & Navigation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Eleventy-based course shell for PHIL 1301 with shared layouts, sidebar navigation, responsive design, placeholder content pages, and GitHub Actions deployment.

**Architecture:** Eleventy static site generator with Nunjucks templates. A `course.json` data file drives the sidebar navigation. Three layout templates (base, unit, page) provide consistent structure. A single CSS file and small JS file handle styling and interactivity. The homepage `index.html` is passed through alongside the course pages into a unified `_site/` output.

**Tech Stack:** Eleventy 3.x, Nunjucks, CSS3, vanilla JS, GitHub Actions

**Important:** Node.js is installed but not in the default bash PATH. All commands must be prefixed with `export PATH="$PATH:/c/Program Files/nodejs" &&` or run from the project directory after setting PATH.

---

## File Structure

| File | Responsibility |
|------|---------------|
| `package.json` | Dependencies and build scripts |
| `.eleventy.js` | Eleventy config: input/output, passthrough, collections, ignores |
| `.gitignore` | Update to ignore `_site/`, `node_modules/` |
| `phil1301/_data/course.json` | Full navigation tree: modules, pages, ordering |
| `phil1301/_includes/layouts/base.njk` | HTML shell: head, top nav, sidebar, content block, footer |
| `phil1301/_includes/layouts/page.njk` | Extends base: content reading layout with prev/next nav |
| `phil1301/_includes/layouts/unit.njk` | Extends base: unit overview with table of contents |
| `phil1301/css/styles.css` | All course styles (nav, sidebar, content, cards, responsive) |
| `phil1301/js/nav.js` | Sidebar accordion, mobile hamburger toggle, backdrop |
| `phil1301/index.njk` | Course landing page with hero and module cards |
| `phil1301/start-here/index.njk` | Start Here placeholder overview |
| `phil1301/unit-1-socrates/index.njk` | Unit 1 placeholder overview |
| `phil1301/unit-1-socrates/socrates-life.njk` | Unit 1 sample content page (tests prev/next) |
| `phil1301/unit-2-descartes/index.njk` | Unit 2 placeholder overview |
| `phil1301/unit-3-hume/index.njk` | Unit 3 placeholder overview |
| `phil1301/unit-4-hegel/index.njk` | Unit 4 placeholder overview |
| `phil1301/unit-5-marx/index.njk` | Unit 5 placeholder overview |
| `phil1301/unit-6-sartre/index.njk` | Unit 6 placeholder overview |
| `phil1301/final-exam/index.njk` | Final Exam placeholder |
| `.github/workflows/deploy.yml` | GitHub Actions: build + deploy to GitHub Pages |
| `index.html` | Update Philosophy card from div to link |

---

### Task 1: Project initialization

**Files:**
- Create: `package.json`
- Create: `.eleventy.js`
- Modify: `.gitignore`

- [ ] **Step 1: Create `package.json` in the project root**

```json
{
  "name": "professortheriault-website",
  "version": "1.0.0",
  "description": "Professor Theriault's educational website",
  "scripts": {
    "dev": "npx @11ty/eleventy --serve",
    "build": "npx @11ty/eleventy"
  },
  "dependencies": {
    "@11ty/eleventy": "^3.0.0"
  }
}
```

- [ ] **Step 2: Create `.eleventy.js` in the project root**

```js
module.exports = function (eleventyConfig) {
  // Passthrough copy — files copied as-is to output
  eleventyConfig.addPassthroughCopy("phil1301/css");
  eleventyConfig.addPassthroughCopy("phil1301/js");
  eleventyConfig.addPassthroughCopy("phil1301/assets");
  eleventyConfig.addPassthroughCopy("index.html");

  // Ignore non-site files
  eleventyConfig.ignores.add("docs/**");
  eleventyConfig.ignores.add(".claude/**");
  eleventyConfig.ignores.add("node_modules/**");
  eleventyConfig.ignores.add("sand-box-number-1-phil-1301-export.imscc");
  eleventyConfig.ignores.add(".github/**");

  // Collections: one per unit, ordered by position
  eleventyConfig.addCollection("starthere", function (collectionApi) {
    return collectionApi.getFilteredByTag("starthere").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("unit1", function (collectionApi) {
    return collectionApi.getFilteredByTag("unit1").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("unit2", function (collectionApi) {
    return collectionApi.getFilteredByTag("unit2").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("unit3", function (collectionApi) {
    return collectionApi.getFilteredByTag("unit3").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("unit4", function (collectionApi) {
    return collectionApi.getFilteredByTag("unit4").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("unit5", function (collectionApi) {
    return collectionApi.getFilteredByTag("unit5").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("unit6", function (collectionApi) {
    return collectionApi.getFilteredByTag("unit6").sort((a, b) => a.data.position - b.data.position);
  });
  eleventyConfig.addCollection("finalexam", function (collectionApi) {
    return collectionApi.getFilteredByTag("finalexam").sort((a, b) => a.data.position - b.data.position);
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "phil1301/_includes",
      data: "phil1301/_data",
    },
    templateFormats: ["njk", "html", "md"],
    htmlTemplateEngine: "njk",
  };
};
```

- [ ] **Step 3: Update `.gitignore` to add `_site/` and `node_modules/`**

Add these lines to the existing `.gitignore`:

```
_site/
node_modules/
```

- [ ] **Step 4: Install dependencies**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && npm install
```

Expected: `node_modules/` created, `package-lock.json` generated, `@11ty/eleventy` installed.

- [ ] **Step 5: Verify Eleventy runs (empty build)**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && npx @11ty/eleventy
```

Expected: Build succeeds. `_site/` directory created. `_site/index.html` contains the homepage.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json .eleventy.js .gitignore
git commit -m "feat: initialize Eleventy project with config and dependencies"
```

---

### Task 2: Course navigation data

**Files:**
- Create: `phil1301/_data/course.json`

- [ ] **Step 1: Create the `phil1301/_data/` directory and `course.json`**

```json
{
  "title": "PHIL 1301: Introduction to Philosophy",
  "shortTitle": "PHIL 1301",
  "modules": [
    {
      "slug": "start-here",
      "title": "Start Here",
      "icon": "&#128218;",
      "description": "Course orientation, instructor introduction, and getting started.",
      "pages": [
        { "slug": "index", "title": "Start Here: Overview" }
      ]
    },
    {
      "slug": "unit-1-socrates",
      "title": "Unit 1: Socrates and Plato",
      "icon": "&#127963;&#65039;",
      "description": "Explore the life and philosophy of Socrates and Plato through the Euthyphro, Apology, and Crito.",
      "pages": [
        { "slug": "index", "title": "Unit 1: Overview" },
        { "slug": "socrates-life", "title": "Socrates' Life and Context" }
      ]
    },
    {
      "slug": "unit-2-descartes",
      "title": "Unit 2: Rene Descartes",
      "icon": "&#129504;",
      "description": "Examine Descartes' method of doubt and the foundations of modern philosophy.",
      "pages": [
        { "slug": "index", "title": "Unit 2: Overview" }
      ]
    },
    {
      "slug": "unit-3-hume",
      "title": "Unit 3: David Hume",
      "icon": "&#128269;",
      "description": "Investigate Hume's empiricism, skepticism about causation, and the limits of reason.",
      "pages": [
        { "slug": "index", "title": "Unit 3: Overview" }
      ]
    },
    {
      "slug": "unit-4-hegel",
      "title": "Unit 4: G. W. F. Hegel",
      "icon": "&#9883;&#65039;",
      "description": "Understand Hegel's dialectic, philosophy of history, and vision of freedom.",
      "pages": [
        { "slug": "index", "title": "Unit 4: Overview" }
      ]
    },
    {
      "slug": "unit-5-marx",
      "title": "Unit 5: Karl Marx",
      "icon": "&#9878;&#65039;",
      "description": "Analyze Marx's historical materialism, class struggle, and critique of capitalism.",
      "pages": [
        { "slug": "index", "title": "Unit 5: Overview" }
      ]
    },
    {
      "slug": "unit-6-sartre",
      "title": "Unit 6: Jean-Paul Sartre",
      "icon": "&#128172;",
      "description": "Explore Sartre's existentialism, radical freedom, and ethics of responsibility.",
      "pages": [
        { "slug": "index", "title": "Unit 6: Overview" }
      ]
    },
    {
      "slug": "final-exam",
      "title": "Final Exam",
      "icon": "&#128221;",
      "description": "Comprehensive final exam covering all course units.",
      "pages": [
        { "slug": "index", "title": "Final Exam" }
      ]
    }
  ]
}
```

- [ ] **Step 2: Commit**

```bash
git add phil1301/_data/course.json
git commit -m "feat: add course navigation data with module structure"
```

---

### Task 3: Base layout template

**Files:**
- Create: `phil1301/_includes/layouts/base.njk`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p "phil1301/_includes/layouts"
```

- [ ] **Step 2: Create `base.njk`**

```njk
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ title }} | {{ course.title }}</title>
  <meta name="description" content="{{ description or course.title }}">
  <link rel="stylesheet" href="/phil1301/css/styles.css">
</head>
<body>

  <nav class="top-nav">
    <a href="/" class="top-nav__home">Professor Theriault</a>
    <span class="top-nav__title">{{ course.shortTitle }}</span>
    <button class="top-nav__hamburger" aria-label="Toggle navigation" aria-expanded="false">
      <span></span>
      <span></span>
      <span></span>
    </button>
  </nav>

  <div class="layout">
    <aside class="sidebar" id="sidebar">
      <nav class="sidebar__nav" aria-label="Course navigation">
        {% for mod in course.modules %}
        <div class="sidebar__module{% if module == mod.slug %} sidebar__module--active{% endif %}">
          <button class="sidebar__toggle" aria-expanded="{% if module == mod.slug %}true{% else %}false{% endif %}">
            <span class="sidebar__icon">{{ mod.icon | safe }}</span>
            {{ mod.title }}
          </button>
          <ul class="sidebar__pages">
            {% for pg in mod.pages %}
            <li>
              <a href="/phil1301/{{ mod.slug }}/{% if pg.slug != 'index' %}{{ pg.slug }}/{% endif %}"
                 class="sidebar__link{% if page.url == '/phil1301/' + mod.slug + '/' and pg.slug == 'index' %} sidebar__link--current{% elif page.url == '/phil1301/' + mod.slug + '/' + pg.slug + '/' %} sidebar__link--current{% endif %}">
                {{ pg.title }}
              </a>
            </li>
            {% endfor %}
          </ul>
        </div>
        {% endfor %}
      </nav>
    </aside>

    <div class="sidebar-backdrop" id="sidebar-backdrop"></div>

    <main class="content">
      <nav class="breadcrumbs" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span class="breadcrumbs__sep">&rsaquo;</span>
        <a href="/phil1301/">PHIL 1301</a>
        {% if module %}
        <span class="breadcrumbs__sep">&rsaquo;</span>
        {% for mod in course.modules %}
          {% if mod.slug == module %}
          <a href="/phil1301/{{ mod.slug }}/">{{ mod.title }}</a>
          {% endif %}
        {% endfor %}
        {% endif %}
        {% if breadcrumbTitle %}
        <span class="breadcrumbs__sep">&rsaquo;</span>
        <span class="breadcrumbs__current">{{ breadcrumbTitle }}</span>
        {% endif %}
      </nav>

      {{ content | safe }}
    </main>
  </div>

  <footer class="footer">
    <p>&copy; 2026 Professor Theriault. All rights reserved.</p>
  </footer>

  <script src="/phil1301/js/nav.js"></script>
</body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add phil1301/_includes/layouts/base.njk
git commit -m "feat: add base layout template with nav, sidebar, breadcrumbs, footer"
```

---

### Task 4: Course styles

**Files:**
- Create: `phil1301/css/styles.css`

- [ ] **Step 1: Create `phil1301/css/` directory and `styles.css`**

```css
/* === Reset === */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  background-color: #f5f7fa;
  line-height: 1.6;
}

a {
  color: #0ea5e9;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* === Top Nav === */
.top-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #1a2332;
  color: #f0f4f8;
  padding: 0 1.5rem;
  height: 56px;
}

.top-nav__home {
  color: #f0f4f8;
  font-weight: 700;
  font-size: 1rem;
  text-decoration: none;
}

.top-nav__home:hover {
  color: #0ea5e9;
  text-decoration: none;
}

.top-nav__title {
  font-size: 0.9rem;
  opacity: 0.85;
}

.top-nav__hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
}

.top-nav__hamburger span {
  display: block;
  width: 22px;
  height: 2px;
  background-color: #f0f4f8;
  border-radius: 1px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}

/* === Layout === */
.layout {
  display: flex;
  margin-top: 56px;
  min-height: calc(100vh - 56px);
}

/* === Sidebar === */
.sidebar {
  width: 280px;
  min-width: 280px;
  background-color: #f0f4f8;
  border-right: 1px solid #e0e0e0;
  padding: 1rem 0;
  overflow-y: auto;
  height: calc(100vh - 56px);
  position: sticky;
  top: 56px;
}

.sidebar__module {
  border-bottom: 1px solid #e0e0e0;
}

.sidebar__toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a2332;
  text-align: left;
  transition: background-color 0.2s ease;
}

.sidebar__toggle:hover {
  background-color: #e2e8f0;
}

.sidebar__icon {
  font-size: 1.1rem;
  flex-shrink: 0;
}

.sidebar__pages {
  list-style: none;
  display: none;
  padding-bottom: 0.5rem;
}

.sidebar__module--active .sidebar__pages {
  display: block;
}

.sidebar__link {
  display: block;
  padding: 0.4rem 1rem 0.4rem 2.5rem;
  font-size: 0.85rem;
  color: #555;
  text-decoration: none;
  border-left: 3px solid transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.sidebar__link:hover {
  background-color: #e2e8f0;
  text-decoration: none;
}

.sidebar__link--current {
  border-left-color: #0ea5e9;
  color: #1a2332;
  font-weight: 600;
  background-color: #e2e8f0;
}

.sidebar-backdrop {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 49;
}

/* === Content === */
.content {
  flex: 1;
  padding: 1.5rem 2rem 3rem;
  max-width: 900px;
}

/* === Breadcrumbs === */
.breadcrumbs {
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

.breadcrumbs a {
  color: #0ea5e9;
  text-decoration: none;
}

.breadcrumbs a:hover {
  text-decoration: underline;
}

.breadcrumbs__sep {
  color: #999;
  margin: 0 0.15rem;
}

.breadcrumbs__current {
  color: #333;
  font-weight: 500;
}

/* === Content Typography === */
.content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1a2332;
  margin-bottom: 1rem;
}

.content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a2332;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.content h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a2332;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.content p {
  margin-bottom: 1rem;
  line-height: 1.8;
}

.content img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  display: block;
}

.content blockquote {
  border-left: 4px solid #0ea5e9;
  background-color: #f0f4f8;
  padding: 1rem 1.5rem;
  margin: 1rem 0;
  border-radius: 0 8px 8px 0;
  font-style: italic;
  color: #555;
}

.content ul, .content ol {
  margin: 0.5rem 0 1rem 1.5rem;
}

.content li {
  margin-bottom: 0.35rem;
  line-height: 1.7;
}

/* === Reading Content Area === */
.reading-content {
  max-width: 750px;
}

/* === Prev/Next Navigation === */
.page-nav {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
}

.page-nav__link {
  display: flex;
  flex-direction: column;
  padding: 0.75rem 1.25rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  text-decoration: none;
  color: #333;
  transition: border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 48%;
}

.page-nav__link:hover {
  border-color: #0ea5e9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  text-decoration: none;
}

.page-nav__link:focus-visible {
  outline: 3px solid #0ea5e9;
  outline-offset: 2px;
}

.page-nav__label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: #666;
  margin-bottom: 0.25rem;
}

.page-nav__title {
  font-weight: 600;
  color: #1a2332;
}

.page-nav__link--next {
  text-align: right;
  margin-left: auto;
}

/* === Unit Overview === */
.unit-overview__toc {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.unit-overview__toc li {
  margin: 0;
}

.unit-overview__toc a {
  display: block;
  padding: 0.75rem 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  color: #1a2332;
  font-weight: 500;
  transition: border-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.unit-overview__toc a:hover {
  border-color: #0ea5e9;
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-decoration: none;
}

.unit-overview__begin {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background-color: #0369a1;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.unit-overview__begin:hover {
  background-color: #0ea5e9;
  transform: translateY(-2px);
  text-decoration: none;
  color: #fff;
}

/* === Course Landing Page === */
.course-hero {
  text-align: center;
  padding: 2rem 0 2.5rem;
}

.course-hero h1 {
  font-size: 2.2rem;
  color: #1a2332;
  margin-bottom: 0.5rem;
}

.course-hero .subtitle {
  font-size: 1.1rem;
  color: #666;
  font-style: italic;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 2rem;
}

.module-card {
  display: block;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  background: #fff;
  padding: 1.5rem;
  text-align: center;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}

.module-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #0ea5e9;
  text-decoration: none;
}

.module-card:focus-visible {
  outline: 3px solid #0ea5e9;
  outline-offset: 2px;
}

.module-card__icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 0.75rem;
}

.module-card__title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1a2332;
  margin-bottom: 0.5rem;
}

.module-card__desc {
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
}

/* === Footer === */
.footer {
  text-align: center;
  padding: 2rem 1.5rem;
  background-color: #1a2332;
  color: #f0f4f8;
  font-size: 0.875rem;
  opacity: 0.9;
}

.footer a {
  color: #0ea5e9;
}

.footer a:hover {
  text-decoration: underline;
}

/* === Responsive === */
@media (max-width: 899px) {
  .top-nav__hamburger {
    display: flex;
  }

  .sidebar {
    position: fixed;
    top: 56px;
    left: 0;
    bottom: 0;
    z-index: 50;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }

  .sidebar--open {
    transform: translateX(0);
  }

  .sidebar-backdrop--visible {
    display: block;
  }

  .content {
    padding: 1rem 1.25rem 2rem;
  }

  .module-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .page-nav {
    flex-direction: column;
  }

  .page-nav__link {
    max-width: 100%;
  }

  .page-nav__link--next {
    text-align: left;
  }
}

@media (max-width: 599px) {
  .module-grid {
    grid-template-columns: 1fr;
  }

  .course-hero h1 {
    font-size: 1.6rem;
  }

  .content h1 {
    font-size: 1.6rem;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add phil1301/css/styles.css
git commit -m "feat: add course stylesheet with nav, sidebar, content, and responsive styles"
```

---

### Task 5: Navigation JavaScript

**Files:**
- Create: `phil1301/js/nav.js`

- [ ] **Step 1: Create `phil1301/js/` directory and `nav.js`**

```js
(function () {
  // Sidebar accordion toggles
  var toggles = document.querySelectorAll(".sidebar__toggle");
  toggles.forEach(function (toggle) {
    toggle.addEventListener("click", function () {
      var module = this.closest(".sidebar__module");
      var isActive = module.classList.contains("sidebar__module--active");

      // Close all modules
      document.querySelectorAll(".sidebar__module--active").forEach(function (m) {
        m.classList.remove("sidebar__module--active");
        m.querySelector(".sidebar__toggle").setAttribute("aria-expanded", "false");
      });

      // Open clicked module (if it wasn't already open)
      if (!isActive) {
        module.classList.add("sidebar__module--active");
        this.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Mobile hamburger toggle
  var hamburger = document.querySelector(".top-nav__hamburger");
  var sidebar = document.getElementById("sidebar");
  var backdrop = document.getElementById("sidebar-backdrop");

  function openSidebar() {
    sidebar.classList.add("sidebar--open");
    backdrop.classList.add("sidebar-backdrop--visible");
    hamburger.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    sidebar.classList.remove("sidebar--open");
    backdrop.classList.remove("sidebar-backdrop--visible");
    hamburger.setAttribute("aria-expanded", "false");
  }

  if (hamburger) {
    hamburger.addEventListener("click", function () {
      var isOpen = sidebar.classList.contains("sidebar--open");
      if (isOpen) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
  }

  if (backdrop) {
    backdrop.addEventListener("click", closeSidebar);
  }
})();
```

- [ ] **Step 2: Commit**

```bash
git add phil1301/js/nav.js
git commit -m "feat: add sidebar accordion and mobile hamburger navigation JS"
```

---

### Task 6: Content page layout template

**Files:**
- Create: `phil1301/_includes/layouts/page.njk`

- [ ] **Step 1: Create `page.njk`**

```njk
---
layout: layouts/base.njk
---

<h1>{{ title }}</h1>

<div class="reading-content">
  {{ content | safe }}
</div>

{% set collectionName = tags[0] %}
{% set pages = collections[collectionName] %}

{% if pages %}
  {% set currentIndex = -1 %}
  {% for pg in pages %}
    {% if pg.url == page.url %}
      {% set currentIndex = loop.index0 %}
    {% endif %}
  {% endfor %}

  <nav class="page-nav" aria-label="Page navigation">
    {% if currentIndex > 0 %}
      <a href="{{ pages[currentIndex - 1].url }}" class="page-nav__link page-nav__link--prev">
        <span class="page-nav__label">&larr; Previous</span>
        <span class="page-nav__title">{{ pages[currentIndex - 1].data.title }}</span>
      </a>
    {% endif %}

    {% if currentIndex < pages.length - 1 %}
      <a href="{{ pages[currentIndex + 1].url }}" class="page-nav__link page-nav__link--next">
        <span class="page-nav__label">Next &rarr;</span>
        <span class="page-nav__title">{{ pages[currentIndex + 1].data.title }}</span>
      </a>
    {% endif %}
  </nav>
{% endif %}
```

- [ ] **Step 2: Commit**

```bash
git add phil1301/_includes/layouts/page.njk
git commit -m "feat: add content page layout with prev/next navigation"
```

---

### Task 7: Unit overview layout template

**Files:**
- Create: `phil1301/_includes/layouts/unit.njk`

- [ ] **Step 1: Create `unit.njk`**

```njk
---
layout: layouts/base.njk
---

<h1>{{ title }}</h1>

<div class="reading-content">
  {{ content | safe }}
</div>

{% set collectionName = tags[0] %}
{% set pages = collections[collectionName] %}

{% if pages and pages.length > 1 %}
  <h2>In This Unit</h2>
  <ul class="unit-overview__toc">
    {% for pg in pages %}
      {% if pg.url != page.url %}
      <li>
        <a href="{{ pg.url }}">{{ pg.data.title }}</a>
      </li>
      {% endif %}
    {% endfor %}
  </ul>

  <a href="{{ pages[1].url }}" class="unit-overview__begin">Begin Unit &rarr;</a>
{% endif %}
```

- [ ] **Step 2: Commit**

```bash
git add phil1301/_includes/layouts/unit.njk
git commit -m "feat: add unit overview layout with table of contents and begin button"
```

---

### Task 8: Course landing page

**Files:**
- Create: `phil1301/index.njk`

- [ ] **Step 1: Create `phil1301/index.njk`**

```njk
---
layout: layouts/base.njk
title: "Introduction to Philosophy"
description: "PHIL 1301: Introduction to Philosophy — Course home page"
---

<div class="course-hero">
  <h1>Introduction to Philosophy</h1>
  <p class="subtitle">PHIL 1301 — Explore the ideas that shaped human thought</p>
</div>

<div class="module-grid">
  {% for mod in course.modules %}
  <a href="/phil1301/{{ mod.slug }}/" class="module-card">
    <span class="module-card__icon">{{ mod.icon | safe }}</span>
    <span class="module-card__title">{{ mod.title }}</span>
    <span class="module-card__desc">{{ mod.description }}</span>
  </a>
  {% endfor %}
</div>
```

- [ ] **Step 2: Verify build**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && npx @11ty/eleventy
```

Expected: Build succeeds. `_site/phil1301/index.html` is generated with the course landing page.

- [ ] **Step 3: Commit**

```bash
git add phil1301/index.njk
git commit -m "feat: add course landing page with module card grid"
```

---

### Task 9: Placeholder pages for all units

**Files:**
- Create: `phil1301/start-here/index.njk`
- Create: `phil1301/unit-1-socrates/index.njk`
- Create: `phil1301/unit-1-socrates/socrates-life.njk`
- Create: `phil1301/unit-2-descartes/index.njk`
- Create: `phil1301/unit-3-hume/index.njk`
- Create: `phil1301/unit-4-hegel/index.njk`
- Create: `phil1301/unit-5-marx/index.njk`
- Create: `phil1301/unit-6-sartre/index.njk`
- Create: `phil1301/final-exam/index.njk`

- [ ] **Step 1: Create `phil1301/start-here/index.njk`**

```njk
---
layout: layouts/unit.njk
title: "Start Here"
module: "start-here"
position: 1
tags: starthere
---

<p>Welcome to PHIL 1301: Introduction to Philosophy. This section will guide you through the course orientation, introduce your instructor, and help you get started.</p>

<p><em>Content coming soon.</em></p>
```

- [ ] **Step 2: Create `phil1301/unit-1-socrates/index.njk`**

```njk
---
layout: layouts/unit.njk
title: "Unit 1: Socrates and Plato"
module: "unit-1-socrates"
position: 1
tags: unit1
---

<p>In this unit, we explore the life and philosophy of Socrates and Plato through three of Plato's most important dialogues: the Euthyphro, the Apology, and the Crito.</p>

<p><em>Content coming soon.</em></p>
```

- [ ] **Step 3: Create `phil1301/unit-1-socrates/socrates-life.njk`**

This is a sample content page to test the prev/next navigation works within a unit.

```njk
---
layout: layouts/page.njk
title: "Socrates' Life and Context"
module: "unit-1-socrates"
breadcrumbTitle: "Socrates' Life and Context"
position: 2
tags: unit1
---

<p>Socrates (c. 470–399 BCE) is one of the most important figures in the history of Western philosophy. Though he wrote nothing himself, his ideas survive through the dialogues of his student Plato.</p>

<p><em>Full content coming soon.</em></p>
```

- [ ] **Step 4: Create `phil1301/unit-2-descartes/index.njk`**

```njk
---
layout: layouts/unit.njk
title: "Unit 2: Rene Descartes"
module: "unit-2-descartes"
position: 1
tags: unit2
---

<p>In this unit, we examine Descartes' method of radical doubt and his quest for certainty, working through key sections of his Meditations on First Philosophy.</p>

<p><em>Content coming soon.</em></p>
```

- [ ] **Step 5: Create `phil1301/unit-3-hume/index.njk`**

```njk
---
layout: layouts/unit.njk
title: "Unit 3: David Hume"
module: "unit-3-hume"
position: 1
tags: unit3
---

<p>In this unit, we investigate Hume's empiricism, his analysis of causation, and his skepticism about the powers of human reason.</p>

<p><em>Content coming soon.</em></p>
```

- [ ] **Step 6: Create `phil1301/unit-4-hegel/index.njk`**

```njk
---
layout: layouts/unit.njk
title: "Unit 4: G. W. F. Hegel"
module: "unit-4-hegel"
position: 1
tags: unit4
---

<p>In this unit, we study Hegel's dialectical method, his philosophy of history, and his vision of freedom and progress.</p>

<p><em>Content coming soon.</em></p>
```

- [ ] **Step 7: Create `phil1301/unit-5-marx/index.njk`**

```njk
---
layout: layouts/unit.njk
title: "Unit 5: Karl Marx"
module: "unit-5-marx"
position: 1
tags: unit5
---

<p>In this unit, we analyze Marx's historical materialism, his theory of class struggle, and the arguments of the Communist Manifesto.</p>

<p><em>Content coming soon.</em></p>
```

- [ ] **Step 8: Create `phil1301/unit-6-sartre/index.njk`**

```njk
---
layout: layouts/unit.njk
title: "Unit 6: Jean-Paul Sartre"
module: "unit-6-sartre"
position: 1
tags: unit6
---

<p>In this unit, we explore Sartre's existentialism, his concept of radical freedom, and his ethics of responsibility and humanism.</p>

<p><em>Content coming soon.</em></p>
```

- [ ] **Step 9: Create `phil1301/final-exam/index.njk`**

```njk
---
layout: layouts/unit.njk
title: "Final Exam"
module: "final-exam"
position: 1
tags: finalexam
---

<p>The final exam covers all six units of the course: Socrates and Plato, Descartes, Hume, Hegel, Marx, and Sartre.</p>

<p><em>Content coming soon.</em></p>
```

- [ ] **Step 10: Build and verify the full site**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && npx @11ty/eleventy
```

Expected: Build succeeds. Verify these output files exist:
- `_site/index.html` (homepage)
- `_site/phil1301/index.html` (course landing page)
- `_site/phil1301/start-here/index.html`
- `_site/phil1301/unit-1-socrates/index.html`
- `_site/phil1301/unit-1-socrates/socrates-life/index.html`
- `_site/phil1301/unit-2-descartes/index.html`
- `_site/phil1301/unit-3-hume/index.html`
- `_site/phil1301/unit-4-hegel/index.html`
- `_site/phil1301/unit-5-marx/index.html`
- `_site/phil1301/unit-6-sartre/index.html`
- `_site/phil1301/final-exam/index.html`
- `_site/phil1301/css/styles.css`
- `_site/phil1301/js/nav.js`

- [ ] **Step 11: Start dev server and verify in browser**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && npx @11ty/eleventy --serve
```

Open `http://localhost:8080/phil1301/` in a browser. Verify:
- Course landing page shows 8 module cards with hover effects
- Clicking "Unit 1: Socrates and Plato" card navigates to the unit overview
- Unit overview shows table of contents with "Socrates' Life and Context" link
- "Begin Unit" button links to the first content page
- Sidebar shows all modules, Unit 1 is expanded, current page is highlighted
- Clicking "Socrates' Life and Context" shows the content page with prev/next nav
- Prev/next buttons navigate between unit overview and content page
- Breadcrumbs show: Home > PHIL 1301 > Unit 1: Socrates and Plato > Socrates' Life and Context
- Homepage at `http://localhost:8080/` still works
- Mobile: resize to <900px, hamburger appears, sidebar slides in/out

- [ ] **Step 12: Commit**

```bash
git add phil1301/start-here/ phil1301/unit-1-socrates/ phil1301/unit-2-descartes/ phil1301/unit-3-hume/ phil1301/unit-4-hegel/ phil1301/unit-5-marx/ phil1301/unit-6-sartre/ phil1301/final-exam/
git commit -m "feat: add placeholder pages for all course modules and units"
```

---

### Task 10: GitHub Actions deployment

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/` directory and `deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npx @11ty/eleventy

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: "_site"

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: add GitHub Actions workflow for Eleventy build and Pages deployment"
```

---

### Task 11: Homepage integration

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update the Introduction to Philosophy card from `<div>` to `<a>`**

In `index.html`, find the first card (Introduction to Philosophy) and change it from a `<div>` to an `<a>` linking to the course:

Replace:
```html
      <div class="card-link" aria-label="Introduction to Philosophy — Coming Soon">
        <span class="badge">Coming Soon</span>
        <div class="card-body">
          <span class="card-icon" role="img" aria-label="Philosophy">&#128220;</span>
          <h2>Introduction to Philosophy</h2>
          <p>Examine the fundamental questions of existence, knowledge, and reason that have shaped human thought for millennia.</p>
        </div>
      </div>
```

With:
```html
      <a href="/phil1301/" class="card-link">
        <span class="badge">Enter Course</span>
        <div class="card-body">
          <span class="card-icon" role="img" aria-label="Philosophy">&#128220;</span>
          <h2>Introduction to Philosophy</h2>
          <p>Examine the fundamental questions of existence, knowledge, and reason that have shaped human thought for millennia.</p>
        </div>
      </a>
```

- [ ] **Step 2: Verify in dev server**

Open `http://localhost:8080/`. Click the "Introduction to Philosophy" card. Expected: navigates to `http://localhost:8080/phil1301/`.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: link Introduction to Philosophy card to course landing page"
```

---

### Task 12: Final verification

- [ ] **Step 1: Full build from clean state**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && rm -rf _site && npx @11ty/eleventy
```

Expected: Clean build succeeds with no errors. Check the output file count matches expectations.

- [ ] **Step 2: Start dev server and full walkthrough**

```bash
export PATH="$PATH:/c/Program Files/nodejs" && cd "C:/Users/norma/OneDrive/Documents/MEGA/Teaching Files/HCC/LMS Courses/001 - New PHIL 1301/website" && npx @11ty/eleventy --serve
```

Full verification checklist at `http://localhost:8080/`:
1. Homepage loads, Philosophy card says "Enter Course" and links to `/phil1301/`
2. Course landing page shows 8 module cards with hover effects
3. Each module card links to its unit overview page
4. Unit 1 overview shows table of contents with "Socrates' Life and Context"
5. "Begin Unit" button works
6. Content page shows reading layout with prev/next navigation
7. Sidebar accordion works — clicking modules expands/collapses
8. Current page is highlighted in sidebar with teal left border
9. Breadcrumbs show correct path on every page
10. Mobile (<900px): hamburger appears, sidebar slides in, backdrop closes it
11. Footer appears on every page
12. All links work (no 404s)

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "chore: final verification fixes"
```

Only create this commit if changes were needed. Skip if everything passed.
