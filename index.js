const express = require('express')
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
var ObjectId = require('mongodb').ObjectId;
const app = express();
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bvkvy.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    const database = client.db('wivoDB');
    const productsCollection = database.collection('products');
    const reviewsCollection = database.collection('reviews');
    const usersCollection = database.collection('users');
    const ordersCollection = database.collection('orders');
    console.log("db connected");
    // get all the products from the database
    app.get('/products', async (req, res) => {
      const products = await productsCollection.find({}).toArray();
      res.json(products);
    }
    );
    // get a single product from the database
    app.get('/products/:id', async (req, res) => {
      const product = await productsCollection.findOne({ _id: ObjectId(req.params.id) })
      res.json(product);
    }
    );
    // get all the reviews from the database
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection.find({}).toArray();
      res.json(reviews);
    });
    // save a user to database 
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    })
    // save orders to the database 
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    })
    // get all the orders from the database
    app.get("/orders", async (req, res) => {
      const orders = await ordersCollection.find({}).toArray();
      res.json(orders);
    });
    // get order by query
    app.get("/orders/:email", async (req, res) => {
      const orders = await ordersCollection.find({ userEmail: req.params.email }).toArray();
      res.json(orders);
    });
  }
  finally {
    // client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello Wivo!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})