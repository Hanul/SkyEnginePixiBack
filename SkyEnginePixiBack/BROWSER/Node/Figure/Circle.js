OVERRIDE(SkyEngine.Circle, (origin) => {
	
	SkyEngine.Circle = CLASS({
		
		preset : () => {
			return origin;
		},
		
		init : (inner, self, params) => {
			//REQUIRED: params
			//REQUIRED: params.width	원의 너비
			//REQUIRED: params.height	원의 높이
			
			let width = params.width;
			let height = params.height;
			
			inner.drawGraphics((graphics) => {
				graphics.drawEllipse(0, 0, width / 2, height / 2);
			});
		}
	});
});