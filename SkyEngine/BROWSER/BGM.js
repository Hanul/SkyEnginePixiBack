/*
 * 배경음악
 */
SkyEngine.BGM = CLASS({
	
	preset : () => {
		return SOUND;
	},
	
	params : () => {
		return {
			isLoop : true
		};
	},
	
	init : (inner, self, params) => {
		//REQUIRED: params
		//OPTIONAL: params.ogg
		//OPTIONAL: params.mp3
		//OPTIONAL: params.volume
		
		// 다른 화면을 보는 중에는 배경 음악을 일시정지합니다.
		let visibilitychangeEvent = EVENT('visibilitychange', () => {
			if (document.hidden === true) {
				self.pause();
			} else {
				self.play();
			}
		});
		
		let stop;
		OVERRIDE(self.stop, (origin) => {
			
			stop = self.stop = () => {
				
				visibilitychangeEvent.remove();
				
				origin();
			};
		});
	}
});
