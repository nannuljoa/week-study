/**
 * 20150625 by Moon Kyung tae
 * cookie
 */
var pageCookie = (function (){
	var cookie = {};
	
	cookie.map = (function (){
		if(!document.cookie){
			return null;
		}
		var cookies = document.cookie.replace(/\s/gi, '').split(";"),
			map = {};
		for (var i = 0, max = cookies.length; i < max; i++) {
			map[cookies[i].split("=")[0]] = cookies[i].split("=")[1];
		}
		return map;
	}());
	
	cookie.setType = {
		day: function (now, name, value, time){
			now.setDate(now.getDate() + time);
			this.set(now, name, value);
		},
		
		min: function (now, name, value, time){
			now.setMinutes(now.getMinutes() + time);
			this.set(now, name, value);
		},
		
		sec: function (now, name, value, time){
			now.setSeconds(now.getSeconds() + time);
			this.set(now, name, value);
		},
		
		set: function (now, name, value){
			document.cookie = name + '=' + value + '; expires=' + now.toUTCString();
		}
	};
	
	cookie.setCookie = function (cookieName, cookieValue, type, time){
		var now = new Date();
		cookie.setType[type](now, cookieName, cookieValue, time);
	};
	
	cookie.delCookie = function (cookieName){
		var now = new Date();
		now.setDate(now.getDate() - 1);
		document.cookie = cookieName + "=; expires=" + now.toUTCString();
	};
	
	cookie.getCookie = function (key){
		return cookie.map[key];
	};
	
	return cookie;
}());