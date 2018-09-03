/**
 * by caozhihui
 * create date
 * contact ： caozhihui@4399inc.com
 * 用于存放客户端api
 */
class Client {
	/*
    * toast
    * */
	constructor(){
		/*
        * 清除评论星星   这个功能是给客户端回调的
        * 至于说名字为什么那么奇怪 当时定的时候没有定好
        * 在CommentEnter 组件中重新赋值
        * */
		window.startEffect = {
			clearHigh: null
		};
	}

	/*
	* 获取CONFIG 配置信息
	* 4.1 加入的 评论迁移的时候加的
	* */

	/*
	*  获取游戏状态
	*  1 ： 上架
	*  -1 ：下架
	*  11 : 新游开测
	*  12 ： 新游期待
	*  13 ：新游预约
	*  添加版本
	*  4.2 黄家强
	* */
	getConfigInfo(){
		return JSON.parse(
			window.android.getParamJsonString &&
			window.android.getParamJsonString()
		);
	}

	/*
	* 获取测试信息
	* version  模板版本
	* openDebug 是否打开webView调试
	* isDeveloper 是否是开发包
	* */
	getTestInfo(){
		let json = window.android.getTestInfo && window.android.getTestInfo(2);
		json = json || "{}";
		return JSON.parse(json);
	}

	/*
    * toast 提示
    * string 传入要提示的文字
    * */
	toast(){
		window.android && window.android.onJsToShowToast(...arguments);
	}

	/*
	* 清除  评论详情 页面 输入框的输入内容
	* */
	claerInputEditText(){
		window.android.resetInputEditText &&
		window.android.resetInputEditText();
	}

	/*
	* 获取网络状
	* */
	getNetworkStatus(){
		return (
			window.android.onJsGetIsNetworkAvalible &&
			window.android.onJsGetIsNetworkAvalible()
		);
	}

	/*
    * 数据请求
    *
    * {
    *  requestTips : '评论删除中',
       url : "service/android/v1.0/comment-deleteComment.html",
       data : {cid:cid,type:"game"},
       type : "post",
       success : "delCommentSuccessCallback",
       error : "delErrorCallback",
       action : "comment_del",
       from : 'comment_list_all'
    * }
    * requestTips 请求的时候提示
    * data 你也好发送的数据
    * from : 参数
    * 1.comment_detail（评论详情页）
      2.comment_list（游戏简介评论块）
      3.comment_list_all（游戏评论TAB）
      4.comment_list_my（我的评论TAB）
    * */
	request(json, successCallback, errorCallback){
		if (!this.getNetworkStatus()) {
			this.toast("当前网络不给力，请检查您的网络");
			return errorCallback(-103);
		}
		let timeStamp = new Date().getTime();
		let _errorCallback = errorCallback;
		errorCallback = (code, result, message) =>{
			_errorCallback(code, result, message);
		};
		json.success = `successCb${timeStamp}`;
		json.error = `errorCb${timeStamp}`;
		window[`successCb${timeStamp}`] = successCallback || function (){
		};
		window[`errorCb${timeStamp}`] = errorCallback || function (){
		};
		window.android.replyRequest &&
		window.android.replyRequest(JSON.stringify(json));
	}

	/*
    * 跳转我的全部评论 页面
    * */
	jumpMyAllComments(){
		window.android.openCommentMyList && window.android.openCommentMyList();
	}

	/*
    * 友盟统计
    * */
	tjUMengEvent(){
		window.android.onJsUMengEvent &&
		window.android.onJsUMengEvent(...arguments);
	}

	/*.

    * 跳转评论详情接口
    * */
	jumpCommentDetail(json){
		if (!this.getNetworkStatus()) {
			return this.toast("当前网络不给力，请检查您的网络");
		}
		if (typeof json !== "object") {
			return false;
		}
		window.android.openCommentDetail &&
		window.android.openCommentDetail(JSON.stringify(json));
	}

