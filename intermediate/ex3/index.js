const flumeView = require('flumeview-reduce')

const NAME = 'channel'
const VERSION = 3

module.exports = {
  name: NAME,
  version: VERSION,
  manifest: {
    all: 'async',
    count: 'async'
  },
  init: function (server, config) {
    // Our original view
    const view = server._flumeUse(
      NAME,
      flumeView(
        VERSION,
        (soFar, channels) => {
          // reduce
          channels.forEach(channel => {
            soFar[channel] = (soFar[channel] || 0) + 1
          })
          return soFar
        },
        (msg) => {
          // map
          var { content } = msg.value
          var mentions = [
            ...content.mentions || [],
            { link: content.channel }
          ]
          // Put content.channel in list, even if null / undefined
          channels = mentions
            // map to string
            .map(men => men.link)
            // remove falsey
            .filter(Boolean)
            // remove #
            .map(parseChannel)

          // remove duplicates and return array
          return Array.from(new Set(channels))

          function parseChannel (channel) {
            return channel.replace('#', '')
          }
        },
        null,
        {}
      )
    )

    return {
      all: view.get,
      count: (name, cb) => {
        view.get((err, data) => {
          cb(null, data[name])
        })
      }
    }
  }
}
