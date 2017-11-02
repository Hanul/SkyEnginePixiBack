OVERRIDE(SkyEngine.Node, (origin) => {
	
	SkyEngine.Node = CLASS({
		
		preset : () => {
			return origin;
		},
		
		init : (inner, self) => {
			
			let pixiContainer = new PIXI.Container();
			pixiContainer.zIndex = self.getZIndex();
			
			let getPixiContainer = inner.getPixiContainer = () => {
				return pixiContainer;
			};
			
			let addToPixiContainer = self.addToPixiContainer = (pixiChild) => {
				
				let pixiChildren = pixiContainer.children;
				
				let low = 0;
				let high = pixiChildren.length;
				
				while (low < high) {
				
					// >>> 1은 2로 나누고 나머지를 버리는 것과 동일
					let mid = (low + high) >>> 1;
					
					if (pixiChildren[mid].zIndex <= pixiChild.zIndex) {
						low = mid + 1;
					} else {
						high = mid;
					}
				}
				
				pixiContainer.addChildAt(pixiChild, low);
			};
			
			let removeFromPixiContainer = self.removeFromPixiContainer = (pixiChild) => {
				pixiContainer.removeChild(pixiChild);
			};
			
			let centerGraphics;
			
			if (BROWSER_CONFIG.SkyEngine.isDebugMode === true) {
				
				centerGraphics = new PIXI.Graphics();
				
				centerGraphics.lineStyle(1, 0x00FFFF, 1);
				centerGraphics.drawRect(-1, -1, 2, 2);
				
				centerGraphics.moveTo(-15, 0);
				centerGraphics.lineTo(15, 0);
				centerGraphics.moveTo(0, -15);
				centerGraphics.lineTo(0, 15);
				
				centerGraphics.zIndex = 999999;
				
				addToPixiContainer(centerGraphics);
			}
			
			let setZIndex;
			OVERRIDE(self.setZIndex, (origin) => {
				
				setZIndex = self.setZIndex = (zIndex) => {
					//REQUIRED: zIndex
					
					pixiContainer.zIndex = zIndex;
					
					let parentNode = getParent();
					
					if (parentNode !== undefined) {
						parentNode.removeFromPixiContainer(self);
						origin(zIndex);
						parentNode.addToPixiContainer(self);
					}
				};
			});
			
			let appendTo;
			OVERRIDE(self.appendTo, (origin) => {
				
				appendTo = self.appendTo = (node) => {
					//REQUIRED: node
					
					node.addToPixiContainer(pixiContainer);
					
					return origin(node);
				};
			});
			
			let step;
			OVERRIDE(self.step, (origin) => {
				
				step = self.step = (deltaTime) => {
					
					origin(deltaTime);
					
					pixiContainer.x = self.getX();
					pixiContainer.y = self.getY();
					pixiContainer.zIndex = self.getZIndex();
					pixiContainer.pivot.set(self.getCenterX(), self.getCenterY());
					pixiContainer.scale.set(self.getScaleX(), self.getScaleY());
					pixiContainer.rotation = self.getAngle() * Math.PI / 180;
					pixiContainer.alpha = self.getAlpha();
					
					if (centerGraphics !== undefined) {
						centerGraphics.x = self.getCenterX();
						centerGraphics.y = self.getCenterY();
					}
					
					let domWrapper = inner.getDomWrapper();
					
					if (domWrapper !== undefined) {
						
						let ratio = SkyEngine.Screen.getRatio();
						
						domWrapper.addStyle({
							left : SkyEngine.Screen.getLeft() + (SkyEngine.Screen.getWidth() / 2 + self.getDrawingX()) * ratio - domWrapper.getWidth() / 2,
							top : SkyEngine.Screen.getTop() + (SkyEngine.Screen.getHeight() / 2 + self.getDrawingY()) * ratio - domWrapper.getHeight() / 2,
							transform : 'rotate(' + self.getRealRadian() + 'rad) scale(' + ratio * self.getRealScaleX() + ', ' + ratio * self.getRealScaleY() + ')',
							opacity : self.getAlpha()
						});
					}
				};
			});
			
			let remove;
			OVERRIDE(self.remove, (origin) => {
				
				remove = self.remove = () => {
					
					let parentNode = self.getParent();
					
					if (parentNode !== undefined) {
						parentNode.removeFromPixiContainer(pixiContainer);
					}
					
					origin();
				};
			});
		}
	});
});