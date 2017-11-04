OVERRIDE(SkyEngine.Background, (origin) => {
	
	SkyEngine.Background = CLASS({
		
		preset : () => {
			return origin;
		},
		
		init : (inner, self, params) => {
			//REQUIRED: params
			//REQUIRED: params.src
			//OPTIONAL: params.isNotToRepeatX
			//OPTIONAL: params.isNotToRepeatY
			//OPTIONAL: params.followScreenRatio
			//OPTIONAL: params.leftMargin
			//OPTIONAL: params.rightMargin
			//OPTIONAL: params.topMargin
			//OPTIONAL: params.bottomMargin
			
			let src = params.src;
			let isNotToRepeatX = params.isNotToRepeatX;
			let isNotToRepeatY = params.isNotToRepeatY;
			let followScreenRatio = params.followScreenRatio;
			let leftMargin = params.leftMargin;
			let rightMargin = params.rightMargin;
			let topMargin = params.topMargin;
			let bottomMargin = params.bottomMargin;
			
			if (followScreenRatio === undefined) {
				followScreenRatio = 0;
			}
			
			if (leftMargin === undefined) {
				leftMargin = 0;
			}
			if (rightMargin === undefined) {
				rightMargin = 0;
			}
			if (topMargin === undefined) {
				topMargin = 0;
			}
			if (bottomMargin === undefined) {
				bottomMargin = 0;
			}
			
			let tilingSprite;
			let imageWidth;
			let imageHeight;
			
			self.on('load', () => {
				
				if (self.checkIsRemoved() !== true) {
					
					let img = inner.getImg();
					
					let screenWidth = SkyEngine.Screen.getWidth() / SkyEngine.Screen.getRealScaleX() / self.getRealScaleX();
					let screenHeight = SkyEngine.Screen.getHeight() / SkyEngine.Screen.getRealScaleY() / self.getRealScaleY();
					
					tilingSprite = new PIXI.TilingSprite.fromImage(img.src, screenWidth, screenHeight);
					
					tilingSprite.anchor.x = 0.5;
					tilingSprite.anchor.y = 0.5;
					
					imageWidth = img.width;
					imageHeight = img.height;
					
					tilingSprite.tilePosition.x = (screenWidth - imageWidth) / 2;
					tilingSprite.tilePosition.y = (screenHeight - imageHeight) / 2;
					
					tilingSprite.blendMode = SkyEnginePixiBack.Util.getPixiBlendMode(self.getBlendMode());
					
					self.addToPixiContainer(tilingSprite);
				}
			});
			
			let step;
			OVERRIDE(self.step, (origin) => {
				
				step = self.step = (deltaTime) => {
					
					origin(deltaTime);
					
					if (tilingSprite !== undefined) {
						
						let screenWidth = SkyEngine.Screen.getWidth() / SkyEngine.Screen.getRealScaleX() / self.getRealScaleX();
						let screenHeight = SkyEngine.Screen.getHeight() / SkyEngine.Screen.getRealScaleY() / self.getRealScaleY();
						
						tilingSprite.x = -self.getX();
						tilingSprite.y = -self.getY();
						
						tilingSprite.tilePosition.x = (screenWidth - imageWidth) / 2 + self.getX();
						tilingSprite.tilePosition.y = (screenHeight - imageHeight) / 2 + self.getY();
					}
				};
			});
		}
	});
});