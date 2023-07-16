const express = require('express');
const routes = require('./routes');
const db = require("./config/connection")
// import sequelize connection

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

// sync sequelize models to the database, then turn on the server
db.sync({force:false})
.then(res => {
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
}).catch(err => {
 
    console.log(err)
  
 
  
})

console.log("Server")