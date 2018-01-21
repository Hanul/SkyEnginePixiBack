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
			
			// 개발 모드에서는 중점 및 영역 표시
			if (BROWSER_CONFIG.SkyEngine.isDebugMode === true) {
				
				centerGraphics = new PIXI.Graphics();
				
				// 중점을 그립니다.
				centerGraphics.lineStyle(1, 0x00FFFF, 1);
				centerGraphics.drawRect(-1, -1, 2, 2);
				
				centerGraphics.moveTo(-15, 0);
				centerGraphics.lineTo(15, 0);
				centerGraphics.moveTo(0, -15);
				centerGraphics.lineTo(0, 15);
				
				// 터치 영역을 그립니다.
				let touchAreas = self.getTouchAreas();
				
				centerGraphics.lineStyle(1, 0xFF00FF, 1);
				
				for (let i = 0; i < touchAreas.length; i += 1) {
					touchAreas[i].drawPixiArea(centerGraphics);
				}
				
				// 충돌 영역을 그립니다.
				let colliders = self.getColliders();
				
				centerGraphics.lineStyle(1, 0x00FF00, 1);
				
				for (let i = 0; i < colliders.length; i += 1) {
					colliders[i].drawPixiArea(centerGraphics);
				}
				
				centerGraphics.zIndex = 999999;
				addToPixiContainer(centerGraphics);
				
				let addTouchArea;
				OVERRIDE(self.addTouchArea, (origin) => {
					
					addTouchArea = self.addTouchArea = (touchArea) => {
						
						centerGraphics.lineStyle(1, 0xFF00FF, 1);
						touchArea.drawPixiArea(centerGraphics);
						
						origin(touchArea);
					};
				});
				
				let addCollider;
				OVERRIDE(self.addCollider, (origin) => {
					
					addCollider = self.addCollider = (collider) => {
						
						centerGraphics.lineStyle(1, 0x00FF00, 1);
						collider.drawPixiArea(centerGraphics);
						
						origin(collider);
					};
				});
			}
			
			let setZIndex;
			OVERRIDE(self.setZIndex, (origin) => {
				
				setZIndex = self.setZIndex = (zIndex) => {
					//REQUIRED: zIndex
					
					pixiContainer.zIndex = zIndex;
					
					let parentNode = self.getParent();
					
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
					
					// BUG FIX
					if (node !== undefined) {
						node.addToPixiContainer(pixiContainer);
					}
					
					return origin(node);
				};
			});
			
			let isFirst = true;
			
			let addDom;
			OVERRIDE(self.addDom, (origin) => {
				
				addDom = self.addDom = (dom) => {
					//REQUIRED: dom
					
					origin(dom);
					
					let domWrapper = inner.getDomWrapper();
					
					if (self.checkIsRemoved() !== true && domWrapper !== undefined) {
						
						let ratio = SkyEngine.Screen.getRatio();
						
						domWrapper.addStyle({
							left : SkyEngine.Screen.getLeft() + (SkyEngine.Screen.getWidth() / 2 + self.getDrawingX() - SkyEngine.Screen.getCameraFollowX()) * ratio - domWrapper.getWidth() / 2,
							top : SkyEngine.Screen.getTop() + (SkyEngine.Screen.getHeight() / 2 + self.getDrawingY() - SkyEngine.Screen.getCameraFollowY()) * ratio - domWrapper.getHeight() / 2,
							transform : 'rotate(' + self.getRealRadian() + 'rad) scale(' + ratio * self.getRealScaleX() + ', ' + ratio * self.getRealScaleY() + ')',
							opacity : 0
						});
						
						DELAY(() => {
							domWrapper.addStyle({
								opacity : pixiContainer.worldAlpha
							});
						});
					}
				};
			});
			
			let getDomWrapper;
			OVERRIDE(self.getDomWrapper, (origin) => {
				
				getDomWrapper = self.getDomWrapper = () => {
					//REQUIRED: dom
					
					let domWrapper = inner.getDomWrapper();
					
					if (self.checkIsRemoved() !== true && domWrapper !== undefined) {
						
						let ratio = SkyEngine.Screen.getRatio();
						
						domWrapper.addStyle({
							left : SkyEngine.Screen.getLeft() + (SkyEngine.Screen.getWidth() / 2 + self.getDrawingX() - SkyEngine.Screen.getCameraFollowX()) * ratio - domWrapper.getWidth() / 2,
							top : SkyEngine.Screen.getTop() + (SkyEngine.Screen.getHeight() / 2 + self.getDrawingY() - SkyEngine.Screen.getCameraFollowY()) * ratio - domWrapper.getHeight() / 2,
							transform : 'rotate(' + self.getRealRadian() + 'rad) scale(' + ratio * self.getRealScaleX() + ', ' + ratio * self.getRealScaleY() + ')',
							opacity : 0
						});
						
						DELAY(() => {
							domWrapper.addStyle({
								opacity : pixiContainer.worldAlpha
							});
						});
					}
					
					return origin();
				};
			});
			
			let pixiFilter;
			
			let cachedFilter;
			let cachedPixiFilter;
			
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
					pixiContainer.visible = self.checkIsHiding() !== true;
					
					let filter = self.getFilter();
					
					if (pixiFilter === undefined && filter !== undefined) {
						
						if (filter === cachedFilter) {
							pixiFilter = cachedPixiFilter;
							
							pixiContainer.filters = [pixiFilter];
							
							filter = cachedFilter;
						}
						
						else if (filter.indexOf('grayscale(') !== -1) {
							pixiFilter = cachedPixiFilter = new PIXI.filters.ColorMatrixFilter();
							pixiFilter.desaturate(filter.substring(10, filter.indexOf('%')) / 100);
							
							pixiContainer.filters = [pixiFilter];
							
							cachedFilter = filter;
						}
						
						else if (filter.indexOf('saturate(') !== -1) {
							pixiFilter = cachedPixiFilter = new PIXI.filters.ColorMatrixFilter();
							pixiFilter.saturate(filter.substring(9, filter.indexOf(')')) / 100);
							
							pixiContainer.filters = [pixiFilter];
							
							cachedFilter = filter;
						}
					}
					
					if (pixiFilter !== undefined && filter === undefined) {
						pixiContainer.filters = TO_DELETE;
						pixiFilter = undefined;
					}
					
					if (centerGraphics !== undefined) {
						centerGraphics.x = self.getCenterX();
						centerGraphics.y = self.getCenterY();
					}
					
					let domWrapper = inner.getDomWrapper();
					
					if (self.checkIsRemoved() !== true && domWrapper !== undefined) {
						
						let ratio = SkyEngine.Screen.getRatio();
						
						domWrapper.addStyle({
							left : SkyEngine.Screen.getLeft() + (SkyEngine.Screen.getWidth() / 2 + self.getDrawingX() - SkyEngine.Screen.getCameraFollowX()) * ratio - domWrapper.getWidth() / 2,
							top : SkyEngine.Screen.getTop() + (SkyEngine.Screen.getHeight() / 2 + self.getDrawingY() - SkyEngine.Screen.getCameraFollowY()) * ratio - domWrapper.getHeight() / 2,
							transform : 'rotate(' + self.getRealRadian() + 'rad) scale(' + ratio * self.getRealScaleX() + ', ' + ratio * self.getRealScaleY() + ')',
							opacity : isFirst === true ? 0 : pixiContainer.worldAlpha,
							filter : self.getFilter()
						});
						
						isFirst = false;
					}
				};
			});
			
			let drawPixiArea = self.drawPixiArea = (graphics, color) => {
				//REQUIRED: graphics
				//REQUIRED: color
				
				let children = self.getChildren();
				
				for (let i = 0; i < children.length; i += 1) {
					children[i].drawPixiArea(graphics, color);
				}
			};
			
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