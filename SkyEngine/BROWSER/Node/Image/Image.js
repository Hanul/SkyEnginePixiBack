/*
 * 이미지 노드
 */
SkyEngine.Image = CLASS((cls) => {
	
	const TRANSPARENT_ALPHA = 20;
	
	return {
		
		preset : () => {
			return SkyEngine.Node;
		},
		
		init : (inner, self, params) => {
			//REQUIRED: params
			//REQUIRED: params.src
			
			let src = params.src;
			
			let checkRectRect = SkyEngine.Util.Collision.checkRectRect;
			
			let imageData;
			let isImageDataLoading = false;
			
			let polygon;
			
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
			
			let checkPoint;
			OVERRIDE(self.checkPoint, (origin) => {
				
				checkPoint = self.checkPoint = (x, y) => {
					
					if (imageData === undefined) {
						
						if (isImageDataLoading !== true) {
							
							let tempImg = new Image();
							
							tempImg.onload = () => {
								
								let width = tempImg.width;
								let height = tempImg.height;
								
								let imageCanvas = CANVAS({
									style : {
										display : 'none'
									},
									width : width,
									height : height
								}).appendTo(BODY);
								
								let imageContext = imageCanvas.getContext('2d');
								imageContext.drawImage(tempImg, 0, 0, width, height);
								
								imageData = imageContext.getImageData(0, 0, width, height).data;
								
								// clear.
								imageContext = undefined;
								imageCanvas.remove();
								
								tempImg.onload = undefined;
							};
							
							tempImg.src = src;
							
							isImageDataLoading = true;
						}
						
						return origin(x, y) === true;
					}
					
					let tx = x - self.getDrawingX();
					let ty = y - self.getDrawingY();
					
					let cos = Math.cos(-self.getRealRadian());
					let sin = Math.sin(-self.getRealRadian());
					
					let px = cos * tx - sin * ty;
					let py = cos * ty + sin * tx;
					
					px = parseInt((px + width * self.getRealScaleX() / 2) / self.getRealScaleX());
					py = parseInt((py + height * self.getRealScaleY() / 2) / self.getRealScaleY());
					
					return (px >= 0 && px < width && py >= 0 && py < height && imageData[(py * width + px) * 4 + 3] > TRANSPARENT_ALPHA) || origin(x, y) === true;
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
						width,
						height,
						self.getRealScaleX(),
						self.getRealScaleY(),
						self.getRealSin(),
						self.getRealCos()) === true) {
						
						return false;
					}
					
					return origin();
				};
			});
			
			let draw;
			OVERRIDE(self.draw, (origin) => {
				
				draw = self.draw = (context) => {
					
					context.drawImage(
						img,
						-width / 2,
						-height / 2,
						width,
						height);
					
					origin(context);
				};
			});
			
			let drawArea;
			OVERRIDE(self.drawArea, (origin) => {
				
				drawArea = self.drawArea = (context) => {
					
					if (polygon === undefined) {
						
						if (imageData === undefined) {
							
							if (isImageDataLoading !== true) {
								
								let tempImg = new Image();
								
								tempImg.onload = () => {
									
									let width = tempImg.width;
									let height = tempImg.height;
									
									let imageCanvas = CANVAS({
										style : {
											display : 'none'
										},
										width : width,
										height : height
									}).appendTo(BODY);
									
									let imageContext = imageCanvas.getContext('2d');
									imageContext.drawImage(tempImg, 0, 0, width, height);
									
									imageData = imageContext.getImageData(0, 0, width, height).data;
									
									polygon = SkyEngine.Util.ImageData.convertImageDataToPolygon(imageData, width);
									
									// clear.
									imageContext = undefined;
									imageCanvas.remove();
									
									tempImg.onload = undefined;
								};
								
								tempImg.src = src;
								
								isImageDataLoading = true;
							}
						}
						
						else {
							polygon = SkyEngine.Util.ImageData.convertImageDataToPolygon(imageData, width);
						}
					}
					
					else if (polygon.length > 0) {
						
						context.moveTo(polygon[0].x - width / 2, polygon[0].y - height / 2);
						
						for (let i = 1; i < polygon.length; i += 1) {
							let point = polygon[i];
							context.lineTo(point.x - width / 2, point.y - height / 2);
						}
						
						context.lineTo(polygon[0].x - width / 2, polygon[0].y - height / 2);
					}
					
					origin(context);
				};
			});
			
			let remove;
			OVERRIDE(self.remove, (origin) => {
				
				remove = self.remove = () => {
					
					img.onload = undefined;
					img = undefined;
					
					imageData = undefined;
					
					polygon = undefined;
					
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
	};
});
