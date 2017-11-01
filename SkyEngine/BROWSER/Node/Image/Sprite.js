/*
 * 스프라이트 노드
 */
SkyEngine.Sprite = CLASS({
	
	preset : () => {
		return SkyEngine.Node;
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
		let fps = params.fps;
		
		let checkRectRect = SkyEngine.Util.Collision.checkRectRect;
		
		let img;
		let imgs;
		
		let width;
		let height;
		let frameCount;
		
		let realFrame = 0;
		let frame = 0;
		let beforeFrame = 0;
		
		let isStopped = false;
		
		if (fps === undefined) {
			fps = 0;
		}
		
		if (src !== undefined) {
			img = new Image();
			
			img.onload = () => {
				
				width = img.width;
				height = img.height;
				
				if (spriteWidth === undefined) {
					spriteWidth = width;
				}
				
				if (spriteHeight === undefined) {
					spriteHeight = height;
				}
				
				if (frameCount === undefined) {
					frameCount = width / spriteWidth * height / spriteHeight;
				}
				
				img.onload = undefined;
				
				self.fireEvent('load');
			};
			
			img.src = src;
		}
		
		if (srcs !== undefined) {
			EACH(srcs, (src) => {
				
				let img = new Image();
				
				if (imgs === undefined) {
					imgs = [];
				}
					
				img.onload = () => {
					
					width = img.width;
					height = img.height;
					
					if (spriteWidth === undefined) {
						spriteWidth = width;
					}
					
					if (spriteHeight === undefined) {
						spriteHeight = height;
					}
					
					if (frameCount === undefined) {
						frameCount = 1;
					} else {
						frameCount += 1;
					}
					
					img.onload = undefined;
					
					self.fireEvent('load');
				};
				
				img.src = src;
				
				imgs.push(img);
			});
		}
		
		let getFrame = self.getFrame = () => {
			return frame;
		};
		
		let getBeforeFrame = self.getBeforeFrame = () => {
			return beforeFrame;
		};
		
		let stop = self.stop = () => {
			isStopped = true;
		};
		
		let resume = self.resume = () => {
			isStopped = false;
		};
		
		let hide;
		OVERRIDE(self.hide, (origin) => {
			
			hide = self.hide = () => {
				
				realFrame = 0;
				frame = 0;
				beforeFrame = 0;
				
				stop();
				
				origin();
			};
		});
		
		let show;
		OVERRIDE(self.show, (origin) => {
			
			show = self.show = () => {
				
				realFrame = 0;
				frame = 0;
				beforeFrame = 0;
				
				resume();
				
				origin();
			};
		});
		
		let checkOffScreen;
		OVERRIDE(self.checkOffScreen, (origin) => {
			
			checkOffScreen = self.checkOffScreen = () => {
				
				if (width === undefined || checkRectRect(
					
					SkyEngine.Screen.getCameraFollowX(),
					SkyEngine.Screen.getCameraFollowY(),
					SkyEngine.Screen.getWidth(),
					SkyEngine.Screen.getHeight(),
					1,
					1,
					0,
					1,
					
					self.getDrawingX(),
					self.getDrawingY(),
					spriteWidth,
					spriteHeight,
					self.getRealScaleX(),
					self.getRealScaleY(),
					self.getRealSin(),
					self.getRealCos()) === true) {
					
					return false;
				}
				
				return origin();
			};
		});
		
		let step;
		OVERRIDE(self.step, (origin) => {
			
			step = self.step = (deltaTime) => {
				
				if (isStopped !== true) {
					
					if (fps > 0) {
						realFrame += fps * deltaTime;
					}
					
					if (frameCount !== undefined) {
						if (realFrame >= frameCount) {
							realFrame -= frameCount;
							self.fireEvent('animationend');
						}
					}
					
					beforeFrame = frame;
					frame = Math.floor(realFrame);
					
					if (frame !== beforeFrame) {
						self.fireEvent('framechange');
					}
				}
				
				origin(deltaTime);
			};
		});
		
		let draw;
		OVERRIDE(self.draw, (origin) => {
			
			draw = self.draw = (context) => {
				
				if (imgs !== undefined) {
					if (frameCount !== undefined) {
						
						let frameImg = imgs[frame];
						
						if (frameImg !== undefined) {
							
							context.drawImage(
								frameImg,
								-width / 2,
								-height / 2,
								width,
								height);
						}
					}
				}
				
				else if (
				width !== undefined && height !== undefined &&
				spriteWidth !== undefined && spriteHeight !== undefined) {
					
					context.drawImage(
						img,
						spriteWidth * Math.floor(realFrame % (width / spriteWidth)), spriteHeight * Math.floor(realFrame / (width / spriteWidth)),
						spriteWidth, spriteHeight,
						-spriteWidth / 2, -spriteHeight / 2,
						spriteWidth,
						spriteHeight);
				}
				
				origin(context);
			};
		});
		
		let remove;
		OVERRIDE(self.remove, (origin) => {
			
			remove = self.remove = () => {
				
				srcs = undefined;
				
				if (img !== undefined) {
					img.onload = undefined;
					img = undefined;
				}
				
				EACH(imgs, (img) => {
					img.onload = undefined;
				});
				imgs = undefined;
				
				origin();
			};
		});
	}
});
