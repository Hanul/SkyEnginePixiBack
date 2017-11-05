SkyEnginePixiBack.Util = OBJECT({
	
	init : (inner, self) => {
		
		let getPixiBlendMode = self.getPixiBlendMode = (blendMode) => {
			
			if (blendMode === 'multiply') {
				return PIXI.BLEND_MODES.MULTIPLY;
			} else if (blendMode === 'screen') {
				return PIXI.BLEND_MODES.SCREEN;
			}
			
			return PIXI.BLEND_MODES.NORMAL;
		};
	}
});