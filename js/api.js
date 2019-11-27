const API_KEY = "579781cba85c44d8a468c7ea8d4f10b4";
const LEAGUE_ID = 2021;
var base_url = "https://api.football-data.org/v2/";
var teams_url = `${base_url}competitions/${LEAGUE_ID}/teams`;
var standing_url = `${base_url}competitions/${LEAGUE_ID}/standings`;
var teamData;

// fetch
function fetchApi(url) {
  return fetch(url, {
    headers: {
      "X-Auth-Token": API_KEY
    }
  });
}

// check
function status(response) {
  if (response.status !== 200) {
    console.log("Error: " + response.status);
    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

// parse json
function json(response) {
  return response.json();
}

// error handling
function error(error) {
  // error from promise.reject()
  console.log("Error: " + error);
}

// request standing data
function getStanding() {
  if ("caches" in window) {
    caches.match(standing_url).then(function(response) {
      if (response) {
        response.json().then(function(data) {
          standingView(data);
        });
      }
    });
  }

  fetchApi(standing_url)
    .then(status)
    .then(json)
    .then(function(data) {
      standingView(data);
    })
    .catch(error);
}

// request team data
function getAllTeams() {
  fetchApi(teams_url)
    .then(status)
    .then(json)
    .then(function(data) {
      teamsView(data);
    })
    .catch(error);
}

// get favorite teams
function getFavoriteTeams() {
  var dataDB = getFavTeams();
  dataDB.then(function(data) {
    favTeamsView(data);
  });
}

// DB
var dbPromise = idb.open("football", 1, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore("teams", { keyPath: "id" });
  }
});

function insertTeam(team) {
  dbPromise
    .then(function(db) {
      var tx = db.transaction("teams", "readwrite");
      var store = tx.objectStore("teams");
      store.put(team);
      return tx.complete;
    })
    .then(function() {
      M.toast({ html: `${team.name} saved.` });
      console.log("Match saved.");
    })
    .catch(err => {
      console.error("Save failed: ", err);
    });
}

function deleteTeam(teamId) {
  dbPromise
    .then(function(db) {
      var tx = db.transaction("teams", "readwrite");
      var store = tx.objectStore("teams");
      store.delete(teamId);
      return tx.complete;
    })
    .then(function() {
      M.toast({ html: "Team has been deleted!" });
      if (Notification.permission === "granted") {
        navigator.serviceWorker.ready.then(function(registration) {
          registration.showNotification("Deleted from favorite.");
        });
      } else {
        console.error("Notification blocked.");
      }
      getFavoriteTeams();
    })
    .catch(err => {
      console.error("Error: ", err);
    });
}

function getFavTeams() {
  return dbPromise.then(function(db) {
    var tx = db.transaction("teams", "readonly");
    var store = tx.objectStore("teams");
    return store.getAll();
  });
}

var insertTeamListener = teamId => {
  var team = teamData.teams.filter(el => el.id == teamId)[0];
  insertTeam(team);
  console.log(teamId + "Add to favorite");
};

var deleteTeamListener = teamId => {
  var confirmation = confirm("Delete this team from favorite?");
  if (confirmation == true) {
    deleteTeam(teamId);
    console.log(teamId + "has been deleted");
  }
};

// Views
function favTeamsView(data) {
  var html = "";
  data.forEach(function(team) {
    html += `
      <div class="collection-item"> 
        <div class="center"><img width="50" height="50" src="${team.crestUrl}"></div>
        <div class="center">${team.name} </div>
        <div class="center">${team.area.name}</div>
        <div class="center">${team.founded}</div>
        <div class="center">${team.venue}</div>
        <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
        <div class="card-action right-align">
          <a class="waves-effect waves-light btn red" onclick="deleteTeamListener(${team.id})"><i class="material-icons right"></i>Delete from Favorite</a>
        </div>
        </div>
      </div>
    `;
  });
  if (data.length == 0)
    html += '<h6 class="center-align">No favorite team found!</6>';
  document.getElementById("fav-teams").innerHTML = html;
}

function teamsView(data) {
  var str = JSON.stringify(data).replace(/http:/g, "https:");
  data = JSON.parse(str);
  teamData = data;
  var html = "";
  html += "";
  data.teams.forEach(function(team) {
    html += `
    <div class="collection-item">
      <div class="center"><img width="50" height="50" src="${team.crestUrl}"></div>
      <div class="center">${team.name}</div>
      <div class="center">${team.area.name}</div>
      <div class="center">${team.founded}</div>
      <div class="center">${team.venue}</div>
      <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
      <div class="card-action right-align">
        <a class="waves-effect waves-light btn blue" onclick="insertTeamListener(${team.id})"><i class="material-icons right"></i>Add to Favorite</a>
      </div>
      </div>
    </div>
    `;
  });
  document.getElementById("teams").innerHTML = html;
}

function standingView(data) {
  var html = "";
  var content = "";
  var str = JSON.stringify(data).replace(/http:/g, "https:");

  data = JSON.parse(str);
  content = `<span class="card-title" align="center" style ="font-weight: bold;">${data.competition.name}  </span>
  `;
  data.standings[0].table.forEach(function(team) {
    html += `
    <tr>
      <td>${team.position}</td>
      <td><img class="responsive-img" width="20" height="20" src="${team.team.crestUrl}"> ${team.team.name}</td>
      <td>${team.playedGames}</td>
      <td>${team.won}</td>
      <td>${team.draw}</td>
      <td>${team.lost}</td>
      <td>${team.goalsFor}</td>
      <td>${team.goalsAgainst}</td>
      <td>${team.goalDifference}</td>
      <td>${team.points}</td>
    </tr>
  `;
  });
  document.getElementById("standing").innerHTML = html;
  document.getElementById("standingCard").innerHTML = content;
}
