'use strict';

module.exports.writeVal = function writeVal(buf, val) {
	buf.writeInt8(1);
	if (val > 0) {
		// ADD 24 bits of 0
		buf.writeInt8(0);
		buf.writeInt8(0);
		buf.writeInt8(0);
		// And a 32 bit value
		buf.writeInt32(val);
	} else {
		// ADD 24 bits of -1
		buf.writeInt8(-1);
		buf.writeInt8(-1);
		buf.writeInt8(-1);
		// And a 32 bit value
		buf.writeInt32(val);
	}
};
