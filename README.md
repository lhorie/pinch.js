# pinch.js

jQuery pinch events for browsers w/ touch event support.

- Supports multiple simultaneous pinch events
- Provides easy integration with CSS3 2D transform via the `pinchchange` event

[Click here to view a demo](http://lhorie.github.com/pinch.js/)

## API

### `pinchstart`, `pinchmove` and `pinchend`

The event parameter contains some additional data:

- `e.offsetLeft` and `e.offsetTop` - the center point between the two touch events that make up the pinch, relative to the value on pinch start
- `e.scale` - the scale relative to its value on pinch start
- `e.angle` - the angle relative to its value on pinch start
- `e.prefix` - the vendor prefix for CSS3 transforms, e.g. `-webkit-`

```javascript
$(document).on("pinchstart pinchmove pinchend", function(e) {
	console.log("left: " + e.offsetLeft + "px")	//left is 0px at pinchstart
	console.log("top: " + e.offsetTop + "px")	//top is 0px at pinchstart
	console.log("scale: " + e.scale)			//scale is 1 at pinchstart
	console.log("angle: " + e.angle + "deg")	//angle is 0deg at pinchstart
})
```

To prevent zooming and bouncing in iOS browsers, call `e.preventDefault()` on `pinchstart`.

### `pinchchange`

This event is similar to `pinchmove`, but its event data is relative to their respective values on `pinchstart` PLUS the
[CSS3 translate(), rotate() and scale() values](http://www.w3.org/TR/2012/WD-css3-transforms-20120911/#transform-functions) at the time.

This event makes it easy to create zoom and rotation functionality, without having to fumble with state machines and transformation matrices:

```javascript
$("img").on({
	//prevent native zooming and bouncing in iOS
	pinchstart: function(e) {e.preventDefault()},
	pinchchange: function(e) {
		var translate = "translate(" + e.offsetLeft + "px," + e.offsetTop + "px)"
		var scale = "scale(" + e.scale + "," + e.scale + ")"
		var rotate = "rotate(" + e.angle + "deg)"
		var value = translate + " " + scale + " " + rotate
		
		//e.g. -webkit-transform: translate(30px,40px) scale(0.5,0.5) rotate(45deg)
		this.style[e.prefix + "transform"] = value
	}
})
```

