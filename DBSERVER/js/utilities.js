// This function is used to append a cross that can be used to close the modal
// dialogues that the reveal plugin creates.

var utilXMLHeader = '<?xml version="1.0" encoding="ISO-8859-1"?><d>';
var utilXMLFooter = '</d>';

$(document).ready(function() {
   $('.reveal-modal').append('<a class="close-reveal-modal">&#215;</a>');
});

// This is a wrapper around the jQuery AJAX function, so that calls to AJAX
// can be handled in slightly fewer lines of code in our functions.
// The most interesting characteristic of this wrapper is the parameter
// called prSuccessCallBack which is basically a reference to the function
// that we want to pass the result from the AJAX call once it has been
// received from the server.

function AJAXCall(prURL, prData, prSuccessCallBack, prErrorCallBack) {
   $.ajax({
      type: "POST",
      url: prURL,
      data: prData,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: prSuccessCallBack,
      error: prErrorCallBack
   });
}

// This is much like the previous AJAXCall except this one forces the call
// to be made Synchronously. This will lock the browser until a response 
// is received, but may be necessary if other JavaScript functions depend
// on the response to be completed.

function SyncAJAXCall(prURL, prData, prSuccessCallBack, prErrorCallBack) {
   $.ajax({
      type: "POST",
      url: prURL,
      async: false,
      data: prData,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: prSuccessCallBack,
      error: prErrorCallBack
   });
}

// XML Variants of the AJAX Calls Above

function XMLAJAXCall(prURL, prData, prSuccessCallBack, prErrorCallBack) {
   $.ajax({
      type: "POST",
      url: prURL,
      data: prData,
      contentType: "text/xml; charset=utf-8",
      dataType: "xml",
      success: prSuccessCallBack,
      error: prErrorCallBack
   });
}

function XMLSyncAJAXCall(prURL, prData, prSuccessCallBack, prErrorCallBack) {
   $.ajax({
      type: "POST",
      url: prURL,
      async: false,
      data: prData,
      contentType: "text/xml; charset=utf-8",
      dataType: "xml",
      success: prSuccessCallBack,
      error: prErrorCallBack
   });
}

// PHP AJAX Call

function PHPAJAXCall(prURL, prData, prSuccessCallBack, prErrorCallBack) {
   $.ajax({
      type: "POST",
      url: prURL,
      data: prData,
      contentType: "application/x-www-form-urlencoded; charset=utf-8",
      dataType: "json",
      success: prSuccessCallBack,
      error: prErrorCallBack
   });
}

// This function is used to create a visual pattern of alternating background
// colors for the rows in our our Messages and User List, because our list is
// dynamic, and the rows are moved about, we need to first remove the
// background colours of all of the rows in the element that is passed to it,
// then using the :odd and :even filters of the elements passed to it, we
// set CSS classes on the elements.

function OddNEvenRows(prElement) {
   $(prElement).removeClass('odd');
   $(prElement).removeClass('even');
   $(prElement).filter(':odd').addClass('odd');
   $(prElement).filter(':even').addClass('even');
}

function GeneralServiceError(prXHR, prTextStatus, prError) {
   $('#divServiceErrors').html(prXHR.responseText).reveal();
   
   // Remove .GIF spinner, show graph div at full opacity, and change graph to read connectivity error
   $('#spinner').fadeOut(500);
   $('#jqPlotGraph').stop().fadeTo('slow', 1);
   $('#jqPlotGraph').html('<p style="text-align:center;color:red;padding-top: 190px;">Sorry there may be a connection error</p>');			
}

