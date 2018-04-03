const https = require('https');
const token = require('../config/index').token;

function getRequestOptions({ token, chat_id, boundary, length }) {
  return {
    host: 'api.telegram.org',
    method: 'POST',
    path: `/bot${token}/sendPhoto?chat_id=${chat_id}`,
    headers: {
      'Content-Type': 'multipart/form-data; boundary=' + boundary,
      'Content-Length': length
    }
  }
}

function getMultipartOptions(nameFile, contentType) {
  const nl = '\r\n',
        boundary = '---------------------------randomBoundary',
        delimiter = nl + '--' + boundary,
        preamble = '',
        epilogue='',
        headers = [
          `Content-Disposition: form-data; name="photo"; filename="${nameFile}"${nl}`,
          'Content-Type: '+ contentType + nl,
        ],
        closeDelimiter = delimiter + "--";
  return {
    boundary, delimiter,
    preamble: new Buffer(preamble + delimiter + nl + headers.join('') + nl),
    epilogue: new Buffer(closeDelimiter + epilogue)
  }
}

module.exports = (chat_id, stream, nameFile, sizeFile, contentType = 'image/png') => {
  const multipart = getMultipartOptions(nameFile, contentType);
  const length = multipart.preamble.length + multipart.epilogue.length + sizeFile;
  const options = getRequestOptions({ token, chat_id, boundary: multipart.boundary, length });
    
  let res;
  const request = https.request(options, (resIn) => {
    res = resIn;
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => body);
  });

  request.once('error', err => {
    if (res) {
      res.removeAllListeners();
      res.destroy();

      console.error(err);
    }
    stream.removeAllListeners();
    stream.destroy();
  });

  request.write(multipart.preamble);

  stream.on('error', err => {
    if (res) {
      res.removeAllListeners();
      res.destroy();

      console.error(err);
    }
    request.removeAllListeners();
    request.destroy(); 
  });

  stream.on('data', chunk => request.write(chunk));

  stream.on('end', () => {
    request.write(multipart.epilogue);
    request.end();
  });
};