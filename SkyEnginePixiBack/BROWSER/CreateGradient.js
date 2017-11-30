OVERRIDE(SkyEngine.CreateGradient, (origin) => {
	
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
			
			return params;
		}
	});
});
