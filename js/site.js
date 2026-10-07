/* MFM Sculptures: photo viewer, build-steps slider, commission form. */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Photo viewer ---------- */
  var pieces = window.MFM_PIECES || {};
  var dialog = document.getElementById("viewer");

  if (dialog && typeof dialog.showModal === "function") {
    var img = dialog.querySelector(".viewer__img");
    var title = dialog.querySelector(".viewer__title");
    var caption = dialog.querySelector(".viewer__caption");
    var count = dialog.querySelector(".viewer__count");
    var prev = dialog.querySelector(".viewer__nav--prev");
    var next = dialog.querySelector(".viewer__nav--next");
    var closeBtn = dialog.querySelector(".viewer__close");
    var stage = dialog.querySelector(".viewer__stage");
    var current = null;
    var index = 0;

    var show = function (i) {
      var piece = pieces[current];
      var n = piece.images.length;
      index = (i + n) % n;
      var item = piece.images[index];
      img.src = item.src;
      img.width = item.w;
      img.height = item.h;
      img.alt = item.alt;
      count.textContent = n > 1 ? index + 1 + " of " + n : "";
      prev.hidden = next.hidden = n < 2;
      if (n > 1) {
        [index + 1, index - 1].forEach(function (j) {
          new Image().src = piece.images[(j + n) % n].src;
        });
      }
    };

    var open = function (slug, i) {
      if (!pieces[slug]) return;
      current = slug;
      title.textContent = pieces[slug].title;
      caption.textContent = pieces[slug].caption;
      show(i || 0);
      if (!dialog.open) dialog.showModal();
    };

    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-piece]");
      if (!trigger) return;
      open(trigger.getAttribute("data-piece"), parseInt(trigger.getAttribute("data-index") || "0", 10));
    });

    prev.addEventListener("click", function () { show(index - 1); });
    next.addEventListener("click", function () { show(index + 1); });
    closeBtn.addEventListener("click", function () { dialog.close(); });

    stage.addEventListener("click", function (e) {
      if (e.target === stage) dialog.close();
    });

    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { show(index - 1); }
      if (e.key === "ArrowRight") { show(index + 1); }
    });

    var startX = null;
    stage.addEventListener("touchstart", function (e) {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(dx) > 50) show(dx < 0 ? index + 1 : index - 1);
    }, { passive: true });

    // Links like portfolio.html#duck open that piece straight away.
    var fromHash = function () {
      var slug = window.location.hash.replace("#", "");
      if (slug && pieces[slug]) open(slug, 0);
    };
    window.addEventListener("hashchange", fromHash);
    fromHash();
  }

  /* ---------- Build steps slider ---------- */
  var viewport = document.querySelector(".steps-viewport");
  if (viewport) {
    var stepPrev = document.getElementById("steps-prev");
    var stepNext = document.getElementById("steps-next");

    var stepWidth = function () {
      var item = viewport.querySelector(".steps__item");
      var list = viewport.querySelector(".steps");
      var gap = parseFloat(window.getComputedStyle(list).columnGap) || 0;
      return item.getBoundingClientRect().width + gap;
    };

    var updateButtons = function () {
      stepPrev.disabled = viewport.scrollLeft <= 2;
      stepNext.disabled = viewport.scrollLeft + viewport.clientWidth >= viewport.scrollWidth - 2;
    };

    var move = function (dir) {
      viewport.scrollBy({ left: dir * stepWidth(), behavior: reduceMotion ? "auto" : "smooth" });
    };

    stepPrev.addEventListener("click", function () { move(-1); });
    stepNext.addEventListener("click", function () { move(1); });
    viewport.addEventListener("scroll", updateButtons, { passive: true });
    window.addEventListener("resize", updateButtons);
    updateButtons();
  }

  /* ---------- Commission form ---------- */
  var form = document.getElementById("commission-form");
  if (form) {
    var status = document.getElementById("form-status");
    var button = form.querySelector("button[type=submit]");
    var contactEmail = form.getAttribute("data-email");

    var setStatus = function (message, state) {
      status.textContent = message;
      status.setAttribute("data-state", state || "info");
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var endpoint = form.getAttribute("data-endpoint");
      var data = new FormData(form);
      var name = [data.get("firstName"), data.get("lastName")].filter(Boolean).join(" ");
      var lines = [
        "Name: " + name,
        "Email: " + data.get("email"),
        "Phone: " + (data.get("phone") || "not given"),
        "Budget: " + data.get("budget"),
        "",
        "Idea:",
        data.get("description")
      ];

      if (endpoint) {
        button.disabled = true;
        setStatus("Sending...", "info");
        fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data
        })
          .then(function (res) {
            if (!res.ok) throw new Error("Request failed");
            form.reset();
            setStatus("Request sent. I'll reply to the email address you gave.", "ok");
          })
          .catch(function () {
            setStatus("That didn't send. Check your connection and try again, or email " + contactEmail + ".", "error");
          })
          .then(function () { button.disabled = false; });
        return;
      }

      // No form service connected yet: fall back to the visitor's email app.
      var subject = "Commission request from " + name;
      window.location.href =
        "mailto:" + contactEmail +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(lines.join("\n"));
      setStatus("Your email app should open with your request filled in. If nothing opens, email " + contactEmail + " directly.", "info");
    });
  }
})();
