function Config() {
    var config = {
        altCol: {
            '': {
                'state': {
                    'click': 0,
                    'keyup': 0
                },
                '_config': null,
                'src': "",
                'width': '40%',
                'enlargeToWidth': 27,
                'left': 40
            }
        },
        getter: function(alt, _config, src, width, enlargeToWidth, left) {
            if (_config && alt) {
                return config.altCol[alt] && config.altCol[alt]['_config'] ? config.altCol[alt]['_config'] : null;
            } else if (!_config && alt && !src && !width && !enlargeToWidth && !left) {
                if (config.altCol[alt]) {
                    return config.altCol[alt] && config.altCol[alt]['state'] ? config.altCol[alt]['state'] : null;
                } else {
                    return false;
                }
            } else if (!arguments.length) {
                return Object.keys(config.altCol);
            } else if (alt && src) {
                return config.altCol[alt] && config.altCol[alt]['src'] ? config.altCol[alt]['src'] : null;
            } else if (alt && width) {
                return config.altCol[alt] && config.altCol[alt]['width'] ? config.altCol[alt]['width'] : null;
            } else if (alt && enlargeToWidth) {
                return config.altCol[alt] && config.altCol[alt]['enlargeToWidth'] ? config.altCol[alt]['enlargeToWidth'] : null;
            } else if (alt && left) {
                return config.altCol[alt] && config.altCol[alt]['left'] ? config.altCol[alt]['left'] : null;
            }
        },

        setter: function(alt, val, _config) {
            if (_config && alt) {
                !config.altCol[alt]['_config'] ? config.altCol[alt]['_config'] = _config : '';
            } else if (alt && val) {
                if (({}).toString.call(val) === '[object Object]') {
                    for (var i in val) {
                        config.altCol[alt]['state'][i] = val[i];
                    }
                }
            }
        },

        domReady: function(callback) {
            config.eventsBinder(document, 'DOMContentLoaded', function() {
                callback();
                callback = function() {};
            });

            config.eventsBinder(document, 'readystatechange', function() {
                if (document.readyState === 'complete') {
                    callback();
                    callback = function() {};
                }
            });

        },

        eventsBinder: function(El, event, handler) {

            if (El && El.addEventListener) {
                El.addEventListener(event, handler);
            } else if (El && El.attachEvent) {
                El.attachEvent('on' + event, handler);
            }
        },

        eventsUnbinder: function(El, event, handler) {
            if (El && El.removeEventListener) {
                El.removeEventListener(event, handler);
            }

            if (El && El.detachEvent) {
                El.detachEvent('on' + event, handler);
            }
        },

        url: 'data/slides.js',
        slidesCollection: '',
        postingCalls: function(url, jsonify) {
            'use strict';
            if (Object.prototype.toString.call(url) === "[object String]") {
                var request = new XMLHttpRequest();
                if (!~navigator.userAgent.indexOf('IE')) {
                    request.overrideMimeType("application/json");
                }
                request.open('get', url, true);
                request.onreadystatechange = function() {
                    if (request.readyState === 4) {
                        if (jsonify) {
                            config.slidesCollection = JSON.parse(request.responseText);
                            config.post = function() {
                                config.getSlideHTML();
                            };
                            /*
                            	the instance is statically non-changing:
                            	therefore this function as part of the expernalized post 
                            	method has to be redefined for onscroll event to work:
                            */
                            config.getSlidesCollection = config.getSlideHTML;
                            config.post();
                        } else {
                            var _slide_ = request.responseText;
                            var lastSlide = document.querySelector('.slide-wrapper:last-of-type') ||
                                document.querySelector('.slide-wrapper');
                            var lastSlideParent = lastSlide.parentNode;
                            lastSlideParent.innerHTML = lastSlideParent.innerHTML + _slide_;
                            if (document.querySelector('.slide-wrapper:last-of-type')) {
                                config.animatory.els2ani.push(document.querySelector('.slide-wrapper:last-of-type'));
                            } /* else {
                                config.animatory.els2ani.push(document.querySelector('.slide-wrapper'));
                            } */
                            config.menu.cleanMenu();
                            config.animatory.deanimate();
							
							config.animatory.els2ani.forEach(function(i, j, arr) {
								config.animatory.animate(i, 110, 0.03);
							});
						}
                    }
                }
                request.send();
            }
        },
        closest: function(el, tagName) {
            while (el && el != document.body && el.tagName != tagName) {
                el = el.parentNode;
            }
            return el && el.tagName == tagName ? el : null;
        },

        getSlidesCollection: function() {
            if (Object.prototype.toString.call(config.url) === "[object String]" && !config.slidesCollection) {
                config.postingCalls(config.url, true);
            }
        },
        getSlideHTML: function() {
            var slidesCollection = config.slidesCollection[Object.keys(config.slidesCollection)[0]];
            if (slidesCollection && slidesCollection.length) {
                if (instance.slideIndex && slidesCollection[instance.slideIndex]) {
                    config.postingCalls(slidesCollection[instance.slideIndex]);
                    config.slidesCollection[Object.keys(config.slidesCollection)[0]][instance.slideIndex] = '';
                    instance.slideIndex = '';
                }
            }
        },
        post: function() {
            config.getSlidesCollection();
        },
        constructor: function(targetEl, _e, _g, s, _u) {
            var _config = {
                documentCreateElement: function(El, id, style, text) {
                    var returnable;
                    if (El) {
                        returnable = document.createElement(El);
                        id ? returnable.id = id : '';
                        if (style && ({}).toString.call(style) === '[object Array]') {
                            for (var i = style.length; i--;) {
                                if (({}).toString.call(style[i]) === '[object Object]') {
                                    for (var j in style[i]) {
                                        returnable.style[j] = style[i][j];
                                    }
                                }
                            }
                        }
                        if (text && ({}).toString.call(text) === '[object String]') {
                            returnable['innerText' in returnable ? 'innerText' : 'innerHTML'] = text;
                        }
                    }
                    return returnable;
                },
                appendOpacityDivToBody: function() {

                    document.body.appendChild(_config.documentCreateElement('div', 'OpacityDivToBody', [{
                        'backgroundColor': '#000'
                    }, {
                        'bottom': '0'
                    }, {
                        'left': '0'
                    }, {
                        'opacity': '0.7'
                    }, {
                        'position': 'fixed'
                    }, {
                        'right': '0'
                    }, {
                        'top': '0'
                    }, {
                        'zIndex': '9999'
                    }]));
                },

                scroller: function(e) {
                    var event = window.event || e,
                        delta = event.detail ? event.detail * (-120) : event.wheelDelta,
                        subRoutine = function(d) {
                            var handledImageContainer = document.querySelector('#handledImageContainer');
                            if (d >= 120 && handledImageContainer) {
                                handledImageContainer.style.width = parseInt(handledImageContainer.style.width.match(/\d+/)) + 1 + '%';
                            }
                            if (d <= -120 && handledImageContainer) {
                                handledImageContainer.style.width = parseInt(handledImageContainer.style.width.match(/\d+/)) - 1 + '%';
                            }
                        };
                    if (delta && event.ctrlKey) {
                        subRoutine(delta);
                    }
                    return false;
                },

                slides_scroller: function(e) {
                    var event = window.event || e,
                        delta = event.detail ? event.detail * (-120) : event.wheelDelta,
                        subRoutine = function(d) {
                            var slide = document.querySelector('#handledSlideContainer');
                            if (d >= 120 && slide) {
                                slide.style.width = parseInt(handledImageContainer.style.width.match(/\d+/)) + 1 + '%';
                            }
                            if (d <= -120 && slide) {
                                slide.style.width = parseInt(handledImageContainer.style.width.match(/\d+/)) - 1 + '%';
                            }
                        };
                    if (delta && event.ctrlKey) {
                        subRoutine(delta);
                    }
                    return false;
                },

                arrowPress: function(e) {
                    var event = e || window.event,
                        handled_Image_Slide_Container = document.querySelector('#handledImageContainer') || document.querySelector('#handledSlideContainer'),
                        leftDefaultValue = handled_Image_Slide_Container ? _g(handled_Image_Slide_Container.querySelector('img') ? handled_Image_Slide_Container.querySelector('img').alt : '', '', '', '', '', 1) : 35,
                        imageParentNodeEnlargedWidth = handled_Image_Slide_Container ? _g(handled_Image_Slide_Container.querySelector('img').alt, '', '', '', 1) : 90;
                    switch (event.keyCode.toString()) {
                        case '38':
                            {
                                handled_Image_Slide_Container ? handled_Image_Slide_Container.style.top =
                                parseInt(handled_Image_Slide_Container.style.top.match(/[-]?\d+/)) - 1 + '%' : null;
                                break;
                            }
                        case '40':
                            {
                                handled_Image_Slide_Container ? handled_Image_Slide_Container.style.top =
                                parseInt(handled_Image_Slide_Container.style.top.match(/[-]?\d+/)) + 1 + '%' : null;
                                break;
                            }
                        case '37' || '':
                            {
                                if (handled_Image_Slide_Container) {
                                    !handled_Image_Slide_Container.style.left ||
                                        parseInt(handled_Image_Slide_Container.style.left.match(/[-]?\d+/)) > leftDefaultValue ?
                                        handled_Image_Slide_Container.style.left = leftDefaultValue + '%' : handled_Image_Slide_Container.style.left;
                                    handled_Image_Slide_Container.style.left = parseInt(handled_Image_Slide_Container.style.left.match(/[-]?\d+/)) - 1 + '%';
                                }
                                break;
                            }
                        case '39':
                            {
                                if (handled_Image_Slide_Container) {
                                    !handled_Image_Slide_Container.style.left ||
                                        parseInt(handled_Image_Slide_Container.style.left.match(/[-]?\d+/)) < leftDefaultValue ?
                                        handled_Image_Slide_Container.style.left = leftDefaultValue + '%' : handled_Image_Slide_Container.style.left;
                                    handled_Image_Slide_Container.style.left =
                                        parseInt(handled_Image_Slide_Container.style.left.match(/[-]?\d+/)) + 1 + '%';

                                }
                                break;
                            }
                        case '48':
                            {
                                if (handled_Image_Slide_Container && event.ctrlKey) {
                                    parseInt(handled_Image_Slide_Container.style.width.match(/[-]?\d+/)) > imageParentNodeEnlargedWidth ||
                                        parseInt(handled_Image_Slide_Container.style.width.match(/[-]?\d+/)) < imageParentNodeEnlargedWidth ?
                                        handled_Image_Slide_Container.style.width = imageParentNodeEnlargedWidth + '%' : '';
                                    parseInt(handled_Image_Slide_Container.style.left.match(/[-]?\d+/)) !== leftDefaultValue ?
                                        handled_Image_Slide_Container.style.left = leftDefaultValue + '%' : '';
                                }
                                break;
                            }
                        case '187':
                            {
                                if (handled_Image_Slide_Container && event.ctrlKey) {
                                    handled_Image_Slide_Container.style.width = parseInt(handled_Image_Slide_Container.style.width.match(/\d+/)) + 1 + '%';
                                }
                                break;
                            }

                        case '189':
                            {
                                if (handled_Image_Slide_Container && event.ctrlKey) {
                                    handled_Image_Slide_Container.style.width = parseInt(handled_Image_Slide_Container.style.width.match(/\d+/)) - 1 + '%';
                                }
                                break;
                            }
                    }
                },

                handler: function(e) {
                    var _e = e || event,
                        executable,
                        _ex = e.target,
                        subRoutine = function(eventType) {

                            var OpacityDivToBody = document.getElementById('OpacityDivToBody');
                            if (OpacityDivToBody) {
                                OpacityDivToBody.parentNode.removeChild(OpacityDivToBody);
                            }
                            if (document.querySelector('#wrapper') && document.querySelector('#handledImageContainer')) {
                                document.querySelector('#wrapper').removeChild(document.querySelector('#handledImageContainer'));
                            }
                            _u(_ex, eventType, _config.handler);
                            _u(document, event.type, _config.scroller);
                            _u(window, eventType, _config.handler);

                            var a = {};
                            a[eventType.toString()] = 0;
                            s(targetEl.alt, a);
                        };

                    if (_e.type === 'keyup' | 'onkeyup') {
                        executable = function() {
                            if (_e.keyCode.toString() === '27') {
                                subRoutine(_e.type);
                            }
                        };
                    } else if (_e.type === 'click' | 'onclick') {
                        executable = function() {
                            subRoutine(_e.type);
                        };
                    }
                    executable();
                },

                slidesHandler: function(e) {
                    var _e = e || event,
                        executable,
                        _ex = e.target,
                        subRoutine = function(eventType) {
                            var OpacityDivToBody = document.getElementById('OpacityDivToBody');
                            if (OpacityDivToBody) {
                                OpacityDivToBody.parentNode.removeChild(OpacityDivToBody);
                            }
                            if (document.querySelector('#wrapper') && document.querySelector('#handledSlideContainer')) {
                                document.querySelector('#wrapper').removeChild(document.querySelector('#handledSlideContainer'));
                            }
                            _u(_ex, eventType, _config.handler);
                            _u(document, event.type, _config.scroller);
                            _u(window, eventType, _config.handler);
                        };

                    if (_e.type === 'keyup' | 'onkeyup') {
                        executable = function() {
                            if (_e.keyCode.toString() === '27') {
                                subRoutine(_e.type);
                            }
                        };
                    } else if (_e.type === 'click' | 'onclick') {
                        executable = function() {
                            subRoutine(_e.type);
                        };
                    }
                    executable();
                },

                handleImageContainer: function() {
                    if (targetEl) {
                        if (!document.getElementById('handledImageContainer')) {

                            var _el = _config.documentCreateElement('div', 'handledImageContainer', [{
                                    'display': 'block'
                                }, {
                                    'width': _g(targetEl.alt, '', '', '', 1) + '%'
                                }, {
                                    'position': 'fixed'
                                }, {
                                    'zIndex': '10001'
                                }, {
                                    'top': '5%'
                                }, {
                                    'background': '#FFF'
                                }, {
                                    'text-align': 'center'
                                }, {
                                    'left': (_g(targetEl.alt, '', '', '', '', 1) + '%') ? (_g(targetEl.alt, '', '', '', '', 1) + '%') : 0
                                }]),
                                _ex = _config.documentCreateElement('div', '', [{
                                    'background-image': "url('images/close.png')"
                                }, {
                                    'position': 'absolute'
                                }, {
                                    'display': 'inline-block'
                                }, {
                                    'background-repeat': 'no-repeat'
                                }, {
                                    'cursor': 'pointer'
                                }, {
                                    'height': '45px'
                                }, {
                                    'width': '40px'
                                }, {
                                    'top': '-20px'
                                }, {
                                    'max-width': '50px'
                                }, {
                                    'right': '-25px'
                                }, {
                                    'padding-left': '4px'
                                }, {
                                    'background-size': '40px 40px'
                                }], ''),
                                imgClone,
                                mousewheelEvt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

                            imgClone = targetEl.cloneNode();
                            imgClone.style.width = '95%';
                            imgClone.style.marginLeft = '0';
                            imgClone.style.paddingTop = '8px';

                            document.getElementById('wrapper').appendChild(_el);
                            _el.appendChild(imgClone);
                            _el.appendChild(_ex);

                            if (!_g(targetEl.alt)['mousewheelEvt']) {
                                s(targetEl.alt, {
                                    'mousewheelEvt': 1
                                });
                                _e(document, mousewheelEvt, _config.scroller);
                            }

                            s(targetEl.alt, {
                                'click': 1
                            });

                            _e(_ex, 'click', function(e) {
                                _config.handler(e);
                            });

                            if (!_g(targetEl.alt)['keyup']) {
                                s(targetEl.alt, {
                                    'keyup': 1
                                });
                                _e(window, 'keyup', function(e) {
                                    _config.handler(e);
                                });
                            }

                            if (!_g(targetEl.alt)['arrowPress']) {
                                s(targetEl.alt, {
                                    'arrowPress': 1
                                });
                                _e(window, 'keydown', _config.arrowPress);
                            }

                            if (!document.querySelector('#OpacityDivToBody')) {
                                _config.appendOpacityDivToBody();
                            }
                        }
                    }
                },

                handleSlideContainer: function(which) {
                    if (targetEl) {
                        if (!document.getElementById('handledSlideContainer')) {
                            var _el = _config.documentCreateElement('div', 'handledSlideContainer', [{
                                    'display': 'block'
                                }, {
                                    'width': 80 + '%'
                                }, {
                                    'position': 'fixed'
                                }, {
                                    'zIndex': '10001'
                                }, {
                                    'top': '5%'
                                }, {
                                    'background': '#FFF'
                                }, {
                                    'text-align': 'center'
                                }, {
                                    'left': '10%'
                                }]),
                                _ex = _config.documentCreateElement('div', '', [{
                                    'background-image': "url('images/close.png')"
                                }, {
                                    'position': 'absolute'
                                }, {
                                    'display': 'inline-block'
                                }, {
                                    'background-repeat': 'no-repeat'
                                }, {
                                    'cursor': 'pointer'
                                }, {
                                    'height': '45px'
                                }, {
                                    'width': '40px'
                                }, {
                                    'top': '-20px'
                                }, {
                                    'max-width': '50px'
                                }, {
                                    'right': '-25px'
                                }, {
                                    'padding-left': '4px'
                                }, {
                                    'background-size': '40px 40px'
                                }], ''),
                                mousewheelEvt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

                            document.getElementById('wrapper').appendChild(_el);
                            _el.appendChild(which.cloneNode(true));
                            _el.appendChild(_ex);
                            _e(document, mousewheelEvt, _config.slides_scroller);
                            _e(_ex, 'click', function(e) {
                                _config.slidesHandler(e);
                            });
                            _e(window, 'keyup', function(e) {
                                _config.slidesHandler(e);
                            });
                            _e(window, 'keydown', _config.arrowPress);
                            if (!document.querySelector('#OpacityDivToBody')) {
                                _config.appendOpacityDivToBody();
                            }
                        }
                    }
                },
                onclickHandler: function(which) {
                    which.tagName == "IMG" ? _config.handleImageContainer() :
                        _config.handleSlideContainer(which);
                }
            };

            return {
                o: _config.onclickHandler
            }
        },

        menu: {
            cleanMenu: function() {
                document.querySelector('#leftbar').innerHTML = "";
                Array.prototype.forEach.call(document.querySelectorAll('h2'), function(i, j) {
                    if (i.children.length) {
                        var child = i.removeChild(i.firstChild);
                        var text = child ? child.innerHTML : '';
                        i.innerHTML = text ? text : i.innerHTML;
                        i.removeAttribute('name');
                    }
                });
                Array.prototype.forEach.call(document.querySelectorAll('h3'), function(i, j) {
                    if (i.children.length) {
                        var child = i.removeChild(i.firstChild);
                        var text = child ? child.innerHTML : '';
                        i.innerHTML = text ? text : i.innerHTML;
                        i.removeAttribute('name');
                    }
                });
                config.menu.buildMenu();
            },

            addClass: function(el, className) {
                return el.className = className;
            },
            headings: function() {
                var el = document.createElement('div');
                config.menu.addClass(el, 'headingGroup');
                return el;
            },
            a: function(el, h, n) {
                var _a = document.createElement('a');
                _a['innerHTML' ? 'innerHTML' : 'innerText'] = h ? h : '';
                n ? (n.match(new RegExp('#', 'g')) ? _a.setAttribute('href', n) : _a.setAttribute('name', n)) : '';
                return _a;
            },
            buildMenu: function() {
                var leftbar = document.querySelector('#leftbar'),
                    h2Col = document.querySelectorAll('h2'),
                    h,
                    headingGroup1stAnchor,
                    recur = function(el, j) {
                        if (el.nextElementSibling && el.nextElementSibling !== h2Col[j + 1]) {
                            if (el.nextElementSibling.tagName == 'H3') {
                                var _h = el.nextElementSibling['innerHTML' ? 'innerHTML' : 'innerText'],
                                    _name = _h.replace(/\s+/g, '');
                                el.nextElementSibling['innerHTML' ? 'innerHTML' : 'innerText'] = '';
                                el.nextElementSibling.appendChild(config.menu.a(el.nextElementSibling, _h, _name));
                                h.appendChild(config.menu.a(el.nextElementSibling, _h, '#' + _name));
                            }
                        } else {
                            return;
                        }
                        recur(el.nextElementSibling, j);
                    };
                Array.prototype.forEach.call(h2Col, function(i, j) {
                    i.setAttribute('name', i['innerHTML'].replace(/\s+/g, ''));
                    h = config.menu.headings();
                    headingGroup1stAnchor = config.menu.a(i, i.innerHTML);
                    i.innerHTML = '';
                    i.appendChild(headingGroup1stAnchor.cloneNode(true));
                    i.firstChild.setAttribute('name', i['innerHTML'].match(/[^<a>].*[^</a>]/g)[0].replace(/\s+/g, ''));
                    headingGroup1stAnchor.setAttribute('href', '#' + i.firstChild.name);
                    h.appendChild(headingGroup1stAnchor);
                    recur(i, j);
                    leftbar.appendChild(h);
                });
                Array.prototype.forEach.call(document.querySelectorAll('.headingGroup:not(:first-child) a:not(:first-child)'), function(i, j) {
                    i.style.display = "none";
                });
            },
            slide: function(ms) {
                var slide_itemizely = {
                    scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
                    firstHeadingCol: document.querySelectorAll('.firstHeading'),
                    map: {},
                    mapper: function() {
                        Array.prototype.forEach.call(this.firstHeadingCol, function(i, j) {
                            slide_itemizely.map[j] = i.offsetTop;
                        });
                    },
                    getter: function(key) {
                        return this.firstHeadingCol[Object.keys(this.map)[key]]
                    },
                    item2Show: '',
                    targetedElSiblings: [],
                    counterPartNamesEls: {},
                    router: function() {
                        Object.keys(this.map).forEach(function(i, j) {
                            slide_itemizely.item2Show = slide_itemizely.scrollTop >= slide_itemizely.map[i] ? i : slide_itemizely.item2Show;
                        });

                        var elCol = document.querySelectorAll('.headingGroup :first-child'),
                            targetedEl;
                        Array.prototype.forEach.call(elCol, function(i, j) {
                            if (i && slide_itemizely.item2Show && i.innerHTML &&
                                i.innerHTML == slide_itemizely.firstHeadingCol[slide_itemizely.item2Show].innerText) {
                                targetedEl = i;
                                while (targetedEl.nextElementSibling) {
                                    slide_itemizely.targetedElSiblings.push(targetedEl.nextElementSibling);
                                    targetedEl = targetedEl.nextElementSibling;
                                }
                                slide_itemizely.targetedElSiblings.forEach(function(i, j) {
                                    var href = i.getAttribute("href");
                                    href = href.replace(/#/, ''),
                                        lookUpStr = 'a[name*="' + href + '"' + ']',
                                        el = document.querySelector(lookUpStr);

                                    if (slide_itemizely.scrollTop >= el.offsetTop && slide_itemizely.scrollTop) {

                                        Array.prototype.forEach.call(document.querySelectorAll('a[style*=color]'), function(i, j) {
                                            i.style.color = '#0066FF';
                                            i.style.fontWeight = '';
                                        });

                                        i.style.color = '#000000';
                                        i.style.fontWeight = 'bold';
                                    }
                                });
                                Array.prototype.forEach.call(document.querySelectorAll('.headingGroup a:not(:first-child)'),
                                    function(i, j) {
                                        i.style.display = 'none';
                                    });

                                slide_itemizely.targetedElSiblings.forEach(function(i, j) {
                                    i.style.display = 'block';
                                });

                            }
                        });
                        slide_itemizely.targetedElSiblings = [];
                    }
                };

                if (!Object.keys(slide_itemizely.map).length) {
                    slide_itemizely.mapper();
                }
                slide_itemizely.router();
            }
        },

        animatory: {
            els2ani: [],
            mousewheelEvt: (/Firefox/i.test(navigator.userAgent)) ? 'DOMMouseScroll' : 'mousewheel',
            appendStickyMenu: function() {
                if (!document.getElementById('stickingMenu')) {
                    var newEl = document.createElement('div'),
                        insideEl = document.createElement('div');
                    newEl.id = "stickingMenu";
                    insideEl.id = "washer";
                    newEl.style.opacity = '0.2';
                    insideEl.style.width = document.querySelector('table').offsetWidth + 'px';
                    insideEl.appendChild(document.querySelector('h3').cloneNode(true));
                    insideEl.querySelector('h3').innerHTML = document.querySelector('h1 span').innerHTML + insideEl.querySelector('h3').innerHTML;
                    document.body.appendChild(newEl);
                    document.getElementById('stickingMenu').appendChild(insideEl);
                    config.animatory.animate(document.getElementById('stickingMenu'), 60, 0.03);
                } else if (document.getElementById('stickingMenu').style.opacity == "0") {
                    config.animatory.animate(document.getElementById('stickingMenu'), 60, 0.03);
                }
            },
            restore: function() {
                var el = document.getElementById('stickingMenu'),
                    opacity = el && el.style.opacity;
                if (opacity > '0' && opacity | 0 == 1) {
                    config.animatory.animate(el, 100, 0.3, true);
                }
            },
            scrollTop: function() {
                return (document.body.scrollTop || document.documentElement.scrollTop);
            },
            stickerEngine: function() {
                var el = document.querySelector('h3'),
                    marginTop = parseInt(window.getComputedStyle(el, null)['marginTop'].match(/\d+/g)[0]);
                if (config.animatory.scrollTop() > el.offsetTop - el.scrollHeight) {
                    config.animatory.appendStickyMenu();
                }
                if (config.animatory.scrollTop() < (el.offsetTop + el.scrollHeight + marginTop)) {
                    config.animatory.restore();
                    config.animatory.deanimate();
                }
            },
            deanimate: function() {
                config.animatory.els2ani.forEach(function(i) {
                    i && i.style ? i.style.opacity = '0.2' : '';
                });
            },
            animate: function(el, time, step, reverse) {
                var _interval,
                    direct = function() {
                        if (el && !el.style.opacity.match(/^1[.]/)) {
                            el.style.opacity = parseFloat(el.style.opacity) + step;
                        } else {
                            clearInterval(_interval);
                        }
                    },
                    obverse = function() {
                        if (document.getElementById('stickingMenu').style.opacity > 0) {
                            document.getElementById('stickingMenu').style.opacity = parseFloat(document.getElementById('stickingMenu').style.opacity) - step;
                        } else {
                            clearInterval(_interval);
                            document.getElementById('stickingMenu').style.opacity = 0;
                        }
                    };
                _interval = setInterval(function() {
                    reverse ? obverse() : direct();
                }, time);
            },
            handler: function(e) {
                var _animatory = {
                    runOnce: false,
                    event: window.event || e,
                    delta: (window.event || e).detail ? (window.event || e).detail * (-120) : (window.event || e).wheelDelta,
                    upwards: function() {
                        return this.delta >= 120;
                    },
                    downwards: function() {
                        return this.delta <= -120;
                    },
                    isAllTheWayDown: function() {
                        return window.innerHeight + 30 + (window.scrollY ? window.scrollY : window.pageYOffset) >= document.body.offsetHeight;
                    },
                    ani4short: function() {
                        config.animatory.els2ani.forEach(function(i) {
                            config.animatory.animate(i, 110, 0.03);
                        });
                    }
                };
                _animatory.delta ? (_animatory.upwards() && !config.animatory.scrollTop() ? config.animatory.deanimate() :
                        (_animatory.downwards() && _animatory.isAllTheWayDown() ? _animatory.ani4short() : '')) :
                    (config.animatory.scrollTop() ? _animatory.ani4short() : config.animatory.deanimate());
                config.animatory.stickerEngine();
            }
        }
    };
    return {
        d: config.domReady,
        e: config.eventsBinder,
        u: config.eventsUnbinder,
        s: config.setter,
        g: config.getter,
        F: config.constructor,
        S: config.handleSlideContainer,
        p: config.post,
        c: config.closest,
        m: config.menu,
        ani: config.animatory
    }
};
var instance = !instance ? instance = new Config() : instance;

instance.d(function() {
    instance.m.buildMenu();
    /* var prettyprintedElCol = document.querySelectorAll('.prettyprinted');
    if (prettyprintedElCol.length) {
        Array.prototype.forEach.call(prettyprintedElCol, function(i, j) {
            i.removeAttribute('class');
        });
    }
    prettyPrint(); */
    instance.lastSlide = document.querySelector('.slide-wrapper:last-of-type') || document.querySelector('.slide-wrapper');
    instance.slideIndex = "";
    instance.slideIndexArray = [];
    instance.e(document, 'scroll', function(e) {
        instance.lastSlide = document.querySelector('.slide-wrapper:last-of-type') || document.querySelector('.slide-wrapper');
        instance.slideIndex = instance.lastSlide.getAttribute('index');
        instance.lastSlideOffsetTop = instance.lastSlide.offsetTop;
        if (instance.slideIndex && (~~instance.slideIndexArray.indexOf(instance.slideIndex) || !instance.slideIndexArray.length)) {
            if (instance.lastSlide && document.body.scrollTop >= instance.lastSlideOffsetTop / 1.2) {
                instance.slideIndexArray.push(instance.slideIndex);
                instance.p();
            }
        }
        instance.m.slide(100);
    });
    instance.g().forEach(function(i) {
        var img = new Image(),
            parent = i ? document.querySelector('#' + i) : '';
        if (parent && !parent.children.length) {
            img.alt = i;
            img.src = instance.g(i, '', 1);
            img.style.cursor = 'pointer';
            img.style.width = instance.g(i, '', '', 1);
            parent ? parent.appendChild(img) : null;
        }
    });
});
/*animation:*/
instance.e(document, instance.ani.mousewheelEvt, instance.ani.handler);
instance.e(document, 'keyup', instance.ani.handler);
instance.e(document, 'mousedown', instance.ani.handler);
instance.e(document, 'touchend', instance.ani.handler);

instance.e(document, 'click', function(e) {
    var event = e || event,
        target = event.target || event.srcElement,
        _config;
    if ((target.tagName === 'IMG' && instance.g(target.alt))) {
        if (!instance.g(target.alt, 1)) {
            _config = new instance.F(target, instance.e, instance.g, instance.s, instance.u);
            instance.s(target.alt, '', _config);
        }
        if (instance.g(target.alt, 1)) {
            instance.g(target.alt, 1).o(target.alt);
        }
    } else if (instance.c(e.target, 'TABLE')) {
        _config = !instance.instance ? new instance.F(target, instance.e, instance.g, instance.s, instance.u) : instance.instance;
        _config.o(instance.c(e.target, 'TABLE'));
    }
});