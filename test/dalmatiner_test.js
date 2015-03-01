/*
 * dalmatiner
 * https://github.com/JonGretar/node-dalmatiner
 *
 * Copyright (c) 2014 Jón Grétar Borgþórsson
 * Licensed under the MIT license.
 */

'use strict';

var chai = require('chai');
chai.expect();
chai.should();

var dalmatiner = require('../lib/dalmatiner.js');

describe('dalmatiner', function(){
    it('is defined', function(){
      dalmatiner.should.be.a('function');
    });

});
