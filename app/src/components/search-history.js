import Component from './component'

let searchHistoryDataSource = new kendo.data.DataSource({
	offlineStorage: 'search-history',
	schema: {
		model: {
			id: 'artistId'
		},
		parse: function(data) {
			return data.reverse();
		}
	}
});

searchHistoryDataSource.online(false);

let observable = kendo.observable({
	searchHistoryDataSource: searchHistoryDataSource,
	selectHistoryItem: function(e) {
		var artistId = ($(e.target).data('id'));
		var artist = searchHistoryDataSource.get(artistId);
		
		Component.trigger('artist/select', { artist: artist })

		e.preventDefault();
	}
});

const template = `
	<h3>History</h3>

	<div data-bind="source: searchHistoryDataSource" data-template="search-history-template"></div>

	<script id="search-history-template" type="text/x-kendo-template">
		<p><a href="\\\#" data-bind="click: selectHistoryItem" data-id="#: artistId #">#: artistName #</a></p>
	</script>`;

class SearchHistory extends Component {

	constructor(container) {

		super(container, template, observable, true);

		Component.on('artist/select', function(e, args) {
			// compare the first item, if it's this one, no need to add it again
			let firstItem = searchHistoryDataSource.at(0) || { artistId: null };
			
			if (args.artist.artistId !== firstItem.artistId) {
				searchHistoryDataSource.insert(0, args.artist);
				searchHistoryDataSource.sync();
			}
		});
	}
}

export default SearchHistory;