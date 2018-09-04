 /*
  * by caozhihui
  * create 2018/8/29
  * contact ： caozhihui@4399inc.com
  * 连接
  */
 import React, { Component } from 'react';
 import model from '../Model';
 
 class Connect extends Component {
	 connectHandle(){
	 	let port = this.input.value;
	 	model.connect(model.key,port);
	 }
     render() {
         let {} = this.props;
         let {data,httpAddress} = model;
         return (
             <div className="m_connect">
				 <p>
					 请输入端口：如(8080)
				 </p>
				 <div>
					 <input type="text" ref={(input)=>{this.input = input;}}/>
					 <button onClick={this.connectHandle.bind(this)}>确定</button>
				 </div>
				 <p>
					 您的http地址是
				 </p>
				 <div>
					 <input type="text" value={httpAddress}/>
					 <button>复制</button>
				 </div>
				{/* <p>
					 您的https地址是
				 </p>
				 <div>
					 <input type="text"/>
					 <button>复制</button>
				 </div>*/}
			 </div>
         );
     }
 }
 
 export default Connect;
