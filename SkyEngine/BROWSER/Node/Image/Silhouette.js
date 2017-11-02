/*
 * 실루엣 노드
 */
SkyEngine.Silhouette = CLASS((cls) => {
	
	const TRANSPARENT_ALPHA = 20;
	
	return {
		
		preset : () => {
			return SkyEngine.Node;
		},
		
		init : (inner, self, params) => {
			//REQUIRED: params
			//REQUIRED: params.src
			//OPTIONAL: params.color
			//OPTIONAL: params.border
			
			let src = params.src;
			let color = params.color;
			let border = params.border;
			
			let checkRectRect = SkyEngine.Util.Collision.checkRectRect;
			
			let borderPixel;
			let borderStyle;
			let borderColor;
			
			if (border !== undefined) {
				let split = border.split(' ');
				borderPixel = INTEGER(split[0]);
				borderStyle = split[1];
				borderColor = split[2];
			}
			
			let img;
			let imageData;
			
			let polygon;
			
			let width;
			let height;
			
			let setSrc = self.setSrc = (_src) => {
				src = _src;
				
				img = new Image();
				
				img.onload = () => {
					
					width = img.width;
					height = img.height;
					
					let imageCanvas = CANVAS({
						style : {
							display : 'none'
						},
						width : width,
						height : height
					}).appendTo(BODY);
					
					let imageContext = imageCanvas.getContext('2d');
					imageContext.drawImage(img, 0, 0, width, height);
					
					let imgData = imageContext.getImageData(0, 0, width, height);
					imageData = imgData.data;
					
					let i, length = imageData.length;
					for (i = 0; i < length; i += 4){
						imageData[i] = 0;
						imageData[i + 1] = 0;
						imageData[i + 2] = 0;
					}
					
					img.onload = undefined;
					
					imageContext.clearRect(0, 0, width, height);
					
					imageContext.putImageData(imgData, 0, 0);
					imageContext.globalCompositeOperation = 'source-in';
					
					imageContext.rect(0, 0, width, height);
					imageContext.fillStyle = color;
					imageContext.fill();
					
					img.src = imageCanvas.getEl().toDataURL();
					
					// clear.
					imgData = undefined;
					imageContext = undefined;
					imageCanvas.remove();
					
					if (border !== undefined) {
						polygon = SkyEngine.Util.ImageData.convertImageDataToPolygon(imageData, width);
					}
					
					self.fireEvent('load');
				};
				
				img.src = src;
			};
			
			setSrc(src);
			
			let checkPoint;
			OVERRIDE(self.checkPoint, (origin) => {
				
				checkPoint = self.checkPoint = (x, y) => {
					
					if (imageData === undefined) {
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
					
					if (imageData !== undefined) {
											
						context.drawImage(
							img,
							-width / 2,
							-height / 2,
							width,
							height);
						
						if (border !== undefined && polygon.length > 0) {
							
							context.beginPath();
							context.moveTo(polygon[0].x - width / 2, polygon[0].y - height / 2);
							
							for (let i = 1; i < polygon.length; i += 1) {
								let point = polygon[i];
								context.lineTo(point.x - width / 2, point.y - height / 2);
							}
							
							context.lineTo(polygon[0].x - width / 2, polygon[0].y - height / 2);
							
							context.lineWidth = borderPixel;
							context.strokeStyle = borderColor;
							
							if (borderStyle === 'dashed') {
								context.setLineDash([5]);
							} else if (borderStyle === 'dotted') {
								context.setLineDash([2]);
							}
							
							context.stroke();
							context.closePath();
						}
					}
					
					origin(context);
				};
			});
			
			let drawArea;
			OVERRIDE(self.drawArea, (origin) => {
				
				drawArea = self.drawArea = (context) => {
					
					if (polygon === undefined) {
						
						if (imageData !== undefined) {
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
