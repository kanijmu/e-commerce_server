
const express = require("express");
const app = express();
const port=process.env.PORT || 5000;
const jwt = require('jsonwebtoken');
const cors = require("cors");
app.use(cors());
app.use(express.json({limit: '1mb'}));
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { response } = require("express");
const uri = "mongodb+srv://mehanazemon:mIYrnOil3CHLZPYk@cluster0.lmpqbnu.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
     try {
          await client.connect();
          const medicalItemsCollection = client.db("MedicalShop").collection("products");
           const catagoryCallection = client.db("MedicalShop").collection("catagory");
           const CoponeCallection = client.db("MedicalShop").collection("copone");
           const AddToCartCallection = client.db("MedicalShop").collection("addToCart");
           const OrdersCallection = client.db("MedicalShop").collection("userorders");
           const UserCallection = client.db("MedicalShop").collection("users");
           const ContactCallection = client.db("MedicalShop").collection("Contact");
//  create token 
function veryfyJWT(req,res,next){
  const authHeader=req.headers.authorization;
  if(!authHeader){
    return res.status(401).send({message:'Unauthorized access'})
  }
  const token=authHeader.split(' ')[1];
  jwt.verify(token, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NzMxODY4NTMsImV4cCI6MTcwNDcyMjg1MywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0IE1DR4YWcVccOfiO4R8u91fD6krWB1nQBkB0yc3gaos', function(error, decoded) {
    if(error){
      return res.status(403).send({message:'Forbidden access'})
    }
    req.decoded=decoded;
    next();
  });
}
// const users = require('./src/Acess');
// app.use("/ase",users)
// admin role 
app.get("/admin/:email", async (req, res) => {
          try {
            const email=req.params.email;
          const user = await UserCallection.findOne({email:email});const isAdmin=user.role==='admin';
          res.send({admin:isAdmin});
          } catch (error) {
            return res.status(500).send(error)
          }
        });
// worker role 
app.get("/worker/:email", async (req, res) => {
          try {
            const email=req.params.email;
          const user = await UserCallection.findOne({email:email});const isWorker=user.wrole==='worker';
          res.send({worker:isWorker});
          } catch (error) {
            return res.status(500).send(error)
          }
        });
