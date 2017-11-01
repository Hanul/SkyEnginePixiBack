/*
 * 타일맵 노드
 */
SkyEngine.TileMap = CLASS({
	
	preset : () => {
		return SkyEngine.Node;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//REQUIRED: params.tileWidth
		//REQUIRED: params.tileHeight
		//OPTIONAL: params.tileMap
		//OPTIONAL: params.tileKeySet
		//OPTIONAL: params.tileKeyMap
		//OPTIONAL: params.collisionMap
		
		let tileWidth = params.tileWidth;
		let tileHeight = params.tileHeight;
		let tileKeySet = params.tileKeySet;
		let tileKeyMap = params.tileKeyMap;
		let collisionMap = params.collisionMap;
		
		if (tileKeySet === undefined) {
			tileKeySet = {};
		}
		if (tileKeyMap === undefined) {
			tileKeyMap = [];
		}
		if (collisionMap === undefined) {
			collisionMap = [];
		}
		
		let tileNodeMap = [];
		
		let getTileWidth = self.getTileWidth = () => {
			return tileWidth;
		};
		
		let getTileHeight = self.getTileHeight = () => {
			return tileHeight;
		};
		
		let addTileNodeToMap = inner.addTileNodeToMap = (params) => {
			//REQUIRED: params
			//REQUIRED: params.row
			//REQUIRED: params.col
			//REQUIRED: params.tileNode
			
			let row = params.row;
			let col = params.col;
			let tileNode = params.tileNode;
			
			if (tileNodeMap[row] === undefined) {
				tileNodeMap[row] = [];
			}
			tileNodeMap[row][col] = tileNode;
		};
		
		let addTile = self.addTile = (params) => {
			//REQUIRED: params
			//REQUIRED: params.row
			//REQUIRED: params.col
			//OPTIONAL: params.tile
			//OPTIONAL: params.isCollider
			//OPTIONAL: params.key
			
			let row = params.row;
			let col = params.col;
			let tile = params.tile;
			let isCollider = params.isCollider;
			let key = params.key;
			
			if (key !== undefined && tileKeySet[key] !== undefined) {
				tile = tileKeySet[key]();
				
				if (tileKeyMap[row] === undefined) {
					tileKeyMap[row] = [];
				}
				tileKeyMap[row][col] = key;
			}
			
			if (tile !== undefined) {
				
				if (isCollider === true) {
					if (collisionMap[row] === undefined) {
						collisionMap[row] = [];
					}
					collisionMap[row][col] = 1;
				}
				
				let x = col * tileWidth;
				let y = row * tileHeight;
				
				let tileNode;
				
				if (collisionMap[row] !== undefined && collisionMap[row][col] === 1) {
					tileNode = SkyEngine.CollisionTile({
						x : x,
						y : y,
						c : tile,
						collider : SkyEngine.Rect({
							width : tileWidth,
							height : tileHeight
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
				
				addTileNodeToMap({
					row : row,
					col : col,
					tileNode : tileNode
				});
			}
		};
		
		let getTileKey = self.getTileKey = (params) => {
			//REQUIRED: params
			//REQUIRED: params.row
			//REQUIRED: params.col
			
			let row = params.row;
			let col = params.col;
			
			if (tileKeyMap !== undefined && tileKeyMap[row] !== undefined) {
				return tileKeyMap[row][col];
			}
		};
		
		let getTile = self.getTile = (params) => {
			//REQUIRED: params
			//REQUIRED: params.row
			//REQUIRED: params.col
			
			let row = params.row;
			let col = params.col;
			
			if (tileNodeMap[row] !== undefined && tileNodeMap[row][col] !== undefined) {
				return tileNodeMap[row][col].getChildren()[0];
			}
		};
		
		let moveTile = self.moveTile = (params, endHandler) => {
			//REQUIRED: params
			//REQUIRED: params.fromRow
			//REQUIRED: params.fromCol
			//REQUIRED: params.toRow
			//REQUIRED: params.toCol
			//OPTIONAL: params.speed
			//OPTIONAL: params.accel
			//OPTIONAL: endHandler
			
			let fromRow = params.fromRow;
			let fromCol = params.fromCol;
			let toRow = params.toRow;
			let toCol = params.toCol;
			let speed = params.speed;
			let accel = params.accel;
			
			let t;
			
			if (collisionMap[toRow] === undefined) {
				collisionMap[toRow] = [];
			} else {
				t = collisionMap[toRow][toCol];
			}
			
			if (collisionMap[fromRow] === undefined) {
				collisionMap[fromRow] = [];
			} else {
				collisionMap[toRow][toCol] = collisionMap[fromRow][fromCol];
			}
			
			collisionMap[fromRow][fromCol] = t;
			
			t = undefined;
			
			if (tileKeyMap[toRow] === undefined) {
				tileKeyMap[toRow] = [];
			} else {
				t = tileKeyMap[toRow][toCol];
			}
			
			if (tileKeyMap[fromRow] === undefined) {
				tileKeyMap[fromRow] = [];
			} else {
				tileKeyMap[toRow][toCol] = tileKeyMap[fromRow][fromCol];
			}
			
			tileKeyMap[fromRow][fromCol] = t;
			
			let fromTileNode;
			if (tileNodeMap[fromRow] !== undefined) {
				fromTileNode = tileNodeMap[fromRow][fromCol];
			}
			
			let toTileNode;
			if (tileNodeMap[toRow] !== undefined) {
				toTileNode = tileNodeMap[toRow][toCol];
			}
			
			if (fromTileNode !== undefined) {
				
				if (speed !== undefined || accel !== undefined) {
					
					fromTileNode.moveTo({
						x : toCol * tileWidth,
						y : toRow * tileHeight,
						speed : speed,
						accel : accel
					}, endHandler);
					
					endHandler = undefined;
					
				} else {
					fromTileNode.setPosition({
						x : toCol * tileWidth,
						y : toRow * tileHeight
					});
				}
			}
			
			addTileNodeToMap({
				row : toRow,
				col : toCol,
				tileNode : fromTileNode
			});
			
			if (toTileNode === undefined) {
				if (tileNodeMap[fromRow] !== undefined) {
					tileNodeMap[fromRow][fromCol] = undefined;
				}
			} else {
				
				if (speed !== undefined || accel !== undefined) {
					
					toTileNode.moveTo({
						x : fromCol * tileWidth,
						y : fromRow * tileHeight,
						speed : speed,
						accel : accel
					}, endHandler);
					
					endHandler = undefined;
					
				} else {
					toTileNode.setPosition({
						x : fromCol * tileWidth,
						y : fromRow * tileHeight
					});
				}
				
				addTileNodeToMap({
					row : fromRow,
					col : fromCol,
					tileNode : toTileNode
				});
			}
		};
		
		let removeTile = self.removeTile = (params) => {
			//REQUIRED: params
			//REQUIRED: params.row
			//REQUIRED: params.col
			
			let row = params.row;
			let col = params.col;
			
			if (collisionMap[row] !== undefined) {
				collisionMap[row][col] = undefined;
			}
			
			if (tileKeyMap[row] !== undefined) {
				tileKeyMap[row][col] = undefined;
			}
			
			if (tileNodeMap[row] !== undefined && tileNodeMap[row][col] !== undefined) {
				tileNodeMap[row][col].remove();
				tileNodeMap[row][col] = undefined;
			}
		};
		
		let getCollisionMap = self.getCollisionMap = () => {
			return collisionMap;
		};
		
		let empty;
		OVERRIDE(self.empty, (origin) => {
			
			empty = self.empty = () => {
				
				tileKeyMap = [];
				collisionMap = [];
				tileNodeMap = [];
				
				origin();
			};
		});
		
		let findPath = self.findPath = (params) => {
			//REQUIRED: params
			//REQUIRED: params.startRow
			//REQUIRED: params.startCol
			//REQUIRED: params.endRow
			//REQUIRED: params.endCol
			
			let startRow = params.startRow;
			let startCol = params.startCol;
			let endRow = params.endRow;
			let endCol = params.endCol;
			
			let costMap = [];
			
			let queue = [];
			
			let register = (parent, row, col) => {
				
				if (collisionMap[row] !== undefined && collisionMap[row][col] === 0) {
					
					if (costMap[row] === undefined) {
						costMap[row] = [];
					}
					
					let cost = parent.cost + 1;
					
					if (costMap[row][col] === undefined || costMap[row][col] > cost) {
						
						costMap[row][col] = cost;
						
						queue.push({
							parent : parent,
							row : row,
							col : col,
							cost : cost
						});
					}
				}
			};
			
			register({
				cost : -1
			}, startRow, startCol);
			
			while (queue.length > 0) {
				let point = queue.shift();
				
				// 찾았다.
				if (point.row === endRow && point.col === endCol) {
					
					let path = [];
					
					let nowPoint = point;
					
					while (nowPoint.cost >= 0) {
						
						path.unshift({
							row : nowPoint.row,
							col : nowPoint.col
						});
						
						nowPoint = nowPoint.parent;
					}
					
					return path;
				}
				
				register(point, point.row - 1, point.col);
				register(point, point.row, point.col + 1);
				register(point, point.row + 1, point.col);
				register(point, point.row, point.col - 1);
			}
		};
	},
	
	afterInit : (inner, self, params) => {
		
		let tileMap = params.tileMap;
		let tileKeyMap = params.tileKeyMap;
		
		if (tileMap !== undefined) {
			
			EACH(tileMap, (tiles, i) => {
				EACH(tiles, (tile, j) => {
					if (tile !== undefined) {
						self.addTile({
							row : i,
							col : j,
							tile : tile
						});
					}
				});
			});
			
			tileMap = undefined;
		}
		
		if (tileKeyMap !== undefined) {
			
			EACH(tileKeyMap, (tileKeys, i) => {
				EACH(tileKeys, (tileKey, j) => {
					
					self.addTile({
						row : i,
						col : j,
						key : tileKey
					});
				});
			});
		}
	}
});
