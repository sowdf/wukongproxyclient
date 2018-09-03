let net = window.require('net');
let io = window.require('socket.io-client');
let request = window.require('request');
const serverHost = "http://120.24.169.84";
//const serverHost = "http://localhost";
const serverPort = "3839";


class Client{
    constructor({key,port}){
        this.listenPort = port;
        console.log(port,key);
        this.getHost(key);
    }
    getHost(key){
        request.get(serverHost + ':4001/client/getHost?key='+key,(err,response,body)=>{
            if(err){
                console.log(err);
                return false;
            }
            console.log(body);
            let {code,result,message} = JSON.parse(body);
            if(code === 100){
                let {host} = result;
                this.connect(host,key);
                alert(`您的访问域名：http://${host}.sowdf.com:3737`);
            }
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


export default Client;
