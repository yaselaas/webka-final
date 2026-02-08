function showMsg(el, msg, type) {
  el.innerHTML = msg ? `<div class="${type}">${msg}</div>` : "";
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateUsername(u) {
  return /^[a-zA-Z0-9_]{3,20}$/.test(u);
}

function validatePassword(p) {
  if (p.length < 8) return false;
  if (!/[A-Z]/.test(p)) return false;
  if (!/[a-z]/.test(p)) return false;
  if (!/[0-9]/.test(p)) return false;
  return true;
}

// LOGIN
async function handleLogin(e) {
  e.preventDefault();
  const msg = document.getElementById("msg");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!validateEmail(email)) return showMsg(msg, "Invalid email format.", "error");
  if (!password) return showMsg(msg, "Password is required.", "error");

  try {
    const data = await API.request("/api/auth/login", {
      method: "POST",
      headers: API.headers(true),
      body: JSON.stringify({ email, password })
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showMsg(msg, "Login successful. Redirecting...", "success");
    setTimeout(() => {
      window.location.href = "/posts.html";
    }, 900);
  } catch (err) {
    showMsg(msg, err.message, "error");
  }
}

// REGISTER (shows success message before redirect)
async function handleRegister(e) {
  e.preventDefault();
  const msg = document.getElementById("msg");

  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  msg.innerHTML = "";

  if (!validateUsername(username)) return showMsg(msg, "Username must be 3-20 chars (letters, numbers, underscore).", "error");
  if (!validateEmail(email)) return showMsg(msg, "Invalid email format.", "error");
  if (!validatePassword(password)) return showMsg(msg, "Password must be 8+ chars with uppercase, lowercase, and a number.", "error");
  if (password !== confirmPassword) return showMsg(msg, "Passwords do not match.", "error");

  try {
    const data = await API.request("/api/auth/register", {
      method: "POST",
      headers: API.headers(true),
      body: JSON.stringify({ username, email, password, confirmPassword })
    });

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    showMsg(msg, "Registration successful. Redirecting...", "success");
    setTimeout(() => {
      window.location.href = "/posts.html";
    }, 1200);
  } catch (err) {
    showMsg(msg, err.message, "error");
  }
}
