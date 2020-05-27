const express = require("express");
const app = express();
app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); // to support URL-encoded POST body
app.use(express.json()); // to support parsing JSON POST body

app.use("/217116585/",require("./routes/217116585"));
app.use("/217116589/",require("./routes/217116589"));
app.use("/217116590/",require("./routes/217116590"));
app.use("/217116595/",require("./routes/217116595"));

app.listen(80, function(){
    console.log("Listening to port 80");
});