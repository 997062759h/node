var express = require("express");
var path = require("path")
var app = express();

//配置路由
var router = require("./router")


var bodyParser = require("body-parser")
//处理json
app.use(bodyParser.json())
//处理字符串
app.use(bodyParser.urlencoded({ extended: false }))

//静态资源
var static = path.resolve(__dirname,"public")
app.use(express.static(static))


app.use(router)

app.listen(5000)