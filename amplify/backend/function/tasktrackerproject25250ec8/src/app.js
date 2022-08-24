/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




const express = require('express')
const mysql= require('mysql')
const dotenv= require('dotenv')
const cors=require('cors')
const app= express()

const dbService= require('../../../../../server/dbservice')
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


// create
app.post('/insert',(request,response)=>{
    const { name } = request.body;
    const db=dbService.getDbServiceInstance();
    const result= db.insertNewName(name);
    result 
    .then(data => response.json({data:data} ))
    .catch(err => console.log(err));

});


// read

app.get('/getAll',(request,response)=>{
    const db=dbService.getDbServiceInstance();

    const result = db.getAllData();
    result
    .then(data=> response.json({data:data}))
    .catch(err=>console.log(err));

});

// update
app.patch('/update', (request, response) => {
    const { id, name } = request.body;
    const db = dbService.getDbServiceInstance();

    const result = db.updateNameById(id, name);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});

// delete

app.delete('/delete/:id', (request, response) => {
    const { id } = request.params;
    const db = dbService.getDbServiceInstance();

    const result = db.deleteRowById(id);
    
    result
    .then(data => response.json({success : data}))
    .catch(err => console.log(err));
});


app.get('/search/:name',(request,response)=>{
    const {name} = request.params;
    const db=dbService.getDbServiceInstance();
    const result = db.searchByName(name);
    result
    .then(data=> response.json({data:data}))
    .catch(err=>console.log(err));


})
const port = process.env.PORT || 6000
app.listen('3000',()=>{
    console.log('This server is running!!!')
})

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
