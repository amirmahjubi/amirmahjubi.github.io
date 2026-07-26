(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  var progress = document.querySelector("[data-progress]");
  var glow = document.querySelector("[data-cursor-glow]");
  var parallaxEl = document.querySelector("[data-parallax]");
  var photo = parallaxEl ? parallaxEl.querySelector(".hero__photo") : null;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 20);

    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      var pct = max > 0 ? (y / max) * 100 : 0;
      progress.style.width = pct + "%";
    }

    if (!reduceMotion && photo) {
      var shift = Math.min(y * 0.18, 90);
      photo.style.transform = "scale(1.04) translate3d(0, " + shift + "px, 0)";
    }
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
      });
    });
  }

  /* Split brand letters for entrance */
  var splitTarget = document.querySelector("[data-split]");
  if (splitTarget) {
    var text = splitTarget.getAttribute("data-split") || splitTarget.textContent || "";
    splitTarget.textContent = "";
    var delay = 0;
    Array.prototype.forEach.call(text, function (ch) {
      var span = document.createElement("span");
      span.className = "char" + (ch === " " ? " is-space" : "");
      span.textContent = ch === " " ? "\u00A0" : ch;
      span.style.transitionDelay = delay + "s";
      delay += 0.028;
      splitTarget.appendChild(span);
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        splitTarget.classList.add("is-ready");
      });
    });
  }

  /* Reveal on scroll */
  var reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && reveals.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach(function (el, i) {
      if (!el.style.transitionDelay) {
        el.style.transitionDelay = Math.min(i * 0.04, 0.24) + "s";
      }
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* Cursor glow */
  if (!reduceMotion && glow && window.matchMedia("(pointer: fine)").matches) {
    var gx = window.innerWidth / 2;
    var gy = window.innerHeight / 2;
    var cx = gx;
    var cy = gy;
    var glowing = false;

    window.addEventListener(
      "pointermove",
      function (e) {
        gx = e.clientX;
        gy = e.clientY;
        if (!glowing) {
          glow.classList.add("is-active");
          glowing = true;
        }
      },
      { passive: true }
    );

    window.addEventListener("pointerleave", function () {
      glow.classList.remove("is-active");
      glowing = false;
    });

    function tickGlow() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px, " + cy + "px) translate(-50%, -50%)";
      requestAnimationFrame(tickGlow);
    }
    requestAnimationFrame(tickGlow);
  }

  /* Magnetic buttons */
  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = "translate(" + x * 0.22 + "px, " + y * 0.28 + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transform = "";
      });
    });
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
})();
