const express = require("express");
const fs=require("fs")

const app = express();

let server = app.listen(8080, () => {
  console.log("listening");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pathToProducts = "files/products.json";

app.post("/api/productos", async (req, res) => {
  try{
  let product = req.body;
  if (fs.existsSync(pathToProducts)) {
    const data = await fs.promises.readFile(pathToProducts, "utf-8");
    let productArray = JSON.parse(data);
    let idd = productArray[productArray.length - 1].id;
    product.id = idd + 1;
    productArray.push(product);
    await fs.promises.writeFile(
      pathToProducts,
      JSON.stringify(productArray, null, 2)
    );
    res.status(200).send({ message: "product created succesufully" });
  } else {
    product.id = 1;
    await fs.promises.writeFile(
      pathToProducts,
      JSON.stringify([product], null, 2)
    );
    res.status(200).send({ message: "product created succesufully" });
  }
}catch(err){res.status(400).send({error:err})}
});

app.get("/api/productos",async(req,res)=>{
  try{
    if(fs.existsSync(pathToProducts)){
      const data=await fs.promises.readFile(pathToProducts,"utf-8")
      let products=JSON.parse(data)
      res.status(200).send(products)
    }else{
      res.send("there aren't products")
    }
  }catch(err){res.status(400).send({error:err})}
})

app.get("/api/productos/:id",async(req,res)=>{
  try{
    if (isNaN(req.params.id)) {
      res.status(400).send({ error: "not a number" });
    } else {
      if (!fs.existsSync(pathToProducts)) {
        res.send("there aren't products");
      }
      try {
        let data = await fs.promises.readFile(pathToProducts, "utf-8");
        let products = JSON.parse(data);
        let idd = req.params.id;
        let filteredProduct = products.filter((p) => p.id == idd);
        if (filteredProduct == "[]"||filteredProduct==null) {
          res.status(400).send({ message: "this product doesn't exist" });
        }
        res.status(200).send(filteredProduct)
      } catch (err) {
        return err;
      }      
    }
  }catch(err){
    res.status(400).send({error:err})
  }
})

app.put("api/productos/:id",async(req,res)=>{
  try{
    let data = await fs.promises.readFile(pathToProducts, "utf-8");
    let productArray = JSON.parse(data);
    if (isNaN(req.params.id)) {
      res.status(400).send({ error: "not a number" });
    }
    if (req.params.id < 1) {
      res.status(400).send({ message: "out of bounds" });
    }
    let index = productArray.findIndex((u) => u.id == req.params.id);
    if (index == -1) {
      res
        .status(400)
        .send({ message: "it doesn't exist a product with this id" });
    }
    productArray.splice(index, 1);
    let product=req.body
    product.id=req.params.id
    productArray.push(product)
    res.status(200).send({message:"product updated succesfuly"})
  }catch(err){

  }
})

app.delete("api/productos/:id", async (req, res) => {
  try{
    let data = await fs.promises.readFile(pathToProducts, "utf-8");
    let productArray = JSON.parse(data);
    if (isNaN(req.params.id)) {
      res.status(400).send({ error: "not a number" });
    }
    if (req.params.id < 1) {
      res.status(400).send({ message: "out of bounds" });
    }
    let index = productArray.findIndex((u) => u.id == req.params.id);
    if (index == -1) {
      res
        .status(400)
        .send({ message: "it doesn't exist a product with this id" });
    }
    productArray.splice(index, 1);
    fs.promises.writeFile(pathToProducts, JSON.stringify(productArray, null, 2));
    res.status(200).send({ message: "product delated succesfuly" });
  }catch(err){
    res.status(400).send({error:err})
  }

});