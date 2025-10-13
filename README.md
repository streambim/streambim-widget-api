# streambim-widget-api
A JavaScript library for interacting with StreamBIM from within an embedded widget, as well as for using StreamBIM in embedded mode.

Embed the StreamBIM viewer in your own page/app and control it via a promise‑based JavaScript API. This README consolidates the behavior shown in the demo apps so you can quickly wire up integrations.

## Integration

StreamBIM widgets have to be whitelisted and then enabled per StreamBIM project. Please contact support@rendra.io if you want to set up a custom widget for one or more projects. 

## Authentication

If your widget requires authentication you have two options:
1. Handle the authentication in the widget itself
2. Use OpenID Connect and provide us with your identity server etc. StreamBIM will then open your login screen in a popup and persist the token per user across sessions.

> **TL;DR**
> 1) Load `streambim-widget-api.min.js`.
> 2) `StreamBIM.connectToChild(iframe, callbacks)` to establish a connection.
> 3) Call API methods on the returned `StreamBIM` proxy (they all return Promises).


## Contents
- [Install & Build](#install--build)
- [Quick Start](#quick-start)
- [Events (callbacks you can subscribe to)](#events-callbacks-you-can-subscribe-to)
- [Authentication](#authentication)
- [Styling & UI Controls](#styling--ui-controls)
- [API Reference](#api-reference)
  - [Project & User](#project--user)
  - [Camera & Viewport](#camera--viewport)
  - [Navigation](#navigation)
  - [Object Visibility & Highlighting](#object-visibility--highlighting)
  - [Object & Space Info](#object--space-info)
  - [Search & Sets](#search--sets)
  - [Color Coding](#color-coding)
  - [Layers & Grids](#layers--grids)
  - [Screenshots & Maps](#screenshots--maps)
  - [Annotations / Custom Objects](#annotations--custom-objects)
  - [UI State](#ui-state)
  - [Low‑level API](#lowlevel-api)
- [Examples](#examples)

---

## Install & Build
Include the distributed bundle in your page (from `dist/` in this repo or your build pipeline):

```html
<script src="streambim-widget-api.min.js"></script>
```

You host the StreamBIM viewer in an `<iframe>` that points to your project/building and set `embedded=true` in the hash:

```html
<iframe id="streambim_target" src="https://<your-streambim-host>/#/viewer?projectId=...&embedded=true"></iframe>
```

---

## Quick Start
To run a widget inside StreamBIM, call something like this from your widget:

```javascript
import StreamBIM from 'streambim-widget-api';

const methods = {
  pickedObject: function (result) {
    console.log('Clicked at ' + result.guid);
  }
}

StreamBIM.connect(methods).then(function() {
  console.log('Connected!');
});
```

To run StreamBIM in embedded mode, first create an iframe, open a StreamBIM project with embedded=true in the URL parameters, and then call the `connectToChild` method.

```javascript
import StreamBIM from 'streambim-widget-api';

const iframe = document.getElementById('streambim_target');
const projectId = PROJECT_ID;

iframe.src = 'https://app.streambim.com/webapp/default/#/viewer?projectId=' + projectId + '&embedded=true';

const methods = {
  pickedObject: function (result) {
    console.log('Clicked at ' + result.guid);
  }
}

StreamBIM.connectToChild(iframe, methods).then(function() {
  console.log('Connected!');
});
```
All API calls below return a **`Promise`**.

---

## Events (callbacks you can subscribe to)
Register these in the second argument to `connectToChild(iframe, callbacks)`:

- **`pickedObject(result)`** → Fires when the user clicks an object. `result` contains `{ guid, point? }` where `point` is `[x,y,z]` if available.
- **`spacesChanged(guids)`** → When the active space changes (enter/leave), provides current space GUID(s).
- **`floorChanged(floorId)`** → When the active floor changes.
- **`cameraChanged(cameraState)`** → On camera state updates; useful for persisting/restoring view.
- **`beforeInit()`** → Hook called before init; you can set styles, sky color, nav mode, hide UI, perform initial commands, etc.

---

## Authentication
- **`setAuthToken(token: string): Promise<boolean>`** — Provide a bearer token the embedded viewer should use for API requests. Call this in `beforeInit` if you don’t rely on existing session.

---

## Styling & UI Controls
- **`setStyles(css: string): Promise<boolean>`** — Inject CSS into the embedded viewer (e.g., hide buttons, recolor UI).
- **`setSkyColor(color: string): Promise<boolean>`** — Change the 3D background (e.g., `'white'`, `'#000'`, `'rgb(10,20,30)'`).
- **`setNavigationMode(mode: 0|1): Promise<boolean>`** — 0 = Person (walk), 1 = Spin (orbit).
- **`setExpanded(bool: boolean): Promise<boolean>`** — Expand/collapse the embedded widget container (if supported by host page).
- **`setShowExpandButton(bool: boolean): Promise<boolean>`** — Show/hide the expand button.
- **`toggleShowAllFloors(bool: boolean): Promise<boolean>`** — Toggle multi‑floor grid view on/off.

---

## API Reference

### Project & User
- **`getProjectId(): Promise<string>`** — Returns current project ID.
- **`getUserEmail(): Promise<string>`** — Returns logged‑in user’s email/ID.

### Camera & Viewport
- **`getCameraState(): Promise<CameraState>`** — Get the current camera/position/target/up vectors etc.
- **`setCameraState(state: CameraState): Promise<boolean>`** — Set the full camera state.
- **`setCameraPosition(position: [number,number,number]): Promise<boolean>`** — Move camera to world position.
- **`getViewportState(): Promise<any>`** — Get full viewport (camera + extra viewer state) as a serializable object.
- **`setViewportState(state: any): Promise<boolean>`** — Restore viewport state.
- **`applyViewpoint(viewpoint: any): Promise<boolean>`** — Apply a saved viewpoint (semantic shortcut for setting camera & layers/etc.).

### Navigation
- **`gotoObject(guid: string): Promise<boolean>`** — Navigate camera to object.
- **`gotoSpace(guid: string): Promise<boolean>`** — Navigate camera to space by GUID.
- **`gotoFloor(floorId: string|number): Promise<boolean>`** — Jump to floor.
- **`goHome(): Promise<boolean>`** — Return to home/start view (if configured).

### Object Visibility & Highlighting
- **`highlightObject(guid: string): Promise<boolean>`** — Highlight (select) object.
- **`deHighlightObject(guid: string): Promise<boolean>`** — Remove highlight from a single object.
- **`deHighlightAllObjects(): Promise<boolean>`** — Clear all highlights.
- **`hideObject(guid: string): Promise<boolean>`** — Hide a single object by GUID.
- **`showObject(guid: string): Promise<boolean>`** — Show a previously hidden object.
- **`showAllObjects(): Promise<boolean>`** — Reset hidden state for all objects.
- **`highlightSystem(guid: string): Promise<boolean>`** — Highlight all objects belonging to a system.

### Object & Space Info
- **`getObjectInfo(guid: string): Promise<ObjectInfo>`** — Fetch full IFC object info & properties.
- **`getFloors(): Promise<Array<{id:string|number,name:string,height:number}>>`** — All floors including height.
- **`getSpaces(): Promise<string[]>`** — Current space GUIDs where the camera is located.
- **`valuesForObjectProperty(prop: string): Promise<any[]>`** — Distinct values for a `psetName~propKey` pair across the model.

### Search & Sets
- **`findObjects(query: { key: string, value: string, limit?: number }): Promise<string[]>`** — Find GUIDs matching a property filter.
- **`applyObjectSearch(query: ObjectSearchQuery, replace?: boolean): Promise<string[]>`** — Apply a search as the *active* selection (optionally replacing any current set). Supports structured rules, paging and sorting.
- **`getObjectInfoForSearch(query: ObjectSearchQuery): Promise<ObjectInfo[]>`** — Run a search and return info for the result set.
- **`resetObjectSearch(): Promise<boolean>`** — Clear active search/selection.
- **`setSearchVisualizationMode(mode: 'HIDDEN'|'FADED'|'ORIGINAL'): Promise<boolean>`** — How non‑matching elements are shown while a search is active.
- **`zoomToSearchResult(): Promise<boolean>`** — Frame camera to the current active selection.
- **`quickSearch(freetext: string): Promise<any>`** — Search objects/properties by free text; returns matches for UI display.

**Search query shape** (examples):
```js
// simple key/value
{ key: 'System Global Id', value: '08CWGl08rCWBFXLXyoG6Rs', limit: 100 }

// IFC rules with operators and paging/sort
{
  filter: {
    rules: [[{
      buildingId: '1000', psetName: 'BaseQuantities', propKey: 'Height', propValue: '2000', operator: '>'
    }]]
  },
  page: { limit: 1000, skip: 0 },
  sort: { field: 'Name', descending: false }
}
```

### Color Coding
- **`colorCodeObjects(map: Record<GUID,string>): Promise<boolean>`** — Color code objects by GUID→color (hex). Clears color coding when empty map.
- **`colorCodeObjectsWithLegends({ data: Record<GUID,string>, legends: Record<string,string> }): Promise<boolean>`** — Color code objects and display legend labels/colors.
- **`colorCodeSpaces(map: Record<GUID,string>): Promise<boolean>`** — Color code spaces by GUID→color (hex). Clears color coding when empty map.
- **`colorCodeSpacesWithLegends({ data: Record<GUID,string>, legends?: Record<string,string> }): Promise<boolean>`** — Color code spaces by GUID with optional legends.
- **`colorCodeByProperty({ pset?: string, propertyKey?: string } = {}): Promise<boolean>`** — Auto color‑code by property value (viewer decides buckets/colors).

### Layers & Grids
- **`getLayers(): Promise<Record<string, boolean>>`** — Current layer visibility map.
- **`setLayers(layers: Record<string, boolean>): Promise<boolean>`** — Apply a layer visibility map.
- **`showGrids(): Promise<boolean>`** — Show grid lines.
- **`hideGrids(): Promise<boolean>`** — Hide grid lines.

### Screenshots & Maps
- **`takeScreenshot(): Promise<dataURL>`** — PNG data URL of current 3D view.
- **`getMapImage(opts: { width: number, height: number, resolution: number }): Promise<dataURL>`** — Generate overview/detail map image (resolution in meters/pixel).
- **`getAnnotatedFloorplan(position: [number,number,number]): Promise<dataURL|blobURL>`** — Produce a floorplan PDF with an annotation marker near a 3D pick/camera position (use `pickedObject.point` or `cameraState.position`).

### Annotations / Custom Objects
- **`createObject({ center: [x,y,z], name: string }): Promise<GUID>`** — Create a simple annotation object at a world coordinate.

### UI State
- **`setExpanded(bool: boolean): Promise<boolean>`** — Expand/collapse the embedded widget (if host UI supports it).
- **`setShowExpandButton(bool: boolean): Promise<boolean>`** — Show/hide expand button.

### Low‑level API
- **`makeApiRequest({ url: string, body?: any, method?: 'GET'|'POST'|'PUT'|'DELETE', accept?: string, contentType?: string }): Promise<string>`** — Perform an authenticated request from inside the viewer context (helpful for IFC searches/exports). Returns the raw response body (often JSON text) so you can `JSON.parse` it.

---

## Examples

### Color‑coding spaces with legends
```js
const data = { 'SpaceGuidA': '7d7d7d', 'SpaceGuidB': '4abb32', 'SpaceGuidC': 'b90c0c' };
const legends = { 'Not started': '7d7d7d', 'On track': '4abb32', 'Over due': 'b90c0c' };
await StreamBIM.colorCodeSpaces({ data, legends });
await StreamBIM.zoomToSearchResult();
```

### Find & show objects in the same system
```js
const selected = await StreamBIM.getObjectInfo(guid);
const systemGuid = selected.properties['System Global Id'][0];
await StreamBIM.applyObjectSearch({ key: 'System Global Id', value: systemGuid, limit: 100 }, true);
await StreamBIM.setSearchVisualizationMode('FADED');
await StreamBIM.zoomToSearchResult();
```

### Quick screenshot & map tiles
```js
const screenshot = await StreamBIM.takeScreenshot();
document.querySelector('#img').src = screenshot;
const map = await StreamBIM.getMapImage({ width: 1024, height: 768, resolution: 5 });
```

### Using IFC Search + Export directly
```js
// 1) create search
const res = await StreamBIM.makeApiRequest({
  url: '/pgw/project-XXXX/api/v1/ifc-searches',
  method: 'POST',
  body: { rules: [[{ buildingId: '1000', propKey: '@kind', propValue: 'Space' }]] }
});
const { searchId } = JSON.parse(res);

// 2) export result
const fieldNames = btoa('GUID|Name|Long Name|Description');
const json = await StreamBIM.makeApiRequest({
  url: `/pgw/project-XXXX/api/v1/ifc-searches/export/json?searchId=${searchId}&fieldUnion=true&fieldNames=${fieldNames}&page[limit]=1000&page[skip]=0`
});
const spaces = JSON.parse(json).data;
```

---

## Notes & Guarantees
- All methods return a `Promise`. On error, the promise rejects with `{ code: string, detail?: any }`.
- GUIDs are StreamBIM IFC GUIDs unless a method explicitly uses a floor ID.
- Colors accept HEX strings only


