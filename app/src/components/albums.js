import Component from './component';
import Tracks from './tracks';
import itunes from '../itunes-api';

const resetPlayButtons = function() {
	$('.fa-pause').hide();
	$('.fa-play').show();
}

var observable = kendo.observable({
	isEmpty: true,
	artistId: 0,
	albumId: 0,
	albumsDataSource:  new kendo.data.DataSource({
		transport: {
			read: {
				url: itunes.LOOKUP,
				dataType: 'json'
			},
			parameterMap: function(options) {
				return {
					entity: 'album',
					id: observable.get('artistId')
				}
			}
		},
		schema: {
			data: "results",
				parse: function(data) {
					$.each(data.results, function() {
						// add a place holder on the albums ds for tracks which is not 
						// included in the original response
						
						this.tracks = new kendo.data.ObservableArray([]);

						// set the artist name
					  Component.trigger('artist/update', data.results[0].artistName);
				});

				kendo.ui.progress($('#main'), false);

				return data;
			},
			model: {
				id: "collectionId",
					fields: {
						releaseDate: {
		  			type: "date"
					}
				}
			}
		},
		filter: { field: "wrapperType", operator: "equals", value: "collection" }
	}),
	flip: function(e) {

		Component.trigger('player/pause');

	  resetPlayButtons();

	  let flippable = $(e.sender.element).closest("[data-role='flippable']").data('kendoFlippable');
	
	  flippable.flipHorizontal();
	},
	
	flipStart: function(e) {
	  
	  this.set('albumId', e.data.collectionId);

	  // only make a remote call for tracks if there are not yet any 
	  // tracks associated with this album
	  if (e.data.tracks.length > 0) {
	    return;
	  }
	  else {
	    Component.trigger('tracks/read', e.data.collectionId);
	  }
	},

	play: function(e) {

		resetPlayButtons();

		Component.trigger('player/play', e.data);  
		e.data.set('isPlaying', true); 
	},

	stop: function(e) {
		Component.trigger('player/stop');
		e.data.set('isPlaying', false);
	},

	search: function(e) {
		Component.trigger('open/search');
		e.preventDefault();
	}
});

let template = `
	<div>
	  <div class="albums" data-bind="source: albumsDataSource" data-template="albums-template">
	  </div>
	  <div class="empty" data-bind="visible: isEmpty">
	    <a href="#" data-bind="click: search"><i class="fa fa-music"></i></a>
	  </div>
	</div>

	<script type="text/x-kendo-template" id="albums-template">
	  <div class="col-sm-4">
	    <div class="album" data-role="flippable" data-bind="events: { flipStart: flipStart }">
	      <div class="front" data-role="touch" data-bind="events: { tap: flip }">
	        <div class="col-lg-5">
	          <div class="album-cover">
	            <img class="img-circle" src="#: artworkUrl100 #">
	            <p><span class="badge">#: trackCount #</span> tracks</p>
	          </div>
	        </div>
	        <div class="col-lg-7">
	          <div class="row">
	            <div class="col-xs-12">
	              <h4 title="#: collectionCensoredName #"> #: collectionCensoredName #</h4>
	            </div>
	            <div class="col-xs-12 hidden-md hidden-sm">
	              <p>Released #: kendo.toString(releaseDate, "MMM d, yyyy") #</p>
	            </div>
	          </div>
	        </div>
	      </div>
	      <div class="back">
	        <div data-role="kendo.mobile.ui.NavBar">
	          <span data-role="kendo.mobile.ui.ViewTitle">Tracks</span>
	          <div data-role="kendo.mobile.ui.Button" data-bind="click: flip" data-align="left">Back</div>
	        </div> 
	        <div class="tracks">
	          <ul data-role="kendo.mobile.ui.ListView" data-bind="source: tracks" data-auto-bind="false" data-template="track-template"></table>
	        </div>
	      </div>
	    </div>
	  </div>
	</script>

	<script type="text/x-kendo-template" id="track-template">
	  <i class="fa fa-play" data-bind="click: play, invisible: isPlaying">
	    <span> #: trackName #</span>
	  </i>
	  <i class="fa fa-pause" data-bind="click: stop, visible: isPlaying">
	    <span> #: trackName #</span>
	  </i>
	</script>`;

class Albums extends Component {

	constructor(container) {
		
		super(container, template, observable, true);
		
		Component.on('tracks/change', (e, args) => {

			let albums = observable.get('albumsDataSource'),
				  id = observable.get('albumId'),
					album = albums.get(id);

			album.set("tracks", args.tracks);

		});

		Component.on('artist/select', (e, args) => {

			kendo.ui.progress($('#main'), true);

			observable.set('artistId', args.artist.artistId);
			observable.get('albumsDataSource').read();

			observable.set('isEmpty', false);
		});

		new Tracks();
	}
}

export default Albums;