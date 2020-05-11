const express = require("express");
const app = express();

app.use(express.urlencoded({extended:true}));
app.use("/217116585/",require("./routes/217116585"));
app.use("/217116589/",require("./routes/217116589"));
app.use("/217116590/",require("./routes/217116590"));
app.use("/217116595/",require("./routes/217116595"));

app.listen(3000, function(){
    console.log("Listening to port 3000");
});