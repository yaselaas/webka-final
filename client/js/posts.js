requireAuth();

function setActiveNav(id) {
  document.querySelectorAll(".nav a").forEach(a => a.classList.remove("active"));
  const el = document.getElementById(id);
  if (el) el.classList.add("active");
}

function fmtDate(iso) {
  const d = new Date(iso);
  return d.toLocaleString();
}

async function loadPosts() {
  const list = document.getElementById("postsList");
  list.innerHTML = "<div class='note'>Loading...</div>";

  try {
    const posts = await API.request("/api/posts", {
      method: "GET",
      headers: API.headers(false)
    });

    if (!posts.length) {
      list.innerHTML = "<div class='note'>No posts yet.</div>";
      return;
    }

    list.innerHTML = posts.map(p => `
      <div class="item">
        <div><b>${escapeHtml(p.title)}</b></div>
        <div class="meta">${fmtDate(p.createdAt)}</div>
        <div style="margin-top:8px; white-space:pre-wrap">${escapeHtml(p.content)}</div>
        <div class="actions">
          <button class="btn secondary" onclick="editPost('${p._id}', '${encodeURIComponent(p.title)}', '${encodeURIComponent(p.content)}')">Edit</button>
          <button class="btn secondary" onclick="deletePost('${p._id}')">Delete</button>
        </div>
      </div>
    `).join("");
  } catch (err) {
    list.innerHTML = `<div class="error">${err.message}</div>`;
  }
}

function escapeHtml(s) {
  return (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function createPost(e) {
  e.preventDefault();
  const msg = document.getElementById("msg");

  const title = document.getElementById("title").value.trim();
  const content = document.getElementById("content").value.trim();

  msg.innerHTML = "";

  if (title.length < 2) return (msg.innerHTML = `<div class="error">Title is too short.</div>`);
  if (content.length < 2) return (msg.innerHTML = `<div class="error">Content is too short.</div>`);

  try {
    await API.request("/api/posts", {
      method: "POST",
      headers: API.headers(true),
      body: JSON.stringify({ title, content })
    });

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";
    msg.innerHTML = `<div class="success">Saved.</div>`;
    await loadPosts();
  } catch (err) {
    msg.innerHTML = `<div class="error">${err.message}</div>`;
  }
}

function editPost(id, t, c) {
  document.getElementById("editId").value = id;
  document.getElementById("editTitle").value = decodeURIComponent(t);
  document.getElementById("editContent").value = decodeURIComponent(c);
  document.getElementById("editBox").style.display = "block";
  window.scrollTo(0, 0);
}

function closeEdit() {
  document.getElementById("editBox").style.display = "none";
  document.getElementById("editId").value = "";
}

async function saveEdit(e) {
  e.preventDefault();
  const id = document.getElementById("editId").value;
  const title = document.getElementById("editTitle").value.trim();
  const content = document.getElementById("editContent").value.trim();
  const msg = document.getElementById("editMsg");
  msg.innerHTML = "";

  if (!id) return;
  if (title.length < 2) return (msg.innerHTML = `<div class="error">Title is too short.</div>`);
  if (content.length < 2) return (msg.innerHTML = `<div class="error">Content is too short.</div>`);

  try {
    await API.request("/api/posts/" + id, {
      method: "PUT",
      headers: API.headers(true),
      body: JSON.stringify({ title, content })
    });

    msg.innerHTML = `<div class="success">Updated.</div>`;
    closeEdit();
    await loadPosts();
  } catch (err) {
    msg.innerHTML = `<div class="error">${err.message}</div>`;
  }
}

async function deletePost(id) {
  if (!confirm("Delete this post?")) return;
  try {
    await API.request("/api/posts/" + id, {
      method: "DELETE",
      headers: API.headers(false)
    });
    await loadPosts();
  } catch (err) {
    alert(err.message);
  }
}

function initPostsPage() {
  setActiveNav("navPosts");
  loadPosts();

  document.getElementById("createForm").addEventListener("submit", createPost);
  document.getElementById("editForm").addEventListener("submit", saveEdit);
  document.getElementById("closeEditBtn").addEventListener("click", closeEdit);
  document.getElementById("logoutBtn").addEventListener("click", logout);
}

document.addEventListener("DOMContentLoaded", initPostsPage);
