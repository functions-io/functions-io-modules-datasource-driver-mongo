"use strict";

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

module.exports.getDataSource = function(config){
    return new Promise(function (resolve, reject){
        try {
            let client = cacheClient[config.url];
            if (client){
                let db = client.db(config.database);
                resolve(db);
            }
            else{
                if (!config.options){
                    config.options = {};
                }
                if (config.options.useNewUrlParser === undefined){
                    config.options.useNewUrlParser = true;
                }
                MongoClient.connect(config.url, config.options, function(errConnect, client){
                    if (errConnect){
                        reject(errConnect);
                    }
                    else{
                        cacheClient[config.db_url] = client;
                        let db = client.db(config.database);
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