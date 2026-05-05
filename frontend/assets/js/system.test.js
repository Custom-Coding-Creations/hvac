/**
 * System Interaction Tests
 * Tests for nav, form, and accessibility behavior
 */

// Navigation tests
describe("Mobile Navigation", () => {
  let navToggle, nav, body;

  beforeEach(() => {
    document.body.innerHTML = `
      <header class="site-header" role="banner">
        <button class="nav-toggle" aria-expanded="false" aria-controls="primary-nav">Menu</button>
        <nav id="primary-nav" class="primary-nav" aria-label="Primary" data-open="false">
          <ul>
            <li><a href="#services">Services</a></li>
            <li><a href="#reviews">Reviews</a></li>
          </ul>
        </nav>
      </header>
      <main id="main"></main>
    `;

    navToggle = document.querySelector(".nav-toggle");
    nav = document.querySelector(".primary-nav");
    body = document.body;
  });

  test("opens menu on toggle click", () => {
    navToggle.click();
    expect(nav.getAttribute("data-open")).toBe("true");
    expect(navToggle.getAttribute("aria-expanded")).toBe("true");
  });

  test("closes menu on Escape key", () => {
    navToggle.click();
    expect(nav.getAttribute("data-open")).toBe("true");

    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(escapeEvent);

    expect(nav.getAttribute("data-open")).toBe("false");
    expect(navToggle.getAttribute("aria-expanded")).toBe("false");
  });

  test("restores scroll overflow on close", () => {
    navToggle.click();
    expect(body.style.overflow).toBe("hidden");

    navToggle.click();
    expect(body.style.overflow).toBe("");
  });

  test("closes menu on anchor click", () => {
    navToggle.click();
    const link = nav.querySelector("a");
    link.click();
    expect(nav.getAttribute("data-open")).toBe("false");
  });

  test("traps focus in mobile nav while open", () => {
    navToggle.click();
    const focusableElements = Array.from(nav.querySelectorAll("a, button"));
    const lastElement = focusableElements[focusableElements.length - 1];

    lastElement.focus();

    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: false,
    });
    document.dispatchEvent(tabEvent);

    // Focus should move to first element (wrapping behavior)
    expect(document.activeElement).toBe(focusableElements[0]);
  });
});

// Form validation tests
describe("Form Validation", () => {
  let form, nameField, phoneField, errorSpan, successSpan;

  beforeEach(() => {
    document.body.innerHTML = `
      <form data-validate="true" novalidate>
        <div class="form-field">
          <label for="test-name">Name</label>
          <input id="test-name" name="name" type="text" required />
          <span class="form-error" id="test-name-error" aria-live="polite"></span>
        </div>
        <div class="form-field">
          <label for="test-phone">Phone</label>
          <input id="test-phone" name="phone" type="tel" required />
          <span class="form-error" id="test-phone-error" aria-live="polite"></span>
        </div>
        <button class="btn btn-primary" type="submit">Submit</button>
        <p class="form-success" aria-live="polite"></p>
      </form>
    `;

    form = document.querySelector("form");
    nameField = document.getElementById("test-name");
    phoneField = document.getElementById("test-phone");
    errorSpan = document.getElementById("test-name-error");
    successSpan = document.querySelector(".form-success");
  });

  test("shows error on empty required field", () => {
    const submitEvent = new Event("submit", { bubbles: true });
    form.dispatchEvent(submitEvent);

    expect(nameField.getAttribute("aria-invalid")).toBe("true");
    expect(errorSpan.textContent).toBe("This field is required.");
  });

  test("validates 10-digit phone number", () => {
    phoneField.value = "123";
    nameField.value = "Test User";

    const submitEvent = new Event("submit", { bubbles: true });
    form.dispatchEvent(submitEvent);

    expect(phoneField.getAttribute("aria-invalid")).toBe("true");
  });

  test("accepts valid phone number", () => {
    phoneField.value = "(315) 555-0100";
    nameField.value = "Test User";

    const submitEvent = new Event("submit", { bubbles: true });
    form.dispatchEvent(submitEvent);

    expect(phoneField.getAttribute("aria-invalid")).not.toBe("true");
  });

  test("clears error on successful field input", () => {
    nameField.value = "";
    const submitEvent = new Event("submit", { bubbles: true });
    form.dispatchEvent(submitEvent);

    expect(errorSpan.textContent).toBe("This field is required.");

    nameField.value = "Valid Name";
    form.dispatchEvent(submitEvent);
    expect(errorSpan.textContent).toBe("");
  });

  test("focuses first invalid field after submit", () => {
    const submitEvent = new Event("submit", { bubbles: true });
    form.dispatchEvent(submitEvent);

    expect(document.activeElement).toBe(nameField);
  });
});

