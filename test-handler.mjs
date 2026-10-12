import handler from './api/[...path].js';

function mockReq(method, url) {
  return { method, url, headers: { origin: process.env.CLIENT_ORIGIN }, body: {} };
}
function mockRes() {
  const r = { statusCode: 200, body: null,
    status(c){ r.statusCode=c; return r; },
    json(b){ r.body=b; return r; },
    set(){ return r; }, send(b){ r.body=b; return r; }, end(){ return r; } };
  return r;
}

// /api/health does not touch the DB, so this must succeed
const res = mockRes();
await handler(mockReq('GET', '/api/health'), res);
console.log('GET /api/health ->', res.statusCode, JSON.stringify(res.body));
