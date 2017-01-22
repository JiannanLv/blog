var express=require('express')
var path=require('path')
var bodyParser=require('body-parser')
var cookieParser=require('cookie-parser')
var session=require('express-session')
var mongoConnect=require('connect-mongo')(session)
var multer  = require('multer')
//var fs = require('fs')
//var logger = require('morgan');
var Server = require('mongodb').Server
var Db = require('mongodb').Db
var mongoDb=new Db('blog', new Server('localhost', 27017, {safe: true}));
var flash = require('connect-flash');
var http=require('http');
//var qs=require('querystring');
app=express()


//var storage = multer.diskStorage({
//destination: function (req, file, cb) {
//  cb(null, './dist/images')
//},
//filename: function (req, file, cb) {
//  console.log("file",file)
//  var date=new Date()
//  var Month=date.getMonth()+1,Seconds=new Date().getSeconds()
//  Month=Month<10?"0"+Month:Month
//  var Hours=date.getHours()<10?"0"+date.getHours():date.getHours()
//  var Minutes=date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes()
//  Seconds=Seconds<10?"0"+Seconds:Seconds
//  date=date.getFullYear() + "" + Month + "" + Hours+""+Minutes+""+Seconds+""
//  var type=(file.originalname).split(".");
//  cb(null, file.fieldname + date+"."+type[type.length - 1])
//}
//});
//
//
//
//var uploadImg = multer({ storage: storage });
//uploadImg=uploadImg.single('upload');