// token for user 
           app.put('/user/:email', async (req, res) => {
            try {
              const email = req.params.email;
            const user = req.body;
            const filter = {email:email};
            const options = { upsert: true };
            const updateDoc = {
                $set: user,
              };
            const result = await UserCallection.updateOne(filter, updateDoc, options);
            var token = jwt.sign({ email:email}, 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NzMxODY4NTMsImV4cCI6MTcwNDcyMjg1MywiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoianJvY2tldEBleGFtcGxlLmNvbSIsIkdpdmVuTmFtZSI6IkpvaG5ueSIsIlN1cm5hbWUiOiJSb2NrZXQiLCJFbWFpbCI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJSb2xlIjpbIk1hbmFnZXIiLCJQcm9qZWN0IEFkbWluaXN0cmF0b3IiXX0IE1DR4YWcVccOfiO4R8u91fD6krWB1nQBkB0yc3gaos',{expiresIn:'15d'});
            res.json({result,token})
            } catch (error) {
              return res.status(500).send(error)
            }
        })
// make admin 
           app.put('/user/admin/:email',veryfyJWT, async (req, res) => {
            try {
              const email = req.params.email;
            const requester=req.decoded.email;
            const requesterAccount=await UserCallection.findOne({email:requester})
            if(requesterAccount.role === 'admin'){
              const filter = {email:email};
              const updateDoc = {
                  $set:{role:'admin'},
                };
                // console.log(updateDoc)
              const result = await UserCallection.updateOne(filter, updateDoc);
              res.json(result)
            }else{
              res.status(403).send({message:"forbidden.."})
            }
            } catch (error) {
              return res.status(500).send(error)
            }
        })
// remove admin role 
           app.put('/userr/admin/:email',veryfyJWT, async (req, res) => {
            try {
              const email = req.params.email;
            const requester=req.decoded.email;
            const requesterAccount=await UserCallection.findOne({email:requester})
            if(requesterAccount.role === 'admin'){
              const filter = {email:email};
              const updateDoc = {
                  $set:{role:'remove'},
                };
              const result = await UserCallection.updateOne(filter, updateDoc);
              res.json(result)
            }else{
              res.status(403).send({message:"forbidden"})
            }
            } catch (error) {
              return res.status(500).send(error)
            }
        })
// make worker 
           app.put('/worker/admin/:email',veryfyJWT, async (req, res) => {
            try {
              const email = req.params.email;
            const requester=req.decoded.email;
            const requesterAccount=await UserCallection.findOne({email:requester})
            if(requesterAccount.role === 'admin'){
              const filter = {email:email};
              const updateDoc = {
                  $set:{wrole:'worker'},
                };
              const result = await UserCallection.updateOne(filter, updateDoc);
              res.json(result)
            }else{
              res.status(403).send({message:"forbidden"})
            }
            } catch (error) {
              return res.status(500).send(error)
            }
        })
// remove worker role 
           app.put('/workerr/admin/:email',veryfyJWT, async (req, res) => {
            try {
              const email = req.params.email;
            const requester=req.decoded.email;
            const requesterAccount=await UserCallection.findOne({email:requester})
            if(requesterAccount.role === 'admin'){
              const filter = {email:email};
              const updateDoc = {
                  $set:{wrole:'notworker'},
                };
              const result = await UserCallection.updateOne(filter, updateDoc);
              res.json(result)
            }else{
              res.status(403).send({message:"forbidden"})
            }
            } catch (error) {
              return res.status(500).send(error)
            }
        })
        //customers orders  details start
        // customers orders count 
    app.get('/customersordersformarketingcount',async(req,res)=>{
      try {
        const count=await UserCallection.countDocuments();
      res.send({count})
      } catch (error) {
        return res.status(500).send(error)
      }
     })
        // get all orders 
      app.get("/customersordersformarketing", async (req, res) => {
        try {
          const orders = await UserCallection.find({}).toArray();
        console.log(orders);
        res.send(orders);
        } catch (error) {
          return res.status(500).send(error)
        }
      });
        //customers orders  details end
// get all users
        app.get("/users",veryfyJWT, async (req, res) => {
          try {
            const users = await UserCallection.find({}).sort({_id:-1}).toArray();
          console.log(users);
          res.send(users);
          } catch (error) {
            return res.status(500).send(error)
          }
        });
         // search user by email
         app.get("/searchuser",  async(req, res) => {
          try {
            if(req.query.email!==''){
          const email = req.query.email;
          const query = { email: { $regex: email, $options: 'i' } };
          const cursor = UserCallection.find(query);
          const result = await cursor.toArray();
          res.send(result);
        }
           } catch (error) {
            return res.status(500).send(error)
           }
         });
// all users count 
        app.get('/userscount',async(req,res)=>{
          try {
            const count=await UserCallection.countDocuments();
          res.send({count})
          } catch (error) {
            return res.status(500).send(error)
          }
         })
// create order 
      app.post("/itemorder", async (req, res) => {
       try {
        const productorder = req.body;
        console.log("from post api", productorder);
        const result = await OrdersCallection.insertOne(productorder);
        res.send(result);
       } catch (error) {
        return res.status(500).send(error)
       }
      });
      // get all orders 
      app.get("/allorders", async (req, res) => {
        try {
          const orders = await OrdersCallection.find({}).project({status:1,TotalPrice:1}).toArray();
        console.log(orders);
        res.send(orders);
        } catch (error) {
          return res.status(500).send(error)
        }
      });
// all orders count 
      app.get('/orderscount',async(req,res)=>{
        try {
          const count=await OrdersCallection.countDocuments();
        res.send({count})
        } catch (error) {
          return res.status(500).send(error)
        }
       })
        // search order by email
        app.get("/ordersearch",  async(req, res) => {
          try {
            if(req.query.email!==''){
          const email = req.query.email;
          const query = { email: { $regex: email, $options: 'i' } };
          const cursor = OrdersCallection.find(query);
          const result = await cursor.toArray();
          res.send(result);
        }
           } catch (error) {
            return res.status(500).send(error)
           }
         });
// all users order with pagination 
      app.get("/productsorders",veryfyJWT, async (req, res) => {
        try {
         const page = parseInt(req.query.page);
        const {search } = req.query
        const size = parseInt(req.query.size);
         const query=  {};
        const cursor = OrdersCallection.find(query).project({dateAndTime:1,status:1,TotalPrice:1,email:1});
        const count =await cursor.count()
       let products;
   if(page || size){
     products = await cursor.skip(page*size).limit(size).sort({_id:-1}).toArray();
   }else{
   products=await cursor.toArray();
   }
   res.send({count,products});
        } catch (error) {
         return res.status(500).send(error)
        }
      });
// all products count 
    app.get('/allproductscount',async(req,res)=>{
     try {
       const count=await medicalItemsCollection.countDocuments();
     res.send({count})
     } catch (error) {
       return res.status(500).send(error)
     }
    })
// get single order
          app.get("/itemorder/:id", async (req, res) => {
           try {
            const id = req.params.id;
            const filter = { _id: ObjectId(id)};
            const result = await OrdersCallection.findOne(filter);
            res.send(result);
           } catch (error) {
            return res.status(500).send(error)
           }
          }
        );
// delete single order 
       app.delete("/itemorderdelete/:id", async (req, res) => {
        try {
          const id = req.params.id;
        const filter = { _id: ObjectId(id) };
        const result = await OrdersCallection.deleteOne(filter);
        res.send(result);
        } catch (error) {
          return res.status(500).send(error)
        }
      });
// order status update   
      app.post('/orderstatusupdate/:id', async (req, res) => {
       try {
        const id = req.params.id;
        const updateOrder = req.body.status;
        const filter = { _id: ObjectId(id) };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              status:updateOrder, 
            },
          };
        const result = await OrdersCallection.updateOne(filter, updateDoc, options)
        console.log('updatedone', id)
        res.json(result)
       } catch (error) {
        return res.status(500).send(error)
       }
    })
