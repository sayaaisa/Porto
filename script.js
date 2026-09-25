// Tahun di footer
document.getElementById("year").textContent = new Date().getFullYear();

// Navbar: efek saat scroll + menu mobile
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
navLinks.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navToggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
  })
);

// Animasi muncul saat di-scroll + counter angka
const counted = new WeakSet();
function animateCount(el) {
  if (counted.has(el)) return;
  counted.add(el);
  const target = +el.dataset.count;
  const start = performance.now();
  const duration = 1400;
  (function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  })(start);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      entry.target.querySelectorAll("[data-count]").forEach(animateCount);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 80}ms`;
  observer.observe(el);
});

// Filter portfolio
const filters = document.querySelectorAll(".filter");
const items = document.querySelectorAll(".work__item");
filters.forEach((btn) =>
  btn.addEventListener("click", () => {
    filters.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const cat = btn.dataset.filter;
    items.forEach((item) => {
      item.classList.toggle("is-hidden", cat !== "all" && item.dataset.cat !== cat);
    });
  })
);

// Lightbox untuk karya
const lightbox = document.getElementById("lightbox");
const lightboxContent = document.getElementById("lightboxContent");

function openLightbox(html) {
  lightboxContent.innerHTML = html;
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}
function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
  setTimeout(() => (lightboxContent.innerHTML = ""), 300);
}

items.forEach((item) =>
  item.addEventListener("click", () => {
    const img = item.querySelector("img");
    const title = item.querySelector("h3").textContent;
    const visual = img
      ? `<img src="${img.getAttribute("src")}" alt="${title}">`
      : `<figure class="media"><span class="media__ph">${title}</span></figure>`;
    openLightbox(`${visual}<h3>${title}</h3>`);
  })
);
document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

// Showreel: putar video YouTube jika data-video diisi
const reel = document.getElementById("reel");
reel.querySelector(".reel__btn").addEventListener("click", () => {
  const src = reel.dataset.video;
  if (!src) {
    alert("Showreel segera hadir!");
    return;
  }
  reel.insertAdjacentHTML(
    "beforeend",
    `<iframe src="${src}" allow="autoplay; encrypted-media; fullscreen" allowfullscreen></iframe>`
  );
});
