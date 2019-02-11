import Penpal from 'penpal';

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
        this._connection = Penpal.connectToParent({
          methods: methods
        });

        return this._connection.promise.then( (parent) => {
          this._parent = parent;
          Object.keys(parent).forEach( (key) => {
            this[key] = (params) => {
              console.assert(this._parent, "StreamBIM parent frame not found");
              return this._parent[key](params);
            }
          })
        });
      }
    }
  }
);
