# dalmatiner [![NPM version](https://badge-me.herokuapp.com/api/npm/dalmatiner.png)](http://badges.enytc.com/for/npm/dalmatiner)

### Usage

Install the module with: `npm install dalmatiner`

### Creating a client

```javascript
var Dalmatiner = require('dalmatiner');
var conn = new Dalmatiner('tcp://localhost:5555', 'mybucket');
```

The client constructor takes three optional arguments.

#### connect_url

URI to the Dalmatiner backend server. For example: 'tcp://myserver:5555' or 'udp://myserver:4444'.

**Default:** 'tcp://127.0.0.1:5555'

#### bucket_name

The name of the data bucket.

**Default:** 'node-dalmatiner'

#### flush_interval

The connection flush interval of datapoints in a tcp stream.

**Default:** 5


### Sending Data

.sendData takes 2 arguments. First is the composite key. Next is an array of one or more data values.

```javascript
conn.sendData(['website', 'root', 'reponse_time'], [100]);
conn.sendData(['website', 'root', 'reponse_time'], [120, 300]);
```


## License
[MIT © 2015, Jón Grétar Borgþórsson](http://jongretar.mit-license.org/)
