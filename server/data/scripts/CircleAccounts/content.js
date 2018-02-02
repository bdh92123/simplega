// custom server side script used to fetch data from remote REST API
var http = require('axios');

const accountTypes = [
  {
    id: 1,
    name: '식자재'
  },
  {
    id: 2,
    name: '회비'
  },
  {
    id: 3,
    name: '행사비'
  },
  {
    id: 4,
    name: '찬조'
  },
  {
    id: 5,
    name: '기타'
  }
]

let accountTypeMap = (function () {
  let typeMap = {}
  accountTypes.forEach((accountType) => {
    typeMap[accountType.id] = accountType
  })
  return typeMap
})()

let getAccountType = function (id) {
  return accountTypeMap[id]
}


function beforeRender(req, res, done) {
    // the report parameter country can be send from the client API request
    req.data.circleId = req.data.circleId || 1;
    req.data.year = req.data.year || new Date().getFullYear();
    req.data.month = req.data.month || new Date().getMonth() + 1;
    
    var circleId = req.data.circleId;
    var year = req.data.year;
    var month = req.data.month;
    console.log(year, month, circleId);
    //"id":13,"circle_id":1,"inout":0,
    //"account_type_id":1,"title":"test","desc":"test2",
    //"price":3,"date":"2018-02-01T15:00:00.000Z"},
    http.get(`http://localhost:3000/api/circles/${circleId}/accounts`, {
        params: {
            year: year,
            month: month
        }
    })
    .then((accountsResponse) => {
        var accounts = accountsResponse.data;
        console.log(JSON.stringify(accounts));
        var totalIn = 0;
        var totalOut = 0;
        accounts = accounts.map((account) => {
            var date = new Date(account.date);
            totalIn += account.inout == 0 ? account.price : 0;
            totalOut += account.inout == 1 ? account.price : 0;
            
            return {
                month: date.getMonth() + 1,
                date: date.getDate(),
                type: getAccountType(account.account_type_id).name,
                title: account.title,
                in: account.inout == 0 ? account.price : '',
                out: account.inout == 1 ? account.price : '',
                balance: '',
                desc: account.desc
            }
        })
        req.data.accounts = accounts;
        req.data.total = {
            in: totalIn,
            out: totalOut,
            balance: totalIn - totalOut
        };
        done();
    })
    .catch(error => {console.log(error); done()});
}