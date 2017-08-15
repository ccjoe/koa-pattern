const pattern = require('./index');
const request = require('supertest');
const Koa = require('koa');
const path = require('path');

import test from 'ava'

var app = new Koa()
app.use(pattern({
    dir: path.resolve(__dirname, 'example'),
    prefix: '',
    mvcPrefix: 'pages',
    restPrefix: 'api',
    tmplEngine: 'dot'
}))


// test file have used example directory
test('mvc pattern INDEX', async t => {
    t.plan(3);
    const res = await request(app.listen()).get('/pages')
    t.regex(res.header['content-type'], /html/)
    t.is(res.header['content-length'], '286')
    t.is(res.status, 200);
})

test('mvc pattern ctrl', async t => {
    t.plan(3);
    const res = await request(app.listen()).get('/pages/user')
    t.regex(res.header['content-type'], /html/)
    t.is(res.header['content-length'], '284')
    t.is(res.status, 200);
})

test('rest pattern GET', async t => {
    t.plan(4);
    const res = await request(app.listen()).get('/api/user')
    t.regex(res.header['content-type'], /json/)
    t.is(res.status, 200);
    t.is(res.body.userNo, "007", "get /api/user is ok")
    t.deepEqual(res.body, {"userName": "bd","userNo": "007"})

})

test('rest pattern POST', async t => {
    t.plan(3);

    const res = await request(app.listen()).post('/api/user')
    t.regex(res.header['content-type'], /json/)
    t.is(res.status, 200);
    t.is(res.body.msg, 'update success');

})

test('rest pattern PUST', async t => {
    t.plan(3);
    const res = await request(app.listen()).put('/api/user')
    t.regex(res.header['content-type'], /json/)
    t.is(res.status, 200);
    t.is(res.body.msg, 'create success');

})

test('rest pattern DELETE', async t => {
    t.plan(3);
    const res = await request(app.listen()).delete('/api/user')
    t.regex(res.header['content-type'], /json/)
    t.is(res.status, 200);
    t.is(res.body.msg, 'remove success');
})




