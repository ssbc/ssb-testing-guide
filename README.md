# SSB Testing Guide

> This can also be found on git-ssb `ssb://%0h4DOgNbTfEufWGKW8RbbhCXa76U0AglQSbn/cD4Pjc=.sha256`

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
