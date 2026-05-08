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

const assistantPromptCatalog = {
  homepage: [
    {
      label: "No cooling right now",
      summary: "AC stopped cooling and you need fast triage.",
      issueValue: "Cooling",
      urgency: "urgent",
      handoff: "call",
    },
    {
      label: "Heating issue",
      summary: "Heat is weak or not turning on.",
      issueValue: "Heating",
      urgency: "urgent",
      handoff: "call",
    },
    {
      label: "Plumbing problem",
      summary: "Water issue or plumbing repair request.",
      issueValue: "Plumbing",
      urgency: "standard",
      handoff: "form",
    },
    {
      label: "I want financing options",
      summary: "You want to review financing before booking.",
      issueValue: "Financing",
      urgency: "standard",
      handoff: "form",
    },
  ],
  service: [
    {
      label: "No heat",
      summary: "Heating system is down and likely needs urgent service.",
      issueValue: "no-heat",
      urgency: "urgent",
      handoff: "call",
    },
    {
      label: "No cooling",
      summary: "Cooling system is down and likely needs urgent service.",
      issueValue: "no-cooling",
      urgency: "urgent",
      handoff: "call",
    },
    {
      label: "Routine maintenance",
      summary: "You want a non-urgent visit or tune-up.",
      issueValue: "maintenance",
      urgency: "standard",
      handoff: "form",
    },
    {
      label: "Replacement estimate",
      summary: "You want help deciding between repair and replacement.",
      issueValue: "estimate",
      urgency: "standard",
      handoff: "form",
    },
  ],
  location: [
    {
      label: "Check my service area",
      summary: "Confirm whether your address or ZIP is inside the dispatch area.",
      issueValue: "Service area check",
      urgency: "standard",
      handoff: "form",
    },
    {
      label: "Need same-day availability",
      summary: "You want the fastest local appointment or dispatch window.",
      issueValue: "Same-day request",
      urgency: "urgent",
      handoff: "call",
    },
    {
      label: "Need help choosing service",
      summary: "You need help deciding what to book before submitting.",
      issueValue: "Service selection help",
      urgency: "standard",
      handoff: "form",
    },
  ],
  emergency: [
    {
      label: "No heat or no cooling",
      summary: "Emergency heating or cooling outage detected.",
      issueValue: "No heat or cooling emergency",
      urgency: "urgent",
      handoff: "call",
    },
    {
      label: "Active leak",
      summary: "Water leak or active plumbing emergency detected.",
      issueValue: "Active leak emergency",
      urgency: "urgent",
      handoff: "call",
    },
    {
      label: "Need a callback if line is busy",
      summary: "Capture the emergency details for callback triage.",
      issueValue: "Callback request",
      urgency: "urgent",
      handoff: "form",
    },
  ],
};

function createElement(tagName, className, textContent) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  if (typeof textContent === "string") {
    element.textContent = textContent;
  }

  return element;
}

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

