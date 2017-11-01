SkyEngine('Util').ImageData = OBJECT({

	init : (inner, self) => {

		const TRANSPARENT_ALPHA = 20;
		
		const OUTLINE_DX = [1, 0, 1, 1, -1, 0, -1, 1, 0, 0, 0, 0, -1, 0, -1];
		const OUTLINE_DY = [0, -1, 0, 0, 0, -1, 0, 0, 1, -1, 1, 1, 0, -1, 0];

		let checkImageDataPointIsTransparent = self.checkImageDataPointIsTransparent = (imageData, width, x, y) => {
			return imageData[(y * width + x) * 4 + 3] <= TRANSPARENT_ALPHA;
		};

		let convertImageDataToPolygon = self.convertImageDataToPolygon = (imageData, width) => {
			
			let x = 0;
			let y = 0;
			
			let pdx;
			let pdy;
			
			let startX;
			let startY;
			
			let points = [];
			
			while (true) {
				
				if (checkImageDataPointIsTransparent(imageData, width, x, y) !== true) {
					startX = x;
					startY = y;
					break;
				}
				
				if (x === 0) {
					x = y + 1;
					y = 0;
				} else {
					x = x - 1;
					y = y + 1;
				}
			}
			
			x = startX;
			y = startY;
			
			let dx = 0;
			let dy = 0;

			do {
				let i = 0;
				
				if (checkImageDataPointIsTransparent(imageData, width, x - 1, y - 1) !== true) {
					i += 1;
				}
				if (checkImageDataPointIsTransparent(imageData, width, x, y - 1) !== true) {
					i += 2;
				}
				if (checkImageDataPointIsTransparent(imageData, width, x - 1, y) !== true) {
					i += 4;
				}
				if (checkImageDataPointIsTransparent(imageData, width, x, y) !== true) {
					i += 8;
				}
				
				if (i === 6) {
					dx = pdy === -1 ? -1 : 1;
					dy = 0;
				} else if (i === 9) {
					dx = 0;
					dy = pdx === 1 ? -1 : 1;
				} else if (i < 15) {
					dx = OUTLINE_DX[i];
					dy = OUTLINE_DY[i];
				} else {
					break;
				}
				
				if (dx !== pdx && dy !== pdy) {
					
					points.push({
						x : x,
						y : y
					});
					
					pdx = dx;
					pdy = dy;
				}
				
				x += dx;
				y += dy;
				
				if (x < 0 || y < 0) {
					break;
				}
				
			} while (startX !== x || startY !== y);

			return points;
		};
	}
});
