OVERRIDE(SkyEngine.Image, (origin) => {
	
	SkyEngine.Image = CLASS({
		
		preset : () => {
			return origin;
		},
		
		init : (inner, self, params) => {
			//REQUIRED: params
			//REQUIRED: params.src
			
			let src = params.src;
			
			let sprite = new PIXI.Sprite.fromImage(src);
			
			sprite.x = -sprite.width / 2;
			sprite.y = -sprite.height / 2;
			
			self.getPixiContainer().addChild(sprite);
			
			self.fireEvent('load');
			
			let remove;
			OVERRIDE(self.remove, (origin) => {
				
				remove = self.remove = () => {
					
					sprite = undefined;
					
					origin();
				};
			});
		}
	});
});