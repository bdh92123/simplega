// custom server side script used to fetch data from remote REST API
var http = require('axios');

function beforeRender(req, res, done) {
    // the report parameter country can be send from the client API request
    req.data.circleId = req.data.circleId || 1;
    req.data.year = req.data.year || new Date().getFullYear();
    var circleId = req.data.circleId;
    var year = req.data.year;
    
    var membersRequest = http.get(`http://localhost:3000/api/circles/${circleId}/members`, {
        params: {
            year: year
        }
    });
    
    var memberDuesRequest = http.get(`http://localhost:3000/api/circles/${circleId}/members/dues`, {
        params: {
            year: year
        }
    });
    
    http.all([membersRequest, memberDuesRequest])
        .then(http.spread((membersResponse, memberDuesResponse) => {
            req.data.members = membersResponse.data;
            var memberDue = {};
            memberDuesResponse.data.forEach((due)=>{
                var memberId = due.member_id;
                memberDue[memberId] = memberDue[memberId] ? memberDue[memberId] : [];
                var dueMonth = new Date(due.due_month).getMonth() + 1;
                var payDate = new Date(due.pay_date);
                memberDue[memberId][dueMonth] = (payDate.getMonth() + 1) + "/" + payDate.getDate();
            });
            req.data.dues = memberDue;
            done();
        }))
        .catch(error => console.log(error));
}