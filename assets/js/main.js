(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  var progress = document.querySelector("[data-progress]");
  var glow = document.querySelector("[data-cursor-glow]");

  /* ---------- Header state + scroll progress ---------- */
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 20);

    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
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

  /* ---------- Starfield ---------- */
  var canvas = document.querySelector("[data-stars]");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var stars = [];
    var STAR_COUNT = 110;

    function sizeCanvas() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seedStars() {
      stars = [];
      var palette = ["#fffdf5", "#c8f56a", "#24c7d9", "#ff5d9e"];
      for (var i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          r: Math.random() * 1.6 + 0.4,
          color: palette[Math.floor(Math.random() * palette.length)],
          phase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.9 + 0.35
        });
      }
    }

    var last = 0;
    function drawStars(t) {
      // ~30fps is plenty for twinkling and cheaper on batteries
      if (t - last > 33) {
        last = t;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (var i = 0; i < stars.length; i++) {
          var s = stars[i];
          var a = 0.25 + 0.75 * Math.abs(Math.sin(s.phase + t * 0.001 * s.speed));
          ctx.globalAlpha = a;
          ctx.fillStyle = s.color;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      requestAnimationFrame(drawStars);
    }

    sizeCanvas();
    seedStars();
    requestAnimationFrame(drawStars);
    window.addEventListener("resize", function () {
      sizeCanvas();
      seedStars();
    });
  }

  /* ---------- Split brand letters for entrance ---------- */
  var splitTargets = document.querySelectorAll("[data-split]");
  if (splitTargets.length) {
    var delay = 0.15;
    splitTargets.forEach(function (target) {
      var text = target.getAttribute("data-split") || target.textContent || "";
      target.textContent = "";
      Array.prototype.forEach.call(text, function (ch) {
        var span = document.createElement("span");
        span.className = "char";
        span.textContent = ch;
        span.style.transitionDelay = delay + "s";
        delay += 0.045;
        target.appendChild(span);
      });
    });
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        splitTargets.forEach(function (el) {
          el.classList.add("is-ready");
        });
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
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
      { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach(function (el, i) {
      if (!el.style.transitionDelay) {
        el.style.transitionDelay = Math.min((i % 4) * 0.07, 0.28) + "s";
      }
      observer.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Cursor glow ---------- */
  if (!reduceMotion && glow && finePointer) {
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

    document.documentElement.addEventListener("pointerleave", function () {
      glow.classList.remove("is-active");
      glowing = false;
    });

    (function tickGlow() {
      cx += (gx - cx) * 0.12;
      cy += (gy - cy) * 0.12;
      glow.style.transform = "translate(" + cx + "px, " + cy + "px) translate(-50%, -50%)";
      requestAnimationFrame(tickGlow);
    })();
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduceMotion && finePointer) {
    document.querySelectorAll("[data-magnetic]").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        var rect = btn.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = "translate(" + x * 0.18 + "px, " + y * 0.24 + "px) rotate(" + x * 0.02 + "deg)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Panel tilt toward the cursor ---------- */
  if (!reduceMotion && finePointer) {
    document.querySelectorAll("[data-tilt]").forEach(function (panel) {
      panel.addEventListener("pointermove", function (e) {
        var rect = panel.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        panel.style.transform =
          "perspective(700px) rotateX(" + (-py * 4).toFixed(2) + "deg) rotateY(" + (px * 5).toFixed(2) + "deg) translateY(-4px)";
      });
      panel.addEventListener("pointerleave", function () {
        panel.style.transform = "";
      });
    });
  }

  /* ---------- Portal: warp jump to work ---------- */
  var portal = document.querySelector("[data-portal]");
  if (portal) {
    portal.addEventListener("click", function () {
      var work = document.getElementById("work");
      if (!reduceMotion) {
        document.body.classList.add("is-warping");
        setTimeout(function () {
          document.body.classList.remove("is-warping");
        }, 700);
      }
      if (work) {
        setTimeout(function () {
          work.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
        }, reduceMotion ? 0 : 180);
      }
    });
  }
})();
