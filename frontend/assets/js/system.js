// System UI - Event handlers and initialization

const focusableSelector =
  "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

const trackEventPattern = /^[a-z0-9]+_[a-z0-9]+_[a-z0-9_]+_[a-z0-9]+$/;
const trackEventThreePartPattern = /^[a-z0-9]+_[a-z0-9]+_[a-z0-9_]+$/;
const legacyTrackMap = {
  call_click_header: "click_call_header_homepage",
  schedule_click_header: "click_schedule_header_homepage",
  schedule_click_hero: "click_schedule_hero_homepage",
  call_click_hero: "click_call_hero_homepage",
  form_submit_home: "submit_form_request_homepage",
  financing_start_home: "click_financing_options_homepage",
  call_click_financing_home: "click_call_financing_homepage",
  call_click_mobile: "click_call_sticky_mobile_homepage",
  schedule_click_mobile: "click_schedule_sticky_mobile_homepage",
  estimate_click_header: "click_estimate_header_service",
  estimate_click_service: "click_estimate_hero_service",
  call_click_service: "click_call_hero_service",
  form_submit_service: "submit_form_request_service",
  symptom_cta_service: "click_symptoms_cta_service",
  financing_cta_service: "click_financing_options_service",
  financing_call_service: "click_call_financing_service",
  estimate_click_mobile: "click_estimate_sticky_mobile_service",
  schedule_click_location: "click_schedule_hero_location",
  call_click_location: "click_call_hero_location",
  form_submit_location: "submit_form_request_location",
  call_strip_location: "click_call_dispatch_location",
  call_click_header_emergency: "click_call_header_emergency",
  call_click_hero_emergency: "click_call_hero_emergency",
  form_start_emergency: "click_callback_hero_emergency",
  form_submit_emergency: "submit_form_request_emergency",
  call_backup_emergency: "click_call_backup_emergency",
  call_click_mobile_emergency: "click_call_sticky_mobile_emergency",
  form_start_mobile_emergency: "click_callback_sticky_mobile_emergency",
};

// Module-level handler references for idempotent re-initialization
let _navigationKeydownHandler = null;
let _navigationResizeHandler = null;
let _stickyCtaFocusInHandler = null;
let _stickyCtaFocusOutHandler = null;
let _stickyCtaResizeHandler = null;

