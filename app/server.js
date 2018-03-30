// dependencies and setups

var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var friends = require("./data/friends.js").friends;
var fs = require("fs");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

// functions

function match(req) {
	friends = require("./data/friends.js").friends;
	var score = req.scores;
	var countarray = [];
	for (i = 0; i < friends.length - 1; i++) {
		var count = 0;
		for (j = 0; j < score.length; j++) {
			var scores = friends[i].scores;
			if (score[j] == scores[j]) {
				count++;
			}
		};
		countarray.push(count);
	};
	var maxindex = max(countarray);
	var maxarray = [];
	for (i = 0; i < countarray.length;i++) {
		if (countarray[i] === countarray[maxindex]) {
			maxarray.push(i);
		}
	};

	var randomindex = Math.floor(Math.random() * maxarray.length);
	return maxarray[randomindex];
};

function max(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    };
    return maxIndex;
};

// server paths

app.get("/", function(req, res) {
	res.sendFile(path.join(__dirname, "public/home.html"));
});

app.get("/survey", function(req, res) {
	res.sendFile(path.join(__dirname, "public/survey.html"));
});

app.post("/matchfriends", function(req, res) {
	friends.push(req.body);
	fs.writeFile("./data/friends.js", "exports.friends = " + JSON.stringify(friends, null, 2), function(err, res) {
		if (err) throw err;
	});
	var result = match(req.body);
	res.send(result.toString());
});

app.get("/api/friends", function(req, res) {
	friends = require("./data/friends.js").friends;
	res.json(friends);
});

app.listen(PORT);
