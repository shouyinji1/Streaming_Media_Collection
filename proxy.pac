var autoproxy_host = {
	"facebook.com": 1,
	"google.com": 1,
	"twitter.com": 1,
	
	"www.google.com": 1
};
function FindProxyForURL(url, host){
	var lastPos;
	do {
		if(autoproxy_host.hasOwnProperty(host)){
			return 'SOCKS 127.0.0.1:6000';
		}
		lasPos=host.indexOf('.') + 1;
		host = host.slice(lastPos);
	}while (lastPos>=1);
	return 'DIRECT';
};
