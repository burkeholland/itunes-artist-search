import Component from './component';

var albumId = 0;

var observable = kendo.observable({
	tracksDataSource: new kendo.data.DataSource({
    transport: {
      read: {
	  		url: "https://itunes.apple.com/lookup",
	  		dataType: "jsonp"
      },
      parameterMap(options) {
      	options.id = albumId;
      	options.entity = 'song';

      	return options;
      }
    },
    change: function(e) {
  
      // when the tracks are received, lookup the corresponding album and add
      // these tracks to the tracks placeholder on that album
    	Component.trigger('tracks/change', { tracks: this.view() });

    },
    schema: {
      data: "results",
      parse: function(data) {
        // add a default 'isPlaying' flag which will be used later to determine
        // the state of a particular track in the UI
        $.each(data.results, function() {
          this.isPlaying = false;
        });
        return data;
      },
      model: {
        id: 'collectionId',
        fields: {
          releaseDate: {
            type: "date"
          }
        }
      }
    },
    filter: { field: "wrapperType", operator: "equals", value: "track" }
  })
});

Component.on('tracks/read', (e, id) => {
	albumId = id;
	observable.get('tracksDataSource').read(id);
});

class Tracks extends Component {
  constructor(container) {
    super(container, null, null, false);
  }
}

export default Tracks;