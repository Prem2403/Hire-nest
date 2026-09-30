// Shared helpers: DOM shortcuts, localStorage, navbar, theme, toasts, modals, job cards.
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d } catch (e) { return d } }, set(k, v) { localStorage.setItem(k, JSON.stringify(v)) } };
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const empty = (t, p) => `<div class="empty"><h3>${t}</h3><p>${p}</p></div>`;
document.documentElement.dataset.theme = store.get("theme", "light");

const PAGES = [["index", "Home"], ["jobs", "Find Jobs"], ["saved-jobs", "Saved Jobs"], ["applications", "Applications"], ["profile", "Profile"]];
// Login state: the logged-in user is kept in localStorage under "user"
const currentUser = () => store.get("user", null);
function authLinks() {
    const u = currentUser();
    if (u) return `<span class="hi">Hi, ${esc(u.name.split(" ")[0])}</span><a href="#" id="logout">Logout</a>`;
    return `<a href="login.html">Login</a><a href="signup.html" class="signup">Sign Up</a>`;
}
document.addEventListener("click", e => {
    if (e.target.id == "logout") { e.preventDefault(); localStorage.removeItem("user"); location.href = "index.html" }
});

// Moving "Now Hiring" bar: newest jobs, text is repeated twice so the scroll never has a gap
function ticker() {
    const items = JOBS.slice().sort((a, b) => a.days - b.days).slice(0, 14)
        .map(j => `<span><b>${j.company}</b> is hiring ${j.title} &middot; ${j.loc}</span>`).join("");
    return `<div class="ticker"><b class="live">&#9679; NOW HIRING</b><div class="track"><div class="slide">${items}${items}</div></div></div>`;
}

function initNav() {
    const cur = location.pathname.split("/").pop().replace(".html", "") || "index";
    $("#nav").innerHTML = `<header><div class="nav"><a class="logo" href="index.html"><i>H</i>HireNest</a><nav class="links" id="links">${PAGES.map(p => `<a href="${p[0]}.html" class="${p[0] == cur ? "on" : ""}">${p[1]}</a>`).join("")}${authLinks()}</nav><button class="icon-btn" id="theme" aria-label="Toggle dark mode"></button><button class="icon-btn" id="burger" aria-label="Open menu">☰</button></div></header>${ticker()}`;
    const t = $("#theme"), paint = () => t.textContent = document.documentElement.dataset.theme == "dark" ? "☀" : "☾"; paint();
    t.onclick = () => { const d = document.documentElement.dataset.theme == "dark" ? "light" : "dark"; document.documentElement.dataset.theme = d; store.set("theme", d); paint() };
    $("#burger").onclick = () => $("#links").classList.toggle("open");
}
function toast(m, type) { const e = document.createElement("div"); e.className = "toast " + (type || ""); e.textContent = m; $("#toasts").append(e); setTimeout(() => e.remove(), 3200) }
const openModal = id => $("#" + id).classList.add("open");
document.addEventListener("click", e => { if (e.target.matches(".modal,[data-close]")) e.target.closest(".modal").classList.remove("open") });
document.addEventListener("keydown", e => e.key == "Escape" && $$(".modal.open").forEach(m => m.classList.remove("open")));

// Saved jobs
const saved = () => store.get("saved", []);
function toggleSave(id) {
    let s = saved(); const was = s.includes(id);
    s = was ? s.filter(x => x != id) : [...s, id]; store.set("saved", s);
    toast(was ? "Removed from saved jobs" : "Job saved!");
    $$(`[data-save="${id}"]`).forEach(b => b.classList.toggle("on", !was));
    window.onSaveChange && onSaveChange();
}
document.addEventListener("click", e => { const b = e.target.closest("[data-save]"); if (b) toggleSave(+b.dataset.save) });

// Job card (used on home, listing and saved pages)
const av = j => `<div class="av" style="background:hsl(${j.id * 47 % 360} 60% 45%)">${j.company[0]}</div>`;
function jobCard(j, i) {
    const on = saved().includes(j.id);
    return `<article class="card" style="animation-delay:${(i || 0) * 40}ms"><div class="row">${av(j)}<div class="grow"><h3>${j.title}</h3><p class="mut sm">${j.company}</p></div><button class="icon-btn bm ${on ? "on" : ""}" data-save="${j.id}" aria-label="Save or unsave job"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12v18l-6-4-6 4z"/></svg></button></div>
 <div class="meta"><span class="tag">📍 ${j.loc}</span><span class="tag">${sal(j)}</span><span class="tag">${j.type}</span><span class="tag">${j.exp}</span><span class="tag">${j.mode}</span></div>
 <div class="meta">${j.skills.map(s => `<span class="chip">${s}</span>`).join("")}</div>
 <p class="mut sm">Posted ${ago(j.days)}</p>
 <div class="row"><a class="btn ghost sm" href="job-details.html?id=${j.id}">View Details</a><a class="btn sm" href="job-details.html?id=${j.id}&apply=1">Apply Now</a></div></article>`;
}
initNav();
