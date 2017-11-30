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
			
			let width = params.width;
			let height = params.height;
			
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
					
					if (CHECK_IS_DATA(color) === true) {
						
						if (width !== undefined && height !== undefined) {
							
							let gradientParams = color;
							
							let canvas = document.createElement('canvas');
							canvas.width = width;
							canvas.height = height;
							
							var context = canvas.getContext('2d');
	
							let contextGradient;
							
							if (gradientParams.type === 'radial') {
								contextGradient = context.createRadialGradient(gradientParams.startX + width / 2, gradientParams.startY + height / 2, gradientParams.startRadius, gradientParams.endX + width / 2, gradientParams.endY + height / 2, gradientParams.endRadius);
							} else {
								contextGradient = context.createLinearGradient(gradientParams.startX + width / 2, gradientParams.startY + height / 2, gradientParams.endX + width / 2, gradientParams.endY + height / 2);
							}
							
							EACH(gradientParams.colors, (color, i) => {
								contextGradient.addColorStop(i / (gradientParams.colors.length - 1), color);
							});
							
							if (self.checkIsInstanceOf(SkyEngine.Circle) === true) {
								context.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, 2 * Math.PI);
							} else {
								context.rect(0, 0, width, height);
							}
							context.fillStyle = contextGradient;
							context.fill();
							
							let sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));
							sprite.x = -width / 2;
							sprite.y = -height / 2;
							
							graphics.addChild(sprite);
						}
					}
					
					else {
						graphics.beginFill(parseInt(color.substring(1), 16));
					}
				}
				
				f(graphics);
				
				if (color !== undefined && CHECK_IS_DATA(color) !== true) {
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