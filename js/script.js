// ===============================
// Create Blog Page Protection
// ===============================

if (window.location.pathname.endsWith("create-blog.html")) {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {

        alert("Please login to create a blog.");

        window.location.href = "login.html";
    }
}
// ===============================
// BlogSpace - Registration
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Get form values
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Check passwords
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Create user object
        const user = {
            name: name,
            email: email,
            password: password
        };

        // Save user
        localStorage.setItem("blogspaceUser", JSON.stringify(user));

        alert("Registration successful! Please login.");

        // Go to login page
        window.location.href = "login.html";
    });

}
// ===============================
// BlogSpace - Login
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Get login values
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;

        // Get registered user
        const savedUser = localStorage.getItem("blogspaceUser");

        // Check if user exists
        if (!savedUser) {
            alert("No account found. Please register first.");
            return;
        }

        const user = JSON.parse(savedUser);

        // Check login details
        if (email === user.email && password === user.password) {

            // Save login status
            localStorage.setItem("isLoggedIn", "true");

            alert("Login successful! Welcome back.");

            // Go to dashboard
            window.location.href = "dashboard.html";

        } else {

            alert("Invalid email or password.");

        }

    });

}
// ===============================
// Dashboard Protection
// ===============================

if (window.location.pathname.endsWith("dashboard.html")) {

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn !== "true") {

        alert("Please login to access the dashboard.");

        window.location.href = "login.html";
    }
}
// ===============================
// BlogSpace - Create / Edit Blog
// ===============================

const blogForm = document.getElementById("blogForm");

if (blogForm) {

    // Check if we are editing a blog
    const editingBlogId =
        localStorage.getItem("editingBlogId");

    // Load existing blog when editing
    if (editingBlogId) {

        const blogs =
            JSON.parse(localStorage.getItem("blogspaceBlogs")) || [];

        const blog = blogs.find(function (blog) {
            return blog.id === Number(editingBlogId);
        });

        if (blog) {

            // Change heading
            document.getElementById("blogFormTitle").textContent =
                "Edit Blog";

            // Change button
            document.getElementById("blogSubmitButton").textContent =
                "Save Changes";

            // Fill existing values
            document.getElementById("blogTitle").value =
                blog.title;

            document.getElementById("blogCategory").value =
                blog.category;

            document.getElementById("blogContent").value =
                blog.content;
        }
    }


    // Handle form submission
    blogForm.addEventListener("submit", function (event) {

        event.preventDefault();

        // Get blog details
        const title =
            document.getElementById("blogTitle").value.trim();

        const category =
            document.getElementById("blogCategory").value;

        const content =
            document.getElementById("blogContent").value.trim();


        // Get existing blogs
        const blogs =
            JSON.parse(localStorage.getItem("blogspaceBlogs")) || [];


        // ===============================
        // EDIT EXISTING BLOG
        // ===============================

        if (editingBlogId) {

            const blogIndex = blogs.findIndex(function (blog) {
                return blog.id === Number(editingBlogId);
            });

            if (blogIndex !== -1) {

                blogs[blogIndex].title = title;
                blogs[blogIndex].category = category;
                blogs[blogIndex].content = content;

                localStorage.setItem(
                    "blogspaceBlogs",
                    JSON.stringify(blogs)
                );

                // Remove editing mode
                localStorage.removeItem("editingBlogId");

                alert("Blog updated successfully!");

                window.location.href = "dashboard.html";

                return;
            }
        }


        // ===============================
        // CREATE NEW BLOG
        // ===============================

        const blog = {

            id: Date.now(),

            title: title,

            category: category,

            content: content,

            author: "You",

            date: new Date().toLocaleDateString(),

            status: "Published"
        };


        // Add new blog
        blogs.push(blog);


        // Save blogs
        localStorage.setItem(
            "blogspaceBlogs",
            JSON.stringify(blogs)
        );


        alert("Blog published successfully!");


        // Go to dashboard
        window.location.href = "dashboard.html";

    });

}
// ===============================
// Dashboard - Display Blogs
// ===============================

const blogsContainer = document.getElementById("blogsContainer");

if (blogsContainer) {

    const blogs =
        JSON.parse(localStorage.getItem("blogspaceBlogs")) || [];

    if (blogs.length === 0) {

        blogsContainer.innerHTML = `
            <p>No blogs found. Create your first blog!</p>
        `;

    } else {

        blogsContainer.innerHTML = "";

        blogs.forEach(function (blog) {

            const blogCard = document.createElement("div");

            blogCard.className = "blog-card";

            blogCard.innerHTML = `
                <h3>${blog.title}</h3>

                <p>
                    ${blog.content}
                </p>

                <small>
                    Category: ${blog.category} |
                    Date: ${blog.date} |
                    Status: ${blog.status}
                </small>

                <div class="blog-actions">

                    <button onclick="editBlog(${blog.id})">
                        Edit
                    </button>

                    <button onclick="deleteBlog(${blog.id})">
                        Delete
                    </button>

                </div>
            `;

            blogsContainer.appendChild(blogCard);

        });

    }
}

