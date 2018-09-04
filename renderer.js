const Client = require('./client');
let oPort = document.getElementById('j-port');
let oKey = document.getElementById('j-key');
let oButton = document.getElementById('j-button');


oKey.value = "xABjGRfMsjNw6MQRPApshmaZkFQ4DBiK";
oButton.onclick = function(){
	let key = oKey.value;
	let port = oPort.value;

	new Client({key,port});
};

