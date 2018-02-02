var db = require('../db');
var express = require('express');
var accountRouter = express.Router({ mergeParams: true });

accountRouter.route('/')
  .get(function (req, res) {
    var circleId = parseInt(req.params.circleId);
    var year = parseInt(req.query.year) || new Date().getFullYear();
    var month = parseInt(req.query.month) || new Date().getMonth() + 1;

    var fromDate = new Date();
    fromDate.setFullYear(year, month - 1, 1);
    fromDate.setHours(0, 0, 0, 0)
    var toDate = new Date(fromDate);
    toDate.setMonth(toDate.getMonth() + 1);
    db.query("SELECT * FROM account WHERE circle_id = ? AND date >= ? AND date < ? ORDER BY date", [circleId, fromDate, toDate])
      .then((row) => {
        res.send(row);
      })
      .catch((err) => res.status(500).send(err));

  });

accountRouter.route('/')
  .post(function (req, res) {
    var circleId = parseInt(req.params.circleId);
    var inout = req.body.inout;
    var account_type_id = req.body.account_type_id;
    var title = req.body.title;
    var desc = req.body.desc;
    var price = req.body.price;
    var date = new Date(req.body.date);
    db.query("INSERT INTO account(circle_id, `inout`, account_type_id, title, `desc`, price, `date`) VALUES(?, ?, ?, ?, ?, ?, ?)",
      [circleId, inout, account_type_id, title, desc, price, date])
      .then((row)=>{res.status(200).send({id: row.insertId});})
      .catch((err)=>{console.log(err); res.status(500).send(err)});
  });

accountRouter.route('/:accountId')
  .get(function (req, res) {
    var circleId = parseInt(req.params.circleId);
    var accountId = parseInt(req.params.accountId);
    db.queryOne("SELECT * FROM account WHERE id = ?", [accountId])
      .then((rows)=>{res.send(rows);})
      .catch((err)=>res.status(500).send(err));;
  })
  .put(function (req, res) {
    var circleId = parseInt(req.params.circleId);
    var accountId = parseInt(req.params.account_id);
    var accountTypeId = parseInt(req.params.account_type_id);
    var inout = parseInt(req.params.inout);
    var title = req.body.title;
    var desc = req.body.desc;
    var price = req.body.price;
    var date = new Date(req.body.date);

    db.query("UPDATE account SET `inout`=?, account_type_id=?, title=?, `desc`=?, price=?, `date`=? WHERE id=?",
      [inout, accountTypeId, title, desc, price, date, accountId])
      .then((row)=>{res.send({affected: row.affectedRows});})
      .catch((err)=>res.status(500).send(err));;
  })
  .delete(function (req, res) {
    var circleId = parseInt(req.params.circleId);
    var accountId = parseInt(req.params.accountId);
    db.query("DELETE FROM account WHERE id = ?", [accountId])
      .then((row)=>{res.send({affected: row.affectedRows});})
      .catch((err)=>res.status(500).send(err));;
  });

module.exports = accountRouter;


