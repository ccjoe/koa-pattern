/**
 * @author Joe Liu@ccjoe
 * @name koa-pattern.js
 * @desc a middleware support mvc and rest
 */

'use strict';

/**
 * Module dependencies.
 */

var path = require('path')
var consolidate = require('consolidate')
const fs = require('mz/fs')
module.exports = koaPattern

var defaultOptions = {
    prefix: '',
    mvcPrefix: '',
    restPrefix: '',
    tmplEngines: '',
    options:{}
}

/**
 *
 * @param {*} opts
 * @description
 * koa-pattern 中间件，mvc和rest二种server范式的中间件
 * var pattern = require('koa-pattern')
 * app.use(pattern({
        dir: __dirname,    //指定mvc模式时views和ctrls的父级目录
        prefix: '',         // prefix or virtual directory
        mvcPrefix: 'pages',  //if undefine or '',null,  not run mvc  pattern
        restPrefix: 'papi',   //if undefine or '',null,  not run rest pattern
        tmplEngine: 'dot' || {name:'dot', 'extension':'html'} //如果已在外面使用了其它view类中间件，具备ctx.render方法， 则可以不指定。
    }));
 *
 */

function koaPattern(opts){
    opts = Object.assign({}, defaultOptions, opts)
    return function (ctx, next) {
        ctx.patternOptions = opts
        ctx.pathInfo = getPathInfo(ctx)
        ctx.render = ctx.render || render(ctx, opts)
        if(ctx.pathInfo.pr === opts.mvcPrefix){
            return mvc(ctx, next)
        }else if(ctx.pathInfo.pr === opts.restPrefix){
            return rest(ctx, next)
        }else{
            return next()
        }
    }
}


function getPathInfo(ctx){
    var pathInfo = ctx.path.split('/'),
        preIndex = ctx.patternOptions.prefix ? 2 : 1
        return {
            pr: pathInfo[preIndex] || 'index',
            collection: pathInfo[preIndex+1] || 'index',
            action: pathInfo[preIndex+2] || 'index'
        }
}

function getControls(ctx){
    return require(path.normalize(ctx.patternOptions.dir+'/ctrls/' + ctx.pathInfo.collection))
}

/**
   * rest 处理逻辑
   * @desc Restful URI 表征资源，资源不能是动词，动词需参数化，eg: POST /transaction  ?from=1&to=2&amount=500.00
           处理Rest请求, 与处理MVC不同的仅仅是将CTRL/Action 约定改成 resource/Representation 约定， rest的Http Method决定handling

   * Rest Pattern 支持二种形式返回API接口数据
   * 1. rest   如 HTTP get/post/put/delete http://localhost/restPrefix/collectionName/:id
   * 2. action 如 HTTP get/post            http://localhost/restPrefix/collectionName/actionName
   * 首先会根据actionName 匹配到相应的 handling, 没有的话则会根据 http mehtod匹配, 匹配规则如下
   *    'GET': 'query',
        'POST': 'update',
        'PUT': 'create',
        'DELETE': 'remove'
   * eg: GET http://localhost/restPrefix/collectionName/actionName
   * 会返回 ctrls/collectionName.js里对应的 actionName方法的返回值,
   * 没有actionName方法，则会匹配rest模式， 即GET对应的query方法（rest的对应方法名是固定的）的返回值
   */
function rest(ctx, next){
    var finalRest = {}
    try {
        var httpMethod = {
            'GET': 'query',
            'POST': 'update',
            'PUT': 'create',
            'DELETE': 'remove'
        }
        var collection = getControls(ctx),
            state = collection[ctx.pathInfo.action]
        finalRest = state ? state() : collection[httpMethod[ctx.req.method]]()
    } catch (error) {
        finalRest.msg = 'NotFound',
        finalRest.code = 200
    }
    if(finalRest.then){
        return finalRest.then(function(json){
            ctx.body = json
        })
    }else{
        return ctx.body = finalRest
    }
}

/**
   * mvc 处理逻辑
   * 采用的是rest 返回api的第二种方式
   * eg: HTTP GET http://localhost/mvcPrefix/ctrlName/actionName
   * 会返回 ctrls/ctrlName.js里对应的 actionName方法的返回值
   * 不同的是mvc pattern会将返回数据 自动的传递到 视图并渲染出来
   * 视图模板引擎由你自己决定，所以渲染语法也是由你的视图模板引擎决定
   */
function mvc(ctx, next){
    var mvcParams = ctx.pathInfo.collection+'/'+ctx.pathInfo.action
    //get mvc ctrl module
    ctx.render = ctx.render || cons[ctx.patternOptions.tmplEngines]
    try {
        var ctrl = getControls(ctx),
        action = ctrl[ctx.pathInfo.action](ctx)
    } catch (error) {
        return ctx.render(mvcParams)
    }
    return ctx.render(mvcParams, action)

}

function render(ctx, opts){
    var render = consolidate[opts.tmplEngine],
        extension =  opts.tmplEngine && opts.tmplEngine.extension || 'html'
    return function (relPath, data) {
        data = data || {}
        ctx.type = 'text/html'
        return render(path.resolve(opts.dir, 'views', relPath + '.' + extension), data)
                .then(function(html){
                    ctx.body = html
                }).catch(function (err) {
                    throw err;
                });
    }
}