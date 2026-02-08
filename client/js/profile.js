requireAuth();

function setActiveNav(id) {
  document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

async function loadProfile() {
  const box = document.getElementById("profileBox");
  box.innerHTML = "<div class='note'>Loading...</div>";

  try {
    const p = await API.request("/api/users/profile", {
      method: "GET",
      headers: API.headers(false)
    });

    document.getElementById("username").value = p.username || "";
    document.getElementById("bio").value = p.bio || "";
    document.getElementById("emailText").textContent = p.email || "";
    document.getElementById("createdText").textContent = p.createdAt ? new Date(p.createdAt).toLocaleString() : "";

    box.innerHTML = "";
  } catch (err) {
    box.innerHTML = `<div class="error">${err.message}</div>`;
  }
}

async function saveProfile(e) {
  e.preventDefault();
  const msg = document.getElementById("msg");
  msg.innerHTML = "";

  const username = document.getElementById("username").value.trim();
  const bio = document.getElementById("bio").value.trim();

  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    msg.innerHTML = `<div class="error">Username must be 3-20 chars (letters, numbers, underscore).</div>`;
    return;
  }
  if (bio.length > 200) {
    msg.innerHTML = `<div class="error">Bio is too long (max 200).</div>`;
    return;
  }

  try {
    const updated = await API.request("/api/users/profile", {
      method: "PUT",
      headers: API.headers(true),
      body: JSON.stringify({ username, bio })
    });
    msg.innerHTML = `<div class="success">Saved.</div>`;
    localStorage.setItem("user", JSON.stringify(updated));
  } catch (err) {
    msg.innerHTML = `<div class="error">${err.message}</div>`;
  }
}

function initProfilePage() {
  setActiveNav("navProfile");
  loadProfile();
  document.getElementById("form").addEventListener("submit", saveProfile);
  document.getElementById("logoutBtn").addEventListener("click", logout);
}

document.addEventListener("DOMContentLoaded", initProfilePage);
