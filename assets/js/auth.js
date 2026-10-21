// Account pages: demo log-in, 5-step sign-up, password reset and vendor application (stored in this browser only).
const $ = (id) => document.getElementById(id);
const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

document.querySelectorAll(".eye").forEach((b) =>
  b.addEventListener("click", () => {
    const i = b.previousElementSibling;
    i.type = i.type === "password" ? "text" : "password";
  })
);

// log in
if ($("loginForm")) {
  if (new URLSearchParams(location.search).has("created")) $("created").hidden = false;
  $("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const profile = JSON.parse(localStorage.getItem("ayojok-profile") || "null");
    const name = profile && profile.email === email ? profile.first : email.split("@")[0];
    save("ayojok-user", { name, email });
    location.href = "dashboard.html";
  });
}

// forgot password / vendor application
for (const id of ["forgotForm", "vendorForm"]) {
  $(id)?.addEventListener("submit", (e) => { e.preventDefault(); $("done").hidden = false; e.target.reset(); });
}

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
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = [...steps[n].querySelectorAll("input[required], select[required]")].find((i) => !i.checkValidity());
    if (bad) { $("err").textContent = "Please fill in: " + bad.closest("label").childNodes[0].textContent.trim(); $("err").hidden = false; return; }
    if (n < steps.length - 1) { n += 1; show(); return; }
    const f = form.elements;
    save("ayojok-profile", { first: f.first.value, last: f.last.value, partner: f.pfirst.value, date: f.date.value,
      city: f.city.value, guests: f.guests.value, email: f.email.value });
    location.href = "login.html?created=1";
  });
  show();
}
