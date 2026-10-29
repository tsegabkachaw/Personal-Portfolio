/* ============================================================
   main.js  —  Tsegab Kachaw  |  Portfolio
   Interactive functionality & micro-animations
   ============================================================ */

"use strict";

// ── Utility: wait for DOM ────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initSmoothScroll();
  initScrollReveal();
  initActiveNavHighlight();
  initTypedHero();
  initSkillBars();
  initChatWidget();
  initScrollToTop();
  updateFooterYear();
});


/* =============================================================
   1.  MOBILE NAVIGATION TOGGLE
   ============================================================= */
function initNavbar() {
  const toggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const header = document.getElementById("header");

  if (!toggle || !navLinks) return;

  // Hamburger open / close
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("nav-open");
    toggle.classList.toggle("active");
  });

  // Close menu when a link is clicked (mobile)
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("nav-open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  // Sticky / shrink header on scroll
  let lastScrollY = 0;
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 60) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }

    // Hide header on scroll-down, show on scroll-up
    if (currentScrollY > lastScrollY && currentScrollY > 300) {
      header.classList.add("header-hidden");
    } else {
      header.classList.remove("header-hidden");
    }
    lastScrollY = currentScrollY;
  });
}


/* =============================================================
   2.  SMOOTH SCROLL  (anchor links)
   ============================================================= */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerOffset = 70; // account for sticky header
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}


/* =============================================================
   3.  SCROLL REVEAL  — fade-in sections on viewport entry
   ============================================================= */
function initScrollReveal() {
  const sections = document.querySelectorAll(".section");

  // Add hidden class initially
  sections.forEach((sec) => sec.classList.add("reveal-hidden"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          entry.target.classList.remove("reveal-hidden");
          revealObserver.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((sec) => revealObserver.observe(sec));
}


/* =============================================================
   4.  ACTIVE NAV LINK HIGHLIGHT  (based on scroll position)
   ============================================================= */
function initActiveNavHighlight() {
  const navLinks = document.querySelectorAll(".nav-links a");
  const sectionIds = Array.from(navLinks).map((link) =>
    link.getAttribute("href").replace("#", "")
  );

  const highlightObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.remove("active"));
          const active = document.querySelector(
            `.nav-links a[href="#${entry.target.id}"]`
          );
          if (active) active.classList.add("active");
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sectionIds.forEach((id) => {
    const section = document.getElementById(id);
    if (section) highlightObserver.observe(section);
  });
}


/* =============================================================
   5.  TYPED HERO TEXT  — simple typewriter for the role tagline
   ============================================================= */
function initTypedHero() {
  const roleEl = document.querySelector(".hero-role");
  if (!roleEl) return;

  const phrases = [
    "Full Stack Developer & Software Engineering Student",
    "Building modern web experiences",
    "Turning ideas into code",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typeSpeed = 70;   // ms per character (typing)
  const deleteSpeed = 40; // ms per character (deleting)
  const pauseEnd = 2000;  // pause at full phrase

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      roleEl.textContent = current.substring(0, charIndex--);
    } else {
      roleEl.textContent = current.substring(0, charIndex++);
    }

    // Determine next action
    if (!isDeleting && charIndex === current.length + 1) {
      // Finished typing → pause then delete
      setTimeout(() => {
        isDeleting = true;
        type();
      }, pauseEnd);
      return;
    }

    if (isDeleting && charIndex < 0) {
      // Finished deleting → move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      charIndex = 0;
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed);
  }

  // Start after a short delay so reveal animation plays first
  setTimeout(type, 1200);
}


/* =============================================================
   6.  SKILL BARS / COUNTERS  — animate on scroll into view
   ============================================================= */
function initSkillBars() {
  const skillSection = document.getElementById("skills");
  if (!skillSection) return;

  let animated = false;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !animated) {
          animated = true;
          animateSkillItems();
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(skillSection);
}

function animateSkillItems() {
  const items = document.querySelectorAll(".skill-list li");
  items.forEach((item, i) => {
    // Staggered entrance
    item.style.transitionDelay = `${i * 60}ms`;
    item.classList.add("skill-visible");
  });
}


/* =============================================================
   7.  CHAT WIDGET TOGGLE  (placeholder UI)
   ============================================================= */
function initChatWidget() {
  const chatToggle = document.getElementById("chat-toggle");
  if (!chatToggle) return;

  // TODO: Replace with real chat panel in Phase 4
  chatToggle.addEventListener("click", () => {
    chatToggle.classList.toggle("chat-active");

    // Simple visual feedback for now
    const icon = chatToggle.querySelector(".chat-icon");
    if (icon) {
      icon.textContent = chatToggle.classList.contains("chat-active")
        ? "✕"
        : "💬";
    }
  });
}


/* =============================================================
   8.  SCROLL-TO-TOP BUTTON
   ============================================================= */
function initScrollToTop() {
  // Create button dynamically
  const btn = document.createElement("button");
  btn.id = "scroll-top";
  btn.className = "scroll-top-btn";
  btn.setAttribute("aria-label", "Scroll to top");
  btn.innerHTML = "↑";
  document.body.appendChild(btn);

  // Show / hide based on scroll position
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 500);
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}


/* =============================================================
   9.  FOOTER YEAR  — keep copyright year always current
   ============================================================= */
function updateFooterYear() {
  const footer = document.getElementById("footer");
  if (!footer) return;

  const yearStr = new Date().getFullYear().toString();
  const p = footer.querySelector("p");
  if (p) {
    p.innerHTML = p.innerHTML.replace(/\d{4}/, yearStr);
  }
}
