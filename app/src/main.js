import kendo from 'kendo-ui';
import flippable from '../components/kendo-flippable/kendo.flippable.min';

import SearchBox from './components/search-box';
import Artist from './components/artist';
import Player from './components/player';

new Player(document.body);

new SearchBox('#main');

new Artist('#main');

kendo.ui.progress($('.container'), true);
