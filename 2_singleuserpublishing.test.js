const test = require('tape')
const Server = require('scuttle-testbot')
const pull = require('pull-stream')

test('publish a message and get it back', t => {
  var server = Server()

  t.plan(2)

  var content = {
    type: "post",
    text: "hello world"
  }

  server.publish(content, (err, msg) => {
    t.equal(msg.value.content.type, 'post')
    t.equal(msg.value.content.text, 'hello world')

    // Make sure you close the server or tests will hang
    server.close()
  })
})

test('pull the message and compare with published', t => {
  // this is a demo of using a pull-stream to listen for a message
  // not sure if useful in testing but it demonstrates a different async pattern

  // sink tap turned on but not yet connected to water supply
  // when waters turned on (message published), the tap spews out water into the sink,
  // and the sink drains

  var server = Server()

  t.plan(1)

  pull(
    server.createFeedStream({ live: true }),
    pull.filter(msg => msg.sync !== true), // live streams emit { sync: true } when 'up to speed'
    pull.take(1), // optional, passes only one msg to the sink before closing stream
    pull.drain(msg => {
      t.deepEqual(msg.value.content, content)

      // Make sure you close the server or tests will hang
      server.close()
    })
  )

  var content = {
    type: "post",
    text: "hello world"
  }

  server.publish(content, (err, msg) => {
    // Must provide a callback
  })
})
