var db = require('../db');
var express = require('express');
var memberDueRouter = express.Router({ mergeParams: true });

memberDueRouter.route('/')
  .get(function (req, res) {
    var memberId = parseInt(req.params.memberId);
    var year = parseInt(req.query.year) || new Date().getFullYear()
    db.query("SELECT * FROM member_due WHERE member_id = ? AND YEAR(due_month) = ?", [memberId, year])
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  })
  .post(function (req, res) {
    var memberId = parseInt(req.params.memberId);
    var desc = req.body.desc;
    var dueMonth = new Date(req.body.due_month);
    var payDate = new Date(req.body.pay_date);

    db.queryOne("SELECT count(*) count FROM member_due WHERE member_id = ? AND YEAR(due_month) = YEAR(?) AND MONTH(due_month) = MONTH(?)", [memberId, dueMonth, dueMonth])
      .then((row)=> {
        if(row.count) {
          db.queryOne("UPDATE member_due SET `desc` = ?, due_month = ?, pay_date = ? WHERE member_id = ? AND YEAR(due_month) = YEAR(?) AND MONTH(due_month) = MONTH(?)",  [desc, dueMonth, payDate, memberId, dueMonth, dueMonth])
            .then((rows)=>res.send(rows))
            .catch((err)=>res.status(500).send(err));
        } else {
          db.queryOne("INSERT INTO member_due(member_id, `desc`, due_month, pay_date) VALUES(?, ?, ?, ?)", [memberId, desc, dueMonth, payDate])
            .then((rows)=>res.send(rows))
            .catch((err)=>res.status(500).send(err));
        }
      })
      .catch((err)=>res.status(500).send(err));
  });

memberDueRouter.route('/:memberDueId')
  .get(function (req, res) {
    var memberDueId = parseInt(req.params.memberDueId);

    db.queryOne("SELECT * FROM member_due WHERE id = ?", [memberDueId])
      .then((row)=>res.send(row))
      .catch((err)=>res.status(500).send(err));
  })
  .delete(function (req, res) {
    var memberDueId = parseInt(req.params.memberDueId);

    db.queryOne("DELETE FROM member_due WHERE id = ?", [memberDueId])
      .then((rows)=>res.send(rows))
      .catch((err)=>res.status(500).send(err));
  });
module.exports = memberDueRouter;


