// ============ FOOTER YEAR ============
document.getElementById("year").textContent = new Date().getFullYear();

// ============ NAVBAR ============
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 30);
});
navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("is-open");
  navLinks.classList.toggle("is-open");
});
navLinks.querySelectorAll("a").forEach((l) =>
  l.addEventListener("click", () => {
    navToggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
  })
);

// ============ REVEAL ON SCROLL ============
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-visible");
      revealObs.unobserve(e.target);
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 5) * 70}ms`;
  revealObs.observe(el);
});

// ============ PROCESS LINE REVEAL ============
const lineObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-visible"));
  },
  { threshold: 0.3 }
);
document.querySelectorAll(".process__list li").forEach((el) => lineObs.observe(el));

// ============ TILT CARD (3D hover) ============
document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `perspective(700px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg) scale(1.02)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

// ============ FILTER PORTFOLIO ============
const filters = document.querySelectorAll(".filter");
const items   = document.querySelectorAll(".work__item");

filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const cat = btn.dataset.filter;
    items.forEach((item) => {
      const hide = cat !== "all" && item.dataset.cat !== cat;
      item.classList.toggle("is-hidden", hide);
    });
  })
);

// ============ SWIPE HINT on mobile ============
(function () {
  const wrap = document.querySelector(".work__scroll-wrap");
  if (!wrap) return;
  let startX = 0;
  wrap.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  wrap.addEventListener("touchend", (e) => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      wrap.scrollBy({ left: diff > 0 ? 280 : -280, behavior: "smooth" });
    }
  });
})();

// ============ LIGHTBOX ============
const lightbox        = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");

function openLightbox(html) {
  lightboxContent.innerHTML = html;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  setTimeout(() => (lightboxContent.innerHTML = ""), 300);
}

items.forEach((item) =>
  item.addEventListener("click", () => {
    const img   = item.querySelector("img");
    const title = item.querySelector("h3")?.textContent || "";
    const sub   = item.querySelector(".work__info span")?.textContent || "";
    const visual = img
      ? `<figure class="media"><img src="${img.getAttribute("src")}" alt="${title}" /></figure>`
      : `<figure class="media"><span class="media__ph"><span class="ph-icon">${item.querySelector(".ph-icon")?.textContent || "🖼"}</span>${title}</span></figure>`;
    openLightbox(`${visual}<h3>${sub} — ${title}</h3>`);
  })
);
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

// ============ BLOB PARALLAX on scroll ============
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  const b1 = document.querySelector(".blob-1");
  const b2 = document.querySelector(".blob-2");
  if (b1) b1.style.transform = `translateY(${y * 0.12}px)`;
  if (b2) b2.style.transform = `translateY(${-y * 0.08}px)`;
}, { passive: true });
