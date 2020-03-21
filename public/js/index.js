import '../css/index.scss';

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-button").onclick = function() {
    window.location.href = '/login';
  }

});