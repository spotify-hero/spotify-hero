import '../css/index.scss';

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-button").onclick = function() {
    window.location.href = '/login';
  }

  document.getElementById("try-button").onclick = function() {
    window.location.href = '/select?table=mp3'
  }
});