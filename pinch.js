new function() {
	var undefined
	var grouper = {target: null, distance: 0, angle: 0, x: 0, y: 0}.constructor
	var start = []
	var curr = []
	var state = {target: null, scale: 0, angle: 0, x: 0, y: 0}.constructor
	var states = []
	var prefixes = ["", "-webkit-", "-moz-", "-o-", "-ms-"]
	var prefix = prefixes.filter(function(p) {return document.body.style[p + "transform"] !== undefined}).shift() || ""
	var trigger = function(el, e, type, scale, angle, x, y) {
		var event = $.Event(type, {prefix: prefix, scale: scale, angle: angle, offsetLeft: x, offsetTop: y})
		$(el).trigger(event)
		if (event.isDefaultPrevented()) e.preventDefault()
	}
	var delegate = function(type, groups, e) {
		var touches = Array.prototype.slice.call(e.originalEvent.touches)
		var t0, t1
		var filter = function(g) {return g.target == t0.target}
		for (var i = 0; touches.length > 0; i++) {
			t0 = touches.shift()
			t1 = touches.filter(filter).shift()
			if (t1) touches.splice(touches.indexOf(t1), 1)
			else continue
			
			var x0 = t0.clientX, y0 = t0.clientY, x1 = t1.clientX, y1 = t1.clientY
			for (var j = 0; j < groups.length; j++) {
				var group = groups[j]
				var g = group.filter(filter).shift()
				if (!g) group.push(g = new grouper)
				g.target = t0.target
				g.distance = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1))
				g.angle = (Math.atan((y0 - y1) / (x0 - x1)) * 360 / Math.PI) || 0
				g.x = (x0 + x1) / 2
				g.y = (y0 + y1) / 2
			}
			
			var c = curr.filter(filter).shift()
			var s = start.filter(filter).shift()
			if (c) trigger(c.target, e, type, c.distance / s.distance || 1, c.angle - s.angle, c.x - s.x, c.y - s.y)
		}
	}
	$(document).off(".pinch").on({
		"touchstart.pinch": function(e) {delegate("pinchstart", [start, curr], e)},
		"touchmove.pinch": function(e) {delegate("pinchmove", [curr], e)},
		"touchend.pinch": function(e) {
			delegate("pinchend", [curr], e)
			if (e.originalEvent.touches.length == 0) start.length = curr.length = states.length = 0
		},
		"pinchstart.pinch": function(e) {
			var matrix = getComputedStyle(e.target, null).getPropertyValue(prefix + "transform")
			var matches = matrix.match(/[0-9.\-]+/g)
			var values = matches ? matches.map(function(n) {return parseFloat(n)}) : [0, 0, 0, 0, 0, 0]
			var s = states.filter(function(s) {return s.target == e.target}).shift()
			if (!s) states.push(s = new state)
			s.target = e.target
			s.scale = matrix == "none" ? 0 : Math.sqrt(values[0] * values[0] + values[1] * values[1]) - 1
			s.angle = Math.atan2(values[1], values[0]) * (180 / Math.PI)
			s.x = values[4]
			s.y = values[5]
		},
		"pinchmove.pinch": function(e) {
			var s = states.filter(function(s) {return s.target == e.target}).shift()
			if (s) trigger(s.target, e, "pinchchange", s.scale + e.scale, s.angle + e.angle, s.x + e.offsetLeft, s.y + e.offsetTop)
		}
	})
}
