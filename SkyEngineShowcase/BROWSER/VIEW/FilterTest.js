SkyEngineShowcase.FilterTest = CLASS({
	
	preset : () => {
		return VIEW;
	},
	
	init : (inner) => {
		
		let rect = SkyEngine.Rect({
			width : 300,
			height : 200,
			color : '#00CC66'
		}).appendTo(SkyEngine.Screen);
		
		let circle = SkyEngine.Circle({
			width : 300,
			height : 200,
			color : '#FFCC33'
		}).appendTo(SkyEngine.Screen);
		
		let character = SkyEngine.Sprite({
			srcs : [
				SkyEngineShowcase.R('robot/run1.png'),
				SkyEngineShowcase.R('robot/run2.png'),
				SkyEngineShowcase.R('robot/run3.png'),
				SkyEngineShowcase.R('robot/run4.png'),
				SkyEngineShowcase.R('robot/run5.png'),
				SkyEngineShowcase.R('robot/run6.png'),
				SkyEngineShowcase.R('robot/run7.png'),
				SkyEngineShowcase.R('robot/run8.png')
			],
			fps : 10,
			scale : 0.2,
			alpha : 0.5,
			dom : DIV({
				style : {
					color : 'red',
					fontSize : 300
				},
				c : 'Test'
			})
		}).appendTo(SkyEngine.Screen);
		
		SkyEngine.Screen.setFilter('grayscale(100%)');
		
		inner.on('close', () => {
			
			rect.remove();
			circle.remove();
			character.remove();
			
			SkyEngine.Screen.removeFilter();
		});
	}
});
