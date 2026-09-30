// Home page, job listing (filters + sort) and saved jobs page.
if ($("#featured")) { // ---- Home
    $("#featured").innerHTML = JOBS.slice(0, 6).map(jobCard).join("");
    $("#cats").innerHTML = CATS.map(c => `<a class="cat" href="jobs.html?cat=${c}">${c}</a>`).join("");
    $("#companies").innerHTML = COMPANIES.map(c => {
        const list = JOBS.filter(x => x.company == c.name);
        const roles = list.slice(0, 3).map(x => `<span class="chip">${x.title}</span>`).join("");
        return `<article class="card co"><div class="co-img"><img src="${c.img}" alt="${c.full} office" loading="lazy" referrerpolicy="no-referrer" onerror="this.onerror=null;this.src='assets/images/buildings.svg'"><span class="av">${c.name[0]}</span></div>
<div class="co-body"><h3>${c.name}</h3><p class="mut sm">${c.full} &middot; ${c.industry}</p><p class="sm">${c.about}</p>
<div class="meta"><span class="tag">📍 ${c.hq}</span><span class="tag">👥 ${c.size}</span><span class="tag">Since ${c.founded}</span></div>
<p class="sm"><b>${list.length} open job${list.length == 1 ? "" : "s"}</b></p><div class="meta">${roles}</div>
<a class="btn sm" href="jobs.html?q=${encodeURIComponent(c.name)}">View jobs</a></div></article>`;
    }).join("");
    $("#heroForm").onsubmit = e => { e.preventDefault(); location.href = `jobs.html?q=${encodeURIComponent($("#hq").value)}&loc=${encodeURIComponent($("#hl").value)}` };
}

if ($("#jobList")) { // ---- Listing
    const grp = (n, a) => a.map(x => `<label class="ck"><input type="checkbox" name="${n}" value="${x}"> ${x}</label>`).join("");
    $("#types").innerHTML = grp("type", ["Full Time", "Part Time", "Internship", "Contract"]);
    $("#modes").innerHTML = grp("mode", ["Remote", "Hybrid", "On-site"]);
    $("#fexp").innerHTML = '<option value="">Any level</option>' + LEVELS.map(x => `<option>${x}</option>`).join("");
    $("#fcat").innerHTML = '<option value="">All categories</option>' + CATS.map(x => `<option>${x}</option>`).join("");
    const q = new URLSearchParams(location.search);
    $("#fq").value = q.get("q") || ""; $("#fl").value = q.get("loc") || ""; $("#fcat").value = q.get("cat") || "";
    let timer;
    function run() {
        const v = id => $(id).value.trim().toLowerCase(), chk = n => $$(`[name=${n}]:checked`).map(c => c.value);
        const types = chk("type"), modes = chk("mode"), s = $("#sort").value;
        const r = JOBS.filter(j => (!v("#fq") || (j.title + j.company + j.skills.join()).toLowerCase().includes(v("#fq")))
            && (!v("#fl") || j.loc.toLowerCase().includes(v("#fl"))) && (!types.length || types.includes(j.type))
            && (!modes.length || modes.includes(j.mode)) && (!$("#fexp").value || j.exp == $("#fexp").value)
            && (!$("#fcat").value || j.cat == $("#fcat").value) && annual(j) >= +$("#fsal").value);
        r.sort(s == "hi" ? (a, b) => annual(b) - annual(a) : s == "lo" ? (a, b) => annual(a) - annual(b) : (a, b) => a.days - b.days);
        $("#count").textContent = r.length + " jobs found";
        $("#jobList").innerHTML = '<div class="loader"></div>';
        clearTimeout(timer);
        timer = setTimeout(() => $("#jobList").innerHTML = r.length ? r.map(jobCard).join("") : empty("No jobs match your filters", "Try removing a filter or searching a different keyword."), 350);
    }
    $$("#ff input,#ff select,#sort").forEach(e => e.oninput = run);
    $("#ff").onsubmit = e => e.preventDefault();
    $("#clear").onclick = () => { $("#ff").reset(); $("#sort").value = "new"; run() };
    run();
}

if ($("#savedList")) { // ---- Saved jobs
    const draw = window.onSaveChange = () => {
        const l = JOBS.filter(j => saved().includes(j.id));
        $("#savedList").innerHTML = l.length ? l.map(jobCard).join("") : empty("No saved jobs yet", 'Tap the bookmark on any job to keep it here. <a class="btn sm" href="jobs.html">Browse jobs</a>');
    };
    draw();
}
