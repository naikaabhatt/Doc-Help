const path = require("path");
const express = require('express');
const session = require("express-session");
const db = require("./util/database");
const flash = require("connect-flash");
// const isAuth = require("../util/isAuth");
const app = express();

// for read meta info
const bodyParser = require("body-parser");

// session settings
app.use(
    session({
        secret: "ssshhhhh",
        resave: false,
        saveUninitialized: false
    })
);

// set template engine
app.set("view engine", "ejs");
app.set("views", "views");

// const techData = require("./routes/intern");

const internData = require("./routes/intern");
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));


app.use("/", internData.routes);

app.use("/", function (req, res, next) {
    res.render("intern/pageNotFound")
});

app.listen(3000, function () {
    console.log('listening on port 3000!');
});
