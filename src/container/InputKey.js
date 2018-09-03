/*
 * by caozhihui
 * create 2018/8/29
 * contact ： caozhihui@4399inc.com
 * 输入key
 */
import React, {Component} from 'react';
import model from '../Model';

class InputKey extends Component {
	render() {
		let {} = this.props;
		let {data} = model;
		return (
			<div className="m_inputKey">
				<div className="box">
					<p>请输入您的Key</p>
					<input type="text" placeholder="请输入您的Key"/>
					<button>确认</button>
					<a href="http://www.baidu.com">
						<i></i><span>如何获取Key→</span>
					</a>
				</div>
			</div>
		);
	}
}

export default InputKey;
