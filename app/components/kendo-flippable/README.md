# Kendo Flippable

Kendo Flippable is a plugin for Kendo UI that creates a flipping card.  The card, containing a front and back face, can be flipped either vertically or horizontally.

[Check The Demo](http://burkeholland.github.io/kendo-flippable)

## Basic Usage

The Flippable plugin simply abstracts the [kendo.fx.flip](http://docs.telerik.com/kendo-ui/api/framework/fx/flip)(Horizontal or Vertical) into a plugin.  The flip effect is really neat, but requires very specific CSS for the elements it is applied to and I can never remember what those are.

To use the plugin, simply create a container `div` with two child `div`s.  The __first child `div` will be the back__ of the card, and the __second will be the front__.

The card can be flipped either vertically (flipVertical) or horizontally (flipHorizontal).  

```
<div id="card">
    <div>
        <h1>Front</h1>
    </div>
    <div>
        <h1>Back</h1>
    </div>
</div>

<button id="flip">Flip!</button>

<script>

    (function() {

        var card = $('#card').kendoFlippable().data('kendoFlip');

        $('#flip').kendoButton({
            click: function() {
                card.flipHorizontal();                    
            }
        });

    }());

</script>
```

## Configuration

### duration 

> default - 800

Specifies the length of the effect in milliseconds

### height

> default - size of content on front of card

The height of the container element.  The container must have a fixed height since it works with absolute CSS positioning.  The width will be 100% by default, by can be specified with CSS on the container element.

## Events

### click

A click/touch event is exposed assuming you might want to click on the element to flip it.  In that case, `e.sender` will contain a reference to the widget.

```
<div id="card">
    <div>
        <h1>Back</h1>
    </div>
    <div>
        <h1>Front</h1>
    </div>
</div>

<script>
    (function() {

        $('#card').kendoFlippable({
            click: function(e) {
                e.sender.flipHorizontal();    
            }
        });

    }());
</script>
```

## Methods

### flipVertical

Flips the card on the x axis

### flipHorizontal

Flips the car on the y axis

## Important Notes

The card front and back have a class of `k-header` which gives them a background color.  Otherwise the front and back would be transparent and that would look stupid.  Make sure you override the background with CSS to suit your needs.

Don't add more than two items to the Flip element.  I don't know what will happen if you do, but it's safe to assume that it won't work like you want it to.

The plugin is going to give the outer container element a `relative` position and each of the child elements (front and back) an `absolute` position.  This is because the effect assumes that the front and back elements are stacked on top of each other before it manipulates them in the 3d space.

This means that the container object itself will not respect margin and padding the way you expect it to (block level).  __To fix this, set `box-sizing: border-box` on the container and child elements.__
