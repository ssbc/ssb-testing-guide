const test = require('tape')
const Server = require('scuttle-testbot')
const pull = require('pull-stream')
const sort = require('ssb-sort')


test('[Basic] Exercise 3 - Refactor edit a post', t => {
  // Use backlinks to quickly get related messages using a root id
  Server.use(require('ssb-backlinks'))

  var server = Server()

  t.plan(2)

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
    edit.root = first.key

    compilePost(first.key, (err, compiledPost) => {
      // compiled post is up to date with first message
      t.equal(content.text, compiledPost.compiledText)

      server.publish(edit, (err, second) => {

        compilePost(first.key, (err, compiledPost) => {
          // compiled post now accounts for second message
          t.equal(edit.text, compiledPost.compiledText)

          server.close()
        })
      })
    })
  })

  function compilePost (key, cb) {
    // ssb-backlinks does not return the root so we have to get it first
    server.get(key, (err, value) => {
      const initialText = value.content.text

      pull(
        createBacklinkStream(key),
        pull.filter(msg => isPost(msg) || isPostUpdate(msg)),
        pull.collect((err, msgs) => {
          // ssb-sort orders causally
          var sorted = sort(msgs)
          var compiledText = sorted.reduce((state, msg) => msg.value.content.text, initialText)

          cb(null, { compiledText })
        })
      )
    })

    function isPost (msg) {
      // TODO: Make a schema
      return msg.value.content.type === "post"
        && msg.key === key
    }

    function isPostUpdate (msg) {
      // TODO: Make a schema
      return msg.value.content.type === "post-edit"
        && msg.value.content.root
        && msg.value.content.root === key
    }

    function createBacklinkStream (id) {
      // ssb-backlinks is built on flumeview-query which uses map-filter-reduce
      // This query is copied from backlinks README

      var filterQuery = {
        $filter: {
          dest: id
        }
      }
      // $reduce and $map are other options, see https://github.com/dominictarr/map-filter-reduce

      return server.backlinks.read({
        query: [filterQuery],
        index: 'DTA', // use asserted timestamps
      })
    }
  }
})

