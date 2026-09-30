# BlogSpace 📝

> A responsive Blog Application built using **HTML**, **CSS**, and **Vanilla JavaScript** as part of **Module 1 – Day 1 to Day 4 Frontend Development Internship Task**.

---

## 🌐 Project Overview

**BlogSpace** is a modern, beginner-friendly blog platform built purely with frontend technologies — no frameworks, no libraries, no backend. It demonstrates core frontend development skills including semantic HTML, responsive CSS layouts, form validation, DOM manipulation, and localStorage data persistence.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏠 **Home Page** | Hero section, feature highlights, 6 featured blog cards, CTA section |
| 🔐 **Login Page** | Email/password form with validation, remember me, password toggle |
| 📝 **Register Page** | Full registration form with password strength meter and match validation |
| 📊 **Dashboard** | Stats cards, blog table with filter, view/edit/delete actions |
| ✍️ **Create Blog** | Rich form with tags input, image preview, publish & draft functionality |
| 💾 **localStorage** | Blog persistence across sessions, edit pre-fill, auto-save drafts |
| 📱 **Responsive** | Mobile-first design with hamburger menu, adapts to all screen sizes |
| 🎨 **Modern UI** | Gradient hero, glassmorphism navbar, hover animations, toast notifications |
| ♿ **Accessibility** | Semantic HTML, ARIA labels, keyboard-friendly forms |

---

## 🛠 Technologies Used

- **HTML5** – Semantic markup (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- **CSS3** – Custom properties (CSS variables), Flexbox, CSS Grid, Media queries, Animations
- **Vanilla JavaScript** – DOM manipulation, Event listeners, Form validation, localStorage API
- **Google Fonts** – Inter + Playfair Display

> ❌ No React, Angular, Vue, Bootstrap, Tailwind, or any external UI framework used.

---

## 📄 Pages

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Landing page with hero, blogs grid, features |
| Login | `login.html` | User sign-in form |
| Register | `register.html` | New account creation form |
| Dashboard | `dashboard.html` | Blog management with stats |
| Create Blog | `create-blog.html` | Blog writing and publishing interface |

---

## 📁 Project Structure

```
blog-app/
│
├── index.html          ← Home Page
├── login.html          ← Login Page
├── register.html       ← Register Page
├── dashboard.html      ← Dashboard Page
├── create-blog.html    ← Create Blog Page
│
├── css/
│   └── style.css       ← All styles (design system + responsive)
│
├── js/
│   └── script.js       ← All JavaScript functionality
│
└── assets/
    └── images/         ← (placeholder for any local images)
```

---

## 🚀 How to Run

### Option 1 – Open Directly (Simplest)
1. Download or clone this repository
2. Open `index.html` in any modern browser (Chrome, Firefox, Edge)

### Option 2 – VS Code Live Server (Recommended)
1. Open the `blog-app/` folder in **VS Code**
2. Install the **Live Server** extension by Ritwick Dey
3. Right-click `index.html` → **Open with Live Server**
4. The app opens at `http://127.0.0.1:5500`

### Option 3 – Python Simple Server
```bash
cd blog-app
python -m http.server 5500
# Then open http://localhost:5500
```

### Option 4 – Node.js `serve`
```bash
cd blog-app
npx serve .
```

---

## 🧪 Testing Checklist

- [x] All 5 pages open correctly
- [x] Navigation links work between all pages
- [x] Responsive hamburger menu works on mobile
- [x] Login form validates email and password
- [x] Register form validates all fields including password match
- [x] Password strength meter updates live
- [x] Dashboard displays stat cards and blog table
- [x] Filter buttons (All/Published/Drafts) work on dashboard
- [x] Delete removes blog from table and localStorage
- [x] Edit pre-fills the Create Blog form
- [x] View opens modal with blog content
- [x] Create Blog validates required fields
- [x] Publish saves to localStorage and redirects
- [x] Save as Draft saves and shows confirmation
- [x] Tags input supports Enter/comma to add, backspace to remove
- [x] Image URL preview loads in sidebar
- [x] Toast notifications appear on all actions
- [x] No console errors on any page
- [x] Mobile layout stacks correctly

---

## 📸 Screenshots

> Run the project locally to view all pages. The design includes:
> - Dark navy gradient hero with animated stats
> - White glassmorphism navbar
> - Purple/blue gradient accent system
> - Rounded card UI with hover animations
> - Responsive 3-column → 1-column blog grid

---

## 📈 Module 1 Learning Objectives Covered

| Day | Topics | Implementation |
|---|---|---|
| Day 1 | HTML basics, page structure, navigation, forms | All 5 HTML files with semantic structure |
| Day 2 | CSS, layouts, colors, typography, responsive design | `style.css` with CSS Grid, Flexbox, media queries |
| Day 3 | JavaScript, DOM, events, form validation, interactions | `script.js` with full validation and localStorage |
| Day 4 | Combine HTML+CSS+JS, complete app, GitHub prep | Full integrated project, README, .gitignore |

---

## 🔮 Future Improvements

- [ ] Rich text editor (e.g., Quill.js or TipTap) for blog content
- [ ] Backend integration with Node.js + Express
- [ ] User authentication with JWT tokens
- [ ] Database storage (MongoDB / PostgreSQL)
- [ ] Image upload to Cloudinary / AWS S3
- [ ] Comment system on blog posts
- [ ] Search and filter by category/tags
- [ ] Social sharing buttons
- [ ] Blog post pagination
- [ ] Dark mode toggle

---

## 👨‍💻 Author

**Frontend Development Intern**
Module 1 – Day 1 to Day 4

---

## 📜 License

This project is built for educational purposes as part of an internship program.

---

*Built with ❤️ using HTML, CSS, and Vanilla JavaScript — no frameworks needed!*
