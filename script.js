// ============================================
// VERDORA - LE JARDIN SECRET
// Restaurant Website Scripts
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // ADVANCED MENU BOOK SWIPE NAVIGATION
    // ============================================
    const bookViewer = document.getElementById('book-viewer');
    const pagesWrapper = document.getElementById('pages-wrapper');
    const pageSlides = document.querySelectorAll('.page-slide');
    const dots = document.querySelectorAll('.dot');
    const currentPageSpan = document.getElementById('current-page');
    const swipeLeft = document.getElementById('swipe-left');
    const swipeRight = document.getElementById('swipe-right');

    let currentPage = 0;
    const totalPages = pageSlides.length;
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let startTime = 0;

    // Update page display
    function updatePageDisplay() {
        // Update transform
        pagesWrapper.style.transform = `translateX(-${currentPage * 100}%)`;

        // Update active states
        pageSlides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            if (index === currentPage) {
                slide.classList.add('active');
            } else if (index === currentPage - 1) {
                slide.classList.add('prev');
            } else if (index === currentPage + 1) {
                slide.classList.add('next');
            }
        });

        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });

        // Update counter
        currentPageSpan.textContent = currentPage + 1;

        // Update arrow visibility
        if (swipeLeft) swipeLeft.style.opacity = currentPage === 0 ? '0.3' : '1';
        if (swipeRight) swipeRight.style.opacity = currentPage === totalPages - 1 ? '0.3' : '1';
    }

    // Go to specific page
    function goToPage(pageIndex) {
        if (pageIndex >= 0 && pageIndex < totalPages) {
            currentPage = pageIndex;
            updatePageDisplay();
        }
    }

    // Navigate to previous/next page
    function goToPrevPage() {
        if (currentPage > 0) goToPage(currentPage - 1);
    }

    function goToNextPage() {
        if (currentPage < totalPages - 1) goToPage(currentPage + 1);
    }

    // Touch/Mouse event handlers
    function handleStart(e) {
        isDragging = true;
        startTime = Date.now();
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        currentX = startX;
        pagesWrapper.style.transition = 'none';
    }

    function handleMove(e) {
        if (!isDragging) return;

        e.preventDefault();
        currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
        const diff = currentX - startX;
        const offset = -currentPage * 100;
        const dragPercent = (diff / bookViewer.offsetWidth) * 100;

        // Apply drag with resistance at boundaries
        let finalOffset = offset + dragPercent;
        if (currentPage === 0 && diff > 0) {
            finalOffset = offset + dragPercent * 0.3; // Resistance at start
        } else if (currentPage === totalPages - 1 && diff < 0) {
            finalOffset = offset + dragPercent * 0.3; // Resistance at end
        }

        pagesWrapper.style.transform = `translateX(${finalOffset}%)`;
    }

    function handleEnd(e) {
        if (!isDragging) return;

        isDragging = false;
        pagesWrapper.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';

        const diff = currentX - startX;
        const timeElapsed = Date.now() - startTime;
        const velocity = Math.abs(diff) / timeElapsed;

        // Determine if swipe was significant
        const threshold = bookViewer.offsetWidth * 0.2; // 20% of width
        const fastSwipe = velocity > 0.5; // Fast swipe

        if ((diff < -threshold || (diff < -50 && fastSwipe)) && currentPage < totalPages - 1) {
            goToNextPage();
        } else if ((diff > threshold || (diff > 50 && fastSwipe)) && currentPage > 0) {
            goToPrevPage();
        } else {
            updatePageDisplay(); // Snap back
        }
    }

    // Mouse events
    if (bookViewer) {
        bookViewer.addEventListener('mousedown', handleStart);
        bookViewer.addEventListener('mousemove', handleMove);
        bookViewer.addEventListener('mouseup', handleEnd);
        bookViewer.addEventListener('mouseleave', handleEnd);

        // Touch events
        bookViewer.addEventListener('touchstart', handleStart, { passive: false });
        bookViewer.addEventListener('touchmove', handleMove, { passive: false });
        bookViewer.addEventListener('touchend', handleEnd);

        // Prevent context menu on long press
        bookViewer.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    // Arrow click handlers
    if (swipeLeft) {
        swipeLeft.addEventListener('click', (e) => {
            e.stopPropagation();
            goToPrevPage();
        });
    }

    if (swipeRight) {
        swipeRight.addEventListener('click', (e) => {
            e.stopPropagation();
            goToNextPage();
        });
    }

    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => goToPage(index));
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') goToPrevPage();
        if (e.key === 'ArrowRight') goToNextPage();
    });

    // Initialize
    updatePageDisplay();

    // ============================================
    // SMOOTH SCROLL FOR NAVIGATION LINKS
    // ============================================
    const navLinks = document.querySelectorAll('.navbar a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ============================================
    // SCROLL INDICATOR FUNCTIONALITY
    // ============================================
    const scrollIndicator = document.querySelector('.scroll-indicator');

    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                navbar.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });

        // Hide scroll indicator after scrolling
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                scrollIndicator.style.opacity = '0';
            } else {
                scrollIndicator.style.opacity = '1';
            }
        });
    }

    // ============================================
    // INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
    // ============================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe menu items
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
        observer.observe(item);
    });

    // Observe offer cards
    const offerCards = document.querySelectorAll('.offer-card');
    offerCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });

    // Observe contact cards
    const contactCards = document.querySelectorAll('.contact-card');
    contactCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        card.style.transition = `opacity 0.6s ease ${index * 0.2}s, transform 0.6s ease ${index * 0.2}s`;
        observer.observe(card);
    });

    // ============================================
    // ACTIVE NAVIGATION HIGHLIGHTING
    // ============================================
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.navbar a[href="#${sectionId}"]`);

            if (navLink) {
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLink.style.color = 'var(--accent-green)';
                    navLink.style.fontWeight = '700';
                } else {
                    navLink.style.color = 'var(--primary-green)';
                    navLink.style.fontWeight = '600';
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Call on load

    // ============================================
    // NAVBAR BACKGROUND ON SCROLL
    // ============================================
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = 'var(--white)';
        }
    });

    // ============================================
    // ANIMATE SECTION TITLES ON SCROLL
    // ============================================
    const sectionTitles = document.querySelectorAll('.section-title');

    sectionTitles.forEach(title => {
        title.style.opacity = '0';
        title.style.transform = 'translateY(30px)';
        title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

        const titleObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.5 });

        titleObserver.observe(title);
    });

    // ============================================
    // ADD HOVER EFFECT TO PRICES
    // ============================================
    const prices = document.querySelectorAll('.price');

    prices.forEach(price => {
        price.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s ease';
        });

        price.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // ============================================
    // CONSOLE MESSAGE
    // ============================================
    console.log('%c🌿 Verdora - Le Jardin Secret 🌿', 'color: #4a7c2e; font-size: 20px; font-weight: bold;');
    console.log('%cCuisine Saine & Naturelle', 'color: #6b9d3e; font-size: 14px;');

});
