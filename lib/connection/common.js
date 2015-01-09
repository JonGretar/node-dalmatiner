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
