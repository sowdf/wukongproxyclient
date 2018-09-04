/*
 * by caozhihui
 * create 2018/9/3
 * contact ： caozhihui@4399inc.com
 * toast
 */
import React, {Component} from 'react';
import model from '../Model';

class Toast extends Component {
	constructor(props) {
		super(props);
		this.lastTimestamp = 0;
	}

	render() {
		let {} = this.props;
		let {toastMessage = "请输入您要提示的语句～～",toastOnOff} = model;
		if(!toastOnOff){
			return false;
		}
		return (
			<div className="m_toast">
				{toastMessage}
			</div>
		);
	}
}

export default Toast;
