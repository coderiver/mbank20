head.ready(function() {

    (function() {
        var leftElements = $('.figure__left').find('.figure__item').find('.el');
            rightElements = $('.figure__right').find('.figure__item').find('.el');
        function toggleActiveClass(elements) {
            elements.on('click', function() {
                elements.parents('.figure__item').removeClass('is-active');
                $(this).parents('.figure__item').addClass('is-active');
            });
        }
        toggleActiveClass(leftElements);
        toggleActiveClass(rightElements);
    })();

    function Dots (options) {

        var defaultOptions = {
            sectionsSel: 'section.section',
            dotsEl: 'ul.dots',
            dotEl: 'li',
            activeClass: 'is-active',
            scrollSpeed: 600,
            scrollOffset: 40
        };

        options = $.extend(options, defaultOptions);
        this.$sections = $(document.querySelectorAll(options.sectionsSel));
        this.$dots = $(document.querySelector(options.dotsEl));

        var positions = [];

        this.$dots.empty();
        var len = this.$sections.size();
        while (len--) this.$dots.append($('<'+options.dotEl+' />'));

        var pos;
        this.$sections.each(function () {
            pos = ($(this).offset().top - options.scrollOffset) || 0;
            positions.push(pos);
        });
        this.$dotsEls = this.$dots.children(options.dotEl);


        var currentIdx = 0;
        var scrollToSection = (function (idx) {
            console.log('scroll to ', idx, positions[idx]);
            if (idx !== currentIdx) {
                $('html, body').animate({
                    scrollTop: positions[idx] + 2
                }, options.scrollSpeed);
            }
        }).bind(this);

        this.$dotsEls.bind('click', function () {
            var el = $(this);
            scrollToSection(el.index());
        });
        var update = (function updateActive () {
            var position = $(document).scrollTop(),
                len = positions.length,
                index;
            for (var i= 0; i<len; i++) {
                if (position >= positions[i]) index = i;
                else break;
            }
            index = index || 0;
            index = index > (len-1) ? (len-1) : index;
            currentIdx = index;
            this.$dotsEls.removeClass(options.activeClass).eq(index).addClass(options.activeClass);
        }).bind(this);

        $(document).on('scroll', update);
        update();
    }

    new Dots();



    if ( $('.js-phone').length ) {
        (function() {
            var $window = $(window);

            var phone       = $('.js-phone'),

                phoneHeight = phone.height() - 75, //because phone image has bottom shadow
                bottomPoint = $('.js-bottom-point'),
                containerOffset,
                windowHeight,
                topOffset,
                maxBottomPos,
                startPoint,
                endPoint;

            function calculateTopPos() {
                windowHeight = $window.height();
                var delta = windowHeight - phoneHeight;
                topOffset = delta > 80 ? 80 : delta;
                topOffset = topOffset || 0;

                containerOffset = phone.parent().offset().top;
                startPoint  = phone.offset().top - topOffset;
                maxBottomPos = bottomPoint.offset().top + bottomPoint.height();
                endPoint = maxBottomPos - phoneHeight - topOffset;

                updatePos();
            }
            calculateTopPos();

            $window.on('resize', function() {
                if ( $window.width() <= 1000 ) {
                    return phone.css({
                        position  : '',
                        top       : ''
                    });
                } else {
                    calculateTopPos();
                }
            });
            function updatePos () {
                if ($window.width() <= 1000) {
                    return

                }
                var scrollTop = $window.scrollTop();
                if (scrollTop < startPoint) {
                    phone.css({
                        position  : '',
                        top       : ''
                    });
                    return;
                }

                if (scrollTop < endPoint) {
                    phone.css({
                        position: 'fixed',
                        top: topOffset
                    })
                } else {
                    phone.css({
                        position: 'absolute',
                        top: endPoint - containerOffset + topOffset
                    })
                }
            }

            $(document).on('scroll', updatePos.bind(this));
            updatePos();

        })();
    }

    function scaleFigure() {
        var figure      = $('.figure'),
            figureWidth = figure.outerWidth() + 150,
            windowWidth = $(window).width(),
            scale;

        if (windowWidth <= 1000 && !figure.hasClass('is-mobile')) {
            figure.addClass('is-mobile');
        }

        if (windowWidth > 1000 && figure.hasClass('is-mobile')) {
            figure.removeClass('is-mobile');
        }

        if ( figureWidth > windowWidth ) {
            scale = (windowWidth / figureWidth).toFixed(3);
            figure.css({
                '-webkit-transform': 'scale(' + scale + ')',
                    '-ms-transform': 'scale(' + scale + ')',
                        'transform': 'scale(' + scale + ')'
            });
        } else {
            figure.css({
                '-webkit-transform': '',
                    '-ms-transform': '',
                        'transform': ''
            });
        }
    }

    scaleFigure();

    $(window).on('resize', function() {
        if ($(window).width() >= 640) {
            scaleFigure();
        }
    });


    // counter functionality
    function createFlipText(selector) {
        var flipText    = $(selector),
            str         = flipText.text(),
            flipAnimDur = parseInt(flipText.data('duration')),
            animClass   = 'is-animate',
            input,
            characters;

        flipText.text('');
        flipAnimDur = flipAnimDur ? flipAnimDur : 400;

        flipText.parent().append('<input class="js-input-flip-text" type="number" value="' + str + '"/>');
        input = $('.js-input-flip-text');

        function buildCharacters (string) {
            for (var i = 0; i < string.length; i++) {
                flipText.append('<div class="char"><span>0</span>' +
                                   '<div class="char__top"><span>0</span></div>' +
                                   '<div class="char__bottom"><span>0</span></div>' +
                                '</div>');
            }
        }

        function findCharacters() {
            return flipText.find('.char');
        }

        function getRandomInt(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function rebuildCharacters (string) {
            flipText.html('');
            buildCharacters(string);
            characters = findCharacters();
            characters.each(function(index) {
                changeCharValue(this, index);
            });
        }

        function increaseValue () {
            var inputValue = parseInt(input.val());
            inputValue+= getRandomInt(0, 100);
            input.attr('value', inputValue);
            input.change();
        }

        // set character value from 0 to target value with animation
        function setCharValue(selector, index) {
            var char        = $(selector),
                charText    = char.find('> span'),
                charTop     = char.find('.char__top span'),
                charBotom   = char.find('.char__bottom span'),
                targetValue = parseInt(str[index]),
                minValue    = 0;

            function loop () {
                setTimeout(function() {
                    if ( targetValue >= minValue ) {
                        charText.text(minValue);
                        charTop.text(minValue);
                        charBotom.text(minValue);
                        minValue++;
                        if (!char.hasClass(animClass)) {
                            char.addClass(animClass);
                        }
                        loop();
                    } else {
                        char.removeClass(animClass);
                    }
                }, flipAnimDur);
            }

            loop();
        }

        // change character value from current to new
        function changeCharValue(selector, index) {
            var char        = $(selector),
                charText    = char.find('> span'),
                charTop     = char.find('.char__top span'),
                charBotom   = char.find('.char__bottom span');

            function loop() {
                var currentValue = parseInt(charText.text()),
                    newValue = parseInt(str[index]);

                setTimeout(function() {
                    // console.log(newValue, currentValue);
                    if ( newValue !== currentValue ) {
                        targetValue = currentValue === 9 ? 0 : ++currentValue;
                        charText.text(targetValue);
                        charTop.text(targetValue);
                        charBotom.text(targetValue);
                        if (!char.hasClass(animClass)) {
                            char.addClass(animClass);
                        }
                        loop();
                    } else {
                        char.removeClass(animClass);
                    }

                }, flipAnimDur);
            }

            loop();
        }

        buildCharacters(str);

        characters = findCharacters();

        characters.each(function(index) {
            setCharValue(this, index);
        });

        input.on('change', function() {
            str = $(this).val();
            // console.log(str);
            if ( str.length !== characters.length ) {
                rebuildCharacters(str);
            }
            characters.each(function(index) {
                changeCharValue(this, index);
            });
        });

        setTimeout(function() {
            setInterval(increaseValue, flipAnimDur * 11);
        }, flipAnimDur * 10);
    }

    if ( $('.js-flip-text').length ) {
        createFlipText('.js-flip-text');
    }
});