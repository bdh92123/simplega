// custom server side script used to fetch data from remote REST API
var http = require('axios');

const classes = {
  'ASSOSIATE': '준회원',
  'REGULAR': '정회원',
  'PRESIDENT': '회장',
  'GENERAL_AFFAIRS': '총무',
  'ADVISOR': '고문'
}

let getClassesLabel = function (classKey) {
  return classes[classKey]
}


function beforeRender(req, res, done) {
    // the report parameter country can be send from the client API request
    req.data.circleId = req.data.circleId || 1;
    req.data.year = req.data.year || new Date().getFullYear();
    
    var circleId = req.data.circleId;
    var year = req.data.year;
    
    http.get(`http://localhost:3000/api/circles/${circleId}/members`, {
        params: {
            year: year
        }
    })
    .then((membersResponse) => {
        var members = membersResponse.data;
        members = members.map((member) => {
            member.classes = getClassesLabel(member.classes);
            member.regist_date = new Date(member.regist_date).toLocaleDateString();
            return member;
        })
        req.data.members = members;
        done();
    })
    .catch(error => {console.log(error); done()});
}