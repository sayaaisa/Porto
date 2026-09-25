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

  card.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const dx = ((e.clientX - rect.left) / rect.width - .5) * 2;
      const dy = ((e.clientY - rect.top)  / rect.height - .5) * 2;
      card.classList.add("is-tilting");
      card.style.transform = `perspective(850px) rotateY(${dx * 17}deg) rotateX(${-dy * 17}deg) translateY(-10px) scale(1.045)`;
    });
  });

  card.addEventListener("pointerleave", () => {
    cancelAnimationFrame(rafId);
    card.classList.remove("is-tilting");
    card.style.transform = "";
  });
});

// ============ RIPPLE on ALL CLICKABLE CONTROLS ============
document.querySelectorAll(".btn, button, .social-pill, .cta-social").forEach((control) => {
  control.classList.add("has-ripple");
  control.addEventListener("pointerdown", (e) => {
    if (e.button !== undefined && e.button !== 0) return;

    const ripple = document.createElement("span");
    const rect = control.getBoundingClientRect();
    const size = Math.hypot(rect.width, rect.height) * 2;
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;

    ripple.className = "click-ripple";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - rect.left - size / 2}px`;
    ripple.style.top = `${y - rect.top - size / 2}px`;
    control.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
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

  let isDragging = false;
  let didDrag = false;
  let lastX = 0;
  let lastTime = 0;
  let velocity = 0;
  let momentumId;

  const coast = () => {
    if (Math.abs(velocity) < .35) return;
    wrap.scrollLeft += velocity;
    velocity *= .94;
    momentumId = requestAnimationFrame(coast);
  };

  wrap.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    isDragging = true;
    didDrag = false;
    lastX = e.clientX;
    lastTime = performance.now();
    velocity = 0;
    wrap.classList.add("is-dragging");
    wrap.setPointerCapture(e.pointerId);
    cancelAnimationFrame(momentumId);
  });

  wrap.addEventListener("pointermove", (e) => {
    if (!isDragging) return;
    const now = performance.now();
    const deltaX = e.clientX - lastX;
    const elapsed = Math.max(now - lastTime, 8);

    if (Math.abs(deltaX) > 2) didDrag = true;
    wrap.scrollLeft -= deltaX;
    velocity = (-deltaX / elapsed) * 16.67;
    lastX = e.clientX;
    lastTime = now;
    e.preventDefault();
  });

  const release = (e) => {
    if (!isDragging) return;
    isDragging = false;
    wrap.classList.remove("is-dragging");
    if (wrap.hasPointerCapture(e.pointerId)) wrap.releasePointerCapture(e.pointerId);
    momentumId = requestAnimationFrame(coast);
  };

  wrap.addEventListener("pointerup", release);
  wrap.addEventListener("pointercancel", release);
  wrap.addEventListener("click", (e) => {
    if (!didDrag) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    didDrag = false;
  }, true);
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
