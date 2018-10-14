"use strict";

const moduleTest = require("../lib");

var config = {
    url : "mongodb://localhost:27017",
    options:{
        useNewUrlParser:true
    },
    dataBaseName: "security"
}

moduleTest.getConnect(config).then(function(db){
    db.collection("user").findOne({name:"admin"}).then(function(record){
        console.log(record);

        moduleTest.close();
    });
}, function(err){
    console.log("err! ", err);
})