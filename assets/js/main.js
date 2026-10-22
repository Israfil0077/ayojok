// AYOJOK shared header/footer, tips tabs and small demo forms. Sign-in state comes from backend.js.
const page = document.body.dataset.page;
let user = null;
try { user = JSON.parse(localStorage.getItem("ayojok-user") || "null"); } catch (e) {}

const header = `
  <header class="site-header">
    <nav class="container nav">
      <a class="nav-logo" href="index.html"><img src="assets/img/logo.png" alt="Ayojok"></a>
      <ul class="nav-links" id="navLinks">
        <li><a href="services.html" data-nav="services">Services</a></li>
        <li><a href="about.html" data-nav="about">About</a></li>
        <li><a href="contact.html" data-nav="contact">Contact</a></li>
      </ul>
      <div class="nav-actions"><span id="navActions" class="nav-user"></span>
        <button class="menu-toggle" id="menuToggle" aria-label="Menu">&#9776;</button></div>
    </nav>
  </header>`;

const footer = `
  <footer class="site-footer">
    <div class="container footer-grid">
      <div><h5>Venues</h5><ul><li>Dhaka</li><li>Chittagong</li><li>Sylhet</li><li>Cox's Bazar</li></ul></div>
      <div><h5>Services</h5><ul>
        <li><a href="vendors.html?type=photographers">Photographers</a></li><li><a href="vendors.html?type=decoration">Decorations</a></li>
        <li><a href="vendors.html?type=attire">Designers</a></li><li><a href="vendors.html?type=makeup">Makeup Artists</a></li></ul></div>
      <div><h5>Support</h5><ul><li><a href="about.html">About Us</a></li><li><a href="contact.html">Careers</a></li>
        <li><a href="contact.html">Contact Us</a></li><li><a href="about.html#terms">Terms &amp; Conditions</a></li></ul></div>
      <div>
        <h5>Get the Ayojok app</h5>
        <img src="assets/img/app-badges.png" alt="Google Play and App Store" style="height:42px;width:auto">
        <form class="subscribe" data-demo-form="Thanks for subscribing! (demo)">
          <input type="email" placeholder="Subscribe with your email" required><button class="btn btn-outline">Submit</button>
        </form>
        <img class="socials" src="assets/img/socials.png" alt="Facebook, Twitter, Pinterest, Instagram" width="95" height="24">
      </div>
    </div>
    <p class="copyright">© 2025 Ayojok · Based on the AYOJOK 2.0 Figma design, 3rd Runner-Up at the UIU CSE Project Show, Summer 2025 ·
      <a href="design.html">See all 42 design screens</a></p>
  </footer>`;

document.body.insertAdjacentHTML("afterbegin", header);
document.body.insertAdjacentHTML("beforeend", footer);
document.querySelector(`[data-nav="${page}"]`)?.classList.add("active");
document.getElementById("menuToggle").onclick = () => document.getElementById("navLinks").classList.toggle("open");

// login / sign-up buttons, or the signed-in user's links; backend.js calls this when the sign-in state changes
window.setHeaderUser = (u) => {
  document.getElementById("navActions").innerHTML = u
    ? `${u.admin ? `<a class="btn btn-sm btn-outline" href="admin.html">Admin</a>` : ""}
       <a class="btn btn-sm btn-outline" href="account.html">My bookings</a>
       <button class="btn btn-sm" id="logout">Log out</button>
       <a class="avatar" href="account.html" title="${u.name.replace(/"/g, "")}">${u.name[0].toUpperCase()}</a>`
    : `<a class="btn btn-sm" href="login.html">Login</a><a class="btn btn-sm" href="signup.html">Sign up</a>`;
  document.getElementById("logout")?.addEventListener("click", async () => {
    try { localStorage.removeItem("ayojok-user"); } catch (e) {}
    await window.ayojokSignOut?.();
    location.href = "index.html";
  });
};
setHeaderUser(user);

// any form marked data-demo-form shows a friendly message instead of sending data
document.querySelectorAll("form[data-demo-form]").forEach((form) => {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let note = form.querySelector(".notice");
    if (!note) { note = document.createElement("div"); note.className = "notice"; form.appendChild(note); }
    note.textContent = form.dataset.demoForm;
    note.classList.add("show");
    form.reset();
  });
});

// ---------------------------------------------------------------- tips (home page)
document.querySelectorAll(".tabs button").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll(".tabs button").forEach((x) => x.classList.remove("active"));
    b.classList.add("active");
    const order = { fashion: [1, 2, 3, 4, 5, 6], hair: [6, 5, 1, 2, 4, 3], planning: [4, 3, 2, 6, 1, 5], decorations: [3, 4, 6, 5, 2, 1] }[b.dataset.tab];
    document.querySelectorAll(".ideas img").forEach((img, i) => (img.src = `assets/img/idea-${order[i]}.jpg`));
  })
);

const taka = (n) => "৳ " + Number(n).toLocaleString("en-US");
