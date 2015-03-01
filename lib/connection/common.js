'use strict';

module.exports.writeVal = function writeVal(buf, val) {
	buf.writeUint8(1);
	if (val > 0) {
		// ADD 24 bits of 0
		buf.writeUint8(0);
		buf.writeUint8(0);
		buf.writeUint8(0);
		// And a 32 bit value
		buf.writeUint32(val);
	} else {
		// ADD 24 bits of -1
		buf.writeUint8(-1);
		buf.writeUint8(-1);
		buf.writeUint8(-1);
		// And a 32 bit value
		buf.writeUint32(val);
	}
};

module.exports.writeMetric = function writeMetric(buf, metric) {
	if (typeof metric === 'string') {
		metric = [metric];
	}

	// Ok... This is horrid work....

	var total_size = 0;
	metric.forEach(function (m) {
		total_size = total_size + 1 + Buffer.byteLength(m, 'utf8');
	});

	buf.writeUint16(total_size);
	metric.forEach(function (m) {
		buf.writeUint8(Buffer.byteLength(m, 'utf8'));
		buf.writeUTF8String(m);
	});

};