/*
### jQuery XML to JSON Plugin v1.1 - 2008-07-01 ###
* http://www.fyneworks.com/ - diego@fyneworks.com
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
###
Website: http://www.fyneworks.com/jquery/xml-to-json/
*/
/*
# INSPIRED BY: http://www.terracoder.com/
AND: http://www.thomasfrank.se/xml_to_json.html
AND: http://www.kawa.net/works/js/xml/objtree-e.html
*/
/*
This simple script converts XML (document of code) into a JSON object. It is the combination of 2
'xml to json' great parsers (see below) which allows for both 'simple' and 'extended' parsing modes.
*/
// Avoid collisions
; if (window.jQuery) (function ($) {

   // Add function to jQuery namespace
   $.extend({

      // converts xml documents and xml text to json object
      xml2json: function (xml, extended) {
         if (!xml) return {}; // quick fail

         //### PARSER LIBRARY
         // Core function
         function parseXML(node, simple) {
            if (!node) return null;
            var txt = '', obj = null, att = null;
            var nt = node.nodeType, nn = jsVar(node.localName || node.nodeName);
            var nv = node.text || node.nodeValue || '';
            /*DBG*/ //if(window.console) console.log(['x2j',nn,nt,nv.length+' bytes']);
            if (node.childNodes) {
               if (node.childNodes.length > 0) {
                  /*DBG*/ //if(window.console) console.log(['x2j',nn,'CHILDREN',node.childNodes]);
                  $.each(node.childNodes, function (n, cn) {
                     var cnt = cn.nodeType, cnn = jsVar(cn.localName || cn.nodeName);
                     var cnv = cn.text || cn.nodeValue || '';
                     /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>a',cnn,cnt,cnv]);
                     if (cnt == 8) {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>b',cnn,'COMMENT (ignore)']);
                        return; // ignore comment node
                     }
                     else if (cnt == 3 || cnt == 4 || !cnn) {
                        // ignore white-space in between tags
                        if (cnv.match(/^\s+$/)) {
                           /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>c',cnn,'WHITE-SPACE (ignore)']);
                           return;
                        };
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>d',cnn,'TEXT']);
                        txt += cnv.replace(/^\s+/, '').replace(/\s+$/, '');
                        // make sure we ditch trailing spaces from markup
                     }
                     else {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>e',cnn,'OBJECT']);
                        obj = obj || {};
                        if (obj[cnn]) {
                           /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>f',cnn,'ARRAY']);

                           // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                           if (!obj[cnn].length) obj[cnn] = myArr(obj[cnn]);
                           obj[cnn] = myArr(obj[cnn]);

                           obj[cnn][obj[cnn].length] = parseXML(cn, true/* simple */);
                           obj[cnn].length = obj[cnn].length;
                        }
                        else {
                           /*DBG*/ //if(window.console) console.log(['x2j',nn,'node>g',cnn,'dig deeper...']);
                           obj[cnn] = parseXML(cn);
                        };
                     };
                  });
               }; //node.childNodes.length>0
            }; //node.childNodes
            if (node.attributes) {
               if (node.attributes.length > 0) {
                  /*DBG*/ //if(window.console) console.log(['x2j',nn,'ATTRIBUTES',node.attributes])
                  att = {}; obj = obj || {};
                  $.each(node.attributes, function (a, at) {
                     var atn = jsVar(at.name), atv = at.value;
                     att[atn] = atv;
                     if (obj[atn]) {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'ARRAY']);

                        // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
                        //if(!obj[atn].length) obj[atn] = myArr(obj[atn]);//[ obj[ atn ] ];
                        obj[cnn] = myArr(obj[cnn]);

                        obj[atn][obj[atn].length] = atv;
                        obj[atn].length = obj[atn].length;
                     }
                     else {
                        /*DBG*/ //if(window.console) console.log(['x2j',nn,'attr>',atn,'TEXT']);
                        obj[atn] = atv;
                     };
                  });
                  //obj['attributes'] = att;
               }; //node.attributes.length>0
            }; //node.attributes
            if (obj) {
               obj = $.extend((txt != '' ? new String(txt) : {}), /* {text:txt},*/obj || {}/*, att || {}*/);
               txt = (obj.text) ? (typeof (obj.text) == 'object' ? obj.text : [obj.text || '']).concat([txt]) : txt;
               if (txt) obj.text = txt;
               txt = '';
            };
            var out = obj || txt;
            //console.log([extended, simple, out]);
            if (extended) {
               if (txt) out = {}; //new String(out);
               txt = out.text || txt || '';
               if (txt) out.text = txt;
               if (!simple) out = myArr(out);
            };
            return out;
         }; // parseXML
         // Core Function End
         // Utility functions
         var jsVar = function (s) { return String(s || '').replace(/-/g, "_"); };

         // NEW isNum function: 01/09/2010
         // Thanks to Emile Grau, GigaTecnologies S.L., www.gigatransfer.com, www.mygigamail.com
         function isNum(s) {
            // based on utility function isNum from xml2json plugin (http://www.fyneworks.com/ - diego@fyneworks.com)
            // few bugs corrected from original function :
            // - syntax error : regexp.test(string) instead of string.test(reg)
            // - regexp modified to accept  comma as decimal mark (latin syntax : 25,24 )
            // - regexp modified to reject if no number before decimal mark  : ".7" is not accepted
            // - string is "trimmed", allowing to accept space at the beginning and end of string
            var regexp = /^((-)?([0-9]+)(([\.\,]{0,1})([0-9]+))?$)/
            return (typeof s == "number") || regexp.test(String((s && typeof s == "string") ? jQuery.trim(s) : ''));
         };
         // OLD isNum function: (for reference only)
         //var isNum = function(s){ return (typeof s == "number") || String((s && typeof s == "string") ? s : '').test(/^((-)?([0-9]*)((\.{0,1})([0-9]+))?$)/); };

         var myArr = function (o) {

            // http://forum.jquery.com/topic/jquery-jquery-xml2json-problems-when-siblings-of-the-same-tagname-only-have-a-textnode-as-a-child
            //if(!o.length) o = [ o ]; o.length=o.length;
            if (!$.isArray(o)) o = [o]; o.length = o.length;

            // here is where you can attach additional functionality, such as searching and sorting...
            return o;
         };
         // Utility functions End
         //### PARSER LIBRARY END

         // Convert plain text to xml
         if (typeof xml == 'string') xml = $.text2xml(xml);

         // Quick fail if not xml (or if this is a node)
         if (!xml.nodeType) return;
         if (xml.nodeType == 3 || xml.nodeType == 4) return xml.nodeValue;

         // Find xml root node
         var root = (xml.nodeType == 9) ? xml.documentElement : xml;

         // Convert xml to json
         var out = parseXML(root, true /* simple */);

         // Clean-up memory
         xml = null; root = null;

         // Send output
         return out;
      },

      // Convert text to XML DOM
      text2xml: function (str) {
         // NOTE: I'd like to use jQuery for this, but jQuery makes all tags uppercase
         //return $(xml)[0];
         var out;
         try {
            var xml = ($.browser.msie) ? new ActiveXObject("Microsoft.XMLDOM") : new DOMParser();
            xml.async = false;
         } catch (e) { throw new Error("XML Parser could not be instantiated") };
         try {
            if ($.browser.msie) out = (xml.loadXML(str)) ? xml : false;
            else out = xml.parseFromString(str, "text/xml");
         } catch (e) { throw new Error("Error parsing XML string") };
         return out;
      }

   }); // extend $

})(jQuery);

