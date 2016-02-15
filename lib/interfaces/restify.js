/**
 * GitBot – the simple github IRC bot.
 * Licensed under a LGPL-v3 license.
 */

require("./web.js")

var async = require("async"),
	config = require("../../config.json"),
	gi = require("gi"),
	ipaddr = require("ipaddr.js"),
	irc = require("irc"),
	crypto = require("crypto"),
	request = require("request"),
	hmac,
	bot = new irc.Client(config.irc.server, config.irc.botname, {
		channels: [ config.irc.channel ]
	});



bot.addListener('invite', function(channel, from, message){
	if(from == config.irc.channel){
		bot.join(config.irc.channel);
	}
});


bot.addListener('message', function (from, to, message) {
	var i;
	for(i in message.split(" ")){
		var s = message.split(" ")[i];
		if(s.substring(0, 1) === "#"){
			// GET /repos/:owner/:repo/issues/:number
			request({
					"uri": "https://api.github.com/repos/" + config.main_repository + "/issues/" + s.substring(1), 
					"json":true,
					"headers":{"User-Agent": "GitBot, " + config.main_repository}}, function(error, response, body){
				if (!error && response.statusCode == 200){
					async.series([
						function(callback) {

							gi(body.html_url, function(error, result) {

								if(error) {
									console.log("An error occured while trying to shorten the URL.");
								}

								shortenedURL = result;
								callback();

							});

						},
						function(callback) {
							var open = "[\u0003";
							if(body.state == "open"){open += "03open"; } else { open += "04closed"; }
							open += "\u000f]";
							var message = "[\u000313" + config.main_repository + "\u000f] \u0002"+ "#" + body.number + "\u0002: " + body.title + " " + open + " " + shortenedURL;

							bot.say(config.irc.channel, message);

						}
					]);
				}
			});
		}
	}
});


bot.addListener('error', function(message) {
    console.log('error: ', message);
});

rest.listen(9959, '0.0.0.0', function() {
	console.log("Server listening on 9959.");
});
