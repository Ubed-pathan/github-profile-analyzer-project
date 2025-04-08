# GitHub Profile Analyzer 🔍

A modern web application that takes a GitHub username as input and shows their public activity metrics:

- ✅ List of public repositories  
- 📊 (Advanced) Daily commits chart

---

## 🚀 Live Demo

🔗 [https://github-profile-analyzer-project.vercel.app](https://github-profile-analyzer-project.vercel.app)

---

## 🛠️ Tech Stack

- **Frontend**: React (with Vite)  
- **UI Components**: ShadCN (Radix UI + TailwindCSS)  
- **Language**: TypeScript  
- **API**: GitHub Public REST API v3  

---

## 📦 Getting Started (Development)

### 1. Clone the repository

```bash
git clone https://github.com/Ubed-pathan/github-profile-analyzer-project.git
cd github-profile-analyzer-project
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

---

## ⚙️ Build for Production

```bash
npm run build
npm run preview
```

---

## 🌐 Deploy Instructions

You can easily deploy this project using **Vercel**:

1. Go to [vercel.com](https://vercel.com) and log in using your GitHub account.
2. Click **"Add New Project"** and select the repository.
3. Use default build settings (Vite + React + TypeScript).
4. Click **Deploy**.
5. Once deployed, your live URL will be available (like: `https://your-app.vercel.app`).

✅ You can also deploy manually by uploading the code via **Vercel CLI**.

---

## 📁 Folder Structure

```
github-profile-analyzer-project/
├── public/              # Static assets
├── src/
│   ├── components/      # UI and reusable components
│   ├── pages/           # Application pages
│   ├── services/        # GitHub API handling
│   ├── App.tsx
│   ├── main.tsx
├── tailwind.config.ts   # Tailwind + ShadCN configuration
├── tsconfig.json        # TypeScript config
├── vite.config.ts       # Vite config
└── package.json         # Scripts and dependencies
```

---

## 📝 Features

- 🔎 Search GitHub users by username  
- 📃 Display all public repositories  
- 📈 Commit activity chart  
- 💡 Modern and minimal UI built with ShadCN components  

---

## ⚠️ Notes

- GitHub API is rate-limited to **60 requests/hour** without authentication.  
- For extensive usage, a GitHub token can be added in future updates.  
- The chart feature may require GitHub GraphQL or third-party charting APIs for deeper analytics.

---

## ✨ Author

**Ubaid Pathan**  
📧 [LinkedIn](https://www.linkedin.com/in/ubed-pathan-35a715242/)  
🌐 [Portfolio](https://ubedsportfolio.vercel.app/))
