	var con = {
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
	            con.animate(document.getElementById('stickingMenu'), 60, 0.03);
	        } else if (document.getElementById('stickingMenu').style.opacity == "0") {
	            con.animate(document.getElementById('stickingMenu'), 60, 0.03);
	        }
	    },
	    restore: function() {
	        var el = document.getElementById('stickingMenu'),
	            opacity = el && el.style.opacity;
	        if (opacity > '0' && opacity | 0 == 1) {
	            con.animate(el, 100, 0.3, true);
	        }
	    },
	    scrollTop: function() {
	        return (document.body.scrollTop || document.documentElement.scrollTop);
	    },
	    stickerEngine: function() {
	        var el = document.querySelector('h3'),
	            marginTop = parseInt(window.getComputedStyle(el, null)['marginTop'].match(/\d+/g)[0]);
	        if (con.scrollTop() > el.offsetTop - el.scrollHeight) {
	            con.appendStickyMenu();
	        }
	        if (con.scrollTop() < (el.offsetTop + el.scrollHeight + marginTop)) {
	            con.restore();
	            con.deanimate();
	        }
	    },
	    deanimate: function() {
	        con.els2ani.forEach(function(i) {
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
	        var _con = {
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
	                con.els2ani.forEach(function(i) {
	                    con.animate(i, 110, 0.03);
	                });
	            }	            
	        };
	        _con.delta ? (_con.upwards() && !con.scrollTop() ? con.deanimate() :
	                (_con.downwards() && _con.isAllTheWayDown() ? _con.ani4short() : '')) :
	            (con.scrollTop() ? _con.ani4short() : con.deanimate());	        
				con.stickerEngine();
	    },
	    domReady: function(callback) {
	        con.eventsBinder(document, 'DOMContentLoaded', callback);
	        con.eventsBinder(document, 'onreadystatechange', function() {
	            if (document.readyState === 'complete') {
	                callback();
	            }
	        });
	    },
	    eventsBinder: function(El, event, handler) {
	        if (El && El.addEventListener) {
	            El.addEventListener(event, handler);
	        } else if (El && El.attachEvent) {
	            El.attachEvent('on' + event, handler);
	        }
	    }
	};
	con.domReady(function() {
	    con.els2ani.push(document.querySelector('tr[class="c74"]'));
	    con.eventsBinder(document, con.mousewheelEvt, con.handler);
	    con.eventsBinder(document, 'keyup', con.handler);
	    con.eventsBinder(document, 'mousedown', con.handler);
	    con.eventsBinder(document, 'touchend', con.handler);
	});