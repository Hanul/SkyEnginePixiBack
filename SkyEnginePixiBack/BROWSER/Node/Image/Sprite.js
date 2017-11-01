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
			
			if (src !== undefined) {
				
				sprite = new PIXI.Sprite.fromImage(src);
				
				sprite.x = -sprite.width / 2;
				sprite.y = -sprite.height / 2;
				
				self.getPixiContainer().addChild(sprite);
				
				self.fireEvent('load');
			}
			
			if (srcs !== undefined) {
				
				sprites = [];
				
				EACH(srcs, (src) => {
					
					sprite = new PIXI.Sprite.fromImage(src);
					
					sprite.x = -sprite.width / 2;
					sprite.y = -sprite.height / 2;
					
					sprites.push(sprite);
				});
				
				self.fireEvent('load');
			}
			
			let step;
			OVERRIDE(self.step, (origin) => {
				
				step = self.step = (deltaTime) => {
					origin(deltaTime);
					
					if (self.getFrame() !== self.getBeforeFrame()) {
						
						if (nowSprite !== undefined) {
							self.getPixiContainer().removeChild(nowSprite);
						}
						
						nowSprite = sprites[self.getFrame()];
						
						if (nowSprite !== undefined) {
							self.getPixiContainer().addChild(nowSprite);
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