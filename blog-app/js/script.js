/* ============================================================
   BlogSpace - JavaScript
   Module 1 Frontend Development Internship Project
   ============================================================ */

// ============================================================
// SECTION 1: UTILITY FUNCTIONS
// Helper functions used across all pages
// ============================================================

/**
 * Show a toast notification at the bottom-right corner
 * @param {string} message - The message to display
 * @param {string} type    - 'success' | 'error' | 'warning'
 * @param {number} duration - How long to show (ms)
 */
function showToast(message, type = 'success', duration = 3500) {
  // Create the container if it doesn't exist yet
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Build the toast element
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '📢'}</span> ${message}`;

  container.appendChild(toast);

  // Auto-remove after duration
  setTimeout(() => {
    toast.style.animation = 'toastOut 0.35s ease forwards';
    setTimeout(() => toast.remove(), 350);
  }, duration);
}

/**
 * Show a form field error message
 * @param {HTMLElement} field   - The input element
 * @param {HTMLElement} errorEl - The error span/div element
 * @param {string}      message - Error text to show
 */
function showFieldError(field, errorEl, message) {
  field.classList.add('error');
  field.classList.remove('success');
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
}

/**
 * Clear form field error
 */
function clearFieldError(field, errorEl) {
  field.classList.remove('error');
  field.classList.add('success');
  if (errorEl) {
    errorEl.classList.remove('visible');
  }
}

/**
 * Basic email format validation using regex
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * Save data to localStorage with a key
 */
function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Retrieve data from localStorage
 */
function getFromStorage(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch {
    return null;
  }
}

/**
 * Format a date to "Month DD, YYYY" string
 */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/**
 * Generate a random ID string
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ============================================================
// SECTION 2: NAVBAR (runs on all pages)
// Handles mobile hamburger menu toggle
// ============================================================

function initNavbar() {
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    // Update accessibility attribute
    const isOpen = mobileNav.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile nav when a link is clicked
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
    }
  });

  // Highlight active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================================
// SECTION 3: LOGIN FORM VALIDATION
// Validates email and password, redirects to dashboard
// ============================================================

function initLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  const emailField   = document.getElementById('login-email');
  const passwordField = document.getElementById('login-password');
  const emailError   = document.getElementById('email-error');
  const passwordError = document.getElementById('password-error');
  const rememberMe   = document.getElementById('remember-me');
  const submitBtn    = document.getElementById('login-btn');

  // Pre-fill email if "Remember Me" was checked previously
  const savedEmail = localStorage.getItem('bs_remembered_email');
  if (savedEmail && emailField) {
    emailField.value = savedEmail;
    if (rememberMe) rememberMe.checked = true;
  }

  // Real-time validation on input
  emailField.addEventListener('input', () => {
    if (emailField.value.trim() && isValidEmail(emailField.value)) {
      clearFieldError(emailField, emailError);
    }
  });

  passwordField.addEventListener('input', () => {
    if (passwordField.value.length >= 6) {
      clearFieldError(passwordField, passwordError);
    }
  });

  // Password visibility toggle
  const toggleBtn = document.getElementById('toggle-password');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isText = passwordField.type === 'text';
      passwordField.type = isText ? 'password' : 'text';
      toggleBtn.textContent = isText ? '👁️' : '🙈';
    });
  }

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default page reload
    let valid = true;

    // Validate email
    if (!emailField.value.trim()) {
      showFieldError(emailField, emailError, 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(emailField.value)) {
      showFieldError(emailField, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearFieldError(emailField, emailError);
    }

    // Validate password
    if (!passwordField.value.trim()) {
      showFieldError(passwordField, passwordError, 'Password is required.');
      valid = false;
    } else if (passwordField.value.length < 6) {
      showFieldError(passwordField, passwordError, 'Password must be at least 6 characters.');
      valid = false;
    } else {
      clearFieldError(passwordField, passwordError);
    }

    // If validation passes, simulate login
    if (valid) {
      // Handle Remember Me
      if (rememberMe && rememberMe.checked) {
        localStorage.setItem('bs_remembered_email', emailField.value.trim());
      } else {
        localStorage.removeItem('bs_remembered_email');
      }

      // Show loading state
      submitBtn.disabled = true;
      const spinner = submitBtn.querySelector('.btn-spinner');
      if (spinner) spinner.classList.add('show');
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Signing in...';

      // Save user session (simulated)
      saveToStorage('bs_user', {
        name: 'Alex Blogger',
        email: emailField.value.trim(),
        loggedIn: true
      });

      showToast('Login successful! Redirecting...', 'success', 1500);

      // Redirect after a short delay (simulating API call)
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1600);
    }
  });
}

// ============================================================
// SECTION 4: REGISTER FORM VALIDATION
// Validates all fields with password match check
// ============================================================

function initRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  const nameField      = document.getElementById('reg-name');
  const emailField     = document.getElementById('reg-email');
  const passwordField  = document.getElementById('reg-password');
  const confirmField   = document.getElementById('reg-confirm');
  const termsCheck     = document.getElementById('reg-terms');
  const submitBtn      = document.getElementById('register-btn');

  const nameError     = document.getElementById('name-error');
  const emailError    = document.getElementById('reg-email-error');
  const passwordError = document.getElementById('reg-password-error');
  const confirmError  = document.getElementById('confirm-error');
  const termsError    = document.getElementById('terms-error');

  // Password strength meter
  const strengthFill = document.getElementById('strength-fill');
  const strengthText = document.getElementById('strength-text');

  // Password visibility toggles
  const togglePassword = document.getElementById('toggle-reg-password');
  const toggleConfirm  = document.getElementById('toggle-reg-confirm');

  if (togglePassword) {
    togglePassword.addEventListener('click', () => {
      const isText = passwordField.type === 'text';
      passwordField.type = isText ? 'password' : 'text';
      togglePassword.textContent = isText ? '👁️' : '🙈';
    });
  }

  if (toggleConfirm) {
    toggleConfirm.addEventListener('click', () => {
      const isText = confirmField.type === 'text';
      confirmField.type = isText ? 'password' : 'text';
      toggleConfirm.textContent = isText ? '👁️' : '🙈';
    });
  }

  // Live password strength check
  if (passwordField && strengthFill && strengthText) {
    passwordField.addEventListener('input', () => {
      const val = passwordField.value;
      let strength = 0;

      if (val.length >= 8) strength++;
      if (/[A-Z]/.test(val) && /[a-z]/.test(val)) strength++;
      if (/\d/.test(val)) strength++;
      if (/[^a-zA-Z0-9]/.test(val)) strength++;

      // Remove existing classes
      strengthFill.classList.remove('weak', 'medium', 'strong');

      if (val.length === 0) {
        strengthFill.style.width = '0';
        strengthText.textContent = '';
      } else if (strength <= 1) {
        strengthFill.classList.add('weak');
        strengthText.textContent = 'Weak – try adding uppercase and numbers';
        strengthText.style.color = 'var(--error)';
      } else if (strength <= 2) {
        strengthFill.classList.add('medium');
        strengthText.textContent = 'Medium – add special characters for better security';
        strengthText.style.color = 'var(--warning)';
      } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = 'Strong password! ✓';
        strengthText.style.color = 'var(--success)';
      }

      // Clear error if password is valid
      if (val.length >= 8) clearFieldError(passwordField, passwordError);
    });
  }

  // Live confirm password check
  if (confirmField) {
    confirmField.addEventListener('input', () => {
      if (confirmField.value === passwordField.value && confirmField.value) {
        clearFieldError(confirmField, confirmError);
      }
    });
  }

  // Form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    // Validate Full Name
    if (!nameField.value.trim()) {
      showFieldError(nameField, nameError, 'Full name is required.');
      valid = false;
    } else if (nameField.value.trim().length < 2) {
      showFieldError(nameField, nameError, 'Name must be at least 2 characters.');
      valid = false;
    } else {
      clearFieldError(nameField, nameError);
    }

    // Validate Email
    if (!emailField.value.trim()) {
      showFieldError(emailField, emailError, 'Email address is required.');
      valid = false;
    } else if (!isValidEmail(emailField.value)) {
      showFieldError(emailField, emailError, 'Please enter a valid email address.');
      valid = false;
    } else {
      clearFieldError(emailField, emailError);
    }

    // Validate Password
    if (!passwordField.value.trim()) {
      showFieldError(passwordField, passwordError, 'Password is required.');
      valid = false;
    } else if (passwordField.value.length < 8) {
      showFieldError(passwordField, passwordError, 'Password must be at least 8 characters.');
      valid = false;
    } else {
      clearFieldError(passwordField, passwordError);
    }

    // Validate Confirm Password
    if (!confirmField.value.trim()) {
      showFieldError(confirmField, confirmError, 'Please confirm your password.');
      valid = false;
    } else if (confirmField.value !== passwordField.value) {
      showFieldError(confirmField, confirmError, 'Passwords do not match. Please try again.');
      valid = false;
    } else {
      clearFieldError(confirmField, confirmError);
    }

    // Validate Terms checkbox
    if (!termsCheck.checked) {
      if (termsError) {
        termsError.textContent = 'You must accept the Terms & Conditions.';
        termsError.classList.add('visible');
      }
      valid = false;
    } else {
      if (termsError) termsError.classList.remove('visible');
    }

    // If all valid, simulate registration
    if (valid) {
      submitBtn.disabled = true;
      const spinner = submitBtn.querySelector('.btn-spinner');
      if (spinner) spinner.classList.add('show');
      const btnText = submitBtn.querySelector('.btn-text');
      if (btnText) btnText.textContent = 'Creating account...';

      // Show success alert
      const alertEl = document.getElementById('register-alert');
      if (alertEl) {
        alertEl.textContent = '🎉 Account created successfully! Redirecting to login...';
        alertEl.className = 'alert alert-success show';
      }

      showToast('Registration successful!', 'success', 2000);

      // Redirect to login after delay
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2200);
    }
  });
}

// ============================================================
// SECTION 5: DASHBOARD
// Manages blog list with sample data, uses localStorage
// ============================================================

// Sample blog data (used when no localStorage data exists)
const sampleBlogs = [
  {
    id: 'blog-001',
    title: 'The Future of Web Development',
    category: 'Technology',
    status: 'published',
    date: '2024-09-15',
    views: 1240,
    description: 'An exploration of upcoming trends in web development including AI integration, WebAssembly, and edge computing.',
    content: 'Web development is evolving at an unprecedented pace. From AI-powered tools to edge computing, the landscape is shifting dramatically. In this article, we explore what the next few years hold for web developers...'
  },
  {
    id: 'blog-002',
    title: 'Getting Started With JavaScript',
    category: 'Tutorial',
    status: 'published',
    date: '2024-09-10',
    views: 876,
    description: 'A beginner-friendly guide to understanding JavaScript fundamentals, variables, functions, and DOM manipulation.',
    content: 'JavaScript is the language of the web. Whether you want to build interactive websites or full-stack applications, JavaScript is your best friend. This tutorial walks you through the basics...'
  },
  {
    id: 'blog-003',
    title: 'My First Coding Project',
    category: 'Personal',
    status: 'published',
    date: '2024-09-05',
    views: 543,
    description: 'The story of building my very first project — a to-do app — and everything I learned along the way.',
    content: 'Every developer remembers their first project. Mine was a simple to-do app that taught me more than any tutorial ever could. Here\'s my story...'
  },
  {
    id: 'blog-004',
    title: 'Tips for Learning Programming',
    category: 'Career',
    status: 'draft',
    date: '2024-09-20',
    views: 0,
    description: 'Practical advice for beginners who want to learn programming effectively without burning out.',
    content: 'Learning programming can be overwhelming. With countless languages, frameworks, and resources available, it\'s easy to feel lost. Here are my top tips for making the journey enjoyable...'
  },
  {
    id: 'blog-005',
    title: 'CSS Grid vs Flexbox: When to Use What',
    category: 'Tutorial',
    status: 'draft',
    date: '2024-09-22',
    views: 0,
    description: 'A practical comparison of CSS Grid and Flexbox layout systems to help you choose the right tool.',
    content: 'CSS Grid and Flexbox are both powerful layout systems. Understanding when to use each one is key to writing clean, maintainable CSS...'
  }
];

/**
 * Load blogs from localStorage, fallback to sample data
 */
function getBlogs() {
  return getFromStorage('bs_blogs') || sampleBlogs;
}

/**
 * Save blog list to localStorage
 */
function saveBlogs(blogs) {
  saveToStorage('bs_blogs', blogs);
}

/**
 * Initialize blogs storage with sample data if empty
 */
function initBlogsStorage() {
  if (!localStorage.getItem('bs_blogs')) {
    saveBlogs(sampleBlogs);
  }
}

/**
 * Build a single table row for a blog entry
 */
function createBlogRow(blog) {
  const tr = document.createElement('tr');
  tr.setAttribute('data-id', blog.id);

  const statusBadge = blog.status === 'published'
    ? '<span class="status-badge published">● Published</span>'
    : '<span class="status-badge draft">● Draft</span>';

  tr.innerHTML = `
    <td>
      <strong style="color:var(--text-dark)">${escapeHtml(blog.title)}</strong>
    </td>
    <td>
      <span class="card-category">${escapeHtml(blog.category)}</span>
    </td>
    <td>${statusBadge}</td>
    <td>${formatDate(blog.date)}</td>
    <td>${blog.views.toLocaleString()}</td>
    <td>
      <div class="table-actions">
        <button class="action-btn view"   onclick="viewBlog('${blog.id}')"   title="View blog">👁 View</button>
        <button class="action-btn edit"   onclick="editBlog('${blog.id}')"   title="Edit blog">✏️ Edit</button>
        <button class="action-btn delete" onclick="deleteBlog('${blog.id}')" title="Delete blog">🗑 Delete</button>
      </div>
    </td>
  `;
  return tr;
}

/**
 * Safely escape HTML to prevent XSS
 */
function escapeHtml(str) {
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(String(str)));
  return el.innerHTML;
}

/**
 * Render the blog table on the dashboard
 */
function renderDashboardBlogs() {
  const tbody     = document.getElementById('blogs-tbody');
  const emptyState = document.getElementById('empty-state');
  if (!tbody) return;

  const blogs = getBlogs();
  tbody.innerHTML = '';

  if (blogs.length === 0) {
    // Show empty state message
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  blogs.forEach(blog => {
    tbody.appendChild(createBlogRow(blog));
  });

  // Update stat counts
  updateStats(blogs);
}

/**
 * Update the 4 stat cards on the dashboard
 */
function updateStats(blogs) {
  const total     = blogs.length;
  const published = blogs.filter(b => b.status === 'published').length;
  const drafts    = blogs.filter(b => b.status === 'draft').length;
  const views     = blogs.reduce((sum, b) => sum + (b.views || 0), 0);

  const setEl = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setEl('stat-total', total);
  setEl('stat-published', published);
  setEl('stat-drafts', drafts);
  setEl('stat-views', views.toLocaleString());
}

/**
 * Delete a blog by ID – removes row from DOM and updates localStorage
 */
function deleteBlog(blogId) {
  // Confirmation before delete
  if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
    return;
  }

  let blogs = getBlogs();
  blogs = blogs.filter(b => b.id !== blogId);
  saveBlogs(blogs);

  // Remove the row from the DOM smoothly
  const row = document.querySelector(`tr[data-id="${blogId}"]`);
  if (row) {
    row.style.transition = 'opacity 0.3s, transform 0.3s';
    row.style.opacity = '0';
    row.style.transform = 'translateX(-10px)';
    setTimeout(() => {
      row.remove();
      updateStats(blogs);
      const tbody = document.getElementById('blogs-tbody');
      if (blogs.length === 0 && tbody) {
        const emptyState = document.getElementById('empty-state');
        if (emptyState) emptyState.style.display = 'block';
      }
    }, 300);
  }

  showToast('Blog deleted successfully.', 'error');
}

/**
 * View a blog – opens a modal with the blog content
 */
function viewBlog(blogId) {
  const blogs = getBlogs();
  const blog  = blogs.find(b => b.id === blogId);
  if (!blog) return;

  const modal = document.getElementById('blog-modal');
  if (!modal) return;

  document.getElementById('modal-title').textContent    = blog.title;
  document.getElementById('modal-category').textContent = blog.category;
  document.getElementById('modal-date').textContent     = formatDate(blog.date);
  document.getElementById('modal-status').textContent   = blog.status === 'published' ? '✅ Published' : '📝 Draft';
  document.getElementById('modal-views').textContent    = `${blog.views.toLocaleString()} views`;
  document.getElementById('modal-content').textContent  = blog.content || blog.description;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

/**
 * Edit a blog – redirects to create-blog page with pre-filled data
 */
function editBlog(blogId) {
  const blogs = getBlogs();
  const blog  = blogs.find(b => b.id === blogId);
  if (!blog) return;

  // Store blog to edit in localStorage, then redirect
  saveToStorage('bs_edit_blog', blog);
  showToast('Opening blog editor...', 'info', 1500);
  setTimeout(() => {
    window.location.href = 'create-blog.html';
  }, 800);
}

/**
 * Close blog modal
 */
function closeModal() {
  const modal = document.getElementById('blog-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

/**
 * Initialize dashboard page
 */
function initDashboard() {
  if (!document.getElementById('blogs-tbody')) return;

  initBlogsStorage();
  renderDashboardBlogs();

  // Welcome message with user name from storage
  const user = getFromStorage('bs_user');
  const welcomeEl = document.getElementById('welcome-name');
  if (welcomeEl && user) {
    welcomeEl.textContent = `Welcome back, ${user.name || 'Blogger'}! 👋`;
  }

  // Close modal on overlay click or close button
  const modal = document.getElementById('blog-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }
}

// ============================================================
// SECTION 6: CREATE BLOG
// Handles blog creation, editing, and localStorage persistence
// ============================================================

/**
 * Tags input component
 */
function initTagsInput() {
  const tagsWrap  = document.getElementById('tags-wrap');
  const tagsInput = document.getElementById('tags-input');
  const tagsHidden = document.getElementById('tags-hidden');
  if (!tagsWrap || !tagsInput) return;

  let tags = [];

  function addTag(value) {
    const tag = value.trim().replace(/,/g, '');
    if (!tag || tags.includes(tag)) return;
    tags.push(tag);
    renderTags();
    tagsInput.value = '';
  }

  function removeTag(tag) {
    tags = tags.filter(t => t !== tag);
    renderTags();
  }

  function renderTags() {
    // Remove existing tag items (but not the input)
    tagsWrap.querySelectorAll('.tag-item').forEach(el => el.remove());

    tags.forEach(tag => {
      const tagEl = document.createElement('span');
      tagEl.className = 'tag-item';
      tagEl.innerHTML = `${escapeHtml(tag)} <button type="button" onclick="this.parentElement.remove()" aria-label="Remove tag">×</button>`;
      tagEl.querySelector('button').addEventListener('click', () => removeTag(tag));
      tagsWrap.insertBefore(tagEl, tagsInput);
    });

    // Update hidden field
    if (tagsHidden) tagsHidden.value = tags.join(',');
  }

  tagsInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(tagsInput.value);
    }
    // Remove last tag on Backspace if input is empty
    if (e.key === 'Backspace' && !tagsInput.value && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  });

  tagsWrap.addEventListener('click', () => tagsInput.focus());

  return { getTags: () => [...tags], setTags: (t) => { tags = t; renderTags(); } };
}

/**
 * Image preview when user enters a URL
 */
function initImagePreview() {
  const imageInput = document.getElementById('blog-image');
  const preview    = document.getElementById('image-preview');
  const previewImg = document.getElementById('preview-img');

  if (!imageInput || !preview || !previewImg) return;

  imageInput.addEventListener('input', () => {
    const url = imageInput.value.trim();
    if (url) {
      previewImg.src = url;
      preview.classList.add('show');
      // Hide preview if image fails to load
      previewImg.onerror = () => preview.classList.remove('show');
    } else {
      preview.classList.remove('show');
    }
  });
}

/**
 * Character counter for the blog description
 */
function initCharCounter() {
  const descField   = document.getElementById('blog-desc');
  const charCounter = document.getElementById('char-count');
  if (!descField || !charCounter) return;

  descField.addEventListener('input', () => {
    const remaining = 200 - descField.value.length;
    charCounter.textContent = `${remaining} characters remaining`;
    charCounter.style.color = remaining < 20 ? 'var(--error)' : 'var(--text-light)';
  });
}

let tagsController = null;

/**
 * Initialize the Create Blog page
 */
function initCreateBlog() {
  const form = document.getElementById('create-blog-form');
  if (!form) return;

  tagsController = initTagsInput();
  initImagePreview();
  initCharCounter();

  // Check if we're editing an existing blog
  const editBlogData = getFromStorage('bs_edit_blog');
  if (editBlogData) {
    populateEditForm(editBlogData);
    // Clear the edit data so form starts fresh next time
    localStorage.removeItem('bs_edit_blog');
    // Update page title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = '✏️ Edit Blog Post';
    const pageSubtitle = document.getElementById('page-subtitle');
    if (pageSubtitle) pageSubtitle.textContent = 'Update your blog post details below.';
  }

  // Draft auto-save every 30 seconds
  setInterval(() => {
    const titleVal = document.getElementById('blog-title')?.value?.trim();
    if (titleVal) {
      autoSaveDraft();
    }
  }, 30000);

  // Load auto-saved draft if it exists (and we're not editing)
  if (!editBlogData) {
    const savedDraft = getFromStorage('bs_auto_draft');
    if (savedDraft) {
      const restore = confirm('We found an auto-saved draft. Would you like to restore it?');
      if (restore) populateEditForm(savedDraft);
    }
  }
}

/**
 * Fill the form with existing blog data (for editing)
 */
function populateEditForm(blog) {
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };

  setVal('blog-title', blog.title);
  setVal('blog-category', blog.category);
  setVal('blog-image', blog.image);
  setVal('blog-desc', blog.description);
  setVal('blog-content', blog.content);
  setVal('blog-id', blog.id);

  if (blog.image) {
    const preview    = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    if (preview && previewImg) {
      previewImg.src = blog.image;
      preview.classList.add('show');
    }
  }

  if (tagsController && blog.tags) {
    tagsController.setTags(Array.isArray(blog.tags) ? blog.tags : blog.tags.split(','));
  }

  // Trigger char counter update
  const descField = document.getElementById('blog-desc');
  if (descField) descField.dispatchEvent(new Event('input'));
}

/**
 * Auto-save draft silently
 */
function autoSaveDraft() {
  const blogData = collectFormData('draft');
  if (!blogData) return;
  saveToStorage('bs_auto_draft', blogData);
}

/**
 * Collect form field values into a blog object
 */
function collectFormData(status = 'published') {
  const title    = document.getElementById('blog-title')?.value?.trim();
  const category = document.getElementById('blog-category')?.value;
  const image    = document.getElementById('blog-image')?.value?.trim();
  const desc     = document.getElementById('blog-desc')?.value?.trim();
  const content  = document.getElementById('blog-content')?.value?.trim();
  const existingId = document.getElementById('blog-id')?.value;

  const tags = tagsController ? tagsController.getTags() : [];

  return {
    id:          existingId || generateId(),
    title:       title || '',
    category:    category || 'General',
    image:       image || '',
    description: desc || '',
    content:     content || '',
    tags,
    status,
    date:        new Date().toISOString().split('T')[0],
    views:       0
  };
}

/**
 * Validate the blog form, return true if valid
 */
function validateBlogForm() {
  let valid = true;

  const titleField    = document.getElementById('blog-title');
  const categoryField = document.getElementById('blog-category');
  const descField     = document.getElementById('blog-desc');
  const contentField  = document.getElementById('blog-content');

  const titleError   = document.getElementById('blog-title-error');
  const contentError = document.getElementById('blog-content-error');

  if (!titleField.value.trim()) {
    showFieldError(titleField, titleError, 'Blog title is required.');
    valid = false;
  } else if (titleField.value.trim().length < 5) {
    showFieldError(titleField, titleError, 'Title must be at least 5 characters.');
    valid = false;
  } else {
    clearFieldError(titleField, titleError);
  }

  if (!contentField.value.trim()) {
    showFieldError(contentField, contentError, 'Blog content cannot be empty.');
    valid = false;
  } else if (contentField.value.trim().length < 50) {
    showFieldError(contentField, contentError, 'Content must be at least 50 characters.');
    valid = false;
  } else {
    clearFieldError(contentField, contentError);
  }

  return valid;
}

/**
 * Handle Publish button click
 */
function publishBlog() {
  if (!validateBlogForm()) {
    showToast('Please fix the errors before publishing.', 'error');
    return;
  }

  const blog = collectFormData('published');
  let blogs  = getBlogs();

  // Check if we're updating an existing blog
  const existingIndex = blogs.findIndex(b => b.id === blog.id);
  if (existingIndex > -1) {
    blogs[existingIndex] = blog;
    showToast('Blog updated and published! ✨', 'success');
  } else {
    blogs.unshift(blog); // Add to beginning of list
    showToast('Blog published successfully! 🎉', 'success');
  }

  saveBlogs(blogs);

  // Clear auto-saved draft
  localStorage.removeItem('bs_auto_draft');

  // Redirect to dashboard after short delay
  setTimeout(() => {
    window.location.href = 'dashboard.html';
  }, 1800);
}

/**
 * Handle Save as Draft button click
 */
function saveDraft() {
  const titleField = document.getElementById('blog-title');
  if (!titleField?.value?.trim()) {
    showToast('Please enter a title before saving as draft.', 'warning');
    titleField?.focus();
    return;
  }

  const blog = collectFormData('draft');
  let blogs  = getBlogs();

  const existingIndex = blogs.findIndex(b => b.id === blog.id);
  if (existingIndex > -1) {
    blogs[existingIndex] = blog;
  } else {
    blogs.unshift(blog);
  }

  saveBlogs(blogs);
  localStorage.removeItem('bs_auto_draft');

  showToast('Draft saved successfully! 📝', 'info');

  // Show a subtle visual confirmation on the button
  const draftBtn = document.getElementById('save-draft-btn');
  if (draftBtn) {
    const originalText = draftBtn.innerHTML;
    draftBtn.innerHTML = '✅ Saved!';
    draftBtn.disabled = true;
    setTimeout(() => {
      draftBtn.innerHTML = originalText;
      draftBtn.disabled = false;
    }, 2000);
  }
}

/**
 * Handle Cancel button click
 */
function cancelCreate() {
  if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
    window.location.href = 'dashboard.html';
  }
}

// ============================================================
// SECTION 7: HOME PAGE
// Handles Read More clicks and animated counter
// ============================================================

function initHomePage() {
  if (!document.getElementById('featured-blogs')) return;

  // Animate stats counter when they scroll into view
  const statNumbers = document.querySelectorAll('.hero-stat .number');
  if (statNumbers.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
  }
}

/**
 * Animate a number counting up
 */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target') || el.textContent.replace(/[^0-9]/g, ''));
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString() + (el.getAttribute('data-suffix') || '');
  }, 16);
}

// ============================================================
// SECTION 8: PAGE INITIALIZATION
// Runs the right init function based on the current page
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  // Always init navbar
  initNavbar();

  // Detect current page and init accordingly
  const page = window.location.pathname.split('/').pop() || 'index.html';

  if (page === 'index.html' || page === '') {
    initHomePage();
  } else if (page === 'login.html') {
    initLoginForm();
  } else if (page === 'register.html') {
    initRegisterForm();
  } else if (page === 'dashboard.html') {
    initDashboard();
  } else if (page === 'create-blog.html') {
    initCreateBlog();
  }

  // Add a subtle fade-in animation to the page
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
