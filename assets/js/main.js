(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  var header = document.querySelector("[data-header]");
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");
  var progress = document.querySelector("[data-progress]");
  var glow = document.querySelector("[data-cursor-glow]");

  var skyline = document.querySelector(".hero__skyline img");

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 20);

    if (progress) {
      var doc = document.documentElement;
      var max = doc.scrollHeight - doc.clientHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }

    if (skyline && !reduceMotion) {
      skyline.style.transform = "translate3d(0," + Math.min(y * 0.18, 80) + "px,0)";
    }
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

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

  /* ---------- Rain ---------- */
  var canvas = document.querySelector("[data-rain]");
  if (canvas && !reduceMotion) {
    var ctx = canvas.getContext("2d");
    var drops = [];
    var COUNT = 140;

    function sizeCanvas() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function seedRain() {
      drops = [];
      for (var i = 0; i < COUNT; i++) {
        drops.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          len: Math.random() * 14 + 8,
          speed: Math.random() * 10 + 7,
          alpha: Math.random() * 0.28 + 0.08
        });
      }
    }

    function drawRain() {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        ctx.strokeStyle = "rgba(200, 210, 220," + d.alpha + ")";
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - 1.4, d.y + d.len);
        ctx.stroke();
        d.y += d.speed;
        d.x -= 0.55;
        if (d.y > window.innerHeight + 20) {
          d.y = -20;
          d.x = Math.random() * window.innerWidth;
        }
      }
      requestAnimationFrame(drawRain);
    }

    sizeCanvas();
    seedRain();
    requestAnimationFrame(drawRain);
    window.addEventListener("resize", function () {
      sizeCanvas();
      seedRain();
    });
  }

  /* ---------- Split brand letters ---------- */
  var splitTargets = document.querySelectorAll("[data-split]");
  if (splitTargets.length) {
    var delay = 0.12;
    splitTargets.forEach(function (target) {
      var text = target.getAttribute("data-split") || target.textContent || "";
      target.textContent = "";
      Array.prototype.forEach.call(text, function (ch) {
        var span = document.createElement("span");
        span.className = "char";
        span.textContent = ch;
        span.style.transitionDelay = delay + "s";
        delay += 0.04;
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
        btn.style.transform = "translate(" + x * 0.14 + "px, " + y * 0.18 + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- Panel tilt ---------- */
  if (!reduceMotion && finePointer) {
    document.querySelectorAll("[data-tilt]").forEach(function (panel) {
      panel.addEventListener("pointermove", function (e) {
        var rect = panel.getBoundingClientRect();
        var px = (e.clientX - rect.left) / rect.width - 0.5;
        var py = (e.clientY - rect.top) / rect.height - 0.5;
        panel.style.transform =
          "perspective(800px) rotateX(" + (-py * 3.2).toFixed(2) + "deg) rotateY(" + (px * 4).toFixed(2) + "deg) translateY(-3px)";
      });
      panel.addEventListener("pointerleave", function () {
        panel.style.transform = "";
      });
    });
  }

  /* ---------- Portrait: descend to work ---------- */
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
        }, reduceMotion ? 0 : 160);
      }
    });
  }
})();