	/*
    * 重置webView 高度
    * 这个接口 只有 评论简介tab 才能使用
    * 当有高度变化的时候就需要调用这个接口获取最新的高度
    * */
	resetWebViewHeight(){
		setTimeout(() =>{
			window.android.onExpandComment && window.android.onExpandComment();
		});
	}

	/*
    * 跳转评论tab
    * 传一个数字
    *
    * */
	jumpCommentTab(){
		window.android.jumpToGameDetailTab &&
		window.android.jumpToGameDetailTab("1");
	}

	/*
    * 我要评论
    * 跳转客户端评论输入界面
    * 参数 传入一个json 字符串  要求 传入 rating 星星的数量
    * */
	jumpInputComment(rating){
		let json = { rating: rating };
		window.android.onClickAddComment &&
		window.android.onClickAddComment(JSON.stringify(json));
	}

	/*
    * 获取用户信息
    * 如果没有登录就返回null
    * 登录了就 返回一个json
    * */
	getUserInfo(){
		let userInfo =
			window.login.onLoadUserInfo && window.login.onLoadUserInfo();
		return userInfo == "{}" ? null : JSON.parse(userInfo);
	}

	/*
    * 获取本地游戏最新版本
    * */
	getLatestVersionCode(){
		let latestVersion = window.android.getLatestVersionCode
			? Number(window.android.getLatestVersionCode())
			: 0;
		return latestVersion;
	}

	/*
	* 跳转个人中心 传入uid
	* */
	jumpPersonalCenter(uid){
		window.android.onJsToProfileDetailsByPtUid &&
		window.android.onJsToProfileDetailsByPtUid(uid + "");
	}

	/*
	* getPtUid 获取ptUid
	* */
	getPtUid(){
		return window.android.onJsGetPtUid && window.android.onJsGetPtUid();
	}

	/*
	* 页面加载成功 有调用  会出现键盘
	* */
	onLoadSuccess(type){
		window.android.onLoadSuccess && window.android.onLoadSuccess(type);
	}

	/*
	* 删除弹窗
	* */
	deleteDialog(tips, successCallback, cancelCallback){
		if (this.deleteDialogOnOff) {
			return false;
		}
		this.deleteDialogOnOff = true;
		let timestamp = new Date().getTime();
		let eventName = `delSuccess${timestamp}`;
		let cancelEventName = `cancel${timestamp}`;
		let _successCallback = successCallback;
		let _cancelCallback = cancelCallback;

		successCallback = () =>{
			_successCallback && _successCallback();
		};

		cancelCallback = () =>{
			_cancelCallback && _cancelCallback();
		};

		window[eventName] = successCallback || function (){
		};

		window[cancelEventName] = cancelCallback || function (){
		};

		let data = {
			msg: tips,
			confirm: eventName,
			cancel: cancelEventName
		};
		window.android.dialogBottomDelete &&
		window.android.dialogBottomDelete(JSON.stringify(data));

		setTimeout(() =>{
			this.deleteDialogOnOff = false;
		}, 1000);
	}

	/*
	* 获取本地安装游戏的版本号
	* */
	getLocalGameVersion(){
		return window.android.getInstalledVersionCode
			? window.android.getInstalledVersionCode()
			: 0;
	}

	/*
	* 设置 回复  输入框
	* */
	setReplyInput(message, json){
		window.android.setReplay &&
		window.android.setReplay(message, JSON.stringify(json));
	}

	/*
	* 我的评论条数改变的时候调用   在评论tab 页面
	* 加这个接口的原因 是因为如果有我的评论 那么评论如果就挡住了
	* 这个时候 就用用客户端右下角的 编辑按钮
	* 如果你告诉他有 > 1 条 他就会显示出来
	* */
	myCommentCountChange(count){
		window.android.onMyCommentCountChange &&
		window.android.onMyCommentCountChange(count);
	}

