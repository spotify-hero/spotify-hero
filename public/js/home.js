import '../css/home.scss';

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-button").onclick = function() {
    window.location.href = '/login';
  }

});