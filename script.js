
"use strict";

// ---------- Typing animation ----------
const typingText = document.getElementById("typingText");

const roles = [
  "Web Developer",
  "Frontend Developer",
  "Creative Coder",
  "Problem Solver"
];

let roleIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeRole() {
  if (!typingText) return;

  const currentRole = roles[roleIndex];

  if (deleting) {
    characterIndex--;
  } else {
    characterIndex++;
  }

  typingText.textContent = currentRole.slice(0, characterIndex);

  let delay = deleting ? 45 : 90;

  if (!deleting && characterIndex === currentRole.length) {
    deleting = true;
    delay = 1400;
  } else if (deleting && characterIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 350;
  }

  window.setTimeout(typeRole, delay);
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  typeRole();
} else if (typingText) {
  typingText.textContent = roles[0];
}

// ---------- Mobile navigation ----------
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
const navLinks = document.querySelectorAll(".nav-link");

function closeMenu() {
  nav?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");

  if (menuToggle) {
    menuToggle.textContent = "☰";
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
}

menuToggle?.addEventListener("click", () => {
  const isOpen = nav?.classList.toggle("open") ?? false;

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "✕" : "☰";
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// ---------- Dark/light theme ----------
const themeToggle = document.getElementById("themeToggle");
const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "light") {
  document.body.classList.add("light-mode");
}

function updateThemeButton() {
  const isLight = document.body.classList.contains("light-mode");

  if (themeToggle) {
    themeToggle.textContent = isLight ? "☾" : "☀";
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode"
    );
    themeToggle.title = isLight ? "Switch to dark mode" : "Switch to light mode";
  }
}

updateThemeButton();

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  const theme = document.body.classList.contains("light-mode")
    ? "light"
    : "dark";

  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch (error) {
    // Theme still works when browser storage is unavailable.
  }

  updateThemeButton();
});

// ---------- Reveal elements on scroll ----------
const revealElements = document.querySelectorAll(".reveal");
const skillFills = document.querySelectorAll(".skill-fill");

function revealElement(element) {
  element.classList.add("visible");

  if (element.classList.contains("skill-card")) {
    const fill = element.querySelector(".skill-fill");

    if (fill) {
      const level = Number(fill.dataset.level);
      fill.style.width = `${Math.max(0, Math.min(100, level))}%`;
    }
  }
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        revealElement(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  revealElements.forEach((element) => revealObserver.observe(element));

  // Animate skill bars when their cards enter the viewport.
  const skillsSection = document.getElementById("skills");

  if (skillsSection) {
    const skillObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          skillFills.forEach((fill) => {
            const level = Number(fill.dataset.level);
            fill.style.width = `${Math.max(0, Math.min(100, level))}%`;
          });

          observer.disconnect();
        }
      });
    }, { threshold: 0.15 });

    skillObserver.observe(skillsSection);
  }
} else {
  revealElements.forEach(revealElement);

  skillFills.forEach((fill) => {
    fill.style.width =
      `${Math.max(0, Math.min(100, Number(fill.dataset.level)))}%`;
  });
}

// ---------- Highlight the current navigation section ----------
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;

        link.classList.toggle("active", active);

        if (active) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, {
    rootMargin: "-25% 0px -60% 0px"
  });

  sections.forEach((section) => sectionObserver.observe(section));
}

// ---------- Download a sample CV ----------
const downloadCV = document.getElementById("downloadCV");

downloadCV?.addEventListener("click", () => {
  // Replace these example details with your own before publishing.
  const cvText = `HAFEEZ
Web Developer

PROFILE
Motivated developer interested in creating modern, responsive
websites and interactive digital experiences.

SKILLS
HTML, CSS, JavaScript, Python, Responsive Web Design

PROJECTS
1. Shopping Website
2. Resume Builder
3. AI Chat Interface

EDUCATION
Add your degree, institute and graduation year here.

EXPERIENCE
Add your experience or internship details here.

CONTACT
Email: Replace with your email address
GitHub: Add your GitHub profile URL
LinkedIn: Add your LinkedIn profile URL

Note: Customize this sample CV with accurate personal information.
`;

  const blob = new Blob([cvText], {
    type: "text/plain;charset=utf-8"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "Hafeez-CV.txt";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// ---------- Contact form ----------
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

// Replace this with your real email address.
const recipientEmail = "your-email@example.com";

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  if (!name || !email || !message) {
    formStatus.textContent = "Please complete all fields.";
    return;
  }

  if (recipientEmail === "your-email@example.com") {
    formStatus.textContent =
      "Please replace the example recipientEmail in script.js with your email address.";
    return;
  }

  const subject = `Portfolio inquiry from ${name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message
  ].join("\n");

  const mailtoURL =
    `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  formStatus.textContent =
    "Opening your email application. Review and send the message there.";

  window.location.href = mailtoURL;
});

// ---------- Footer year and back-to-top ----------
const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const backToTop = document.getElementById("backToTop");

function updateBackToTop() {
  backToTop?.classList.toggle("show", window.scrollY > 450);
}

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

backToTop?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth"
  });
});
