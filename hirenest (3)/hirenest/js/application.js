// Job details page, application form + resume upload, and the Applications tracker.
const ST = ["Applied", "Under Review", "Shortlisted", "Interview", "Rejected"];
const R = { // one validator per field: returns an error message or false
  name: v => v.length < 3 && "Enter your full name (at least 3 characters).",
  email: v => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && "Enter a valid email address.",
  phone: v => !/^(\+91[\s-]?)?[6-9]\d{9}$/.test(v) && "Enter a valid 10-digit Indian mobile number.",
  loc: v => !v && "Current location is required.",
  edu: v => !v && "Select your highest education.",
  exp: v => !v && "Select your experience.",
  skills: v => !v && "Add at least one skill.",
  cover: v => v.length < 30 && "Cover letter must be at least 30 characters."
};
function setErr(n, m) { $("#e-" + n).textContent = m || ""; const el = $("#" + n); if (el) el.closest(".f").classList.toggle("bad", !!m) }

if ($("#detail")) {
  const j = JOBS.find(x => x.id == new URLSearchParams(location.search).get("id"));
  if (!j) $("#detail").innerHTML = empty("Job not found", '<a class="btn sm" href="jobs.html">Back to jobs</a>');
  else {
    const d = detailsOf(j), ul = a => "<ul>" + a.map(x => `<li>${x}</li>`).join("") + "</ul>";
    document.title = j.title + " - HireNest";
    $("#detail").innerHTML = `<div class="card"><div class="row">${av(j)}<div class="grow"><h1>${j.title}</h1><p class="mut">${j.company} · ${j.loc}</p></div></div>
  <div class="meta"><span class="tag">${sal(j)}</span><span class="tag">${j.type}</span><span class="tag">${j.mode}</span><span class="tag">${j.exp}</span><span class="tag">Posted ${ago(j.days)}</span></div>
  <div class="row"><button class="btn" id="openApply">Apply Now</button><button class="btn ghost ${saved().includes(j.id) ? "on" : ""}" data-save="${j.id}">Save Job</button></div></div>
  <div class="card det" style="margin-top:18px"><h3>Job Description</h3><p>${d.desc}</p><h3>Responsibilities</h3>${ul(d.resp)}<h3>Requirements</h3>${ul(d.req)}<h3>Required Skills</h3><div class="meta">${j.skills.map(s => `<span class="chip">${s}</span>`).join("")}</div><h3>Benefits</h3>${ul(d.ben)}<h3>About the Company</h3><p>${d.about}</p></div>`;

    // ---- Application form
    const p = Object.assign({}, DEF_PROFILE, store.get("profile", {}));
    const OPT = { edu: ["High School", "Diploma", "Bachelor's", "Master's", "PhD"], exp: ["Fresher", "0-1 years", "1-3 years", "3-5 years", "5+ years"] };
    const F = [["name", "Full Name", "text"], ["email", "Email", "email"], ["phone", "Phone Number", "tel"], ["loc", "Current Location", "text"], ["edu", "Highest Education", "select"], ["exp", "Experience", "select"], ["skills", "Skills (comma separated)", "text"], ["cover", "Cover Letter", "textarea"]];
    $("#af").innerHTML = F.map(([n, l, t]) => {
      const inp = t == "select" ? `<select id="${n}"><option value="">Select</option>${OPT[n].map(x => `<option>${x}</option>`).join("")}</select>` : t == "textarea" ? `<textarea id="${n}" rows="4" placeholder="Why are you a great fit?"></textarea>` : `<input id="${n}" type="${t}" value="${esc(n == "loc" ? p.loc.split(",")[0] : p[n] || "")}">`;
      return `<div class="f ${n == "skills" || n == "cover" ? "full" : ""}"><label for="${n}">${l}</label>${inp}<div class="err" id="e-${n}"></div></div>`
    }).join("") +
      `<div class="f full"><label>Resume</label><div class="drop" id="drop"><p><b>Drag and drop</b> your resume here</p><p class="mut sm">PDF, DOC or DOCX, up to 5 MB</p><button type="button" class="btn ghost sm" id="browse" style="margin-top:8px">Browse files</button><input type="file" id="file" accept=".pdf,.doc,.docx" hidden></div><div id="fileInfo"></div><div class="err" id="e-resume"></div></div>
  <div class="f full row"><button class="btn" id="sub">Submit Application</button><button type="button" class="btn ghost" data-close>Cancel</button></div>`;

    let resume = null;
    function setFile(f) {
      if (!/\.(pdf|docx?)$/i.test(f.name)) return setErr("resume", "Only PDF, DOC or DOCX files are allowed.");
      if (f.size > 5 * 1024 * 1024) return setErr("resume", "File is too large. Maximum size is 5 MB.");
      setErr("resume", ""); resume = { name: f.name, size: f.size };
      $("#fileInfo").innerHTML = `<div class="fileitem"><div class="grow"><b>${esc(f.name)}</b> <span class="mut sm">${(f.size / 1024).toFixed(1)} KB</span><div class="bar"><b id="pb"></b></div></div><button type="button" class="icon-btn" id="rm" aria-label="Remove file">✕</button></div>`;
      let pct = 0; const iv = setInterval(() => { pct = Math.min(100, pct + 10 + Math.random() * 15); $("#pb").style.width = pct + "%"; if (pct >= 100) clearInterval(iv) }, 150);
      $("#rm").onclick = () => { clearInterval(iv); resume = null; $("#fileInfo").innerHTML = ""; $("#file").value = "" };
    }
    $("#browse").onclick = () => $("#file").click();
    $("#file").onchange = e => e.target.files[0] && setFile(e.target.files[0]);
    const dz = $("#drop");
    ["dragenter", "dragover"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add("over") }));
    ["dragleave", "drop"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove("over") }));
    dz.addEventListener("drop", e => e.dataTransfer.files[0] && setFile(e.dataTransfer.files[0]));
    $("#af").addEventListener("input", e => { if (R[e.target.id]) setErr(e.target.id, R[e.target.id](e.target.value.trim())) });

    const applied = () => store.get("apps", []).some(a => a.jobId == j.id);
    const start = () => applied() ? toast("You have already applied to this job.", "err") : openModal("am");
    $("#openApply").onclick = start;
    if (new URLSearchParams(location.search).get("apply")) start();

    $("#af").onsubmit = e => {
      e.preventDefault(); let ok = true;
      for (const n in R) { const m = R[n]($("#" + n).value.trim()); setErr(n, m); if (m) ok = false }
      if (!resume) { setErr("resume", "Please upload your resume."); ok = false }
      if (!ok) return toast("Please fix the highlighted fields.", "err");
      $("#sub").disabled = true; $("#sub").textContent = "Submitting...";
      setTimeout(() => {
        const a = store.get("apps", []);
        a.unshift({ jobId: j.id, title: j.title, company: j.company, loc: j.loc, date: new Date().toISOString(), status: "Applied" });
        store.set("apps", a);
        $("#abody").innerHTML = `<div class="okp"><div class="check">✓</div><h2>Application submitted successfully!</h2><p class="mut">${j.company} has received your application for ${j.title}.</p><p style="margin-top:16px"><a class="btn" href="applications.html">Track application</a></p></div>`;
        toast("Application submitted successfully!");
      }, 1000);
    };
  }
}

