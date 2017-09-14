
// Import required modules

const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

// Initialize and Configure Express

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended : true }));
app.use(cookieParser());

// Initialize variables for testing

const PORT = process.env.PORT || 8080;

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  "AAAAAA" : {
    id : "AAAAAA",
    email : "john.doe@domain.com",
    password : "john"
  },
  "BBBBBB" : {
    id : "BBBBBB",
    email : "jane.doe@domain.com",
    password : "jane"
  }
};

// Handle HTTP GET requests


app.get("/urls", (request, response) => {
  let user = users[request.cookies["user_id"]];
  //console.log(user);
  let templateVars = { user : user , urls : urlDatabase };
  response.render("urls_index", templateVars);
});

app.get("/urls/new", (request, response) => {
  let user = users[request.cookies["user_id"]];
  let templateVars = { user : user };
  response.render("urls_new", templateVars);
});

app.get("/urls/:id", (request, response) => {
  let user = users[request.cookies["user_id"]];
  let templateVars = { user : user, shortURL : request.params.id, urls : urlDatabase };
  response.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  response.redirect(urlDatabase[request.params.shortURL]);
});

app.get("/register", (request, response) => {
  response.render("urls_register");
});

app.get("/login", (request, response) => {
  response.render("urls_login");
});


// Handle HTTP POST requests


app.post("/urls/:id/delete", (request, response) => {
  delete urlDatabase[request.params.id];
  response.redirect("/urls");
});

app.post("/urls/:id", (request, response) => {
  urlDatabase[request.params.id] = request.body.longURL;
  response.redirect(`/urls/${request.params.id}`);
})

app.post("/urls", (request, response) => {
  let randomString = generateRandomString();
  urlDatabase[randomString] = request.body.longURL;
  response.redirect("/urls/" + randomString);
});

app.post("/login", (request, response) => {
  let user;
  for (let id in users) {
    if (users[id].email === request.body.email && users[id].password === request.body.password) {
      user = users[id];
      response.cookie("user_id", user.id);
      response.redirect("/urls");
    } else {
      response.status(403);
      response.end("Error");
    }
  };
});

app.post("/logout", (request, response) => {
  response.clearCookie("username");
  response.redirect("/urls");
});

app.post("/register", (request, response) => {
  let newUserID = generateRandomString();
  if (request.body.email === "" || request.body.email === "" || locateUser(request.body.email)) {
    response.status(400);
    response.end("Error");
  } else {
    users[newUserID] = { id : newUserID , email : request.body.email, password : request.body.password };
    response.cookie("user_id", newUserID);
    response.redirect("/urls")
  }
});

app.post("/login", (request, response) => {
  //Process login request...
});

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

function locateUser(emailAddress) {
  for (let userID in users) {
    if (users[userID].email === emailAddress) {
      console.log("EMAIL FOUND");
      return true;
    }
    return false;
  }
}