(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header shadow/blur on scroll
  var header = document.getElementById("site-header");
  var lastScrollState = false;
  function updateHeader() {
    var scrolled = window.scrollY > 8;
    if (scrolled !== lastScrollState) {
      header.classList.toggle("is-scrolled", scrolled);
      lastScrollState = scrolled;
    }
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 60 + "ms";
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Lightweight parallax on hero background (transform only, rAF-throttled)
  var heroGrid = document.querySelector(".hero__grid");
  var heroGlow = document.querySelector(".hero__glow");
  var ticking = false;

  function applyParallax() {
    var y = window.scrollY;
    if (heroGrid) heroGrid.style.transform = "translateY(" + y * 0.08 + "px)";
    if (heroGlow) heroGlow.style.transform = "translate(-50%, " + y * 0.12 + "px)";
    ticking = false;
  }

  function onScroll() {
    updateHeader();
    if (!reduceMotion && (heroGrid || heroGlow)) {
      if (!ticking) {
        window.requestAnimationFrame(applyParallax);
        ticking = true;
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateHeader();
})();
