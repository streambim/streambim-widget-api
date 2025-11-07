import { WindowMessenger, connect } from 'penpal';

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
      connectToParent(parentWindow, methods = {}) {
        const parent = parentWindow || window.parent;

        const messenger = new WindowMessenger({
          remoteWindow: parent,
          allowedOrigins: [parent.origin, new URL(document.referrer).origin]
        });

        this._connection = connect({
          messenger: messenger,
          methods: methods
        });

        return this._connection.promise.then( (connection) => {
          this.API = connection;
        });
      },

      connectToChild(iframe, methods = {}) {
        const messenger = new WindowMessenger({
          remoteWindow: iframe.contentWindow,
          allowedOrigins: [new URL(iframe.src).origin]
        });

        this._connection = connect({
          messenger: messenger,
          methods: methods
        });

        return this._connection.promise.then( (connection) => {
          this.API = connection;
        });
      },

      connectToWindow(childWindow, childWindowUrl, methods = {}) {
        const messenger = new WindowMessenger({
          remoteWindow: childWindow,
          allowedOrigins: [new URL(childWindowUrl).origin]
        });

        this._connection = connect({
          messenger: messenger,
          methods: methods
        });

        return this._connection.promise.then((connection) => {
          this.API = connection;
        });
      }
    }
  }
);
