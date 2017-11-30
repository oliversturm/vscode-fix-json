/* global suite, test */

//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

// The module 'assert' provides assertion methods from node
const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
const fixText = require('../extension').fixText;

// Defines a Mocha test suite to group tests of similar kind together
// Decided not to test jsonic behavior.
// suite('fixing', function() {
//   const validSource = `[
//         {
//             int: 42,
//             text: some text
//         }
//     ]`;

//   const validTarget = '[\n  {\n    "int": 42,\n    "text": "some text"\n  }\n]';

//   test('correct object', function() {
//     assert.equal(fixText(validSource), validTarget);
//   });
// });
