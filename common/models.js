
// 保存各个集合的Schema文件(集合属性)
// 便于我们查看和访问
// 
module.exports={
	comments : { 
		user : { type : String , required : true }, 
		comment : { type : String , required : true }, 
		date : { type : String , required : true }
    }
};