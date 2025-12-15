
# vprezende-dev

Welcome to the repository for **vprezende-dev**, a modern developer portfolio designed to showcase projects, skills, and professional experience. This application is built with a focus on performance, accessibility, and a cutting-edge developer experience.

## 🛠 Tech Stack

This project leverages the latest ecosystem for React development:

- **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn/ui](https://ui.shadcn.com/) (built on Radix UI)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Forms:** React Hook Form + Zod
- **Analytics:** Vercel Analytics
- **Package Manager:** [pnpm](https://pnpm.io/)

## 🚀 Getting Started

### Prerequisites

Ensure you have **Node.js** installed. This project uses **npm** as the package manager.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vprezende/vprezende-dev.git
   cd vprezende-dev
	```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Start the development server:**

    ```bash
    npm dev
    ```

    The app will run at `http://localhost:5173`.

## 🔐 Security & Environment Variables

This project uses environment variables for local secrets. Please adhere to the following security rules:

  - **No Secrets in Git:** Never commit configuration files containing secrets (e.g., `.env.local`).
  - **Client-Side Variables:** Any variable exposed to the client (Vite) **must** start with `VITE_` (e.g., `VITE_API_KEY`).
  - **Templates:** Use `.env.local` for your actual values and `.env.example` as a template structure.

### Git Hooks

We have configured a local **pre-commit hook** (located in `.githooks/pre-commit`) that automatically blocks commits containing `.env` files to prevent accidental leaks.

### Setup

1.  Copy the example file:
    ```bash
    cp .env.example .env.local
    ```
2.  Fill in the values in `.env.local` (this file is git-ignored).
3.  Access variables in your code:
    ```js
    import.meta.env.VITE_YOUR_KEY
    ```

## 📦 Scripts

| Script | Description |
| :--- | :--- |
| `npm dev` | Starts the development server with Vite. |
| `npm build` | Builds the application for production. |
| `npm preview` | Locally previews the production build. |
| `npm lint` | Runs ESLint to ensure code quality. |

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
