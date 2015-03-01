'use strict';
var dgram = require('dgram');
var ByteBuffer = require('bytebuffer');

var common = require('./common');

module.exports = ConnectionUDP;

function ConnectionUDP(host, port, bucket) {
	this.host = host;
	this.port = port;
	this.bucket = bucket;
	this.socket = dgram.createSocket('udp4');
}

ConnectionUDP.prototype.flush = function flush() {
	// Flush is not needed for upd.
};

ConnectionUDP.prototype.sendData = function sendData(timestamp, key, points) {
	// TODO: Predefine the Buffer size
	var buffer = new ByteBuffer(0);

	// Metric Package
	buffer.writeUint8(0); // Type
	buffer.writeUint8(Buffer.byteLength(this.bucket, 'utf8')); // Size of Bucket Name
	buffer.writeUTF8String(this.bucket); // Bucket Name

	// Metric Payload
	buffer.writeUint64(timestamp); // Timetamp
	common.writeMetric(buffer, key);
	buffer.writeUint32(points.length * 8); // Full size of the datapoints

	// Write the DataPoints
	points.forEach(function (point) {
		common.writeVal(buffer, point);
	});

	// Convert to Buffer
	var message = buffer.toBuffer();

	// Transmit Data
	this.socket.send(message, 0, message.length, this.port, this.host, function(err) {
		if (err) throw err;
	});

};
