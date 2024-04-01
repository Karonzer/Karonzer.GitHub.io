/*
	An example for using a HTML5 Canvas as pano-image or as webgl-hotspot.
*/

var krpanoplugin = function () {
	var local = this;
	var krpano = null;
	var plugin = null;

	var canvas = null;
	var canvas_context = null;
	var canvas_width = 512;
	var canvas_height = 512;

	local.registerplugin = function (krpanointerface, pluginpath, pluginobject) {
		krpano = krpanointerface;
		plugin = pluginobject;

		// create the HTML5 canvas object
		canvas = document.createElement("canvas");

		// set the canvas size
		canvas.width = canvas_width;
		canvas.height = canvas_height;
		plugin.registercontentsize(canvas_width, canvas_height);

		// add the canvas as 'videoDOM' element to krpano,
		// krpano then thinks this is a video-element and updates
		// its texture everytime when its currentTime value changes
		plugin.videoDOM = canvas;

		// fake some video-related properties
		plugin.videowidth = canvas_width;
		plugin.videoheight = canvas_height;
		canvas.readyState = 4;
		canvas.videoWidth = canvas_width;
		canvas.videoHeight = canvas_height;
		canvas.currentTime = 1;

		// call a special/internal 'ready' callback
		// needed when used as pano-image, e.g. as <image> <sphere url="plugin:..." /> </image>
		if (plugin.onvideoreadyCB)
			plugin.onvideoreadyCB();

		// draw something
		var ctx = canvas_context = canvas.getContext("2d");

		// a background
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, canvas_width, canvas_height);

		// and a grid
		ctx.fillStyle = "#99AACC";
		for (i = 0; i < canvas_height; i += 32)	ctx.fillRect(0, i, canvas_width, 1);
		for (i = 0; i < canvas_width; i += 32)	ctx.fillRect(i, 0, 1, canvas_height);

		// add plugin API actions for doing something
		plugin.drawline = action_drawline;
	}


	local.unloadplugin = function () {
		plugin.drawline = null;
		plugin = null;
		krpano = null;
		canvas = null;
		canvas_context = null;
	}


	function action_drawline(x1, y1, x2, y2, color)	// x,y are from 0.0 to 1.0
	{
		var ctx = canvas_context;

		x1 *= canvas_width;
		x2 *= canvas_width;
		y1 *= canvas_height;
		y2 *= canvas_height;

		ctx.strokeStyle = "#" + ("000000" + color.toString(16)).slice(-6);
		ctx.beginPath();
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.closePath();
		ctx.stroke();

		// increase the 'video-time' to cause a redrawing
		canvas.currentTime++;
	}
}