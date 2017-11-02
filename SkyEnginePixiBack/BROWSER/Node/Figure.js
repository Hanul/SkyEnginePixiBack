OVERRIDE(SkyEngine.Figure, (origin) => {
	
	SkyEngine.Figure = CLASS({
		
		preset : () => {
			return origin;
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
			
			let graphics = new PIXI.Graphics();
			
			self.addToPixiContainer(graphics);
			
			let drawGraphics = inner.drawGraphics = (f) => {
				
				if (border !== undefined) {
					graphics.lineStyle(borderPixel, parseInt(borderColor.substring(1), 16), 1);
				}
				
				if (color !== undefined) {
					graphics.beginFill(parseInt(color.substring(1), 16));
				}
				
				f(graphics);
				
				if (color !== undefined) {
					graphics.endFill();
				}
			};
			
			let setBlendMode;
			OVERRIDE(self.setBlendMode, (origin) => {
				
				setBlendMode = self.setBlendMode = (blendMode) => {
					//REQUIRED: blendMode
					
					graphics.blendMode = SkyEnginePixiBack.Util.getPixiBlendMode(blendMode);
					origin(blendMode);
				};
			});
			
			let removeBlendMode;
			OVERRIDE(self.removeBlendMode, (origin) => {
				
				removeBlendMode = self.removeBlendMode = () => {
					graphics.blendMode = PIXI.BLEND_MODES.NORMAL;
					origin();
				};
			});
		}
	});
});