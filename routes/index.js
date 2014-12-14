"use strict";
var express	= require("express");
var router	= express.Router();
var mysql	= require('mysql');
var crypto	= require('crypto');
var pool = mysql.createPool({
	host		: "localhost",
	user		: "user1",
	password	: "password",
	database	: "db1"
});

router.get("/", function(req, res) {
	res.render("index.html");

/*
	if (req.session.info == null) {
		res.redirect("/signin");
	}
	else {
		res.render("index.html");
	}
*/
});

router.get("/header", function(req, res) {
	res.render("header.html");
});

router.get("/toolbar", function(req, res) {
	res.render("toolbar.html");
});

router.get("/drawer", function(req, res) {
	res.render("drawer.html");
});

router.get("/scaffold", function(req, res) {
	res.render("scaffold.html");
});

router.get("/signin", function(req, res) {
	res.render("signin.html");
});

router.get("/register", function(req, res) {
	res.render("register.html");
});

router.get("/angular", function(req, res) {
	res.render("angular.html");
});

router.get("/demo", function(req, res) {
	res.render("demo.html");
});

router.post("/signin", function(req, res) {
	var digest = crypto.createHash("sha256").update(req.body.password).digest("hex");
	pool.getConnection(function(error, db) {
		if (error) {
			res.redirect("/");
			return;
		}

		db.query("select * from users where email=?",
			[req.body.email],
			function(error, records) {
				if (!error) {
					if (records[0].password === digest) {
						req.session.info = records[0];
					}
				}
				db.release();
				res.redirect("/")
			});
	});
});

router.get("/users", function(req, res) {
	pool.getConnection(function(error, db) {
		if (error) {
			res.redirect("/");
			return;
		}

		db.query("select * from users", [], function(error, records) {
			res.render("users.html", { users: records });
			db.release();
		});
	});
});

module.exports = router;
