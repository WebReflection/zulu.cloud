/*! (c) Andrea Giammarchi - ISC License */

const zuluFrequency = 300;
const zuluFunction = 'function(b,f){var a=new b,d=a.getTime,c=d.bind?d.call.bind(d):function(t){return d.call(t)},e=c(a);setInterval(function(){a=c(new b);zuluDate=new b(c(zuluDate)+(a-e));e=a},' + zuluFrequency + ');return new b(f)}';

const url = require('url');
const createIndex = now => `<!doctype html>
<html lang="en">
  <head>
    <title>Zulu Date</title>
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <style>
      body { text-align: center; font-family: sans-serif; }
      h1, h2 {  font-weight: normal; }
    </style>
    <script defer src="/js"></script>
    <script defer>setInterval(function(){
      document.getElementById('zulu-date').textContent = zuluDate;
      document.getElementById('no-zulu-date').textContent = new Date;
    }, 300)</script>
  </head>
  <body>
    <h1 id="zulu-date">
      ${new Date(now)}
    </h1>
    <h2 id="no-zulu-date"></h1>
  </body>
</html>`;

require('http').createServer((req, res) => {
  const now = Date.now();
  const path = req.url;
  const i = path.indexOf('?');
  let content = '';
  let type = 'application/javascript';
  switch (path.slice(0, i < 0 ? path.length : i)) {
    case '/favicon.ico':
      break;
    case '/jsonp':
      const query = url.parse(path, true).query;
      content = 'setTimeout(' + ('fn' in query ? query.fn : 'onZuluDate') + ');';
    case '/js':
      content += 'var zuluDate=' + zuluFunction + '(Date,' + now + ');';
      break;
    case '/time':
      content = '' + now;
      break;
    case '/json':
      content = JSON.stringify(new Date(now));
      break;
    default:
      type = 'text/html;charset=utf-8';
      content = createIndex(now);
      break;
  }
  res.writeHead(200, {
    'Content-Length': content.length,
    'Content-Type': type,
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    'Expires': '-1',
    'Pragma': 'no-cache',
    'X-Zulu-Time': now
  });
  res.end(content);
}).listen(process.env.PORT || 3000);