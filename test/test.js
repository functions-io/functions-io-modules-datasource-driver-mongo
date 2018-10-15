"use strict";

const assert = require("assert");
const moduleTest = require("../");

var config = {
    url : "mongodb://localhost:27017",
    options:{
        useNewUrlParser:true
    },
    database: "security"
}

moduleTest.getDataSource(config).then(function(db){
    db.collection("user").findOne({name:"admin"}).then(function(record){
        try {
            assert.strictEqual(record.name, "admin");
        }
        finally{
            moduleTest.close();
        }
    });
}, function(err){
    moduleTest.close();
    console.log("err! ", err);
})