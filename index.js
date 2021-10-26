const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g8d1l.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db('carMechanic')
        const serviceCollection = database.collection('service')

        // GET api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        // GET single service
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id)
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query)
            res.json(service)
        })

        // POST api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service)

            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.send(result)
        })

        // DELETE api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.json(result)
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Server');
})

app.get('/hello', (req, res) => {
    res.send('hello updated here')
})

app.listen(port, () => {
    console.log('Running Genius Server on port', port)
})

/*
one-time:
1. heroku account open
2. heroku software install

Every project
1. git init
2. .gitignore (node_module, .env)
3. push everything to git
4. make sure you have this script: "start": "node index.js"
5. make sure: process.env.PORT in front of your port number
6. heroku login
7. heroku create (only one time for a project)
8. command: git push heroku main
9. heroku > app > settings > add var (add DB_USER, DB_PASS)
---------
update:
1. save everything check locally
2. git add, git commit, git push
3. git push heroku main
 */