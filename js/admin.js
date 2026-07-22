/* ===================================================================
 * Portfolio Web Admin Panel JS - Interactive Logic & LocalStorage
 * =================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initial Projects Data
    const defaultProjects = [
        {
            id: 1,
            title: "abbas threads",
            description: "Real-time full-stack e-commerce customizer store with interactive product preview.",
            tags: ["React", "Node.js", "Express", "MySQL"],
            image: "tshirt_project.png",
            url: "https://t-shirtmart24.vercel.app/"
        },
        {
            id: 2,
            title: "Apple Web",
            description: "Minimalist Apple homepage clone featuring smooth animations and high-res asset rendering.",
            tags: ["HTML5", "CSS3", "JavaScript"],
            image: "ne.jpg",
            url: "https://clone-proj-2-abbas.netlify.app/"
        },
        {
            id: 3,
            title: "Gym Web",
            description: "Fitness web app designed for client tracking, workout routines, and subscription plans.",
            tags: ["React", "Tailwind", "Vite"],
            image: "gy.jpg",
            url: "https://gymforabbas.netlify.app/"
        },
        {
            id: 4,
            title: "Best Sign Up",
            description: "Modern interactive user authentication and onboarding flow.",
            tags: ["JavaScript", "CSS3", "Form Validation"],
            image: "sign.jpg",
            url: "https://form-abbas.netlify.app/"
        },
        {
            id: 5,
            title: "Acoder Blog",
            description: "Developer blogging platform for sharing technology tutorials and coding insights.",
            tags: ["Python", "FastAPI", "Markdown"],
            image: "bos.jpg",
            url: "https://acoderwritter.netlify.app/"
        },
        {
            id: 6,
            title: "Calculator",
            description: "Accurate web calculator with custom themes and expression history.",
            tags: ["JavaScript", "Algorithms", "CSS Grid"],
            image: "calcu.png",
            url: "https://welcomeacoder.netlify.app/"
        }
    ];

    // Initial Messages Data
    const defaultMessages = [
        {
            id: 101,
            sender: "David Miller",
            email: "david@techcorp.io",
            subject: "Full Stack Developer Contract",
            message: "Hi Mohammed, we loved your T-Shirt Mart project! Are you available for a 3-month contract starting next month?",
            date: "2026-07-20",
            status: "unread"
        },
        {
            id: 102,
            sender: "Sarah Jenkins",
            email: "sarah.j@designstudio.com",
            subject: "UI/UX Consultation Request",
            message: "Hello Abbas, I reviewed your portfolio and would like to consult on a web app UI redesign.",
            date: "2026-07-18",
            status: "read"
        },
        {
            id: 103,
            sender: "Alex Rivera",
            email: "alex@startupnest.org",
            subject: "Collab Project Inquiry",
            message: "Hey! We are building a new SaaS platform and would like you on our frontend team.",
            date: "2026-07-15",
            status: "read"
        }
    ];

    // Load from LocalStorage or Set Defaults
    let projects = JSON.parse(localStorage.getItem('admin_projects')) || defaultProjects;
    let messages = JSON.parse(localStorage.getItem('admin_messages')) || defaultMessages;

    // Guarantee initial storage exists
    if (!localStorage.getItem('admin_projects')) {
        localStorage.setItem('admin_projects', JSON.stringify(projects));
    }
    if (!localStorage.getItem('admin_messages')) {
        localStorage.setItem('admin_messages', JSON.stringify(messages));
    }

    // Save helpers
    function saveProjects() {
        localStorage.setItem('admin_projects', JSON.stringify(projects));
        renderProjects();
        updateDashboardStats();
    }

    function saveMessages() {
        localStorage.setItem('admin_messages', JSON.stringify(messages));
        renderMessages();
        updateDashboardStats();
    }

    // Tab Navigation Switcher
    const navItems = document.querySelectorAll('.nav-item[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');

            navItems.forEach(n => n.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            item.classList.add('active');
            const targetEl = document.getElementById(`tab-${targetTab}`);
            if (targetEl) targetEl.classList.add('active');
        });
    });

    // Render Projects Grid
    const projectsGrid = document.getElementById('admin-projects-grid');
    function renderProjects() {
        if (!projectsGrid) return;

        projectsGrid.innerHTML = projects.map(proj => `
            <div class="admin-project-card" data-id="${proj.id}">
                <div class="project-img-holder">
                    <img src="${proj.image}" alt="${proj.title}" onerror="this.src='bos.jpg'">
                </div>
                <div class="project-details">
                    <h4>${proj.title}</h4>
                    <p>${proj.description}</p>
                    <div class="project-tags">
                        ${proj.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
                    </div>
                    <div class="project-card-actions">
                        <a href="${proj.url}" target="_blank" class="icon-btn" title="View Demo">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i>
                        </a>
                        <div class="icon-btn-group">
                            <button class="icon-btn edit-proj-btn" onclick="editProject(${proj.id})" title="Edit">
                                <i class="fa-solid fa-pen-to-square"></i>
                            </button>
                            <button class="icon-btn danger delete-proj-btn" onclick="deleteProject(${proj.id})" title="Delete">
                                <i class="fa-solid fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Render Messages Table
    const messagesTableBody = document.getElementById('messages-table-body');
    const recentMessagesBody = document.getElementById('recent-messages-body');

    function renderMessages() {
        const rowsHtml = messages.map(msg => `
            <tr data-id="${msg.id}">
                <td><strong>${msg.sender}</strong><br><small style="color:#6b7280">${msg.email}</small></td>
                <td>${msg.subject}</td>
                <td style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${msg.message}</td>
                <td>${msg.date}</td>
                <td>
                    <span class="badge ${msg.status === 'unread' ? 'badge-unread' : 'badge-read'}">
                        ${msg.status.toUpperCase()}
                    </span>
                </td>
                <td>
                    <div class="icon-btn-group">
                        <button class="icon-btn" onclick="toggleMessageStatus(${msg.id})" title="Toggle Read Status">
                            <i class="fa-solid ${msg.status === 'unread' ? 'fa-envelope-open' : 'fa-envelope'}"></i>
                        </button>
                        <button class="icon-btn danger" onclick="deleteMessage(${msg.id})" title="Delete">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        if (messagesTableBody) messagesTableBody.innerHTML = rowsHtml;
        if (recentMessagesBody) recentMessagesBody.innerHTML = rowsHtml;
        
        // Update notification badge count
        const unreadCount = messages.filter(m => m.status === 'unread').length;
        const msgBadge = document.getElementById('msg-nav-badge');
        if (msgBadge) msgBadge.textContent = unreadCount;
    }

    // Update Stats Card Numbers
    function updateDashboardStats() {
        const totalProjEl = document.getElementById('stat-total-projects');
        const totalMsgEl = document.getElementById('stat-total-messages');

        if (totalProjEl) totalProjEl.textContent = projects.length;
        if (totalMsgEl) totalMsgEl.textContent = messages.length;
    }

    // Global Modal Handler
    const projectModal = document.getElementById('project-modal');
    const openModalBtn = document.getElementById('open-add-project-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            document.getElementById('project-form').reset();
            document.getElementById('modal-proj-id').value = '';
            document.getElementById('modal-title').textContent = 'Add New Project';
            projectModal.classList.add('active');
        });
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            projectModal.classList.remove('active');
        });
    });

    // Save/Update Project Form
    const projectForm = document.getElementById('project-form');
    if (projectForm) {
        projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const idVal = document.getElementById('modal-proj-id').value;
            const title = document.getElementById('proj-title-input').value;
            const description = document.getElementById('proj-desc-input').value;
            const tagsStr = document.getElementById('proj-tags-input').value;
            const url = document.getElementById('proj-url-input').value;
            const image = document.getElementById('proj-img-input').value || 'bos.jpg';

            const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

            if (idVal) {
                // Edit existing
                const index = projects.findIndex(p => p.id == idVal);
                if (index !== -1) {
                    projects[index] = { id: parseInt(idVal), title, description, tags, url, image };
                    showToast('Project updated successfully!');
                }
            } else {
                // Add new
                const newProject = {
                    id: Date.now(),
                    title,
                    description,
                    tags,
                    url,
                    image
                };
                projects.unshift(newProject);
                showToast('New Project added successfully!');
            }

            saveProjects();
            projectModal.classList.remove('active');
        });
    }

    // Expose window actions for dynamic buttons
    window.editProject = function(id) {
        const proj = projects.find(p => p.id === id);
        if (!proj) return;

        document.getElementById('modal-proj-id').value = proj.id;
        document.getElementById('proj-title-input').value = proj.title;
        document.getElementById('proj-desc-input').value = proj.description;
        document.getElementById('proj-tags-input').value = proj.tags.join(', ');
        document.getElementById('proj-url-input').value = proj.url;
        document.getElementById('proj-img-input').value = proj.image;

        document.getElementById('modal-title').textContent = 'Edit Project';
        projectModal.classList.add('active');
    };

    window.deleteProject = function(id) {
        if (confirm('Are you sure you want to delete this project?')) {
            projects = projects.filter(p => p.id !== id);
            saveProjects();
            showToast('Project deleted', 'info');
        }
    };

    window.toggleMessageStatus = function(id) {
        const msg = messages.find(m => m.id === id);
        if (msg) {
            msg.status = msg.status === 'unread' ? 'read' : 'unread';
            saveMessages();
            showToast(`Message marked as ${msg.status}`);
        }
    };

    window.deleteMessage = function(id) {
        if (confirm('Delete this message?')) {
            messages = messages.filter(m => m.id !== id);
            saveMessages();
            showToast('Message deleted');
        }
    };

    // Save Profile & Bio Form
    const bioForm = document.getElementById('bio-editor-form');
    if (bioForm) {
        bioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Profile & Bio settings saved to memory!');
        });
    }

    // Toast Notification System
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.borderColor = type === 'info' ? '#06b6d4' : '#10b981';
        toast.innerHTML = `
            <i class="fa-solid ${type === 'info' ? 'fa-circle-info' : 'fa-circle-check'}" style="color:${type === 'info' ? '#06b6d4' : '#10b981'}"></i>
            <span>${message}</span>
        `;

        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Initial Execution
    renderProjects();
    renderMessages();
    updateDashboardStats();
});
