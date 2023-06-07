import { connectToParent, connectToChild } from 'penpal';

/*!
 * StreamBIM widget API
 *
 * A JavaScript library for interacting with 
 * StreamBIM from within an embedded widget
 * https://github.com/streambim
 *
 * MIT License | (c) Rendra AS 2019
 */

!function (root, name, definition) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof define == 'function' && define.amd) define(name, definition)
  else root[name] = definition()
}(window, 'StreamBIM', function () {
    return {
      connect(methods = {}) {
        this._connection = connectToParent({
          methods: methods
        });

        return this._connection.promise.then( (connection) => {
          this._connection = connection;
          Object.keys(connection).forEach( (key) => {
            this[key] = (params) => {
              console.assert(this._connection, "StreamBIM parent frame not found");
              return this._connection[key](params);
            }
          })
        });
      },
      connectToChild(iframe, methods = {}) {
        this._connection = connectToChild({
          iframe,
          methods: methods
        });

        return this._connection.promise.then( (connection) => {
          this._connection = connection;
          Object.keys(connection).forEach( (key) => {
            this[key] = (params) => {
              console.assert(this._connection, "StreamBIM child frame not found");
              return this._connection[key](params);
            }
          })
        });
      }
    }
  }
);
