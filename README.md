# 👨‍💻 Software Engineer Portfolio

Welcome to the repository for my personal software engineer portfolio! 🚀 

A fast, lightweight, and responsive website built using **VitePress**. This site beautifully showcases my projects, professional experience, technical skills, education, and contact information.

---

## 🛠️ Tech Stack

- 🟢 **Core Framework:** [VitePress](https://vitepress.dev/) *(Vue 3 powered Static Site Generator)*
- ⚡ **UI & Components:** [Vue 3](https://vuejs.org/) *(Custom SFC Layout & Composition API)*
- 🎨 **Styling:** SCSS / Sass Modules *(Modern variables, flex/grid layouts, micro-animations)*
- 🖼️ **Icons:** Official [@fortawesome/vue-fontawesome](https://fontawesome.com/) + [Lucide Vue Next](https://lucide.dev/)
- 🧹 **Linting:** [ESLint](https://eslint.org/) *(Vue 3 Flat Configuration)*
- 📦 **Package Manager:** [Yarn](https://yarnpkg.com/)

---

## ✨ Features

- 🌍 **Multi-Language Support (EN / PT-BR):** Native bilingual support with client-side detection and dynamic frontmatter content binding.
- 🪄 **Card Scaling Animations:** Hover scale effects with separated GPU-accelerated animation wrappers to prevent text blurring.
- 📊 **Data-Driven Architecture:** All portfolio content *(about, skills, experience, projects, contact)* is loaded dynamically from Markdown frontmatter.
- 📱 **Responsive Layout:** Fluid layout built for mobile, tablet, and desktop viewports with responsive grid structures.

---

## 📂 Project Structure

```text
vprezende-dev/
├── 📁 docs/                        # Document content and pages
│   ├── 📁 .vitepress/              # VitePress config and layout theme
│   │   ├── 📄 config.js            # Global configuration & routes
│   │   └── 📁 theme/               # Custom Vue components and SCSS styles
│   │       ├── 📄 Layout.vue       # Main single-page application layout
│   │       └── 📁 styles/          # SCSS design system & animations
│   ├── 📁 public/                  # Static public assets (e.g., favicon)
│   ├── 📁 en/                      # English localization markdown files
│   └── 📁 pt/                      # Portuguese localization markdown files
├── 📄 package.json                 # Build scripts and project dependencies
├── 📄 eslint.config.js             # ESLint flat config file for Vue 3
└── 📄 yarn.lock                    # Locked yarn package version tree
```

---

## 🚀 Getting Started

### 📌 Prerequisites
Ensure you have **Node.js** (v18+) and **Yarn** installed on your machine.

### 💻 Installation

**1. Clone the repository:**
```bash
git clone [https://github.com/vprezende/vprezende-dev.git](https://github.com/vprezende/vprezende-dev.git)
cd vprezende-dev
```

**2. Install dependencies:**
```bash
yarn install
```

**3. Run the local development server:**
```bash
yarn dev
```
---

## ⚡ Scripts

| Command | Description |
| :--- | :--- |
| `yarn dev` | 🛠️ Launches the local VitePress hot-reload development server. |
| `yarn build` | 🏗️ Builds the static site for production into `docs/.vitepress/dist/`. |
| `yarn preview` | 👀 Serves a local preview of the built production static site. |
| `yarn lint` | 🧹 Runs ESLint to validate JS, Vue, and formatting syntax rules. |

---

## 💖 Support

If you found this project helpful, inspiring, or if you'd just like to support my work, consider buying me a coffee! Your support fuels my late-night coding sessions and helps me keep building cool things. ☕👇

<a href="https://www.buymeacoffee.com/vprezende" target="_blank">
  <img src="https://raw.githubusercontent.com/pachadotdev/buymeacoffee-badges/main/bmc-yellow.svg" alt="Buy Me A Coffee" height="35">
</a>

---

## 📜 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.