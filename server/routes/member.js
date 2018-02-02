var db = require('../db');
var express = require('express');
var memberRouter = express.Router({ mergeParams: true });
var memberDueRouter = require('./memberDue');

memberRouter.use('/:memberId/dues', memberDueRouter);
memberRouter.route('/')
  .get(function (req, res) {
    var circleId = parseInt(req.params.circleId);
    db.query("SELECT * FROM member WHERE circle_id = ? AND expire_date IS NULL ORDER BY regist_date", [circleId])
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  })
  .post(function (req, res) {
    var circleId = parseInt(req.params.circleId);
    var name = req.body.name;
    var phone = req.body.phone;
    var classes = req.body.classes;

    db.queryOne("INSERT INTO member(circle_id, name, phone, regist_date, classes) VALUES(?, ?, ?, ?, ?)", [circleId, name, phone, new Date(), classes])
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  });

memberRouter.route('/dues')
  .get(function (req, res) {
    var circleId = parseInt(req.params.circleId);
    var year = parseInt(req.query.year) || new Date().getFullYear();

    db.query("SELECT md.* FROM member_due md INNER JOIN member m ON md.member_id = m.id WHERE m.circle_id = ? AND YEAR(md.due_month) = ? ORDER BY m.regist_date", [circleId, year])
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  });

memberRouter.route('/:memberId')
  .get(function (req, res) {
    var circleId = parseInt(req.params.circleId);
    var memberId = parseInt(req.params.memberId);

    db.queryOne("SELECT * FROM member WHERE id = ?", [memberId])
      .then((row)=>res.send(row))
      .catch((err)=>res.status(500).send(err));
  })
  .put(function (req, res) {
    var circleId = parseInt(req.params.circleId);
    var memberId = parseInt(req.params.memberId);
    var name = req.body.name;
    var phone = req.body.phone;
    var expire_date = req.body.expire_date
    var classes = req.body.classes;

    db.queryOne("UPDATE member SET name=?, phone=?, expire_date=?, classes=? WHERE id = ?", [name, phone, expire_date, classes, memberId])
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  })
  .delete(function (req, res) {
    var memberId = parseInt(req.params.memberId);

    db.queryOne("DELETE FROM member WHERE id = ?", [memberId])
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  });

memberRouter.route('/:memberId/expire')
  .post(function (req, res) {
    var memberId = parseInt(req.params.memberId);

    db.queryOne("UPDATE member SET expire_date = NOW() WHERE id = ?", [memberId])
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  })


module.exports = memberRouter;


