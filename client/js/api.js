const API = {
  base: "",

  token() {
    return localStorage.getItem("token");
  },

  headers(json = true) {
    const h = {};
    if (json) h["Content-Type"] = "application/json";
    const t = this.token();
    if (t) h["Authorization"] = "Bearer " + t;
    return h;
  },

  async request(path, options = {}) {
    const resp = await fetch(this.base + path, options);
    const data = await resp.json().catch(() => ({}));
    if (!resp.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  }
};

function requireAuth() {
  if (!localStorage.getItem("token")) {
    window.location.href = "/login.html";
  }
}

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login.html";
}
