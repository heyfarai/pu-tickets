var request = require('request');
var keystone = require('keystone');

var url = (keystone.get('env')=="development") ? "http://localhost:8888/api/" : "https://register.pixelup.co.za/api/" ;

request({
    url: url, //URL to hit
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
}, function (error, response, body) {
    if(error) {
        console.log(error);
    } else {
         console.log(response.statusCode, "from checkout");
    }
});