if ($("#appList")) {
  const draw = () => {
    const a = store.get("apps", []);
    $("#appList").innerHTML = a.length ? a.map((x, i) => {
      const k = ST.indexOf(x.status), bad = k == 4;
      return `<article class="card"><div class="row"><div class="grow"><h3>${x.title}</h3><p class="mut">${x.company} · ${x.loc}</p><p class="mut sm">Applied on ${new Date(x.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p></div><span class="badge s-${x.status.replace(" ", "")}">${x.status}</span></div>
   <div class="tl">${ST.slice(0, 4).map((s, n) => `<div class="${bad ? (n < 2 ? "bad" : "") : n <= k ? "done" : ""}">${s}</div>`).join("")}</div>
   <div class="row"><label class="sm mut" for="st${i}">Update status (demo)</label><select id="st${i}" data-i="${i}" style="width:auto">${ST.map(s => `<option ${s == x.status ? "selected" : ""}>${s}</option>`).join("")}</select><button class="btn ghost sm" data-del="${i}">Withdraw</button></div></article>`
    }).join("") : empty("No applications yet", 'Apply to a job and track it here. <a class="btn sm" href="jobs.html">Find jobs</a>');
  };
  $("#appList").addEventListener("change", e => { const a = store.get("apps", []); a[e.target.dataset.i].status = e.target.value; store.set("apps", a); draw(); toast("Status updated") });
  $("#appList").addEventListener("click", e => { const b = e.target.closest("[data-del]"); if (!b) return; const a = store.get("apps", []); a.splice(+b.dataset.del, 1); store.set("apps", a); draw(); toast("Application withdrawn") });
  draw();
}
