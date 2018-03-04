// nav code
(function(win, doc, undefined) {
    let header = $('.uninav');
    let nav = $('.uninav__carousel');
    if (!nav.length || !header.length) {
        if (window.console) { console.log('NO UNVERSAL NAVIGATION') };
        return false;
    } else {
        let nextBtn = nav.find('.uninav__carousel__nxt'),
            prvBtn = nav.find('.uninav__carousel__prv'),
            navWindow = nav.find('.uninav__carousel__nav'),
            navGroup = navWindow.find('.uninav__carousel__navlist'),
            tabs = navGroup.find('.uninav__carousel__item'),
            tabWidth = tabs.width(),
            groupWidth = parseInt(tabWidth) * tabs.length,
            shimPx = 2,
            windowWidth = navWindow.width() + shimPx,
            animate = false,
            currentOffset = 0,
            calc = tabWidth;
        navGroup.width(groupWidth);

        let checkButtonStates = function() {
            if (parseInt(currentOffset) == 0) {
                prvBtn.addClass('uninav__carousel__prv--disabled');
            } else {
                prvBtn.removeClass('uninav__carousel__prv--disabled');
            }

            if (parseInt(currentOffset) == ((groupWidth - windowWidth) * -1)) {
                nextBtn.addClass('uninav__carousel__nxt--disabled');
            } else {
                nextBtn.removeClass('uninav__carousel__nxt--disabled');
            }
        };

        let slideAnimation = (calculation,cb) => {
            animate = true;
            currentOffset = currentOffset + calculation;
            // the slide is achieved by adding a a* classname, where * is the offset
            // a corresponding css style will move it the desired amount
            navGroup.get(0).className = navGroup.get(0).className.replace(/uninav__carousel__navlist--a\d+/g,''); // remove the old slide class name
            navGroup.addClass("uninav__carousel__navlist--a"+Math.abs(currentOffset)); // add the new slide classname
            animate = false;
            if(cb) { cb(); }
        }

        let slideMenu = function(direction, cb) {
            if (direction === 'left') {
                if ((animate === false) && (parseInt(currentOffset) > ((groupWidth - windowWidth) * -1))) {
                    slideAnimation(calc*(-1),cb);
                }
            } else if (direction === 'right') {
                if ((animate === false) && parseInt(currentOffset) < 0) {
                    slideAnimation(calc,cb);
                }
            }
        };

        prvBtn.bind('click', function(e) {
            if (!$(this).hasClass('uninav__carousel__prv--disabled')) {
                slideMenu('right', checkButtonStates);
            }
        });

        nextBtn.bind('click', function(e) {
            if (!$(this).hasClass('uninav__carousel__nxt--disabled')) {
                slideMenu('left', checkButtonStates);
            }
        });

        checkButtonStates();
        let completeRegLink = header.find("a.minireg");
        completeRegLink.bind('click', function(e) {
            if (typeof enableAccountsConfig !== 'undefined' && Boolean(enableAccountsConfig) === true) {
                e.preventDefault();
                window.location.href = PCH.RegURL;
            } else {
                e.preventDefault();
                PCH.RFLightbox({ allowClose: true });
            }
        });
        return true;
    }

})(window, window.document);