app.use(cookieParser())
app.use(session({
    secret:'myblog',//用来对session数据进行加密的字符串.这个属性值为必须指定的属性。
    key:'blog',//字符串,用于指定用来保存session的cookie名称,默认为coomect.sid.
    cookie:{maxAge: 1000 * 60 * 60 * 24 * 5},
    store:new mongoConnect({//属性值为一个用来保存session数据的第三方存储对象
        url: 'mongodb://localhost/blog'
    })
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(express.static(path.join(__dirname,'dist'),{maxAge:0}));

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:7070');
  res.header('Access-Control-Allow-Headers', 'Content-Type=application/json;charset=UTF-8');
  res.header('Access-Control-Allow-Credentials', true)//支持跨域传cookie
  /* res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');*/
  next();
});
//**********************用户*********************
var User=function(user){
  this.name=user.userName
  this.password=user.password
  this.email=user.email
}
/*保存用户密码*/
User.prototype.save=function(callback){
  var user = {
      name: this.name,
      password: this.password,
      email: this.email
  };
  mongoDb.open(function(err, db){
    if(err){
      return callback(err)
    }
    db.collection('userlist',function(err,collection){
      if(err){
        mongoDb.close();
        return callback(err)
      }
      collection.insert(user,function(err,user){
        mongoDb.close();
        if(err){
          return callback(err)
        }
        callback(null, user)
      })
    })
  })
}

/*获取用户名，防止用户名相同*/
User.prototype.get=function(name,callback){
  mongoDb.open(function(err, db){
    if(err){
      return callback(err)
    }
    db.collection('userlist',function(err,collection){
      if(err){
        mongoDb.close();
        return callback(err)
      }
      collection.findOne({name:name},function(err,user){
        mongoDb.close();
        if(err){
          return callback(err)
        }
        callback(null, user)
      })
    })
  })
}
//*********************文章*********************
var Upload=function(uploadlist){
	this.name=uploadlist.name
  	this.title=uploadlist.title
  	this.neirong=uploadlist.neirong
 	this.upload=uploadlist.upload
}
/*保存文章内容*/
Upload.prototype.save=function(callback){
  var date=new Date()
  var time = {
      date: date,
      year : date.getFullYear(),
      month : date.getFullYear() + "-" + (date.getMonth() + 1),
      day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
      minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
      date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  }
  var upload={
    name:this.name,
    title:this.title,
    neirong:this.neirong,
    upload:this.upload,
    time:time,
    pv: 0
  }
  mongoDb.open(function(err,db){
    db.collection('upload',function(err,collection){
      collection.insert(upload,function(err,upload){
        mongoDb.close();
        callback(null, upload)
      })
    })
  })
}
/*获取文章标题，防止文章标题一样*/
Upload.getTitle=function(title,callback){
  mongoDb.open(function(err,db){
    db.collection('upload',function(err,collection){
      collection.findOne({title:title},function(err,upload){
        console.log("getTitle.upload======>:",upload)
        mongoDb.close();
        callback(null, upload)
      })
    })
  })
}
/*获取文章列表（每次num条）*/
Upload.getList=function(page,callback){
  var num=5;
  mongoDb.open(function(err,db){
  	if(err){
  		return callback(err);
  	}
    db.collection('upload',function(err,collection){
      collection.count({}, function (err, count) {
        collection.find({},{
          limit:num,
          skip:(page-1)*num
        }).sort({
          time: -1
        }).toArray(function(err,list){
          mongoDb.close();
          var page={};
          page["count"]=count;
          page["limitNum"]=num;
          callback(null,list,page)
        })
      });
    });
  });
}
/*获取具体的一篇文章*/
Upload.getOne=function(name,day,title,callback){
  mongoDb.open(function(err,db){
    db.collection('upload',function(err,collection){
      collection.findOne({
        "name":name,
        "time.day":day,
        "title":title
      },function(err,oneDoc){
        if(oneDoc){
            collection.update({
              "name":name,
              "time.day":day,
              "title":title
            },{
              $inc: {"pv": 1}
            },function(err){
              mongoDb.close();
              if (err) {
                return callback(err);
              }
            })
        console.log("oneDoc======>:",oneDoc)
        callback(null, oneDoc)
        }
      })
    })
  })
}
/*插入评论*/
function Comment(name,day,title,comments,callback){
  var date=new Date();
  mongoDb.open(function(err,db){
    db.collection('upload',function(err,collection){
      collection.update({
        "name":name,
        "time.day":day,
        "title":title,
      },{$push:{"comments":comments}},function(err){
        if (err) {
            return callback(err);
        }
        mongoDb.close();
        callback(null)
      })
    })
  })
}
//*************express数据***************
//---获取用户登录信息---
app.get('/getUserInfo', function (req, res) {
  if(req.session.user){
  	console.log("req.session.user" + req.session.user);
    var info={name:req.session.user.name}
    console.log(info);
    return res.json({code:1000,messgage:"已登录",info:info})
  }else{
  	console.log("未登录");
    return res.json({code:1001,messgage:"未登录"})
  }
});
//-----注册-----
app.post('/reg', function (req, res) {
	console.log("注册===>",req)
  var newUser= new User(req.body)
  newUser.get(newUser.name,function(err,user){
    if(err){
      res.end(JSON.stringify({code:1009,messgage:err}))
    }
    if(user){
      res.end(JSON.stringify({code:1002,messgage:'用户名已存在'}))
    }
    newUser.save(function(user){
      res.end(JSON.stringify({code:1000,messgage:'注册成功'}))
    })
  })
});
//-----登录------
app.post('/login', function (req, res) {
  console.log("登录==>",req.body);
  var newUser= new User(req.body)
   newUser.get(newUser.name,function(err,user){
      if(err){
        res.end(JSON.stringify({code:1009,messgage:err}))
      }
      if(user){
        if(user.password==newUser.password){
          req.session.user=user
          var info={name:newUser.name}
          res.end(JSON.stringify({code:1000,messgage:"登录成功",info:info}))
        }else{
          res.end(JSON.stringify({code:1001,messgage:"密码错误"}))
        }
      }else{
        res.end(JSON.stringify({code:1002,messgage:"用户名不存在"}))
      }
   })
});
//---退出登录---
app.get('/loginout', function (req, res) {
  req.session.user = null;
  return res.json({code:1000,messgage:"退出成功"})
});
//****************文章*****************
//-------获取文章-------
app.get('/newsList', function (req, res) {
	console.log("req++++++",req);
	var page=req.query.page || 1;
  	console.log('page+++++',page);
  	Upload.getList(page,function(err,list,page){
    	var data={};
    	data["data"]=list;
    	data["page"]=page;
        res.end(res.json(data));
  	});
});
//------获取某一篇文章--------
app.get('/a/:name/:day/:title', function (req, res) {
  var params=req.params
  Upload.getOne(params.name,params.day,params.title,function(err,oneDoc){
    if(oneDoc){
      res.end(JSON.stringify(oneDoc));
    }else{
      res.end(JSON.stringify({}));
    }
  })
});
//----------发布留言-----------
app.post('/a/:name/:day/:title', function (req, res) {
  var params=req.params;
  var date=new Date();
  var time=date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate()+"   "+date.getHours()+":"+date.getMinutes();
  var comments={
    name:req.body.name,
    email:req.body.email,
    message:req.body.message,
    time:time
  };
  Comment(params.name,params.day,params.title,comments,function(){
    res.end(JSON.stringify({code:1000,message:"留言成功"}));
  })
});
//------------发布文章---------
function checkLogin(req, res, next) {
    if (!req.session.user) {
      return res.json({code:1009,messgage:"您还未登录,请先登录"})
    }
    next();
}
app.post('/publish',checkLogin);
app.post('/publish',function (req, res) {
  console.log("req====>",req.body);
    Upload.getTitle(req.body.title,function(err,title){
      if(title){
        return res.json({code:1002,messgage:"标题已存在"})
      }
      var newUpload=new Upload({
        name:req.session.user.name,
        title:req.body.title,
        neirong:req.body.neirong,
        upload:req.file?"/images/"+req.file.filename:"",
      })
      newUpload.save(function(err){
        return res.json({code:1000,messgage:"发布成功"})
      })
    })
//});
});
//----------关于架构----------
//返回页面
app.get('*',function(req,res){
    var path = __dirname + req.path;
    console.log(path);
    res.sendFile(path);
});
app.listen(8900);