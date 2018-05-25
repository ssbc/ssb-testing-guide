const flumeView = require('flumeview-level')
const pull = require('pull-stream')
const defer = require('pull-defer')
const get = require('lodash/get')
const NAME = 'channels'
const VERSION = 1

const getAuthor = (msg) => get(msg, 'value.author')
const getContent = (msg) => get(msg, 'value.content')
const getTimestamp = (msg) => get(msg, 'value.timestamp')

module.exports = {
  name: NAME,
  version: VERSION,
  manifest: {
    read: 'source',
    subscriptions: 'source',
    getUserSubscriptions: 'async',
    popular: 'async'
  },
  init: function (server, config) {
    const view = server._flumeUse(
      NAME,
      flumeView(VERSION, map)
    )

    return { read: view.read, subscriptions, popular }

    function map (msg, seq) {
      const content = getContent(msg)
      if (isChannelSubscription()) {
        return [
          [content.channel, getAuthor(msg), getTimestamp(msg), content.subscribed]
        ]
      }

      function isChannelSubscription () {
        return content.channel &&
          (typeof content.subscribed !== undefined)
      }
    }

    function subscriptions (opts) {
      const query = Object.assign({}, {
        live: true,
        keys: true,
        values: false,
        seq: false
      }, opts)

      return view.read(query)
    }

    function getUserSubscriptions (feedId, cb) {
      pull(
        view.read({ keys: false, values: true }),
        pull.collect((err, msgs) => {

        })
      )
    }

    function popular (opts, cb) {
      if (typeof opts === 'function') return popular({}, opts)
      // opts = Object.assign({}, opts, { keys: true, values: false, seq: false })
    }

  }
}

    // function subscriptions (opts) {
    //   const query = Object.assign({}, {
    //     live: true,
    //     keys: true,
    //     values: false,
    //     seq: false
    //   }, opts)

    //   var source = defer.source(query)

    //   // Do a { live: false } request to get collection of current subscribed channels
    //   var getOpts = { live: false, keys: false, values: false, seq: false }

    //   getSubscribedChannels(getOpts, (err, msgs) => {
    //     if (err) throw err

    //     source.resolve(
    //       // pull stream without a sink returns a source
    //       pull(
    //         pull.values(msgs),
    //         pull.filter(msg => !msg.sync)
    //       )
    //     )
    //   })

    //   // Return collection as source to a pull stream
    //   return source
    // }

    // function getSubscribedChannels (opts, cb) {
    //   // reduced state of subscriptions to be up to date
    //   pull(
    //     view.read(opts),
    //     pull.collect((err, msgs) => {
    //       if (err) return cb(err)
    //       // return an up to date collection
    //       cb(null, msgs)
    //     })
    //   )
    // }
