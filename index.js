const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// MiddleWare

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0viwxwm.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        // Get the database and collection on which to run the operation
        const productsCollection = client.db('techzoidDB').collection('products');
        const brandsCollection = client.db('techzoidDB').collection('brands');

        app.post('/brands', async (req, res) => {
            const newBrand = req.body;
            const result = await brandsCollection.insertOne(newBrand);
            res.send(result);
        })

        app.get('/brands', async (req, res) => {
            const result = await brandsCollection.find().toArray();
            res.send(result);
        })



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Techzoid server is running')
})

app.listen(port, () => {
    console.log(`Techzoid is running on port: ${port}`);
})