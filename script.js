// ============ FOOTER YEAR ============
document.getElementById("year").textContent = new Date().getFullYear();

// ============ NAVBAR ============
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks  = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 30);
}, { passive: true });

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

// ============ FLOATING BUBBLES (blub blub) ============
(function spawnBubbles() {
  const wrap = document.querySelector(".bubbles");
  if (!wrap) return;

  const sizes  = [10, 14, 18, 22, 28, 36];
  const delays = [0, 1.5, 3, 4.5, 6, 7.5, 9, 11];
  const durs   = [7, 9, 11, 13, 15];

  function makeBubble() {
    const b = document.createElement("div");
    b.className = "bubble";
    const size  = sizes [Math.floor(Math.random() * sizes.length)];
    const delay = delays[Math.floor(Math.random() * delays.length)];
    const dur   = durs  [Math.floor(Math.random() * durs.length)];
    const left  = 3 + Math.random() * 94; // % across screen
    b.style.cssText = `
      width:${size}px; height:${size}px;
      left:${left}%;
      --dur:${dur}s; --delay:${delay}s;
      animation-delay:${delay}s;
    `;
    wrap.appendChild(b);
    // Remove after animation ends so DOM stays clean
    b.addEventListener("animationiteration", () => {
      b.style.left = (3 + Math.random() * 94) + "%";
    });
  }

  // Start 14 bubbles
  for (let i = 0; i < 14; i++) makeBubble();
})();

// ============ BLOB PARALLAX ============
window.addEventListener("scroll", () => {
  const y  = window.scrollY;
  const b1 = document.querySelector(".blob-1");
  const b2 = document.querySelector(".blob-2");
  const b3 = document.querySelector(".blob-3");
  if (b1) b1.style.transform = `translateY(${y * 0.15}px)`;
  if (b2) b2.style.transform = `translateY(${-y * 0.1}px)`;
  if (b3) b3.style.transform = `translateY(${y * 0.08}px)`;
}, { passive: true });

// ============ REVEAL ON SCROLL ============
const revealObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add("is-visible"), i * 60);
      revealObs.unobserve(e.target);
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 5) * 65}ms`;
  revealObs.observe(el);
});

// ============ TILT 3D (spring back) ============
document.querySelectorAll(".tilt-card").forEach((card) => {
  let rafId;
  card.addEventListener("mousemove", (e) => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const dx = ((e.clientX - rect.left) / rect.width  - .5) * 2; // -1 to 1
      const dy = ((e.clientY - rect.top)  / rect.height - .5) * 2;
      card.style.transform = `perspective(800px) rotateY(${dx * 12}deg) rotateX(${-dy * 12}deg) scale(1.03)`;
    });
  });
  card.addEventListener("mouseleave", () => {
    cancelAnimationFrame(rafId);
    card.style.transform = "";
  });
});

// ============ RIPPLE on BUTTONS ============
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const r   = document.createElement("span");
    r.className = "ripple";
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size/2}px;
      top:${e.clientY  - rect.top  - size/2}px;
    `;
    btn.appendChild(r);
    r.addEventListener("animationend", () => r.remove());
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
      item.classList.toggle("is-hidden", cat !== "all" && item.dataset.cat !== cat);
    });
  })
);

// ============ DRAG-SCROLL with MOMENTUM ============
(function dragScroll() {
  const wrap = document.querySelector(".work__scroll-wrap");
  if (!wrap) return;

  let isDown = false, startX, scrollLeft, velX = 0, lastX, rafId;

  wrap.addEventListener("mousedown", (e) => {
    isDown = true; wrap.style.cursor = "grabbing";
    startX = e.pageX - wrap.offsetLeft;
    scrollLeft = wrap.scrollLeft;
    lastX = e.pageX; velX = 0;
    cancelAnimationFrame(rafId);
  });
  document.addEventListener("mouseup", () => {
    if (!isDown) return;
    isDown = false; wrap.style.cursor = "";
    // Momentum coast
    (function coast() {
      if (Math.abs(velX) < 0.5) return;
      wrap.scrollLeft += velX;
      velX *= 0.92;
      rafId = requestAnimationFrame(coast);
    })();
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    velX = e.pageX - lastX;
    lastX = e.pageX;
    const x    = e.pageX - wrap.offsetLeft;
    const walk = (x - startX) * 1.4;
    wrap.scrollLeft = scrollLeft - walk;
  });

  // Touch swipe with spring rubber-band at edges
  let touchStartX, touchScrollLeft;
  wrap.addEventListener("touchstart", (e) => {
    touchStartX    = e.touches[0].clientX;
    touchScrollLeft = wrap.scrollLeft;
  }, { passive: true });
  wrap.addEventListener("touchmove", (e) => {
    const diff = touchStartX - e.touches[0].clientX;
    wrap.scrollLeft = touchScrollLeft + diff;
  }, { passive: true });
})();

// ============ SPRING BOUNCE on hover (extra: cards jiggle on hover) ============
document.querySelectorAll(".work__item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    item.style.transition = "transform .5s cubic-bezier(.34,1.8,.64,1), box-shadow .4s";
  });
  item.addEventListener("mouseleave", () => {
    item.style.transition = "transform .5s cubic-bezier(.34,1.8,.64,1), box-shadow .4s";
  });
});

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
    const icon  = item.querySelector(".ph-icon")?.textContent || "🖼";
    const visual = img
      ? `<figure class="media"><img src="${img.getAttribute("src")}" alt="${title}" /></figure>`
      : `<figure class="media"><span class="media__ph"><span class="ph-icon">${icon}</span>${title}</span></figure>`;
    openLightbox(`${visual}<h3>${sub} — ${title}</h3>`);
  })
);

document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
