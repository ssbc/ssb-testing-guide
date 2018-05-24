const flumeView = require('flumeview-level')
const pull = require('pull-stream')
const NAME = 'channels'
const VERSION = 1

module.exports = {
  name: NAME,
  version: VERSION,
  manifest: {
    read: 'source',
    list: 'async',
    count: 'async'
  },
  init: function (server, config) {
    const view = server._flumeUse(
      NAME,
      flumeView(VERSION, map)
    )

    return {
      read: view.read,
      list: list,
      count: count
    }

    function map (msg) {
      const { author, content } = msg.value
      if (isPost(content) && hasChannel(content)) return [[ content.channel, msg.value.timestamp ]]
      return []

      function isPost (content) {
        return content.type === 'post'
      }

      function hasChannel(content) {
        return content.channel
      }
    }

    function list (opts, cb) {
      if (typeof opts === 'function') return list({}, opts)

      opts = Object.assign({}, opts, { keys: true, values: false, seqs: false })

      pull(
        view.read(opts),
        pull.map(data => data[0]),
        pull.collect((err, msgs) => {
          if (err) cb(err)
          cb(null, Array.from(new Set(msgs.sort())))
        })
      )
    }

    function count (opts, cb) {
      if (typeof opts === 'function') return count({}, opts)

      opts = Object.assign({}, opts, { keys: true, values: false, seqs: false })

      pull(
        view.read(opts),
        pull.map(data => data[0]),
        pull.collect((err, msgs) => {
          if (err) cb(err)
          var collection = msgs.sort().reduce((coll, msg) => {
            coll[msg] = (coll[msg] || 0) + 1
            return coll
          }, {})
          cb(null, collection)
        })
      )
    }
  }
}

