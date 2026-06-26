const express = require('express');
const app = express()
const cors = require('cors')
const env = require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const lawyerRequestCollection = database.collection("lawyerRequest")
     
   
    // layer porfile releted ;

    app.post('/service',async(req, res)=>{
      {

      const layer = req.body;
      
      const result = await layerCollection.insertOne(layer);
      res.send(result)
    }
    })
    
    app.get('/maneg/profile/:id',async(req, res)=>{
      
      const cursor = await layerCollection.find({lawyerId:req.params.id})
      const result = await cursor.toArray()

      res.send(result)
    })

    app.delete("/maneg/profile/:id", async(req, res)=>{
      const id = req.params.id
      const query = {
        _id: new ObjectId(id)
      }
      const result = await layerCollection.deleteOne(query)
      res.send(result)
    })


    //brows lawyer related
   
    app.get('/lawyers',async(req, res)=>{
      const cursor =await layerCollection.find();
      const result = await cursor.toArray()
      res.send(result)
    })

    // lawyer details related
    app.get('/lawyer/details/:id',async(req, res)=>{
      const id = req.params.id
      const filter = {
      _id: new ObjectId(id)
      }
      const result = await layerCollection.findOne(filter)
      res.send(result)
    })
    
    app.post('/lawyer/request',async(req, res)=>{
      const request = req.body
      const result = await lawyerRequestCollection.insertOne(request)
      res.send(result)

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