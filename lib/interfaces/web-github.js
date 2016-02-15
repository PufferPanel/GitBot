var web = require("./web.js"),
    github = require("./github.js");

web.rest.post('/github', function(req, res, next) {

	async.series([
		function(callback) {

			var ip = req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

			var addr = ipaddr.parse(ip);

			if(addr.match(ipaddr.parseCIDR("192.30.252.0/22")) === true) {
				callback();
			} else {
				res.send(403, "Request processed from invalid IP Range.");
			}

			// hmac = crypto.createHmac('sha1', config.secret);
			// hmac.setEncoding('hex');
			//
			// hmac.end(JSON.stringify(req.params), function () {
			//
			// 	var returnedHMAC = hmac.read();
			// 	if(req.headers['x-hub-signature'] != "sha1=" + returnedHMAC) {
			// 		res.send(403, {"error": "sha1=" + returnedHMAC});
			// 	} else {
			// 		callback();
			// 	}
			//
			// });

		},
		function(callback) {

			switch(req.headers['x-github-event']) {

				case 'push':
					github.push(req.params);
					break;
				case 'create':
					github.create(req.params);
					break;
				case 'delete':
					github.remove(req.params);
					break;
				case 'issues':
					github.issue(req.params);
					break;
				case 'pull_request':
					github.pullRequest(req.params);
					break;
				case 'release':
					github.release(req.params);
					break;

			}

			res.send(204);

		}
	]);

});
