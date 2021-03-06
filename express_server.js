
// Import required modules

const express = require("express");
const cookieSession = require("cookie-session");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

// Initialize and Configure Express

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended : true }));
app.use(cookieSession({
  name: "user_id",
  keys: ["key1", "key2"]
}));

// Initialize variables for testing

const PORT = process.env.PORT || 8080;

const urlDatabase = {
  "b2xVn2": { longURL : "http://www.lighthouselabs.ca", owner : "AAAAAA" },
  "9sm5xK": { longURL : "http://www.google.com", owner : "BBBBBB" },
  "abcdef": { longURL : "http://www.tsn.ca", owner : "AAAAAA"}
};

const users = {
  "AAAAAA" : {
    id : "AAAAAA",
    email : "john.doe@domain.com",
    password : "$2a$10$/ojmxA1cM3ObNFQJ8cKzQ.4qpd.jYyKvYvQ8P.1ogycsiKiBECxma"
  },
  "BBBBBB" : {
    id : "BBBBBB",
    email : "jane.doe@domain.com",
    password : "$2a$10$RdrZYEmR4J100opWX8mi3Ouskf5J.DzX0UhCuvVeDtdoq4RpWYEuG"
  }
};

// Handle HTTP GET requests


app.get("/urls", (request, response) => {
  let user = users[request.session["user_id"]];

  let templateVars = { user : undefined , urls : undefined };
  if (user === undefined) {
    response.render("urls_index", templateVars);
  } else {
    let filteredDatabase = urlsForUser(user.id);
    templateVars.user = user;
    templateVars.urls = filteredDatabase;
    response.render("urls_index", templateVars);
  }

});

app.get("/urls/new", (request, response) => {
  let user = users[request.session["user_id"]];
  if (user === undefined) {
    response.redirect("/login");
  } else {
    let templateVars = { user : user };
    response.render("urls_new", templateVars);
  };
});

app.get("/urls/:id", (request, response) => {
  let user = users[request.session["user_id"]];
  if (user === undefined) {
    response.end("Error: You must login to edit URLs.");
  } else {
    if (user.id === urlDatabase[request.params.id].owner) {
      let templateVars = { user : user, shortURL : request.params.id, urls : urlDatabase };
      response.render("urls_show", templateVars);
    } else {
      response.end("Error: You are not authorized to edit this URL.");
    };
  };
});

app.get("/u/:shortURL", (request, response) => {
  response.redirect(urlDatabase[request.params.shortURL].longURL);
});

app.get("/register", (request, response) => {
  response.render("urls_register");
});

app.get("/login", (request, response) => {

  response.render("urls_login");
});


// Handle HTTP POST requests


app.post("/urls/:id/delete", (request, response) => {
  let user = users[request.session["user_id"]];
  if (user.id === urlDatabase[request.params.id].owner) {
    delete urlDatabase[request.params.id];
    response.redirect("/urls");
  } else {
    response.end("Not Authorized");
  };
});

app.post("/urls/:id", (request, response) => {
  let user = users[request.session["user_id"]];
  if (user.id === urlDatabase[request.params.id].owner) {
    urlDatabase[request.params.id].longURL = request.body.longURL;
    response.redirect("/urls");
  } else {
    response.end("Error: You are not authorized to update this URL.");
  };
})

app.post("/urls", (request, response) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = { longURL : request.body.longURL, owner : request.session.user_id };
  response.redirect("/urls/" + randomString);
});

app.post("/login", (request, response) => {
  let user;
  for (let id in users) {
    if (users[id].email === request.body.email) {
      user = users[id];
    };
  };
  if (user && bcrypt.compareSync(request.body.password, user.password)) {
    request.session.user_id = user.id;
    response.redirect("/urls");
  } else {
    response.status(403);
    response.end("Error: invalid credentials.");
  };
});

app.post("/logout", (request, response) => {
  response.clearCookie("user_id");
  response.redirect("/urls");
});

app.post("/register", (request, response) => {
  let newUserID = generateRandomString();
  if (request.body.email === "" || request.body.password === "") {
    response.status(400);
    response.end("Error: Please enter both an e-mail and a password.");
  } else if (locateUser(request.body.email)) {
    response.status(400);
    response.end("Error: User already exists, please login.");
  } else {
    let passwordHash = bcrypt.hashSync(request.body.password, 10);
    users[newUserID] = { id : newUserID , email : request.body.email, password : passwordHash };
    request.session.user_id = newUserID;
    response.redirect("/urls")
  }
});

// Allow Express to accept HTTP reqeusts.

app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}`);
});



// A random six character alphanumeric string is being used as simulate the shortened URL


function generateRandomString() {
  let result = '';
  const characterSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const length = 6;
    for (let i = 0 ; i < length ; i++) {
      result += characterSet[Math.floor(Math.random() * characterSet.length)];
    }
  return result;
}

// Determine if a user already exists.

function locateUser(emailAddress) {
  for (let userID in users) {
    if (users[userID].email === emailAddress) {
      return true;
    }
    return false;
  }
}

// Identify all URLs that belong to a given user.

function urlsForUser(id) {
  let filteredDatabase = {};
  for (let key in urlDatabase) {
    if (urlDatabase[key].owner === id) {
      filteredDatabase[key] = { longURL : urlDatabase[key].longURL, owner : urlDatabase[key].owner };
    };
  }
  return filteredDatabase;
}