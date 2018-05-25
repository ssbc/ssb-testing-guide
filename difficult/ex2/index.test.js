const test = require('tape')
const Server = require('scuttle-testbot')
const pull = require('pull-stream')

test('[Difficult] Exercise 2 - Get a live stream list of channels a given user is subscribed to', assert => {
  Server.use(require('./index'))
  const server = Server()
  // A channel can be subscribed to and unsubscribed from,
  // therefore we need to draw the current state of a user's relationship with a given channel

  assert.plan(1)

  // Construct two independent identities to ensure we narrow the field
  const grace = server.createFeed()
  const elvis = server.createFeed()

  // Pre-populate before setting up live stream
  grace.publish({ type: 'channel', channel: 'mycology', subscribed: true  }, (err, msg) => {
    grace.publish({ type: 'channel', channel: 'mycology', subscribed: false }, (err, msg) => {

      var collection

      pull(
        server.channels.read({ values: false, keys: true, live: true }),
        pull.filter(msg => !msg.sync),
        pull.filter(msg => msg.key !== undefined), // no idea why { key: undefined, seq: undefined } is coming through
        pull.drain(msg => {
          collection = reduce(collection, msg)

          if (msg.key[0] === 'ruby') {
            result = {}
            result[grace.id] = [
              { channel: 'mycology', subscribed: true },
              { channel: 'ruby', subscribed: true }
            ]
            result[elvis.id] = [
              { channel: 'mycology', subscribed: true },
              { channel: 'scuttlebutt', subscribed: false }
            ]

            assert.deepEqual(collection, result)
            server.close()
          }

          function reduce (collection, msg) {
            collection = collection || {}
            const [ channel, author, timestamp, subscribed ] = msg.key
            collection[author] = collection[author] || []
            var channelIndex = collection[author].findIndex(sub => sub.channel === channel)
            if (channelIndex !== -1) collection[author][channelIndex].subscribed = subscribed
            else collection[author].push({ channel, subscribed })
            return collection
          }

        })
      )

      grace.publish({ type: 'channel', channel: 'mycology', subscribed: true  }, (err, msg) => {
        elvis.publish({ type: 'channel', channel: 'mycology', subscribed: true  }, (err, msg) => {
          elvis.publish({ type: 'channel', channel: 'scuttlebutt', subscribed: true  }, (err, msg) => {
            elvis.publish({ type: 'channel', channel: 'scuttlebutt', subscribed: false }, (err, msg) => {
              grace.publish({ type: 'channel', channel: 'ruby', subscribed: true  }, () => {
                // these should now stream through to live pull stream above
              })
            })
          })
        })
      })
    })
  })
})

// test('get a list of channels ordered by how many people subscribed to each', assert => {
//   Server.use(require('./index'))
//   const server = Server()

//   assert.plan(1)

//   var grace = server.createFeed()
//   var elvis = server.createFeed()


//   function cb (msg) {
//     server.channels.popular
//   }

//   server.close()
//   assert.end()
// })

// (source) get a list of channels a given user is subscribed to
// this needs to be a live stream in some way
// probably the reduced state of channels you're currently subscribed to, then { sync: true  } followed by live updates from now on... (to discuss)
// (async) a list of all channels
// ordered by how many subscribed to each

// grace.publish({ type: 'post', channel: 'mycology', text: 'fly agarics all over' }, (err, msg) => {
//   elvis.publish({ type: 'post', channel: 'mycology', text: 'lets talk about clathrus archerii' }, (err, msg) => {
//     elvis.publish({ type: 'post', channel: 'mycology', text: 'no lets talk about stinkhorns' }, (err, msg) => {
//       elvis.publish({ type: 'post', channel: 'mycology', text: 'id like to talk about mycelium' }, (err, msg) => {
  // // Get current state
  // pull(
  //   server.channels.subscriptions({ live: false }),
  //   pull.collect((err, collection) => {
  //     // Stream new messages
  //     pull(
  //       server.channels.subscriptions({ live: true }), // defaults to { live: true }
  //       pull.filter(msg => !msg.sync),
  //       pull.drain(msg => {
  //         console.log(msg)
  //         collection.reduce((state, msg) => {

  //         }, {})
  //         if (msg.key[0] === 'ruby') {
  //           assert.end()
  //           server.close()
  //         }
  //       })
  //     )
  //   })
  // )
