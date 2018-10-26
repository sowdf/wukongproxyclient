let net = window.require('net');
let io = window.require('socket.io-client');
let request = window.require('request');
const {shell} = window.require('electron');
//const host = "http://localhost:4001";
//const serverHost = "http://localhost";

const {host,serverHost,serverPort} = require('./config.js');

class Client {
	constructor(key,port,callback) {
		//this.port = readlineSync.question('请输入转发的本地端口(8080):');
		//this.token = readlineSync.question('请输入授权码(token):');
		this.key = key;
		this.port = port;
		this.callback = callback || function(){};
		this.getHost();
	}
	getHost(){
		request.get(`${host}/client/getHost?key=${this.key}`,(err,response,body)=>{
			if(err){
				console.log(err);
				return false;
			}

			let {code,result,message} = JSON.parse(body);
			if(code === 100){
				let {host} = result;
				this.host = host;
				this.init();
				this.callback(JSON.parse(body));
				return console.log(`您的访问域名：http://${host}.wkdl.ltd`);
			}
			console.log(message);
		})
	}
	init(){
		this.socket = io(serverHost, {
			query: {
				host: this.host,
				key : this.key
			}
		});
		this.clients = {};

		this.start();
	}
	connectSuccess(){

	}
	start() {
		this.socket.on('connect', () => {
			this.connectSuccess();
			console.log('server connected (连接成功)');
		});
		this.socket.on('request', data => {
			if (!data.addr) {
				return;
			}
			let addr = data.addr;
			if (!this.clients[addr]) {
				this.clients[addr] = new net.Socket();
				this.clients[addr].connect(this.port, '127.0.0.1', () => {
					this.clients[addr].write(data.buffer);
				});

				this.clients[addr].on('data', (buffer) => {
					this.socket.emit('response', {
						addr: addr,
						buffer: buffer
					})
				});
				let end = () => {
					this.socket.emit('response/end', {
						addr: addr,
						buffer: null
					});
					if (this.clients[addr]) {
						delete this.clients[addr];
					}
				};
				this.clients[addr].on('end', end);
				this.clients[addr].on('close', end);
				this.clients[addr].on('error', end);
			} else {
				this.clients[addr].write(data.buffer);
			}
		});
		this.socket.on('close', message => {
			console.log(message);
			this.socket.close();
			process.exit(1);
		});
		this.socket.on('disconnect', () => {
			this.clients = {}
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
		let client = new Client(key,port,(data)=>{
			let {code,message,result} = data;
			console.log(data);
			if(code == 100){
				this.httpAddress = result.http;
			}
			this.toast(message);
			this.render();
		})
		client.connectSuccess =  ()=>{
			this.toast('连接成功～～～')
		}
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
		this.interface.openLink('http://www.wkdl.ltd');
	}


}

export default new Model();
