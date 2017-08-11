module.exports.index = (ctx, next) => {
  return {
      mvcPrefix: '',
      ctrlName: 'user',
      actionName: 'index'
  }
}

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

module.exports.update = (ctx, next) => {
  return {
      status: 'OK',
      msg: 'update success'
  }
}

module.exports.create = (ctx, next) => {
  return {
      status: 'OK',
      msg: 'create success'
  }
}

module.exports.remove = (ctx, next) => {
  return {
      status: 'OK',
      msg: 'remove success'
  }
}


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