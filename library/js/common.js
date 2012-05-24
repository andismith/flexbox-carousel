var carousel = (function(){

    var container = document.getElementById('carousel'),
        items = container.getElementsByTagName('ul')[0];

    var active = 0, // the active item (sits far left)
        properties = {}, // used to calculate scroll distance
        animating = false; // whether the carousel is currently animating
    
    // use Modernizr.prefixed to get the prefixed version of boxOrdinalGroup
    var boxOrdinalGroup = Modernizr.prefixed( 'boxOrdinalGroup' );

    // list of the end event names in different browser implementations
    var transEndEventNames = {
           'WebkitTransition' : 'webkitTransitionEnd',
           'MozTransition'    : 'transitionend',
           'OTransition'      : 'oTransitionEnd',
           'msTransition'     : 'MsTransitionEnd',
           'transition'       : 'transitionend'
        };

    // use Modernizr.prefixed to work out which one we need
    var transitionEnd = transEndEventNames[ Modernizr.prefixed('transition') ];

            
    function move(e) {
        // prevent the click action
        e.preventDefault();

        // check if the carousel is mid-animation
        if (!animating) {

            // get the event's source element
            var target = e.target || e.srcElement;

            // find out if we are moving next or previous based on class
            var next = target.classList.contains( 'next' );

            var margin = 0;//= parseInt(items.style.marginLeft) || 0;

            // allow our carousel to animate
            container.classList.add( 'animate' );
            animating = true;

            if (next) {

                margin = -( ( properties.width*2 )+ properties.marginRight );

                if ( active < items.children.length - 1 ) {
                    active++;
                } else {
                    active = 0;
                }
            } else {

                margin = properties.marginRight;

                if ( active > 0 ) {
                    active--;
                } else {
                    active = items.children.length - 1;
                }
            }

            items.style.marginLeft = margin + 'px';
        }


    }

    function complete() {
        if ( animating ) {
            animating = false;

            // this needs to be removed so animation does not occur when the ordinal is changed and the carousel reshuffled
            container.classList.remove( 'animate' );
            
            // change the ordinal
            changeOrdinal();

            // change the margin now there are a different number of items off screen
            items.style.marginLeft = -( properties.width ) + 'px';
        }
    }


    function changeOrdinal() {

        var length = items.children.length, 
            ordinal = 0;
        
        // start at the item BEFORE the active one.
        var index = active-1;

        /* if the active item was 0, we're now at -1 so
            set to the last item */
        if (index < 0) {
            index = length-1;
        }

        // now run through adding the ordinals
        while ( ordinal < length ) {
            // add 1 to the ordinal - ordinal cannot be 0.
            ordinal++;

            // check the item definetely exists :)
            var item = items.children[index];
            if ( item && item.style ) {
                // new ordinal value
                item.style[boxOrdinalGroup] = ordinal;
            }

            /* as we are working from active we need to go back to
               the start if we reach the end of the item list */
            if ( index < length-1 ) {
                index++;
            } else {
                index = 0;
            }

        }

    }

    return {
        init: function() {

            var navigation = document.querySelectorAll( 'a.navigation' );
            var length = navigation.length;

            // add an event listener to each navigation item
            var i = 0;
            while (i < length) {
                navigation[i].addEventListener( 'click' , move );
                i++;
            }

            // event listener for end of a transition
            items.addEventListener( transitionEnd, complete );

            // get initial width and margin
            if (items.children.length > 0) {
                    
                var itemStyle = window.getComputedStyle( items.children[0], null ) || items.children[0].currentStyle;
                
                properties = {
                    width: parseInt( itemStyle.getPropertyValue( 'width' ), 10 ),
                    marginRight: parseInt( itemStyle.getPropertyValue( 'margin-right' ), 10 )
                };

            }

            // set the initial ordinal values
            changeOrdinal();

        }()

    }


})();

