const test = require('tape')
const Server = require('scuttle-testbot')
const pull = require('pull-stream')

// this test is the same except we're using the V3 view
test('[Intermediate] Exercise 3 - Get a count of the number of posts to a channel', t => {
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
        t.deepEqual(data, { myco: 1, ssb: 1, economics: 1, monkeys: 1, pineapples: 2 })
        server.close()
      })
    })
  )
})

// this test is the same except we're using the V3 view
test('[Intermediate] Exercise 3 - Get a count of how many times all channels have been mentioned', t => {
  Server.use(require('./index'))
  const server = Server()

  t.plan(1)

  pull(
    pull.values(['#myco', '#ssb', '#economics', '#monkeys', '#pineapples', null, '#pineapples', undefined]),
    pull.asyncMap((channel, cb) => {
      server.publish({ type: 'post', text: `hello world ${ channel }`, mentions: [{ link: channel }] }, cb)
    }),
    pull.collect((err, msgs) => {
      server.channel.all((err, data) => {
        t.deepEqual(data, { myco: 1, ssb: 1, economics: 1, monkeys: 1, pineapples: 2 })
        server.close()
      })
    })
  )
})

test('get a count of a particular channel mentions and omit duplicate mentions', t => {
  Server.use(require('./index'))
  const server = Server()

  t.plan(1)

  pull(
    pull.values([
      { type: 'post', channel: '#myco', text: 'clathrus archerii', mentions: [{ link: '#myco' }, { link: '#mushrooms'}, { link: '#newzealand' }, { link: '#newzealand' }] },
      { type: 'post', channel: '#newzealand', text: 'tongariro', mentions: [{ link: '#newzealand' }, { link: '#hiking' }] },
      { type: 'post', channel: 'monkeys', text: 'always more monkeys OoooAHAHAHA', mentions: [{ link: '#apes' }] }
    ]),
    pull.asyncMap((post, cb) => {
      server.publish(post, cb)
    }),
    pull.collect((err, msgs) => {
      server.channel.count('newzealand', (err, count) => {
        t.equal(count, 2)
        server.close()
      })
    })
  )
})
