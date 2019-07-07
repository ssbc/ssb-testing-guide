# SSB Testing Guide

> This can be found on git-ssb `ssb://%0h4DOgNbTfEufWGKW8RbbhCXa76U0AglQSbn/cD4Pjc=.sha256`

![hermit crab shells](./hermit_crab_shells.jpg)


This is the start of a collection of patterns we've found useful for doing testing in the Scuttlebutt ecosystem

Areas it will hopefully cover (over time):
- [ ] message schemas/ validations
- [x] writing and reading from the database: 
  - [x] callback style
  - [x] streaming style
- [ ] flume indexes
- [ ] UI components
- ...
  
Tools it these will help you get familiar with:
- [tape](http://npmjs.com/tape) - basic assertion tests
- [pull-streams](http://pull-stream.github.io/)
- database queries
  - querying your own [flumeview-level](https://github.com/flumedb/flumeview-level) index
  - [ssb-backlinks](https://github.com/ssbc/ssb-backlinks)
  - [ssb-query](https://github.com/dominictarr/ssb-query)
- hyperscript / [mutant](https://github.com/mmckegg/mutant)
- [electro](https://github.com/dominictarr/electro) - rendering simple UI components (TODO - compare with e.g. budo)
- ...

## Exercises

### [Basic](https://github.com/ssbc/ssb-testing-guide/tree/master/basic)

#### Exercise 1

Get acquainted with testing with the `tape` module

#### Exercise 2

Learn the basics of working with `ssb-server` and how it can easily be tested with `tape`

#### Exercise 3

Publish a message to a `secure-scuttlebut` sigchain. Retrieve the message from the
database using `pull-stream` methods.

### [Intermediate](https://github.com/ssbc/ssb-testing-guide/tree/master/intermediate)

Three exercises focused on `flumeview-reduce`, a view layer on top of the `secure-scuttlebutt` database. Begin with a simple example in exercise one and iterate in lessons two and three.

### [Difficult](https://github.com/ssbc/ssb-testing-guide/tree/master/difficult)

#### Exercise 1

Working with `flumeview-level`! Create a `secure-scuttlebutt` plugin that will
build a customized view of the messages in the database. 

Tests include many examples of useful `pull-stream` methods.

#### Exercise 2

Working with `bytewise` queries and be sure to review the tests for some good examples
of live streaming messages.


### [Hard](https://github.com/ssbc/ssb-testing-guide/blob/master/hard)

#### TODO
