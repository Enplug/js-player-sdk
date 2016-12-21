"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _create = require("babel-runtime/core-js/object/create");

var _create2 = _interopRequireDefault(_create);

exports.default = function () {
  var transformMap = (0, _create2.default)(null);

  /**
   * Returns true if eventName is in the transformMap
   * @param eventName
   * @returns {boolean}
   */
  function hasTransform(eventName) {
    return eventName in transformMap;
  }

  return {
    has: hasTransform,

    addTransform: function addTransform(eventName, transformFn) {
      if (!hasTransform(eventName)) {
        transformMap[eventName] = [];
      }

      return transformMap[eventName].push(transformFn) - 1;
    },
    removeTransform: function removeTransform(eventName, transformFn) {
      if (hasTransform(eventName)) {
        transformMap[eventName] = transformMap[eventName].filter(function (func) {
          return func !== transformFn;
        });
      }
    },
    runTransforms: function runTransforms(eventName, eventData) {
      if (!hasTransform(eventName)) {
        return eventData;
      }

      return transformMap[eventName].reduce(function (currData, transformFn) {
        return transformFn(currData) || currData;
      }, (0, _extends3.default)({}, eventData));
    }
  };
};

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }