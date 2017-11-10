OVERRIDE(SkyEngine.Screen, (origin) => {
	
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
			let renderer = new PIXI.WebGLRenderer({
				view : canvas.getEl()
			});
			
			let stage = new PIXI.Container();
			
			stage.addChild(inner.getPixiContainer());
			
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
				
				stage.x = width / 2 - getCameraFollowX();
				stage.y = height / 2 - getCameraFollowY();
				
				renderer.render(stage);
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
				
				if (BROWSER_CONFIG.SkyEngine.width !== undefined && widthRatio < heightRatio) {
					ratio = widthRatio;
				} else {
					ratio = heightRatio;
				}
				
				if (BROWSER_CONFIG.SkyEngine.width === undefined) {
					width /= ratio;
				}
				
				if (BROWSER_CONFIG.SkyEngine.height === undefined) {
					height /= ratio;
				}
				
				if (BROWSER_CONFIG.SkyEngine.maxWidth !== undefined && width > BROWSER_CONFIG.SkyEngine.maxWidth) {
					width = BROWSER_CONFIG.SkyEngine.maxWidth;
				}
				
				if (BROWSER_CONFIG.SkyEngine.maxHeight !== undefined && height > BROWSER_CONFIG.SkyEngine.maxHeight) {
					height = BROWSER_CONFIG.SkyEngine.maxHeight;
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
				
				renderer.resize(width, height);
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
			
			let getPixiRenderer = self.getPixiRenderer = () => {
				return renderer;
			};
			
			let getCanvasContext = self.getCanvasContext = () => {
				return renderer.context;
			};
		}
	});
});