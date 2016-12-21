"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _defineProperty = require("babel-runtime/core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

var _getOwnPropertyDescriptor = require("babel-runtime/core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

var _getOwnPropertyNames = require("babel-runtime/core-js/object/get-own-property-names");

var _getOwnPropertyNames2 = _interopRequireDefault(_getOwnPropertyNames);

exports.default = copyOwnProps;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copies all "own properties" from one instance to another.
 * It does not return anything since the changes are made directly on the instance.
 *
 * @param {*} instance -- the instance to copy to
 * @param {*} superInstance -- the instance to copy from
 * @returns {undefined}
 */
function copyOwnProps(instance, superInstance) {
  (0, _getOwnPropertyNames2.default)(superInstance).forEach(function (prop) {
    var descriptor = (0, _getOwnPropertyDescriptor2.default)(superInstance, prop);

    if (descriptor) {
      (0, _defineProperty2.default)(instance, prop, descriptor);
    } else {
      instance[prop] = superInstance[prop];
    }
  });
}