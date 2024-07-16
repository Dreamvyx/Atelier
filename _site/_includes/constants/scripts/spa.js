class SPAHandler {
    constructor() {
        this.contentElement = document.getElementById('dynamic-content');
        this.routes = {
            home: '_includes/pages/home.html',
            arts: '_includes/pages/arts.html',
            philosophy: '_includes/pages/philosophy.html',
            writing: '_includes/pages/writing.html',
            more: '_includes/pages/more.html',
            bio: '_includes/pages/bio-more.html'
        };
        this.defaultRoute = 'home';
        this.errorPage = '_includes/pages/404.html';
        this.transitionDuration = 300; // ms
    }

    init() {
        this.handleRoute();
        this.addMenuListeners();
        window.addEventListener('hashchange', () => this.handleRoute());
    }

    handleRoute() {
        const hash = window.location.hash.slice(1) || this.defaultRoute;
        this.loadDynamicContent(hash);
        this.updateActiveMenuDot(hash);
    }

    async loadDynamicContent(route) {
        const contentUrl = this.routes[route] || this.errorPage;

        try {
            await this.fadeOut();
            const html = await this.fetchContent(contentUrl);
            this.contentElement.innerHTML = html;
            await this.fadeIn();
        } catch (error) {
            console.error('Error loading content:', error);
            this.contentElement.innerHTML = '<div class="error-container" style="display: flex; justify-content: center; align-items: center; height: 90%; width: 100%;"><p class="error" style="text-align: center; margin: 0; padding: 20px; max-width: 80%;">This page is either under repair or does not exist</p></div>';
            this.contentElement.style.opacity = '1';
        }
    }

    fadeOut() {
        return new Promise(resolve => {
            this.contentElement.style.opacity = '0';
            setTimeout(resolve, this.transitionDuration);
        });
    }

    fadeIn() {
        return new Promise(resolve => {
            setTimeout(() => {
                this.contentElement.style.opacity = '1';
                resolve();
            }, 50);
        });
    }

    async fetchContent(url) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Content not found');
        }
        return response.text();
    }

    addMenuListeners() {
        document.querySelectorAll('.menu-icon').forEach(dot => {
            dot.addEventListener('click', (event) => {
                event.preventDefault();
                const page = dot.getAttribute('data-title').toLowerCase();
                this.navigateToPage(page);
            });
        });
    }

    navigateToPage(page) {
        window.location.hash = page;
    }

    updateActiveMenuDot(route) {
        document.querySelectorAll('.menu-icon').forEach(dot => {
            const dotPage = dot.getAttribute('data-title').toLowerCase();
            dot.classList.toggle('active', route === dotPage);
        });
    }
}

// Initialize the SPA handler
document.addEventListener('DOMContentLoaded', () => {
    const spaHandler = new SPAHandler();
    spaHandler.init();
});
