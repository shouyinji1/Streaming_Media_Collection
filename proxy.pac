// 规则：
// 1. 先按List走;
// 2. 如果List没有记录相应域名的连接规则，则直连;
// 3. 如果1、2两步不通，则走Server 2(Lantern)。
// 4. 最后，以上步骤都不通，放弃代理（直连）

var proxyServers=[
	"DIRECT;",

	// This PAC server is from https://makemenotme.ga/pac
	"HTTPS makemenotme.ga:26101;",	// For Reabble.cn

	"HTTP 127.0.0.1:40755;",
];

var autoProxyDomains={
	"*.cn":0,
	"*.bilibili.com":0,
	"*.cnblogs.com":0,
	"*.csdn.net":0,
	"*.ip138.com":0,
	"*.mozilla.org":0,
	"*.zhihu.com":0,
	"github.com":0,
	"cn.bing.com":0,
	
	// Baidu
	"*.baidu.com":0,
	"*.bcebos.com":0,
	"*.bdimg.com":0,
	"*.bdstatic.com":0,
	

	// 由Reabble.cn提供的PAC规则
	"*.google.com":1,
	"*.gstatic.com":1,
	"*.googleapis.com":1,
	"*.ggpht.com":1,
	"*.inoreader.com":1,
	"*.reabble.com":1,
	"*.feedx.net":1,
	"*.rsshub.app":1,


	"*.facebook.com":2,
	"*.gitlab.com":2,
	"*.reddit.com":2,
	"*.twitter.com":2,
	"*.wikipedia.org":2,
	"*.youtube.com":2,
	"raw.githubusercontent.com":2,
};

// 检查host是不是IP地址
function isIP(hostParts){
	if(hostParts.length==4){
		for(var i of hostParts){
			if(isNaN(i)==true)
				return false;
		}
		return true;
	}
	return false;
}

function autoProxyHosts(host, hosts) {
	var hostParts = host.split('.'), testHost = [];

	if(isIP(hostParts)==false){	// host不是IP地址
		while (hostParts.length) {
			testHost.unshift(hostParts.pop());
			var proxyServerIndex=hosts["*."+testHost.join('.')];
			if (proxyServers[proxyServerIndex]) {
				return proxyServerIndex;
			}
		}
	}	

	var proxyServerIndex=hosts[host];
	if (proxyServers[proxyServerIndex]) {
		return proxyServerIndex;
	}

	return 0;	// Default proxy
}

function FindProxyForURL(url, host){
	if (isPlainHostName(host))	//如果域名中没有点(no dots)，则直连
		return 'DIRECT';
	var proxyTunnel=proxyServers[autoProxyHosts(host,autoProxyDomains)]
		+proxyServers[2]
		+"DIRECT";
	return proxyTunnel;
};
