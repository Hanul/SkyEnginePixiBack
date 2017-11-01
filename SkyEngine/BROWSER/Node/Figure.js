/*
 * 도형 노드
 */
SkyEngine.Figure = CLASS({
	
	preset : () => {
		return SkyEngine.Node;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.color
		//OPTIONAL: params.border
		
		let color = params.color;
		let border = params.border;
		
		let borderPixel;
		let borderStyle;
		let borderColor;
		
		if (border !== undefined) {
			let split = border.split(' ');
			borderPixel = INTEGER(split[0]);
			borderStyle = split[1];
			borderColor = split[2];
		}
		
		let draw;
		OVERRIDE(self.draw, (origin) => {
			
			draw = self.draw = (context) => {
				
				// to implement.
				
				if (color !== undefined) {
					context.fillStyle = color;
					context.fill();
				}
				
				if (border !== undefined) {
					context.lineWidth = borderPixel;
					context.strokeStyle = borderColor;
					
					if (borderStyle === 'dashed') {
						context.setLineDash([5]);
					} else if (borderStyle === 'dotted') {
						context.setLineDash([2]);
					}
					
					context.stroke();
				}
				
				context.closePath();
				
				origin(context);
			};
		});
		
		let drawArea;
		OVERRIDE(self.drawArea, (origin) => {
			
			drawArea = self.drawArea = (context) => {
				
				// to implement.
				
				origin(context);
			};
		});
	}
});
