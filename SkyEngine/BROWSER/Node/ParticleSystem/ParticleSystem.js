/*
 * 파티클 시스템 노드
 */
SkyEngine.ParticleSystem = CLASS(() => {
	
	let random = (min, max) => {
		return Math.random() * (max - min) + min;
	};
	
	return {
		
		preset : () => {
			return SkyEngine.Node;
		},
		
		init : (inner, self, params) => {
			//REQUIRED: params
			//OPTIONAL: params.particleSrc
			
			//OPTIONAL: params.particleFigure
			//OPTIONAL: params.particleStartX
			//OPTIONAL: params.particleStartY
			//OPTIONAL: params.particleEndX
			//OPTIONAL: params.particleEndY
			//OPTIONAL: params.particleWidth
			//OPTIONAL: params.particleHeight
			//OPTIONAL: params.particlePoints
			//OPTIONAL: params.particleColor
			//OPTIONAL: params.particleBorder
			//OPTIONAL: params.particleColorR
			//OPTIONAL: params.minParticleColorR
			//OPTIONAL: params.maxParticleColorR
			//OPTIONAL: params.particleColorG
			//OPTIONAL: params.minParticleColorG
			//OPTIONAL: params.maxParticleColorG
			//OPTIONAL: params.particleColorB
			//OPTIONAL: params.minParticleColorB
			//OPTIONAL: params.maxParticleColorB
			
			//OPTIONAL: params.particleCenterX
			//OPTIONAL: params.particleCenterY
			
			//OPTIONAL: params.particleCount
			//OPTIONAL: params.minParticleCount
			//OPTIONAL: params.maxParticleCount
			
			//OPTIONAL: params.particleX
			//OPTIONAL: params.minParticleX
			//OPTIONAL: params.maxParticleX
			//OPTIONAL: params.particleY
			//OPTIONAL: params.minParticleY
			//OPTIONAL: params.maxParticleY
			
			//OPTIONAL: params.particleLifetime
			//OPTIONAL: params.minParticleLifetime
			//OPTIONAL: params.maxParticleLifetime
			
			//OPTIONAL: params.particleDirection
			//OPTIONAL: params.minParticleDirection
			//OPTIONAL: params.maxParticleDirection
			
			//OPTIONAL: params.particleSpeed
			//OPTIONAL: params.minParticleSpeed
			//OPTIONAL: params.maxParticleSpeed
			//OPTIONAL: params.particleAccelX
			//OPTIONAL: params.particleAccelY
			
			//OPTIONAL: params.particleScale
			//OPTIONAL: params.minParticleScale
			//OPTIONAL: params.maxParticleScale
			//OPTIONAL: params.particleScalingSpeed
			//OPTIONAL: params.minParticleScalingSpeed
			//OPTIONAL: params.maxParticleScalingSpeed
			
			//OPTIONAL: params.isParticleAngleToDirection	파티클의 각도가 방향에 따르는지 여부
			//OPTIONAL: params.particleAngle
			//OPTIONAL: params.minParticleAngle
			//OPTIONAL: params.maxParticleAngle
			//OPTIONAL: params.particleRotationSpeed
			//OPTIONAL: params.minParticleRotationSpeed
			//OPTIONAL: params.minParticleRotationSpeed
	
			//OPTIONAL: params.particleAlpha
			//OPTIONAL: params.minParticleAlpha
			//OPTIONAL: params.maxParticleAlpha
			//OPTIONAL: params.particleFadingSpeed
			//OPTIONAL: params.minParticleFadingSpeed
			//OPTIONAL: params.minParticleFadingSpeed
			
			let particleSrc = params.particleSrc;
			
			let particleFigure = params.particleFigure;
			let particleStartX = params.particleStartX;
			let particleStartY = params.particleStartY;
			let particleEndX = params.particleEndX;
			let particleEndY = params.particleEndY;
			let particleWidth = params.particleWidth;
			let particleHeight = params.particleHeight;
			let particlePoints = params.particlePoints;
			let particleColor = params.particleColor;
			let particleBorder = params.particleBorder;
			let particleColorR = params.particleColorR;
			let minParticleColorR = params.minParticleColorR;
			let maxParticleColorR = params.maxParticleColorR;
			let particleColorG = params.particleColorG;
			let minParticleColorG = params.minParticleColorG;
			let maxParticleColorG = params.maxParticleColorG;
			let particleColorB = params.particleColorB;
			let minParticleColorB = params.minParticleColorB;
			let maxParticleColorB = params.maxParticleColorB;
			
			let particleCenterX = params.particleCenterX;
			let particleCenterY = params.particleCenterY;
			
			let particleCount = params.particleCount;
			let minParticleCount = params.minParticleCount;
			let maxParticleCount = params.maxParticleCount;
			
			let particleX = params.particleX;
			let minParticleX = params.minParticleX;
			let maxParticleX = params.maxParticleX;
			let particleY = params.particleY;
			let minParticleY = params.minParticleY;
			let maxParticleY = params.maxParticleY;
			
			let particleLifetime = params.particleLifetime;
			let minParticleLifetime = params.minParticleLifetime;
			let maxParticleLifetime = params.maxParticleLifetime;
			
			let particleDirection = params.particleDirection;
			let minParticleDirection = params.minParticleDirection;
			let maxParticleDirection = params.maxParticleDirection;
			
			let particleSpeed = params.particleSpeed;
			let minParticleSpeed = params.minParticleSpeed;
			let maxParticleSpeed = params.maxParticleSpeed;
			let particleAccelX = params.particleAccelX;
			let particleAccelY = params.particleAccelY;
			
			let particleScale = params.particleScale;
			let minParticleScale = params.minParticleScale;
			let maxParticleScale = params.maxParticleScale;
			let particleScalingSpeed = params.particleScalingSpeed;
			let minParticleScalingSpeed = params.minParticleScalingSpeed;
			let maxParticleScalingSpeed = params.maxParticleScalingSpeed;
			
			let isParticleAngleToDirection = params.isParticleAngleToDirection;
			let particleAngle = params.particleAngle;
			let minParticleAngle = params.minParticleAngle;
			let maxParticleAngle = params.maxParticleAngle;
			let particleRotationSpeed = params.particleRotationSpeed;
			let minParticleRotationSpeed = params.minParticleRotationSpeed;
			let maxParticleRotationSpeed = params.maxParticleRotationSpeed;
			
			let particleAlpha = params.particleAlpha;
			let minParticleAlpha = params.minParticleAlpha;
			let maxParticleAlpha = params.maxParticleAlpha;
			let particleFadingSpeed = params.particleFadingSpeed;
			let minParticleFadingSpeed = params.minParticleFadingSpeed;
			let maxParticleFadingSpeed = params.maxParticleFadingSpeed;
			
			let minParticleRotationSpeedRadian;
			let maxParticleRotationSpeedRadian;
			
			if (particleColorR === undefined) {
				particleColorR = 0;
			}
			if (minParticleColorR === undefined) {
				minParticleColorR = particleColorR;
			}
			if (maxParticleColorR === undefined) {
				maxParticleColorR = particleColorR;
			}
			
			if (particleColorG === undefined) {
				particleColorG = 0;
			}
			if (minParticleColorG === undefined) {
				minParticleColorG = particleColorG;
			}
			if (maxParticleColorG === undefined) {
				maxParticleColorG = particleColorG;
			}
			
			if (particleColorB === undefined) {
				particleColorB = 0;
			}
			if (minParticleColorB === undefined) {
				minParticleColorB = particleColorB;
			}
			if (maxParticleColorB === undefined) {
				maxParticleColorB = particleColorB;
			}
			
			if (particleCenterX === undefined) {
				particleCenterX = 0;
			}
			if (particleCenterY === undefined) {
				particleCenterY = 0;
			}
			
			if (particleCount === undefined) {
				particleCount = 1;
			}
			
			if (minParticleCount === undefined) {
				minParticleCount = particleCount;
			}
			if (maxParticleCount === undefined) {
				maxParticleCount = particleCount;
			}
			
			if (particleX === undefined) {
				particleX = 0;
			}
			if (minParticleX === undefined) {
				minParticleX = particleX;
			}
			if (maxParticleX === undefined) {
				maxParticleX = particleX;
			}
			
			if (particleY === undefined) {
				particleY = 0;
			}
			if (minParticleY === undefined) {
				minParticleY = particleY;
			}
			if (maxParticleY === undefined) {
				maxParticleY = particleY;
			}
			
			if (minParticleLifetime === undefined) {
				minParticleLifetime = particleLifetime;
			}
			if (maxParticleLifetime === undefined) {
				maxParticleLifetime = particleLifetime;
			}
			
			if (minParticleDirection === undefined) {
				minParticleDirection = particleDirection;
			}
			if (maxParticleDirection === undefined) {
				maxParticleDirection = particleDirection;
			}
			
			if (minParticleSpeed === undefined) {
				minParticleSpeed = particleSpeed;
			}
			if (maxParticleSpeed === undefined) {
				maxParticleSpeed = particleSpeed;
			}
			
			if (particleAccelX === undefined) {
				particleAccelX = 0;
			}
			if (particleAccelY === undefined) {
				particleAccelY = 0;
			}
			
			if (particleScale === undefined) {
				particleScale = 1;
			}
			if (minParticleScale === undefined) {
				minParticleScale = particleScale;
			}
			if (maxParticleScale === undefined) {
				maxParticleScale = particleScale;
			}
			
			if (particleScalingSpeed === undefined) {
				particleScalingSpeed = 0;
			}
			if (minParticleScalingSpeed === undefined) {
				minParticleScalingSpeed = particleScalingSpeed;
			}
			if (maxParticleScalingSpeed === undefined) {
				maxParticleScalingSpeed = particleScalingSpeed;
			}
			
			if (particleAngle === undefined) {
				particleAngle = 0;
			}
			if (minParticleAngle === undefined) {
				minParticleAngle = particleAngle;
			}
			if (maxParticleAngle === undefined) {
				maxParticleAngle = particleAngle;
			}
			
			if (particleRotationSpeed === undefined) {
				particleRotationSpeed = 0;
			}
			if (minParticleRotationSpeed === undefined) {
				minParticleRotationSpeed = particleRotationSpeed;
			}
			minParticleRotationSpeedRadian = minParticleRotationSpeed * Math.PI / 180;
			if (maxParticleRotationSpeed === undefined) {
				maxParticleRotationSpeed = particleRotationSpeed;
			}
			maxParticleRotationSpeedRadian = minParticleRotationSpeed * Math.PI / 180;
			
			if (particleAlpha === undefined) {
				particleAlpha = 1;
			}
			if (minParticleAlpha === undefined) {
				minParticleAlpha = particleAlpha;
			}
			if (maxParticleAlpha === undefined) {
				maxParticleAlpha = particleAlpha;
			}
			
			if (particleFadingSpeed === undefined) {
				particleFadingSpeed = 0;
			}
			if (minParticleFadingSpeed === undefined) {
				minParticleFadingSpeed = particleFadingSpeed;
			}
			if (maxParticleFadingSpeed === undefined) {
				maxParticleFadingSpeed = particleFadingSpeed;
			}
			
			let particleBorderPixel;
			let particleBorderStyle;
			let particleBorderColor;
			
			if (particleBorder !== undefined) {
				let split = particleBorder.split(' ');
				particleBorderPixel = INTEGER(split[0]);
				particleBorderStyle = split[1];
				particleBorderColor = split[2];
			}
			
			let width;
			let height;
			
			let img;
			
			if (particleSrc !== undefined) {
				
				img = new Image();
				
				img.onload = () => {
					
					width = img.width;
					if (particleWidth === undefined) {
						particleWidth = width;
					}
					
					height = img.height;
					if (particleHeight === undefined) {
						particleHeight = height;
					}
					
					img.onload = undefined;
					
					self.fireEvent('load');
				};
				
				img.src = particleSrc;
			}
			
			else {
				self.fireEvent('load');
			}
			
			let particleInfos = [];
			
			let endHandler;
			
			let burst = self.burst = (_endHandler) => {
				
				endHandler = _endHandler;
				
				REPEAT(random(minParticleCount, maxParticleCount), () => {
					
					let direction = random(minParticleDirection, maxParticleDirection) * Math.PI / 180;
					
					let sin = Math.sin(direction);
					let cos = Math.cos(direction);
					
					let speed = random(minParticleSpeed, maxParticleSpeed);
					
					let particleInfo = {
						time : 0,
						lifetime : random(minParticleLifetime, maxParticleLifetime),
						x : random(minParticleX, maxParticleX),
						y : random(minParticleY, maxParticleY),
						scalingSpeed : random(minParticleScalingSpeed, maxParticleScalingSpeed),
						direction : direction,
						speedX : speed * cos,
						speedY : speed * sin,
						scale : random(minParticleScale, maxParticleScale),
						rotationSpeedRadian : random(minParticleRotationSpeedRadian, maxParticleRotationSpeedRadian),
						radian : random(minParticleAngle, maxParticleAngle) * Math.PI / 180,
						fadingSpeed : random(minParticleFadingSpeed, maxParticleFadingSpeed),
						alpha : random(minParticleAlpha, maxParticleAlpha)
					};
					
					if (particleFigure !== undefined && particleColor === undefined) {
						particleInfo.color = 'rgb(' + RANDOM({
							min : minParticleColorR,
							max : maxParticleColorR
						}) + ', ' + RANDOM({
							min : minParticleColorG,
							max : maxParticleColorG
						}) + ', ' + RANDOM({
							min : minParticleColorB,
							max : maxParticleColorB
						}) + ')';
					}
					
					particleInfos.push(particleInfo);
				});
			};
			
			let step;
			OVERRIDE(self.step, (origin) => {
				
				step = self.step = (deltaTime) => {
					
					for (let i = 0; i < particleInfos.length; i += 1) {
						
						let particleInfo = particleInfos[i];
						
						particleInfo.time += deltaTime;
						
						if (particleInfo.time > particleInfo.lifetime) {
							particleInfos.splice(i, 1);
							
							if (endHandler !== undefined && particleInfos.length === 0) {
								endHandler(self);
							}
						}
						
						else {
							
							particleInfo.speedX += particleAccelX * deltaTime;
							particleInfo.speedY += particleAccelY * deltaTime;
							
							particleInfo.x += particleInfo.speedX * deltaTime;
							particleInfo.y += particleInfo.speedY * deltaTime;
							
							particleInfo.scale += particleInfo.scalingSpeed * deltaTime;
							
							if (particleInfo.scale < 0) {
								particleInfo.scale = 0;
							}
							
							particleInfo.radian += particleInfo.rotationSpeedRadian * deltaTime;
							
							particleInfo.alpha += particleInfo.fadingSpeed * deltaTime;
							
							if (particleInfo.alpha < 0) {
								particleInfo.alpha = 0;
							}
						}
						
						if (particleInfos === undefined) {
							break;
						}
					}
					
					origin(deltaTime);
				};
			});
			
			let draw;
			OVERRIDE(self.draw, (origin) => {
				
				draw = self.draw = (context) => {
					
					for (let i = 0; i < particleInfos.length; i += 1) {
						
						let particleInfo = particleInfos[i];
						
						let scale = particleInfo.scale;
						
						context.save();
						
						context.translate(particleInfo.x, particleInfo.y);
						
						if (isParticleAngleToDirection === true) {
							context.rotate(particleInfo.direction);
						} else {
							context.rotate(particleInfo.radian);
						}
						
						context.scale(scale, scale);
						
						context.globalAlpha *= particleInfo.alpha;
						
						if (particleFigure === undefined) {
							
							context.drawImage(
								img,
								particleCenterX - width / 2,
								particleCenterY - height / 2,
								width,
								height);
						}
						
						else {
							
							context.beginPath();
							
							if (particleFigure === 'line') {
								context.moveTo(particleCenterX + particleStartX, particleCenterY + particleStartY);
								context.lineTo(particleCenterX + particleEndX, particleCenterY + particleEndY);
							}
							
							else if (particleFigure === 'rect') {
								context.rect(particleCenterX - particleWidth / 2, particleCenterX - particleHeight / 2, particleWidth, particleHeight);
							}
							
							else if (particleFigure === 'circle') {
								context.ellipse(particleCenterX, particleCenterY, particleWidth / 2, particleHeight / 2, 0, 0, 2 * Math.PI);
							}
							
							else if (particleFigure === 'polygon') {
								
								if (particlePoints.length > 0) {
									
									context.moveTo(particleCenterX + particlePoints[0].x, particleCenterY + particlePoints[0].y);
									
									for (let i = 1; i < particlePoints.length; i += 1) {
										let point = particlePoints[i];
										context.lineTo(particleCenterX + point.x, particleCenterY + point.y);
									}
									
									context.lineTo(particleCenterX + particlePoints[0].x, particleCenterY + particlePoints[0].y);
								}
							}
							
							if (particleColor !== undefined) {
								context.fillStyle = particleColor;
								context.fill();
							}
							
							else if (particleInfo.color !== undefined) {
								context.fillStyle = particleInfo.color;
								context.fill();
							}
							
							if (particleBorder !== undefined) {
								context.lineWidth = particleBorderPixel;
								context.strokeStyle = particleBorderColor;
								
								if (particleBorderStyle === 'dashed') {
									context.setLineDash([5]);
								} else if (particleBorderStyle === 'dotted') {
									context.setLineDash([2]);
								}
								
								context.stroke();
							}
							
							context.closePath();
						}
						
						context.restore();
					}
					
					origin(context);
				};
			});
			
			let remove;
			OVERRIDE(self.remove, (origin) => {
				
				remove = self.remove = () => {
					
					if (img !== undefined) {
						img.onload = undefined;
						img = undefined;
					}
					
					particleInfos = undefined;
					
					origin();
				};
			});
		}
	};
});