// user specification data load on his deshboard        
          app.get("/userselforder", async (req, res) => {
            try {
              const email=req.query.email;
            const query = {email:email};
            const findData =await OrdersCallection.find(query).toArray();
            res.send(findData);
            } catch (error) {
              return res.status(500).send(error)
            }
          });
// add to cart 
app.post("/addtocart", async (req, res) => {
           try {
            const newNote = req.body;
            console.log("from post api", newNote);
            const result = await AddToCartCallection.insertOne(newNote);
            res.send(result);
           } catch (error) {
            return res.status(500).send(error)
           }
          });
//  user specification cart data load
          app.get("/cartdata", async (req, res) => {
            try {
              const useremail=req.query.useremail;
              const query = {useremail:useremail};
              const findData =await AddToCartCallection.find(query).limit(6).sort({_id:-1}).toArray();
             return res.send(findData);
            } catch (error) {
              return res.status(500).send(error)   
            }     
          });
// user shopping cart spacifiq data  
          app.get("/usercartdata", async (req, res) => {
           try {
            const query = {};
            const cursor = AddToCartCallection.find( query);
            const result = await cursor.toArray();
            res.send(result);
           } catch (error) {
            return res.status(500).send(error)
           }
          });
// shopping cart temporary data delete 
          app.delete("/cartdatadelete/:id", async (req, res) => {
           try {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await AddToCartCallection.deleteOne(filter);
            res.send(result);
           } catch (error) {
            return res.status(500).send(error)
           }
          });
// create copone 
          app.post("/coupon", async (req, res) => {
               try {
                const newCataqgory = req.body;
               const result = await CoponeCallection.insertOne(newCataqgory);
               res.send(result);
               } catch (error) {
                return res.status(500).send(error)
               }
             });
// copone count 
             app.get('/coponecount',async(req,res)=>{
              try {
                const count=await CoponeCallection.countDocuments();
              res.send({count})
              } catch (error) {
                return res.status(500).send(error)
              }
             })
//find copones
          app.get("/copones", async (req, res) => {
               try {
                const query = {};
               const cursor = CoponeCallection.find( query);
               const result = await cursor.toArray();
               res.send(result);
               } catch (error) {
                return res.status(500).send(error)
               }
             });
// delete singel copone 
             app.delete("/copone/:id", async (req, res) => {
             try {
              const id = req.params.id;
              const filter = { _id: ObjectId(id) };
              const result = await CoponeCallection.deleteOne(filter);
              res.send(result);
             } catch (error) {
              return res.status(500).send(error)
             }
            });
// update copone 
          app.put('/coupon/:id', async (req, res) => {
            try {
              const id = req.params.id;
            const updateProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  catagory: updateProduct.catagory,
                  
                },
              };
              console.log(updateDoc)
            const result = await CoponeCallection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
            } catch (error) {
              return res.status(500).send(error)
            }
        })
//get spacifiq copne data
          app.get("/coupon/:id", async (req, res) =>{
          try {
            const id = req.params.id;
            const filter = { _id: ObjectId(id)};
            const result = await CoponeCallection.findOne(filter);
            res.send(result);
          } catch (error) {
            return res.status(500).send(error)
          }
          }
        );
