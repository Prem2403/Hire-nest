// Candidate profile: view + edit, saved in localStorage.
const p = Object.assign({}, DEF_PROFILE, store.get("profile", {}));
const PF = [["name", "Full Name", "text"], ["email", "Email", "email"], ["phone", "Phone", "tel"], ["loc", "Location", "text"], ["edu", "Education", "text"], ["exp", "Experience", "text"], ["skills", "Skills (comma separated)", "text"], ["about", "About Me", "textarea"]];
function draw() {
    const bg = p.photo ? `background-image:url(${p.photo})` : "background:linear-gradient(135deg,var(--pri),var(--pri2))";
    $("#profile").innerHTML = `<div class="card row"><div class="av big" style="${bg}">${p.photo ? "" : esc(p.name[0])}</div><div class="grow"><h1>${esc(p.name)}</h1><p class="mut">✉ ${esc(p.email)}</p><p class="mut">☎ ${esc(p.phone)} · 📍 ${esc(p.loc)}</p></div><button class="btn" id="edit">Edit Profile</button></div>
 <div class="grid2"><div class="card"><h3>About Me</h3><p>${esc(p.about)}</p></div><div class="card"><h3>Skills</h3><div class="meta">${p.skills.split(",").filter(s => s.trim()).map(s => `<span class="chip">${esc(s.trim())}</span>`).join("")}</div></div>
 <div class="card"><h3>Education</h3><p>${esc(p.edu)}</p></div><div class="card"><h3>Experience</h3><p>${esc(p.exp)}</p></div>
 <div class="card"><h3>Resume</h3><p>${p.resume ? "📄 " + esc(p.resume) : '<span class="mut">No resume uploaded yet.</span>'}</p></div></div>`;
    $("#edit").onclick = () => {
        $("#pf").innerHTML = PF.map(([n, l, t]) => `<div class="f ${n == "about" || n == "skills" ? "full" : ""}"><label for="p-${n}">${l}</label>${t == "textarea" ? `<textarea id="p-${n}" rows="3">${esc(p[n])}</textarea>` : `<input id="p-${n}" type="${t}" value="${esc(p[n])}">`}</div>`).join("") +
            `<div class="f"><label for="p-photo">Profile photo</label><input type="file" id="p-photo" accept="image/*"></div><div class="f"><label for="p-resume">Resume</label><input type="file" id="p-resume" accept=".pdf,.doc,.docx"></div><div class="f full row"><button class="btn">Save Changes</button><button type="button" class="btn ghost" data-close>Cancel</button></div>`;
        openModal("pm");
    };
}
$("#pf").onsubmit = e => {
    e.preventDefault(); const v = n => $("#p-" + n).value.trim();
    if (v("name").length < 3) return toast("Enter a valid name.", "err");
    if (!/^\S+@\S+\.\S+$/.test(v("email"))) return toast("Enter a valid email address.", "err");
    const r = $("#p-resume").files[0], f = $("#p-photo").files[0];
    if (r && !/\.(pdf|docx?)$/i.test(r.name)) return toast("Resume must be PDF, DOC or DOCX.", "err");
    if (f && f.size > 1e6) return toast("Photo must be under 1 MB.", "err");
    PF.forEach(([n]) => p[n] = v(n)); if (r) p.resume = r.name;
    const done = () => { store.set("profile", p); $("#pm").classList.remove("open"); draw(); toast("Profile updated!") };
    if (f) { const fr = new FileReader(); fr.onload = () => { p.photo = fr.result; done() }; fr.readAsDataURL(f) } else done();
};
draw();
