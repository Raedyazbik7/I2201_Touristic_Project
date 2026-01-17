

(function highlightActiveNav(){
  const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav__link").forEach(a => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === current) a.classList.add("is-active");
  });
})();


(function galleryLightbox(){
  const modal = document.querySelector("#lightbox");
  if (!modal) return;

  const imgEl = modal.querySelector("#lightbox-img");
  const capEl = modal.querySelector("#lightbox-cap");
  const closeBtn = modal.querySelector("#lightbox-close");
  const backdrop = modal.querySelector(".modal__backdrop");

  let lastFocus = null;

  function openLightbox(fullSrc, altText, caption){
    lastFocus = document.activeElement;
    imgEl.src = fullSrc;
    imgEl.alt = altText || "";
    capEl.textContent = caption || "";
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    closeBtn.focus();
  }

  function closeLightbox(){
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    imgEl.src = "";
    imgEl.alt = "";
    capEl.textContent = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-lightbox]");
    if (!trigger) return;

    e.preventDefault();
    const fullSrc = trigger.getAttribute("data-full");
    const altText = trigger.querySelector("img")?.alt || "Monument image";
    const caption = trigger.getAttribute("data-caption") || "";
    openLightbox(fullSrc, altText, caption);
  });

  closeBtn?.addEventListener("click", closeLightbox);
  backdrop?.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeLightbox();
  });
})();


(function gallerySearch(){
  const input = document.querySelector("#gallery-search");
  const items = Array.from(document.querySelectorAll("[data-gallery-item]"));
  if (!input || items.length === 0) return;

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    items.forEach(el => {
      const hay = (el.getAttribute("data-keywords") || "").toLowerCase();
      el.style.display = hay.includes(q) ? "" : "none";
    });
  });
})();


(function feedbackValidation(){
  const form = document.querySelector("#feedback-form");
  if (!form) return;

  const nameEl = form.querySelector("#name");
  const emailEl = form.querySelector("#email");
  const msgEl = form.querySelector("#message");
  const statusEl = document.querySelector("#form-status");

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, msg){
    const field = input.closest(".field");
    const err = field?.querySelector(".error");
    if (err) err.textContent = msg || "";
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    statusEl.textContent = "";

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = msgEl.value.trim();

    let ok = true;
    if (!name) { setError(nameEl, "Name is required."); ok = false; } else setError(nameEl, "");
    if (!emailRe.test(email)) { setError(emailEl, "Please enter a valid email."); ok = false; } else setError(emailEl, "");
    if (message.length < 10) { setError(msgEl, "Message must be at least 10 characters."); ok = false; } else setError(msgEl, "");

    if (!ok) return;

    const payload = { name, email, message, createdAt: new Date().toISOString() };
    const key = "tourSiteFeedback";
    const list = JSON.parse(localStorage.getItem(key) || "[]");
    list.push(payload);
    localStorage.setItem(key, JSON.stringify(list));

    form.reset();
    statusEl.textContent = "Thank you! Your feedback was saved locally.";
  });
})();
