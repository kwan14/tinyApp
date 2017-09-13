
var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended : true }));

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
  let templateVars = { urls : urlDatabase };
  response.render("urls_index", templateVars);
});

app.get("/urls/new", (request, response) => {
  response.render("urls_new");
});

app.get("/urls/:id", (request, response) => {
  let templateVars = { shortURL : request.params.id, urls : urlDatabase };
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
  console.log(urlDatabase);
  response.redirect("http://localhost:8080/urls/" + randomString);
});

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