//get categroy count 
             app.get('/catagoycount',async(req,res)=>{
              try {
                const count=await catagoryCallection.countDocuments();
              res.send({count})
              } catch (error) {
                return res.status(500).send(error)
              }
             })
 //create catagory
          app.post("/catagory", async (req, res) => {
              try {
                const newCataqgory = req.body;
                const result = await catagoryCallection.insertOne(newCataqgory);
                res.send(result);
              } catch (error) {
                return res.status(500).send(error)
              }
             });
          // reda catagory 
          app.get("/categories", async (req, res) => {
               try {
                const query = {};
               const cursor = catagoryCallection.find( query);
               const result = await cursor.toArray();
               res.send(result);
               } catch (error) {
                return res.status(500).send(error)
               }
             });
 //delete catagory
             app.delete("/catagory/:id", async (req, res) => {
              try {
                const id = req.params.id;
              const filter = { _id: ObjectId(id) };
              const result = await catagoryCallection.deleteOne(filter);
              res.send(result);
              } catch (error) {
                return res.status(500).send(error)
              }
            });
//update           
          app.put('/category/:id', async (req, res) => {
            try {
              const id = req.params.id;
            const updateProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  catagory: updateProduct.catagory,
                  
                },
              };
              console.log(updateDoc)
            const result = await catagoryCallection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
            } catch (error) {
              return res.status(500).send(error)
            }
        })
//get single catagory data
          app.get("/category/:id", async (req, res) => {
            try {
              const id = req.params.id;
            const filter = { _id: ObjectId(id)};
            const result = await catagoryCallection.findOne(filter);
            res.send(result);
            } catch (error) {
              return res.status(500).send(error)
            }
          }
        );

// get spacifiq product data
          app.get("/product/:id", async (req, res) => {
            try {
              const id = req.params.id;
            const filter = { _id: ObjectId(id)};
            const result = await medicalItemsCollection.findOne(filter);
            res.send(result);
            } catch (error) {
              return res.status(500).send(error)
            }
          }
        );
        // search product by keywords
        app.get("/productsearch",  async(req, res) => {
          try {
            if(req.query.keywords!==''){
          const keywords = req.query.keywords;
          const query = { keywords: { $regex: keywords, $options: 'i' } };
          const cursor = medicalItemsCollection.find(query);
          const result = await cursor.toArray();
          res.send(result);
        }
           } catch (error) {
            return res.status(500).send(error)
           }
         });
        // search products by category
        app.get("/productsearchbycategory",  async(req, res) => {
          try {
            if(req.query.catagory!==''){
          const catagory = req.query.catagory;
          const query = { catagory: { $regex: catagory, $options: 'i' } };
          const cursor = medicalItemsCollection.find(query);
          const result = await cursor.toArray();
          res.send(result);
        }
           } catch (error) {
            return res.status(500).send(error)
           }
         });
        // search products by category
        app.get("/productsearchbycategorywithlimit",  async(req, res) => {
          try {
            if(req.query.catagory!==''){
          const catagory = req.query.catagory;
          const query = { catagory: { $regex: catagory, $options: 'i' } };
          const cursor = medicalItemsCollection.find(query).limit(12);
          const result = await cursor.toArray();
          res.send(result);
        }
           } catch (error) {
            return res.status(500).send(error)
           }
         });
        // search product by status
        app.get("/orders", async (req, res) => {
          try {
           const status = {status:req.query.status};
           const cursor = OrdersCallection.find(status);
           const result = await cursor.toArray();
           res.send(result);
          } catch (error) {
           return res.status(500).send(error)
          }
         });
        //update  product quentity         
        app.put('/quentity/:id', async (req, res) => {
          try {
            const id = req.params.id;
          const updateProductquentity = req.body;
          const filter = { _id: ObjectId(id) };
          const options = { upsert: true };
          const updateDoc = {
              $set: {
                productQuentity: updateProductquentity.productQuentity,
                
              },
            };
            console.log(updateDoc)
          const result = await AddToCartCallection.updateOne(filter, updateDoc, options)
          console.log('updating', id)
          res.json(result)
          } catch (error) {
            return res.status(500).send(error)
          }
      })
        app.get("/productssearchbydateandtime", async (req, res) => {
          try {
           const dateAndTime = {dateAndTime:req.query.status};
           const cursor = OrdersCallection.find(dateAndTime);
           const result = await cursor.toArray();
           res.send(result);
          } catch (error) {
           return res.status(500).send(error)
          }
         });
         // get new 6 products
        app.get("/newproducts", async (req, res) => {
          try {
            const users = await medicalItemsCollection.find({}).project({name:1,price:1,previcePrice:1,status:1,image1:1,catagory:1}).limit(6).sort({_id:-1}).toArray();
          console.log(users);
          res.send(users);
          } catch (error) {
            return res.status(500).send(error)
          }
        });
