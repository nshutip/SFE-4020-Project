// Header Nav
function headerNav() {
  const x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function checkAuth () {
  const currentUserToken = localStorage.getItem("x-access-token");
  const loginLink = document.querySelector(".login-link")

  if (!currentUserToken) {
    loginLink.innerHTML = "Log In";
    loginLink.setAttribute("href", "clientLogin.html")
  } else {
    loginLink.innerHTML = "Log Out"
    loginLink.addEventListener("click", async(event) => {
      event.preventDefault();
      localStorage.removeItem('x-access-token');
      window.location.href = "index.html"
    })
  }

}