const https = require('https');
const config = require('../config/index');

function sendMessage(id, text, keyboard) {
  return new Promise((resolve, reject) => {
    const contentMessage = {
      'text': text,
      'reply_markup': keyboard
    }
        
    const options = {
      hostname: 'api.telegram.org',
      port: 443,
      path: `/bot${config.token}/sendMessage?chat_id=${id}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
        
    let req = https.request(options, res => {
      let chunks = [];
    
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });

      res.on("end", function () {
        let body = Buffer.concat(chunks);
        resolve(body.toString());
      });
    });
        
    req.write(JSON.stringify(contentMessage));
    req.end(); 

  }) 
};

module.exports = sendMessage;