/*
* jQuery Reveal Plugin 1.0
* www.ZURB.com
* Copyright 2010, ZURB
* Free to use under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
*/


(function ($) {

   /*---------------------------
   Defaults for Reveal
   ----------------------------*/

   /*---------------------------
   Listener for data-reveal-id attributes
   ----------------------------*/

   $('a[data-reveal-id]').live('click', function (e) {
      e.preventDefault();
      var modalLocation = $(this).attr('data-reveal-id');
      $('#' + modalLocation).reveal($(this).data());
   });

   /*---------------------------
   Extend and Execute
   ----------------------------*/

   $.fn.reveal = function (options) {


      var defaults = {
         animation: 'fadeAndPop', //fade, fadeAndPop, none
         animationspeed: 300, //how fast animtions are
         closeonbackgroundclick: true, //if you click background will modal close?
         dismissmodalclass: 'close-reveal-modal' //the class of a button or element that will close an open modal
      };

      //Extend dem' options
      var options = $.extend({}, defaults, options);

      return this.each(function () {

         /*---------------------------
         Global Variables
         ----------------------------*/
         var modal = $(this),
        		topMeasure = parseInt(modal.css('top')),
				topOffset = modal.height() + topMeasure,
          		locked = false,
				modalBG = $('.reveal-modal-bg');

         /*---------------------------
         Create Modal BG
         ----------------------------*/
         if (modalBG.length == 0) {
            modalBG = $('<div class="reveal-modal-bg" />').insertAfter(modal);
         }

         /*---------------------------
         Open & Close Animations
         ----------------------------*/
         //Entrance Animations
         modal.bind('reveal:open', function () {
            modalBG.unbind('click.modalEvent');
            $('.' + options.dismissmodalclass).unbind('click.modalEvent');
            if (!locked) {
               lockModal();
               if (options.animation == "fadeAndPop") {
                  modal.css({ 'top': $(document).scrollTop() - topOffset, 'opacity': 0, 'visibility': 'visible' });
                  modalBG.fadeIn(options.animationspeed / 2);
                  modal.delay(options.animationspeed / 2).animate({
                     "top": $(document).scrollTop() + topMeasure + 'px',
                     "opacity": 1
                  }, options.animationspeed, unlockModal());
               }
               if (options.animation == "fade") {
                  modal.css({ 'opacity': 0, 'visibility': 'visible', 'top': $(document).scrollTop() + topMeasure });
                  modalBG.fadeIn(options.animationspeed / 2);
                  modal.delay(options.animationspeed / 2).animate({
                     "opacity": 1
                  }, options.animationspeed, unlockModal());
               }
               if (options.animation == "none") {
                  modal.css({ 'visibility': 'visible', 'top': $(document).scrollTop() + topMeasure });
                  modalBG.css({ "display": "block" });
                  unlockModal()
               }
            }
            modal.unbind('reveal:open');
         });

         //Closing Animation
         modal.bind('reveal:close', function () {
            if (!locked) {
               lockModal();
               if (options.animation == "fadeAndPop") {
                  modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
                  modal.animate({
                     "top": $(document).scrollTop() - topOffset + 'px',
                     "opacity": 0
                  }, options.animationspeed / 2, function () {
                     modal.css({ 'top': topMeasure, 'opacity': 1, 'visibility': 'hidden' });
                     unlockModal();
                  });
               }
               if (options.animation == "fade") {
                  modalBG.delay(options.animationspeed).fadeOut(options.animationspeed);
                  modal.animate({
                     "opacity": 0
                  }, options.animationspeed, function () {
                     modal.css({ 'opacity': 1, 'visibility': 'hidden', 'top': topMeasure });
                     unlockModal();
                  });
               }
               if (options.animation == "none") {
                  modal.css({ 'visibility': 'hidden', 'top': topMeasure });
                  modalBG.css({ 'display': 'none' });
               }
            }
            modal.unbind('reveal:close');
         });

         /*---------------------------
         Open and add Closing Listeners
         ----------------------------*/
         //Open Modal Immediately
         modal.trigger('reveal:open')

         //Close Modal Listeners
         var closeButton = $('.' + options.dismissmodalclass).bind('click.modalEvent', function () {
            modal.trigger('reveal:close')
         });

         if (options.closeonbackgroundclick) {
            modalBG.css({ "cursor": "pointer" })
            modalBG.bind('click.modalEvent', function () {
               modal.trigger('reveal:close')
            });
         }
         $('body').keyup(function (e) {
            if (e.which === 27) { modal.trigger('reveal:close'); } // 27 is the keycode for the Escape key
         });


         /*---------------------------
         Animations Locks
         ----------------------------*/
         function unlockModal() {
            locked = false;
         }
         function lockModal() {
            locked = true;
         }

      }); //each call
   } //orbit plugin call
})(jQuery);

