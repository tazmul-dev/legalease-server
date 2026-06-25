const express = require('express');
const app = express()
const cors = require('cors')
const env = require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = 5000
app.use(cors())
app.use(express.json())


const uri = process.env.MONGODB_URL

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db('lawHire')
    const layerCollection = database.collection("layers")
     
   
    // layer porfile releted ;

    app.post('/service',async(req, res)=>{
      {

      const layer = req.body;
      
      const result = await layerCollection.insertOne(layer);
      res.send(result)
    }
    })
    app.get('/magege/profile',async(req,res)=>{
      
    })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    
  }
}
run().catch(console.log);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})