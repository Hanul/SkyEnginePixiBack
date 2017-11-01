SkyEngineShowcase.NodeTest = CLASS({
	
	preset : () => {
		return VIEW;
	},
	
	init : (inner) => {
		
		let leftArm;
		let man = SkyEngine.Rect({
			width : 40,
			height : 80,
			color : 'green',
			c : [
			// head
			SkyEngine.Circle({
				centerY : 25,
				y : -40,
				width : 50,
				height : 50,
				color : 'yellow'
			}),
			
			// left arm
			leftArm = SkyEngine.Rect({
				centerY : -30,
				angle : 40,
				x : -20,
				y : -40,
				width : 20,
				height : 60,
				color : 'purple',
				c : SkyEngine.Rect({
					centerY : -30,
					angle : -40,
					y : 30,
					width : 20,
					height : 60,
					color : 'purple'
				})
			}),
			
			// right arm
			SkyEngine.Rect({
				centerY : -30,
				angle : -40,
				x : 20,
				y : -40,
				width : 20,
				height : 60,
				color : 'purple',
				c : SkyEngine.Rect({
					centerY : -30,
					angle : 40,
					y : 30,
					width : 20,
					height : 60,
					color : 'purple'
				})
			})]
		}).appendTo(SkyEngine.Screen);
		
		leftArm.setScalingSpeedX(1);
		
		let delay = SkyEngine.Delay(1, () => {
			leftArm.setScalingSpeedX(-1);
			delay = SkyEngine.Delay(1, () => {
				leftArm.setScalingSpeedX(0);
			});
		});
		
		inner.on('close', () => {
			man.remove();
			delay.remove();
		});
	}
});
