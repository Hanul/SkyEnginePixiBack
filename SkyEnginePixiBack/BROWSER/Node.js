OVERRIDE(SkyEngine.Node, (origin) => {
	
	SkyEngine.Node = CLASS({
		
		preset : () => {
			return origin;
		},
		
		init : (inner, self) => {
			
			let pixiContainer = new PIXI.Container();
			
			let getPixiContainer = self.getPixiContainer = () => {
				return pixiContainer;
			};
			
			let appendTo;
			OVERRIDE(self.appendTo, (origin) => {
				
				appendTo = self.appendTo = (node) => {
					//REQUIRED: node
					
					node.getPixiContainer().addChild(pixiContainer);
					
					return origin(node);
				};
			});
			
			let step;
			OVERRIDE(self.step, (origin) => {
				
				step = self.step = (deltaTime) => {
					
					origin(deltaTime);
					
					pixiContainer.x = self.getX();
					pixiContainer.y = self.getY();
					
					pixiContainer.scale = new PIXI.Point(self.getScaleX(), self.getScaleY());
				};
			});
			
			let remove;
			OVERRIDE(self.remove, (origin) => {
				
				remove = self.remove = () => {
					
					if (self.getParent() !== undefined) {
						self.getParent().getPixiContainer().removeChild(pixiContainer);
					}
					
					origin();
				};
			});
		}
	});
});