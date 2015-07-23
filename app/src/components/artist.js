import Component from './component';
import Album from './albums';

var observable = kendo.observable({
	artistName: null
});

const template = `
	<div id="results">
		<div class="row-fluid">
		  <div id="artist" class="col-xs-12 header">
		  	<i id="search-button" class="fa fa-search k-rpanel-toggle"></i>
		    <h1 data-bind="html: artistName"></h1>
		  </div>
		</div>
	</div>`;

class Artist extends Component {
	constructor(container) {
		super(container, template, observable, true);

		Component.on('artist/select', (e, args) => {
			observable.set('artistName', args.artist.artistName)
		});

		new Album('#results');
	}
}

export default Artist;