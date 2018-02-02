var db = require('../db');
var express = require('express');
var memberRouter = require('./member')
var accountRouter = require('./account')
var circleRouter = express.Router();

circleRouter.use('/:circleId/members', memberRouter);
circleRouter.use('/:circleId/accounts', accountRouter);
circleRouter.route('/')
  .get(function (req, res) {
    db.query("SELECT * FROM circle")
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  })
  .post(function (req, res) {
    var name = req.body.name;
    var due = req.body.due;

    db.queryOne("INSERT INTO circle(name, due) VALUES(?, ?)", [name, due])
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  });

circleRouter.route('/:circleId')
  .get(function (req, res) {
    var circleId = parseInt(req.params.circleId);
    db.queryOne("SELECT * FROM circle WHERE id = ?", [circleId])
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  })
  .put(function (req, res) {
    var circleId = parseInt(req.params.circleId);
    var name = req.body.name;
    var due = req.body.due;

    db.queryOne("UPDATE circle SET name=?, due=? WHERE id = ?", [name, due, circleId])
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  })
  .delete(function (req, res) {
    var circleId = parseInt(req.params.circleId);

    db.queryOne("DELETE FROM circle WHERE id = ?", [circleId])
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  });

module.exports = circleRouter;


