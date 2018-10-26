const {app, BrowserWindow,Menu,MenuItem} = require('electron');
const pkg = require('./package.json'); // 引用package.json
const url = require('url');
const path = require('path');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
	// 创建浏览器窗口。
	win = new BrowserWindow({width: 420, height: 600});

	if (process.platform === 'darwin') {
		const template = [
			{
				label: "Application",
				submenu: [
					{ label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
				]
			},
			{
				label: "Edit",
				submenu: [
					{ label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
					{ label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
				]
			}
		];
		Menu.setApplicationMenu(Menu.buildFromTemplate(template))
	} else {
		Menu.setApplicationMenu(null)
	}

	// 然后加载应用的 index.html。
	//win.loadFile('http://localhost:3000');
	//win.loadFile('index.html')
	//win.loadURL("http://localhost:3000/");
	if(pkg.DEV){
		win.loadURL("http://localhost:3000/")
		// 打开开发者工具
		win.webContents.openDevTools();
	}else{
		win.loadURL(url.format({
			pathname: path.join(__dirname, './build/index.html'),
			protocol: 'file:',
			slashes: true
		}))
	}



	// 当 window 被关闭，这个事件会被触发。
	win.on('closed', () => {
		// 取消引用 window 对象，如果你的应用支持多窗口的话，
		// 通常会把多个 window 对象存放在一个数组里面，
		// 与此同时，你应该删除相应的元素。
		win = null
	})
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
	// 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
	// 否则绝大部分应用及其菜单栏会保持激活。
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// 在macOS上，当单击dock图标并且没有其他窗口打开时，
	// 通常在应用程序中重新创建一个窗口。
	if (win === null) {
		createWindow()
	}
})
