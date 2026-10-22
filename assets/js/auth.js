// Account pages: log-in, 5-step sign-up, password reset and vendor application, backed by Firebase.
import { signUp, logIn, resetPassword, save, errorText } from "./backend.js";

const $ = (id) => document.getElementById(id);
const next = new URLSearchParams(location.search).get("next");
const goNext = () => { location.href = next && !next.includes("//") && !next.includes(":") ? next : "account.html"; };

document.querySelectorAll(".eye").forEach((b) =>
  b.addEventListener("click", () => {
    const i = b.previousElementSibling;
    i.type = i.type === "password" ? "text" : "password";
  })
);

// error line under a form (sign-up already has one)
const errBox = (form) => {
  let el = $("err");
  if (!el) { el = document.createElement("p"); el.className = "auth-error"; el.id = "err"; form.querySelector(".auth-btn").before(el); }
  return el;
};
const busy = (form, on) => { const b = form.querySelector(".auth-btn"); b.disabled = on; b.style.opacity = on ? 0.6 : ""; };
const fail = (form, e) => { const el = errBox(form); el.textContent = errorText(e); el.hidden = false; busy(form, false); };

// log in
if ($("loginForm")) {
  if (new URLSearchParams(location.search).has("created")) $("created").hidden = false;
  $("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const f = e.target;
    busy(f, true);
    try { await logIn(f.email.value.trim(), f.password.value); goNext(); } catch (err) { fail(f, err); }
  });
}

// password reset email
$("forgotForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  busy(f, true);
  try { await resetPassword(f.email.value.trim()); $("done").hidden = false; f.reset(); busy(f, false); } catch (err) { fail(f, err); }
});

// vendor application: creates a vendor account and saves the application for the admin to review
$("vendorForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const f = e.target;
  busy(f, true);
  try {
    const email = f.email.value.trim();
    await signUp(email, f.password.value, { first: f.business.value, role: "vendor", service: f.service.value });
    await save("vendorApplications", { business: f.business.value, service: f.service.value, email });
    $("done").hidden = false;
    f.reset();
    setTimeout(goNext, 1200);
  } catch (err) { fail(f, err); }
});

// 5-step sign-up
const form = $("signupForm");
if (form) {
  const steps = [...form.querySelectorAll("fieldset")];
  let n = 0;
  const show = () => {
    steps.forEach((s, i) => (s.hidden = i !== n));
    const stage = Number(steps[n].dataset.stage);
    [...$("stepper").children].forEach((li, i) => li.classList.toggle("on", i + 1 === stage));
    $("authPhoto").src = `assets/img/auth/${steps[n].dataset.photo}.jpg`;
    $("nextBtn").textContent = n === steps.length - 1 ? "Start planning" : n === 3 ? "Let's go" : "Next";
    $("err").hidden = true;
  };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const bad = [...steps[n].querySelectorAll("input[required], select[required]")].find((i) => !i.checkValidity());
    if (bad) { $("err").textContent = "Please fill in: " + bad.closest("label").childNodes[0].textContent.trim(); $("err").hidden = false; return; }
    if (n < steps.length - 1) { n += 1; show(); return; }
    const f = form.elements;
    const heard = [...steps[n].querySelectorAll(".check input:checked")].map((c) => c.parentElement.textContent.trim());
    busy(form, true);
    try {
      await signUp(f.email.value.trim(), f.password.value, {
        first: f.first.value, last: f.last.value, partner: `${f.pfirst.value} ${f.plast.value}`.trim(),
        date: f.dateUndecided.checked ? "" : f.date.value, city: f.cityUndecided.checked ? "" : f.city.value,
        guests: f.guestsUndecided.checked ? "" : f.guests.value, heard, role: "customer",
      });
      goNext();
    } catch (err) {
      // the email/password step is where most errors come from
      n = steps.findIndex((s) => s.contains(f.email)); show(); fail(form, err);
    }
  });
  show();
}
