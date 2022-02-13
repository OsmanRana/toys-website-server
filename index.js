const express = require("express");
const { MongoClient } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
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
    const usersCollections = database.collection("users");

    // Toys Collection
    // send all toys
    app.get("/toys", async (req, res) => {
      const cursor = toysCollections.find({});
      const result = await cursor.toArray();
      res.send(result);
    });

    //send single toy by id
    app.get("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await toysCollections.findOne(query);
      res.send(result);
    });

    // send toys by age bracket
    app.get("/shopByAge/:ageBracket", async (req, res) => {
      const ageBracket = req.params.ageBracket;
      const query = { ageBracket: ageBracket };
      const cursor = toysCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //add new toys
    app.post("/addToys", async (req, res) => {
      const toy = req.body;
      const result = await toysCollections.insertOne(toy);
      res.send(result);
    });

    //update a toy
    app.put("/updateToys/:id", async (req, res) => {
      const id = req.params.id;
      const update = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: update.name,
          description: update.description,
          ageBracket: update.ageBracket,
          brand: update.brand,
          price: update.price,
          image: update.image,
        },
      };
      const result = await toysCollections.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    //delete toy
    app.delete("/toys/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await toysCollections.deleteOne(query);
      res.send(result);
    });

    //Users Collection
    //add user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollections.insertOne(user);
      res.send(result);
    });

    //send a user
    app.get("/users", async (req, res) => {
      const users = usersCollections.find({});
      const result = await users.toArray();
      res.send(result);
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
