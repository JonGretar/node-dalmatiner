# dalmatiner

DalmatinerDB Client

[![Build Status](https://secure.travis-ci.org/JonGretar/dalmatiner.png?branch=master)](http://travis-ci.org/JonGretar/dalmatiner) [![NPM version](https://badge-me.herokuapp.com/api/npm/dalmatiner.png)](http://badges.enytc.com/for/npm/dalmatiner)

## Getting Started
Install the module with: `npm install dalmatiner`

```javascript
var Dalmatiner = require('dalmatiner');
var conn = new Dalmatiner('tcp://localhost:5555', 'mybucket');
conn.sendData('my.key', [100]);
conn.sendData('my.key', [120, 300]);
```

## License
[MIT](http://opensource.org/licenses/MIT) © 2014, Jón Grétar Borgþórsson
