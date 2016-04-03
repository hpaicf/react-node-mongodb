
/* GET home page. */
module.exports=function (app) {
	
app.get('/', function(req, res, next) { 
	res.render("index",{ 
		title : "react-note" 
	});
});

//页面初始化
app.get('/init', function(req,res,next){
	console.log("进入init");
	/*请求参数，相应参数和负责把错误信息运送出来的next参数*/ 
	var commentsModel=global.dbHandle.getModel('comments');/*获取note数据库模型，模型能直接对数据库进行操作*/
	commentsModel.find({},function(err,comments){ 
		if(err){ 
			return next(err); 
		}else{ 
			res.json(comments); //返回json格式的数据
		} 
	});              
});

// 添加笔记记录
app.post('/addNote', function(req,res,next){
	console.log("进入add"); 
	var newuser=req.body.user;
	var newcomment=req.body.comment;
	var date=new Date();
	var noteModel=global.dbHandle.getModel("comments");
	noteModel.create({
		user:newuser,
		comment:newcomment,
		date:date.toLocaleString()
	},function(err){
		if(err){ 
			console.log(err)
			return next(err); 
		}else{ 
			console.log("笔记已经成功写入数据库啦！！！"); 
			noteModel.find({},function(err,notes){ //添加之后  返回整个 笔记记录
				if(err){ 
					console.log("咦？是怎么回事呢？"); 
				}else{ 
					res.json(notes);
				} 
			});
		} 
	});
}); 

// 删除记录
app.post('/deleteNote', function(req,res,next){ 
	var delete_date=req.body.date;
	console.log(delete_date);
	var noteModel=global.dbHandle.getModel("comments");//根据时间来删除  准确
	
    noteModel.remove({date:delete_date},function(err,results){ 
		if(err){ 
			return next(err);/*错误的话，把错误给运出来*/
		}
		else{ 
			console.log("笔记已经被你残忍的给删除了啊..."+results);
			noteModel.find({},function(err,notes){ 
				if(err){ 
					console.log("明明已经删除了啊...?");
				}else{ 
					console.log(notes);
					res.json(notes); 
				}
			}); 
		}
	}); 
});

}