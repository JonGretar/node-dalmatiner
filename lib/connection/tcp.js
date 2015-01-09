'use strict';
var net = require('net');
var ByteBuffer = require('bytebuffer');

var common = require('./common');

module.exports = ConnectionTCP;

function ConnectionTCP(host, port, bucket) {
	var self = this;
	this.host = host;
	this.port = port;
	this.bucket = bucket;
	this.socket = net.connect(this.port, this.host);

	this.socket.on('connect', function () {
		console.log('connected');

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
		buffer.writeUint8(2);  // The Delay. Is it the 0-100 range?
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
	// TODO: Predefine the Buffer size
	var buffer = new ByteBuffer(0);

	// Metric Payload
	buffer.writeUint8(5); // No its a bit, right, not a byte?
	buffer.writeUint64(timestamp); // 64 bits of timetamp
	buffer.writeUint16(Buffer.byteLength(key, 'utf8'));  // Length of metric name in 16 bits
	buffer.writeUTF8String(key); // The Metric name
	buffer.writeUint32(points.length * 8); // 16 bits of full size og the datapoints

	// DataPoints
	points.forEach(function (point) {
		common.writeVal(buffer, point);
	});

	self.socket.write(buffer.toBuffer());
};
