
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

app.get("/urls/:id", (request, response) => {
  let templateVars = { shortURL : request.params.id, urls : urlDatabase };
  response.render("urls_show", templateVars);
});

app.get("/urls/new", (request, response) => {
  response.send("TEST");
});

app.post("/urls", (request, response) => {
  console.log(request.body);
  response.send("Ok");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