function initializeAiAssistant() {
  if (!document.body) {
    return;
  }

  const templateContext = getTemplateContext();
  const assistantConfig = (window && window.HVAC_AI) || {};
  const promptSet = assistantPromptCatalog[templateContext] || assistantPromptCatalog.homepage;

  if (!promptSet || promptSet.length === 0) {
    return;
  }

  const dispatchTrackingEvent = function (eventName, detail) {
    if (typeof window.dispatchEvent !== "function") {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("analytics:track", {
        detail: Object.assign(
          {
            eventName: eventName,
            sourceEventName: eventName,
            templateContext: templateContext,
          },
          detail || {}
        ),
      })
    );
  };

  const getLeadDestination = function () {
    if (assistantConfig.endpoint) {
      return "endpoint";
    }

    if (assistantConfig.webhookUrl) {
      return "webhook";
    }

    return "fallback";
  };

  const buildLeadPayload = function (form, prompt) {
    const formData = new FormData(form);
    const payload = {
      template: templateContext,
      promptLabel: prompt.label,
      summary: prompt.summary,
      urgency: prompt.urgency,
      handoff: prompt.handoff,
      destination: getLeadDestination(),
      capturedAt: new Date().toISOString(),
      fields: {},
    };

    formData.forEach(function (value, key) {
      payload.fields[key] = String(value || "");
    });

    return payload;
  };

  const getEndpointUrl = function (config, pathSuffix) {
    if (!config || !config.endpoint) {
      return "";
    }

    return String(config.endpoint).replace(/\/$/, "") + pathSuffix;
  };

  const createSessionId = function () {
    if (typeof window === "undefined") {
      return String(Date.now()) + "-" + Math.random().toString(36).slice(2, 10);
    }

    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }

    return String(Date.now()) + "-" + Math.random().toString(36).slice(2, 10);
  };

  /**
   * Fire-and-forget POST to the configured AI endpoint or webhook URL.
   * Uses a 5-second AbortController timeout.  Any network error is silently
   * swallowed so the standard form submission always goes through.
   *
   * @param {object} payload - Sanitised lead payload built by buildLeadPayload().
   * @param {object} config  - window.HVAC_AI config object { endpoint, webhookUrl }.
   */
  const sendAiLead = function (payload, config) {
    var baseUrl = config.endpoint || config.webhookUrl;
    if (!baseUrl) {
      return;
    }

    if (typeof window.fetch !== "function") {
      return;
    }

    var controller = new window.AbortController();
    var timer = window.setTimeout(function () {
      controller.abort();
    }, 5000);

    var destination = config.endpoint ? getEndpointUrl(config, "/lead") : baseUrl;

    window
      .fetch(destination, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      .then(function () {
        window.clearTimeout(timer);
      })
      .catch(function () {
        window.clearTimeout(timer);
        // Silent fallback — the standard form submission still routes the lead.
      });
  };

  const sendAiChat = function (message, config, context) {
    if (!message || typeof window.fetch !== "function") {
      return Promise.resolve(null);
    }

    var destination = getEndpointUrl(config, "/chat");
    if (!destination) {
      return Promise.resolve(null);
    }

    var controller = new window.AbortController();
    var timer = window.setTimeout(function () {
      controller.abort();
    }, 6500);

    return window
      .fetch(destination, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          template: templateContext,
          context: (context && context.context) || {},
          sessionId: (context && context.sessionId) || "",
          history: (context && context.history) || [],
        }),
        signal: controller.signal,
      })
      .then(function (response) {
        window.clearTimeout(timer);
        if (!response || !response.ok) {
          return null;
        }

        return response.json();
      })
      .catch(function () {
        window.clearTimeout(timer);
        return null;
      });
  };

  const sendAiHandoff = function (payload, config) {
    if (!config || !config.endpoint || !payload || typeof window.fetch !== "function") {
      return;
    }

    var controller = new window.AbortController();
    var timer = window.setTimeout(function () {
      controller.abort();
    }, 5000);

    window
      .fetch(getEndpointUrl(config, "/handoff"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      .then(function () {
        window.clearTimeout(timer);
      })
      .catch(function () {
        window.clearTimeout(timer);
      });
  };

  const getLocalChatReply = function (message, history) {
    var lower = String(message || "").toLowerCase();
    var historyLower = (history || []).map(function(h) { return String(h.content || "").toLowerCase(); }).join(" ");

    // Safety-critical issues - immediate escalation
    if (/gas\s+(?:smell|leak|odor)|smell\s+gas|rotten\s+egg|sulfur\s+smell/.test(lower)) {
      return {
        reply: "This is a serious safety issue. Evacuate the building immediately and call your gas utility from outside. After they clear the system, contact Potter-Perrone dispatch at (315) 472-3557 for HVAC inspection.",
        suggestedPrompt: "Emergency dispatch"
      };
    }

    if (/active\s+leak|water\s+(?:flood|pouring)|burst\s+pipe|flooding/.test(lower)) {
      return {
        reply: "This requires immediate action. If safe, locate and shut off your water main to minimize damage. Then call Potter-Perrone dispatch at (315) 472-3557 for emergency plumbing support.",
        suggestedPrompt: "Emergency dispatch"
      };
    }

    // Heating emergencies
    if (/no\s+heat|not\s+(?:heating|working)|furnace\s+(?:down|broke|stopped)|won't\s+turn\s+on|furnace\s+won't|heating\s+system\s+down|won't\s+start/.test(lower)) {
      return {
        reply: "No heat in cold weather is urgent. First, verify your thermostat is set to HEAT and above room temperature. Check if the furnace breaker is ON and look for a reset button on the unit. If these don't fix it, call Potter-Perrone dispatch at (315) 472-3557 - we handle same-day emergency heating.",
        suggestedPrompt: "Emergency heating"
      };
    }

    // Cooling issues (warm/not cooling)
    if (/(?:ac|air\s+(?:cond|cool)|cooling)\s+(?:warm|not\s+(?:cooling|working)|broken|down|stopped|blowing\s+warm)|short.cycling|weak\s+(?:ac|cooling)/.test(lower)) {
      return {
        reply: "Set your thermostat to COOL mode and below room temperature. Make sure the outdoor AC unit can run freely. Check your air filter for clogs. If the AC still won't cool, call Potter-Perrone at (315) 472-3557 - we offer same-day AC diagnostics.",
        suggestedPrompt: "Emergency cooling"
      };
    }

    // Plumbing issues
    if (/drain\s+(?:backup|clogged|slow)|water\s+(?:drain|backup)|clogged|backed\s+up|slow\s+drain/.test(lower)) {
      return {
        reply: "Try plunging the affected drain firmly 10-15 times. If it doesn't clear, a plumbing snake might help. Multiple slow drains can indicate a main line issue. When you're ready, call Potter-Perrone at (315) 472-3557 for professional drain cleaning.",
        suggestedPrompt: "Drain service"
      };
    }

    if (/water\s+(?:drip|leak|dropping)|leak|leaking|dripping|puddle|wet\s+floor|under\s+sink/.test(lower)) {
      return {
        reply: "Locate where the water is coming from and place buckets to catch drips. For under-sink leaks, check if you can tighten the connection fitting. For ceiling leaks or unknown sources, call Potter-Perrone dispatch at (315) 472-3557 - water damage gets worse the longer it waits.",
        suggestedPrompt: "Emergency plumbing"
      };
    }

    // General HVAC maintenance and diagnostics
    if (/(?:noise|sound|smell|odor|vibrat)/.test(lower) && /(?:furnace|ac|hvac|unit|system)/.test(lower)) {
      return {
        reply: "Unusual sounds, smells, or vibrations from your HVAC system should be checked soon. This could indicate wear, debris, or a refrigerant issue. Call Potter-Perrone at (315) 472-3557 to schedule a diagnostic visit.",
        suggestedPrompt: "System diagnostic"
      };
    }

    if (/thermostat|temperature/.test(lower)) {
      return {
        reply: "If your thermostat isn't responding, try replacing the batteries first (if wireless). Check that the breaker is ON. If it still doesn't work or reads wrong, the thermostat may need replacement. We can help with that - call (315) 472-3557.",
        suggestedPrompt: "Thermostat service"
      };
    }

    if (/maintenance|tune.?up|inspection|check.?up/.test(lower)) {
      return {
        reply: "Regular maintenance before heating or cooling season keeps systems running efficiently and extends their life. We offer seasonal inspections with filter replacement, performance checks, and optimization. Call (315) 472-3557 to book.",
        suggestedPrompt: "Maintenance visit"
      };
    }

    // Pricing and estimates
    if (/estimate|quote|price|cost|how\s+much|financing|payment/.test(lower)) {
      return {
        reply: "We provide free estimates for repairs and replacements. Pricing depends on your system type and the work needed. We also offer financing options with 0% available for qualifying work. Submit the form with your details and we'll follow up with a customized estimate.",
        suggestedPrompt: "Get estimate"
      };
    }

    // Service area / coverage
    if (/service\s+area|coverage|zip|location|address|where/.test(lower)) {
      return {
        reply: "We serve Syracuse and the surrounding Central New York region. To verify your specific location, share your ZIP code and we'll check coverage. Call (315) 472-3557 if you're in a remote area - we may still be able to help.",
        suggestedPrompt: "Check service area"
      };
    }

    // Hours and availability
    if (/hour|open|close|when|available|schedule|appointment/.test(lower)) {
      return {
        reply: "We're open Mon-Fri 7am-5pm for standard service. Emergency dispatch is available 24/7 for urgent heating, cooling, and plumbing issues. Call (315) 472-3557 or submit a request form for quick scheduling.",
        suggestedPrompt: "Schedule service"
      };
    }

    // Company info
    if (/who|about|company|history|experience|licensed/.test(lower)) {
      return {
        reply: "Potter-Perrone has served Syracuse since 1944 - over 80 years of trusted HVAC and plumbing expertise. We're fully licensed, EPA-certified, and BBB accredited. All our technicians are trained professionals backed by our satisfaction guarantee.",
        suggestedPrompt: "Our services"
      };
    }

    // Default fallback
    return {
      reply: "I can help with heating, cooling, plumbing issues, diagnostics, maintenance, estimates, and emergency dispatch. Tell me what's happening with your HVAC or plumbing system, and I'll guide your next best step.",
      suggestedPrompt: "Describe your issue"
    };
  };

  const maybePopulateField = function (form, names, value) {
    if (!value) {
      return null;
    }

    for (let index = 0; index < names.length; index += 1) {
      const field = form.querySelector("[name='" + names[index] + "']");

      if (!field) {
        continue;
      }

      field.value = value;
      field.dispatchEvent(new Event("input", { bubbles: true }));
      field.dispatchEvent(new Event("change", { bubbles: true }));
      return field;
    }

    return null;
  };

  const attachInlineAssistant = function (form) {
    if (!form || form.dataset.aiBound) {
      return;
    }

    const shell = createElement("section", "ai-assistant panel", null);
    shell.setAttribute("aria-label", "AI intake assistant");

    const eyebrow = createElement("span", "eyebrow", "AI Intake Assistant");
    const title = createElement("h3", null, "Start With Guided Triage");
    const copy = createElement(
      "p",
      null,
      "Choose the closest issue and the assistant will prepare the form for you, recommend the right next step, and keep the standard contact path available."
    );
    const promptList = createElement("div", "ai-assistant-prompts", null);
    const status = createElement("p", "ai-assistant-status", "Select an option to start.");
    status.setAttribute("aria-live", "polite");

    shell.appendChild(eyebrow);
    shell.appendChild(title);
    shell.appendChild(copy);
    shell.appendChild(promptList);
    shell.appendChild(status);

    promptSet.forEach(function (prompt) {
      const button = createElement("button", "btn btn-secondary ai-assistant-prompt", prompt.label);
      button.type = "button";

      button.addEventListener("click", function () {
        maybePopulateField(form, ["issue"], prompt.issueValue);
        maybePopulateField(form, ["notes", "neighborhood"], prompt.summary);

        if (prompt.handoff === "call") {
          status.textContent =
            "Urgent path detected. Calling dispatch is recommended, but you can still submit the form if needed.";
        } else {
          status.textContent =
            "The form has been prepared with the selected issue. Add contact details and submit when ready.";
        }

        form.dataset.aiSelectedPrompt = prompt.label;
        form.dataset.aiLeadPayload = JSON.stringify(buildLeadPayload(form, prompt));

        dispatchTrackingEvent("select_ai_prompt_" + templateContext, {
          promptLabel: prompt.label,
          urgency: prompt.urgency,
          handoff: prompt.handoff,
        });

        const firstEmpty = form.querySelector("input:not([type='hidden']):not([value]), textarea:empty, select");
        if (firstEmpty && typeof firstEmpty.focus === "function") {
          firstEmpty.focus();
        }
      });

      promptList.appendChild(button);
    });

    form.insertAdjacentElement("beforebegin", shell);

    form.addEventListener("submit", function () {
      const selectedPrompt = String(form.dataset.aiSelectedPrompt || "");
      if (!selectedPrompt) {
        return;
      }

      // Re-build the payload with whatever the user filled in after prompt selection,
      // so all fields are captured at submission time (not just at click time).
      const matchedPrompt = promptSet.find(function (p) {
        return p.label === selectedPrompt;
      }) || { label: selectedPrompt, summary: "", urgency: "standard", handoff: "form" };

      const freshPayload = buildLeadPayload(form, matchedPrompt);

      // Non-blocking HTTP delivery — silent fallback on any error.
      sendAiLead(freshPayload, assistantConfig);

      dispatchTrackingEvent("create_ai_lead_" + templateContext, {
        promptLabel: selectedPrompt,
        destination: getLeadDestination(),
      });

      status.textContent =
        "AI triage summary attached. If automation is unavailable, the normal form request still goes through.";
    });

    form.dataset.aiBound = "true";
  };

  const attachGlobalLauncher = function () {
    const existingLauncher = document.querySelector(".ai-launcher");
    const existingPanel = document.querySelector(".ai-launcher-panel");

    if (!existingLauncher && !existingPanel) {
      delete document.body.dataset.aiLauncherBound;
    }

    if (existingLauncher || document.body.dataset.aiLauncherBound) {
      return;
    }

    const launcher = createElement("button", "ai-launcher", "AI Chat");
    launcher.type = "button";
    launcher.setAttribute("aria-expanded", "false");

    const panel = createElement("aside", "ai-launcher-panel panel", null);
    panel.hidden = true;
    panel.setAttribute("aria-label", "AI chat assistant");

    const panelHeader = createElement("div", "ai-launcher-panel-header", null);
    const panelTitle = createElement("h2", null, "HVAC AI Assistant");

    panelHeader.appendChild(panelTitle);

    const panelCopy = createElement(
      "p",
      null,
      "Ask questions, describe symptoms, and the assistant will guide next steps and prep the request form."
    );
    const emergencyAlert = createElement("p", "ai-chat-alert", "");
    emergencyAlert.hidden = true;
    emergencyAlert.setAttribute("aria-live", "assertive");
    const transcript = createElement("div", "ai-chat-transcript", null);
    transcript.setAttribute("role", "log");
    transcript.setAttribute("aria-live", "polite");

    const quickList = createElement("div", "ai-chat-quick-list", null);
    const composer = createElement("form", "ai-chat-composer", null);
    composer.noValidate = true;

    const input = createElement("input", "ai-chat-input", null);
    input.type = "text";
    input.name = "ai-chat-message";
    input.placeholder = "Describe your issue...";
    input.setAttribute("aria-label", "Message the AI assistant");

    const sendButton = createElement("button", "btn btn-primary ai-chat-send", "Send");
    sendButton.type = "submit";

    const chatSessionId = createSessionId();
    const conversationHistory = [];
    let chatLeadSent = false;
    let degradedModeAnnounced = false;

    const appendMessage = function (role, text) {
      const message = createElement(
        "p",
        "ai-chat-message ai-chat-message-" + role,
        text
      );
      transcript.appendChild(message);
      transcript.scrollTop = transcript.scrollHeight;

      if (role === "user" || role === "assistant") {
        conversationHistory.push({
          role: role,
          content: String(text || "").slice(0, 500),
        });

        if (conversationHistory.length > 16) {
          conversationHistory.splice(0, conversationHistory.length - 16);
        }
      }
    };

    const handleSuggestedPrompt = function (label) {
      if (!label) {
        return;
      }

      const matchedPrompt = promptSet.find(function (prompt) {
        return String(prompt.label || "").toLowerCase() === String(label).toLowerCase();
      });
      const form = document.querySelector("form[data-validate='true']");

      if (!matchedPrompt || !form) {
        return;
      }

      maybePopulateField(form, ["issue"], matchedPrompt.issueValue);
      maybePopulateField(form, ["notes", "neighborhood"], matchedPrompt.summary);
      form.dataset.aiSelectedPrompt = matchedPrompt.label;
    };

    const setEmergencyAlert = function (isEmergency, text) {
      if (!isEmergency) {
        emergencyAlert.hidden = true;
        emergencyAlert.textContent = "";
        return;
      }

      emergencyAlert.hidden = false;
      emergencyAlert.textContent =
        text || "Emergency guidance active: calling dispatch at (315) 472-3557 is recommended.";
    };

    const applyActionHints = function (result) {
      if (!result || !result.actions) {
        setEmergencyAlert(false);
        return;
      }

      const form = document.querySelector("form[data-validate='true']");
      if (form && result.actions.prefillPromptLabel) {
        handleSuggestedPrompt(result.actions.prefillPromptLabel);
      }

      if (form && result.actions.prefillFields && typeof result.actions.prefillFields === "object") {
        Object.keys(result.actions.prefillFields).forEach(function (fieldName) {
          maybePopulateField(form, [fieldName], result.actions.prefillFields[fieldName]);
        });
      }

      const isEmergency = !!(result.safety && result.safety.isEmergency === true);
      setEmergencyAlert(isEmergency, isEmergency ? result.reply : "");

      if (result.actions.shouldCreateLead === true && !chatLeadSent) {
        const promptLabel =
          String(result.actions.prefillPromptLabel || result.suggestedPrompt || "Chat intake").trim() ||
          "Chat intake";

        const matchedPrompt = promptSet.find(function (prompt) {
          return String(prompt.label || "").toLowerCase() === promptLabel.toLowerCase();
        });

        if (form) {
          const promptForLead =
            matchedPrompt || {
              label: promptLabel,
              summary: String((result.reply || "").slice(0, 220)),
              urgency:
                result.extracted && String(result.extracted.urgency || "").toLowerCase() === "urgent"
                  ? "urgent"
                  : "standard",
              handoff: result.actions.shouldHandoff ? "call" : "form",
            };

          form.dataset.aiSelectedPrompt = promptForLead.label;
          sendAiLead(buildLeadPayload(form, promptForLead), assistantConfig);
        } else {
          sendAiLead(
            {
              template: templateContext,
              promptLabel: promptLabel,
              summary: String((result.reply || "").slice(0, 220)),
              urgency:
                result.extracted && String(result.extracted.urgency || "").toLowerCase() === "urgent"
                  ? "urgent"
                  : "standard",
              handoff: result.actions.shouldHandoff ? "call" : "form",
              destination: getLeadDestination(),
              capturedAt: new Date().toISOString(),
              fields: (result.actions && result.actions.prefillFields) || {},
            },
            assistantConfig
          );
        }

        chatLeadSent = true;
        dispatchTrackingEvent("create_ai_lead_" + templateContext, {
          promptLabel: promptLabel,
          destination: getLeadDestination(),
          source: "chat-action",
        });
      }

      if (result.actions.shouldHandoff === true && assistantConfig.endpoint) {
        sendAiHandoff(
          {
            template: templateContext,
            reason: result.actions.handoffReason || "chat-escalation",
            urgency: result.safety && result.safety.isEmergency ? "urgent" : "standard",
            recommendedAction: result.actions.recommendedAction || "call",
            summary: String(result.reply || "").slice(0, 500),
            transcript: conversationHistory.slice(-12),
            fields: (result.actions && result.actions.prefillFields) || {},
          },
          assistantConfig
        );

        dispatchTrackingEvent("handoff_ai_chat_" + templateContext, {
          reason: result.actions.handoffReason || "chat-escalation",
          destination: getLeadDestination(),
        });
      }
    };

    const submitMessage = function (rawText) {
      const text = String(rawText || "").trim();
      if (!text) {
        return;
      }

      appendMessage("user", text);
      input.value = "";
      sendButton.disabled = true;

      dispatchTrackingEvent("send_ai_chat_" + templateContext, {
        destination: getLeadDestination(),
      });

      sendAiChat(text, assistantConfig, {
        sessionId: chatSessionId,
        history: conversationHistory.slice(-8),
        context: {
          hasForm: !!document.querySelector("form[data-validate='true']"),
        },
      })
        .then(function (result) {
          const isDegraded = !(result && result.reply);
          const fallback = getLocalChatReply(text, conversationHistory);
          const reply = result && result.reply ? result.reply : fallback.reply;
          const suggestedPrompt = result && result.suggestedPrompt ? result.suggestedPrompt : fallback.suggestedPrompt;

          if (isDegraded && !degradedModeAnnounced) {
            appendMessage(
              "assistant",
              "Live AI is temporarily unavailable. I can still provide local triage guidance and route you to dispatch."
            );
            degradedModeAnnounced = true;
          }

          if (isDegraded) {
            dispatchTrackingEvent("degraded_ai_chat_" + templateContext, {
              destination: getLeadDestination(),
              reason: "chat-endpoint-unavailable",
            });
          }

          appendMessage("assistant", reply);
          handleSuggestedPrompt(suggestedPrompt);
          applyActionHints(result);

          if (result && result.safety && result.safety.isEmergency === true) {
            appendMessage(
              "assistant",
              "Emergency path is active. Calling dispatch now at (315) 472-3557 is recommended."
            );
          }
        })
        .finally(function () {
          sendButton.disabled = false;
        });
    };

    promptSet.slice(0, 3).forEach(function (prompt) {
      const button = createElement("button", "ai-launcher-action ai-chat-quick", prompt.label);
      button.type = "button";

      button.addEventListener("click", function () {
        input.value = prompt.summary;
        submitMessage(prompt.summary);
      });

      quickList.appendChild(button);
    });

    composer.addEventListener("submit", function (event) {
      event.preventDefault();
      submitMessage(input.value);
    });

    composer.appendChild(input);
    composer.appendChild(sendButton);

    panel.appendChild(panelHeader);
    panel.appendChild(panelCopy);
    panel.appendChild(emergencyAlert);
    panel.appendChild(transcript);
    panel.appendChild(quickList);
    panel.appendChild(composer);

    const updateLauncherLabel = function (isOpen) {
      if (isOpen) {
        launcher.textContent = "Close";
        launcher.setAttribute("aria-label", "Close AI chat");
      } else {
        launcher.textContent = "AI Chat";
        launcher.setAttribute("aria-label", "Open AI chat");
      }
    };

    const setPanelState = function (open, source) {
      const shouldOpen = !!open;
      panel.hidden = !shouldOpen;
      launcher.setAttribute("aria-expanded", String(shouldOpen));
      panel.dataset.state = shouldOpen ? "open" : "closed";
      updateLauncherLabel(shouldOpen);

      if (shouldOpen && !transcript.dataset.greetingSent) {
        appendMessage(
          "assistant",
          "Hi, I'm your HVAC AI assistant. Tell me what's going on and I will guide your next best step."
        );
        transcript.dataset.greetingSent = "true";
      }

      if (shouldOpen && typeof input.focus === "function") {
        input.focus();
      }

      try {
        window.sessionStorage.setItem("aiChatState", shouldOpen ? "open" : "closed");
      } catch (_) {
        // Ignore storage failures in privacy-restricted contexts.
      }

      dispatchTrackingEvent("open_ai_assistant_" + templateContext, {
        destination: getLeadDestination(),
        state: shouldOpen ? "open" : "closed",
        source: source || "unknown",
      });
    };

    launcher.addEventListener("click", function () {
      setPanelState(panel.hidden, "launcher");
    });

    panel.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      setPanelState(false, "escape");
    });

    panel.addEventListener(
      "wheel",
      function (event) {
        if (panel.hidden) {
          return;
        }

        transcript.scrollTop += event.deltaY;
        event.preventDefault();
      },
      { passive: false }
    );

    document.body.appendChild(panel);
    document.body.appendChild(launcher);

    // Auto-open once on desktop so users immediately see the AI chat capability.
    if (typeof window !== "undefined" && window.innerWidth >= 1024) {
      let shouldAutoOpen = true;

      try {
        shouldAutoOpen = window.sessionStorage.getItem("aiChatSeen") !== "true";
      } catch (_) {
        shouldAutoOpen = true;
      }

      if (shouldAutoOpen) {
        setPanelState(true, "auto-open-desktop");

        try {
          window.sessionStorage.setItem("aiChatSeen", "true");
        } catch (_) {
          // Ignore storage failures in privacy-restricted contexts.
        }
      } else {
        setPanelState(false, "default");
      }
    } else {
      // Keep chat closed on mobile to avoid crowding content.
      setPanelState(false, "default");
    }

    updateLauncherLabel();

    document.body.dataset.aiLauncherBound = "true";
  };

  attachGlobalLauncher();
  document.querySelectorAll("form[data-validate='true']").forEach(attachInlineAssistant);
}

