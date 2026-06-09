const http = require('http');
const data = JSON.stringify({ email: 'test@example.com' });
const options = {
  hostname: 'localhost',
  port: 4000,
  path: '/api/auth/forgot-password',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};
const req = http.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  console.log('HEADERS', JSON.stringify(res.headers));
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log('BODY', body);
  });
});
req.on('error', (e) => {
  console.error('ERROR', e.message);
});
req.write(data);
req.end();
