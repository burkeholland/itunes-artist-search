(function(f, define){
    define([ "./kendo.core", "./kendo.fx" ], f);
})(function(){

var __meta__ = {
    id: "flippable",
    name: "Flippable",
    category: "web",
    description: "The flippable widget displays a card that flips from front to back.",
    depends: [ "core", "fx" ]
};

(function ($, undefined) {
  
    var kendo = window.kendo,
        ui = kendo.ui,
        Widget = ui.Widget,
        CLICK = "click",
        FLIPSTART = "flipStart",
        FLIPEND = "flipEnd",
        NS = ".kendoFlip",
        proxy = $.proxy;

    var Flippable = Widget.extend({
        
        init: function(element, options) {

            var that = this;

            Widget.fn.init.call(this, element, options);

            element = that.element;

            that.panes = element.children();

            that._wrapper();

            that._panes();

            that._effect();

            element.on(CLICK + NS, proxy(that._click, that));
            element.on(FLIPSTART + NS, proxy(that._flipStart, that));
            element.on(FLIPEND + NS, proxy(that._flipEnd, that));

            that._show();
        },

        options: {
            height: 0,
            width: 0,
            name: "Flippable",
            duration: 800
        },
    
        events: [
            CLICK,
            FLIPSTART,
            FLIPEND
        ],
    
        flipVertical: function() {
            this._flip(this.flipV);
        },

        flipHorizontal: function() {
            this._flip(this.flipH);
        },

        _flip: function(effect) {
            var reverse = this.reverse;

            effect.stop();

            this._flipStart(this);

            reverse ? effect.reverse().then(this._flipEnd(this)) : effect.play().then(this._flipEnd(this));
            this.reverse = !reverse;
        },

        _flipStart: function(e) {

            this.trigger(FLIPSTART, { event: e });
        },

        _flipEnd: function(e) {

            this.trigger(FLIPEND, { event: e });    
        },

        _wrapper: function() {

            var wrapper = this.element,
                panes = this.panes;

            var wrapperHeight = wrapper.height();
            var frontHeight = panes.first().height();

            height = this.options.height ||
                (wrapperHeight > frontHeight ? wrapperHeight : frontHeight);

            wrapper.css({
                position: "relative",
                height: height,
                width: this.options.width || "auto"
            });

        },

        _panes: function() {
            
            var panes = this.panes;

            panes.addClass('k-header');

            panes.each(function() {

                var pane = $(this)

                pane.css({
                    position: "absolute",
                    width: "100%",
                    height: "100%"
                });

            });
        },

        _effect: function() {
            
            var that = this,
                wrapper = that.element,
                panes = that.panes,
                front = panes.first(),
                back = panes.next();

            that.flipH = kendo.fx(wrapper)
                              .flipHorizontal(front, back)
                              .duration(that.options.duration);

            that.flipV = kendo.fx(wrapper)
                              .flipVertical(front, back)
                              .duration(that.options.duration);

            back.hide();

            that.reverse = false;
        },

        _show: function() {
            
            var wrapper = this.element,
                panes = this.panes;

            wrapper.show();
        },

        _click: function (e) {
           this.trigger(CLICK, { event: e });
        }
    });

    ui.plugin(Flippable);

})(window.kendo.jQuery);

return window.kendo;

}, typeof define == 'function' && define.amd ? define : function(_, f){ f(); });
