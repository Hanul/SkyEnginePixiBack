SkyEnginePixiBack.Util = OBJECT({
	
	init : (inner, self) => {
		
		let getPixiBlendMode = self.getPixiBlendMode = (blendMode) => {
			
			if (blendMode === 'multiply') {
				return PIXI.BLEND_MODES.MULTIPLY;
			} else if (blendMode === 'screen') {
				return PIXI.BLEND_MODES.SCREEN;
			} else if (blendMode === 'lighter') {
				return PIXI.BLEND_MODES.ADD;
			} else if (blendMode === 'lighten') {
				return PIXI.BLEND_MODES.LIGHTEN;
			}
			
			return PIXI.BLEND_MODES.NORMAL;
		};
	}
});