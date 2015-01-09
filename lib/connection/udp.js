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
	var self = this;

	// TODO: Predefine the Buffer size
	var buffer = new ByteBuffer(0);

	// Metric Package
	buffer.writeByte(0); // No its a bit right?
	buffer.writeByte(Buffer.byteLength(this.bucket, 'utf8'));
	buffer.writeUTF8String(this.bucket);

	// Metric Payload
	buffer.writeUint64(timestamp);
	buffer.writeUint16(Buffer.byteLength(key, 'utf8'));
	buffer.writeUTF8String(key);
	buffer.writeUint16(points.length * 8);

	// DataPoints
	points.forEach(function (point) {
		common.writeVal(buffer, point);
	});

	// Convert to Buffer
	var message = buffer.toBuffer();

	// Transmit Data
	this.socket.send(message, 0, message.length, this.port, this.host, function(err) {
		if (err) throw err;
		console.log('UDP message sent to ' + self.host +':'+ self.port);
	});

};
