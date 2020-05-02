const express= require('express');
const cors = require('cors');
const mysql = require('mysql')
const bodyparser=require('body-parser');

const app = express();
app.use(bodyparser.json());

const SELECT_ALL_PRODUCTS_QUERY ='SELECT * FROM FS_REL_Fundamentals_AsReported';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'products',
    multipleStatements: true,
})
console.dir(connection.threadId)


connection.connect(err => {
    if(err){
        return err;
    }
})

app.use(cors());

app.get('/',(req,res)=>{
    console.log('go to /products to see products')
});

app.get('/products/add',(req, res)=> {
    const {name, price} = req.query;
    const INSERT_PRODUCTS_QUERY =`INSERT INTO products (name, price) VALUES ('${name}', ${price})`
    connection.query(INSERT_PRODUCTS_QUERY, (err,results)=> {
        if(err){
            return res.send(err)
        }
        else{
            return res.send('sucessfully added products')
        }
    })
})


    
app.get('/products',(req,res)=> {

    connection.query(SELECT_ALL_PRODUCTS_QUERY,(err,results)=>{
        if(err){
            return res.send(err)
        }
        else{
            return res.json({
                data: results
            })
        }
        });
})
app.get('/products/:id',(req, res)=> {
    const SELECT_SPECIFIC_ID =`SELECT * FROM products WHERE products_id = ?`
    connection.query(SELECT_SPECIFIC_ID,[req.params.id], (err,results)=> {
        if(err){
            return res.send(err)
        }
        else{
            return res.json({
                data: results
            })
        }
    })
})
app.delete('/products/:id',(req, res)=> {
    const DELETE_SPECIFIC_ID =`DELETE FROM products WHERE products_id = ?`
    connection.query(DELETE_SPECIFIC_ID,[req.params.id], (err,results)=> {
        if(err){
            return res.send(err)
        }
        else{
            return res.send('Product Deleted Sucessfully')
        }
    })
})
app.put('/products/update',(req,res)=> {
    let prod = req.body
    const UPDATE_DATA =`UPDATE products SET name=('${prod.name}'),price=(${ prod.price}) WHERE products_id=('${prod.products_id}')`
    connection.query(UPDATE_DATA,(err,results)=>{
        if(err){
            return res.send(err)
        }
        else{
            return res.json({
                data: results
            })
        }
        });
})
    

app.listen(5000,()=>{
    console.log('Products server listener on port 5000')
});