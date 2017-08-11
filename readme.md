# koa-pattern

[![Build status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]

A Really Simple koa middleware that support mvc and rest , including template rendering middleware.

> **Note:** This middleware is for `koa@2`. koa@1 test not recovery.

## Installation

```
$ npm install koa-pattern
```

## Templating engines

`koa-pattern` is using [consolidate](https://github.com/tj/consolidate.js) for veiw render under the hood.

[List of supported engines](https://github.com/tj/consolidate.js#supported-template-engines)

## Example

```js
var pattern = require('koa-pattern');

app.use(pattern({
        dir: __dirname,
        prefix: '',     // url prefix or virtual directory
        mvcPrefix: 'pages',//if undefine or '',null,  not run mvc  pattern
        restPrefix: 'api',//if undefine or '',null,  not run rest pattern
        //if have used others view middleware or template Engine, and has ctx.render method, can not config tmplEngine
        tmplEngine: 'dot'//or {name:'dot', 'extension':'html'}
    }));
```
* `opts.dir`: Where your ctrls & views are located. this location must direct include ctrls/views, Must be an absolute path.
* `opts.prefix` (optional) url prefix or virtual directory
* `opts.mvcPrefix`: url mvc prefix
* `opts.restPrefix`: url rest prefix
* `opts.tmplEngine`: template Engine name string or object include name and extension: {name:'dot', 'extension':'html'}

For more examples you can take a look at the [example](./example/index.js).

## Dir
```
example
    |-ctrls
    |   |-user.js
    |-views
    |    |-user
    |        |-index.html
    |        |-list.html
    |-index.js
```
#### `mvc pattern` HTTP GET http://localhost/pages/ctrlName/actionName
eg: `HTTP GET http://localhost/pages/user/list`
It will render views dir user/list.html automatic, and view's data return by ctrls/user.js list function

if not `ctrlName` or `actionName`, it default `'index'`

```js
//ctrls/user.js
module.exports.list = (ctx, next) => {
  return [{
      userName: 'bd',
      userNo: '007'
  },{
      userName: 'bd2',
      userNo: '9527'
  }]
}
```

#### `rest pattern` HTTP GET/POST/PUT/DELETE  http://localhost/restPrefix/resourceName/[respration]
Rest Pattern support 2 url style to render api json data
eg:
1. `HTTP GET/POST            http://localhost/api/user/list`
2. `HTTP GET/POST/PUT/DELETE http://localhost/api/user/007`

actually, 1 and 2 is just the same rule url

and the 1st one will render json by ctrls/user.js `list` methods, and if no `list` function,
it will match `HTTP method` matched function
match rule
```
    'GET': 'query',
    'POST': 'update',
    'PUT': 'create',
    'DELETE': 'remove'
```
so url 1 return `list` as below, url2 if HTTP METHOD IS GET will match `query` return
```
module.exports.list = (ctx, next) => {
  return [{
      userName: 'bd',
      userNo: '007'
  },{
      userName: 'bd2',
      userNo: '9527'
  }]
}

module.exports.query = (ctx, next) => {
  return {
      userName: 'bd',
      userNo: '007'
  }
}
```

#### rest and mvc pattern async supported
```
module.exports.asynclist = (ctx, next) => {
    var data = {}
    var kk = () => new Promise((resolve, reject) => {
        setTimeout(function(){
            resolve([{
                userName: 'bd',
                userNo: '007'
            },{
                userName: 'bd2',
                userNo: '9527'
            }])
        },1000)
    })
    return kk().then((data) => {
        return data
    });
}
```
## License

[MIT](./license)

[travis-image]: https://img.shields.io/travis/ccjoe/koa-pattern.svg?style=flat-square
[travis-url]: https://travis-ci.org/ccjoe/koa-pattern
[npm-image]: https://img.shields.io/npm/v/koa-pattern.svg?style=flat-square
[npm-downloads-image]: https://img.shields.io/npm/dm/koa-pattern.svg?style=flat-square
[npm-url]: https://npmjs.org/package/koa-pattern
[david-image]: http://img.shields.io/david/ccjoe/koa-pattern.svg?style=flat-square
[david-url]: https://david-dm.org/ccjoe/koa-pattern
[license-image]: http://img.shields.io/npm/l/koa-pattern.svg?style=flat-square
[license-url]: ./license
