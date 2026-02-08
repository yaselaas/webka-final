requireAuth();

function setActiveNav(id) {
  document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

async function searchAnime(e) {
  e.preventDefault();
  const q = document.getElementById("q").value.trim();
  const msg = document.getElementById("msg");
  const grid = document.getElementById("grid");

  msg.innerHTML = "";
  grid.innerHTML = "";

  if (q.length < 2) {
    msg.innerHTML = `<div class="error">Type at least 2 characters.</div>`;
    return;
  }

  try {
    const data = await API.request("/api/anime/search?q=" + encodeURIComponent(q), {
      method: "GET",
      headers: API.headers(false)
    });

    if (!data.items.length) {
      grid.innerHTML = `<div class="note">No results.</div>`;
      return;
    }

    grid.innerHTML = data.items.map(a => `
      <div class="animeCard">
        <img src="${a.image || '/assets/images/placeholder.jpg'}" alt="cover">
        <div class="p">
          <div><b>${escapeHtml(a.title)}</b></div>
          <div class="small">
            ${a.year ? `Year: ${a.year}` : ""}
            ${a.score ? ` · Score: ${a.score}` : ""}
          </div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    msg.innerHTML = `<div class="error">${err.message}</div>`;
  }
}

function escapeHtml(s) {
  return (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function initAnimePage() {
  setActiveNav("navAnime");
  document.getElementById("form").addEventListener("submit", searchAnime);
  document.getElementById("logoutBtn").addEventListener("click", logout);
}
document.addEventListener("DOMContentLoaded", initAnimePage);
