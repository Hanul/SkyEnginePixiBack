OVERRIDE(SkyEngine.Sprite, (origin) => {
	
	SkyEngine.Sprite = CLASS({
		
		preset : () => {
			return origin;
		},
		
		init : (inner, self, params) => {
			//REQUIRED: params
			//OPTIONAL: params.src
			//OPTIONAL: params.srcs
			//OPTIONAL: params.spriteWidth
			//OPTIONAL: params.spriteHeight
			//OPTIONAL: params.fps
			
			let src = params.src;
			let srcs = params.srcs;
			
			let sprite;
			let sprites;
			let nowSprite;
			
			self.on('load', () => {
				
				if (self.checkIsRemoved() !== true) {
					
					if (src !== undefined) {
						
						sprite = new PIXI.Sprite.fromImage(src);
						
						sprite.x = -inner.getWidth() / 2;
						sprite.y = -inner.getHeight() / 2;
						
						sprite.blendMode = SkyEnginePixiBack.Util.getPixiBlendMode(self.getBlendMode());
						
						self.addToPixiContainer(sprite);
					}
					
					if (srcs !== undefined) {
						
						sprites = [];
						
						EACH(srcs, (src) => {
							
							sprite = new PIXI.Sprite.fromImage(src);
							
							sprite.x = -inner.getWidth() / 2;
							sprite.y = -inner.getHeight() / 2;
							
							sprite.blendMode = SkyEnginePixiBack.Util.getPixiBlendMode(self.getBlendMode());
							
							sprites.push(sprite);
						});
					}
				}
			});
			
			let setBlendMode;
			OVERRIDE(self.setBlendMode, (origin) => {
				
				setBlendMode = self.setBlendMode = (blendMode) => {
					//REQUIRED: blendMode
					
					if (sprite !== undefined) {
						sprite.blendMode = SkyEnginePixiBack.Util.getPixiBlendMode(blendMode);
					}
					
					if (sprites !== undefined) {
						EACH(sprites, (sprite) => {
							sprite.blendMode = SkyEnginePixiBack.Util.getPixiBlendMode(blendMode);
						});
					}
					
					origin(blendMode);
				};
			});
			
			let removeBlendMode;
			OVERRIDE(self.removeBlendMode, (origin) => {
				
				removeBlendMode = self.removeBlendMode = () => {
					
					if (sprite !== undefined) {
						sprite.blendMode = PIXI.BLEND_MODES.NORMAL;
					}
					
					if (sprites !== undefined) {
						EACH(sprites, (sprite) => {
							sprite.blendMode = PIXI.BLEND_MODES.NORMAL;
						});
					}
					
					origin();
				};
			});
			
			let step;
			OVERRIDE(self.step, (origin) => {
				
				step = self.step = (deltaTime) => {
					origin(deltaTime);
					
					if (sprites !== undefined && self.getFrame() !== self.getBeforeFrame()) {
						
						if (nowSprite !== undefined) {
							self.removeFromPixiContainer(nowSprite);
						}
						
						nowSprite = sprites[self.getFrame()];
						
						if (nowSprite !== undefined) {
							self.addToPixiContainer(nowSprite);
						}
					}
				};
			});
			
			let remove;
			OVERRIDE(self.remove, (origin) => {
				
				remove = self.remove = () => {
					
					sprite = undefined;
					sprites = undefined;
					
					origin();
				};
			});
		}
	});
});