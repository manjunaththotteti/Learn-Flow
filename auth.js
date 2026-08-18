document.getElementById("login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  if (username) {
    localStorage.setItem("learnflowUser", username);
    window.location.href = "dashboard.html";
  }
});
