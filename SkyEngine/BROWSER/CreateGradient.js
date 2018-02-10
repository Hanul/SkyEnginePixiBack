SkyEngine.CreateGradient = METHOD({
	
	run : (params) => {
		//REQUIRED: params
		//OPTIONAL: params.type
		//REQUIRED: params.startX
		//REQUIRED: params.startY
		//OPTIONAL: params.startRadius
		//REQUIRED: params.endX
		//REQUIRED: params.endY
		//OPTIONAL: params.endRadius
		//REQUIRED: params.colors
		
		let type = params.type;
		let startX = params.startX;
		let startY = params.startY;
		let startRadius = params.startRadius;
		let endX = params.endX;
		let endY = params.endY;
		let endRadius = params.endRadius;
		let colors = params.colors;
		
		let contextGradient;
		
		if (type === 'radial') {
			contextGradient = SkyEngine.Screen.getCanvasContext().createRadialGradient(startX, startY, startRadius, endX, endY, endRadius);
		} else {
			contextGradient = SkyEngine.Screen.getCanvasContext().createLinearGradient(startX, startY, endX, endY);
		}
		
		EACH(colors, (color, i) => {
			contextGradient.addColorStop(i / (colors.length - 1), color);
		});
		
		return contextGradient;
	}
});
