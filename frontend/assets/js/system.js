(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  const focusableSelector =
    "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

  if (navToggle && nav) {
    const firstLink = () => nav.querySelector("a");
    const isOpen = () => nav.getAttribute("data-open") === "true";
    const body = document.body;

    const closeMenu = function (shouldRestoreFocus) {
      nav.setAttribute("data-open", "false");
      navToggle.setAttribute("aria-expanded", "false");
      body.style.overflow = "";
      if (shouldRestoreFocus !== false) {
        navToggle.focus();
      }
    };

    const openMenu = function () {
      nav.setAttribute("data-open", "true");
      navToggle.setAttribute("aria-expanded", "true");
      body.style.overflow = "hidden";
      const target = firstLink();
      if (target) {
        target.focus();
      }
    };

    navToggle.addEventListener("click", function () {
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (isOpen()) {
          closeMenu(false);
        }
      });
    });

    document.addEventListener("keydown", function (event) {
      if (!isOpen()) {
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key === "Tab") {
        const navFocusable = Array.from(nav.querySelectorAll(focusableSelector));
        if (navFocusable.length === 0) {
          event.preventDefault();
          navToggle.focus();
          return;
        }

        const first = navFocusable[0];
        const last = navFocusable[navFocusable.length - 1];
        const active = document.activeElement;

        if (event.shiftKey && (active === first || active === navToggle)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
  }

  // Analytics tracking integration point
  // Replace trackEvent body with your analytics provider call
  function trackEvent(eventName) {
    if (window.console) {
      console.log("[Analytics]", eventName);
    }
    // TODO: Integrate with your analytics provider:
    // if (window.gtag) gtag('event', eventName);  // Google Analytics 4
    // if (window._leq) _leq.push(['track', eventName]);  // LeadExec
    // if (window.amplitude) amplitude.track(eventName);  // Amplitude
  }

  document.querySelectorAll("[data-track]").forEach(function (el) {
    el.addEventListener("click", function () {
      const eventName = el.getAttribute("data-track");
      trackEvent(eventName);
    });
  });

  document.querySelectorAll("form[data-validate='true']").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      const required = form.querySelectorAll("[required]");
      const success = form.querySelector(".form-success");
      const submit = form.querySelector("button[type='submit']");
      const phoneFields = form.querySelectorAll("input[type='tel']");
      const zipFields = form.querySelectorAll("input[name='zip']");
      let valid = true;

      if (success) {
        success.textContent = "";
      }

      form.querySelectorAll(".form-error").forEach(function (err) {
        err.textContent = "";
      });

      required.forEach(function (field) {
        field.removeAttribute("aria-invalid");
        field.removeAttribute("aria-describedby");
      });

      required.forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.setAttribute("aria-invalid", "true");
          field.setAttribute("aria-describedby", field.id + "-error");
          const message = document.getElementById(field.id + "-error");
          if (message) {
            message.textContent = "This field is required.";
            message.setAttribute("role", "alert");
          }
        } else {
          field.removeAttribute("aria-describedby");
        }
      });

      phoneFields.forEach(function (field) {
        const normalized = field.value.replace(/\D/g, "");
        if (field.value.trim() && normalized.length < 10) {
          valid = false;
          field.setAttribute("aria-invalid", "true");
          field.setAttribute("aria-describedby", field.id + "-error");
          const message = document.getElementById(field.id + "-error");
          if (message) {
            message.textContent = "Enter a valid 10-digit phone number.";
            message.setAttribute("role", "alert");
          }
        }
      });

      zipFields.forEach(function (field) {
        if (field.value.trim() && !/^\d{5}$/.test(field.value.trim())) {
          valid = false;
          field.setAttribute("aria-invalid", "true");
          field.setAttribute("aria-describedby", field.id + "-error");
          const message = document.getElementById(field.id + "-error");
          if (message) {
            message.textContent = "Enter a valid 5-digit ZIP code.";
            message.setAttribute("role", "alert");
          }
        }
      });

      if (!valid) {
        event.preventDefault();
        const firstInvalid = form.querySelector("[required][aria-invalid='true']");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      event.preventDefault();
      if (submit) {
        submit.disabled = true;
        submit.setAttribute("aria-busy", "true");
      }

      form.setAttribute("aria-busy", "true");

      window.setTimeout(function () {
        if (success) {
          success.textContent = "Request sent. Our team will contact you shortly.";
        }
        form.reset();
        form.removeAttribute("aria-busy");
        if (submit) {
          submit.disabled = false;
          submit.removeAttribute("aria-busy");
        }
      }, 250);
    });
  });

  document.querySelectorAll(".accordion-trigger").forEach(function (button) {
    button.addEventListener("click", function () {
      const expanded = button.getAttribute("aria-expanded") === "true";
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      button.setAttribute("aria-expanded", String(!expanded));
      if (panel) {
        panel.hidden = expanded;
      }
    });
  });
})();
