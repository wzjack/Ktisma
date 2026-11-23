// Ktisma Capital Group: qualification quiz and lead form.
// Needs CONFIG and STEPS from config.js, and the elements #quiz-body, #bar and #year from index.html.

const answers = {};
let stepIndex = 0;
const body = document.getElementById("quiz-body");
const bar = document.getElementById("bar");

function el(tag, props, children) {
  const node = document.createElement(tag);
  Object.entries(props || {}).forEach(([k, v]) => {
    if (k === "class") node.className = v;
    else if (k === "text") node.textContent = v;
    else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v);
  });
  (children || []).forEach(c => node.appendChild(c));
  return node;
}

function setProgress(fraction) { bar.style.width = Math.round(fraction * 100) + "%"; }

function privacyLine() {
  return el("p", { class: "privacy", text: "Accredited investors only. Your info stays private." });
}

function backButton() {
  if (stepIndex === 0) return null;
  return el("button", { class: "back", type: "button", text: "Back", onclick: () => { stepIndex--; render(); } });
}

function renderQuestion() {
  const step = STEPS[stepIndex];
  setProgress(stepIndex / (STEPS.length + 1));
  const list = el("div", { class: "options", role: "group", "aria-label": step.question });
  step.options.forEach(label => {
    list.appendChild(el("button", {
      class: "opt",
      type: "button",
      "aria-pressed": answers[step.id] === label ? "true" : "false",
      text: label,
      onclick: () => choose(step, label)
    }));
  });
  body.replaceChildren(
    el("p", { class: "step-label", text: "Question " + (stepIndex + 1) + " of " + STEPS.length }),
    el("h2", { class: "q", text: step.question }),
    list,
    privacyLine(),
    ...[backButton()].filter(Boolean)
  );
}

function choose(step, label) {
  answers[step.id] = label;
  if (step.blockOn && label === step.blockOn) { renderBlocked(); return; }
  setTimeout(() => { stepIndex++; render(); }, 150);
}

function renderBlocked() {
  setProgress(0);
  body.replaceChildren(
    el("h2", { class: "q", text: "Thanks for your interest" }),
    el("div", { class: "notice", text: "This opportunity is open to accredited investors only, so we can’t take your details right now." }),
    el("button", { class: "back", type: "button", text: "Change my answer", onclick: () => { delete answers.investor_type; stepIndex = 0; render(); } })
  );
}

function renderForm() {
  setProgress(STEPS.length / (STEPS.length + 1));
  const fields = [
    ["first_name", "First name", "text", "given-name"],
    ["last_name", "Last name", "text", "family-name"],
    ["phone", "Phone", "tel", "tel"],
    ["email", "Email", "email", "email"]
  ];
  const make = ([name, label, type, auto]) => {
    const input = el("input", { type, name, id: name, required: "", autocomplete: auto });
    const err = el("span", { class: "field-error", id: name + "-err" });
    return el("label", { for: name }, [document.createTextNode(label + " *"), input, err]);
  };
  const consent = el("label", { class: "consent" }, [
    el("input", { type: "checkbox", name: "consent", required: "" }),
    el("span", { text: "I agree to receive texts and phone calls from Ktisma Capital about my inquiry. Consent is not a condition of any purchase. Msg & data rates may apply; message frequency varies. Reply STOP to opt out, HELP for help. See our Terms and Privacy Policy." })
  ]);
  const submit = el("button", { class: "btn", type: "submit", text: "Send me the details" });
  const status = el("p", { class: "field-error", id: "form-status", role: "alert" });

  const form = el("form", { novalidate: "" }, [
    el("div", { class: "row" }, [make(fields[0]), make(fields[1])]),
    make(fields[2]),
    make(fields[3]),
    consent,
    submit,
    status
  ]);
  form.addEventListener("submit", e => { e.preventDefault(); handleSubmit(form, submit, status); });

  body.replaceChildren(
    el("p", { class: "step-label", text: "Last step" }),
    el("h2", { class: "q", text: "Leave your details and we’ll send you material on this opportunity." }),
    form,
    privacyLine(),
    el("button", { class: "back", type: "button", text: "Back", onclick: () => { stepIndex--; render(); } })
  );
}

function validate(form) {
  let ok = true;
  const rules = {
    first_name: v => v.trim() ? "" : "Enter your first name.",
    last_name: v => v.trim() ? "" : "Enter your last name.",
    phone: v => v.replace(/\D/g, "").length >= 10 ? "" : "Enter a phone number with area code.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter a valid email address."
  };
  Object.entries(rules).forEach(([name, rule]) => {
    const input = form.elements[name];
    const msg = rule(input.value);
    document.getElementById(name + "-err").textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    if (msg) ok = false;
  });
  if (!form.elements.consent.checked) {
    document.getElementById("form-status").textContent = "Please tick the consent box to continue.";
    ok = false;
  }
  return ok;
}

async function handleSubmit(form, submit, status) {
  status.textContent = "";
  if (!validate(form)) return;
  const payload = Object.assign({}, answers, {
    first_name: form.elements.first_name.value.trim(),
    last_name: form.elements.last_name.value.trim(),
    phone: form.elements.phone.value.trim(),
    email: form.elements.email.value.trim(),
    submitted_at: new Date().toISOString(),
    page: location.href
  });
  submit.disabled = true;
  try {
    if (CONFIG.formEndpoint) {
      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("Request failed: " + res.status);
    } else {
      console.log("No formEndpoint set. Lead not sent:", payload);
    }
    stepIndex = STEPS.length + 1;
    render();
  } catch (err) {
    status.textContent = "We couldn’t send your details. Check your connection and try again.";
    submit.disabled = false;
  }
}

function renderThanks() {
  setProgress(1);
  body.replaceChildren(
    el("h2", { class: "q", text: "Thank you" }),
    el("p", { text: "We’ve received your details and will send the material on this opportunity shortly." })
  );
}

function render() {
  if (stepIndex < STEPS.length) renderQuestion();
  else if (stepIndex === STEPS.length) renderForm();
  else renderThanks();
}

document.getElementById("year").textContent = new Date().getFullYear();
render();