	/*
	* 退出评论详情页面
	* 这个接口做 4.1 的时候加的
	*
	* */
	exitWebView(){
		window.android.finishActivity && window.android.finishActivity();
	}

	/*
	* 跳转到my 圈 帖子详情 页
	* fid tid forumsId
	* */
	jumpMyForums(){
		window.android.onJsToMyForumsPost &&
		window.android.onJsToMyForumsPost(...arguments);
	}

	/*
	* 跳转到bbs 圈 帖子详情 页
	* fid tid forumsId
	* */
	jumpBBSForums(){
		window.android.onJsToForumsTopic &&
		window.android.onJsToForumsTopic(...arguments);
	}

	/*
	* 跳转礼包详情
	* */
	jumpGiftDetail(gid){
		window.android.onJsToGiftDetails &&
		window.android.onJsToGiftDetails(gid);
	}

	/*
	* 跳转 游戏详情
	* */

	jumpGameDetail(gid){
		window.android.onJsToGameDetails &&
		window.android.onJsToGameDetails(gid);
	}

	/*
	* 结构统计
	* */
	structureStatistical(str){
		window.android.onJsStructureEvent && window.android.onJsStructureEvent(str);
	}

	/*
	* 绑定时间
	* */
	bindEvent(eventName, functionName){
		window.login.bindEvent &&
		window.login.bindEvent(eventName, functionName);
	}

	/*
	* 隐藏游戏评论详情页顶部游戏入口
	* 4.3版本添加
	* 添加人：苏俊雄  2018/7/4
	* code: 1 隐藏   0 不隐藏
	* */
	onJsHideGameInfo(code){
		window.android.onJsHideGameInfo &&
		window.android.onJsHideGameInfo(code);
	}

	/*
	* 举报功能
	* 4.2 公测的时候加的
	* 添加人：陈嘉
	* @param json {"comment_id":"275873497","report_nick":"nima","report_content":"sdfe","game_id":"26444"}
	* */
	report(json){
		const createStarStr = num =>{
			let starLight = "★";
			let star = "☆";
			let result = "";
			let count = num;
			for (let i = 0; i < 5; i++) {
				if (count != 0 && i < count) {
					result += starLight;
				} else {
					result += star;
				}
			}
			return result;
		};
		let { star, report_content } = json;
		let template = `
			游戏评分 ：${createStarStr(star)} ${star * 2}分\n${report_content}
		`;

		json.report_template = template;

		window.android.report && window.android.report(JSON.stringify(json));
	}

	/*
	* 更新游戏信息 主要是 评分信息 ， 游戏评论数
	* @param s "{"counts":"10000","score":"2.6"}"
	* 添加版本 ： 4.2 公测
	* 添加人 ： 陈嘉
	* */
	updateGameInfo(count, score){
		let json = { counts: count, score: score };
		window.android.updateGameInfo &&
		window.android.updateGameInfo(JSON.stringify(json));
	}

	/*
	* 评论分享接口
	*{
    "rating":3.5,
    "nick":"无敌胖",
    "avatar":"http://a.img4399.com/2543296430/middle",
    "content":"这个游戏真是好真是妙真是呱呱叫",
    "link":"http://a.4399.cn/mobile/103216.html"
	}
	* */
	onJsCommentShare(nick, rating, avatar, content, link,userMedal){
		let json = {
			rating,
			nick,
			avatar,
			content,
			link,
			userMedal
		};
		window.android.onClickShareComment && window.android.onClickShareComment(JSON.stringify(json));
	}

	/*
	* 判断分享接口是否存在 两个接口是 一起加的  所以 用这个也是可以判断 onClickShareComment 这个接口是否存在的
	*是否显示 分享按钮   也这个接口的原因是因为服务端不传分享途径的情况下
	* 是不显示分享按钮
	* */
	onJsCommentShareIsExists(){
		return window.android.isShowCommentShareBtn && window.android.isShowCommentShareBtn();
	}
}

export default Client;
