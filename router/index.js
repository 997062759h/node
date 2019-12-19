var express = require("express")
var router = express.Router();
var db = require("../db")


var ser = express();

//解决跨域
router.all("*", (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Method", "get,patch,post,delete,put,option")
    next()
})

//歌手的数据接口
router.get("/hotdoor",function(req,res){
    db.find("hotdoor", {},(err2,data2)=>{
        if(err2) throw err2;
        res.send({
            dara:data2
        })
    })
})
//歌单的数据接口
router.post("/addqwe",(req,res)=>{
    for(let i=0;i<req.body.list.length;i++){
        db.add("playlist",req.body.list[i],(err)=>{
            if(err) throw err
            else{
               res.send({
                   "msg":"添加成功"
               })
            }
        })
    }
})

router.post("/page",(req,res)=>{
    db.find("playlist",{},(err,data1)=>{
        db.findlimit("playlist",{},req.body.skip*35,35,(err,data)=>{
            if (err) throw err
            else {
                res.send({
                    data: data,
                    num:data1.length
                })
            }
        })
    })
})
router.post("/list",(req,res)=>{
    db.find("playlist",{},(err,data1)=>{
            if (err) throw err
            else {
                res.send({
                    data: data1,
                    num:data1.length
                })
            }
    })
})
//获取排行榜的数据
router.get("/toplist",function(req,res){
    db.find("toplists", {},(err2,data2)=>{
        if(err2) throw err2;
        res.send({
            dara:data2
        })
    })
})


//--------------------------------------------------------------
//注册
router.post("/reg", function (req, res) {
    // res.send('login!')
    /* 
    1.利用手机号去数据库进行查询，判断该用户是否注册过
    2.如果未注册，则提示用户注册
    3.注册则进行登录
    4.登录时还要判断用户名或密码是否正确
    */
    // console.log(req.body.pic)

   
    db.find("student",{},(err1,data1)=>{
        if(err1)  throw err1 
    db.find("student", { username: req.body.username }, (err, data) => {
        if (err) throw err;
        else {
            if (data.length != 0) {
                // res.render("../public/deng.html", { list: data })
                res.send({
                    status: 1,
                    msg: "该用户已经存在"
                })
            }
            else if (data.length == 0) {
                //注册
                var info = {
                    username: req.body.username,
                    password: req.body.password,
                    email: req.body.email,
                    phone: req.body.phone,
                    createAt: new Date(),
                    updateAt: new Date(),
                    cishu:++data1.length,
                    isDelete: 0
                }
                db.add("student", info, (err) => {
                    if (err) throw err;
                    //   db.find("user1", {},(err2,data2)=>{
                    //     res.render("../public/deng.html", { list: data2 })
                    //   })
                    res.send({
                        status: 2,
                        msg: "注册成功"
                    })
                })
            }
        }
    })
})

})

//登陆
router.post("/login", function (req, res) {
    // res.send('login!')
    /* 
    1.利用手机号去数据库进行查询，判断该用户是否注册过
    2.如果未注册，则提示用户注册
    3.注册则进行登录
    4.登录时还要判断用户名或密码是否正确
    */
    //    console.log(req.body.username)
    var str =  `ABCDEFGHIJKLMNOPQRSTUVW123456890`
    var RanddomNum =  function(min,max){
       return Math.ceil(Math.random()*(max-min)+min);
    }
    var  result = "";
    for(var i = 0 ; i < 4; i++){
        result += str[RanddomNum(0,str.length-1)]
    }
    db.find("student", { username: req.body.username }, (err, data) => {
        if (err) throw err;
        else {
            if (data.length == 0) {
                res.send({
                    status: 0,
                    msg: "该用户未注册"
                })
            }
            else {
                //登陆
                if (data[0].username == req.body.username && data[0].password == req.body.password) {
                    //设置cookies判断登陆
                    var obj = req.body.username;
                    //req.cookies = cookiena
                    //maxAge 过期时长
                    //httpOnly 只允许在服务器修改cookie
                    //signed 是否生成签名  domain 域名  secure
                    res.cookie("username", obj, { maxAge: 9000000, httpOnly: true })
                    res.send({
                        status: 1,
                        msg: "登录成功",
                        result:result
                    })
                }
                else {
                    res.send({
                        status: 2,
                        msg: "用户名或密码错误"
                    })
                }
            }
        }
    })
})

//增加数据
router.post("/add", function (req, res) {
    db.find("user1", {}, (err2, data3) => {
        if (err2) throw err2
        var info = {
            name: req.body.name,
            sex: req.body.sex,
            age: req.body.age,
            adress: req.body.adress,
            toforId: ++data3.length,
            createAt: new Date(),
            updateAt: new Date(),
            isDelete: 0
        }
        db.add("user1", info, (err) => {
            if (err) throw err;
            res.send({
                status: 1,
                msg: "添加成功"
            })
        })
    })
})
//查找
router.get("/find",function (req, res) {
        db.find("user1", {},(err2,data2)=>{
          if(err2) throw err2;
          res.render("../public/deng.html", { 
              list : data2,
              cookies1:{
                 name: req.cookies.username
              }
           })
          // res.send(req.cookies.username)
      })
})

//删除
router.post("/del",(req,res)=>{
    db.del("user1",{"toforId": parseInt(req.body.toforId) },(err)=>{
        if(err) throw err;
        res.send({
            status: 1,
            msg: "删除成功"
        })
    })
})

//查看用户信息
router.post("/findHu",(req,res)=>{
    /*
    获取已登陆的状态
    利用缓存下的用户进行数据库查询
    返回对应的用户信息
    */ 
    db.find("student",{username:req.body.username},(err,data)=>{
        if(err) throw err
        else{
            res.send({
                status:1,
                data:data[0]
            })
        }
    })
})

router.get("/findHu",(req,res)=>{
    db.find("student",{username:req.cookies.username},(err,data)=>{
        if(err) throw err
        else{
    res.render("../public/xinxi.html", { 
        list : data,
        username:{
        aa: req.cookies.username
        }
     })
    }
    })
})

//退出登陆
router.post("/tuei",(req,res)=>{
    var obj = req.body.username;
    res.cookie("username", obj, { maxAge: -1, httpOnly: true })
    db.find("student",{username:req.body.username},(err,data)=>{
        if(err) throw err
        else{
            res.send({
                status:1,
                data:data[0]
            })
        }
    })
})

//删除用户
router.post("/shan",(req,res)=>{
    db.del("student",{"cishu": parseInt(req.body.cishu) },(err)=>{
        if(err) throw err;
        res.send({
            status: 1,
            msg: "删除成功"
        })
    })
})

//查找用户

router.post("/chazhao",(req,res)=>{
    db.find("user1",{name:req.body.name},(err,data)=>{
        if(err) throw err
        else{
            if(data.length == 0){
                res.send({
                    status:0,
                    title:"没有该用户"
                })
            }else{
                res.send({
                    status:1,
                    title:"已有该用户"
                })
            }
           
        }
    })
})
router.get("/chazhao",(req,res)=>{
    db.find("user1",{name:req.query.name},(err,data)=>{
        if(err) throw err
        else{
            res.render("../public/chazhao.html", { 
                list : data
             })
        }
    })
   
})

module.exports = router