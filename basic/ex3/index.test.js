const test = require('tape')
const Server = require('scuttle-testbot')
const pull = require('pull-stream')
const sort = require('ssb-sort')

test('[Basic] Exercise 3 - Edit a post', t => {
  var server = Server()

  t.plan(1)

  var content = {
    type: "post",
    text: "hello wolard!"
  }

  var edit = {
    type: "post-edit",
    text: "hello world!"
    // root: ???  - this will be the message id of the first post when we know it
  }

  server.publish(content, (err, first) => {
    // now we know the key / root id
    edit.root = first.key

    server.publish(edit, (err, second) => {
      // now we recompile the message using the key of the root

      compilePost(first.key, (err, compiledPost) => {
        t.equal(edit.text, compiledPost.compiledText)

        // Make sure you close the server or tests will hang
        server.close()
      })
    })

  })

  function compilePost (key, cb) {
    // This implemention is hella naive
    // - createFeedStream will stream the ENTIRE database
    // - filters are super brittle, recommend json schema
    // - assumes arriving in correct order

    pull(
      server.createFeedStream(),
      pull.filter(msg => {
        // its a post and key is the same as the key
        // its a post-edit and root is the same as the key
        if (msg.value.content.type === "post" && msg.key === key) return true
        if (msg.value.content.type === "post-edit" && msg.value.content.root && msg.value.content.root === key) return true
      }),
      pull.collect((err, msgs) => {
        var compiledText = msgs.reduce((state, msg) => {
          return msg.value.content.text
        }, "")

        cb(null, { compiledText })
      })
    )
  }
})