function initializeTracking() {
  const templateContext = getTemplateContext();

  function isCanonicalTrackName(name) {
    return trackEventPattern.test(name);
  }

  function isSubmitControl(element) {
    if (!element || !element.tagName) {
      return false;
    }

    const tagName = String(element.tagName).toUpperCase();
    if (tagName === "BUTTON") {
      return String(element.getAttribute("type") || "submit").toLowerCase() === "submit";
    }

    if (tagName === "INPUT") {
      const inputType = String(element.getAttribute("type") || "").toLowerCase();
      return inputType === "submit" || inputType === "image";
    }

    return false;
  }

  function getTrackedSubmitControl(form) {
    if (!form || typeof form.querySelector !== "function") {
      return null;
    }

    return form.querySelector(
      "button[type='submit'][data-track], button:not([type])[data-track], input[type='submit'][data-track], input[type='image'][data-track]"
    );
  }

  function normalizeTrackName(eventName) {
    if (!eventName) {
      return eventName;
    }

    const withTemplateToken = eventName.replace(/\{template\}/g, templateContext);
    let normalized = withTemplateToken;

    if (isCanonicalTrackName(normalized)) {
      return normalized;
    }

    if (legacyTrackMap[normalized]) {
      normalized = legacyTrackMap[normalized];
    } else if (trackEventThreePartPattern.test(normalized)) {
      normalized = normalized + "_" + templateContext;
    }

    if (!isCanonicalTrackName(normalized)) {
      return null;
    }

    return normalized;
  }

  function trackEvent(eventName) {
    if (!eventName) {
      return;
    }

    const normalizedEventName = normalizeTrackName(eventName);
    if (!normalizedEventName) {
      return;
    }

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

      if (isSubmitControl(el)) {
        const ownerForm = el.form || el.closest("form");
        if (ownerForm && ownerForm.dataset) {
          ownerForm.dataset.trackSubmitClickName = String(eventName || "");
          ownerForm.dataset.trackSubmitClickAt = String(Date.now());
        }
      }

      trackEvent(eventName);
    });
    el.dataset.trackBound = "true";
  });

  document.querySelectorAll("form").forEach(function (form) {
    if (form.dataset.trackSubmitBound) {
      return;
    }

    form.addEventListener("submit", function (event) {
      let submitControl = null;
      if (event.submitter && event.submitter.getAttribute("data-track")) {
        submitControl = event.submitter;
      } else {
        submitControl = getTrackedSubmitControl(form);
      }

      if (!submitControl) {
        return;
      }

      const eventName = submitControl.getAttribute("data-track");
      const lastClickName = String(form.dataset.trackSubmitClickName || "");
      const lastClickAt = Number(form.dataset.trackSubmitClickAt || "0");
      const isRecentClick = Date.now() - lastClickAt < 400;

      if (isRecentClick && lastClickName === String(eventName || "")) {
        return;
      }

      trackEvent(eventName);
    });

    form.dataset.trackSubmitBound = "true";
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
  const dispatchDeliveryTelemetry = function (eventName, templateContext, detail) {
    if (typeof window.dispatchEvent !== "function") {
      return;
    }

    window.dispatchEvent(
      new CustomEvent("analytics:track", {
        detail: Object.assign(
          {
            eventName: eventName,
            sourceEventName: eventName,
            templateContext: templateContext,
          },
          detail || {}
        ),
      })
    );
  };

  const getLeadDestinationFromConfig = function (config) {
    if (config && config.endpoint) {
      return "endpoint";
    }

    if (config && config.webhookUrl) {
      return "webhook";
    }

    return "fallback";
  };

  const buildLeadPayloadFromForm = function (form, templateContext, config) {
    const formData = new FormData(form);
    const fields = {};

    formData.forEach(function (value, key) {
      fields[key] = String(value || "");
    });

    const issueText = String(fields.issue || fields.notes || "").trim();
    const promptLabel = String(form.dataset.aiSelectedPrompt || issueText || "Website form request");
    const urgencySignals = /gas|odor|smell|leak|flood|burst|no heat|no cooling|emergency|urgent|asap|immediately|right now/i;
    const urgency = urgencySignals.test(issueText) ? "urgent" : "standard";
    const summary = issueText
      ? "Customer submitted website form: " + issueText
      : "Customer submitted website request form.";

    return {
      template: templateContext,
      promptLabel: promptLabel,
      summary: summary,
      urgency: urgency,
      handoff: urgency === "urgent" ? "call" : "form",
      destination: getLeadDestinationFromConfig(config),
      capturedAt: new Date().toISOString(),
      fields: fields,
    };
  };

  const submitLeadPayload = function (payload, config) {
    if (!payload || typeof window.fetch !== "function") {
      return Promise.resolve({ ok: false, status: 0, reason: "unavailable" });
    }

    const baseUrl = (config && (config.endpoint || config.webhookUrl)) || "";
    if (!baseUrl) {
      return Promise.resolve({ ok: false, status: 0, reason: "unavailable" });
    }

    const destination = config.endpoint
      ? String(config.endpoint).replace(/\/$/, "") + "/lead"
      : String(baseUrl);

    const controller = new window.AbortController();
    const timer = window.setTimeout(function () {
      controller.abort();
    }, 7000);

    return window
      .fetch(destination, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      .then(function (response) {
        window.clearTimeout(timer);
        return {
          ok: !!(response && response.ok),
          status: response ? response.status : 0,
          reason: response && response.ok ? "ok" : "http",
        };
      })
      .catch(function () {
        window.clearTimeout(timer);
        return { ok: false, status: 0, reason: "network" };
      });
  };

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
      if (success) {
        success.textContent = "Sending your request...";
      }

      const templateContext = getTemplateContext();
      const assistantConfig = (window && window.HVAC_AI) || {};
      const leadPayload = buildLeadPayloadFromForm(form, templateContext, assistantConfig);

      submitLeadPayload(leadPayload, assistantConfig)
        .then(function (result) {
          if (result && result.ok) {
            dispatchDeliveryTelemetry("success_ai_lead_delivery_" + templateContext, templateContext, {
              destination: getLeadDestinationFromConfig(assistantConfig),
              status: result.status,
            });

            if (success) {
              success.textContent = "Request sent. Our team will contact you shortly.";
            }
            form.reset();
            delete form.dataset.aiSelectedPrompt;
            delete form.dataset.aiLeadPayload;
            return;
          }

          dispatchDeliveryTelemetry("fail_ai_lead_delivery_" + templateContext, templateContext, {
            destination: getLeadDestinationFromConfig(assistantConfig),
            status: result && result.status ? result.status : 0,
            reason: result && result.reason ? result.reason : "unknown",
          });

          if (success) {
            success.textContent =
              "We could not send your request online right now. Please call (315) 472-3557 for immediate help.";
          }
        })
        .finally(function () {
          form.removeAttribute("aria-busy");
          if (submit) {
            submit.disabled = false;
          }
        });
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

function initializeEmergencyBanner() {
  const banner = document.querySelector(".emergency-banner");
  if (!banner) return;

  const closeBtn = banner.querySelector(".emergency-banner-close");
  if (!closeBtn) return;

  closeBtn.addEventListener("click", function () {
    banner.style.display = "none";
    // Store in sessionStorage so banner stays closed during session
    sessionStorage.setItem("emergencyBannerClosed", "true");
  });

  // Check if banner was closed in this session
  if (sessionStorage.getItem("emergencyBannerClosed")) {
    banner.style.display = "none";
  }
}

function initialize() {
  initializeNavigation();
  initializeTracking();
  initializeAiAssistant();
  initializeEmergencyBanner();
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
    initializeAiAssistant: initializeAiAssistant,
    initializeStickyMobileCta: initializeStickyMobileCta,
    initializeUrgentCtaPrioritization: initializeUrgentCtaPrioritization,
    initializeFormValidation: initializeFormValidation,
    initializeAccordion: initializeAccordion,
  };
}
