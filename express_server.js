
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
    password : "john" }
};

// Handle HTTP GET requests


app.get("/urls", (request, response) => {
  let templateVars = { username : request.cookies["username"], urls : urlDatabase };
  response.render("urls_index", templateVars);
});

app.get("/urls/new", (request, response) => {
  let templateVars = { username : request.cookies["username"] };
  response.render("urls_new", templateVars);
});

app.get("/urls/:id", (request, response) => {
  let templateVars = { username : request.cookies["username"], shortURL : request.params.id, urls : urlDatabase };
  response.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  response.redirect(urlDatabase[request.params.shortURL]);
});

app.get("/register", (request, response) => {
  response.render("urls_register");
})


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
  response.cookie("username", request.body.username);
  response.redirect("/urls");
});

app.post("/logout", (request, response) => {
  response.clearCookie("username");
  response.redirect("/urls");
});

app.post("/register", (request, response) => {
  let newUserID = generateRandomString();
  if (request.body.email === "" || request.body.email === "" || locateUser(request.body.email)) {
    response.status(400).send("Error");
  } else {
    users[newUserID] = { id : newUserID , email : request.body.email, password : request.body.password };
    response.cookie("user_id", newUserID);
    response.redirect("/urls")
    console.log(users);
  }
})

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