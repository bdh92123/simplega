var db = require('../db');
var express = require('express');
var accountTypeRouter = express.Router({ mergeParams: true });

accountTypeRouter.route('/')
  .get(function (req, res) {
    db.query("SELECT * FROM account_type")
      .then((row)=>{res.send(row);})
      .catch((err)=>res.status(500).send(err));
  })
  .post(function (req, res) {
    var name = req.body.name;
    db.query("INSERT INTO account_type(name) VALUES(?)",
      [name])
      .then((row)=>{res.status(200).send({id: row.insertId});})
      .catch((err)=>{console.log(err); res.status(500).send(err)});
  });

accountTypeRouter.route('/:accountTypeId')
  .get(function (req, res) {
    var accountTypeId = parseInt(req.params.accountTypeId);
    db.queryOne("SELECT * FROM account_type WHERE id = ?", [accountTypeId])
      .then((rows)=>{res.send(rows);})
      .catch((err)=>res.status(500).send(err));;
  })
  .put(function (req, res) {
    var accountTypeId = parseInt(req.params.accountTypeId);
    var name = req.body.name;

    db.query("UPDATE account_type SET name=? WHERE id=?",
      [name, accountTypeId])
      .then((row)=>{res.send({affected: row.affectedRows});})
      .catch((err)=>res.status(500).send(err));;
  })
  .delete(function (req, res) {
    var accountTypeId = parseInt(req.params.accountTypeId);
    db.query("DELETE FROM account_type WHERE id = ?", [accountTypeId])
      .then((row)=>{res.send({affected: row.affectedRows});})
      .catch((err)=>res.status(500).send(err));;
  });

module.exports = accountTypeRouter;


