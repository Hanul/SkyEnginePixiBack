OVERRIDE(SkyEngine.ParticleSystem, (origin) => {
	
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
				
				// Create a new emitter
				var emitter = new PIXI.particles.Emitter(
				
					// The PIXI.Container to put the emitter in
					// if using blend modes, it's important to put this
					// on top of a bitmap, and not use the root stage Container
					inner.getPixiContainer(),
				  
					// The collection of particle images to use
					[PIXI.Texture.fromImage(SkyEngineShowcase.R('star.png'))],
				  
					// Emitter configuration, edit this to change the look
					// of the emitter
					{
						alpha: {
							start: 0.8,
							end: 0.1
						},
						scale: {
							start: 1,
							end: 0.3
						},
						color: {
							start: "fb1010",
							end: "f5b830"
						},
						speed: {
							start: 200,
							end: 100
						},
						startRotation: {
							min: 0,
							max: 360
						},
						rotationSpeed: {
							min: 0,
							max: 0
						},
						lifetime: {
							min: 0.5,
							max: 0.5
						},
						frequency: 0.008,
						emitterLifetime: 0.31,
						maxParticles: 1000,
						pos: {
							x: 0,
							y: 0
						},
						addAtBack: false,
						spawnType: "circle",
						spawnCircle: {
							x: 0,
							y: 0,
							r: 10
						}
					}
				);

				let step;
				OVERRIDE(self.step, (origin) => {
					
					step = self.step = (deltaTime) => {
						
						emitter.update(deltaTime);
						
						origin(deltaTime);
					};
				});
				
				let burst = self.burst = (_endHandler) => {
					
				};
			}
		};
	});
});