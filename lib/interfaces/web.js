var restify = require("restify"),
    rest = restify.createServer({
		name: "GitBot"
	});

rest.use(restify.bodyParser());
rest.use(restify.authorizationParser());
rest.use(restify.queryParser());
rest.use(restify.CORS());


rest.opts(/.*/, function (req, res, next) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", req.header("Access-Control-Request-Method"));
    res.header("Access-Control-Allow-Headers", req.header("Access-Control-Request-Headers"));
    res.send(200);

    return next();

});



rest.get('/', function(req, res, next) {

	res.send("GitBot is Active.");

});

exports.rest = rest;

require("./web-github.js")
