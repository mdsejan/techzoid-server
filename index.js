const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        // For Brands related API
        app.get('/brands', async (req, res) => {
            const result = await brandsCollection.find().toArray();
            res.send(result);
        })

        app.get('/brands/:id', async (req, res) => {
            const result = await brandsCollection.findOne({ _id: new ObjectId(req.params.id) });
            res.send(result);
        })


        app.post('/brands', async (req, res) => {
            const newBrand = req.body;
            const result = await brandsCollection.insertOne(newBrand);
            res.send(result);
        })

        // For Products related API
        app.get('/products', async (req, res) => {
            const result = await productsCollection.find().toArray();
            res.send(result);
        })

        app.get('/products/:brand', async (req, res) => {
            const brandId = req.params.brand;
            const result = await productsCollection.find({ brand: brandId }).toArray();
            res.send(result);
        })

        app.get('/product/:id', async (req, res) => {
            const result = await productsCollection.findOne({ _id: new ObjectId(req.params.id) });
            res.send(result);
        })

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        })

        // app.put('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) }
        //     const options = { upsert: true };
        //     const updatedProduct = req.body;

        //     const product = {
        //         $set: {
        //             name: updatedProduct.name,
        //             image: updatedProduct.image,
        //             brand: updatedProduct.brand,
        //             category: updatedProduct.category,
        //             price: updatedProduct.price,
        //             rating: updatedProduct.rating,
        //             shortDescription: updatedProduct.shortDescription
        //         }
        //     }

        //     const result = await productsCollection.updateOne(filter, product, options)
        //     res.send(result)
        // })







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