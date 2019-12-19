const {MongoClient}=require("mongodb")
const {url}=require("./setting/url")
function ConnectDB(callback){
    //db数据库
    MongoClient.connect(url,(err,db)=>{
         if(err) throw err
         //创建或使用数据库
         var dbName=db.db("mode")
         callback(db,dbName)
    })
}
exports.add=function(collection,json,callback){
    //如何和connectDB进行连接
    ConnectDB((db,dbName)=>{
        dbName.collection(collection).insert(json,(err)=>{
            callback(err)
            db.close()
        })
    })
}
exports.del=function(collection,json,callback){
    //如何和connectDB进行连接
    ConnectDB((db,dbName)=>{
        dbName.collection(collection).deleteOne(json,(err)=>{
            callback(err)
            db.close()
        })
    })
}
exports.update=function(collection,json,json1,callback){
    //如何和connectDB进行连接
    ConnectDB((db,dbName)=>{
        dbName.collection(collection).update(json,json1,(err)=>{
            callback(err)
            db.close()
        })
    })
}
exports.find=function(collection,json,callback){
    //如何和connectDB进行连接
    ConnectDB((db,dbName)=>{
        dbName.collection(collection).find(json).toArray((err,data)=>{
            callback(err,data)
          db.close()
        })
    })
}


exports.findlimit = function(collection,json,skipNum,limitNum,callback){
    ConnectDB((db,dbName)=>{
        dbName.collection(collection).find(json).skip(skipNum).limit(limitNum).toArray((err,data)=>{
            callback(err,data)
            db.close()
        })
    })
}


// find("student",(err)=>{})