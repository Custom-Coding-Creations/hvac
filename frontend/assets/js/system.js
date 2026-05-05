(function () {
  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");

  if (navToggle && nav) {
    const firstLink = () => nav.querySelector("a");

    navToggle.addEventListener("click", function () {
      const open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      navToggle.setAttribute("aria-expanded", String(!open));
      if (!open) {
        const target = firstLink();
        if (target) target.focus();
        document.body.style.overflow = "hidden";
      } else {
        navToggle.focus();
        document.body.style.overflow = "";
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.getAttribute("data-open") === "true") {
        nav.setAttribute("data-open", "false");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
        document.body.style.overflow = "";
      }
    });
  }

  document.querySelectorAll("[data-track]").forEach(function (el) {
    el.addEventListener("click", function () {
      const eventName = el.getAttribute("data-track");
      if (window.console) {
        console.log("tracking", eventName);
      }
    });
  });

  document.querySelectorAll("form[data-validate='true']").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      const required = form.querySelectorAll("[required]");
      let valid = true;

      form.querySelectorAll(".form-error").forEach(function (err) {
        err.textContent = "";
      });

      required.forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          const message = document.getElementById(field.id + "-error");
          if (message) {
            message.textContent = "This field is required.";
          }
        }
      });

      if (!valid) {
        event.preventDefault();
        const firstInvalid = form.querySelector("[required]:invalid, [required][value='']");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      event.preventDefault();
      const success = form.querySelector(".form-success");
      if (success) {
        success.textContent = "Request sent. Our team will contact you shortly.";
      }
      form.reset();
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
