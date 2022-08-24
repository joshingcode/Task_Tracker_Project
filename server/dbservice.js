const express = require('express')
const mysql= require('mysql')
const dotenv= require('dotenv')
let instance = null;


// db connect 
 const db =mysql.createConnection({
    host:'localhost',
    user:'devJosh',
    password:process.env.PASS,
    database: 'web_app',
    port:'3306'
 });

 db.connect((err)=>{
    if(err){
        throw err;
    }
    // console.log('MySql Connected...'+ db.state)
 });

 class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();

    }
    async getAllData(){
        try{
            const response = await new Promise((resolve, reject)=>{
                const query="SELECT * FROM names";

                db.query(query,(err,results)=>{
                    if(err) reject(new Error(err.message));
                    resolve(results);
                })
            });
            // console.log(response)
            return response;
        }catch(err){
            console.log(error);
        }
    }
    async insertNewName(name){
        try{
            const dateAdded= new Date();
            const insertId= await new Promise((resolve, reject)=>{
            
                const query="INSERT INTO names (name,date_added) VALUES (?,?);";

                db.query(query,[name, dateAdded],(err,result)=>{
                    if(err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return{
                id: insertId,
                name: name,
                dateAdded: dateAdded
            };
            // return response;
        }catch(error){
            console.log(error);
        }
    }

    async deleteRowById(id) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "DELETE FROM names WHERE id = ?";
    
                db.query(query, [id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    async updateNameById(id, name) {
        try {
            id = parseInt(id, 10); 
            const response = await new Promise((resolve, reject) => {
                const query = "UPDATE names SET name = ? WHERE id = ?";
    
                db.query(query, [name, id] , (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });
    
            return response === 1 ? true : false;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
    async searchByName(name){
        try{
            const response = await new Promise((resolve, reject)=>{
                const query ='SELECT * FROM names WHERE name =?;';
                db.query(query,[name],(err,result)=>{
                    if(err) reject(new Error(err.message));
                    resolve(result)
                })
            });
            return response;
        }catch(err){
            console.log(err)
        }
    }
 }
module.exports = DbService;

// db create

const app = express();

app.get('/createdb',()=>{
    let sql ='CREATE DATABASE web_app';
    db.query(sql, (err,result)=>{
        if(err) throw err 
        console.log(result)
        res.send('database was created');
    });
});

app.get('/createtable',(req,res)=>{
    let sql = 'CREATE TABLE names(id int(10) AUTO_INCREMENT, name VARCHAR(100), date_added DATETIME,PRIMARY KEY (id))'
    db.query(sql,(err,result)=>{
        if(err) throw err 
        console.log(result)
        res.send('table was created. ')
    })
})

// app.listen('3000',()=>{
//     console.log('server is finally started...5000')
// })