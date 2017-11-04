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
			let spriteWidth = params.spriteWidth;
			let spriteHeight = params.spriteHeight;
			
			let imageWidth;
			let imageHeight;
			let frameCount;
			
			let tilingSprite;
			let sprites;
			let nowSprite;
			
			self.on('load', () => {
				
				if (self.checkIsRemoved() !== true) {
					
					if (src !== undefined) {
						
						let img = inner.getImg();
						
						imageWidth = img.width;
						imageHeight = img.height;
						
						if (spriteWidth === undefined) {
							spriteWidth = imageWidth;
						}
						
						if (spriteHeight === undefined) {
							spriteHeight = imageHeight;
						}
						
						if (frameCount === undefined) {
							frameCount = imageWidth / spriteWidth * imageHeight / spriteHeight;
						}
						
						tilingSprite = new PIXI.TilingSprite.fromImage(img.src, spriteWidth, spriteHeight);
						
						tilingSprite.x = -spriteWidth / 2;
						tilingSprite.y = -spriteHeight / 2;
						
						tilingSprite.blendMode = SkyEnginePixiBack.Util.getPixiBlendMode(self.getBlendMode());
						
						self.addToPixiContainer(tilingSprite);
					}
					
					if (srcs !== undefined) {
						
						let imgs = inner.getImgs();
						                        
                        sprites = [];
                        
                        EACH(imgs, (img) => {
                            
                            let sprite = new PIXI.Sprite.fromImage(img.src);
                            
                            sprite.x = -img.width / 2;
                            sprite.y = -img.height / 2;
                            
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
					
					if (tilingSprite !== undefined) {
						tilingSprite.blendMode = SkyEnginePixiBack.Util.getPixiBlendMode(blendMode);
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
					
					if (tilingSprite !== undefined) {
						tilingSprite.blendMode = PIXI.BLEND_MODES.NORMAL;
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
					
					if (self.getFrame() !== self.getBeforeFrame()) {
						
						if (sprites !== undefined) {
							
							if (nowSprite !== undefined) {
								self.removeFromPixiContainer(nowSprite);
							}
							
							nowSprite = sprites[self.getFrame()];
							
							if (nowSprite !== undefined) {
								self.addToPixiContainer(nowSprite);
							}
						}
						
						else if (tilingSprite !== undefined) {
							tilingSprite.tilePosition.x = spriteWidth * Math.floor(inner.getRealFrame() % (imageWidth / spriteWidth));
							tilingSprite.tilePosition.y = spriteHeight * Math.floor(inner.getRealFrame() / (imageWidth / spriteWidth));
						}
					}
				};
			});
			
			let remove;
			OVERRIDE(self.remove, (origin) => {
				
				remove = self.remove = () => {
					
					tilingSprite = undefined;
					sprites = undefined;
					
					origin();
				};
			});
		}
	});
});