/*react小demo  
  测试一个评论功能  提交表单，ajax请求数据 改变渲染真实dom  例子中使用ES6语法糖
  展示所有评论的界面
  发布评论的表单
  后端 API 接口地址，该接口暂时用node实现*/

class Comment extends React.Component{

   
  deleteHandleComment(e){
      e.preventDefault();//因为提交表单的时候浏览器会刷新，所以在这里就阻止浏览器默认事件
      // 提交给父组件 改变state
      this.props.onDelete({date:this.props.date.toLocaleString()});//表示调用  调用这个组件的是传入的props方法 也就是Commentbox里的子组件的props  onSubmit方法
  }
 
  
  render(){
       return (
         <div className="comment">
           
            <div className="comment-user">
               用户:
               {this.props.user}
               <span className="cDate">时间:{this.props.date.toLocaleString()}</span>
            </div>
             <div className="comment-body">
              评论:
              {this.props.children}
            </div>
            <div className="delete">
              <a href="javascript:;" onClick={e=>{this.deleteHandleComment(e)}}>删除</a>
            </div>
         </div>

       );
   }
} 

//为了比较dom不同的地方，react只是渲染不同的地方，是根据react dom diff算法来的  这样就只是渲染不同的地方，大大提高了性能
// 静态测试数据设置
// var comments=[
//    {author:"chenfeng",body:"this is comment"}   
// ];

// var other=[
//    {author:"chenfeng",body:"this is comment"},
//    {author:"a",body:"this is comment"},
//    {author:"c",body:"this is comment"},
//    {author:"s",body:"this is comment"}
// ];

class CommentList extends React.Component{
  
  constructor(props){
      super();
      this.state={
         comments:props.comments||[]
      };
     
   }

  // 删除评价
  deleteComment(date){
    console.log("时间"+this.props.date);
     $.ajax({
        url:this.props.deleteurl,
        datatype:"json",
        type:"post",
        data:{date:this.props.date},
        success:comment=>{
           console.log("success");
           this.setState({comments:comment});
        },
        error:(xhr,status,err)=>{
          console.log(err.toString());
          //但是如果评论失败了  则之前就没有东西   所以就要回滚到以前的
          this.setState({comments:comments})  
        }
     })
  }

  render(){
      // console.log(this.props);
      var commentsnode=this.props.comments.map(function(comments,index) {
         return <Comment user={comments.user} key={'comments'+index} date={comments.date} onDelete={date=>this.deleteComment(date)} >{comments.comment} </Comment>
      });
       return (
         <div className="comment-list">
           {commentsnode}
         </div>
       );
   }
} 


class CommentForm extends React.Component{

  handleSubmit(e){
      e.preventDefault();//因为提交表单的时候浏览器会刷新，所以在这里就阻止浏览器默认事件
      
      //this.refs是react内置的一个对象，真实的dom对象  用getDOMNode  表示获取这个对象  用value就是获取对象的值
      //用trim 表示去掉前后的空格
      const user=this.refs.user.getDOMNode().value.trim();
      const comment=this.refs.comment.getDOMNode().value.trim();
      //拿到表单的对象  是需要重置表单
      const form=this.refs.form.getDOMNode();
      console.log(form);
      //拿到了页面上表单的值  就提交给服务器
      this.props.onSubmit({user:user,comment:comment});//表示调用  调用这个组件的是传入的props方法 也就是Commentbox里的子组件的props  onSubmit方法
      form.reset();//表单重置
   }


   render(){
       return (
         <form className="comment-form" ref="form" onSubmit={e=>{this.handleSubmit(e)}}>
            <input type="text" placeholder="your name" ref="user" />
            <input type="text" placeholder="your comment" ref="comment" />
            <input type="submit" value="add comment"/>
         </form>
       );
   }
} 


// //es6的箭头函数会默认 给这个函数 加一个.bind(this) 表示绑定到当前的react组件    所以这个函数里面的this就是永远指向当前环境了
// (e1,e2)=>{

// }
//react 如何操作html  dom  用ref来操作实际的dom
class Commentbox extends React.Component{
   
   constructor(props){
      super();
      this.state={
         comments:props.comments||[]
      };
     
   }

   loadDataFormServer(){
      $.ajax({
         url:this.props.initurl,
         datatype:"json",
         type:"get",
         success:(comments)=>{
            this.setState({comments:comments});
         },
         error:(xhr,status,err)=>{
            console.log(err.toString());
         }
      });
   }

   //当已经渲染了  dom已经完成渲染的时候  调用这个方法
   componentDidMount(){
      this.loadDataFormServer();
   }

   // 添加数据
   handleNewComment(comment){

      /*因为现在的服务器没有这个地址，现在请求地址是静态的  不能处理post  所以就先虚拟数据
        这里的提交是延迟提交的方式，也就是假设提交成功了，直接就渲染刷新改变的dom   再去请求ajax  如果失败了再做相应处理，成功了那就是成功了
        有时候在加载渲染dom的时候会延迟时间  一般会加load  但是我们可以通过React  延迟更新的方式  因为react只是重新渲染改变的地方，所以我们可以先自己随便一个数据马上渲染dom   然后在请求服务器成功之后再刷新改变dom
        所以可以不等ajax请求直接成功  放在服务器  可以直接渲染   这样就不需要load加载这个动作，可以先假设已经成功了，再让服务器
        这种做法可以用在评论*/

      // const comments=this.state.comments;
      // const newComments=comments.concat([comment]);//concat是连接两个或者多个字符串
      // this.setState({comments:newComments});
      
      $.ajax({
        url:this.props.addurl,
        datatype:"json",
        type:"post",
        data:comment,
        success:comment=>{
          this.setState({comments:comment})
        },
        error:(xhr,status,err)=>{
          console.log(err.toString());
          //但是如果评论失败了  则之前就没有东西   所以就要回滚到以前的
          this.setState({comments:comments})  
        }
     })
   }

  

   render(){
       return (
         <div className="comment-box">
            <h1>react demo 评论测试</h1>
            <CommentList comments={this.state.comments} deleteurl={this.props.deleteurl} />
            
            <CommentForm onSubmit={comment=>this.handleNewComment(comment)}/>
         </div>

       );
   }
}
box=React.render(
   <Commentbox addurl="/addNote"  initurl="/init"  deleteurl="/deleteNote" />,
    document.getElementById('wrap')
); 
