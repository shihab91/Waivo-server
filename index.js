const express = require('express')
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config();
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
    console.log("db connected");
    // get all the products from the database
    app.get('/products', async (req, res) => {
      const products = await productsCollection.find({}).toArray();
      res.json(products);
    }
    );
    // get all the reviews from the database
    app.get("/reviews", async (req, res) => {
      const reviews = await reviewsCollection.find({}).toArray();
      res.json(reviews);
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