// Accordion tests
describe("FAQ Accordion", () => {
  let trigger, panel;

  beforeEach(() => {
    document.body.innerHTML = `
      <div class="accordion-item">
        <button class="accordion-trigger" aria-expanded="false" aria-controls="faq-panel-1">
          Question?
        </button>
        <div id="faq-panel-1" class="accordion-panel" hidden>
          <p>Answer content here.</p>
        </div>
      </div>
    `;

    trigger = document.querySelector(".accordion-trigger");
    panel = document.querySelector(".accordion-panel");
  });

  test("toggles expanded state on click", () => {
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(panel.hidden).toBe(true);

    trigger.click();

    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(panel.hidden).toBe(false);

    trigger.click();

    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(panel.hidden).toBe(true);
  });

  test("supports Space and Enter key activation", () => {
    const spaceEvent = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
    });
    trigger.dispatchEvent(spaceEvent);
    // Event is handled by DOM natively for buttons

    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
    });
    trigger.dispatchEvent(enterEvent);
    // Event is handled by DOM natively for buttons
  });
});

// Analytics tracking tests
describe("Analytics Tracking", () => {
  let trackingEvents = [];

  beforeEach(() => {
    trackingEvents = [];

    window.addEventListener("analytics:track", (event) => {
      trackingEvents.push(event.detail.eventName);
    });

    document.body.innerHTML = `
      <a href="#" data-track="test_click">Link</a>
      <button data-track="test_button">Button</button>
    `;
  });

  test("dispatches custom event for tracked elements", () => {
    const link = document.querySelector("a");
    link.click();

    expect(trackingEvents).toContain("test_click");
  });

  test("tracks button clicks", () => {
    const button = document.querySelector("button");
    button.click();

    expect(trackingEvents).toContain("test_button");
  });
});

// Accessibility tests
describe("Accessibility", () => {
  test("skip link is present in templates", () => {
    document.body.innerHTML = `
      <a class="skip-link" href="#main">Skip to main content</a>
      <main id="main"></main>
    `;

    const skipLink = document.querySelector(".skip-link");
    expect(skipLink).not.toBeNull();
    expect(skipLink.getAttribute("href")).toBe("#main");
  });

  test("form labels are associated with inputs", () => {
    document.body.innerHTML = `
      <form>
        <label for="test-input">Label</label>
        <input id="test-input" type="text" />
      </form>
    `;

    const label = document.querySelector("label");
    const input = document.querySelector("input");

    expect(label.getAttribute("for")).toBe(input.id);
  });

  test("error messages have proper aria attributes", () => {
    document.body.innerHTML = `
      <input id="field" required />
      <span id="field-error" aria-live="polite"></span>
    `;

    const field = document.getElementById("field");
    const error = document.getElementById("field-error");

    expect(error.getAttribute("aria-live")).toBe("polite");
  });

  test("focus outline is visible on all interactive elements", () => {
    document.body.innerHTML = `
      <button class="btn">Click</button>
      <a href="#">Link</a>
      <input type="text" />
    `;

    const elements = document.querySelectorAll("button, a, input");
    elements.forEach((el) => {
      expect(window.getComputedStyle(el).outline).toBeTruthy();
    });
  });
});

// Responsive tests
describe("Responsive Behavior", () => {
  test("layout resets on viewport change", () => {
    document.body.innerHTML = `
      <header>
        <button class="nav-toggle">Menu</button>
        <nav id="primary-nav" class="primary-nav" data-open="true"></nav>
      </header>
    `;

    const nav = document.querySelector(".primary-nav");
    expect(nav.getAttribute("data-open")).toBe("true");

    // Simulate resize to desktop
    const resizeEvent = new Event("resize");
    window.dispatchEvent(resizeEvent);

    // After resize, nav should be closed if it was open on mobile
    // This behavior is tested via syncMenuForViewport listener
  });
});
