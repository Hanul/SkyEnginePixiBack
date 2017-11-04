OVERRIDE(SkyEngine.Line, (origin) => {
	
	SkyEngine.Line = CLASS((cls) => {
		
		let findLineIntersectionPoint = cls.findLineIntersectionPoint = origin.findLineIntersectionPoint;
		let findRectIntersectionPoints = cls.findRectIntersectionPoints = origin.findRectIntersectionPoints;
		let findCircleIntersectionPoints = cls.findCircleIntersectionPoints = origin.findCircleIntersectionPoints;
		let findPolygonIntersectionPoints = cls.findPolygonIntersectionPoints = origin.findPolygonIntersectionPoints;
		
		return {
			preset : () => {
				return origin;
			},
			
			init : (inner, self, params) => {
				//REQUIRED: params
				//REQUIRED: params.startX		직선의 시작 x 좌표
				//REQUIRED: params.startY		직선의 시작 y 좌표
				//REQUIRED: params.endX			직선의 끝 x 좌표
				//REQUIRED: params.endY			직선의 끝 Y 좌표
				//OPTIONAL: params.isEndless	true로 지정하면 양 끝이 무한인 직선을 생성합니다.
				
				let startX = params.startX;
				let startY = params.startY;
				let endX = params.endX;
				let endY = params.endY;
				let isEndless = params.isEndless;
				
				if (isEndless === true) {
					if (Math.abs(endX - startX) < Math.abs(endY - startY)) {
						endX = ((endY - startY < 0 ? -999999 : 999999) - startY) / (endY - startY) * (endX - startX) + startX;
						endY = endY - startY < 0 ? -999999 : 999999;
					} else {
						endY = (endY - startY) / (endX - startX) * ((endX - startX < 0 ? -999999 : 999999) - startX) + startY;
						endX = endX - startX < 0 ? -999999 : 999999;
					}
				}
				
				inner.drawGraphics((graphics) => {
					graphics.moveTo(startX, startY);
					graphics.lineTo(endX, endY);
				});
				
				let drawPixiArea;
				OVERRIDE(self.drawPixiArea, (origin) => {
					
					drawPixiArea = self.drawPixiArea = (graphics) => {
						
						graphics.moveTo(startX, startY);
						graphics.lineTo(endX, endY);
						
						origin(graphics);
					};
				});
			}
		};
	});
});