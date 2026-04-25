const pageLoader = document.getElementById("pageLoader");
const siteHeader = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");
const navLinks = Array.from(document.querySelectorAll(".site-nav .nav-link")).filter(
    (link) => !link.classList.contains("nav-link-cta")
);
const allAnchorLinks = Array.from(document.querySelectorAll('a[href^="#"]'));
const revealItems = document.querySelectorAll(".reveal");
const statValues = document.querySelectorAll(".stat-value[data-count]");
const backToTop = document.getElementById("backToTop");
const scrollProgress = document.getElementById("scrollProgress");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const closeNavigation = () => {
    siteNav.classList.remove("is-open");
    document.body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.innerHTML = '<i class="bi bi-list"></i>';
};

const openNavigation = () => {
    siteNav.classList.add("is-open");
    document.body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
    navToggle.innerHTML = '<i class="bi bi-x-lg"></i>';
};

const headerOffset = () => siteHeader.offsetHeight + 22;

const setActiveLink = (id) => {
    navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
};

const animateCount = (element) => {
    if (element.dataset.animated === "true") {
        return;
    }

    element.dataset.animated = "true";
    const target = Number(element.dataset.count);

    if (prefersReducedMotion) {
        element.textContent = String(target);
        return;
    }

    const duration = 1400;
    const start = performance.now();

    const updateValue = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(target * eased));

        if (progress < 1) {
            window.requestAnimationFrame(updateValue);
        } else {
            element.textContent = String(target);
        }
    };

    window.requestAnimationFrame(updateValue);
};

const updateScrollState = () => {
    const scrollTop = window.scrollY;
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? scrollTop / scrollableHeight : 0;

    scrollProgress.style.transform = `scaleX(${progress})`;
    backToTop.classList.toggle("is-visible", scrollTop > 480);
    siteHeader.classList.toggle("is-scrolled", scrollTop > 16);
};

navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.contains("is-open");
    if (isOpen) {
        closeNavigation();
    } else {
        openNavigation();
    }
});

document.addEventListener("click", (event) => {
    if (!siteHeader.contains(event.target) && siteNav.classList.contains("is-open")) {
        closeNavigation();
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 960) {
        closeNavigation();
    }
});

allAnchorLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("href");
        if (!targetId || targetId === "#") {
            return;
        }

        const targetElement = document.querySelector(targetId);
        if (!targetElement) {
            return;
        }

        event.preventDefault();

        const top = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset();
        window.scrollTo({
            top,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });

        closeNavigation();
    });
});

if (prefersReducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    statValues.forEach(animateCount);
} else {
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -10% 0px"
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const statObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.55
        }
    );

    statValues.forEach((item) => statObserver.observe(item));
}

const observedSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.id);
            }
        });
    },
    {
        rootMargin: "-38% 0px -48% 0px",
        threshold: 0.12
    }
);

observedSections.forEach((section) => sectionObserver.observe(section));

window.addEventListener("load", () => {
    window.setTimeout(() => {
        if (pageLoader) {
            pageLoader.classList.add("is-hidden");
        }
    }, 320);
});

window.addEventListener("scroll", updateScrollState, { passive: true });
updateScrollState();

document.getElementById("currentYear").textContent = new Date().getFullYear();