/**
 * Timeago is a jQuery plugin that makes it easy to support automatically
 * updating fuzzy timestamps (e.g. "4 minutes ago" or "about 1 day ago").
 *
 * @name timeago
 * @version 0.11.4
 * @requires jQuery v1.2.3+
 * @author Ryan McGeary
 * @license MIT License - http://www.opensource.org/licenses/mit-license.php
 *
 * For usage and examples, visit:
 * http://timeago.yarp.com/
 *
 * Copyright (c) 2008-2012, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */
(function($) {
  $.timeago = function(timestamp) {
    if (timestamp instanceof Date) {
      return inWords(timestamp);
    } else if (typeof timestamp === "string") {
      return inWords($.timeago.parse(timestamp));
    } else if (typeof timestamp === "number") {
      return inWords(new Date(timestamp));
    } else {
      return inWords($.timeago.datetime(timestamp));
    }
  };
  var $t = $.timeago;

  $.extend($.timeago, {
    settings: {
      refreshMillis: 60000,
      allowFuture: false,
      strings: {
        prefixAgo: null,
        prefixFromNow: null,
        suffixAgo: "ago",
        suffixFromNow: "from now",
        seconds: "less than a minute",
        minute: "about a minute",
        minutes: "%d minutes",
        hour: "about an hour",
        hours: "about %d hours",
        day: "a day",
        days: "%d days",
        month: "about a month",
        months: "%d months",
        year: "about a year",
        years: "%d years",
        wordSeparator: " ",
        numbers: []
      }
    },
    inWords: function(distanceMillis) {
      var $l = this.settings.strings;
      var prefix = $l.prefixAgo;
      var suffix = $l.suffixAgo;
      if (this.settings.allowFuture) {
        if (distanceMillis < 0) {
          prefix = $l.prefixFromNow;
          suffix = $l.suffixFromNow;
        }
      }

      var seconds = Math.abs(distanceMillis) / 1000;
      var minutes = seconds / 60;
      var hours = minutes / 60;
      var days = hours / 24;
      var years = days / 365;

      function substitute(stringOrFunction, number) {
        var string = $.isFunction(stringOrFunction) ? stringOrFunction(number, distanceMillis) : stringOrFunction;
        var value = ($l.numbers && $l.numbers[number]) || number;
        return string.replace(/%d/i, value);
      }

      var words = seconds < 45 && substitute($l.seconds, Math.round(seconds)) ||
        seconds < 90 && substitute($l.minute, 1) ||
        minutes < 45 && substitute($l.minutes, Math.round(minutes)) ||
        minutes < 90 && substitute($l.hour, 1) ||
        hours < 24 && substitute($l.hours, Math.round(hours)) ||
        hours < 42 && substitute($l.day, 1) ||
        days < 30 && substitute($l.days, Math.round(days)) ||
        days < 45 && substitute($l.month, 1) ||
        days < 365 && substitute($l.months, Math.round(days / 30)) ||
        years < 1.5 && substitute($l.year, 1) ||
        substitute($l.years, Math.round(years));

      var separator = $l.wordSeparator === undefined ?  " " : $l.wordSeparator;
      return $.trim([prefix, words, suffix].join(separator));
    },
    parse: function(iso8601) {
      var s = $.trim(iso8601);
      s = s.replace(/\.\d+/,""); // remove milliseconds
      s = s.replace(/-/,"/").replace(/-/,"/");
      s = s.replace(/T/," ").replace(/Z/," UTC");
      s = s.replace(/([\+\-]\d\d)\:?(\d\d)/," $1$2"); // -04:00 -> -0400
      return new Date(s);
    },
    datetime: function(elem) {
      var iso8601 = $t.isTime(elem) ? $(elem).attr("datetime") : $(elem).attr("title");
      return $t.parse(iso8601);
    },
    isTime: function(elem) {
      // jQuery's `is()` doesn't play well with HTML5 in IE
      return $(elem).get(0).tagName.toLowerCase() === "time"; // $(elem).is("time");
    }
  });

  $.fn.timeago = function() {
    var self = this;
    self.each(refresh);

    var $s = $t.settings;
    if ($s.refreshMillis > 0) {
      setInterval(function() { self.each(refresh); }, $s.refreshMillis);
    }
    return self;
  };

  function refresh() {
    var data = prepareData(this);
    if (!isNaN(data.datetime)) {
      $(this).text(inWords(data.datetime));
    }
    return this;
  }

  function prepareData(element) {
    element = $(element);
    if (!element.data("timeago")) {
      element.data("timeago", { datetime: $t.datetime(element) });
      var text = $.trim(element.text());
      if (text.length > 0 && !($t.isTime(element) && element.attr("title"))) {
        element.attr("title", text);
      }
    }
    return element.data("timeago");
  }

  function inWords(date) {
    return $t.inWords(distance(date));
  }

  function distance(date) {
    return (new Date().getTime() - date.getTime());
  }

  // fix for IE6 suckage
  document.createElement("abbr");
  document.createElement("time");
} (jQuery));

