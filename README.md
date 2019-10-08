# streambim-widget-api
A JavaScript library for interacting with StreamBIM from within an embedded widget.

## Integration

StreamBIM widgets have to be whitelisted and then enabled per StreamBIM project. Please contact support@rendra.io if you want to set up a custom widget for one or more projects. 

## Authentication

If your widget requires authentication you have two options:
1. Handle the authentication in the widget itself
2. Use OpenID Connect and provide us with your identity server etc. StreamBIM will then open your login screen in a popup and persist the token per user across sessions.

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

We don't currently have a CDN solution, but you can download, bundle and load the [minified script](https://raw.githubusercontent.com/streambim/streambim-widget-api/master/dist/streambim-widget-api.min.js), in which case the
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

* `pickedObject` (function, optional) Function to be called whenever the user picks an object in StreamBIM. The function has one argument, which is an object containing `point` - the picked 3D coordinate and `guid` - the GUID of the picked object.

* `spacesChanged` (function, optional) Function to be called whenever the user enteres or leaves a space. The function has one argument which is an array of IFC space GUIDs, sorted from the smallest to the largest space. 

* `didExpand` (function, optional) Function to be called whenever the widget is expanded into fullscreen mode, either using the widget API or by the user clicking the expand/contract button in the panel header. 

* `didContract` (function, optional) Function to be called whenever the widget is contracted into side panel mode, either using the widget API or by the user clicking the expand/contract button in the panel header. 


### `getProjectId()`
Returns a promise which is resolved with the project's ID.

### `getUserEmail()`
Returns a promise which is resolved with the authenticated user's email. 

### `getCameraState()`
Returns a promise which is resolved with an object containing the camera's position and quaternion. 

### `setCameraState(state)`
Takes an object of the form 
```javascript
{
  position: [x, y, z],
  quaternion: [x, y, z, w]
}
```
and applies it to the user's camera. 

### `setCameraPosition([x, y, z])`
Moves the camera to position (x, y, z) without modifying the camera's rotation. 

### `getSpaces()`
Returns a promise which is resolved with an array of GUIDs of the spaces the user's camera is currently inside. The spaces are sorted form the smallers to the largest.

### `getObjectInfo(guid)`
Returns a promise which is resolved with an object with various information about the object. 

### `gotoSpace(guid)`
Move the camera to the center of the space.

### `highlightObject(guid)`

### `deHighlightObject(guid)`

### `deHighlightAllObjects()`

### `hideObject(guid)`

### `showObject(guid)`

### `findObjects(query)`
Returns a promise which is resolved with an an array of GUIDs for objects matching the query. 

##### Query options

* `filter.typeObjectGUID` Find objects by type object GUID
* `filter.systemGUID` Find objects by system GUID
* `page.limit` and `page.skip` for pagination

```javascript
{
  filter: {
    typeObjectGUID: "1a7mCik3D1IgMeWf2ZMmvT"
  },
  page: {
    limit: 10,
    skip: 0
  }
}
```

### `applyObjectSearch(filter)`
Filter the 3D scene to show only objects matching the filter. See `findObjects(query)` for filter options.

### `resetObjectSearch()`

### `showAllObjects()`

### `getViewportState()`
Returns a promise which is resolved with an object containing the entire viewport state, including camera position and rotation, hidden- and highlighted objects, hidden layers and clipping planes. 

### `setViewportState(state)`
Resets the viewport and applies the state, which should be on the same form as returned from `getViewportState()`: 
```javascript
{
  cameraState: {
    position: [x, y, z],
    quaternion: [x, y, z, w]
  },
  hiddenObjects: [guid],
  highlightedObjects: [guid],
  hiddenLayers: [layerName],
  clippingPlanes: [{}]
}
```

### `takeScreenshot()`

Returns a promise which is resolved with a dataUrl of the 3D screenshot.

### `setShowExpandButton(bool)`

Show or hide the expand/contract button in the widget panel's header.

### `setExpanded(bool)`

Set to TRUE to expand the widget into fullscreen mode or FALSE to contract the widget into side panel mode.

## Errors
All API calls return promises which, if an error occurs, are rejected with an object which has a `code` and a `detail` field. Code is one of the following: `invalid`, `notFound`, `unknown`, `unauthorized` and `notAllowed`. Detail can contain anything and should only be used for debugging purposes. 

## Demo
Please take a look at the [demo](/demo/index.html) widget for a complete implementation example. Notice the CSS rules to ensure that the content is scrollable on touch devices. 

## Dependencies

The library is using the excellent [Penpal](https://github.com/Aaronius/penpal) library for secure communication with iframes via postMessage

## License

MIT
