const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
var ObjectId = require("mongodb").ObjectId;
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvkvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db("wivoDB");
    const productsCollection = database.collection("products");
    const reviewsCollection = database.collection("reviews");
    const usersCollection = database.collection("users");
    const ordersCollection = database.collection("orders");
    console.log("db connected");
    // post a product to the database
    app.post("/products", async (req, res) => {
      const product = req.body;
      console.log(product);
      const result = await productsCollection.insertOne(product);
      res.json(result);
    });

    // get all the products from the database
    app.get("/products", async (req, res) => {
      const products = await productsCollection.find({}).toArray();
      res.json(products);
    });
    // get a single product from the database
    app.get("/products/:id", async (req, res) => {
      const product = await productsCollection.findOne({
        _id: ObjectId(req.params.id),
      });
      res.json(product);
    });
    // delete a product from the database
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const result = await productsCollection.deleteOne({ _id: ObjectId(id) });
      res.json(result);
    });
    // get all the reviews from the database
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection.find({}).toArray();
      res.json(reviews);
    });
    // post a review to the database
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const newReview = await reviewsCollection.insertOne(review);
      res.json(newReview);
    });
    // save a user to database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });
    // save orders to the database
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });
    // get all the orders from the database
    app.get("/orders", async (req, res) => {
      const orders = await ordersCollection.find({}).toArray();
      res.json(orders);
    });
    // get order by query
    app.get("/orders/:email", async (req, res) => {
      const orders = await ordersCollection
        .find({ userEmail: req.params.email })
        .toArray();
      res.json(orders);
    });
    // delete an order from the database
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const result = await ordersCollection.deleteOne({ _id: ObjectId(id) });
      res.json(result);
    });
    // update an order by id
    app.put("/orders", async (req, res) => {
      const id = req.query.id;
      console.log(id);
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.updateOne(query, {
        $set: { status: "shipped" },
      });
      res.json(result);
    });
    // check an user if he an admin
    app.get("/users/:email", async (req, res) => {
      const user = await usersCollection.findOne({ email: req.params.email });
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    // make an admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello Wivo!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
