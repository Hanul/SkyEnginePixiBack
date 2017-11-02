SkyEnginePixiBack.Util = OBJECT({
	
	init : (inner, self) => {
		
		let getPixiBlendMode = self.getPixiBlendMode = (blendMode) => {
			
			if (blendMode === 'multiply') {
				return PIXI.BLEND_MODES.MULTIPLY;
			}
			
			return PIXI.BLEND_MODES.NORMAL;
		};
	}
});