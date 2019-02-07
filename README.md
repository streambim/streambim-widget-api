# streambim-widget-api
A JavaScript library for interacting with StreamBIM from within an embedded widget.

## Installation

### Using npm

`npm install streambim-widget-api --save`

And import the library into your code with something like:

```javascript
import StreamBIM from 'streambim-widget-api';

StreamBIM.connect().then(function() {
  console.log('Connected!');
});
```

### CDN

We don't currently have a CDN solution, but you can download, bundle and load the [minified script](dist/streambim-widget-api.min.js), in which case the
library will be available on `window.StreamBIM`
```html
<script src="streambim-widget-api.min.js"></script>
<script>
  window.StreamBIM.connect().then(function() {
    console.log('Connected!');
  });
</script>
```
## Usage

```javascript
StreamBIM.connect({
  pickedObject: function (result) {
    console.log('Clicked at ' + result.guid);
  },
  spacesChanged: function (guids) {
    console.log('Entered space: ' + guids[0]);
  }
}).then( function () {
  console.log('Widget ready');

  StreamBIM.getCameraState().then( (result) => {
    console.log('Got camera state: ', result);
  });
});
```

## API

The API is promise based, which means all functions below return promises. 

### `connect(callbacks)`

This establishes the connection from the widget to StreamBIM. The function returns a promise which has to be fulfilled before any other API calls can be made. 

##### Callbacks

* `pickedObject` (function, optional) Function to be called whenever the user picks an object in StreamBIM. The function has one argument, which is an object containing the picked 3D coordinate and the GUID of the picked object.

* `spacesChanged` (function, optional) Function to be called whenever the user enteres or leaves a space. The function has one argument which is an array of IFC space GUIDs, sorted from the smallest to the largest space. 


### `getCameraState()`
Returns a promise which is resolved with an object containing the camera's position and quaterion. 

### `setCameraState(state)`
Takes an object of the form 
```json
{
  position: [x, y, z],
  quaterion: [x, y, z, w]
}
```
and applies it to the user's camera. 

### `setCameraPosition([x, y, z])`
Moves the camera to position (x, y, z) without modifying the camera's rotation. 

### `getSpaces()`
Returns a promise which is resolved with an array of GUIDs of the spaces the user's camera is currently inside. The spaces are sorted form the smallers to the largest.

### `gotoObject(guid)`
It the GUID is for a space, the camera is moved to the center of the space. If the GUID is for an object, the camera is moved and rotated to look at the object. 

### `highlightObject(guid)`

### `deHighlightObject(guid)`

### `deHighlightAllObjects()`

### `hideObject(guid)`

### `showObject(guid)`

### `showAllObjects()`

### `getViewportState()`
Returns a promise which is resolved with an object containing the entire viewport state, including camera position and rotation, hidden- and highlighted objects, hidden layers and clipping planes. 

### `setViewportState(state)`
Resets the viewport and applies the state, which should be on the same form as returned from `getViewportState()`: 
```json
{
  cameraState: {
    position: [x, y, z],
    quaterion: [x, y, z, w]
  },
  hiddenObjects: [guid],
  highlightedObjects: [guid],
  hiddenLayers: [layerName],
  clippingPlanes: [{}]
}
```

### `takeScreenshot()`

Returns a promise which is resolved with a dataUrl of the 3D screenshot.

## Demo
Please take a look at the [demo](/demo/index.html) widget for a complete implementation example.

## Dependencies

The library is using the excellent Penpal library for secure communication with iframes via postMessage

[Penpal](https://github.com/Aaronius/penpal)

## License

MIT
