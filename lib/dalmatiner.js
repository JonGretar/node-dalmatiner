/*
 * dalmatiner
 * https://github.com/JonGretar/node-dalmatiner
 *
 * Copyright (c) 2014 Jón Grétar Borgþórsson
 * Licensed under the MIT license.
 */

'use strict';
var url = require('url');

var ConnectionUDP = require('./connection/udp');
var ConnectionTCP = require('./connection/tcp');

module.exports = DalmatinerDB;

function DalmatinerDB(connectUrl, bucket, flush_interval) {
	if (!(this instanceof DalmatinerDB)) return new DalmatinerDB(connectUrl, bucket, options);
	var parsedUrl = url.parse(connectUrl);
	this.bucket = bucket || 'nodejs';
	this.protocol = parsedUrl.protocol;
	this.hostname = parsedUrl.hostname;
	this.port = parsedUrl.port;
	this.flush_interval = flush_interval || 5; // Check for valid interval
	if (this.protocol === 'udp:') {
		this.connection = new ConnectionUDP(this.hostname, this.port, this.bucket);
	} else if (this.protocol === 'tcp:') {
		this.connection = new ConnectionTCP(this.hostname, this.port, this.bucket, this.flush_interval);
	} else {
		throw new Error('Unknown Protocol: '+this.protocol);
	}
}

DalmatinerDB.prototype.sendData = function sendData(key, points) {
	var timestamp = Date.now() / 1000;
	this.connection.sendData(timestamp, key, points);
};

DalmatinerDB.prototype.flush = function flush() {
	this.connection.flush();
};
