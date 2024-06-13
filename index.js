const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongoDB
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.wu8kmms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7

    // create a new database collection
    // user Collection
    const userCollection = client.db("tourSavvyDB").collection("users");
    // spots collection
    const touristSpotCollection = client .db("tourSavvyDB").collection("touristSpots");
    // country collection
    const countryCollection = client.db("tourSavvyDB").collection("countries");

    // Spots related API calls
    app.post("/spot", async (req, res) => {
        const newSpot = req.body;
        console.log(newSpot);
        const result = await touristSpotCollection.insertOne(newSpot);
        res.send(result);
      });

    // calling single spots via id
    app.get("/spot/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await touristSpotCollection.findOne(query);
        res.send(result);
      });

    // calling all spots
    app.get("/spot", async (req, res) => {
        const cursor = touristSpotCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

    // calling all spots from same email address
    app.get("/spot/my-list/:email", async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const result = await touristSpotCollection.find(query).toArray();
        res.send(result);
      });

    // updating one spot
    app.patch("/spot/:id", async (req, res) => {
        const id = req.params.id;
        const updatedSpot = req.body;
        console.log(updatedSpot);
        const query = { _id: new ObjectId(id) };
        const result = await touristSpotCollection.updateOne(query, {
          $set: updatedSpot,
        });
        res.send(result);
      });

    // deleting one spot
    app.delete("/spot/:id", async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await touristSpotCollection.deleteOne(query);
        res.send(result);
      });
    

    // country related API calls
    // calling all country
    app.get("/country", async (req, res) => {
        const cursor = countryCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

    // get all data from same country
    app.get("/spot/country/:country", async (req, res) => {
      const country = req.params.country;
      const query = { country_Name: country };
      const result = await touristSpotCollection.find(query).toArray();
      res.send(result);
    });

    // user related API calls
    // sending user data to DB
    app.post("/user", async (req, res) => {
        const newUser = req.body;
        console.log(newUser);
        const result = await userCollection.insertOne(newUser);
        res.send(result);
      });

    // calling all users
    app.get("/user", async (req, res) => {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// routes
app.get("/", (req, res) => {
    res.send("Tour Savvy server is running");
  });
  
  // listening port
  app.listen(port, () => {
    console.log("Tour Savvy server is listening on port " + port);
  });
  