function getTemplateContext() {
  if (document.body && document.body.dataset.template) {
    return String(document.body.dataset.template).toLowerCase();
  }

  const path = (window.location && window.location.pathname) || "";

  if (path.indexOf("emergency") >= 0) {
    return "emergency";
  }
  if (path.indexOf("location") >= 0 || path.indexOf("locations") >= 0) {
    return "location";
  }
  if (path.indexOf("service") >= 0 || path.indexOf("services") >= 0) {
    return "service";
  }

  return "homepage";
}

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
  const templateContext = getTemplateContext();

  function normalizeTrackName(eventName) {
    if (!eventName) {
      return eventName;
    }

    const withTemplateToken = eventName.replace(/\{template\}/g, templateContext);

    if (trackEventPattern.test(withTemplateToken)) {
      return withTemplateToken;
    }

    if (legacyTrackMap[withTemplateToken]) {
      return legacyTrackMap[withTemplateToken];
    }

    if (trackEventThreePartPattern.test(withTemplateToken)) {
      return withTemplateToken + "_" + templateContext;
    }

    return withTemplateToken;
  }

  function trackEvent(eventName) {
    if (!eventName) {
      return;
    }

    const normalizedEventName = normalizeTrackName(eventName);

    if (typeof window.dispatchEvent === "function") {
      window.dispatchEvent(
        new CustomEvent("analytics:track", {
          detail: {
            eventName: normalizedEventName,
            sourceEventName: eventName,
            templateContext: templateContext,
          },
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

function initializeStickyMobileCta() {
  const stickyCta = document.querySelector(".sticky-mobile-cta");

  if (!stickyCta) {
    return;
  }

  const isMobileViewport = function () {
    return (
      typeof window.matchMedia === "function" &&
      window.matchMedia("(max-width: 767px)").matches
    );
  };

  const isFormControl = function (element) {
    if (!element || !element.tagName) {
      return false;
    }

    return /^(INPUT|SELECT|TEXTAREA)$/i.test(element.tagName);
  };

  const setCompactState = function (isCompact) {
    if (isCompact) {
      stickyCta.classList.add("is-compact");
    } else {
      stickyCta.classList.remove("is-compact");
    }
  };

  const syncCompactState = function () {
    if (!isMobileViewport()) {
      setCompactState(false);
      return;
    }

    const active = document.activeElement;
    setCompactState(isFormControl(active));
  };

  if (_stickyCtaFocusInHandler) {
    document.removeEventListener("focusin", _stickyCtaFocusInHandler);
  }

  _stickyCtaFocusInHandler = function (event) {
    if (!isMobileViewport()) {
      return;
    }

    if (isFormControl(event.target)) {
      setCompactState(true);
    }
  };
  document.addEventListener("focusin", _stickyCtaFocusInHandler);

  if (_stickyCtaFocusOutHandler) {
    document.removeEventListener("focusout", _stickyCtaFocusOutHandler);
  }

  _stickyCtaFocusOutHandler = function () {
    window.setTimeout(syncCompactState, 0);
  };
  document.addEventListener("focusout", _stickyCtaFocusOutHandler);

  if (_stickyCtaResizeHandler) {
    window.removeEventListener("resize", _stickyCtaResizeHandler);
  }

  _stickyCtaResizeHandler = function () {
    syncCompactState();
  };
  window.addEventListener("resize", _stickyCtaResizeHandler);

  syncCompactState();
}

function initializeUrgentCtaPrioritization() {
  const urgentValues = {
    emergency: true,
    "no-heat": true,
    "no-cooling": true,
    "active-leak": true,
    "gas-odor": true,
    "no-water": true,
  };

  document.querySelectorAll("form[data-urgent-source]").forEach(function (form) {
    if (form.dataset.urgentBound) {
      return;
    }

    const sourceFieldId = form.getAttribute("data-urgent-source");
    const sourceField = sourceFieldId ? document.getElementById(sourceFieldId) : null;
    const callSelector = form.getAttribute("data-urgent-call-cta");
    const formSelector = form.getAttribute("data-urgent-form-cta");
    const noteSelector = form.getAttribute("data-urgent-live");
    const callCta = callSelector ? document.querySelector(callSelector) : null;
    const formCta = formSelector ? document.querySelector(formSelector) : null;
    const liveNote = noteSelector ? document.querySelector(noteSelector) : null;

    if (!sourceField || !callCta || !formCta) {
      form.dataset.urgentBound = "true";
      return;
    }

    if (!callCta.dataset.defaultLabel) {
      callCta.dataset.defaultLabel = callCta.textContent.trim();
    }
    if (!formCta.dataset.defaultLabel) {
      formCta.dataset.defaultLabel = formCta.textContent.trim();
    }

    const syncUrgentState = function () {
      const rawValue = String(sourceField.value || "").toLowerCase();
      const isUrgent = Boolean(urgentValues[rawValue]);

      if (isUrgent) {
        callCta.classList.remove("btn-emergency");
        callCta.classList.add("btn-primary");
        callCta.textContent = "Call Technician Now";

        formCta.classList.remove("btn-primary");
        formCta.classList.add("btn-secondary");
        formCta.textContent = "Request Callback";

        if (liveNote) {
          liveNote.textContent =
            "Urgent symptom detected. Calling dispatch is recommended for fastest response.";
        }
      } else {
        callCta.classList.remove("btn-primary");
        callCta.classList.add("btn-emergency");
        callCta.textContent = callCta.dataset.defaultLabel;

        formCta.classList.remove("btn-secondary");
        formCta.classList.add("btn-primary");
        formCta.textContent = formCta.dataset.defaultLabel;

        if (liveNote) {
          liveNote.textContent = "";
        }
      }
    };

    sourceField.addEventListener("change", syncUrgentState);
    sourceField.addEventListener("input", syncUrgentState);
    syncUrgentState();

    form.dataset.urgentBound = "true";
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
  initializeStickyMobileCta();
  initializeUrgentCtaPrioritization();
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
    initializeStickyMobileCta: initializeStickyMobileCta,
    initializeUrgentCtaPrioritization: initializeUrgentCtaPrioritization,
    initializeFormValidation: initializeFormValidation,
    initializeAccordion: initializeAccordion,
  };
}
