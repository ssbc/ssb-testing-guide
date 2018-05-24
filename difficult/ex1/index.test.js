const test = require('tape')
const Server = require('scuttle-testbot')
const pull = require('pull-stream')

test('[Difficult] Exercise 1 - Get a list of all the channels', assert => {
  Server.use(require('./index'))
  const server = Server()

  assert.plan(1)

  var channels = ['myco', 'ssb', 'economics', 'monkeys', 'pineapples', null, 'pineapples', undefined]

  pull(
    pull.values(channels),
    pull.asyncMap((channel, cb) => {
      server.publish({ type: 'post', channel, text: 'hello world' }, cb)
    }),
    pull.collect((err, published) => {
      server.channels.list((err, list) => {
        var sorted = Array.from(new Set(channels.filter(Boolean).sort()))
        assert.deepEqual(list, sorted)
        server.close()
      })
    })
  )
})

test('[Difficult] Exercise 1 - Get a count of the number of posts to a channel', assert => {
  Server.use(require('./index'))
  const server = Server()

  assert.plan(1)

  pull(
    pull.values(['myco', 'myco', 'economics', 'monkeys', 'pineapples', null, 'pineapples', undefined]),
    pull.asyncMap((channel, cb) => {
      server.publish({ type: 'post', channel, text: 'hello world' }, cb)
    }),
    pull.collect((err, published) => {
      server.channels.count((err, collection) => {
        assert.deepEqual(collection, { myco: 2, economics: 1, monkeys: 1, pineapples: 2 })
        server.close()
      })
    })
  )
})

test('[Difficult] Exercise 1 - How many channel mentions in the last minute?', assert => {
  assert.end()
})
