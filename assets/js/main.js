// AYOJOK front-end demo: shared header/footer, demo login, vendors, budget calculator and forms.
const page = document.body.dataset.page;
const user = JSON.parse(localStorage.getItem("ayojok-user") || "null");

const header = `
  <div class="demo-note">Front-end demo of the AYOJOK design · 3rd Runner-Up, UIU CSE Project Show, Summer 2025 · nothing is saved</div>
  <header class="site-header">
    <nav class="container nav">
      <a class="nav-logo" href="index.html"><img src="assets/img/logo.png" alt="Ayojok"></a>
      <ul class="nav-links" id="navLinks">
        <li><a href="vendors.html" data-nav="vendors">Services</a></li>
        <li><a href="budget.html" data-nav="budget">Budget</a></li>
        <li><a href="design.html" data-nav="design">Full design</a></li>
        <li><a href="about.html" data-nav="about">About</a></li>
        <li><a href="contact.html" data-nav="contact">Contact</a></li>
      </ul>
      <div class="nav-actions">
        ${user
          ? `<button class="btn" id="logout">Log out</button><span class="avatar" title="${user.name}">${user.name[0].toUpperCase()}</span>`
          : `<a class="btn" href="login.html">Log in</a>`}
        <button class="menu-toggle" id="menuToggle" aria-label="Menu">&#9776;</button>
      </div>
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
        <div class="socials" aria-label="Social links" style="font-size:14px">Facebook · Twitter · Pinterest · Instagram</div>
      </div>
    </div>
    <p class="copyright">© 2025 Ayojok · Designed in Figma for the System Analysis and Design course, United International University</p>
  </footer>`;

document.body.insertAdjacentHTML("afterbegin", header);
document.body.insertAdjacentHTML("beforeend", footer);
document.querySelector(`[data-nav="${page}"]`)?.classList.add("active");
document.getElementById("menuToggle").onclick = () => document.getElementById("navLinks").classList.toggle("open");
document.getElementById("logout")?.addEventListener("click", () => { localStorage.removeItem("ayojok-user"); location.href = "index.html"; });

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

// ---------------------------------------------------------------- login (demo)
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = e.target.name.value.trim() || "Guest";
  localStorage.setItem("ayojok-user", JSON.stringify({ name }));
  location.href = "index.html";
});

// ---------------------------------------------------------------- vendors
const VENDORS = [
  { type: "photographers", name: "Golden Hour Studio", city: "Dhaka", price: 35000, img: "card-photographers.jpg", rating: 4.9 },
  { type: "photographers", name: "Frame & Vows", city: "Chittagong", price: 28000, img: "idea-4.jpg", rating: 4.7 },
  { type: "venues", name: "Lakeview Garden Hall", city: "Dhaka", price: 150000, img: "card-venues.jpg", rating: 4.8 },
  { type: "venues", name: "Seaside Pavilion", city: "Cox's Bazar", price: 120000, img: "hero.jpg", rating: 4.6 },
  { type: "cakes", name: "Sugar Bloom Bakery", city: "Dhaka", price: 12000, img: "card-cakes.jpg", rating: 4.9 },
  { type: "djs", name: "DJ Rhythm Nights", city: "Sylhet", price: 25000, img: "card-djs.jpg", rating: 4.5 },
  { type: "makeup", name: "Bridal Glow by Nusrat", city: "Dhaka", price: 22000, img: "card-makeup.jpg", rating: 4.8 },
  { type: "attire", name: "Ivory Lace Couture", city: "Dhaka", price: 60000, img: "card-attire.jpg", rating: 4.7 },
  { type: "attire", name: "The Bridal Edit", city: "Chittagong", price: 45000, img: "idea-2.jpg", rating: 4.6 },
  { type: "catering", name: "Royal Feast Catering", city: "Dhaka", price: 90000, img: "card-catering.jpg", rating: 4.8 },
  { type: "decoration", name: "Petal & Pillar Decor", city: "Sylhet", price: 70000, img: "intro.jpg", rating: 4.7 },
];
const LABELS = { all: "All", photographers: "Photographers", venues: "Venues", cakes: "Cakes", djs: "DJs", makeup: "Makeup", attire: "Wedding Attire", catering: "Catering", decoration: "Decoration" };
const taka = (n) => "৳ " + n.toLocaleString("en-US");

const list = document.getElementById("vendorList");
if (list) {
  const filters = document.getElementById("filters");
  let current = new URLSearchParams(location.search).get("type") || "all";
  filters.innerHTML = Object.entries(LABELS).map(([k, v]) => `<button class="chip" data-type="${k}">${v}</button>`).join("");
  const render = () => {
    filters.querySelectorAll(".chip").forEach((c) => c.classList.toggle("active", c.dataset.type === current));
    const items = VENDORS.filter((v) => current === "all" || v.type === current);
    list.innerHTML = items.map((v) => `
      <article class="vendor">
        <img src="assets/img/${v.img}" alt="${v.name}" loading="lazy">
        <div class="body">
          <small class="meta">${LABELS[v.type]} · ${v.city} · ★ ${v.rating}</small>
          <h4>${v.name}</h4>
          <span class="price">from ${taka(v.price)}</span>
          <button class="btn" data-book="${v.name}">Book now</button>
        </div>
      </article>`).join("") || `<p class="muted">No vendors found in this category yet.</p>`;
  };
  filters.addEventListener("click", (e) => { if (e.target.dataset.type) { current = e.target.dataset.type; render(); } });
  list.addEventListener("click", (e) => {
    if (!e.target.dataset.book) return;
    document.getElementById("bookVendor").textContent = e.target.dataset.book;
    document.getElementById("bookModal").classList.add("open");
  });
  document.getElementById("closeModal").onclick = () => document.getElementById("bookModal").classList.remove("open");
  render();
}

// ---------------------------------------------------------------- budget calculator
const budgetForm = document.getElementById("budgetForm");
if (budgetForm) {
  const SPLIT = [["Venue", 30], ["Catering", 25], ["Decoration", 12], ["Photography", 10], ["Attire", 9], ["Makeup", 5], ["Music / DJ", 4], ["Cake", 2], ["Other", 3]];
  const rows = document.getElementById("budgetRows");
  const update = () => {
    const total = Number(budgetForm.total.value) || 0;
    const guests = Number(budgetForm.guests.value) || 0;
    rows.innerHTML = SPLIT.map(([name, pct]) => `
      <div class="row"><span>${name}</span><div class="bar"><i style="width:${pct * 3}%"></i></div><b>${taka(Math.round(total * pct / 100))}</b></div>`).join("");
    document.getElementById("perGuest").textContent = guests ? taka(Math.round(total / guests)) : "-";
    document.getElementById("budgetTotal").textContent = taka(total);
  };
  budgetForm.addEventListener("input", update);
  update();
}
