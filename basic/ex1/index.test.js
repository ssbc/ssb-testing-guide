const test = require('tape')

test('[Basic] Exercise 1 - Hello World', t => {
  t.equal(2 + 2, 4, "basic addition works!")
  t.end()
})

test('[Basic] Exercise 1 - Async hello world', t => {
  t.plan(1)
  setTimeout(() => {
    t.equal(2 + 2, 4, "basic addition works!")
    // Could put t.end here alternatively!
  })
})

test('[Basic] Exercise 1 - Throws hello world', t => {
  t.plan(1)
  t.throws(() => {
    throw new Error("Hello world!")
  })
})
