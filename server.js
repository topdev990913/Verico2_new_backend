const express = require("express");
const cors = require("cors");
const path = require('path');
const mongoose = require('mongoose');/////////////////////
const app = express();
const ExcelRoute = require('./routes/excel.route')
router = express.Router()

app.use(cors());
app.use('/', ExcelRoute)
const Schema = mongoose.Schema;///////////////////////
const ObjectId = Schema.ObjectId;

const CategorySchema = new Schema({
  title: String,
  details: [String],
});

const Category = mongoose.model('categories', CategorySchema);/////////////////////////
// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to VeriCO2." });
// });

app.get('/api/calculation', function(req, res) {///////////////////////////
  Category.find().then((categories) => {
      res.send(categories)
  })
})

require("./routes/auth.route")(app);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '/dist')));

// send back React's index.html file.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});

// set port, listen for requests
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});