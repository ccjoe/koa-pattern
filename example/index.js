var Koa = require('koa')
var pattern = require('..')

var app = new Koa()
app.use(pattern({
    dir: __dirname,
    prefix: 'vd',
    mvcPrefix: 'pages',
    restPrefix: 'api',
    tmplEngine: 'dot'
}))

app.listen(3000)
console.log('app listening on port 3000')

// http://localhost:3000/vd/api/user/007