const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x13qi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();

    const database = client.db("toysWorld");
    const toysCollections = database.collection("toys");

    //add new toys
    app.post("/toys", async (req, res) => {
      const toy = req.body;
      const result = await toysCollections.insertOne(toy);
      res.send(result);
      console.log(toy);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello from Toys World");
});
app.listen(port, () => {
  console.log("Listening to port", port);
});
