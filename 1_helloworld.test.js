const test = require('tape')

test('hello world', t => {
  t.equal(2 + 2, 4, "basic addition works!")
  t.end()
})

test('async hello world', t => {
  t.plan(1)
  setTimeout(() => {
    t.equal(2 + 2, 4, "basic addition works!")
    // Could put t.end here alternatively!
  })
})

test('throws hello world', t => {
  t.plan(1)
  t.throws(() => {
    throw new Error("Hello world!")
  })
})
