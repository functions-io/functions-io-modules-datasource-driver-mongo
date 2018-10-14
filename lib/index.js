"use strict";

const crypto = require("crypto");
const MongoClient = require("mongodb").MongoClient;

var cacheClient = {};

module.exports.close = function(){
    var listKeys = Object.keys(cacheClient);
    for (var i = 0; i < listKeys.length; i++){
        try {
            let key = listKeys[i];
            let client = cacheClient[key];
            if (client){
                client.close();
                client = null;
                delete cacheClient[key]
            }            
        }
        catch (errTry) {
            console.error(__filename, errTry);
        }
    }
};

module.exports.getConnect = function(config){
    return new Promise(function (resolve, reject){
        try {
            let client = cacheClient[config.url];
            if (client){
                let db = client.db(config.dataBaseName);
                resolve(db);
            }
            else{
                MongoClient.connect(config.url, config.options, function(errConnect, client){
                    if (errConnect){
                        reject(errConnect);
                    }
                    else{
                        cacheClient[config.db_url] = client;
                        let db = client.db(config.dataBaseName);
                        resolve(db);
                    }
                });                
            }
        }
        catch (errTry) {
            /*
            if (errTry.name === "MongoNetworkError"){
                module.dispose();
            }
            */
            console.error(__filename, errTry);
            reject(errTry);
        }
    });
};