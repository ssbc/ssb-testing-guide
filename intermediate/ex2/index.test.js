const test = require('tape')
const Server = require('scuttle-testbot')
const pull = require('pull-stream')

// This test is the same except we're using the V2 view
test('[Intermediate] Exercise 2 - Get a count of the number of posts to a channel', t => {
  Server.use(require('./index'))
  const server = Server()

  t.plan(1)

  pull(
    pull.values(['myco', 'ssb', 'economics', 'monkeys', 'pineapples', null, 'pineapples', undefined]),
    pull.asyncMap(function (channel, cb) {
      // write 5 messages to the database
      server.publish({ type: 'post', channel, text: 'hello world' }, cb)
    }),
    pull.collect((err, msgs) => {
      // use channel plugin to find out how many times each channel has been mentioned
      server.channel.all((err, data) => {
        t.deepEqual({ myco: 1, ssb: 1, economics: 1, monkeys: 1, pineapples: 2 }, data)
        server.close()
      })
    })
  )
})

test('[Intermediate] Exercise 2 - Get a count of how many times all channels have been mentioned', t => {
  Server.use(require('./index'))
  const server = Server()

  t.plan(1)

  pull(
    pull.values(['#myco', '#ssb', '#economics', '#monkeys', '#pineapples', null, '#pineapples', undefined]),
    pull.asyncMap(function (channel, cb) {
      server.publish({ type: 'post', text: `hello world ${ channel }`, mentions: [{ link: channel }] }, cb)
    }),
    pull.collect((err, msgs) => {
      // use channel plugin to find out how many times each channel has been mentioned
      server.channel.all((err, data) => {
        t.deepEqual({ myco: 1, ssb: 1, economics: 1, monkeys: 1, pineapples: 2 }, data)
        server.close()
      })
    })
  )
})
