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

    // Render Messages Table (with data-label for mobile card fallback)
    const messagesTableBody = document.getElementById('messages-table-body');
    const recentMessagesBody = document.getElementById('recent-messages-body');

    function renderMessages() {
        const rowsHtml = messages.map(msg => `
            <tr data-id="${msg.id}">
                <td data-label="Sender"><strong>${msg.sender}</strong><br><small style="color:#6b7280">${msg.email}</small></td>
                <td data-label="Subject">${msg.subject}</td>
                <td data-label="Message" style="max-width: 250px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${msg.message}</td>
                <td data-label="Date">${msg.date}</td>
                <td data-label="Status">
                    <span class="badge ${msg.status === 'unread' ? 'badge-unread' : 'badge-read'}">
                        ${msg.status.toUpperCase()}
                    </span>
                </td>
                <td data-label="Actions">
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
    window.editProject = function (id) {
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

    window.deleteProject = function (id) {
        if (confirm('Are you sure you want to delete this project?')) {
            projects = projects.filter(p => p.id !== id);
            saveProjects();
            showToast('Project deleted', 'info');
        }
    };

    window.toggleMessageStatus = function (id) {
        const msg = messages.find(m => m.id === id);
        if (msg) {
            msg.status = msg.status === 'unread' ? 'read' : 'unread';
            saveMessages();
            showToast(`Message marked as ${msg.status}`);
        }
    };

    window.deleteMessage = function (id) {
        if (confirm('Delete this message?')) {
            messages = messages.filter(m => m.id !== id);
            saveMessages();
            showToast('Message deleted');
        }
    };

    // ==========================================
    // PAGE MODIFICATION SYNC LOGIC
    // ==========================================

    // 1. Bio & Skills Editor
    const bioForm = document.getElementById('bio-editor-form');
    const bioHeroInput = document.getElementById('bio-hero-input');
    const bioBackendInput = document.getElementById('bio-backend-input');
    const bioFrontendInput = document.getElementById('bio-frontend-input');
    const bioStrengthInput = document.getElementById('bio-strength-input');
    const bioWeaknessInput = document.getElementById('bio-weakness-input');

    // Load existing Bio data
    const savedBio = localStorage.getItem('admin_bio');
    if (savedBio) {
        try {
            const bioData = JSON.parse(savedBio);
            if (bioHeroInput) bioHeroInput.value = bioData.hero || '';
            if (bioBackendInput) bioBackendInput.value = bioData.backend || '';
            if (bioFrontendInput) bioFrontendInput.value = bioData.frontend || '';
            if (bioStrengthInput) bioStrengthInput.value = bioData.strength || '';
            if (bioWeaknessInput) bioWeaknessInput.value = bioData.weakness || '';
        } catch (e) {
            console.error('Error loading bio data', e);
        }
    }

    if (bioForm) {
        bioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const bioData = {
                hero: bioHeroInput.value,
                backend: bioBackendInput.value,
                frontend: bioFrontendInput.value,
                strength: bioStrengthInput.value,
                weakness: bioWeaknessInput.value
            };
            localStorage.setItem('admin_bio', JSON.stringify(bioData));
            showToast('Profile & Bio settings saved and applied to live site!');
        });
    }

    // 2. Site Settings Editor
    const settingsForm = document.getElementById('settings-form');
    const settingTitleInput = document.getElementById('setting-title-input');
    const settingGithubInput = document.getElementById('setting-github-input');
    const settingLinkedinInput = document.getElementById('setting-linkedin-input');
    const settingMaintenanceInput = document.getElementById('setting-maintenance-input');

    // Load existing Settings data
    const savedSettings = localStorage.getItem('admin_settings');
    if (savedSettings) {
        try {
            const settingsData = JSON.parse(savedSettings);
            if (settingTitleInput) settingTitleInput.value = settingsData.title || '';
            if (settingGithubInput) settingGithubInput.value = settingsData.github || '';
            if (settingLinkedinInput) settingLinkedinInput.value = settingsData.linkedin || '';
            if (settingMaintenanceInput) settingMaintenanceInput.value = settingsData.maintenance || 'off';
        } catch (e) {
            console.error('Error loading settings data', e);
        }
    }

    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const settingsData = {
                title: settingTitleInput.value,
                github: settingGithubInput.value,
                linkedin: settingLinkedinInput.value,
                maintenance: settingMaintenanceInput.value
            };
            localStorage.setItem('admin_settings', JSON.stringify(settingsData));
            showToast('Global settings saved successfully!');
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

    // ==========================================
    // SEARCH FUNCTIONALITY
    // ==========================================
    const searchInput = document.querySelector('.search-input');
    const searchBox = document.querySelector('.search-box');

    if (searchInput && searchBox) {
        // Create search results dropdown
        const searchDropdown = document.createElement('div');
        searchDropdown.className = 'search-dropdown';
        searchDropdown.style.cssText = `
            position: absolute; top: 100%; left: 0; right: 0; margin-top: 6px;
            background: #ffffff; border: 1px solid var(--border-glass, rgba(212,175,55,0.2));
            border-radius: 14px; box-shadow: 0 12px 30px rgba(212,175,55,0.15);
            max-height: 350px; overflow-y: auto; z-index: 200;
            display: none; padding: 0.5rem 0;
        `;
        searchBox.style.position = 'relative';
        searchBox.appendChild(searchDropdown);

        function performSearch(query) {
            if (!query || query.length < 2) {
                searchDropdown.style.display = 'none';
                return;
            }

            const q = query.toLowerCase();
            const results = [];

            // Search projects
            projects.forEach(proj => {
                const matchFields = [proj.title, proj.description, ...proj.tags].join(' ').toLowerCase();
                if (matchFields.includes(q)) {
                    results.push({
                        type: 'project',
                        icon: 'fa-laptop-code',
                        title: proj.title,
                        subtitle: proj.tags.slice(0, 3).join(', '),
                        tab: 'projects',
                        id: proj.id
                    });
                }
            });

            // Search messages
            messages.forEach(msg => {
                const matchFields = [msg.sender, msg.email, msg.subject, msg.message].join(' ').toLowerCase();
                if (matchFields.includes(q)) {
                    results.push({
                        type: 'message',
                        icon: 'fa-envelope',
                        title: msg.subject,
                        subtitle: `From: ${msg.sender}`,
                        tab: 'messages',
                        id: msg.id
                    });
                }
            });

            // Render results
            if (results.length === 0) {
                searchDropdown.innerHTML = `
                    <div style="padding: 1.25rem; text-align: center; color: #78716c; font-size: 0.88rem;">
                        <i class="fa-solid fa-magnifying-glass" style="font-size: 1.5rem; color: rgba(212,175,55,0.3); display: block; margin-bottom: 0.5rem;"></i>
                        No results found for "<strong>${query}</strong>"
                    </div>
                `;
            } else {
                searchDropdown.innerHTML = `
                    <div style="padding: 0.4rem 1rem 0.3rem; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #a8a29e;">
                        ${results.length} result${results.length > 1 ? 's' : ''} found
                    </div>
                    ${results.map(r => `
                        <div class="search-result-item" data-tab="${r.tab}" data-id="${r.id}" style="
                            display: flex; align-items: center; gap: 0.85rem; padding: 0.7rem 1rem;
                            cursor: pointer; transition: all 0.2s ease; border-left: 3px solid transparent;
                        " onmouseover="this.style.background='rgba(212,175,55,0.06)'; this.style.borderLeftColor='#d4af37';"
                           onmouseout="this.style.background=''; this.style.borderLeftColor='transparent';">
                            <div style="width: 36px; height: 36px; border-radius: 10px;
                                background: rgba(212,175,55,0.1); display: flex; align-items: center;
                                justify-content: center; flex-shrink: 0;">
                                <i class="fa-solid ${r.icon}" style="color: #aa7c11; font-size: 0.85rem;"></i>
                            </div>
                            <div style="flex: 1; min-width: 0;">
                                <div style="font-size: 0.88rem; font-weight: 600; color: #1c1917;
                                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${r.title}</div>
                                <div style="font-size: 0.75rem; color: #78716c; margin-top: 1px;">${r.subtitle}</div>
                            </div>
                            <span style="font-size: 0.68rem; font-weight: 700; text-transform: uppercase;
                                letter-spacing: 0.5px; padding: 2px 8px; border-radius: 6px;
                                background: ${r.type === 'project' ? 'rgba(212,175,55,0.1)' : 'rgba(16,185,129,0.1)'};
                                color: ${r.type === 'project' ? '#aa7c11' : '#10b981'};">
                                ${r.type}
                            </span>
                        </div>
                    `).join('')}
                `;
            }

            searchDropdown.style.display = 'block';

            // Add click handlers to results
            searchDropdown.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const tab = item.getAttribute('data-tab');
                    const id = item.getAttribute('data-id');

                    // Navigate to the tab
                    const navItem = document.querySelector(`.nav-item[data-tab="${tab}"]`);
                    if (navItem) navItem.click();

                    // Highlight the matching element
                    setTimeout(() => {
                        let targetEl;
                        if (tab === 'projects') {
                            targetEl = document.querySelector(`.admin-project-card[data-id="${id}"]`);
                        } else if (tab === 'messages') {
                            targetEl = document.querySelector(`#tab-messages tr[data-id="${id}"]`);
                        }

                        if (targetEl) {
                            targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            targetEl.style.outline = '2px solid #d4af37';
                            targetEl.style.outlineOffset = '4px';
                            targetEl.style.transition = 'outline 0.3s ease';
                            setTimeout(() => {
                                targetEl.style.outline = '';
                                targetEl.style.outlineOffset = '';
                            }, 2500);
                        }
                    }, 200);

                    // Close dropdown & clear search
                    searchDropdown.style.display = 'none';
                    searchInput.value = '';
                });
            });
        }

        // Live search on typing (debounced)
        let searchDebounce;
        searchInput.addEventListener('input', () => {
            clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
                performSearch(searchInput.value.trim());
            }, 250);
        });

        // Search on Enter
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                clearTimeout(searchDebounce);
                performSearch(searchInput.value.trim());
            }
            if (e.key === 'Escape') {
                searchDropdown.style.display = 'none';
                searchInput.blur();
            }
        });

        // Close dropdown on click outside
        document.addEventListener('click', (e) => {
            if (!searchBox.contains(e.target)) {
                searchDropdown.style.display = 'none';
            }
        });

        // Make search icon clickable
        const searchIcon = searchBox.querySelector('i');
        if (searchIcon) {
            searchIcon.style.cursor = 'pointer';
            searchIcon.addEventListener('click', () => {
                performSearch(searchInput.value.trim());
            });
        }
    }

    // Mobile Sidebar Toggle
    const sidebar = document.getElementById('admin-sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('open');
        if (sidebarOverlay) sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('open');
        if (sidebarOverlay) sidebarOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scroll
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', openSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when a nav item is clicked (mobile)
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });

    // Auto-close sidebar on window resize past mobile breakpoint
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                closeSidebar();
            }
        }, 150);
    });

    // Swipe-to-close sidebar gesture (touch devices)
    if (sidebar) {
        let touchStartX = 0;
        let touchCurrentX = 0;
        let isSwiping = false;

        sidebar.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isSwiping = true;
        }, { passive: true });

        sidebar.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            touchCurrentX = e.touches[0].clientX;
            const diff = touchStartX - touchCurrentX;

            // Only allow swiping left (to close)
            if (diff > 0 && sidebar.classList.contains('open')) {
                const translateX = Math.min(diff, 280);
                sidebar.style.transform = `translateX(-${translateX}px)`;
                sidebar.style.transition = 'none';
            }
        }, { passive: true });

        sidebar.addEventListener('touchend', () => {
            if (!isSwiping) return;
            isSwiping = false;
            const diff = touchStartX - touchCurrentX;

            sidebar.style.transition = '';
            sidebar.style.transform = '';

            // Close if swiped more than 80px left
            if (diff > 80 && sidebar.classList.contains('open')) {
                closeSidebar();
            }
        }, { passive: true });
    }
});

