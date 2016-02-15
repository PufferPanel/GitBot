

// Data Pushed
exports.push = function githubPush(data) {

	var shortenedURL, commitMessage;
	async.series([
		function(callback) {

			gi(data.compare, function(error, result) {

				if(error) {
					console.log("An error occured while trying to shorten the URL.");
				}

				shortenedURL = result;
				callback();

			});

		},
		function(callback) {

			var message = "[\u000313" + data.repository.name + "/" + data.ref.split('/').pop() + "\u000f] \u000315" + data.head_commit.author.username + "\u000f pushed " + data.commits.length + " new commit(s) to master (+" + data.head_commit.added.length + " -" + data.head_commit.removed.length + " \u00B1" + data.head_commit.modified.length + ") " + shortenedURL;

			bot.say(config.irc.channel, message);

			async.eachSeries(data.commits, function(commit, callback) {

				if(commit.message.indexOf("\n") > -1) {
					commitMessage = commit.message.split("\n");
					commitMessage = commitMessage[0].substr(0, 150) + "...";
				} else {
					commitMessage = commit.message.substr(0, 150);
				}

				bot.say(config.irc.channel, "    \u000314" + commit.id.substring(0, 9) + "\u000f \u000315" + commit.committer.username + "\u000f: " + commitMessage);
				callback();

			});

		}
	]);

}

exports.create = function githubCreate(data) {

	var message = "[\u000313" + data.repository.name + "\u000f] \u000315" + data.sender.login + "\u000f \u000309created\u000f " + data.ref_type + " " + data.ref;
	bot.say(config.irc.channel, message);

}

exports.remove = function githubDelete(data) {

	var message = "[\u000313" + data.repository.name + "\u000f] \u000315" + data.sender.login + "\u000f \u000304deleted\u000f " + data.ref_type + " " + data.ref;
	bot.say(config.irc.channel, message);

}

exports.issue = function githubIssue(data) {

	var shortenedURL,
		ignoreIssues = [
			"assigned",
			"unassigned",
			"labeled",
			"unlabeled"
		];

	if(ignoreIssues.indexOf(data.action) > -1) {
		console.log("Ignoring issue with reason: " + data.action);
		return;
	}

	async.series([
		function(callback) {

			gi(data.issue.html_url, function(error, result) {

				if(error) {
					console.log("An error occured while trying to shorten the URL.");
				}

				shortenedURL = result;
				callback();

			});

		},
		function(callback) {

			var message = "[\u000313" + data.repository.name + "\u000f] \u000315" + data.sender.login + "\u000f " + data.action + " Issue #" + data.issue.number
							+ ": " + data.issue.title + " " + shortenedURL;

			bot.say(config.irc.channel, message);

		}
	]);

}

exports.pullRequest = function githubPullRequest(data) {

	var shortenedURL,
		ignorePR = [
			"assigned",
			"unassigned",
			"labeled",
			"unlabeled",
			"synchronize"
		];

	if(ignorePR.indexOf(data.action) > -1) {
		return;
	}

	async.series([
		function(callback) {

			gi(data.pull_request.html_url, function(error, result) {

				if(error) {
					console.log("An error occured while trying to shorten the URL.");
				}

				shortenedURL = result;
				callback();

			});

		},
		function(callback) {

			var message = "[\u000313" + data.pull_request.base.repo.name + "/" + data.pull_request.base.ref + "\u000f] \u000315" + data.sender.login + "\u000f " + data.action + " Pull Request #" + data.pull_request.number
							+ ": " + data.pull_request.title + " " + shortenedURL;

			bot.say(config.irc.channel, message);

		}
	]);

}

exports.release = function githubRelease(data) {

	async.series([
		function(callback) {

			gi(data.release.html_url, function(error, result) {

				if(error) {
					console.log("An error occured while trying to shorten the URL.");
				}

				shortenedURL = result;
				callback();

			});

		},
		function(callback) {

			var message = "[\u000313" + data.repository.name + "\u000f] \u000315" + data.respository.sender.login + "\u000f published release " + data.release.tag_name + ": " + data.release.name + " " + shortenedURL;
			bot.say(config.irc.channel, message);

		}
	]);

}


