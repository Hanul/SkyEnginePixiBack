/*
 * 아이소메트릭 타일맵 노드
 */
SkyEngine.IsometricTileMap = CLASS({
	
	preset : () => {
		return SkyEngine.TileMap;
	},
	
	init : (inner, self, params) => {
		
		let addTile;
		OVERRIDE(self.addTile, (origin) => {
			
			addTile = self.addTile = (params) => {
				//REQUIRED: params
				//REQUIRED: params.row
				//REQUIRED: params.col
				//REQUIRED: params.tile
				//OPTIONAL: params.isCollider
				
				let row = params.row;
				let col = params.col;
				let tile = params.tile;
				let isCollider = params.isCollider;
				
				let collisionMap = self.getCollisionMap();
				
				let x = col * self.getTileWidth() + (row % 2) * self.getTileWidth() / 2;
				let y = row * self.getTileHeight() / 2;
				
				if (isCollider === true) {
					if (collisionMap[row] === undefined) {
						collisionMap[row] = [];
					}
					collisionMap[row][col] = 1;
				}
				
				let tileNode;
				
				if (collisionMap[row] !== undefined && collisionMap[row][col] === 1) {
					tileNode = SkyEngine.CollisionTile({
						x : x,
						y : y,
						c : tile,
						collider : SkyEngine.Polygon({
							points : [{
								x : 0,
								y : -self.getTileHeight() / 2
							}, {
								x : self.getTileWidth() / 2,
								y : 0
							}, {
								x : 0,
								y : self.getTileHeight() / 2
							}, {
								x : -self.getTileWidth() / 2,
								y : 0
							}]
						})
					});
				}
				
				else {
					tileNode = SkyEngine.Tile({
						x : x,
						y : y,
						c : tile
					});
				}
				
				self.append(tileNode);
				
				inner.addTileNodeToMap({
					row : row,
					col : col,
					tileNode : tileNode
				});
			};
		});
	}
});