function sortObjectsByKey(objects, key){
    objects.sort(function() {
        return function(a, b){
            var objectIDA = a[key];
            var objectIDB = b[key];
            if (objectIDA === objectIDB) {
                return 0;
            }
            return objectIDA > objectIDB ? 1 : -1;        
        };
    }());
}

function CleanStringForJSON (str) {
   return str
    .replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\\"')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t');
};

function HTMLEncode(prString) {
   if (prString != null && prString != "")
      return $('<div/>').text(prString).html().replace(/\n/g, "<br/>");
   else
      return prString;
}

/*!
 * jquery.scrollto.js 0.0.1 - https://github.com/yckart/jquery.scrollto.js
 * Scroll smooth to any element in your DOM.
 *
 * Copyright (c) 2012 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/02/17
 **/
/**
 * Copyright (c) 2007-2012 Ariel Flesler - aflesler(at)gmail(dot)com | http://flesler.blogspot.com
 * Dual licensed under MIT and GPL.
 * @author Ariel Flesler
 * @version 1.4.3.1
 */
; (function ($) { var h = $.scrollTo = function (a, b, c) { $(window).scrollTo(a, b, c) }; h.defaults = { axis: 'xy', duration: parseFloat($.fn.jquery) >= 1.3 ? 0 : 1, limit: true }; h.window = function (a) { return $(window)._scrollable() }; $.fn._scrollable = function () { return this.map(function () { var a = this, isWin = !a.nodeName || $.inArray(a.nodeName.toLowerCase(), ['iframe', '#document', 'html', 'body']) != -1; if (!isWin) return a; var b = (a.contentWindow || a).document || a.ownerDocument || a; return /webkit/i.test(navigator.userAgent) || b.compatMode == 'BackCompat' ? b.body : b.documentElement }) }; $.fn.scrollTo = function (e, f, g) { if (typeof f == 'object') { g = f; f = 0 } if (typeof g == 'function') g = { onAfter: g }; if (e == 'max') e = 9e9; g = $.extend({}, h.defaults, g); f = f || g.duration; g.queue = g.queue && g.axis.length > 1; if (g.queue) f /= 2; g.offset = both(g.offset); g.over = both(g.over); return this._scrollable().each(function () { if (e == null) return; var d = this, $elem = $(d), targ = e, toff, attr = {}, win = $elem.is('html,body'); switch (typeof targ) { case 'number': case 'string': if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(targ)) { targ = both(targ); break } targ = $(targ, this); if (!targ.length) return; case 'object': if (targ.is || targ.style) toff = (targ = $(targ)).offset() } $.each(g.axis.split(''), function (i, a) { var b = a == 'x' ? 'Left' : 'Top', pos = b.toLowerCase(), key = 'scroll' + b, old = d[key], max = h.max(d, a); if (toff) { attr[key] = toff[pos] + (win ? 0 : old - $elem.offset()[pos]); if (g.margin) { attr[key] -= parseInt(targ.css('margin' + b)) || 0; attr[key] -= parseInt(targ.css('border' + b + 'Width')) || 0 } attr[key] += g.offset[pos] || 0; if (g.over[pos]) attr[key] += targ[a == 'x' ? 'width' : 'height']() * g.over[pos] } else { var c = targ[pos]; attr[key] = c.slice && c.slice(-1) == '%' ? parseFloat(c) / 100 * max : c } if (g.limit && /^\d+$/.test(attr[key])) attr[key] = attr[key] <= 0 ? 0 : Math.min(attr[key], max); if (!i && g.queue) { if (old != attr[key]) animate(g.onAfterFirst); delete attr[key] } }); animate(g.onAfter); function animate(a) { $elem.animate(attr, f, g.easing, a && function () { a.call(this, e, g) }) } }).end() }; h.max = function (a, b) { var c = b == 'x' ? 'Width' : 'Height', scroll = 'scroll' + c; if (!$(a).is('html,body')) return a[scroll] - $(a)[c.toLowerCase()](); var d = 'client' + c, html = a.ownerDocument.documentElement, body = a.ownerDocument.body; return Math.max(html[scroll], body[scroll]) - Math.min(html[d], body[d]) }; function both(a) { return typeof a == 'object' ? a : { top: a, left: a } } })(jQuery);


// Get cookies for lat, long and zoom level.
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

// Set cookies for lat, long and zoom level.
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";";
}

// Delete cookies for lat, long and zoom level.
function deleteCookie(cname) {
    document.cookie = cname + "=;";

}

// Check if cookies are enabled.
function are_cookies_enabled() {
    var cookieEnabled = (navigator.cookieEnabled) ? true : false;
    return (cookieEnabled);
}

//Copy text to clipboard - used for popup table
 function selectElementContents(el) {
        var body = document.body, range, sel;
        if (document.createRange && window.getSelection) {
            range = document.createRange();
            sel = window.getSelection();
            sel.removeAllRanges();
            try {
                range.selectNodeContents(el);
                sel.addRange(range);
            } catch (e) {
                range.selectNode(el);
                sel.addRange(range);
            }
        } else if (body.createTextRange) {
            range = body.createTextRange();
            range.moveToElementText(el);
            range.select();
        }
    }
