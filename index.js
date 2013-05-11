var pull = require('pull-stream')

//TEE stream.
//this could be improved to allow streams to read ahead.
//this slows all streams to he slowest...

module.exports = pull.Sink(function (read, sinks) {
  sinks = sinks.filter(Boolean)

  var cbs = []
  var i = sinks.length

  function _read(abort, cb) {
    cbs.push(cb)
    if(cbs.length < sinks.length)
      return

    read(null, function (err, data) {
      var _cbs = cbs
      cbs = []
      _cbs.forEach(function (cb) {
        cb(err, data)
      })      
    })
  }

  sinks.forEach(function (sink) {
    sink(_read)
  })

})
