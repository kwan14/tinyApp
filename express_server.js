
var express = require("express");
var app = express();
var cookieParser = require("cookie-parser");
var PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");


app.use(bodyParser.urlencoded({ extended : true }));
app.use(cookieParser());

var urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.set("view engine", "ejs");

/*
app.get("/", (request, response) => {
  response.end("Hello!");
});

app.get("/urls.json", (request, response) => {
  response.json(urlDatabase);
});

app.get("/hello", (request, response) => {
  response.end("<html><body>Hello <b>World</b></body></html>\n");
});
*/

app.get("/urls", (request, response) => {
  let templateVars = { username : request.cookies["username"], urls : urlDatabase };
  response.render("urls_index", templateVars);
});

app.get("/urls/new", (request, response) => {
  response.render("urls_new", { username : request.cookies["username"] });
});

app.get("/urls/:id", (request, response) => {
  let templateVars = { username : request.cookies["username"], shortURL : request.params.id, urls : urlDatabase };
  response.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (request, response) => {
  // console.log(request.params.shortURL);
  response.redirect(urlDatabase[request.params.shortURL]);
});

app.post("/urls/:id/delete", (request, response) => {
  // console.log(request.params.id);
  delete urlDatabase[request.params.id];
  response.redirect("/urls");
});

app.post("/urls/:id", (request, response) => {
  //console.log("Recieved update request");
  //console.log(request.params.id);
  //console.log(request.body);
  urlDatabase[request.params.id] = request.body.longURL;
  response.redirect(`/urls/${request.params.id}`);
})

app.post("/urls", (request, response) => {
  //console.log(request.body);
  let randomString = generateRandomString();
  urlDatabase[randomString] = request.body.longURL;
  //console.log(urlDatabase);
  response.redirect("/urls/" + randomString);
});

app.post("/login", (request, response) => {
  //console.log(request.body);
  response.cookie("username", request.body.username);
  response.redirect("/urls");
});

app.post("/logout", (request, response) => {
  response.clearCookie("username");
  response.redirect("/urls");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


function generateRandomString() {
  let result = '';
  const characterSet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const length = 6;
    for (var i = 0 ; i < length ; i++) {
      result += characterSet[Math.floor(Math.random() * characterSet.length)];
    }
  return result;
}
