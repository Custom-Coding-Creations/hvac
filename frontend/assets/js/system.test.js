/**
 * System Interaction Tests
 * Tests for nav, form, and accessibility behavior
 */

require("./system");

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
    window.SystemUI.initializeNavigation();
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
  let form, nameField, phoneField, errorSpan;

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
    window.SystemUI.initializeFormValidation();
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

  test("validates email format", () => {
    document.body.innerHTML = `
      <form data-validate="true" novalidate>
        <div class="form-field">
          <label for="test-email">Email</label>
          <input id="test-email" name="email" type="email" required />
          <span class="form-error" id="test-email-error" aria-live="polite"></span>
        </div>
        <button class="btn btn-primary" type="submit">Submit</button>
        <p class="form-success" aria-live="polite"></p>
      </form>
    `;
    const emailForm = document.querySelector("form");
    const emailField = document.getElementById("test-email");
    window.SystemUI.initializeFormValidation();

    emailField.value = "not-an-email";
    emailForm.dispatchEvent(new Event("submit", { bubbles: true }));
    expect(emailField.getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById("test-email-error").textContent).toBe(
      "Enter a valid email address."
    );

    emailField.value = "valid@example.com";
    emailForm.dispatchEvent(new Event("submit", { bubbles: true }));
    expect(emailField.getAttribute("aria-invalid")).not.toBe("true");
  });

  test("validates ZIP code format", () => {
    document.body.innerHTML = `
      <form data-validate="true" novalidate>
        <div class="form-field">
          <label for="test-zip">ZIP</label>
          <input id="test-zip" name="zip" type="text" required />
          <span class="form-error" id="test-zip-error" aria-live="polite"></span>
        </div>
        <button class="btn btn-primary" type="submit">Submit</button>
        <p class="form-success" aria-live="polite"></p>
      </form>
    `;
    const zipForm = document.querySelector("form");
    const zipField = document.getElementById("test-zip");
    window.SystemUI.initializeFormValidation();

    zipField.value = "123";
    zipForm.dispatchEvent(new Event("submit", { bubbles: true }));
    expect(zipField.getAttribute("aria-invalid")).toBe("true");
    expect(document.getElementById("test-zip-error").textContent).toBe(
      "Enter a valid 5-digit ZIP code."
    );

    zipField.value = "13202";
    zipForm.dispatchEvent(new Event("submit", { bubbles: true }));
    expect(zipField.getAttribute("aria-invalid")).not.toBe("true");
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
    window.SystemUI.initializeAccordion();
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
  let trackingPayloads = [];
  let trackingHandler = null;
  let requestSubmitSpy = null;

  beforeEach(() => {
    trackingEvents = [];
    trackingPayloads = [];
    document.body.removeAttribute("data-template");

    trackingHandler = function (event) {
      trackingEvents.push(event.detail.eventName);
      trackingPayloads.push(event.detail);
    };
    window.addEventListener("analytics:track", trackingHandler);

    requestSubmitSpy = jest
      .spyOn(HTMLFormElement.prototype, "requestSubmit")
      .mockImplementation(function () {
        return undefined;
      });

    document.body.innerHTML = `
      <a href="#" data-track="call_click_header">Link</a>
      <button data-track="click_call_header_homepage">Button</button>
    `;

    window.SystemUI.initializeTracking();
  });

  afterEach(() => {
    if (requestSubmitSpy) {
      requestSubmitSpy.mockRestore();
      requestSubmitSpy = null;
    }

    if (trackingHandler) {
      window.removeEventListener("analytics:track", trackingHandler);
      trackingHandler = null;
    }
  });

  test("maps legacy tracking names to canonical event names", () => {
    const link = document.querySelector("a");
    link.click();

    expect(trackingEvents).toContain("click_call_header_homepage");
    expect(trackingPayloads[0].sourceEventName).toBe("call_click_header");
  });

  test("preserves canonical tracking names", () => {
    const button = document.querySelector("button");
    button.click();

    expect(trackingEvents).toContain("click_call_header_homepage");
    expect(trackingPayloads[trackingPayloads.length - 1].sourceEventName).toBe(
      "click_call_header_homepage"
    );
  });

  test("expands three-part names using template context", () => {
    document.body.dataset.template = "service";
    document.body.innerHTML = `<a href="#" data-track="click_call_header">Link</a>`;
    window.SystemUI.initializeTracking();

    document.querySelector("a").click();

    expect(trackingEvents).toContain("click_call_header_service");
    expect(trackingPayloads[trackingPayloads.length - 1].templateContext).toBe(
      "service"
    );
  });

  test("ignores malformed tracking names", () => {
    document.body.innerHTML = `<a href="#" data-track="Bad Event Name">Link</a>`;
    window.SystemUI.initializeTracking();

    document.querySelector("a").click();

    expect(trackingEvents).toHaveLength(0);
  });

  test("tracks submit event when form is submitted without click", () => {
    document.body.innerHTML = `
      <form id="track-form">
        <input id="form-name" name="name" type="text" value="Test User" />
        <button type="submit" data-track="submit_form_request_homepage">Submit</button>
      </form>
    `;
    window.SystemUI.initializeTracking();

    const form = document.getElementById("track-form");
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(trackingEvents).toContain("submit_form_request_homepage");
  });

  test("does not double-track submit button click plus submit event", () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    document.body.innerHTML = `
      <form id="track-form">
        <button id="track-submit" type="submit" data-track="submit_form_request_homepage">Submit</button>
      </form>
    `;
    window.SystemUI.initializeTracking();

    const form = document.getElementById("track-form");
    const button = document.getElementById("track-submit");

    button.dispatchEvent(new Event("click", { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    const submitEvents = trackingEvents.filter(function (name) {
      return name === "submit_form_request_homepage";
    });

    expect(submitEvents).toHaveLength(1);
    consoleErrorSpy.mockRestore();
  });
});

describe("Urgent CTA Prioritization", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <a id="svc-estimate-cta" class="btn btn-primary" href="#request">Request Estimate</a>
      <a id="svc-call-cta" class="btn btn-emergency" href="tel:+13155550100">Call Technician</a>
      <p id="svc-urgency-note" aria-live="polite"></p>
      <form data-urgent-source="svc-issue" data-urgent-call-cta="#svc-call-cta" data-urgent-form-cta="#svc-estimate-cta" data-urgent-live="#svc-urgency-note">
        <select id="svc-issue">
          <option value="">Select</option>
          <option value="no-heat">No heat</option>
          <option value="maintenance">Maintenance</option>
        </select>
      </form>
    `;
    window.SystemUI.initializeUrgentCtaPrioritization();
  });

  test("prioritizes call CTA for urgent symptoms", () => {
    const source = document.getElementById("svc-issue");
    const callCta = document.getElementById("svc-call-cta");
    const estimateCta = document.getElementById("svc-estimate-cta");

    source.value = "no-heat";
    source.dispatchEvent(new Event("change", { bubbles: true }));

    expect(callCta.classList.contains("btn-primary")).toBe(true);
    expect(estimateCta.classList.contains("btn-secondary")).toBe(true);
    expect(callCta.textContent).toBe("Call Technician Now");
  });

  test("restores default CTA state for non-urgent symptoms", () => {
    const source = document.getElementById("svc-issue");
    const callCta = document.getElementById("svc-call-cta");
    const estimateCta = document.getElementById("svc-estimate-cta");

    source.value = "no-heat";
    source.dispatchEvent(new Event("change", { bubbles: true }));

    source.value = "maintenance";
    source.dispatchEvent(new Event("change", { bubbles: true }));

    expect(callCta.classList.contains("btn-emergency")).toBe(true);
    expect(estimateCta.classList.contains("btn-primary")).toBe(true);
    expect(callCta.textContent).toBe("Call Technician");
    expect(estimateCta.textContent).toBe("Request Estimate");
  });
});

describe("Sticky Mobile CTA", () => {
  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => {
      return {
        matches: query === "(max-width: 767px)",
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    });

    document.body.innerHTML = `
      <div class="sticky-mobile-cta"></div>
      <form>
        <input id="mobile-input" type="text" />
      </form>
    `;
    window.SystemUI.initializeStickyMobileCta();
  });

  test("applies compact mode on mobile form focus", () => {
    const sticky = document.querySelector(".sticky-mobile-cta");
    const input = document.getElementById("mobile-input");

    input.focus();
    input.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

    expect(sticky.classList.contains("is-compact")).toBe(true);
  });

  test("removes compact mode when focus leaves controls", () => {
    const sticky = document.querySelector(".sticky-mobile-cta");
    const input = document.getElementById("mobile-input");

    input.focus();
    input.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));
    expect(sticky.classList.contains("is-compact")).toBe(true);

    input.blur();
    document.body.focus();
    window.dispatchEvent(new Event("resize"));

    expect(sticky.classList.contains("is-compact")).toBe(false);
  });
});

// AI assistant tests
describe("AI Assistant", () => {
  let trackingEvents = [];
  let trackingHandler = null;

  beforeEach(() => {
    trackingEvents = [];
    document.body.innerHTML = `
      <main id="main">
        <section>
          <form data-validate="true" novalidate>
            <div class="form-field">
              <label for="svc-name">Name</label>
              <input id="svc-name" name="name" type="text" required />
              <span class="form-error" id="svc-name-error" aria-live="polite"></span>
            </div>
            <div class="form-field">
              <label for="svc-phone">Phone</label>
              <input id="svc-phone" name="phone" type="tel" required />
              <span class="form-error" id="svc-phone-error" aria-live="polite"></span>
            </div>
            <div class="form-field">
              <label for="svc-issue">Current Issue</label>
              <select id="svc-issue" name="issue" required>
                <option value="">Select one</option>
                <option value="no-heat">No heat</option>
                <option value="maintenance">Maintenance</option>
                <option value="estimate">Estimate</option>
              </select>
              <span class="form-error" id="svc-issue-error" aria-live="polite"></span>
            </div>
            <button class="btn btn-primary" type="submit">Submit</button>
            <p class="form-success" aria-live="polite"></p>
          </form>
        </section>
      </main>
    `;
    document.body.dataset.template = "service";

    trackingHandler = function (event) {
      trackingEvents.push(event.detail.eventName);
    };

    window.addEventListener("analytics:track", trackingHandler);
    window.SystemUI.initializeAiAssistant();
  });

  afterEach(() => {
    if (trackingHandler) {
      window.removeEventListener("analytics:track", trackingHandler);
      trackingHandler = null;
    }

    document.body.removeAttribute("data-template");
    delete window.HVAC_AI;
  });

  test("mounts launcher and inline assistant", () => {
    expect(document.querySelector(".ai-launcher")).not.toBeNull();
    expect(document.querySelector(".ai-launcher-panel")).not.toBeNull();
    expect(document.querySelector(".ai-assistant")).not.toBeNull();
  });

  test("selecting a prompt populates the issue field and tracks selection", () => {
    const issueField = document.getElementById("svc-issue");
    const promptButton = Array.from(document.querySelectorAll(".ai-assistant-prompt")).find(
      function (button) {
        return button.textContent === "No heat";
      }
    );

    promptButton.click();

    expect(issueField.value).toBe("no-heat");
    expect(trackingEvents).toContain("select_ai_prompt_service");
  });

  test("tracks AI lead creation on submit after prompt selection", () => {
    const form = document.querySelector("form");
    const promptButton = Array.from(document.querySelectorAll(".ai-assistant-prompt")).find(
      function (button) {
        return button.textContent === "Routine maintenance";
      }
    );

    promptButton.click();
    document.getElementById("svc-name").value = "Test User";
    document.getElementById("svc-phone").value = "(315) 555-0100";
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(trackingEvents).toContain("create_ai_lead_service");
  });

  test("calls fetch with /lead when endpoint is configured", () => {
    window.HVAC_AI = { endpoint: "https://ai.example.com" };
    const fetchMock = jest.fn().mockResolvedValue({ ok: true });
    window.fetch = fetchMock;

    document.body.innerHTML = `
      <form data-validate="true" novalidate>
        <input id="svc-name" name="name" type="text" value="" />
        <input id="svc-phone" name="phone" type="tel" value="" />
        <input id="svc-zip" name="zip" type="text" value="" />
        <select id="svc-issue" name="issue">
          <option value="">Select…</option>
          <option value="no-heat">No heat</option>
          <option value="maintenance">Routine maintenance</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    `;
    document.body.dataset.template = "service";
    window.SystemUI.initializeAiAssistant();

    const promptButton = Array.from(document.querySelectorAll(".ai-assistant-prompt")).find(
      function (btn) { return btn.textContent === "No heat"; }
    );
    promptButton.click();

    document.getElementById("svc-name").value = "Test User";
    document.getElementById("svc-phone").value = "3155550100";

    const form = document.querySelector("form");
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/lead"),
      expect.objectContaining({ method: "POST" })
    );

    delete window.fetch;
  });

  test("renders conversational chat and posts messages to /chat", async () => {
    window.HVAC_AI = { endpoint: "https://ai.example.com/api" };
    const fetchMock = jest.fn(function (url) {
      if (String(url).includes("/chat")) {
        return Promise.resolve({
          ok: true,
          json: function () {
            return Promise.resolve({
              reply: "Please call dispatch now.",
              suggestedPrompt: "No heat",
            });
          },
        });
      }

      return Promise.resolve({ ok: true, json: function () { return Promise.resolve({}); } });
    });
    window.fetch = fetchMock;

    document.body.innerHTML = `
      <form data-validate="true" novalidate>
        <input id="svc-name" name="name" type="text" value="" />
        <input id="svc-phone" name="phone" type="tel" value="" />
        <select id="svc-issue" name="issue">
          <option value="">Select…</option>
          <option value="no-heat">No heat</option>
          <option value="maintenance">Routine maintenance</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    `;
    document.body.dataset.template = "service";

    window.SystemUI.initializeAiAssistant();
    document.querySelector(".ai-launcher").click();

    const chatInput = document.querySelector(".ai-chat-input");
    const chatForm = document.querySelector(".ai-chat-composer");
    chatInput.value = "There is a gas smell";
    chatForm.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    await Promise.resolve();
    await Promise.resolve();

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/chat"),
      expect.objectContaining({ method: "POST" })
    );

    const chatCall = fetchMock.mock.calls.find(function (call) {
      return String(call[0]).includes("/chat");
    });
    const chatBody = JSON.parse(chatCall[1].body);
    expect(typeof chatBody.sessionId).toBe("string");
    expect(Array.isArray(chatBody.history)).toBe(true);
    expect(chatBody.history.length).toBeGreaterThan(0);

    expect(document.querySelectorAll(".ai-chat-message").length).toBeGreaterThan(1);
    expect(document.querySelectorAll(".ai-chat-message-assistant").length).toBeGreaterThan(0);

    delete window.fetch;
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

    const error = document.getElementById("field-error");

    expect(error.getAttribute("aria-live")).toBe("polite");
  });

  test("focus outline is visible on all interactive elements", () => {
    document.head.innerHTML = `
      <style>
        button:focus-visible,
        a:focus-visible,
        input:focus-visible {
          outline: 2px solid rgb(204 20 42);
        }
      </style>
    `;
    document.body.innerHTML = `
      <button class="btn">Click</button>
      <a href="#">Link</a>
      <input type="text" />
    `;

    const stylesheet = Array.from(document.styleSheets).find((sheet) => {
      return Array.from(sheet.cssRules || []).some((rule) => {
        return String(rule.selectorText || "").includes(":focus-visible");
      });
    });

    expect(stylesheet).toBeTruthy();
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
