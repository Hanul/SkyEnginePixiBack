/*
 * 배경 노드
 */
SkyEngine.Background = CLASS({
	
	preset : () => {
		return SkyEngine.Node;
	},
	
	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.src
		//OPTIONAL: params.isNotToRepeatX
		//OPTIONAL: params.isNotToRepeatY
		//OPTIONAL: params.followScreenRatio
		
		let src = params.src;
		let isNotToRepeatX = params.isNotToRepeatX;
		let isNotToRepeatY = params.isNotToRepeatY;
		let followScreenRatio = params.followScreenRatio;
		
		if (followScreenRatio === undefined) {
			followScreenRatio = 0;
		}
		
		let width;
		let height;
		
		let img = new Image();
		
		img.onload = () => {
			
			width = img.width;
			height = img.height;
			
			img.onload = undefined;
			
			self.fireEvent('load');
		};
		
		img.src = src;
		
		let beforeScreenX;
		let beforeScreenY;
		
		let step;
		OVERRIDE(self.step, (origin) => {
			
			step = self.step = (deltaTime) => {
				
				if (followScreenRatio !== 1) {
					
					let screenX = SkyEngine.Screen.getCameraFollowX() - SkyEngine.Screen.getX();
					let screenY = SkyEngine.Screen.getCameraFollowY() - SkyEngine.Screen.getY();
					
					if (beforeScreenX !== undefined) {
						self.setX(self.getX() + (screenX - beforeScreenX) * (1 - followScreenRatio) / self.getRealScaleX());
					}
					
					if (beforeScreenY !== undefined) {
						self.setY(self.getY() + (screenY - beforeScreenY) * (1 - followScreenRatio) / self.getRealScaleY());
					}
					
					beforeScreenX = screenX;
					beforeScreenY = screenY;
				}
				
				origin(deltaTime);
			};
		});
		
		let draw;
		OVERRIDE(self.draw, (origin) => {
			
			draw = self.draw = (context) => {
				
				if (width !== undefined) {
					
					if (isNotToRepeatX === true && isNotToRepeatY === true) {
						
						context.drawImage(
							img,
							-width / 2,
							-height / 2,
							width,
							height);
					}
					
					else if (isNotToRepeatX === true) {
						
						let _y = -height / 2;
						
						let screenY = (SkyEngine.Screen.getCameraFollowY() - SkyEngine.Screen.getY()) / SkyEngine.Screen.getRealScaleY() / self.getRealScaleY();
						
						let halfScreenHeight = SkyEngine.Screen.getHeight() / 2 / SkyEngine.Screen.getRealScaleY() / self.getRealScaleY();
						
						while (screenY - halfScreenHeight < _y + self.getY()) {
							_y -= height;
						}
						
						while (_y + self.getY() < screenY + halfScreenHeight) {
							
							context.drawImage(
								img,
								-width / 2,
								_y,
								width,
								height);
							
							_y += height;
						}
					}
					
					else if (isNotToRepeatY === true) {
						
						let _x = -width / 2;
						
						let screenX = (SkyEngine.Screen.getCameraFollowX() - SkyEngine.Screen.getX()) / SkyEngine.Screen.getRealScaleX() / self.getRealScaleX();
						
						let halfScreenWidth = SkyEngine.Screen.getWidth() / 2 / SkyEngine.Screen.getRealScaleX() / self.getRealScaleX();
						
						while (screenX - halfScreenWidth < _x + self.getX()) {
							_x -= width;
						}
						
						while (_x + self.getX() < screenX + halfScreenWidth) {
							
							context.drawImage(
								img,
								_x,
								-height / 2,
								width,
								height);
							
							_x += width;
						}
					}
					
					else {
						
						let _x = -width / 2;
						let _y = -height / 2;
						
						let screenX = (SkyEngine.Screen.getCameraFollowX() - SkyEngine.Screen.getX()) / SkyEngine.Screen.getRealScaleX() / self.getRealScaleX();
						let screenY = (SkyEngine.Screen.getCameraFollowY() - SkyEngine.Screen.getY()) / SkyEngine.Screen.getRealScaleY() / self.getRealScaleY();
						
						let halfScreenWidth = SkyEngine.Screen.getWidth() / 2 / SkyEngine.Screen.getRealScaleX() / self.getRealScaleX();
						let halfScreenHeight = SkyEngine.Screen.getHeight() / 2 / SkyEngine.Screen.getRealScaleY() / self.getRealScaleY();
						
						while (screenX - halfScreenWidth < _x + self.getX()) {
							_x -= width;
						}
						
						while (screenY - halfScreenHeight < _y + self.getY()) {
							_y -= height;
						}
						
						while (_y + self.getY() < screenY + halfScreenHeight) {
							
							let _x2 = _x;
							
							while (_x2 + self.getX() < screenX + halfScreenWidth) {
								
								context.drawImage(
									img,
									_x2,
									_y,
									width,
									height);
								
								_x2 += width;
							}
							
							_y += height;
						}
					}
				}
				
				origin(context);
			};
		});
		
		let remove;
		OVERRIDE(self.remove, (origin) => {
			
			remove = self.remove = () => {
				
				img.onload = undefined;
				img = undefined;
				
				origin();
			};
		});
		
		let getWidth = inner.getWidth = () => {
			return width;
		};
		
		let getHeight = inner.getHeight = () => {
			return height;
		};
	}
});
