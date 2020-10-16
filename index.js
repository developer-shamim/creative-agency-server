const express = require('express')
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ym542.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('services'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true  });
  client.connect(err => {
    const ordersCollection = client.db("creativeAgency").collection("orders");
    const serviceCollection = client.db("creativeAgency").collection("services");
    const reviewCollection = client.db("creativeAgency").collection("reviews");
    const adminCollection = client.db("creativeAgency").collection("admins");
    
  app.post('/addOrder', (req, res) => {
      const orders = req.body;
      ordersCollection.insertOne(orders)
      .then(result => {
          res.send(result.insertedCount > 0)
      })
  })

  app.post('/addReview', (req, res) => {
    const reviews = req.body;
    reviewCollection.insertOne(reviews)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})

// app.post('/addService', (req, res) => {
//   const services = req.body;
//   serviceCollection.insertOne(services)
//   .then(result => {
//       res.send(result.insertedCount > 0)
//   })
// })

app.post('/addAdmin', (req, res) => {
  const admins = req.body;
  adminCollection.insertOne(admins)
  .then(result => {
      res.send(result.insertedCount > 0)
  })
})

app.post('/addService', (req, res) => {
  const file = req.files.file;
  const service = req.body.service;
  const details = req.body.details;
  const newImg = file.data;
  const encImg = newImg.toString('base64');

  var image = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, 'base64')
  };
  serviceCollection.insertOne({ service, details, image })
  .then(result => {
      res.send(result.insertedCount > 0);
  })
})

app.get('/services', (req, res) => {
  serviceCollection.find({})
  .toArray((err, documents) => {
    res.send(documents);
  })
})

  app.get('/orderLists', (req, res) => {
    const services = req.body;
    const email = req.body.email;
    adminCollection.find({email:email})
    .toArray((err, admins) => {
      if (admins.lenth === 0) {
        filter.email = email;
      }
      ordersCollection.find()
    .toArray((err, documents) => {
        console.log(email, admins, documents)
        res.send(documents)

    })
        })
})


});

app.listen(process.env.PORT || port);