let net = window.require('net');
let io = window.require('socket.io-client');
let request = window.require('request');
const {shell} = window.require('electron');
const host = "http://www.sowdf.com";
//const host = "http://localhost:4001";
const serverHost = "http://service.sowdf.com";
//const serverHost = "http://localhost";
const serverPort = "80";


class Client{
	constructor(key,port,callback){
		this.listenPort = port;
		this.callback = callback ||function(){};
		console.log(port,key);
		this.getHost(key);
	}
	getHost(key){
		request.get(host + '/client/getHost?key='+key,(err,response,body)=>{
			if(err){
				console.log(err);
				return false;
			}
			console.log(body);
			let {code,result,message} = JSON.parse(body);
			if(code === 100){
				let {host} = result;
				this.connect(host,key);
			}
			this.callback(JSON.parse(body));
			return console.log(message);
		})
	}
	connect(host,key){
		//var socket = io('http://120.24.169.84:3838');
		let socket = io(`${serverHost}:${serverPort}?host=${host}&key=${key}`);
		let client = {};

		socket.on('connect', () => {
			console.log('socket.io server connected');

			socket.on('message', data => {
				let {name,buffer} = data;
				let clientFree = client[name];
				if (!name) {
					return;
				}
				if (clientFree) {
					clientFree.write(buffer);
				} else {
					clientFree = new net.Socket();
					clientFree.connect(this.listenPort, '127.0.0.1', function () {
						//写到浏览器
						clientFree.write(buffer);
					});
					clientFree.on('data', function (buf) {
						socket.emit('message', {
							name: name,
							buffer: buf
						})
					});
					clientFree.on('end', () => {
						socket.emit('message/end', {
							name: name,
							buffer: null
						})
					});
					clientFree.on('error', err => {
						console.log(err);
						socket.emit('message/end', {
							name: name,
							buffer: null
						})
					});
				}
			});
		});
	}
}

class Interface {
	constructor(){

	}
	checkKeyIsExist(key,callback){
		request.post(`${host}/client/checkKeyIsExist`,{form:{key:key}},(err,response,body)=>{
			if(err){
				return console.log(err);
			}
			callback && callback(JSON.parse(body));
		});
	}
	openLink(link){
		shell.openExternal(link);
	}
}



class Model {
	constructor(){
		this.eventFree = {};
		this.hasKey = false;
		this.interface = new Interface();
		this.key = this.getKey();
		if(this.key){
			this.hasKey = true;
		}
		this.render();
	}
	/*
	* 连接
	* */
	connect(key,port){
		new Client(key,port,(data)=>{
			let {code,message,result} = data;
			if(code == 100){
				this.httpAddress = result.http;
			}
			this.toast(message);
			this.render();
		})
	}
	/*
     *  发布
     * */
	inform() {
		let event = Array.prototype.shift.call(arguments);
		let fns = this.eventFree[event];

		if (!fns || fns.length === 0) {
			return false;
		}

		for (let i = 0, fn; (fn = fns[i++]); ) {
			fn.apply(this, arguments);
		}
	}
	getKey(){
		return localStorage.keyString;
	}
	saveKey(key){
		localStorage.keyString = key;
	}
	/*
*  订阅
* */
	subscribe(event, fn) {
		if (!this.eventFree[event]) {
			//判断是否存在改event;
			this.eventFree[event] = [];
		}
		this.eventFree[event].push(fn);
	}
	checkKey(key){
		if(!key){
			return this.toast('请输入您的key值～～');
		}
		this.interface.checkKeyIsExist(key,(data)=>{
			let {code,message,result} = data;
			if(code !== 100){
				return this.toast(message);
			}
			this.saveKey(key);
			this.hasKey = true;
			this.key = key;
			this.render();
		});

	}
	render(){
		this.inform('render');
	}
	toast(message){
		this.toastOnOff = true;
		this.toastMessage = message;
		setTimeout(()=>{
			this.toastOnOff = false;
			this.render();
		},2000)
		this.render();
	}
	openRegister(){
		this.interface.openLink('http://www.wkproxy.com');
	}


}

export default new Model();