// ===============================
// Dashboard - Statistics
// ===============================

const totalBlogsElement = document.getElementById("totalBlogs");
const publishedBlogsElement = document.getElementById("publishedBlogs");
const draftBlogsElement = document.getElementById("draftBlogs");

if (
    totalBlogsElement &&
    publishedBlogsElement &&
    draftBlogsElement
) {

    const blogs =
        JSON.parse(localStorage.getItem("blogspaceBlogs")) || [];

    const totalBlogs = blogs.length;

    const publishedBlogs = blogs.filter(function (blog) {
        return blog.status === "Published";
    }).length;

    const draftBlogs = blogs.filter(function (blog) {
        return blog.status === "Draft";
    }).length;

    totalBlogsElement.textContent = totalBlogs;
    publishedBlogsElement.textContent = publishedBlogs;
    draftBlogsElement.textContent = draftBlogs;
}
// ===============================
// BlogSpace - Delete Blog
// ===============================

function deleteBlog(blogId) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this blog?"
    );

    if (!confirmDelete) {
        return;
    }

    // Get existing blogs
    const blogs =
        JSON.parse(localStorage.getItem("blogspaceBlogs")) || [];

    // Remove selected blog
    const updatedBlogs = blogs.filter(function (blog) {
        return blog.id !== blogId;
    });

    // Save updated blogs
    localStorage.setItem(
        "blogspaceBlogs",
        JSON.stringify(updatedBlogs)
    );

    alert("Blog deleted successfully!");

    // Refresh dashboard
    window.location.reload();
}
// ===============================
// BlogSpace - Edit Blog
// ===============================

function editBlog(blogId) {

    // Get existing blogs
    const blogs =
        JSON.parse(localStorage.getItem("blogspaceBlogs")) || [];

    // Find selected blog
    const blog = blogs.find(function (blog) {
        return blog.id === blogId;
    });

    if (!blog) {
        alert("Blog not found!");
        return;
    }

    // Save the blog ID for editing
    localStorage.setItem("editingBlogId", blogId);

    // Open create blog page
    window.location.href = "create-blog.html";
}

// ===============================
// BlogSpace - Logout
// ===============================

function logout() {

    // Remove login status
    localStorage.removeItem("isLoggedIn");

    alert("You have been logged out successfully!");

    // Go to login page
    window.location.href = "login.html";
}
// ===============================
// BlogSpace - Home Page Blogs
// ===============================

const homeBlogsContainer =
    document.getElementById("homeBlogsContainer");

if (homeBlogsContainer) {

    const blogs =
        JSON.parse(localStorage.getItem("blogspaceBlogs")) || [];

    if (blogs.length === 0) {

        homeBlogsContainer.innerHTML = `
            <p>No blogs available yet. Be the first to create one!</p>
        `;

    } else {

        homeBlogsContainer.innerHTML = "";

        // Show newest blogs first
        const latestBlogs = [...blogs].reverse();

        latestBlogs.forEach(function (blog) {

            const blogCard = document.createElement("article");

            blogCard.className = "blog-card";

            blogCard.innerHTML = `
    <h3>${blog.title}</h3>

    <p class="blog-author">
        By ${blog.author}
    </p>

    <p>
        ${blog.content}
    </p>

    <small>
        Category: ${blog.category} |
        Date: ${blog.date}
    </small>

    <br><br>

    <a
        href="blog.html?id=${blog.id}"
        class="read-more"
    >
        Read More →
    </a>
`;

            homeBlogsContainer.appendChild(blogCard);

        });

    }
}
// ===============================
// BlogSpace - Blog Details
// ===============================

const blogDetailsContainer =
    document.getElementById("blogDetailsContainer");

if (blogDetailsContainer) {

    const urlParams =
        new URLSearchParams(window.location.search);

    const blogId =
        Number(urlParams.get("id"));

    const blogs =
        JSON.parse(localStorage.getItem("blogspaceBlogs")) || [];

    const blog = blogs.find(function (blog) {
        return blog.id === blogId;
    });

    if (blog) {

        blogDetailsContainer.innerHTML = `

            <h1>${blog.title}</h1>

            <p class="blog-author">
                By ${blog.author}
            </p>

            <p>
                Category: ${blog.category}
            </p>

            <p>
                Date: ${blog.date}
            </p>

            <hr>

            <div class="blog-content">

                <p>
                    ${blog.content}
                </p>

            </div>

            <br>

            <a href="index.html" class="btn">
                ← Back to Home
            </a>

        `;

    } else {

        blogDetailsContainer.innerHTML = `

            <h2>Blog Not Found</h2>

            <p>
                Sorry, this blog could not be found.
            </p>

            <br>

            <a href="index.html" class="btn">
                ← Back to Home
            </a>

        `;
    }
}