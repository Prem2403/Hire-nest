// Login and Sign up (college project version).
// Accounts are saved in the browser's localStorage. A real website would
// use a server and a database, and would never store plain passwords.

// Show or clear an error message under a field
function showErr(id, msg) {
    $("#e-" + id).textContent = msg || "";
    $("#" + id).closest(".f").classList.toggle("bad", !!msg);
}

// ---------- Sign up ----------
if ($("#signupForm")) {
    $("#signupForm").onsubmit = function (e) {
        e.preventDefault();
        const name = $("#name").value.trim();
        const email = $("#email").value.trim().toLowerCase();
        const password = $("#password").value;
        const confirm = $("#confirm").value;
        let ok = true;

        if (name.length < 3) { showErr("name", "Enter your full name (at least 3 characters)."); ok = false; } else showErr("name", "");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showErr("email", "Enter a valid email address."); ok = false; } else showErr("email", "");
        if (password.length < 6) { showErr("password", "Password must be at least 6 characters."); ok = false; } else showErr("password", "");
        if (confirm !== password) { showErr("confirm", "Passwords do not match."); ok = false; } else showErr("confirm", "");
        if (!ok) return;

        const users = store.get("users", []);
        if (users.some(u => u.email === email)) {
            showErr("email", "An account with this email already exists.");
            return;
        }

        users.push({ name: name, email: email, password: password });
        store.set("users", users);
        store.set("user", { name: name, email: email }); // log the new user in
        toast("Account created! Welcome to HireNest.");
        setTimeout(function () { location.href = "index.html"; }, 1000);
    };
}

// ---------- Login ----------
if ($("#loginForm")) {
    $("#loginForm").onsubmit = function (e) {
        e.preventDefault();
        const email = $("#email").value.trim().toLowerCase();
        const password = $("#password").value;
        let ok = true;

        if (!email) { showErr("email", "Enter your email address."); ok = false; } else showErr("email", "");
        if (!password) { showErr("password", "Enter your password."); ok = false; } else showErr("password", "");
        if (!ok) return;

        const users = store.get("users", []);
        const found = users.find(u => u.email === email && u.password === password);
        if (!found) {
            showErr("password", "Wrong email or password. Please try again.");
            return;
        }

        store.set("user", { name: found.name, email: found.email });
        toast("Login successful!");
        setTimeout(function () { location.href = "index.html"; }, 800);
    };

    // Show / hide password checkbox
    $("#showPw").onchange = function () {
        $("#password").type = this.checked ? "text" : "password";
    };
}
