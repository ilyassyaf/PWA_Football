document.addEventListener("DOMContentLoaded", function() {
  //Active sidenav
  const elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
  loadNav();

  function loadNav() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status != 200) return;

        //Load Menu
        document.querySelectorAll(".topnav, .sidenav").forEach(function(elm) {
          elm.innerHTML = xhttp.responseText;
        });

        //Menu Listener
        document
          .querySelectorAll(".sidenav a, .topnav a")
          .forEach(function(elm) {
            elm.addEventListener("click", function(event) {
              //Close Sidenav
              var sidenav = document.querySelector(".sidenav");
              M.Sidenav.getInstance(sidenav).close();

              //Load Content
              page = event.target.getAttribute("href").substr(1);
              loadPage(page);
            });
          });
      }
    };
    xhttp.open("GET", "./nav.html", true);
    xhttp.send();
  }

  //Load Page
  var page = window.location.hash.substr(1);
  if (page === "") page = "home";
  loadPage(page);

  function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4) {
        var content = document.querySelector("#body-content");
        if (page === "home" || page === "" || page === "#") {
          getStanding();
        } else if (page === "teams") {
          getAllTeams();
        } else if (page === "fav-team") {
          getFavoriteTeams();
        }

        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
        } else if (this.status == 404) {
          content.innerHTML = "<p>Oops.. Page Not Found!</p>";
        } else {
          content.innerHTML = "<p>Forbidden</p>";
        }
      }
    };
    xhttp.open("GET", "./pages/" + page + ".html", true);
    xhttp.send();
  }
});
