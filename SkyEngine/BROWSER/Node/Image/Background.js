/*
 * 배경 노드
 */
SkyEngine.Background = CLASS({
	
	preset : () => {
		return SkyEngine.FixedNode;
	},
	
	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.src
		//OPTIONAL: params.isNotToRepeatX
		//OPTIONAL: params.isNotToRepeatY
		//OPTIONAL: params.leftMargin
		//OPTIONAL: params.rightMargin
		//OPTIONAL: params.topMargin
		//OPTIONAL: params.bottomMargin
		
		let src = params.src;
		let isNotToRepeatX = params.isNotToRepeatX;
		let isNotToRepeatY = params.isNotToRepeatY;
		let leftMargin = params.leftMargin;
		let rightMargin = params.rightMargin;
		let topMargin = params.topMargin;
		let bottomMargin = params.bottomMargin;
		
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
							_y -= topMargin + height + bottomMargin;
						}
						
						while (_y + self.getY() < screenY + halfScreenHeight) {
							
							context.drawImage(
								img,
								-width / 2,
								_y,
								width,
								height);
							
							_y += topMargin + height + bottomMargin;
						}
					}
					
					else if (isNotToRepeatY === true) {
						
						let _x = -width / 2;
						
						let screenX = (SkyEngine.Screen.getCameraFollowX() - SkyEngine.Screen.getX()) / SkyEngine.Screen.getRealScaleX() / self.getRealScaleX();
						
						let halfScreenWidth = SkyEngine.Screen.getWidth() / 2 / SkyEngine.Screen.getRealScaleX() / self.getRealScaleX();
						
						while (screenX - halfScreenWidth < _x + self.getX()) {
							_x -= leftMargin + width + rightMargin;
						}
						
						while (_x + self.getX() < screenX + halfScreenWidth) {
							
							context.drawImage(
								img,
								_x,
								-height / 2,
								width,
								height);
							
							_x += leftMargin + width + rightMargin;
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
							_x -= leftMargin + width + rightMargin;
						}
						
						while (screenY - halfScreenHeight < _y + self.getY()) {
							_y -= topMargin + height + bottomMargin;
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
								
								_x2 += leftMargin + width + rightMargin;
							}
							
							_y += topMargin + height + bottomMargin;
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
		
		let getImg = inner.getImg = () => {
			return img;
		};
	}
});
