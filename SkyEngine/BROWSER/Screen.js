/*
 * 게임 화면 전체를 다루는 오브젝트
 */
SkyEngine.Screen = OBJECT({
	
	preset : () => {
		return SkyEngine.Node;
	},
	
	init : (inner, self) => {
		
		let wrapper = DIV({
			style : {
				position : 'fixed',
				left : 0,
				top : 0,
				zIndex : -1
			}
		}).appendTo(BODY);
		
		let canvas = CANVAS().appendTo(wrapper);
		let context = canvas.getContext('2d');
		
		let left;
		let top;
		let width;
		let height;
		let ratio;
		
		let deltaTime;
		
		let registeredNodeMap = {};
		
		let cameraFollowCenterX;
		let cameraFollowCenterY;
		let cameraFollowXTarget;
		let cameraFollowYTarget;
		
		// 드로잉 노드 등록
		let registerNode = self.registerNode = (node) => {
			
			let cls = node.type;
			
			while (cls !== undefined && cls !== CLASS) {
				
				if (registeredNodeMap[cls.id] === undefined) {
					registeredNodeMap[cls.id] = [];
				}
				
				registeredNodeMap[cls.id].push(node);
				
				cls = cls.mom;
			}
		};
		
		// 드로잉 노드 해제
		let unregisterNode = self.unregisterNode = (node) => {
			
			let cls = node.type;
			
			while (cls !== undefined && cls !== CLASS) {
				
				if (registeredNodeMap[cls.id] !== undefined) {
					
					let nodes = registeredNodeMap[cls.id];
					
					for (let i = 0; i < nodes.length; i += 1) {
						if (nodes[i] === node) {
							nodes.splice(i, 1);
							break;
						}
					}
					
					if (registeredNodeMap[cls.id].length === 0) {
						delete registeredNodeMap[cls.id];
					}
				}
				
				cls = cls.mom;
			}
		};
		
		let getRegisteredNodes = self.getRegisteredNodes = (cls) => {
			return registeredNodeMap[cls.id] === undefined ? [] : registeredNodeMap[cls.id];
		};
		
		// 디버그 모드에서는 FPS 수치 표시
		if (BROWSER_CONFIG.SkyEngine.isDebugMode === true) {
			
			let fpsDom = DIV({
				style : {
					position : 'fixed',
					left : 5,
					top : 5,
					fontSize : 12,
					zIndex : 999999
				}
			}).appendTo(BODY);
			
			INTERVAL(0.1, () => {
				
				if (deltaTime !== undefined) {
					fpsDom.empty();
					fpsDom.append('FPS: ' + parseInt(1 / deltaTime));
				}
			});
		}
		
		EACH([
			'tap',
			'touchstart',
			'touchend'
		], (eventName) => {
			
			canvas.on(eventName, (e) => {
				
				let isBubblingStoped;
				
				let check = (node) => {
					
					if (isBubblingStoped !== true) {
						
						REVERSE_EACH(node.getChildren(), check);
						
						if (
						node.checkIsEventExists(eventName) === true &&
						node.checkTouch(e.getLeft() - width / 2, e.getTop() - height / 2) === true) {
							
							let se = SkyEngine.E(e);
							
							node.fireEvent({
								eventName : eventName,
								e : se
							});
							
							if (se.checkIsBubblingStoped() === true) {
								isBubblingStoped = true;
							}
						}
					}
				};
				
				check(self);
			});
		});
		
		// 노드의 모든 영역을 그립니다.
		let drawAllArea = (node, context, color) => {
			
			context.save();
			
			context.translate(node.getDrawingX(), node.getDrawingY());
			context.rotate(node.getRealRadian());
			context.scale(node.getRealScaleX(), node.getRealScaleY());
			
			context.lineWidth = 1 / (node.getRealScaleX() > node.getRealScaleY() ? node.getRealScaleX() : node.getRealScaleY());
			
			context.beginPath();
			
			node.drawArea(context);
			
			context.strokeStyle = color;
			context.stroke();
			context.closePath();
			
			context.restore();
			
			let children = node.getChildren();
			
			for (let i = 0; i < children.length; i += 1) {
				drawAllArea(children[i], context, color);
			}
		};
		
		// 모든 노드를 그립니다.
		let drawAll = (node, context, realAlpha) => {
			
			if (node.checkIsHiding() !== true) {
				
				realAlpha *= node.getAlpha();
				
				context.save();
				
				if (node.getBlendMode() !== undefined) {
					context.globalCompositeOperation = node.getBlendMode();
				}
				
				context.save();
				
				context.translate(node.getDrawingX(), node.getDrawingY());
				context.rotate(node.getRealRadian());
				context.scale(node.getRealScaleX(), node.getRealScaleY());
				
				context.globalAlpha = realAlpha;
				
				node.draw(context);
				
				context.restore();
				
				if (node.checkIsRemoved() !== true) {
					
					// 모든 자식 노드를 그립니다.
					let children = node.getChildren();
					
					for (let i = 0; i < children.length; i += 1) {
						drawAll(children[i], context, realAlpha);
					}
				}
				
				context.restore();
				
				// 개발 모드에서는 중점 및 영역 표시
				if (node.checkIsRemoved() !== true && BROWSER_CONFIG.SkyEngine.isDebugMode === true) {
					
					// 중점을 그립니다.
					context.beginPath();
					context.strokeStyle = context.fillStyle = 'aqua';
					
					let realX = node.getRealX();
					let realY = node.getRealY();
					
					context.rect(realX - 1, realY - 1, 2, 2);
					
					context.moveTo(realX - 15, realY);
					context.lineTo(realX + 15, realY);
					context.moveTo(realX, realY - 15);
					context.lineTo(realX, realY + 15);
					context.stroke();
					
					// 터치 영역을 그립니다.
					let touchAreas = node.getTouchAreas();
					
					for (let i = 0; i < touchAreas.length; i += 1) {
						drawAllArea(drawAllArea[i], context, 'magenta');
					}
					
					// 충돌 영역을 그립니다.
					let colliders = node.getColliders();
					
					for (let i = 0; i < colliders.length; i += 1) {
						drawAllArea(colliders[i], context, 'lime');
					}
				}
			}
		};
		
		let loop = LOOP((_deltaTime) => {
			
			deltaTime = _deltaTime;
			
			if (deltaTime > 0.03) {
				deltaTime = 0.03;
			}
			
			if (self.checkIsPaused() !== true) {
				
				SkyEngine.Delay.step(deltaTime);
				SkyEngine.Interval.step(deltaTime);
				
				// 모든 노드의 step을 실행합니다.
				self.step(deltaTime);
			}
			
			// 모든 노드를 그립니다.
			context.clearRect(0, 0, width * devicePixelRatio, height * devicePixelRatio);
			
			context.save();
			context.scale(devicePixelRatio, devicePixelRatio);
			context.translate(width / 2 - getCameraFollowX(), height / 2 - getCameraFollowY());
			
			drawAll(self, context, self.getAlpha());
			
			context.restore();
		});
		
		// 화면 크기가 변경되는 경우, 캔버스의 크기 또한 변경되어야 합니다.
		EVENT('resize', RAR(() => {
			
			let winWidth = WIN_WIDTH();
			let winHeight = WIN_HEIGHT();
			
			if (BROWSER_CONFIG.SkyEngine.width !== undefined) {
				width = BROWSER_CONFIG.SkyEngine.width;
			} else {
				width = winWidth;
			}
			
			if (BROWSER_CONFIG.SkyEngine.height !== undefined) {
				height = BROWSER_CONFIG.SkyEngine.height;
			} else {
				height = winHeight;
			}
			
			let widthRatio = winWidth / width;
			let heightRatio = winHeight / height;
			
			if (widthRatio < heightRatio) {
				ratio = widthRatio;
			} else {
				ratio = heightRatio;
			}
			
			canvas.addStyle({
				width : width * ratio,
				height : height * ratio
			});
			
			left = (winWidth - width * ratio) / 2;
			top = (winHeight - height * ratio) / 2;
			
			wrapper.addStyle({
				left : left,
				top : top
			});
			
			canvas.setSize({
				width : width * devicePixelRatio,
				height : height * devicePixelRatio
			});
		}));
		
		self.on('remove', () => {
			loop.remove();
		});
		
		let cameraFollowX = self.cameraFollowX = (params) => {
			//REQUIRED: params
			//REQUIRED: params.target
			//OPTIONAL: params.centerX
			
			cameraFollowXTarget = params.target;
			
			cameraFollowCenterX = params.centerX;
			if (cameraFollowCenterX === undefined) {
				cameraFollowCenterX = 0;
			}
		};
		
		let cameraFollowY = self.cameraFollowY = (node) => {
			//REQUIRED: params
			//REQUIRED: params.target
			//OPTIONAL: params.centerY
			
			cameraFollowYTarget = params.target;
			
			cameraFollowCenterY = params.centerY;
			if (cameraFollowCenterY === undefined) {
				cameraFollowCenterY = 0;
			}
		};
		
		let cameraFollow = self.cameraFollow = (node) => {
			//REQUIRED: params
			//REQUIRED: params.target
			//OPTIONAL: params.centerX
			//OPTIONAL: params.centerY
			
			cameraFollowX(params);
			cameraFollowY(params);
		};
		
		let cameraUnfollowX = self.cameraUnfollowX = (node) => {
			cameraFollowXTarget = undefined;
		};
		
		let cameraUnfollowY = self.cameraUnfollowY = (node) => {
			cameraFollowYTarget = undefined;
		};
		
		let cameraUnfollow = self.cameraUnfollow = (node) => {
			cameraUnfollowX();
			cameraUnfollowY();
		};
		
		let getCameraFollowX = self.getCameraFollowX = () => {
			
			if (cameraFollowXTarget === undefined) {
				return 0;
			}
			
			if (cameraFollowXTarget.checkIsRemoved() === true) {
				cameraFollowXTarget = undefined;
				return 0;
			}
			
			return cameraFollowXTarget.getRealX() - cameraFollowCenterX;
		};
		
		let getCameraFollowY = self.getCameraFollowY = () => {
			
			if (cameraFollowYTarget === undefined) {
				return 0;
			}
			
			if (cameraFollowYTarget.checkIsRemoved() === true) {
				cameraFollowYTarget = undefined;
				return 0;
			}
			
			return cameraFollowYTarget.getRealY() - cameraFollowCenterY;
		};
		
		let getLeft = self.getLeft = () => {
			return left;
		};
		
		let getTop = self.getTop = () => {
			return top;
		};
		
		let getWidth = self.getWidth = () => {
			return width;
		};
		
		let getHeight = self.getHeight = () => {
			return height;
		};
		
		let getRatio = self.getRatio = () => {
			return ratio;
		};
		
		let getCanvas = self.getCanvas = () => {
			return canvas;
		};
	}
});
