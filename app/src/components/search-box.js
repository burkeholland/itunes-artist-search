import Component from './component';
import SearchHistory from './search-history';
import itunes from '../itunes-api';

let observable = kendo.observable({
	selectArtist: function(e) {
		let artist = e.sender.dataItem(e.item.index());
		Component.trigger('artist/select', { artist: artist });
	},
	searchDataSource: new kendo.data.DataSource({
		transport: {
			read: {
				url: function() {
					return itunes.SEARCH + 'media=music&country=US&entity=musicArtist'
				},
				dataType: 'JSON'
			},
			parameterMap: function(options) {
				return {
					term: options.filter.filters[0].value
				}
			}
		},
		schema: {
			data: 'results'
		},
		serverFiltering: true
	})
});

const template = `
	<div id="search" class="search" data-role="responsivepanel" data-breakpoint="1500">
	  <h1>Search</h1>
	  <div class="search-box-container">
	  	<input class="search-box" type="text" data-role="autocomplete" data-bind="source: searchDataSource, events: { select: selectArtist }" data-text-field="artistName" data-value-field="artistId">
	  </div>
	  <div id="search-history"></div>
	</div>`;

class SearchBox extends Component {
	
	constructor(container) {

		super(container, template, observable, true);

		this.sidebarInstance = $('#search').data('kendoResponsivePanel');

		Component.on('open/search', () => {
			this.sidebarInstance.open();
		});

		new SearchHistory('#search-history');
	}
}

export default SearchBox;



