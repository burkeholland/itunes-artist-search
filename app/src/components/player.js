import Component from './component';

let player;

const template = '<audio id="player" style="display: none"></audio>';

class Player extends Component {
	
	constructor(container) {
		
		super(container, template);

		Component.on('player/play', (e, url) => {
			player.src = url;
			player.play();
		});

		Component.on('player/pause', () => {
			player.pause();
		});

		Component.on('player/stop', () => {
			player.pause();
		  player.currentTime = 0;
		});

		player = $('#player')[0];
	}
		
}

export default Player;