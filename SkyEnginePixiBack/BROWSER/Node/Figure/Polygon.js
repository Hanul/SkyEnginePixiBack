OVERRIDE(SkyEngine.Polygon, (origin) => {
	
	SkyEngine.Polygon = CLASS({
		
		preset : () => {
			return origin;
		},
		
		init : (inner, self, params) => {
			//REQUIRED: params
			//REQUIRED: params.points	다각형을 이루는 점들의 좌표들
			
			let points = params.points;
			
			inner.drawGraphics((graphics) => {
				
				let pixiPoints = [];
				
				EACH(points, (point) => {
					pixiPoints.push(new PIXI.Point(point.x, point.y));
				});
				
				if (points.length > 0) {
					pixiPoints.push(new PIXI.Point(points[0].x, points[0].y));
				}
				
				graphics.drawPolygon(pixiPoints);
			});
		}
	});
});