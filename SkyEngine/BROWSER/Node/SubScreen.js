/*
 * 서브스크린 노드
 */
SkyEngine.SubScreen = CLASS({
	
	preset : () => {
		return SkyEngine.Node;
	},

	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.style
		//REQUIRED: params.width
		//REQUIRED: params.height
		//OPTIONAL: params.isDebugMode
		
		let style = params.style;
		let width = params.width;
		let height = params.height;
		let isDebugMode = params.isDebugMode;
		
		let wrapper = DIV({
			style : COMBINE([{
				position : 'relative'
			}, style])
		});
		
		let canvas = CANVAS().appendTo(wrapper);
		let context = canvas.getContext('2d');
		
		let left;
		let top;
		
		let deltaTime;
		
		let followX = 0;
		let followY = 0;
		
		let cameraFollowCenterX;
		let cameraFollowCenterY;
		let cameraFollowXTarget;
		let cameraFollowYTarget;
		
		let cameraMinFollowX;
		let cameraMinFollowY;
		let cameraMaxFollowX;
		let cameraMaxFollowY;
		
		// 디버그 모드에서는 FPS 수치 표시
		if (isDebugMode === true || BROWSER_CONFIG.SkyEngine.isDebugMode === true) {
			
			let fpsDom = DIV({
				style : {
					position : 'absolute',
					left : 5,
					top : 5,
					fontSize : 12,
					zIndex : 999999
				}
			}).appendTo(wrapper);
			
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
						node.checkIsRemoved() !== true &&
						node.checkIsEventExists(eventName) === true &&
						node.checkTouch(e.getLeft() - canvas.getLeft() - width / 2, e.getTop() - canvas.getTop() - height / 2) === true) {
							
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
				
				if (node.getFilter() !== undefined) {
					context.filter = node.getFilter();
				}
				
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
				if (node.checkIsRemoved() !== true && (isDebugMode === true || BROWSER_CONFIG.SkyEngine.isDebugMode === true)) {
					
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
						drawAllArea(touchAreas[i], context, 'magenta');
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
			
			nonePausableNode.step(deltaTime);
			
			// 모든 노드를 그립니다.
			context.clearRect(0, 0, width * devicePixelRatio, height * devicePixelRatio);
			
			context.save();
			context.scale(devicePixelRatio, devicePixelRatio);
			context.translate(width / 2 - getCameraFollowX(), height / 2 - getCameraFollowY());
			
			drawAll(self, context, self.getAlpha());
			
			context.restore();
		});
		
		// 화면 크기가 변경되는 경우, 캔버스의 크기 또한 변경되어야 합니다.
		let setSize = self.setSize = (params) => {
			//REQUIRED: params
			//REQUIRED: params.width
			//REQUIRED: params.height
			
			width = params.width;
			height = params.height;
			
			wrapper.addStyle({
				width : width,
				height : height
			});
			
			canvas.addStyle({
				width : width,
				height : height
			});
			
			canvas.setSize({
				width : width * devicePixelRatio,
				height : height * devicePixelRatio
			});
		};
		
		setSize({
			width : width,
			height : height
		});
		
		self.on('remove', () => {
			loop.remove();
		});
		
		let cameraFollowX = self.cameraFollowX = (params) => {
			//REQUIRED: params
			//REQUIRED: params.target
			//OPTIONAL: params.centerX
			//OPTIONAL: params.minX
			//OPTIONAL: params.maxX
			
			cameraFollowXTarget = params.target;
			
			cameraFollowCenterX = params.centerX;
			if (cameraFollowCenterX === undefined) {
				cameraFollowCenterX = 0;
			}
			
			cameraMinFollowX = params.minX;
			cameraMaxFollowX = params.maxX;
		};
		
		let cameraFollowY = self.cameraFollowY = (params) => {
			//REQUIRED: params
			//REQUIRED: params.target
			//OPTIONAL: params.centerY
			//OPTIONAL: params.minY
			//OPTIONAL: params.maxY
			
			cameraFollowYTarget = params.target;
			
			cameraFollowCenterY = params.centerY;
			if (cameraFollowCenterY === undefined) {
				cameraFollowCenterY = 0;
			}
			
			cameraMinFollowY = params.minY;
			cameraMaxFollowY = params.maxY;
		};
		
		let cameraFollow = self.cameraFollow = (params) => {
			//REQUIRED: params
			//REQUIRED: params.target
			//OPTIONAL: params.centerX
			//OPTIONAL: params.centerY
			//OPTIONAL: params.minX
			//OPTIONAL: params.minY
			//OPTIONAL: params.maxX
			//OPTIONAL: params.maxY
			
			cameraFollowX(params);
			cameraFollowY(params);
		};
		
		let cameraUnfollowX = self.cameraUnfollowX = () => {
			cameraFollowXTarget = undefined;
			cameraMinFollowX = undefined;
			cameraMaxFollowX = undefined;
			
			followX = 0;
		};
		
		let cameraUnfollowY = self.cameraUnfollowY = () => {
			cameraFollowYTarget = undefined;
			cameraMinFollowY = undefined;
			cameraMaxFollowY = undefined;
			
			followY = 0;
		};
		
		let cameraUnfollow = self.cameraUnfollow = () => {
			cameraUnfollowX();
			cameraUnfollowY();
		};
		
		let getCameraFollowX = self.getCameraFollowX = () => {
			
			if (cameraFollowXTarget === undefined) {
				return followX;
			}
			
			if (cameraFollowXTarget.checkIsRemoved() === true) {
				cameraFollowXTarget = undefined;
				return followX;
			}
			
			followX = cameraFollowXTarget.getRealX() - cameraFollowCenterX;
			
			if (cameraMinFollowX !== undefined && followX < cameraMinFollowX) {
				return cameraMinFollowX;
			}
			
			if (cameraMaxFollowX !== undefined && followX > cameraMaxFollowX) {
				return cameraMaxFollowX;
			}
			
			return followX;
		};
		
		let getCameraFollowY = self.getCameraFollowY = () => {
			
			if (cameraFollowYTarget === undefined) {
				return followY;
			}
			
			if (cameraFollowYTarget.checkIsRemoved() === true) {
				cameraFollowYTarget = undefined;
				return followY;
			}
			
			followY = cameraFollowYTarget.getRealY() - cameraFollowCenterY;
			
			if (cameraMinFollowY !== undefined && followY < cameraMinFollowY) {
				return cameraMinFollowY;
			}
			
			if (cameraMaxFollowY !== undefined && followY > cameraMaxFollowY) {
				return cameraMaxFollowY;
			}
			
			return followY;
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
		
		let getCanvas = self.getCanvas = () => {
			return canvas;
		};
		
		let getCanvasContext = self.getCanvasContext = () => {
			return context;
		};
		
		let nonePausableNode = SkyEngine.Node();
		
		let getNonePausableNode = self.getNonePausableNode = () => {
			return nonePausableNode;
		};
		
		let appendTo;
		OVERRIDE(self.appendTo, (origin) => {
			
			appendTo = self.appendTo = (domNode) => {
				wrapper.appendTo(domNode);
				return self;
			};
		});
		
		let remove;
		OVERRIDE(self.remove, (origin) => {
			
			remove = self.remove = () => {
				origin();
				wrapper.remove();
			};
		});
	}
});
