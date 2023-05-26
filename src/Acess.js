const express = require("express");
const app = express();
const router = express.Router();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { response } = require("express");
const uri = "mongodb+srv://chaayasurgicalbd:yXM85Qi3gWwsPVd8@surgical.ohedx5b.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// get single user
router.get('/', async (req,res) => {
  try {
     
      res.send( "hello worldsdfs");
  } catch (err) {
      console.log(err)
  }
});
router.get('/abc', async (req,res) => {
  try {
     
      res.send( "hello worldsdfs");
  } catch (err) {
      console.log(err)
  }
});
     module.exports = router;