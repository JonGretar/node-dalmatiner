'use strict';
var net = require('net');
var ByteBuffer = require('bytebuffer');

var common = require('./common');

module.exports = ConnectionTCP;

function ConnectionTCP(host, port, bucket, flush_interval) {
	var self = this;
	this.host = host;
	this.port = port;
	this.bucket = bucket;
	this.flush_interval = flush_interval;
	this.socket = net.connect(this.port, this.host);

	this.socket.on('connect', function () {
		// Example: https://github.com/dalmatinerdb/haggar/blob/5e088554b238220385a8ef7d1ea4597c82a9862e/main.go
		// Build Package to start streaming mode.
		var blen = Buffer.byteLength(self.bucket, 'utf8');
		var size = 1 +    // prefix
		           1 +    // max delta
		           1 +    // Bucket size
		           blen;  // bucket string

		// TODO: Predefine the Buffer size
		var buffer = new ByteBuffer(0);
		buffer.writeUint32(size); // 4 byte prefix
		buffer.writeUint8(4);  // Type
		buffer.writeUint8(this.flush_interval);  // The Delay. Is it the 0-100 range?
		buffer.writeUint8(blen); // Size of Bucket Name
		buffer.writeUTF8String(self.bucket); // Bucket Name

		self.socket.write(buffer.toBuffer());
	});

	this.socket.on('data', function (err, data) {
		console.log('data', err, data);
	});

	this.socket.on('end', function (err, data) {
		console.log('end', err, data);
	});
}

ConnectionTCP.prototype.flush = function flush() {
	var buffer = new ByteBuffer(0);
	buffer.writeByte(6);
	this.socket.write(buffer.toBuffer());
};

ConnectionTCP.prototype.sendData = function sendData(timestamp, key, points) {
	var self = this;

	// Example: https://github.com/dalmatinerdb/haggar/blob/5e088554b238220385a8ef7d1ea4597c82a9862e/util.go

	// TODO: Predefine the Buffer size
	var buffer = new ByteBuffer(0);

	// Metric Payload
	buffer.writeUint8(5); // Command Type
	buffer.writeUint64(timestamp); // Timetamp
	common.writeMetric(buffer, key);
	buffer.writeUint32(points.length * 8); // Full size of the datapoints

	// Write the DataPoints
	points.forEach(function (point) {
		common.writeVal(buffer, point);
	});

	self.socket.write(buffer.toBuffer());
};
