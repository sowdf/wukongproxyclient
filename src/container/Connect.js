 /*
  * by caozhihui
  * create 2018/8/29
  * contact ： caozhihui@4399inc.com
  * 连接
  */
 import React, { Component } from 'react';
 import model from '../Model';
 
 class Connect extends Component {
     render() {
         let {} = this.props;
         let {data} = model;
         return (
             <div className="m_connect">
				 <p>
					 请输入端口：如(8080)
				 </p>
				 <div>
					 <input type="text"/>
					 <button>确定</button>
				 </div>
				 <p>
					 您的http地址是
				 </p>
				 <div>
					 <input type="text"/>
					 <button>确定</button>
				 </div>
				 <p>
					 您的https地址是
				 </p>
				 <div>
					 <input type="text"/>
					 <button>复制</button>
				 </div>
			 </div>
         );
     }
 }
 
 export default Connect;
