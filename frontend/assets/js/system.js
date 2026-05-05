// System UI - Event handlers and initialization

const focusableSelector =
  "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

// Module-level handler references for idempotent re-initialization
let _navigationKeydownHandler = null;
let _navigationResizeHandler = null;

function initializeNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");

  if (!navToggle || !nav) {
    return;
  }

  const firstLink = function () {
    return nav.querySelector("a");
  };

  const isOpen = function () {
    return nav.getAttribute("data-open") === "true";
  };

  const closeMenu = function (shouldRestoreFocus) {
    nav.setAttribute("data-open", "false");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";

    if (shouldRestoreFocus !== false) {
      navToggle.focus();
    }
  };

  const openMenu = function () {
    nav.setAttribute("data-open", "true");
    navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";

    const link = firstLink();
    if (link) {
      link.focus();
    }
  };

  if (!navToggle.dataset.jsBound) {
    navToggle.addEventListener("click", function () {
      if (isOpen()) {
        closeMenu();
      } else {
        openMenu();
      }
    });
    navToggle.dataset.jsBound = "true";
  }

  nav.querySelectorAll("a").forEach(function (link) {
    if (link.dataset.jsBound) {
      return;
    }

    link.addEventListener("click", function () {
      if (isOpen()) {
        closeMenu(false);
      }
    });
    link.dataset.jsBound = "true";
  });

  if (_navigationKeydownHandler) {
    document.removeEventListener("keydown", _navigationKeydownHandler);
  }

  _navigationKeydownHandler = function (event) {
    if (!isOpen()) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

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
  };
  document.addEventListener("keydown", _navigationKeydownHandler);

  if (_navigationResizeHandler) {
    window.removeEventListener("resize", _navigationResizeHandler);
  }

  _navigationResizeHandler = function () {
    if (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(min-width: 768px)").matches
    ) {
      closeMenu(false);
    }
  };
  window.addEventListener("resize", _navigationResizeHandler);
}

function initializeTracking() {
  function trackEvent(eventName) {
    if (!eventName) {
      return;
    }

    if (typeof window.dispatchEvent === "function") {
      window.dispatchEvent(
        new CustomEvent("analytics:track", {
          detail: { eventName: eventName },
        })
      );
    }
  }

  document.querySelectorAll("[data-track]").forEach(function (el) {
    if (el.dataset.trackBound) {
      return;
    }

    el.addEventListener("click", function () {
      const eventName = el.getAttribute("data-track");
      trackEvent(eventName);
    });
    el.dataset.trackBound = "true";
  });
}

function initializeFormValidation() {
  document.querySelectorAll("form[data-validate='true']").forEach(function (form) {
    if (form.dataset.validationBound) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const required = form.querySelectorAll("[required]");
      const success = form.querySelector(".form-success");
      const submit = form.querySelector("button[type='submit']");
      const phoneFields = form.querySelectorAll("input[type='tel']");
      const zipFields = form.querySelectorAll("input[name='zip']");
      let valid = true;
      let firstInvalidField = null;

      if (success) {
        success.textContent = "";
      }

      form.querySelectorAll(".form-error").forEach(function (err) {
        err.textContent = "";
      });

      required.forEach(function (field) {
        field.removeAttribute("aria-invalid");
      });

      required.forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          if (!firstInvalidField) firstInvalidField = field;
          field.setAttribute("aria-invalid", "true");
          const message = document.getElementById(field.id + "-error");
          if (message) {
            message.textContent = "This field is required.";
          }
        } else if (field.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value.trim())) {
            valid = false;
            if (!firstInvalidField) firstInvalidField = field;
            field.setAttribute("aria-invalid", "true");
            const message = document.getElementById(field.id + "-error");
            if (message) {
              message.textContent = "Enter a valid email address.";
            }
          }
        }
      });

      phoneFields.forEach(function (field) {
        const normalized = field.value.replace(/\D/g, "");
        if (field.value.trim()) {
          if (normalized.length < 10) {
            valid = false;
            if (!firstInvalidField) firstInvalidField = field;
            field.setAttribute("aria-invalid", "true");
            const message = document.getElementById(field.id + "-error");
            if (message) {
              message.textContent = "Enter a valid 10-digit phone number.";
            }
          } else if (normalized.length === 10) {
            field.removeAttribute("aria-invalid");
          }
        }
      });

      zipFields.forEach(function (field) {
        if (field.value.trim() && !/^\d{5}$/.test(field.value.trim())) {
          valid = false;
          if (!firstInvalidField) firstInvalidField = field;
          field.setAttribute("aria-invalid", "true");
          const message = document.getElementById(field.id + "-error");
          if (message) {
            message.textContent = "Enter a valid 5-digit ZIP code.";
          }
        }
      });

      if (!valid) {
        if (firstInvalidField) firstInvalidField.focus();
        return;
      }

      if (submit) {
        submit.disabled = true;
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
        }
      }, 250);
      });

    form.querySelectorAll("[required]").forEach(function (field) {
        field.addEventListener("input", function () {
        field.removeAttribute("aria-invalid");
        const message = document.getElementById(field.id + "-error");
        if (message) {
          message.textContent = "";
        }
        });
    });

      form.dataset.validationBound = "true";
  });
}

function initializeAccordion() {
  document.querySelectorAll(".accordion-trigger").forEach(function (button) {
      if (button.dataset.accordionBound) {
        return;
      }

      button.addEventListener("click", function () {
      const expanded = button.getAttribute("aria-expanded") === "true";
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      button.setAttribute("aria-expanded", String(!expanded));
      if (panel) {
        panel.hidden = expanded;
      }
      });

      button.dataset.accordionBound = "true";
  });
}

function initialize() {
  initializeNavigation();
  initializeTracking();
  initializeFormValidation();
  initializeAccordion();
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initialize);
} else {
  initialize();
}

// Export for testing
if (typeof window !== "undefined") {
  window.SystemUI = {
    initialize: initialize,
    initializeNavigation: initializeNavigation,
    initializeTracking: initializeTracking,
    initializeFormValidation: initializeFormValidation,
    initializeAccordion: initializeAccordion,
  };
}