// get all products
     app.get("/products/", async (req, res) => {
     try {
      const query = {};
      const cursor = medicalItemsCollection.find( query);
      const result = await cursor.toArray();
      res.send(result);
     } catch (error) {
      return res.status(500).send(error)
     }
    });
//get all producsts with pagination
          app.get("/allproducts", async (req, res) => {
               try {
                const page = parseInt(req.query.page);
               const size = parseInt(req.query.size);
                const query=  {};
               const cursor = medicalItemsCollection.find(query).project({name:1,price:1,previcePrice:1,status:1,image1:1,catagory:1});
               const count =await cursor.count()
              let products;
          if(page || size){
            products = await cursor.skip(page*size).limit(size).sort({previcePrice:-1}).toArray();
          }else{
          products=await cursor.toArray();
          }
          // dont delete 
          // res.send({count,products,allProducts});
          res.send({count,products});
               } catch (error) {
                return res.status(500).send(error)
               }
             });
// all product count 
           app.get('/productCount',async(req,res)=>{
            try {
              const count=await medicalItemsCollection.countDocuments();
            res.send({count})
            } catch (error) {
              return res.status(500).send(error)
            }
           })
// add a product 
          app.post("/product",async(req, res)=> {
              try {
                const data = req.body;
                const result = await medicalItemsCollection.insertOne(data);
                res.send(result);
              } catch (error) {
                return res.status(500).send(error)
              }
          });
// delete a products
        app.delete("/product/:id", async (req, res) => {
         try {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) };
          const result = await medicalItemsCollection.deleteOne(filter);
          res.send(result);
         } catch (error) {
          return res.status(500).send(error)
         }
        });
// update a product 
          app.put('/product/:id', async (req, res) => {
            try {
              const id = req.params.id;
            const updateProduct = req.body;
            console.log(req.body);
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                  name: updateProduct.name,
                  price: updateProduct.price,
                  previcePrice: updateProduct.previcePrice,
                  catagory:updateProduct.catagory,
                  details:updateProduct.details,
                  brand:updateProduct.brand,
                  keywords:updateProduct.keywords,
                  status:updateProduct.status,
                  image1:updateProduct.image1,
                  image2:updateProduct.image2,
                  image3:updateProduct.image3,
                },
              };
            const result = await medicalItemsCollection.updateOne(filter, updateDoc, options)
            console.log('updating', id)
            res.json(result)
            } catch (error) {
              return res.status(500).send(error)
            }
        })
// create a contact
app.post("/contact", async (req, res) => {
  try {
    const newContact = req.body;
  console.log("from post api", newContact);
  const result = await ContactCallection.insertOne(newContact);
  res.send(result);
  } catch (error) {
    return res.status(500).send(error)
  }
});
// contact user count 
app.get('/userscontactinfocount',async(req,res)=>{
  try {
    const count=await ContactCallection.countDocuments();
  res.send({count})
  } catch (error) {
    return res.status(500).send(error)
  }
 })
 // search contact by email
 app.get("/contactinfosearch",  async(req, res) => {
  try {
    if(req.query.email!==''){
  const email = req.query.email;
  const query = { email: { $regex: email, $options: 'i' } };
  const cursor = ContactCallection.find(query);
  const result = await cursor.toArray();
  res.send(result);
}
   } catch (error) {
    return res.status(500).send(error)
   }
 });
//  get all users contact with pagination
        app.get("/contact", async (req, res) => {
            try {
             const page = parseInt(req.query.page);
            const {search } = req.query
            const size = parseInt(req.query.size);
             const query=  {};
            const cursor = ContactCallection.find(query);
            const count =await cursor.count()
           let products;
       if(page || size){
         products = await cursor.skip(page*size).limit(size).sort({_id:-1}).toArray();
       }else{
       products=await cursor.toArray();
       }
       res.send({count,products});
            } catch (error) {
             return res.status(500).send(error)
            }
          });
//get single user contac data 
          app.get("/contact/:id", async (req, res) => {
            try {
              const id = req.params.id;
            const filter = { _id: ObjectId(id)};
            const result = await ContactCallection.findOne(filter);
            res.send(result);
            } catch (error) {
              return res.status(500).send(error)
            }
          }
        );
// delete a contact data 
        app.delete("/contact/:id", async (req, res) => {
         try {
          const id = req.params.id;
          const filter = { _id: ObjectId(id) };
          const result = await ContactCallection.deleteOne(filter);
          res.send(result);
         } catch (error) {
          return res.status(500).send(error)
         }
        });

     }
     
     finally {
     }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("hello world");
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});