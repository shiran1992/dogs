/**
 * git do not control webim.config.js
 * everyone should copy webim.config.js.demo to webim.config.js
 * and have their own configs.
 * In this way , others won't be influenced by this config while git pull.
 *
 */

// for react native
// var location = {
//     protocol: "https"
// }

function getUrl(){
    var apiUrl = (window.location.protocol === "https:" ? "https:" : "http:") + "//a1.easemob.com"
    var xmppUrl = "im-api.easemob.com"
    if(window.location.href.indexOf("webim-h5.easemob.com") !== -1 || window.location.href.indexOf("localhost") !== -1 || window.location.href.indexOf("172.17.2.168") !== -1){
        apiUrl = (window.location.protocol === "https:" ? "https:" : "http:") + "//a1.easemob.com"
        xmppUrl = "im-api.easemob.com"
    }
    // else if(window.location.href.indexOf("webim-hsb.easemob.com") !== -1){
    //     apiUrl = (window.location.protocol === "https:" ? "https:" : "http:") + "//a1-hsb.easemob.com"
    //     xmppUrl = "im-api-hsb.easemob.com"
    // }
    return {
        apiUrl: apiUrl,
        xmppUrl: xmppUrl
    }
}


var WebImConfig = {
    /*
     * XMPP server
     */
    xmppURL: getUrl().xmppUrl,
    // xmppURL: "im-api.easemob.com",
    // xmppURL: '172.17.2.139:5280',
    /*
     * Backend REST API URL
     */
    // apiURL: (location.protocol === 'https:' ? 'https:' : 'http:') + '//a1.easemob.com',
    // ios must be https!!! by lwz
    // apiURL: "https://a1.easemob.com",
    apiURL: getUrl().apiUrl,
    // apiURL: (location.protocol === 'https:' ? 'https:' : 'http:') + '//172.17.3.155:8080',
    /*
     * Application AppKey
     */
    appkey: "1124170414178104#lecai4test",
    /*
     * Application Host
     */
    Host: "easemob.com",
    /*
     * Whether to use HTTPS
     * @parameter {Boolean} true or false
     */
    https: true,
    isHttpDNS: false,
    /*
     * isMultiLoginSessions
     * true: A visitor can sign in to multiple webpages and receive messages at all the webpages.
     * false: A visitor can sign in to only one webpage and receive messages at the webpage.
     */
    isMultiLoginSessions: true,
    /**
     * Whether to use window.doQuery()
     * @parameter {Boolean} true or false
     */
    isWindowSDK: false,
    /**
     * isSandBox=true:  xmppURL: 'im-api.sandbox.easemob.com',  apiURL: '//a1.sdb.easemob.com',
     * isSandBox=false: xmppURL: 'im-api.easemob.com',          apiURL: '//a1.easemob.com',
     * @parameter {Boolean} true or false
     */
    isSandBox: false,
    /**
     * Whether to console.log in strophe.log()
     * @parameter {Boolean} true or false
     */
    isDebug: true,
    /**
     * Whether to show logs in strophe
     * @parameter {Boolean} true or false
     */
    isStropheLog: true,
    /**
     * will auto connect the xmpp server autoReconnectNumMax times in background when client is offline.
     * won't auto connect if autoReconnectNumMax=0.
     */
    autoReconnectNumMax: 20,
    /**
     * the interval secons between each atuo reconnectting.
     * works only if autoReconnectMaxNum >= 2.
     */
    autoReconnectInterval: 5,
    /**
     * webrtc supports WebKit and https only
     */
    isWebRTC: window.RTCPeerConnection && /^https\:$/.test(window.location.protocol),
    /**
     *  cn: chinese
     *  us: english
     */
    i18n: "cn",
    /*
     * Set to auto sign-in
     */
    isAutoLogin: true,
    /**
     * Size of message cache for person to person
     */
    p2pMessageCacheSize: 500,
    /**
     * When a message arrived, the receiver send an ack message to the
     * sender, in order to tell the sender the message has delivered.
     * See call back function onReceivedMessage
     */
    delivery: true,
    /**
     * Size of message cache for group chating like group, chatroom etc
     */
    groupMessageCacheSize: 200,
    /**
     * 5 actual logging methods, ordered and available:
     * 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR'
     */

    loglevel: "ERROR",

    /**
     * enable localstorage for history messages
     */
    enableLocalStorage: true
};

// export default config

/** File: strophe.js
 *  A JavaScript library for XMPP BOSH/XMPP over Websocket.
 *
 *  This is the JavaScript version of the Strophe library.  Since JavaScript
 *  had no facilities for persistent TCP connections, this library uses
 *  Bidirectional-streams Over Synchronous HTTP (BOSH) to emulate
 *  a persistent, stateful, two-way connection to an XMPP server.  More
 *  information on BOSH can be found in XEP 124.
 *
 *  This version of Strophe also works with WebSockets.
 *  For more information on XMPP-over WebSocket see this RFC:
 *  http://tools.ietf.org/html/rfc7395
 */

/* All of the Strophe globals are defined in this special function below so
 * that references to the globals become closures.  This will ensure that
 * on page reload, these references will still be available to callbacks
 * that are still executing.
 */

/* jshint ignore:start */
(function (callback) {
    /* jshint ignore:end */

// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define('strophe-base64', function () {
                return factory();
            });
        } else {
            // Browser globals
            root.Base64 = factory();
        }
    }(this, function () {
        var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

        var obj = {
            /**
             * Encodes a string in base64
             * @param {String} input The string to encode in base64.
             */
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc2 = ((chr1 & 3) << 4);
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) + keyStr.charAt(enc4);
                } while (i < input.length);

                return output;
            },

            /**
             * Decodes a base64 string.
             * @param {String} input The string to decode.
             */
            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3;
                var enc1, enc2, enc3, enc4;
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                } while (i < input.length);

                return output;
            }
        };
        return obj;
    }));

    /*
     * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
     * in FIPS PUB 180-1
     * Version 2.1a Copyright Paul Johnston 2000 - 2002.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for details.
     */

    /* jshint undef: true, unused: true:, noarg: true, latedef: true */
    /* global define */

    /* Some functions and variables have been stripped for use with Strophe */

    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define('strophe-sha1', function () {
                return factory();
            });
        } else {
            // Browser globals
            root.SHA1 = factory();
        }
    }(this, function () {

        /*
         * Calculate the SHA-1 of an array of big-endian words, and a bit length
         */
        function core_sha1(x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << (24 - len % 32);
            x[((len + 64 >> 9) << 4) + 15] = len;

            var w = new Array(80);
            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;
            var e = -1009589776;

            var i, j, t, olda, oldb, oldc, oldd, olde;
            for (i = 0; i < x.length; i += 16) {
                olda = a;
                oldb = b;
                oldc = c;
                oldd = d;
                olde = e;

                for (j = 0; j < 80; j++) {
                    if (j < 16) {
                        w[j] = x[i + j];
                    }
                    else {
                        w[j] = rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
                    }
                    t = safe_add(safe_add(rol(a, 5), sha1_ft(j, b, c, d)),
                        safe_add(safe_add(e, w[j]), sha1_kt(j)));
                    e = d;
                    d = c;
                    c = rol(b, 30);
                    b = a;
                    a = t;
                }

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
                e = safe_add(e, olde);
            }
            return [a, b, c, d, e];
        }

        /*
         * Perform the appropriate triplet combination function for the current
         * iteration
         */
        function sha1_ft(t, b, c, d) {
            if (t < 20) {
                return (b & c) | ((~b) & d);
            }
            if (t < 40) {
                return b ^ c ^ d;
            }
            if (t < 60) {
                return (b & c) | (b & d) | (c & d);
            }
            return b ^ c ^ d;
        }

        /*
         * Determine the appropriate additive constant for the current iteration
         */
        function sha1_kt(t) {
            return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 :
                (t < 60) ? -1894007588 : -899497514;
        }

        /*
         * Calculate the HMAC-SHA1 of a key and some data
         */
        function core_hmac_sha1(key, data) {
            var bkey = str2binb(key);
            if (bkey.length > 16) {
                bkey = core_sha1(bkey, key.length * 8);
            }

            var ipad = new Array(16), opad = new Array(16);
            for (var i = 0; i < 16; i++) {
                ipad[i] = bkey[i] ^ 0x36363636;
                opad[i] = bkey[i] ^ 0x5C5C5C5C;
            }

            var hash = core_sha1(ipad.concat(str2binb(data)), 512 + data.length * 8);
            return core_sha1(opad.concat(hash), 512 + 160);
        }

        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        function safe_add(x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        }

        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        function rol(num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        }

        /*
         * Convert an 8-bit or 16-bit string to an array of big-endian words
         * In 8-bit function, characters >255 have their hi-byte silently ignored.
         */
        function str2binb(str) {
            var bin = [];
            var mask = 255;
            for (var i = 0; i < str.length * 8; i += 8) {
                bin[i >> 5] |= (str.charCodeAt(i / 8) & mask) << (24 - i % 32);
            }
            return bin;
        }

        /*
         * Convert an array of big-endian words to a string
         */
        function binb2str(bin) {
            var str = "";
            var mask = 255;
            for (var i = 0; i < bin.length * 32; i += 8) {
                str += String.fromCharCode((bin[i >> 5] >>> (24 - i % 32)) & mask);
            }
            return str;
        }

        /*
         * Convert an array of big-endian words to a base-64 string
         */
        function binb2b64(binarray) {
            var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var str = "";
            var triplet, j;
            for (var i = 0; i < binarray.length * 4; i += 3) {
                triplet = (((binarray[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) |
                    (((binarray[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8 ) |
                    ((binarray[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF);
                for (j = 0; j < 4; j++) {
                    if (i * 8 + j * 6 > binarray.length * 32) {
                        str += "=";
                    }
                    else {
                        str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
                    }
                }
            }
            return str;
        }

        /*
         * These are the functions you'll usually want to call
         * They take string arguments and return either hex or base-64 encoded strings
         */
        return {
            b64_hmac_sha1: function (key, data) {
                return binb2b64(core_hmac_sha1(key, data));
            },
            b64_sha1: function (s) {
                return binb2b64(core_sha1(str2binb(s), s.length * 8));
            },
            binb2str: binb2str,
            core_hmac_sha1: core_hmac_sha1,
            str_hmac_sha1: function (key, data) {
                return binb2str(core_hmac_sha1(key, data));
            },
            str_sha1: function (s) {
                return binb2str(core_sha1(str2binb(s), s.length * 8));
            },
        };
    }));

    /*
     * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
     * Digest Algorithm, as defined in RFC 1321.
     * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
     * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
     * Distributed under the BSD License
     * See http://pajhome.org.uk/crypt/md5 for more info.
     */

    /*
     * Everything that isn't used by Strophe has been stripped here!
     */

    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define('strophe-md5', function () {
                return factory();
            });
        } else {
            // Browser globals
            root.MD5 = factory();
        }
    }(this, function (b) {
        /*
         * Add integers, wrapping at 2^32. This uses 16-bit operations internally
         * to work around bugs in some JS interpreters.
         */
        var safe_add = function (x, y) {
            var lsw = (x & 0xFFFF) + (y & 0xFFFF);
            var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
            return (msw << 16) | (lsw & 0xFFFF);
        };

        /*
         * Bitwise rotate a 32-bit number to the left.
         */
        var bit_rol = function (num, cnt) {
            return (num << cnt) | (num >>> (32 - cnt));
        };

        /*
         * Convert a string to an array of little-endian words
         */
        var str2binl = function (str) {
            var bin = [];
            for (var i = 0; i < str.length * 8; i += 8) {
                bin[i >> 5] |= (str.charCodeAt(i / 8) & 255) << (i % 32);
            }
            return bin;
        };

        /*
         * Convert an array of little-endian words to a string
         */
        var binl2str = function (bin) {
            var str = "";
            for (var i = 0; i < bin.length * 32; i += 8) {
                str += String.fromCharCode((bin[i >> 5] >>> (i % 32)) & 255);
            }
            return str;
        };

        /*
         * Convert an array of little-endian words to a hex string.
         */
        var binl2hex = function (binarray) {
            var hex_tab = "0123456789abcdef";
            var str = "";
            for (var i = 0; i < binarray.length * 4; i++) {
                str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) +
                    hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8  )) & 0xF);
            }
            return str;
        };

        /*
         * These functions implement the four basic operations the algorithm uses.
         */
        var md5_cmn = function (q, a, b, x, s, t) {
            return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b);
        };

        var md5_ff = function (a, b, c, d, x, s, t) {
            return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
        };

        var md5_gg = function (a, b, c, d, x, s, t) {
            return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
        };

        var md5_hh = function (a, b, c, d, x, s, t) {
            return md5_cmn(b ^ c ^ d, a, b, x, s, t);
        };

        var md5_ii = function (a, b, c, d, x, s, t) {
            return md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
        };

        /*
         * Calculate the MD5 of an array of little-endian words, and a bit length
         */
        var core_md5 = function (x, len) {
            /* append padding */
            x[len >> 5] |= 0x80 << ((len) % 32);
            x[(((len + 64) >>> 9) << 4) + 14] = len;

            var a = 1732584193;
            var b = -271733879;
            var c = -1732584194;
            var d = 271733878;

            var olda, oldb, oldc, oldd;
            for (var i = 0; i < x.length; i += 16) {
                olda = a;
                oldb = b;
                oldc = c;
                oldd = d;

                a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
                d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
                c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
                b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
                a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
                d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
                c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
                b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
                a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
                d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
                c = md5_ff(c, d, a, b, x[i + 10], 17, -42063);
                b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
                a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
                d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
                c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
                b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

                a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
                d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
                c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
                b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
                a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
                d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
                c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
                b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
                a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
                d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
                c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
                b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
                a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
                d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
                c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
                b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

                a = md5_hh(a, b, c, d, x[i + 5], 4, -378558);
                d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
                c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
                b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
                a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
                d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
                c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
                b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
                a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
                d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
                c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
                b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
                a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
                d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
                c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
                b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

                a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
                d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
                c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
                b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
                a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
                d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
                c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
                b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
                a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
                d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
                c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
                b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
                a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
                d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
                c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
                b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

                a = safe_add(a, olda);
                b = safe_add(b, oldb);
                c = safe_add(c, oldc);
                d = safe_add(d, oldd);
            }
            return [a, b, c, d];
        };

        var obj = {
            /*
             * These are the functions you'll usually want to call.
             * They take string arguments and return either hex or base-64 encoded
             * strings.
             */
            hexdigest: function (s) {
                return binl2hex(core_md5(str2binl(s), s.length * 8));
            },

            hash: function (s) {
                return binl2str(core_md5(str2binl(s), s.length * 8));
            }
        };
        return obj;
    }));

    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define('strophe-utils', function () {
                return factory();
            });
        } else {
            // Browser globals
            root.stropheUtils = factory();
        }
    }(this, function () {

        var utils = {

            utf16to8: function (str) {
                var i, c;
                var out = "";
                var len = str.length;
                for (i = 0; i < len; i++) {
                    c = str.charCodeAt(i);
                    if ((c >= 0x0000) && (c <= 0x007F)) {
                        out += str.charAt(i);
                    } else if (c > 0x07FF) {
                        out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
                        out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
                        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                    } else {
                        out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
                        out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
                    }
                }
                return out;
            },

            addCookies: function (cookies) {
                /* Parameters:
                 *  (Object) cookies - either a map of cookie names
                 *    to string values or to maps of cookie values.
                 *
                 * For example:
                 * { "myCookie": "1234" }
                 *
                 * or:
                 * { "myCookie": {
                 *      "value": "1234",
                 *      "domain": ".example.org",
                 *      "path": "/",
                 *      "expires": expirationDate
                 *      }
                 *  }
                 *
                 *  These values get passed to Strophe.Connection via
                 *   options.cookies
                 */
                var cookieName, cookieObj, isObj, cookieValue, expires, domain, path;
                for (cookieName in (cookies || {})) {
                    expires = '';
                    domain = '';
                    path = '';
                    cookieObj = cookies[cookieName];
                    isObj = typeof cookieObj == "object";
                    cookieValue = escape(unescape(isObj ? cookieObj.value : cookieObj));
                    if (isObj) {
                        expires = cookieObj.expires ? ";expires=" + cookieObj.expires : '';
                        domain = cookieObj.domain ? ";domain=" + cookieObj.domain : '';
                        path = cookieObj.path ? ";path=" + cookieObj.path : '';
                    }
                    document.cookie =
                        cookieName + '=' + cookieValue + expires + domain + path;
                }
            }
        };
        return utils;
    }));

    /*
     This program is distributed under the terms of the MIT license.
     Please see the LICENSE file for details.

     Copyright 2006-2008, OGG, LLC
     */

    /* jshint undef: true, unused: true:, noarg: true, latedef: true */
    /* global define */

    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define('strophe-polyfill', [], function () {
                return factory();
            });
        } else {
            // Browser globals
            return factory();
        }
    }(this, function () {

        /** PrivateFunction: Function.prototype.bind
         *  Bind a function to an instance.
         *
         *  This Function object extension method creates a bound method similar
         *  to those in Python.  This means that the 'this' object will point
         *  to the instance you want.  See
         *  <a href='https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind'>MDC's bind() documentation</a> and
         *  <a href='http://benjamin.smedbergs.us/blog/2007-01-03/bound-functions-and-function-imports-in-javascript/'>Bound Functions and Function Imports in JavaScript</a>
         *  for a complete explanation.
         *
         *  This extension already exists in some browsers (namely, Firefox 3), but
         *  we provide it to support those that don't.
         *
         *  Parameters:
         *    (Object) obj - The object that will become 'this' in the bound function.
         *    (Object) argN - An option argument that will be prepended to the
         *      arguments given for the function call
         *
         *  Returns:
         *    The bound function.
         */
        if (!Function.prototype.bind) {
            Function.prototype.bind = function (obj /*, arg1, arg2, ... */) {
                var func = this;
                var _slice = Array.prototype.slice;
                var _concat = Array.prototype.concat;
                var _args = _slice.call(arguments, 1);

                return function () {
                    return func.apply(obj ? obj : this,
                        _concat.call(_args,
                            _slice.call(arguments, 0)));
                };
            };
        }

        /** PrivateFunction: Array.isArray
         *  This is a polyfill for the ES5 Array.isArray method.
         */
        if (!Array.isArray) {
            Array.isArray = function (arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }

        /** PrivateFunction: Array.prototype.indexOf
         *  Return the index of an object in an array.
         *
         *  This function is not supplied by some JavaScript implementations, so
         *  we provide it if it is missing.  This code is from:
         *  http://developer.mozilla.org/En/Core_JavaScript_1.5_Reference:Objects:Array:indexOf
         *
         *  Parameters:
         *    (Object) elt - The object to look for.
         *    (Integer) from - The index from which to start looking. (optional).
         *
         *  Returns:
         *    The index of elt in the array or -1 if not found.
         */
        if (!Array.prototype.indexOf) {
            Array.prototype.indexOf = function (elt /*, from*/) {
                var len = this.length;

                var from = Number(arguments[1]) || 0;
                from = (from < 0) ? Math.ceil(from) : Math.floor(from);
                if (from < 0) {
                    from += len;
                }

                for (; from < len; from++) {
                    if (from in this && this[from] === elt) {
                        return from;
                    }
                }

                return -1;
            };
        }
    }));

    /*
     This program is distributed under the terms of the MIT license.
     Please see the LICENSE file for details.

     Copyright 2006-2008, OGG, LLC
     */

    /* jshint undef: true, unused: true:, noarg: true, latedef: true */
    /*global define, document, window, setTimeout, clearTimeout, console, ActiveXObject, DOMParser */

    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define('strophe-core', [
                'strophe-sha1',
                'strophe-base64',
                'strophe-md5',
                'strophe-utils',
                "strophe-polyfill"
            ], function () {
                return factory.apply(this, arguments);
            });
        } else {
            // Browser globals
            var o = factory(root.SHA1, root.Base64, root.MD5, root.stropheUtils);
            window.Strophe = o.Strophe;
            window.$build = o.$build;
            window.$iq = o.$iq;
            window.$msg = o.$msg;
            window.$pres = o.$pres;
            window.SHA1 = o.SHA1;
            window.Base64 = o.Base64;
            window.MD5 = o.MD5;
            window.b64_hmac_sha1 = o.SHA1.b64_hmac_sha1;
            window.b64_sha1 = o.SHA1.b64_sha1;
            window.str_hmac_sha1 = o.SHA1.str_hmac_sha1;
            window.str_sha1 = o.SHA1.str_sha1;
        }
    }(this, function (SHA1, Base64, MD5, utils) {

        var Strophe;

        /** Function: $build
         *  Create a Strophe.Builder.
         *  This is an alias for 'new Strophe.Builder(name, attrs)'.
         *
         *  Parameters:
         *    (String) name - The root element name.
         *    (Object) attrs - The attributes for the root element in object notation.
         *
         *  Returns:
         *    A new Strophe.Builder object.
         */
        function $build(name, attrs) {
            return new Strophe.Builder(name, attrs);
        }

        /** Function: $msg
         *  Create a Strophe.Builder with a <message/> element as the root.
         *
         *  Parameters:
         *    (Object) attrs - The <message/> element attributes in object notation.
         *
         *  Returns:
         *    A new Strophe.Builder object.
         */
        function $msg(attrs) {
            return new Strophe.Builder("message", attrs);
        }

        /** Function: $iq
         *  Create a Strophe.Builder with an <iq/> element as the root.
         *
         *  Parameters:
         *    (Object) attrs - The <iq/> element attributes in object notation.
         *
         *  Returns:
         *    A new Strophe.Builder object.
         */
        function $iq(attrs) {
            return new Strophe.Builder("iq", attrs);
        }

        /** Function: $pres
         *  Create a Strophe.Builder with a <presence/> element as the root.
         *
         *  Parameters:
         *    (Object) attrs - The <presence/> element attributes in object notation.
         *
         *  Returns:
         *    A new Strophe.Builder object.
         */
        function $pres(attrs) {
            return new Strophe.Builder("presence", attrs);
        }

        /** Class: Strophe
         *  An object container for all Strophe library functions.
         *
         *  This class is just a container for all the objects and constants
         *  used in the library.  It is not meant to be instantiated, but to
         *  provide a namespace for library objects, constants, and functions.
         */
        Strophe = {
            /** Constant: VERSION
             *  The version of the Strophe library. Unreleased builds will have
             *  a version of head-HASH where HASH is a partial revision.
             */
            VERSION: "1.2.8",

            /** Constants: XMPP Namespace Constants
             *  Common namespace constants from the XMPP RFCs and XEPs.
             *
             *  NS.HTTPBIND - HTTP BIND namespace from XEP 124.
             *  NS.BOSH - BOSH namespace from XEP 206.
             *  NS.CLIENT - Main XMPP client namespace.
             *  NS.AUTH - Legacy authentication namespace.
             *  NS.ROSTER - Roster operations namespace.
             *  NS.PROFILE - Profile namespace.
             *  NS.DISCO_INFO - Service discovery info namespace from XEP 30.
             *  NS.DISCO_ITEMS - Service discovery items namespace from XEP 30.
             *  NS.MUC - Multi-User Chat namespace from XEP 45.
             *  NS.SASL - XMPP SASL namespace from RFC 3920.
             *  NS.STREAM - XMPP Streams namespace from RFC 3920.
             *  NS.BIND - XMPP Binding namespace from RFC 3920.
             *  NS.SESSION - XMPP Session namespace from RFC 3920.
             *  NS.XHTML_IM - XHTML-IM namespace from XEP 71.
             *  NS.XHTML - XHTML body namespace from XEP 71.
             */
            NS: {
                HTTPBIND: "http://jabber.org/protocol/httpbind",
                BOSH: "urn:xmpp:xbosh",
                CLIENT: "jabber:client",
                AUTH: "jabber:iq:auth",
                ROSTER: "jabber:iq:roster",
                PROFILE: "jabber:iq:profile",
                DISCO_INFO: "http://jabber.org/protocol/disco#info",
                DISCO_ITEMS: "http://jabber.org/protocol/disco#items",
                MUC: "http://jabber.org/protocol/muc",
                SASL: "urn:ietf:params:xml:ns:xmpp-sasl",
                STREAM: "http://etherx.jabber.org/streams",
                FRAMING: "urn:ietf:params:xml:ns:xmpp-framing",
                BIND: "urn:ietf:params:xml:ns:xmpp-bind",
                SESSION: "urn:ietf:params:xml:ns:xmpp-session",
                VERSION: "jabber:iq:version",
                STANZAS: "urn:ietf:params:xml:ns:xmpp-stanzas",
                XHTML_IM: "http://jabber.org/protocol/xhtml-im",
                XHTML: "http://www.w3.org/1999/xhtml"
            },

            /** Constants: XHTML_IM Namespace
             *  contains allowed tags, tag attributes, and css properties.
             *  Used in the createHtml function to filter incoming html into the allowed XHTML-IM subset.
             *  See http://xmpp.org/extensions/xep-0071.html#profile-summary for the list of recommended
             *  allowed tags and their attributes.
             */
            XHTML: {
                tags: ['a', 'blockquote', 'br', 'cite', 'em', 'img', 'li', 'ol', 'p', 'span', 'strong', 'ul', 'body'],
                attributes: {
                    'a': ['href'],
                    'blockquote': ['style'],
                    'br': [],
                    'cite': ['style'],
                    'em': [],
                    'img': ['src', 'alt', 'style', 'height', 'width'],
                    'li': ['style'],
                    'ol': ['style'],
                    'p': ['style'],
                    'span': ['style'],
                    'strong': [],
                    'ul': ['style'],
                    'body': []
                },
                css: ['background-color', 'color', 'font-family', 'font-size', 'font-style', 'font-weight', 'margin-left', 'margin-right', 'text-align', 'text-decoration'],
                /** Function: XHTML.validTag
                 *
                 * Utility method to determine whether a tag is allowed
                 * in the XHTML_IM namespace.
                 *
                 * XHTML tag names are case sensitive and must be lower case.
                 */
                validTag: function (tag) {
                    for (var i = 0; i < Strophe.XHTML.tags.length; i++) {
                        if (tag == Strophe.XHTML.tags[i]) {
                            return true;
                        }
                    }
                    return false;
                },
                /** Function: XHTML.validAttribute
                 *
                 * Utility method to determine whether an attribute is allowed
                 * as recommended per XEP-0071
                 *
                 * XHTML attribute names are case sensitive and must be lower case.
                 */
                validAttribute: function (tag, attribute) {
                    if (typeof Strophe.XHTML.attributes[tag] !== 'undefined' && Strophe.XHTML.attributes[tag].length > 0) {
                        for (var i = 0; i < Strophe.XHTML.attributes[tag].length; i++) {
                            if (attribute == Strophe.XHTML.attributes[tag][i]) {
                                return true;
                            }
                        }
                    }
                    return false;
                },
                validCSS: function (style) {
                    for (var i = 0; i < Strophe.XHTML.css.length; i++) {
                        if (style == Strophe.XHTML.css[i]) {
                            return true;
                        }
                    }
                    return false;
                }
            },

            /** Constants: Connection Status Constants
             *  Connection status constants for use by the connection handler
             *  callback.
             *
             *  Status.ERROR - An error has occurred
             *  Status.CONNECTING - The connection is currently being made
             *  Status.CONNFAIL - The connection attempt failed
             *  Status.AUTHENTICATING - The connection is authenticating
             *  Status.AUTHFAIL - The authentication attempt failed
             *  Status.CONNECTED - The connection has succeeded
             *  Status.DISCONNECTED - The connection has been terminated
             *  Status.DISCONNECTING - The connection is currently being terminated
             *  Status.ATTACHED - The connection has been attached
             *  Status.CONNTIMEOUT - The connection has timed out
             */
            Status: {
                ERROR: 0,
                CONNECTING: 1,
                CONNFAIL: 2,
                AUTHENTICATING: 3,
                AUTHFAIL: 4,
                CONNECTED: 5,
                DISCONNECTED: 6,
                DISCONNECTING: 7,
                ATTACHED: 8,
                REDIRECT: 9,
                CONNTIMEOUT: 10
            },

            /** Constants: Log Level Constants
             *  Logging level indicators.
             *
             *  LogLevel.DEBUG - Debug output
             *  LogLevel.INFO - Informational output
             *  LogLevel.WARN - Warnings
             *  LogLevel.ERROR - Errors
             *  LogLevel.FATAL - Fatal errors
             */
            LogLevel: {
                DEBUG: 0,
                INFO: 1,
                WARN: 2,
                ERROR: 3,
                FATAL: 4
            },

            /** PrivateConstants: DOM Element Type Constants
             *  DOM element types.
             *
             *  ElementType.NORMAL - Normal element.
             *  ElementType.TEXT - Text data element.
             *  ElementType.FRAGMENT - XHTML fragment element.
             */
            ElementType: {
                NORMAL: 1,
                TEXT: 3,
                CDATA: 4,
                FRAGMENT: 11
            },

            /** PrivateConstants: Timeout Values
             *  Timeout values for error states.  These values are in seconds.
             *  These should not be changed unless you know exactly what you are
             *  doing.
             *
             *  TIMEOUT - Timeout multiplier. A waiting request will be considered
             *      failed after Math.floor(TIMEOUT * wait) seconds have elapsed.
             *      This defaults to 1.1, and with default wait, 66 seconds.
             *  SECONDARY_TIMEOUT - Secondary timeout multiplier. In cases where
             *      Strophe can detect early failure, it will consider the request
             *      failed if it doesn't return after
             *      Math.floor(SECONDARY_TIMEOUT * wait) seconds have elapsed.
             *      This defaults to 0.1, and with default wait, 6 seconds.
             */
            TIMEOUT: 1.1,
            SECONDARY_TIMEOUT: 0.1,

            /** Function: addNamespace
             *  This function is used to extend the current namespaces in
             *  Strophe.NS.  It takes a key and a value with the key being the
             *  name of the new namespace, with its actual value.
             *  For example:
             *  Strophe.addNamespace('PUBSUB', "http://jabber.org/protocol/pubsub");
             *
             *  Parameters:
             *    (String) name - The name under which the namespace will be
             *      referenced under Strophe.NS
             *    (String) value - The actual namespace.
             */
            addNamespace: function (name, value) {
                Strophe.NS[name] = value;
            },

            /** Function: forEachChild
             *  Map a function over some or all child elements of a given element.
             *
             *  This is a small convenience function for mapping a function over
             *  some or all of the children of an element.  If elemName is null, all
             *  children will be passed to the function, otherwise only children
             *  whose tag names match elemName will be passed.
             *
             *  Parameters:
             *    (XMLElement) elem - The element to operate on.
             *    (String) elemName - The child element tag name filter.
             *    (Function) func - The function to apply to each child.  This
             *      function should take a single argument, a DOM element.
             */
            forEachChild: function (elem, elemName, func) {
                var i, childNode;

                for (i = 0; i < elem.childNodes.length; i++) {
                    childNode = elem.childNodes[i];
                    if (childNode.nodeType == Strophe.ElementType.NORMAL &&
                        (!elemName || this.isTagEqual(childNode, elemName))) {
                        func(childNode);
                    }
                }
            },

            /** Function: isTagEqual
             *  Compare an element's tag name with a string.
             *
             *  This function is case sensitive.
             *
             *  Parameters:
             *    (XMLElement) el - A DOM element.
             *    (String) name - The element name.
             *
             *  Returns:
             *    true if the element's tag name matches _el_, and false
             *    otherwise.
             */
            isTagEqual: function (el, name) {
                return el.tagName == name;
            },

            /** PrivateVariable: _xmlGenerator
             *  _Private_ variable that caches a DOM document to
             *  generate elements.
             */
            _xmlGenerator: null,

            /** PrivateFunction: _makeGenerator
             *  _Private_ function that creates a dummy XML DOM document to serve as
             *  an element and text node generator.
             */
            _makeGenerator: function () {
                var doc;

                // IE9 does implement createDocument(); however, using it will cause the browser to leak memory on page unload.
                // Here, we test for presence of createDocument() plus IE's proprietary documentMode attribute, which would be
                // less than 10 in the case of IE9 and below.
                if (document.implementation.createDocument === undefined ||
                    document.implementation.createDocument && document.documentMode && document.documentMode < 10) {
                    doc = this._getIEXmlDom();
                    doc.appendChild(doc.createElement('strophe'));
                } else {
                    doc = document.implementation
                        .createDocument('jabber:client', 'strophe', null);
                }

                return doc;
            },

            /** Function: xmlGenerator
             *  Get the DOM document to generate elements.
             *
             *  Returns:
             *    The currently used DOM document.
             */
            xmlGenerator: function () {
                if (!Strophe._xmlGenerator) {
                    Strophe._xmlGenerator = Strophe._makeGenerator();
                }
                return Strophe._xmlGenerator;
            },

            /** PrivateFunction: _getIEXmlDom
             *  Gets IE xml doc object
             *
             *  Returns:
             *    A Microsoft XML DOM Object
             *  See Also:
             *    http://msdn.microsoft.com/en-us/library/ms757837%28VS.85%29.aspx
             */
            _getIEXmlDom: function () {
                var doc = null;
                var docStrings = [
                    "Msxml2.DOMDocument.6.0",
                    "Msxml2.DOMDocument.5.0",
                    "Msxml2.DOMDocument.4.0",
                    "MSXML2.DOMDocument.3.0",
                    "MSXML2.DOMDocument",
                    "MSXML.DOMDocument",
                    "Microsoft.XMLDOM"
                ];

                for (var d = 0; d < docStrings.length; d++) {
                    if (doc === null) {
                        try {
                            doc = new ActiveXObject(docStrings[d]);
                        } catch (e) {
                            doc = null;
                        }
                    } else {
                        break;
                    }
                }

                return doc;
            },

            /** Function: xmlElement
             *  Create an XML DOM element.
             *
             *  This function creates an XML DOM element correctly across all
             *  implementations. Note that these are not HTML DOM elements, which
             *  aren't appropriate for XMPP stanzas.
             *
             *  Parameters:
             *    (String) name - The name for the element.
             *    (Array|Object) attrs - An optional array or object containing
             *      key/value pairs to use as element attributes. The object should
             *      be in the format {'key': 'value'} or {key: 'value'}. The array
             *      should have the format [['key1', 'value1'], ['key2', 'value2']].
             *    (String) text - The text child data for the element.
             *
             *  Returns:
             *    A new XML DOM element.
             */
            xmlElement: function (name) {
                if (!name) {
                    return null;
                }

                var node = Strophe.xmlGenerator().createElement(name);

                // FIXME: this should throw errors if args are the wrong type or
                // there are more than two optional args
                var a, i, k;
                for (a = 1; a < arguments.length; a++) {
                    var arg = arguments[a];
                    if (!arg) {
                        continue;
                    }
                    if (typeof(arg) == "string" ||
                        typeof(arg) == "number") {
                        node.appendChild(Strophe.xmlTextNode(arg));
                    } else if (typeof(arg) == "object" &&
                        typeof(arg.sort) == "function") {
                        for (i = 0; i < arg.length; i++) {
                            var attr = arg[i];
                            if (typeof(attr) == "object" &&
                                typeof(attr.sort) == "function" &&
                                attr[1] !== undefined &&
                                attr[1] !== null) {
                                node.setAttribute(attr[0], attr[1]);
                            }
                        }
                    } else if (typeof(arg) == "object") {
                        for (k in arg) {
                            if (arg.hasOwnProperty(k)) {
                                if (arg[k] !== undefined &&
                                    arg[k] !== null) {
                                    node.setAttribute(k, arg[k]);
                                }
                            }
                        }
                    }
                }

                return node;
            },

            /*  Function: xmlescape
             *  Excapes invalid xml characters.
             *
             *  Parameters:
             *     (String) text - text to escape.
             *
             *  Returns:
             *      Escaped text.
             */
            xmlescape: function (text) {
                text = text.replace(/\&/g, "&amp;");
                text = text.replace(/</g, "&lt;");
                text = text.replace(/>/g, "&gt;");
                text = text.replace(/'/g, "&apos;");
                text = text.replace(/"/g, "&quot;");
                return text;
            },

            /*  Function: xmlunescape
             *  Unexcapes invalid xml characters.
             *
             *  Parameters:
             *     (String) text - text to unescape.
             *
             *  Returns:
             *      Unescaped text.
             */
            xmlunescape: function (text) {
                text = text.replace(/\&amp;/g, "&");
                text = text.replace(/&lt;/g, "<");
                text = text.replace(/&gt;/g, ">");
                text = text.replace(/&apos;/g, "'");
                text = text.replace(/&quot;/g, "\"");
                return text;
            },

            /** Function: xmlTextNode
             *  Creates an XML DOM text node.
             *
             *  Provides a cross implementation version of document.createTextNode.
             *
             *  Parameters:
             *    (String) text - The content of the text node.
             *
             *  Returns:
             *    A new XML DOM text node.
             */
            xmlTextNode: function (text) {
                return Strophe.xmlGenerator().createTextNode(text);
            },

            /** Function: xmlHtmlNode
             *  Creates an XML DOM html node.
             *
             *  Parameters:
             *    (String) html - The content of the html node.
             *
             *  Returns:
             *    A new XML DOM text node.
             */
            xmlHtmlNode: function (html) {
                var node;
                //ensure text is escaped
                if (window.DOMParser) {
                    var parser = new DOMParser();
                    node = parser.parseFromString(html, "text/xml");
                } else {
                    node = new ActiveXObject("Microsoft.XMLDOM");
                    node.async = "false";
                    node.loadXML(html);
                }
                return node;
            },

            /** Function: getText
             *  Get the concatenation of all text children of an element.
             *
             *  Parameters:
             *    (XMLElement) elem - A DOM element.
             *
             *  Returns:
             *    A String with the concatenated text of all text element children.
             */
            getText: function (elem) {
                if (!elem) {
                    return null;
                }

                var str = "";
                if (elem.childNodes.length === 0 && elem.nodeType ==
                    Strophe.ElementType.TEXT) {
                    str += elem.nodeValue;
                }

                for (var i = 0; i < elem.childNodes.length; i++) {
                    if (elem.childNodes[i].nodeType == Strophe.ElementType.TEXT) {
                        str += elem.childNodes[i].nodeValue;
                    }
                }

                return Strophe.xmlescape(str);
            },

            /** Function: copyElement
             *  Copy an XML DOM element.
             *
             *  This function copies a DOM element and all its descendants and returns
             *  the new copy.
             *
             *  Parameters:
             *    (XMLElement) elem - A DOM element.
             *
             *  Returns:
             *    A new, copied DOM element tree.
             */
            copyElement: function (elem) {
                var i, el;
                if (elem.nodeType == Strophe.ElementType.NORMAL) {
                    el = Strophe.xmlElement(elem.tagName);

                    for (i = 0; i < elem.attributes.length; i++) {
                        el.setAttribute(elem.attributes[i].nodeName,
                            elem.attributes[i].value);
                    }

                    for (i = 0; i < elem.childNodes.length; i++) {
                        el.appendChild(Strophe.copyElement(elem.childNodes[i]));
                    }
                } else if (elem.nodeType == Strophe.ElementType.TEXT) {
                    el = Strophe.xmlGenerator().createTextNode(elem.nodeValue);
                }

                return el;
            },


            /** Function: createHtml
             *  Copy an HTML DOM element into an XML DOM.
             *
             *  This function copies a DOM element and all its descendants and returns
             *  the new copy.
             *
             *  Parameters:
             *    (HTMLElement) elem - A DOM element.
             *
             *  Returns:
             *    A new, copied DOM element tree.
             */
            createHtml: function (elem) {
                var i, el, j, tag, attribute, value, css, cssAttrs, attr, cssName, cssValue;
                if (elem.nodeType == Strophe.ElementType.NORMAL) {
                    tag = elem.nodeName.toLowerCase(); // XHTML tags must be lower case.
                    if (Strophe.XHTML.validTag(tag)) {
                        try {
                            el = Strophe.xmlElement(tag);
                            for (i = 0; i < Strophe.XHTML.attributes[tag].length; i++) {
                                attribute = Strophe.XHTML.attributes[tag][i];
                                value = elem.getAttribute(attribute);
                                if (typeof value == 'undefined' || value === null || value === '' || value === false || value === 0) {
                                    continue;
                                }
                                if (attribute == 'style' && typeof value == 'object') {
                                    if (typeof value.cssText != 'undefined') {
                                        value = value.cssText; // we're dealing with IE, need to get CSS out
                                    }
                                }
                                // filter out invalid css styles
                                if (attribute == 'style') {
                                    css = [];
                                    cssAttrs = value.split(';');
                                    for (j = 0; j < cssAttrs.length; j++) {
                                        attr = cssAttrs[j].split(':');
                                        cssName = attr[0].replace(/^\s*/, "").replace(/\s*$/, "").toLowerCase();
                                        if (Strophe.XHTML.validCSS(cssName)) {
                                            cssValue = attr[1].replace(/^\s*/, "").replace(/\s*$/, "");
                                            css.push(cssName + ': ' + cssValue);
                                        }
                                    }
                                    if (css.length > 0) {
                                        value = css.join('; ');
                                        el.setAttribute(attribute, value);
                                    }
                                } else {
                                    el.setAttribute(attribute, value);
                                }
                            }

                            for (i = 0; i < elem.childNodes.length; i++) {
                                el.appendChild(Strophe.createHtml(elem.childNodes[i]));
                            }
                        } catch (e) { // invalid elements
                            el = Strophe.xmlTextNode('');
                        }
                    } else {
                        el = Strophe.xmlGenerator().createDocumentFragment();
                        for (i = 0; i < elem.childNodes.length; i++) {
                            el.appendChild(Strophe.createHtml(elem.childNodes[i]));
                        }
                    }
                } else if (elem.nodeType == Strophe.ElementType.FRAGMENT) {
                    el = Strophe.xmlGenerator().createDocumentFragment();
                    for (i = 0; i < elem.childNodes.length; i++) {
                        el.appendChild(Strophe.createHtml(elem.childNodes[i]));
                    }
                } else if (elem.nodeType == Strophe.ElementType.TEXT) {
                    el = Strophe.xmlTextNode(elem.nodeValue);
                }

                return el;
            },

            /** Function: escapeNode
             *  Escape the node part (also called local part) of a JID.
             *
             *  Parameters:
             *    (String) node - A node (or local part).
             *
             *  Returns:
             *    An escaped node (or local part).
             */
            escapeNode: function (node) {
                if (typeof node !== "string") {
                    return node;
                }
                return node.replace(/^\s+|\s+$/g, '')
                    .replace(/\\/g, "\\5c")
                    .replace(/ /g, "\\20")
                    .replace(/\"/g, "\\22")
                    .replace(/\&/g, "\\26")
                    .replace(/\'/g, "\\27")
                    .replace(/\//g, "\\2f")
                    .replace(/:/g, "\\3a")
                    .replace(/</g, "\\3c")
                    .replace(/>/g, "\\3e")
                    .replace(/@/g, "\\40");
            },

            /** Function: unescapeNode
             *  Unescape a node part (also called local part) of a JID.
             *
             *  Parameters:
             *    (String) node - A node (or local part).
             *
             *  Returns:
             *    An unescaped node (or local part).
             */
            unescapeNode: function (node) {
                if (typeof node !== "string") {
                    return node;
                }
                return node.replace(/\\20/g, " ")
                    .replace(/\\22/g, '"')
                    .replace(/\\26/g, "&")
                    .replace(/\\27/g, "'")
                    .replace(/\\2f/g, "/")
                    .replace(/\\3a/g, ":")
                    .replace(/\\3c/g, "<")
                    .replace(/\\3e/g, ">")
                    .replace(/\\40/g, "@")
                    .replace(/\\5c/g, "\\");
            },

            /** Function: getNodeFromJid
             *  Get the node portion of a JID String.
             *
             *  Parameters:
             *    (String) jid - A JID.
             *
             *  Returns:
             *    A String containing the node.
             */
            getNodeFromJid: function (jid) {
                if (jid.indexOf("@") < 0) {
                    return null;
                }
                return jid.split("@")[0];
            },

            /** Function: getDomainFromJid
             *  Get the domain portion of a JID String.
             *
             *  Parameters:
             *    (String) jid - A JID.
             *
             *  Returns:
             *    A String containing the domain.
             */
            getDomainFromJid: function (jid) {
                var bare = Strophe.getBareJidFromJid(jid);
                if (bare.indexOf("@") < 0) {
                    return bare;
                } else {
                    var parts = bare.split("@");
                    parts.splice(0, 1);
                    return parts.join('@');
                }
            },

            /** Function: getResourceFromJid
             *  Get the resource portion of a JID String.
             *
             *  Parameters:
             *    (String) jid - A JID.
             *
             *  Returns:
             *    A String containing the resource.
             */
            getResourceFromJid: function (jid) {
                var s = jid.split("/");
                if (s.length < 2) {
                    return null;
                }
                s.splice(0, 1);
                return s.join('/');
            },

            /** Function: getBareJidFromJid
             *  Get the bare JID from a JID String.
             *
             *  Parameters:
             *    (String) jid - A JID.
             *
             *  Returns:
             *    A String containing the bare JID.
             */
            getBareJidFromJid: function (jid) {
                return jid ? jid.split("/")[0] : null;
            },

            /** Function: log
             *  User overrideable logging function.
             *
             *  This function is called whenever the Strophe library calls any
             *  of the logging functions.  The default implementation of this
             *  function does nothing.  If client code wishes to handle the logging
             *  messages, it should override this with
             *  > Strophe.log = function (level, msg) {
     *  >   (user code here)
     *  > };
             *
             *  Please note that data sent and received over the wire is logged
             *  via Strophe.Connection.rawInput() and Strophe.Connection.rawOutput().
             *
             *  The different levels and their meanings are
             *
             *    DEBUG - Messages useful for debugging purposes.
             *    INFO - Informational messages.  This is mostly information like
             *      'disconnect was called' or 'SASL auth succeeded'.
             *    WARN - Warnings about potential problems.  This is mostly used
             *      to report transient connection errors like request timeouts.
             *    ERROR - Some error occurred.
             *    FATAL - A non-recoverable fatal error occurred.
             *
             *  Parameters:
             *    (Integer) level - The log level of the log message.  This will
             *      be one of the values in Strophe.LogLevel.
             *    (String) msg - The log message.
             */
            /* jshint ignore:start */
            log: function (level, msg) {
                return;
            },
            /* jshint ignore:end */

            /** Function: debug
             *  Log a message at the Strophe.LogLevel.DEBUG level.
             *
             *  Parameters:
             *    (String) msg - The log message.
             */
            debug: function (msg) {
                this.log(this.LogLevel.DEBUG, msg);
            },

            /** Function: info
             *  Log a message at the Strophe.LogLevel.INFO level.
             *
             *  Parameters:
             *    (String) msg - The log message.
             */
            info: function (msg) {
                this.log(this.LogLevel.INFO, msg);
            },

            /** Function: warn
             *  Log a message at the Strophe.LogLevel.WARN level.
             *
             *  Parameters:
             *    (String) msg - The log message.
             */
            warn: function (msg) {
                this.log(this.LogLevel.WARN, msg);
            },

            /** Function: error
             *  Log a message at the Strophe.LogLevel.ERROR level.
             *
             *  Parameters:
             *    (String) msg - The log message.
             */
            error: function (msg) {
                this.log(this.LogLevel.ERROR, msg);
            },

            /** Function: fatal
             *  Log a message at the Strophe.LogLevel.FATAL level.
             *
             *  Parameters:
             *    (String) msg - The log message.
             */
            fatal: function (msg) {
                this.log(this.LogLevel.FATAL, msg);
            },

            /** Function: serialize
             *  Render a DOM element and all descendants to a String.
             *
             *  Parameters:
             *    (XMLElement) elem - A DOM element.
             *
             *  Returns:
             *    The serialized element tree as a String.
             */
            serialize: function (elem) {
                var result;

                if (!elem) {
                    return null;
                }

                if (typeof(elem.tree) === "function") {
                    elem = elem.tree();
                }

                var nodeName = elem.nodeName;
                var i, child;

                if (elem.getAttribute("_realname")) {
                    nodeName = elem.getAttribute("_realname");
                }

                result = "<" + nodeName;
                for (i = 0; i < elem.attributes.length; i++) {
                    if (elem.attributes[i].nodeName != "_realname") {
                        result += " " + elem.attributes[i].nodeName +
                            "='" + Strophe.xmlescape(elem.attributes[i].value) + "'";
                    }
                }

                if (elem.childNodes.length > 0) {
                    result += ">";
                    for (i = 0; i < elem.childNodes.length; i++) {
                        child = elem.childNodes[i];
                        switch (child.nodeType) {
                            case Strophe.ElementType.NORMAL:
                                // normal element, so recurse
                                result += Strophe.serialize(child);
                                break;
                            case Strophe.ElementType.TEXT:
                                // text element to escape values
                                result += Strophe.xmlescape(child.nodeValue);
                                break;
                            case Strophe.ElementType.CDATA:
                                // cdata section so don't escape values
                                result += "<![CDATA[" + child.nodeValue + "]]>";
                        }
                    }
                    result += "</" + nodeName + ">";
                } else {
                    result += "/>";
                }

                return result;
            },

            /** PrivateVariable: _requestId
             *  _Private_ variable that keeps track of the request ids for
             *  connections.
             */
            _requestId: 0,

            /** PrivateVariable: Strophe.connectionPlugins
             *  _Private_ variable Used to store plugin names that need
             *  initialization on Strophe.Connection construction.
             */
            _connectionPlugins: {},

            /** Function: addConnectionPlugin
             *  Extends the Strophe.Connection object with the given plugin.
             *
             *  Parameters:
             *    (String) name - The name of the extension.
             *    (Object) ptype - The plugin's prototype.
             */
            addConnectionPlugin: function (name, ptype) {
                Strophe._connectionPlugins[name] = ptype;
            }
        };

        /** Class: Strophe.Builder
         *  XML DOM builder.
         *
         *  This object provides an interface similar to JQuery but for building
         *  DOM elements easily and rapidly.  All the functions except for toString()
         *  and tree() return the object, so calls can be chained.  Here's an
         *  example using the $iq() builder helper.
         *  > $iq({to: 'you', from: 'me', type: 'get', id: '1'})
         *  >     .c('query', {xmlns: 'strophe:example'})
         *  >     .c('example')
         *  >     .toString()
         *  The above generates this XML fragment
         *  > <iq to='you' from='me' type='get' id='1'>
         *  >   <query xmlns='strophe:example'>
         *  >     <example/>
         *  >   </query>
         *  > </iq>
         *  The corresponding DOM manipulations to get a similar fragment would be
         *  a lot more tedious and probably involve several helper variables.
         *
         *  Since adding children makes new operations operate on the child, up()
         *  is provided to traverse up the tree.  To add two children, do
         *  > builder.c('child1', ...).up().c('child2', ...)
         *  The next operation on the Builder will be relative to the second child.
         */

        /** Constructor: Strophe.Builder
         *  Create a Strophe.Builder object.
         *
         *  The attributes should be passed in object notation.  For example
         *  > var b = new Builder('message', {to: 'you', from: 'me'});
         *  or
         *  > var b = new Builder('messsage', {'xml:lang': 'en'});
         *
         *  Parameters:
         *    (String) name - The name of the root element.
         *    (Object) attrs - The attributes for the root element in object notation.
         *
         *  Returns:
         *    A new Strophe.Builder.
         */
        Strophe.Builder = function (name, attrs) {
            // Set correct namespace for jabber:client elements
            if (name == "presence" || name == "message" || name == "iq") {
                if (attrs && !attrs.xmlns) {
                    attrs.xmlns = Strophe.NS.CLIENT;
                } else if (!attrs) {
                    attrs = {xmlns: Strophe.NS.CLIENT};
                }
            }

            // Holds the tree being built.
            this.nodeTree = Strophe.xmlElement(name, attrs);

            // Points to the current operation node.
            this.node = this.nodeTree;
        };

        Strophe.Builder.prototype = {
            /** Function: tree
             *  Return the DOM tree.
             *
             *  This function returns the current DOM tree as an element object.  This
             *  is suitable for passing to functions like Strophe.Connection.send().
             *
             *  Returns:
             *    The DOM tree as a element object.
             */
            tree: function () {
                return this.nodeTree;
            },

            /** Function: toString
             *  Serialize the DOM tree to a String.
             *
             *  This function returns a string serialization of the current DOM
             *  tree.  It is often used internally to pass data to a
             *  Strophe.Request object.
             *
             *  Returns:
             *    The serialized DOM tree in a String.
             */
            toString: function () {
                return Strophe.serialize(this.nodeTree);
            },

            /** Function: up
             *  Make the current parent element the new current element.
             *
             *  This function is often used after c() to traverse back up the tree.
             *  For example, to add two children to the same element
             *  > builder.c('child1', {}).up().c('child2', {});
             *
             *  Returns:
             *    The Stophe.Builder object.
             */
            up: function () {
                this.node = this.node.parentNode;
                return this;
            },

            /** Function: attrs
             *  Add or modify attributes of the current element.
             *
             *  The attributes should be passed in object notation.  This function
             *  does not move the current element pointer.
             *
             *  Parameters:
             *    (Object) moreattrs - The attributes to add/modify in object notation.
             *
             *  Returns:
             *    The Strophe.Builder object.
             */
            attrs: function (moreattrs) {
                for (var k in moreattrs) {
                    if (moreattrs.hasOwnProperty(k)) {
                        if (moreattrs[k] === undefined) {
                            this.node.removeAttribute(k);
                        } else {
                            this.node.setAttribute(k, moreattrs[k]);
                        }
                    }
                }
                return this;
            },

            /** Function: c
             *  Add a child to the current element and make it the new current
             *  element.
             *
             *  This function moves the current element pointer to the child,
             *  unless text is provided.  If you need to add another child, it
             *  is necessary to use up() to go back to the parent in the tree.
             *
             *  Parameters:
             *    (String) name - The name of the child.
             *    (Object) attrs - The attributes of the child in object notation.
             *    (String) text - The text to add to the child.
             *
             *  Returns:
             *    The Strophe.Builder object.
             */
            c: function (name, attrs, text) {
                var child = Strophe.xmlElement(name, attrs, text);
                this.node.appendChild(child);
                if (typeof text !== "string" && typeof text !== "number") {
                    this.node = child;
                }
                return this;
            },

            /** Function: cnode
             *  Add a child to the current element and make it the new current
             *  element.
             *
             *  This function is the same as c() except that instead of using a
             *  name and an attributes object to create the child it uses an
             *  existing DOM element object.
             *
             *  Parameters:
             *    (XMLElement) elem - A DOM element.
             *
             *  Returns:
             *    The Strophe.Builder object.
             */
            cnode: function (elem) {
                var impNode;
                var xmlGen = Strophe.xmlGenerator();
                try {
                    impNode = (xmlGen.importNode !== undefined);
                }
                catch (e) {
                    impNode = false;
                }
                var newElem = impNode ?
                    xmlGen.importNode(elem, true) :
                    Strophe.copyElement(elem);
                this.node.appendChild(newElem);
                this.node = newElem;
                return this;
            },

            /** Function: t
             *  Add a child text element.
             *
             *  This *does not* make the child the new current element since there
             *  are no children of text elements.
             *
             *  Parameters:
             *    (String) text - The text data to append to the current element.
             *
             *  Returns:
             *    The Strophe.Builder object.
             */
            t: function (text) {
                var child = Strophe.xmlTextNode(text);
                this.node.appendChild(child);
                return this;
            },

            /** Function: h
             *  Replace current element contents with the HTML passed in.
             *
             *  This *does not* make the child the new current element
             *
             *  Parameters:
             *    (String) html - The html to insert as contents of current element.
             *
             *  Returns:
             *    The Strophe.Builder object.
             */
            h: function (html) {
                var fragment = document.createElement('body');

                // force the browser to try and fix any invalid HTML tags
                fragment.innerHTML = html;

                // copy cleaned html into an xml dom
                var xhtml = Strophe.createHtml(fragment);

                while (xhtml.childNodes.length > 0) {
                    this.node.appendChild(xhtml.childNodes[0]);
                }
                return this;
            }
        };

        /** PrivateClass: Strophe.Handler
         *  _Private_ helper class for managing stanza handlers.
         *
         *  A Strophe.Handler encapsulates a user provided callback function to be
         *  executed when matching stanzas are received by the connection.
         *  Handlers can be either one-off or persistant depending on their
         *  return value. Returning true will cause a Handler to remain active, and
         *  returning false will remove the Handler.
         *
         *  Users will not use Strophe.Handler objects directly, but instead they
         *  will use Strophe.Connection.addHandler() and
         *  Strophe.Connection.deleteHandler().
         */

        /** PrivateConstructor: Strophe.Handler
         *  Create and initialize a new Strophe.Handler.
         *
         *  Parameters:
         *    (Function) handler - A function to be executed when the handler is run.
         *    (String) ns - The namespace to match.
         *    (String) name - The element name to match.
         *    (String) type - The element type to match.
         *    (String) id - The element id attribute to match.
         *    (String) from - The element from attribute to match.
         *    (Object) options - Handler options
         *
         *  Returns:
         *    A new Strophe.Handler object.
         */
        Strophe.Handler = function (handler, ns, name, type, id, from, options) {
            this.handler = handler;
            this.ns = ns;
            this.name = name;
            this.type = type;
            this.id = id;
            this.options = options || {matchBare: false};

            // default matchBare to false if undefined
            if (!this.options.matchBare) {
                this.options.matchBare = false;
            }

            if (this.options.matchBare) {
                this.from = from ? Strophe.getBareJidFromJid(from) : null;
            } else {
                this.from = from;
            }

            // whether the handler is a user handler or a system handler
            this.user = true;
        };

        Strophe.Handler.prototype = {
            /** PrivateFunction: isMatch
             *  Tests if a stanza matches the Strophe.Handler.
             *
             *  Parameters:
             *    (XMLElement) elem - The XML element to test.
             *
             *  Returns:
             *    true if the stanza matches and false otherwise.
             */
            isMatch: function (elem) {
                var nsMatch;
                var from = null;

                if (this.options.matchBare) {
                    from = Strophe.getBareJidFromJid(elem.getAttribute('from'));
                } else {
                    from = elem.getAttribute('from');
                }

                nsMatch = false;
                if (!this.ns) {
                    nsMatch = true;
                } else {
                    var that = this;
                    Strophe.forEachChild(elem, null, function (elem) {
                        if (elem.getAttribute("xmlns") == that.ns) {
                            nsMatch = true;
                        }
                    });

                    nsMatch = nsMatch || elem.getAttribute("xmlns") == this.ns;
                }

                var elem_type = elem.getAttribute("type");
                if (nsMatch &&
                    (!this.name || Strophe.isTagEqual(elem, this.name)) &&
                    (!this.type || (Array.isArray(this.type) ? this.type.indexOf(elem_type) != -1 : elem_type == this.type)) &&
                    (!this.id || elem.getAttribute("id") == this.id) &&
                    (!this.from || from == this.from)) {
                    return true;
                }

                return false;
            },

            /** PrivateFunction: run
             *  Run the callback on a matching stanza.
             *
             *  Parameters:
             *    (XMLElement) elem - The DOM element that triggered the
             *      Strophe.Handler.
             *
             *  Returns:
             *    A boolean indicating if the handler should remain active.
             */
            run: function (elem) {
                var result = null;
                try {
                    result = this.handler(elem);
                } catch (e) {
                    console.log("Strophe runing callbacks error: ", e.message)
                    if (e.sourceURL) {
                        Strophe.fatal("error: " + this.handler +
                            " " + e.sourceURL + ":" +
                            e.line + " - " + e.name + ": " + e.message);
                    } else if (e.fileName) {
                        if (typeof(console) != "undefined") {
                            console.trace();
                            console.error(this.handler, " - error - ", e, e.message);
                        }
                        Strophe.fatal("error: " + this.handler + " " +
                            e.fileName + ":" + e.lineNumber + " - " +
                            e.name + ": " + e.message);
                    } else {
                        Strophe.fatal("error: " + e.message + "\n" + e.stack);
                    }

                    throw e;
                }

                return result;
            },

            /** PrivateFunction: toString
             *  Get a String representation of the Strophe.Handler object.
             *
             *  Returns:
             *    A String.
             */
            toString: function () {
                return "{Handler: " + this.handler + "(" + this.name + "," +
                    this.id + "," + this.ns + ")}";
            }
        };

        /** PrivateClass: Strophe.TimedHandler
         *  _Private_ helper class for managing timed handlers.
         *
         *  A Strophe.TimedHandler encapsulates a user provided callback that
         *  should be called after a certain period of time or at regular
         *  intervals.  The return value of the callback determines whether the
         *  Strophe.TimedHandler will continue to fire.
         *
         *  Users will not use Strophe.TimedHandler objects directly, but instead
         *  they will use Strophe.Connection.addTimedHandler() and
         *  Strophe.Connection.deleteTimedHandler().
         */

        /** PrivateConstructor: Strophe.TimedHandler
         *  Create and initialize a new Strophe.TimedHandler object.
         *
         *  Parameters:
         *    (Integer) period - The number of milliseconds to wait before the
         *      handler is called.
         *    (Function) handler - The callback to run when the handler fires.  This
         *      function should take no arguments.
         *
         *  Returns:
         *    A new Strophe.TimedHandler object.
         */
        Strophe.TimedHandler = function (period, handler) {
            this.period = period;
            this.handler = handler;

            this.lastCalled = new Date().getTime();
            this.user = true;
        };

        Strophe.TimedHandler.prototype = {
            /** PrivateFunction: run
             *  Run the callback for the Strophe.TimedHandler.
             *
             *  Returns:
             *    true if the Strophe.TimedHandler should be called again, and false
             *      otherwise.
             */
            run: function () {
                this.lastCalled = new Date().getTime();
                return this.handler();
            },

            /** PrivateFunction: reset
             *  Reset the last called time for the Strophe.TimedHandler.
             */
            reset: function () {
                this.lastCalled = new Date().getTime();
            },

            /** PrivateFunction: toString
             *  Get a string representation of the Strophe.TimedHandler object.
             *
             *  Returns:
             *    The string representation.
             */
            toString: function () {
                return "{TimedHandler: " + this.handler + "(" + this.period + ")}";
            }
        };

        /** Class: Strophe.Connection
         *  XMPP Connection manager.
         *
         *  This class is the main part of Strophe.  It manages a BOSH or websocket
         *  connection to an XMPP server and dispatches events to the user callbacks
         *  as data arrives. It supports SASL PLAIN, SASL DIGEST-MD5, SASL SCRAM-SHA1
         *  and legacy authentication.
         *
         *  After creating a Strophe.Connection object, the user will typically
         *  call connect() with a user supplied callback to handle connection level
         *  events like authentication failure, disconnection, or connection
         *  complete.
         *
         *  The user will also have several event handlers defined by using
         *  addHandler() and addTimedHandler().  These will allow the user code to
         *  respond to interesting stanzas or do something periodically with the
         *  connection. These handlers will be active once authentication is
         *  finished.
         *
         *  To send data to the connection, use send().
         */

        /** Constructor: Strophe.Connection
         *  Create and initialize a Strophe.Connection object.
         *
         *  The transport-protocol for this connection will be chosen automatically
         *  based on the given service parameter. URLs starting with "ws://" or
         *  "wss://" will use WebSockets, URLs starting with "http://", "https://"
         *  or without a protocol will use BOSH.
         *
         *  To make Strophe connect to the current host you can leave out the protocol
         *  and host part and just pass the path, e.g.
         *
         *  > var conn = new Strophe.Connection("/http-bind/");
         *
         *  Options common to both Websocket and BOSH:
         *  ------------------------------------------
         *
         *  The "cookies" option allows you to pass in cookies to be added to the
         *  document. These cookies will then be included in the BOSH XMLHttpRequest
         *  or in the websocket connection.
         *
         *  The passed in value must be a map of cookie names and string values:
         *
         * { "myCookie": {
 *      "value": "1234",
 *      "domain": ".example.org",
 *      "path": "/",
 *      "expires": expirationDate
 *      }
 *  }
         *
         *  Note that cookies can't be set in this way for other domains (i.e. cross-domain).
         *  Those cookies need to be set under those domains, for example they can be
         *  set server-side by making a XHR call to that domain to ask it to set any
         *  necessary cookies.
         *
         *  WebSocket options:
         *  ------------------
         *
         *  If you want to connect to the current host with a WebSocket connection you
         *  can tell Strophe to use WebSockets through a "protocol" attribute in the
         *  optional options parameter. Valid values are "ws" for WebSocket and "wss"
         *  for Secure WebSocket.
         *  So to connect to "wss://CURRENT_HOSTNAME/xmpp-websocket" you would call
         *
         *  > var conn = new Strophe.Connection("/xmpp-websocket/", {protocol: "wss"});
         *
         *  Note that relative URLs _NOT_ starting with a "/" will also include the path
         *  of the current site.
         *
         *  Also because downgrading security is not permitted by browsers, when using
         *  relative URLs both BOSH and WebSocket connections will use their secure
         *  variants if the current connection to the site is also secure (https).
         *
         *  BOSH options:
         *  -------------
         *
         *  By adding "sync" to the options, you can control if requests will
         *  be made synchronously or not. The default behaviour is asynchronous.
         *  If you want to make requests synchronous, make "sync" evaluate to true:
         *  > var conn = new Strophe.Connection("/http-bind/", {sync: true});
         *
         *  You can also toggle this on an already established connection:
         *  > conn.options.sync = true;
         *
         *  The "customHeaders" option can be used to provide custom HTTP headers to be
         *  included in the XMLHttpRequests made.
         *
         *  The "keepalive" option can be used to instruct Strophe to maintain the
         *  current BOSH session across interruptions such as webpage reloads.
         *
         *  It will do this by caching the sessions tokens in sessionStorage, and when
         *  "restore" is called it will check whether there are cached tokens with
         *  which it can resume an existing session.
         *
         *  The "withCredentials" option should receive a Boolean value and is used to
         *  indicate wether cookies should be included in ajax requests (by default
         *  they're not).
         *  Set this value to true if you are connecting to a BOSH service
         *  and for some reason need to send cookies to it.
         *  In order for this to work cross-domain, the server must also enable
         *  credentials by setting the Access-Control-Allow-Credentials response header
         *  to "true". For most usecases however this setting should be false (which
         *  is the default).
         *  Additionally, when using Access-Control-Allow-Credentials, the
         *  Access-Control-Allow-Origin header can't be set to the wildcard "*", but
         *  instead must be restricted to actual domains.
         *
         *  The "contentType" option can be set to change the default Content-Type
         *  of "text/xml; charset=utf-8", which can be useful to reduce the amount of
         *  CORS preflight requests that are sent to the server.
         *
         *  Parameters:
         *    (String) service - The BOSH or WebSocket service URL.
         *    (Object) options - A hash of configuration options
         *
         *  Returns:
         *    A new Strophe.Connection object.
         */
        Strophe.Connection = function (service, options) {
            // The service URL
            this.service = service;
            // Configuration options
            this.options = options || {};
            var proto = this.options.protocol || "";

            // Select protocal based on service or options
            if (service.indexOf("ws:") === 0 || service.indexOf("wss:") === 0 ||
                proto.indexOf("ws") === 0) {
                this._proto = new Strophe.Websocket(this);
            } else {
                this._proto = new Strophe.Bosh(this);
            }

            /* The connected JID. */
            this.jid = "";
            /* the JIDs domain */
            this.domain = null;
            /* stream:features */
            this.features = null;

            // SASL
            this._sasl_data = {};
            this.do_session = false;
            this.do_bind = false;

            // handler lists
            this.timedHandlers = [];
            this.handlers = [];
            this.removeTimeds = [];
            this.removeHandlers = [];
            this.addTimeds = [];
            this.addHandlers = [];

            this._authentication = {};
            this._idleTimeout = null;
            this._disconnectTimeout = null;

            this.authenticated = false;
            this.connected = false;
            this.disconnecting = false;
            this.do_authentication = true;
            this.paused = false;
            this.restored = false;

            this._data = [];
            this._uniqueId = 0;

            this._sasl_success_handler = null;
            this._sasl_failure_handler = null;
            this._sasl_challenge_handler = null;

            // Max retries before disconnecting
            this.maxRetries = 5;

            // Call onIdle callback every 1/10th of a second
            // XXX: setTimeout should be called only with function expressions (23974bc1)
            this._idleTimeout = setTimeout(function () {
                this._onIdle();
            }.bind(this), 100);

            utils.addCookies(this.options.cookies);

            // initialize plugins
            for (var k in Strophe._connectionPlugins) {
                if (Strophe._connectionPlugins.hasOwnProperty(k)) {
                    var ptype = Strophe._connectionPlugins[k];
                    // jslint complaints about the below line, but this is fine
                    var F = function () {
                    }; // jshint ignore:line
                    F.prototype = ptype;
                    this[k] = new F();
                    this[k].init(this);
                }
            }
        };

        Strophe.Connection.prototype = {
            /** Function: reset
             *  Reset the connection.
             *
             *  This function should be called after a connection is disconnected
             *  before that connection is reused.
             */
            reset: function () {
                this._proto._reset();

                // SASL
                this.do_session = false;
                this.do_bind = false;

                // handler lists
                this.timedHandlers = [];
                this.handlers = [];
                this.removeTimeds = [];
                this.removeHandlers = [];
                this.addTimeds = [];
                this.addHandlers = [];
                this._authentication = {};

                this.authenticated = false;
                this.connected = false;
                this.disconnecting = false;
                this.restored = false;

                this._data = [];
                this._requests = [];
                this._uniqueId = 0;
            },

            /** Function: pause
             *  Pause the request manager.
             *
             *  This will prevent Strophe from sending any more requests to the
             *  server.  This is very useful for temporarily pausing
             *  BOSH-Connections while a lot of send() calls are happening quickly.
             *  This causes Strophe to send the data in a single request, saving
             *  many request trips.
             */
            pause: function () {
                this.paused = true;
            },

            setJid: function (jid) {
                this.jid = jid;
                this.authzid = Strophe.getBareJidFromJid(this.jid);
                this.authcid = Strophe.getNodeFromJid(this.jid);
            },
              
            getJid: function () {
                return this.jid;
            },

            /** Function: resume
             *  Resume the request manager.
             *
             *  This resumes after pause() has been called.
             */
            resume: function () {
                this.paused = false;
            },

            /** Function: getUniqueId
             *  Generate a unique ID for use in <iq/> elements.
             *
             *  All <iq/> stanzas are required to have unique id attributes.  This
             *  function makes creating these easy.  Each connection instance has
             *  a counter which starts from zero, and the value of this counter
             *  plus a colon followed by the suffix becomes the unique id. If no
             *  suffix is supplied, the counter is used as the unique id.
             *
             *  Suffixes are used to make debugging easier when reading the stream
             *  data, and their use is recommended.  The counter resets to 0 for
             *  every new connection for the same reason.  For connections to the
             *  same server that authenticate the same way, all the ids should be
             *  the same, which makes it easy to see changes.  This is useful for
             *  automated testing as well.
             *
             *  Parameters:
             *    (String) suffix - A optional suffix to append to the id.
             *
             *  Returns:
             *    A unique string to be used for the id attribute.
             */
            getUniqueId: function (suffix) {
                var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : r & 0x3 | 0x8;
                    return v.toString(16);
                });
                if (typeof(suffix) == "string" || typeof(suffix) == "number") {
                    return uuid + ":" + suffix;
                } else {
                    return uuid + "";
                }
            },

            /** Function: connect
             *  Starts the connection process.
             *
             *  As the connection process proceeds, the user supplied callback will
             *  be triggered multiple times with status updates.  The callback
             *  should take two arguments - the status code and the error condition.
             *
             *  The status code will be one of the values in the Strophe.Status
             *  constants.  The error condition will be one of the conditions
             *  defined in RFC 3920 or the condition 'strophe-parsererror'.
             *
             *  The Parameters _wait_, _hold_ and _route_ are optional and only relevant
             *  for BOSH connections. Please see XEP 124 for a more detailed explanation
             *  of the optional parameters.
             *
             *  Parameters:
             *    (String) jid - The user's JID.  This may be a bare JID,
             *      or a full JID.  If a node is not supplied, SASL ANONYMOUS
             *      authentication will be attempted.
             *    (String) pass - The user's password.
             *    (Function) callback - The connect callback function.
             *    (Integer) wait - The optional HTTPBIND wait value.  This is the
             *      time the server will wait before returning an empty result for
             *      a request.  The default setting of 60 seconds is recommended.
             *    (Integer) hold - The optional HTTPBIND hold value.  This is the
             *      number of connections the server will hold at one time.  This
             *      should almost always be set to 1 (the default).
             *    (String) route - The optional route value.
             *    (String) authcid - The optional alternative authentication identity
             *      (username) if intending to impersonate another user.
             *      When using the SASL-EXTERNAL authentication mechanism, for example
             *      with client certificates, then the authcid value is used to
             *      determine whether an authorization JID (authzid) should be sent to
             *      the server. The authzid should not be sent to the server if the
             *      authzid and authcid are the same. So to prevent it from being sent
             *      (for example when the JID is already contained in the client
             *      certificate), set authcid to that same JID. See XEP-178 for more
             *      details.
             */
            connect: function (jid, pass, callback, wait, hold, route, authcid) {
                this.jid = jid;
                /** Variable: authzid
                 *  Authorization identity.
                 */
                this.authzid = Strophe.getBareJidFromJid(this.jid);

                /** Variable: authcid
                 *  Authentication identity (User name).
                 */
                this.authcid = authcid || Strophe.getNodeFromJid(this.jid);

                /** Variable: pass
                 *  Authentication identity (User password).
                 */
                this.pass = pass;

                /** Variable: servtype
                 *  Digest MD5 compatibility.
                 */
                this.servtype = "xmpp";

                this.connect_callback = callback;
                this.disconnecting = false;
                this.connected = false;
                this.authenticated = false;
                this.restored = false;

                // parse jid for domain
                this.domain = Strophe.getDomainFromJid(this.jid);

                this._changeConnectStatus(Strophe.Status.CONNECTING, null);

                this._proto._connect(wait, hold, route);
            },

            /** Function: attach
             *  Attach to an already created and authenticated BOSH session.
             *
             *  This function is provided to allow Strophe to attach to BOSH
             *  sessions which have been created externally, perhaps by a Web
             *  application.  This is often used to support auto-login type features
             *  without putting user credentials into the page.
             *
             *  Parameters:
             *    (String) jid - The full JID that is bound by the session.
             *    (String) sid - The SID of the BOSH session.
             *    (String) rid - The current RID of the BOSH session.  This RID
             *      will be used by the next request.
             *    (Function) callback The connect callback function.
             *    (Integer) wait - The optional HTTPBIND wait value.  This is the
             *      time the server will wait before returning an empty result for
             *      a request.  The default setting of 60 seconds is recommended.
             *      Other settings will require tweaks to the Strophe.TIMEOUT value.
             *    (Integer) hold - The optional HTTPBIND hold value.  This is the
             *      number of connections the server will hold at one time.  This
             *      should almost always be set to 1 (the default).
             *    (Integer) wind - The optional HTTBIND window value.  This is the
             *      allowed range of request ids that are valid.  The default is 5.
             */
            attach: function (jid, sid, rid, callback, wait, hold, wind) {
                if (this._proto instanceof Strophe.Bosh) {
                    this._proto._attach(jid, sid, rid, callback, wait, hold, wind);
                } else {
                    throw {
                        name: 'StropheSessionError',
                        message: 'The "attach" method can only be used with a BOSH connection.'
                    };
                }
            },

            /** Function: restore
             *  Attempt to restore a cached BOSH session.
             *
             *  This function is only useful in conjunction with providing the
             *  "keepalive":true option when instantiating a new Strophe.Connection.
             *
             *  When "keepalive" is set to true, Strophe will cache the BOSH tokens
             *  RID (Request ID) and SID (Session ID) and then when this function is
             *  called, it will attempt to restore the session from those cached
             *  tokens.
             *
             *  This function must therefore be called instead of connect or attach.
             *
             *  For an example on how to use it, please see examples/restore.js
             *
             *  Parameters:
             *    (String) jid - The user's JID.  This may be a bare JID or a full JID.
             *    (Function) callback - The connect callback function.
             *    (Integer) wait - The optional HTTPBIND wait value.  This is the
             *      time the server will wait before returning an empty result for
             *      a request.  The default setting of 60 seconds is recommended.
             *    (Integer) hold - The optional HTTPBIND hold value.  This is the
             *      number of connections the server will hold at one time.  This
             *      should almost always be set to 1 (the default).
             *    (Integer) wind - The optional HTTBIND window value.  This is the
             *      allowed range of request ids that are valid.  The default is 5.
             */
            restore: function (jid, callback, wait, hold, wind) {
                if (this._sessionCachingSupported()) {
                    this._proto._restore(jid, callback, wait, hold, wind);
                } else {
                    throw {
                        name: 'StropheSessionError',
                        message: 'The "restore" method can only be used with a BOSH connection.'
                    };
                }
            },

            /** PrivateFunction: _sessionCachingSupported
             * Checks whether sessionStorage and JSON are supported and whether we're
             * using BOSH.
             */
            _sessionCachingSupported: function () {
                if (this._proto instanceof Strophe.Bosh) {
                    if (!JSON) {
                        return false;
                    }
                    try {
                        window.sessionStorage.setItem('_strophe_', '_strophe_');
                        window.sessionStorage.removeItem('_strophe_');
                    } catch (e) {
                        return false;
                    }
                    return true;
                }
                return false;
            },

            /** Function: xmlInput
             *  User overrideable function that receives XML data coming into the
             *  connection.
             *
             *  The default function does nothing.  User code can override this with
             *  > Strophe.Connection.xmlInput = function (elem) {
     *  >   (user code)
     *  > };
             *
             *  Due to limitations of current Browsers' XML-Parsers the opening and closing
             *  <stream> tag for WebSocket-Connoctions will be passed as selfclosing here.
             *
             *  BOSH-Connections will have all stanzas wrapped in a <body> tag. See
             *  <Strophe.Bosh.strip> if you want to strip this tag.
             *
             *  Parameters:
             *    (XMLElement) elem - The XML data received by the connection.
             */
            /* jshint unused:false */
            xmlInput: function (elem) {
                return;
            },
            /* jshint unused:true */

            /** Function: xmlOutput
             *  User overrideable function that receives XML data sent to the
             *  connection.
             *
             *  The default function does nothing.  User code can override this with
             *  > Strophe.Connection.xmlOutput = function (elem) {
     *  >   (user code)
     *  > };
             *
             *  Due to limitations of current Browsers' XML-Parsers the opening and closing
             *  <stream> tag for WebSocket-Connoctions will be passed as selfclosing here.
             *
             *  BOSH-Connections will have all stanzas wrapped in a <body> tag. See
             *  <Strophe.Bosh.strip> if you want to strip this tag.
             *
             *  Parameters:
             *    (XMLElement) elem - The XMLdata sent by the connection.
             */
            /* jshint unused:false */
            xmlOutput: function (elem) {
                return;
            },
            /* jshint unused:true */

            /** Function: rawInput
             *  User overrideable function that receives raw data coming into the
             *  connection.
             *
             *  The default function does nothing.  User code can override this with
             *  > Strophe.Connection.rawInput = function (data) {
     *  >   (user code)
     *  > };
             *
             *  Parameters:
             *    (String) data - The data received by the connection.
             */
            /* jshint unused:false */
            rawInput: function (data) {
                return;
            },
            /* jshint unused:true */

            /** Function: rawOutput
             *  User overrideable function that receives raw data sent to the
             *  connection.
             *
             *  The default function does nothing.  User code can override this with
             *  > Strophe.Connection.rawOutput = function (data) {
     *  >   (user code)
     *  > };
             *
             *  Parameters:
             *    (String) data - The data sent by the connection.
             */
            /* jshint unused:false */
            rawOutput: function (data) {
                return;
            },
            /* jshint unused:true */

            /** Function: nextValidRid
             *  User overrideable function that receives the new valid rid.
             *
             *  The default function does nothing. User code can override this with
             *  > Strophe.Connection.nextValidRid = function (rid) {
     *  >    (user code)
     *  > };
             *
             *  Parameters:
             *    (Number) rid - The next valid rid
             */
            /* jshint unused:false */
            nextValidRid: function (rid) {
                return;
            },
            /* jshint unused:true */

            /** Function: send
             *  Send a stanza.
             *
             *  This function is called to push data onto the send queue to
             *  go out over the wire.  Whenever a request is sent to the BOSH
             *  server, all pending data is sent and the queue is flushed.
             *
             *  Parameters:
             *    (XMLElement |
             *     [XMLElement] |
             *     Strophe.Builder) elem - The stanza to send.
             */
            send: function (elem) {
                if (elem === null) {
                    return;
                }
                if (typeof(elem.sort) === "function") {
                    for (var i = 0; i < elem.length; i++) {
                        this._queueData(elem[i]);
                    }
                } else if (typeof(elem.tree) === "function") {
                    this._queueData(elem.tree());
                } else {
                    this._queueData(elem);
                }

                this._proto._send();
            },

            /** Function: flush
             *  Immediately send any pending outgoing data.
             *
             *  Normally send() queues outgoing data until the next idle period
             *  (100ms), which optimizes network use in the common cases when
             *  several send()s are called in succession. flush() can be used to
             *  immediately send all pending data.
             */
            flush: function () {
                // cancel the pending idle period and run the idle function
                // immediately
                clearTimeout(this._idleTimeout);
                this._onIdle();
            },

            /** Function: sendIQ
             *  Helper function to send IQ stanzas.
             *
             *  Parameters:
             *    (XMLElement) elem - The stanza to send.
             *    (Function) callback - The callback function for a successful request.
             *    (Function) errback - The callback function for a failed or timed
             *      out request.  On timeout, the stanza will be null.
             *    (Integer) timeout - The time specified in milliseconds for a
             *      timeout to occur.
             *
             *  Returns:
             *    The id used to send the IQ.
             */
            sendIQ: function (elem, callback, errback, timeout) {
                var timeoutHandler = null;
                var that = this;

                if (typeof(elem.tree) === "function") {
                    elem = elem.tree();
                }
                var id = elem.getAttribute('id');

                // inject id if not found
                if (!id) {
                    id = this.getUniqueId("sendIQ");
                    elem.setAttribute("id", id);
                }

                var expectedFrom = elem.getAttribute("to");
                var fulljid = this.jid;

                var handler = this.addHandler(function (stanza) {
                    // remove timeout handler if there is one
                    if (timeoutHandler) {
                        that.deleteTimedHandler(timeoutHandler);
                    }

                    var acceptable = false;
                    var from = stanza.getAttribute("from");
                    if (from === expectedFrom ||
                        (!expectedFrom &&
                        (from === Strophe.getBareJidFromJid(fulljid) ||
                        from === Strophe.getDomainFromJid(fulljid) ||
                        from === fulljid))) {
                        acceptable = true;
                    }

                    if (!acceptable) {
                        throw {
                            name: "StropheError",
                            message: "Got answer to IQ from wrong jid:" + from +
                            "\nExpected jid: " + expectedFrom
                        };
                    }

                    var iqtype = stanza.getAttribute('type');
                    if (iqtype == 'result') {
                        if (callback) {
                            callback(stanza);
                        }
                    } else if (iqtype == 'error') {
                        if (errback) {
                            errback(stanza);
                        }
                    } else {
                        throw {
                            name: "StropheError",
                            message: "Got bad IQ type of " + iqtype
                        };
                    }
                }, null, 'iq', ['error', 'result'], id);

                // if timeout specified, setup timeout handler.
                if (timeout) {
                    timeoutHandler = this.addTimedHandler(timeout, function () {
                        // get rid of normal handler
                        that.deleteHandler(handler);
                        // call errback on timeout with null stanza
                        if (errback) {
                            errback(null);
                        }
                        return false;
                    });
                }
                this.send(elem);
                return id;
            },

            /** PrivateFunction: _queueData
             *  Queue outgoing data for later sending.  Also ensures that the data
             *  is a DOMElement.
             */
            _queueData: function (element) {
                if (element === null || !element.tagName || !element.childNodes) {
                    throw {
                        name: "StropheError",
                        message: "Cannot queue non-DOMElement."
                    };
                }
                this._data.push(element);
            },

            /** PrivateFunction: _sendRestart
             *  Send an xmpp:restart stanza.
             */
            _sendRestart: function () {
                this._data.push("restart");
                this._proto._sendRestart();
                // XXX: setTimeout should be called only with function expressions (23974bc1)
                this._idleTimeout = setTimeout(function () {
                    this._onIdle();
                }.bind(this), 100);
            },

            /** Function: addTimedHandler
             *  Add a timed handler to the connection.
             *
             *  This function adds a timed handler.  The provided handler will
             *  be called every period milliseconds until it returns false,
             *  the connection is terminated, or the handler is removed.  Handlers
             *  that wish to continue being invoked should return true.
             *
             *  Because of method binding it is necessary to save the result of
             *  this function if you wish to remove a handler with
             *  deleteTimedHandler().
             *
             *  Note that user handlers are not active until authentication is
             *  successful.
             *
             *  Parameters:
             *    (Integer) period - The period of the handler.
             *    (Function) handler - The callback function.
             *
             *  Returns:
             *    A reference to the handler that can be used to remove it.
             */
            addTimedHandler: function (period, handler) {
                var thand = new Strophe.TimedHandler(period, handler);
                this.addTimeds.push(thand);
                return thand;
            },

            /** Function: deleteTimedHandler
             *  Delete a timed handler for a connection.
             *
             *  This function removes a timed handler from the connection.  The
             *  handRef parameter is *not* the function passed to addTimedHandler(),
             *  but is the reference returned from addTimedHandler().
             *
             *  Parameters:
             *    (Strophe.TimedHandler) handRef - The handler reference.
             */
            deleteTimedHandler: function (handRef) {
                // this must be done in the Idle loop so that we don't change
                // the handlers during iteration
                this.removeTimeds.push(handRef);
            },

            /** Function: addHandler
             *  Add a stanza handler for the connection.
             *
             *  This function adds a stanza handler to the connection.  The
             *  handler callback will be called for any stanza that matches
             *  the parameters.  Note that if multiple parameters are supplied,
             *  they must all match for the handler to be invoked.
             *
             *  The handler will receive the stanza that triggered it as its argument.
             *  *The handler should return true if it is to be invoked again;
             *  returning false will remove the handler after it returns.*
             *
             *  As a convenience, the ns parameters applies to the top level element
             *  and also any of its immediate children.  This is primarily to make
             *  matching /iq/query elements easy.
             *
             *  The options argument contains handler matching flags that affect how
             *  matches are determined. Currently the only flag is matchBare (a
             *  boolean). When matchBare is true, the from parameter and the from
             *  attribute on the stanza will be matched as bare JIDs instead of
             *  full JIDs. To use this, pass {matchBare: true} as the value of
             *  options. The default value for matchBare is false.
             *
             *  The return value should be saved if you wish to remove the handler
             *  with deleteHandler().
             *
             *  Parameters:
             *    (Function) handler - The user callback.
             *    (String) ns - The namespace to match.
             *    (String) name - The stanza name to match.
             *    (String) type - The stanza type attribute to match.
             *    (String) id - The stanza id attribute to match.
             *    (String) from - The stanza from attribute to match.
             *    (String) options - The handler options
             *
             *  Returns:
             *    A reference to the handler that can be used to remove it.
             */
            addHandler: function (handler, ns, name, type, id, from, options) {
                var hand = new Strophe.Handler(handler, ns, name, type, id, from, options);
                this.addHandlers.push(hand);
                return hand;
            },

            /** Function: deleteHandler
             *  Delete a stanza handler for a connection.
             *
             *  This function removes a stanza handler from the connection.  The
             *  handRef parameter is *not* the function passed to addHandler(),
             *  but is the reference returned from addHandler().
             *
             *  Parameters:
             *    (Strophe.Handler) handRef - The handler reference.
             */
            deleteHandler: function (handRef) {
                // this must be done in the Idle loop so that we don't change
                // the handlers during iteration
                this.removeHandlers.push(handRef);
                // If a handler is being deleted while it is being added,
                // prevent it from getting added
                var i = this.addHandlers.indexOf(handRef);
                if (i >= 0) {
                    this.addHandlers.splice(i, 1);
                }
            },

            /** Function: disconnect
             *  Start the graceful disconnection process.
             *
             *  This function starts the disconnection process.  This process starts
             *  by sending unavailable presence and sending BOSH body of type
             *  terminate.  A timeout handler makes sure that disconnection happens
             *  even if the BOSH server does not respond.
             *  If the Connection object isn't connected, at least tries to abort all pending requests
             *  so the connection object won't generate successful requests (which were already opened).
             *
             *  The user supplied connection callback will be notified of the
             *  progress as this process happens.
             *
             *  Parameters:
             *    (String) reason - The reason the disconnect is occuring.
             */
            disconnect: function (reason) {
                this._changeConnectStatus(Strophe.Status.DISCONNECTING, reason);

                Strophe.info("Disconnect was called because: " + reason);
                if (this.connected) {
                    var pres = false;
                    this.disconnecting = true;
                    if (this.authenticated) {
                        pres = $pres({
                            xmlns: Strophe.NS.CLIENT,
                            type: 'unavailable'
                        });
                    }
                    // setup timeout handler
                    this._disconnectTimeout = this._addSysTimedHandler(
                        3000, this._onDisconnectTimeout.bind(this));
                    this._proto._disconnect(pres);
                } else {
                    Strophe.info("Disconnect was called before Strophe connected to the server");
                    this._proto._abortAllRequests();
                }
            },

            /** PrivateFunction: _changeConnectStatus
             *  _Private_ helper function that makes sure plugins and the user's
             *  callback are notified of connection status changes.
             *
             *  Parameters:
             *    (Integer) status - the new connection status, one of the values
             *      in Strophe.Status
             *    (String) condition - the error condition or null
             */
            _changeConnectStatus: function (status, condition) {
                // notify all plugins listening for status changes
                for (var k in Strophe._connectionPlugins) {
                    if (Strophe._connectionPlugins.hasOwnProperty(k)) {
                        var plugin = this[k];
                        if (plugin.statusChanged) {
                            try {
                                plugin.statusChanged(status, condition);
                            } catch (err) {
                                Strophe.error("" + k + " plugin caused an exception " +
                                    "changing status: " + err);
                            }
                        }
                    }
                }

                // notify the user's callback
                if (this.connect_callback) {
                    try {
                        this.connect_callback(status, condition);
                    } catch (e) {
                        Strophe.error("User connection callback caused an " +
                            "exception: " + e);
                    }
                }
            },

            /** PrivateFunction: _doDisconnect
             *  _Private_ function to disconnect.
             *
             *  This is the last piece of the disconnection logic.  This resets the
             *  connection and alerts the user's connection callback.
             */
            _doDisconnect: function (condition) {
                if (typeof this._idleTimeout == "number") {
                    clearTimeout(this._idleTimeout);
                }

                // Cancel Disconnect Timeout
                if (this._disconnectTimeout !== null) {
                    this.deleteTimedHandler(this._disconnectTimeout);
                    this._disconnectTimeout = null;
                }

                Strophe.info("_doDisconnect was called");
                this._proto._doDisconnect();

                this.authenticated = false;
                this.disconnecting = false;
                this.restored = false;

                // delete handlers
                this.handlers = [];
                this.timedHandlers = [];
                this.removeTimeds = [];
                this.removeHandlers = [];
                this.addTimeds = [];
                this.addHandlers = [];

                // tell the parent we disconnected
                this._changeConnectStatus(Strophe.Status.DISCONNECTED, condition);
                this.connected = false;
            },

            /** PrivateFunction: _dataRecv
             *  _Private_ handler to processes incoming data from the the connection.
             *
             *  Except for _connect_cb handling the initial connection request,
             *  this function handles the incoming data for all requests.  This
             *  function also fires stanza handlers that match each incoming
             *  stanza.
             *
             *  Parameters:
             *    (Strophe.Request) req - The request that has data ready.
             *    (string) req - The stanza a raw string (optiona).
             */
            _dataRecv: function (req, raw) {
                Strophe.info("_dataRecv called");
                //WebIM && WebIM.config.isDebug && Strophe.info(JSON.stringify(req));
                var elem = this._proto._reqToData(req);
                if (elem === null) {
                    return;
                }

                if (this.xmlInput !== Strophe.Connection.prototype.xmlInput) {
                    if (elem.nodeName === this._proto.strip && elem.childNodes.length) {
                        this.xmlInput(elem.childNodes[0]);
                    } else {
                        this.xmlInput(elem);
                    }
                }
                if (this.rawInput !== Strophe.Connection.prototype.rawInput) {
                    if (raw) {
                        this.rawInput(raw);
                    } else {
                        this.rawInput(Strophe.serialize(elem));
                    }
                }

                // remove handlers scheduled for deletion
                var i, hand;
                while (this.removeHandlers.length > 0) {
                    hand = this.removeHandlers.pop();
                    i = this.handlers.indexOf(hand);
                    if (i >= 0) {
                        this.handlers.splice(i, 1);
                    }
                }

                // add handlers scheduled for addition
                while (this.addHandlers.length > 0) {
                    this.handlers.push(this.addHandlers.pop());
                }

                // handle graceful disconnect
                if (this.disconnecting && this._proto._emptyQueue()) {
                    this._doDisconnect();
                    return;
                }

                var type = elem.getAttribute("type");
                var cond, conflict;
                if (type !== null && type == "terminate") {
                    // Don't process stanzas that come in after disconnect
                    if (this.disconnecting) {
                        return;
                    }

                    // an error occurred
                    cond = elem.getAttribute("condition");
                    conflict = elem.getElementsByTagName("conflict");
                    if (cond !== null) {
                        if (cond == "remote-stream-error" && conflict.length > 0) {
                            cond = "conflict";
                        }
                        this._changeConnectStatus(Strophe.Status.CONNFAIL, cond);
                    } else {
                        this._changeConnectStatus(Strophe.Status.CONNFAIL, "unknown");
                    }
                    this._doDisconnect(cond);
                    return;
                }

                // send each incoming stanza through the handler chain
                var that = this;
                Strophe.forEachChild(elem, null, function (child) {
                    var i, newList;
                    // process handlers
                    newList = that.handlers;
                    that.handlers = [];
                    for (i = 0; i < newList.length; i++) {
                        var hand = newList[i];
                        // encapsulate 'handler.run' not to lose the whole handler list if
                        // one of the handlers throws an exception
                        try {
                            if (hand.isMatch(child) &&
                                (that.authenticated || !hand.user)) {
                                if (hand.run(child)) {
                                    that.handlers.push(hand);
                                }
                            } else {
                                that.handlers.push(hand);
                            }
                        } catch (e) {
                            // if the handler throws an exception, we consider it as false
                            Strophe.warn('Removing Strophe handlers due to uncaught exception: ' + e.message);
                        }
                    }
                });
            },


            /** Attribute: mechanisms
             *  SASL Mechanisms available for Conncection.
             */
            mechanisms: {},

            /** PrivateFunction: _connect_cb
             *  _Private_ handler for initial connection request.
             *
             *  This handler is used to process the initial connection request
             *  response from the BOSH server. It is used to set up authentication
             *  handlers and start the authentication process.
             *
             *  SASL authentication will be attempted if available, otherwise
             *  the code will fall back to legacy authentication.
             *
             *  Parameters:
             *    (Strophe.Request) req - The current request.
             *    (Function) _callback - low level (xmpp) connect callback function.
             *      Useful for plugins with their own xmpp connect callback (when their)
             *      want to do something special).
             */
            _connect_cb: function (req, _callback, raw) {
                Strophe.info("_connect_cb was called");

                this.connected = true;

                var bodyWrap;
                try {
                    bodyWrap = this._proto._reqToData(req);
                } catch (e) {
                    if (e != "badformat") {
                        throw e;
                    }
                    this._changeConnectStatus(Strophe.Status.CONNFAIL, 'bad-format');
                    this._doDisconnect('bad-format');
                }
                if (!bodyWrap) {
                    return;
                }

                if (this.xmlInput !== Strophe.Connection.prototype.xmlInput) {
                    if (bodyWrap.nodeName === this._proto.strip && bodyWrap.childNodes.length) {
                        this.xmlInput(bodyWrap.childNodes[0]);
                    } else {
                        this.xmlInput(bodyWrap);
                    }
                }
                if (this.rawInput !== Strophe.Connection.prototype.rawInput) {
                    if (raw) {
                        this.rawInput(raw);
                    } else {
                        this.rawInput(Strophe.serialize(bodyWrap));
                    }
                }

                var conncheck = this._proto._connect_cb(bodyWrap);
                if (conncheck === Strophe.Status.CONNFAIL) {
                    return;
                }

                this._authentication.sasl_scram_sha1 = false;
                this._authentication.sasl_plain = false;
                this._authentication.sasl_digest_md5 = false;
                this._authentication.sasl_anonymous = false;
                this._authentication.legacy_auth = false;

                // Check for the stream:features tag
                var hasFeatures;
                if (bodyWrap.getElementsByTagNameNS) {
                    hasFeatures = bodyWrap.getElementsByTagNameNS(Strophe.NS.STREAM, "features").length > 0;
                } else {
                    hasFeatures = bodyWrap.getElementsByTagName("stream:features").length > 0 || bodyWrap.getElementsByTagName("features").length > 0;
                }
                var mechanisms = bodyWrap.getElementsByTagName("mechanism");
                var matched = [];
                var i, mech, found_authentication = false;
                if (!hasFeatures) {
                    this._proto._no_auth_received(_callback);
                    return;
                }
                if (mechanisms.length > 0) {
                    for (i = 0; i < mechanisms.length; i++) {
                        mech = Strophe.getText(mechanisms[i]);
                        if (this.mechanisms[mech]) matched.push(this.mechanisms[mech]);
                    }
                }
                this._authentication.legacy_auth =
                    bodyWrap.getElementsByTagName("auth").length > 0;
                found_authentication = this._authentication.legacy_auth ||
                    matched.length > 0;
                if (!found_authentication) {
                    this._proto._no_auth_received(_callback);
                    return;
                }
                if (this.do_authentication !== false)
                    this.authenticate(matched);
            },

            /** Function: authenticate
             * Set up authentication
             *
             *  Contiunues the initial connection request by setting up authentication
             *  handlers and start the authentication process.
             *
             *  SASL authentication will be attempted if available, otherwise
             *  the code will fall back to legacy authentication.
             *
             */
            authenticate: function (matched) {
                var i;
                // Sorting matched mechanisms according to priority.
                for (i = 0; i < matched.length - 1; ++i) {
                    var higher = i;
                    for (var j = i + 1; j < matched.length; ++j) {
                        if (matched[j].prototype.priority > matched[higher].prototype.priority) {
                            higher = j;
                        }
                    }
                    if (higher != i) {
                        var swap = matched[i];
                        matched[i] = matched[higher];
                        matched[higher] = swap;
                    }
                }

                // run each mechanism
                var mechanism_found = false;
                for (i = 0; i < matched.length; ++i) {
                    if (!matched[i].prototype.test(this)) continue;

                    this._sasl_success_handler = this._addSysHandler(
                        this._sasl_success_cb.bind(this), null,
                        "success", null, null);
                    this._sasl_failure_handler = this._addSysHandler(
                        this._sasl_failure_cb.bind(this), null,
                        "failure", null, null);
                    this._sasl_challenge_handler = this._addSysHandler(
                        this._sasl_challenge_cb.bind(this), null,
                        "challenge", null, null);

                    this._sasl_mechanism = new matched[i]();
                    this._sasl_mechanism.onStart(this);

                    var request_auth_exchange = $build("auth", {
                        xmlns: Strophe.NS.SASL,
                        mechanism: this._sasl_mechanism.name
                    });

                    if (this._sasl_mechanism.isClientFirst) {
                        var response = this._sasl_mechanism.onChallenge(this, null);
                        request_auth_exchange.t(Base64.encode(response));
                    }
                    this.send(request_auth_exchange.tree());
                    mechanism_found = true;
                    break;
                }

                if (!mechanism_found) {
                    // if none of the mechanism worked
                    if (Strophe.getNodeFromJid(this.jid) === null) {
                        // we don't have a node, which is required for non-anonymous
                        // client connections
                        this._changeConnectStatus(Strophe.Status.CONNFAIL,
                            'x-strophe-bad-non-anon-jid');
                        this.disconnect('x-strophe-bad-non-anon-jid');
                    } else {
                        // fall back to legacy authentication
                        this._changeConnectStatus(Strophe.Status.AUTHENTICATING, null);
                        this._addSysHandler(this._auth1_cb.bind(this), null, null,
                            null, "_auth_1");
                        this.send($iq({
                            type: "get",
                            to: this.domain,
                            id: "_auth_1"
                        }).c("query", {
                            xmlns: Strophe.NS.AUTH
                        }).c("username", {}).t(Strophe.getNodeFromJid(this.jid)).tree());
                    }
                }
            },

            _sasl_challenge_cb: function (elem) {
                var challenge = Base64.decode(Strophe.getText(elem));
                var response = this._sasl_mechanism.onChallenge(this, challenge);
                var stanza = $build('response', {
                    xmlns: Strophe.NS.SASL
                });
                if (response !== "") {
                    stanza.t(Base64.encode(response));
                }
                this.send(stanza.tree());
                return true;
            },

            /** PrivateFunction: _auth1_cb
             *  _Private_ handler for legacy authentication.
             *
             *  This handler is called in response to the initial <iq type='get'/>
             *  for legacy authentication.  It builds an authentication <iq/> and
             *  sends it, creating a handler (calling back to _auth2_cb()) to
             *  handle the result
             *
             *  Parameters:
             *    (XMLElement) elem - The stanza that triggered the callback.
             *
             *  Returns:
             *    false to remove the handler.
             */
            /* jshint unused:false */
            _auth1_cb: function (elem) {
                // build plaintext auth iq
                var iq = $iq({type: "set", id: "_auth_2"})
                    .c('query', {xmlns: Strophe.NS.AUTH})
                    .c('username', {}).t(Strophe.getNodeFromJid(this.jid))
                    .up()
                    .c('password').t(this.pass);

                if (!Strophe.getResourceFromJid(this.jid)) {
                    // since the user has not supplied a resource, we pick
                    // a default one here.  unlike other auth methods, the server
                    // cannot do this for us.
                    this.jid = Strophe.getBareJidFromJid(this.jid) + '/strophe';
                }
                iq.up().c('resource', {}).t(Strophe.getResourceFromJid(this.jid));

                this._addSysHandler(this._auth2_cb.bind(this), null,
                    null, null, "_auth_2");
                this.send(iq.tree());
                return false;
            },
            /* jshint unused:true */

            /** PrivateFunction: _sasl_success_cb
             *  _Private_ handler for succesful SASL authentication.
             *
             *  Parameters:
             *    (XMLElement) elem - The matching stanza.
             *
             *  Returns:
             *    false to remove the handler.
             */
            _sasl_success_cb: function (elem) {
                if (this._sasl_data["server-signature"]) {
                    var serverSignature;
                    var success = Base64.decode(Strophe.getText(elem));
                    var attribMatch = /([a-z]+)=([^,]+)(,|$)/;
                    var matches = success.match(attribMatch);
                    if (matches[1] == "v") {
                        serverSignature = matches[2];
                    }

                    if (serverSignature != this._sasl_data["server-signature"]) {
                        // remove old handlers
                        this.deleteHandler(this._sasl_failure_handler);
                        this._sasl_failure_handler = null;
                        if (this._sasl_challenge_handler) {
                            this.deleteHandler(this._sasl_challenge_handler);
                            this._sasl_challenge_handler = null;
                        }

                        this._sasl_data = {};
                        return this._sasl_failure_cb(null);
                    }
                }

                Strophe.info("SASL authentication succeeded.");

                if (this._sasl_mechanism) {
                    this._sasl_mechanism.onSuccess();
                }

                // remove old handlers
                this.deleteHandler(this._sasl_failure_handler);
                this._sasl_failure_handler = null;
                if (this._sasl_challenge_handler) {
                    this.deleteHandler(this._sasl_challenge_handler);
                    this._sasl_challenge_handler = null;
                }

                var streamfeature_handlers = [];
                var wrapper = function (handlers, elem) {
                    while (handlers.length) {
                        this.deleteHandler(handlers.pop());
                    }
                    this._sasl_auth1_cb.bind(this)(elem);
                    return false;
                };
                streamfeature_handlers.push(this._addSysHandler(function (elem) {
                    wrapper.bind(this)(streamfeature_handlers, elem);
                }.bind(this), null, "stream:features", null, null));
                streamfeature_handlers.push(this._addSysHandler(function (elem) {
                    wrapper.bind(this)(streamfeature_handlers, elem);
                }.bind(this), Strophe.NS.STREAM, "features", null, null));

                // we must send an xmpp:restart now
                this._sendRestart();

                return false;
            },

            /** PrivateFunction: _sasl_auth1_cb
             *  _Private_ handler to start stream binding.
             *
             *  Parameters:
             *    (XMLElement) elem - The matching stanza.
             *
             *  Returns:
             *    false to remove the handler.
             */
            _sasl_auth1_cb: function (elem) {
                // save stream:features for future usage
                this.features = elem;
                var i, child;
                for (i = 0; i < elem.childNodes.length; i++) {
                    child = elem.childNodes[i];
                    if (child.nodeName == 'bind') {
                        this.do_bind = true;
                    }

                    if (child.nodeName == 'session') {
                        this.do_session = true;
                    }
                }

                if (!this.do_bind) {
                    this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
                    return false;
                } else {
                    this._addSysHandler(this._sasl_bind_cb.bind(this), null, null,
                        null, "_bind_auth_2");

                    var resource = Strophe.getResourceFromJid(this.jid);
                    if (resource) {
                        this.send($iq({type: "set", id: "_bind_auth_2"})
                            .c('bind', {xmlns: Strophe.NS.BIND})
                            .c('resource', {}).t(resource).tree());
                    } else {
                        this.send($iq({type: "set", id: "_bind_auth_2"})
                            .c('bind', {xmlns: Strophe.NS.BIND})
                            .tree());
                    }
                }
                return false;
            },

            /** PrivateFunction: _sasl_bind_cb
             *  _Private_ handler for binding result and session start.
             *
             *  Parameters:
             *    (XMLElement) elem - The matching stanza.
             *
             *  Returns:
             *    false to remove the handler.
             */
            _sasl_bind_cb: function (elem) {
                if (elem.getAttribute("type") == "error") {
                    Strophe.info("SASL binding failed.");
                    var conflict = elem.getElementsByTagName("conflict"), condition;
                    if (conflict.length > 0) {
                        condition = 'conflict';
                    }
                    this._changeConnectStatus(Strophe.Status.AUTHFAIL, condition);
                    return false;
                }

                // TODO - need to grab errors
                var bind = elem.getElementsByTagName("bind");
                var jidNode;
                if (bind.length > 0) {
                    // Grab jid
                    jidNode = bind[0].getElementsByTagName("jid");
                    if (jidNode.length > 0) {
                        this.jid = Strophe.getText(jidNode[0]);

                        if (this.do_session) {
                            this._addSysHandler(this._sasl_session_cb.bind(this),
                                null, null, null, "_session_auth_2");

                            this.send($iq({type: "set", id: "_session_auth_2"})
                                .c('session', {xmlns: Strophe.NS.SESSION})
                                .tree());
                        } else {
                            this.authenticated = true;
                            this._changeConnectStatus(Strophe.Status.CONNECTED, null);
                        }
                    }
                } else {
                    Strophe.info("SASL binding failed.");
                    this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
                    return false;
                }
            },

            /** PrivateFunction: _sasl_session_cb
             *  _Private_ handler to finish successful SASL connection.
             *
             *  This sets Connection.authenticated to true on success, which
             *  starts the processing of user handlers.
             *
             *  Parameters:
             *    (XMLElement) elem - The matching stanza.
             *
             *  Returns:
             *    false to remove the handler.
             */
            _sasl_session_cb: function (elem) {
                if (elem.getAttribute("type") == "result") {
                    this.authenticated = true;
                    this._changeConnectStatus(Strophe.Status.CONNECTED, null);
                } else if (elem.getAttribute("type") == "error") {
                    Strophe.info("Session creation failed.");
                    this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
                    return false;
                }
                return false;
            },

            /** PrivateFunction: _sasl_failure_cb
             *  _Private_ handler for SASL authentication failure.
             *
             *  Parameters:
             *    (XMLElement) elem - The matching stanza.
             *
             *  Returns:
             *    false to remove the handler.
             */
            /* jshint unused:false */
            _sasl_failure_cb: function (elem) {
                // delete unneeded handlers
                if (this._sasl_success_handler) {
                    this.deleteHandler(this._sasl_success_handler);
                    this._sasl_success_handler = null;
                }
                if (this._sasl_challenge_handler) {
                    this.deleteHandler(this._sasl_challenge_handler);
                    this._sasl_challenge_handler = null;
                }

                if (this._sasl_mechanism)
                    this._sasl_mechanism.onFailure();
                this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
                return false;
            },
            /* jshint unused:true */

            /** PrivateFunction: _auth2_cb
             *  _Private_ handler to finish legacy authentication.
             *
             *  This handler is called when the result from the jabber:iq:auth
             *  <iq/> stanza is returned.
             *
             *  Parameters:
             *    (XMLElement) elem - The stanza that triggered the callback.
             *
             *  Returns:
             *    false to remove the handler.
             */
            _auth2_cb: function (elem) {
                if (elem.getAttribute("type") == "result") {
                    this.authenticated = true;
                    this._changeConnectStatus(Strophe.Status.CONNECTED, null);
                } else if (elem.getAttribute("type") == "error") {
                    this._changeConnectStatus(Strophe.Status.AUTHFAIL, null);
                    this.disconnect('authentication failed');
                }
                return false;
            },

            /** PrivateFunction: _addSysTimedHandler
             *  _Private_ function to add a system level timed handler.
             *
             *  This function is used to add a Strophe.TimedHandler for the
             *  library code.  System timed handlers are allowed to run before
             *  authentication is complete.
             *
             *  Parameters:
             *    (Integer) period - The period of the handler.
             *    (Function) handler - The callback function.
             */
            _addSysTimedHandler: function (period, handler) {
                var thand = new Strophe.TimedHandler(period, handler);
                thand.user = false;
                this.addTimeds.push(thand);
                return thand;
            },

            /** PrivateFunction: _addSysHandler
             *  _Private_ function to add a system level stanza handler.
             *
             *  This function is used to add a Strophe.Handler for the
             *  library code.  System stanza handlers are allowed to run before
             *  authentication is complete.
             *
             *  Parameters:
             *    (Function) handler - The callback function.
             *    (String) ns - The namespace to match.
             *    (String) name - The stanza name to match.
             *    (String) type - The stanza type attribute to match.
             *    (String) id - The stanza id attribute to match.
             */
            _addSysHandler: function (handler, ns, name, type, id) {
                var hand = new Strophe.Handler(handler, ns, name, type, id);
                hand.user = false;
                this.addHandlers.push(hand);
                return hand;
            },

            /** PrivateFunction: _onDisconnectTimeout
             *  _Private_ timeout handler for handling non-graceful disconnection.
             *
             *  If the graceful disconnect process does not complete within the
             *  time allotted, this handler finishes the disconnect anyway.
             *
             *  Returns:
             *    false to remove the handler.
             */
            _onDisconnectTimeout: function () {
                Strophe.info("_onDisconnectTimeout was called");
                this._changeConnectStatus(Strophe.Status.CONNTIMEOUT, null);
                this._proto._onDisconnectTimeout();
                // actually disconnect
                this._doDisconnect();
                return false;
            },

            /** PrivateFunction: _onIdle
             *  _Private_ handler to process events during idle cycle.
             *
             *  This handler is called every 100ms to fire timed handlers that
             *  are ready and keep poll requests going.
             */
            _onIdle: function () {
                var i, thand, since, newList;

                // add timed handlers scheduled for addition
                // NOTE: we add before remove in the case a timed handler is
                // added and then deleted before the next _onIdle() call.
                while (this.addTimeds.length > 0) {
                    this.timedHandlers.push(this.addTimeds.pop());
                }

                // remove timed handlers that have been scheduled for deletion
                while (this.removeTimeds.length > 0) {
                    thand = this.removeTimeds.pop();
                    i = this.timedHandlers.indexOf(thand);
                    if (i >= 0) {
                        this.timedHandlers.splice(i, 1);
                    }
                }

                // call ready timed handlers
                var now = new Date().getTime();
                newList = [];
                for (i = 0; i < this.timedHandlers.length; i++) {
                    thand = this.timedHandlers[i];
                    if (this.authenticated || !thand.user) {
                        since = thand.lastCalled + thand.period;
                        if (since - now <= 0) {
                            if (thand.run()) {
                                newList.push(thand);
                            }
                        } else {
                            newList.push(thand);
                        }
                    }
                }
                this.timedHandlers = newList;

                clearTimeout(this._idleTimeout);

                this._proto._onIdle();

                // reactivate the timer only if connected
                if (this.connected) {
                    // XXX: setTimeout should be called only with function expressions (23974bc1)
                    this._idleTimeout = setTimeout(function () {
                        this._onIdle();
                    }.bind(this), 100);
                }
            }
        };

        /** Class: Strophe.SASLMechanism
         *
         *  encapsulates SASL authentication mechanisms.
         *
         *  User code may override the priority for each mechanism or disable it completely.
         *  See <priority> for information about changing priority and <test> for informatian on
         *  how to disable a mechanism.
         *
         *  By default, all mechanisms are enabled and the priorities are
         *
         *  EXTERNAL - 60
         *  OAUTHBEARER - 50
         *  SCRAM-SHA1 - 40
         *  DIGEST-MD5 - 30
         *  PLAIN - 20
         *  ANONYMOUS - 10
         */

        /**
         * PrivateConstructor: Strophe.SASLMechanism
         * SASL auth mechanism abstraction.
         *
         *  Parameters:
         *    (String) name - SASL Mechanism name.
         *    (Boolean) isClientFirst - If client should send response first without challenge.
         *    (Number) priority - Priority.
         *
         *  Returns:
         *    A new Strophe.SASLMechanism object.
         */
        Strophe.SASLMechanism = function (name, isClientFirst, priority) {
            /** PrivateVariable: name
             *  Mechanism name.
             */
            this.name = name;
            /** PrivateVariable: isClientFirst
             *  If client sends response without initial server challenge.
             */
            this.isClientFirst = isClientFirst;
            /** Variable: priority
             *  Determines which <SASLMechanism> is chosen for authentication (Higher is better).
             *  Users may override this to prioritize mechanisms differently.
             *
             *  In the default configuration the priorities are
             *
             *  SCRAM-SHA1 - 40
             *  DIGEST-MD5 - 30
             *  Plain - 20
             *
             *  Example: (This will cause Strophe to choose the mechanism that the server sent first)
             *
             *  > Strophe.SASLMD5.priority = Strophe.SASLSHA1.priority;
             *
             *  See <SASL mechanisms> for a list of available mechanisms.
             *
             */
            this.priority = priority;
        };

        Strophe.SASLMechanism.prototype = {
            /**
             *  Function: test
             *  Checks if mechanism able to run.
             *  To disable a mechanism, make this return false;
             *
             *  To disable plain authentication run
             *  > Strophe.SASLPlain.test = function() {
   *  >   return false;
   *  > }
             *
             *  See <SASL mechanisms> for a list of available mechanisms.
             *
             *  Parameters:
             *    (Strophe.Connection) connection - Target Connection.
             *
             *  Returns:
             *    (Boolean) If mechanism was able to run.
             */
            /* jshint unused:false */
            test: function (connection) {
                return true;
            },
            /* jshint unused:true */

            /** PrivateFunction: onStart
             *  Called before starting mechanism on some connection.
             *
             *  Parameters:
             *    (Strophe.Connection) connection - Target Connection.
             */
            onStart: function (connection) {
                this._connection = connection;
            },

            /** PrivateFunction: onChallenge
             *  Called by protocol implementation on incoming challenge. If client is
             *  first (isClientFirst == true) challenge will be null on the first call.
             *
             *  Parameters:
             *    (Strophe.Connection) connection - Target Connection.
             *    (String) challenge - current challenge to handle.
             *
             *  Returns:
             *    (String) Mechanism response.
             */
            /* jshint unused:false */
            onChallenge: function (connection, challenge) {
                throw new Error("You should implement challenge handling!");
            },
            /* jshint unused:true */

            /** PrivateFunction: onFailure
             *  Protocol informs mechanism implementation about SASL failure.
             */
            onFailure: function () {
                this._connection = null;
            },

            /** PrivateFunction: onSuccess
             *  Protocol informs mechanism implementation about SASL success.
             */
            onSuccess: function () {
                this._connection = null;
            }
        };

        /** Constants: SASL mechanisms
         *  Available authentication mechanisms
         *
         *  Strophe.SASLAnonymous - SASL ANONYMOUS authentication.
         *  Strophe.SASLPlain - SASL PLAIN authentication.
         *  Strophe.SASLMD5 - SASL DIGEST-MD5 authentication
         *  Strophe.SASLSHA1 - SASL SCRAM-SHA1 authentication
         *  Strophe.SASLOAuthBearer - SASL OAuth Bearer authentication
         *  Strophe.SASLExternal - SASL EXTERNAL authentication
         */

// Building SASL callbacks

        /** PrivateConstructor: SASLAnonymous
         *  SASL ANONYMOUS authentication.
         */
        Strophe.SASLAnonymous = function () {
        };

        Strophe.SASLAnonymous.prototype = new Strophe.SASLMechanism("ANONYMOUS", false, 10);

        Strophe.SASLAnonymous.prototype.test = function (connection) {
            return connection.authcid === null;
        };

        Strophe.Connection.prototype.mechanisms[Strophe.SASLAnonymous.prototype.name] = Strophe.SASLAnonymous;

        /** PrivateConstructor: SASLPlain
         *  SASL PLAIN authentication.
         */
        Strophe.SASLPlain = function () {
        };

        Strophe.SASLPlain.prototype = new Strophe.SASLMechanism("PLAIN", true, 20);

        Strophe.SASLPlain.prototype.test = function (connection) {
            return connection.authcid !== null;
        };

        Strophe.SASLPlain.prototype.onChallenge = function (connection) {
            var auth_str = connection.authzid;
            auth_str = auth_str + "\u0000";
            auth_str = auth_str + connection.authcid;
            auth_str = auth_str + "\u0000";
            auth_str = auth_str + connection.pass;
            return utils.utf16to8(auth_str);
        };

        Strophe.Connection.prototype.mechanisms[Strophe.SASLPlain.prototype.name] = Strophe.SASLPlain;

        /** PrivateConstructor: SASLSHA1
         *  SASL SCRAM SHA 1 authentication.
         */
        Strophe.SASLSHA1 = function () {
        };

        Strophe.SASLSHA1.prototype = new Strophe.SASLMechanism("SCRAM-SHA-1", true, 40);

        Strophe.SASLSHA1.prototype.test = function (connection) {
            return connection.authcid !== null;
        };

        Strophe.SASLSHA1.prototype.onChallenge = function (connection, challenge, test_cnonce) {
            var cnonce = test_cnonce || MD5.hexdigest(Math.random() * 1234567890);
            var auth_str = "n=" + utils.utf16to8(connection.authcid);
            auth_str += ",r=";
            auth_str += cnonce;

            connection._sasl_data.cnonce = cnonce;
            connection._sasl_data["client-first-message-bare"] = auth_str;

            auth_str = "n,," + auth_str;

            this.onChallenge = function (connection, challenge) {
                var nonce, salt, iter, Hi, U, U_old, i, k, pass;
                var clientKey, serverKey, clientSignature;
                var responseText = "c=biws,";
                var authMessage = connection._sasl_data["client-first-message-bare"] + "," +
                    challenge + ",";
                var cnonce = connection._sasl_data.cnonce;
                var attribMatch = /([a-z]+)=([^,]+)(,|$)/;

                while (challenge.match(attribMatch)) {
                    var matches = challenge.match(attribMatch);
                    challenge = challenge.replace(matches[0], "");
                    switch (matches[1]) {
                        case "r":
                            nonce = matches[2];
                            break;
                        case "s":
                            salt = matches[2];
                            break;
                        case "i":
                            iter = matches[2];
                            break;
                    }
                }

                if (nonce.substr(0, cnonce.length) !== cnonce) {
                    connection._sasl_data = {};
                    return connection._sasl_failure_cb();
                }

                responseText += "r=" + nonce;
                authMessage += responseText;

                salt = Base64.decode(salt);
                salt += "\x00\x00\x00\x01";

                pass = utils.utf16to8(connection.pass);
                Hi = U_old = SHA1.core_hmac_sha1(pass, salt);
                for (i = 1; i < iter; i++) {
                    U = SHA1.core_hmac_sha1(pass, SHA1.binb2str(U_old));
                    for (k = 0; k < 5; k++) {
                        Hi[k] ^= U[k];
                    }
                    U_old = U;
                }
                Hi = SHA1.binb2str(Hi);

                clientKey = SHA1.core_hmac_sha1(Hi, "Client Key");
                serverKey = SHA1.str_hmac_sha1(Hi, "Server Key");
                clientSignature = SHA1.core_hmac_sha1(SHA1.str_sha1(SHA1.binb2str(clientKey)), authMessage);
                connection._sasl_data["server-signature"] = SHA1.b64_hmac_sha1(serverKey, authMessage);

                for (k = 0; k < 5; k++) {
                    clientKey[k] ^= clientSignature[k];
                }

                responseText += ",p=" + Base64.encode(SHA1.binb2str(clientKey));
                return responseText;
            }.bind(this);

            return auth_str;
        };

        Strophe.Connection.prototype.mechanisms[Strophe.SASLSHA1.prototype.name] = Strophe.SASLSHA1;

        /** PrivateConstructor: SASLMD5
         *  SASL DIGEST MD5 authentication.
         */
        Strophe.SASLMD5 = function () {
        };

        Strophe.SASLMD5.prototype = new Strophe.SASLMechanism("DIGEST-MD5", false, 30);

        Strophe.SASLMD5.prototype.test = function (connection) {
            return connection.authcid !== null;
        };

        /** PrivateFunction: _quote
         *  _Private_ utility function to backslash escape and quote strings.
         *
         *  Parameters:
         *    (String) str - The string to be quoted.
         *
         *  Returns:
         *    quoted string
         */
        Strophe.SASLMD5.prototype._quote = function (str) {
            return '"' + str.replace(/\\/g, "\\\\").replace(/"/g, '\\"') + '"';
            //" end string workaround for emacs
        };


        Strophe.SASLMD5.prototype.onChallenge = function (connection, challenge, test_cnonce) {
            var attribMatch = /([a-z]+)=("[^"]+"|[^,"]+)(?:,|$)/;
            var cnonce = test_cnonce || MD5.hexdigest("" + (Math.random() * 1234567890));
            var realm = "";
            var host = null;
            var nonce = "";
            var qop = "";
            var matches;

            while (challenge.match(attribMatch)) {
                matches = challenge.match(attribMatch);
                challenge = challenge.replace(matches[0], "");
                matches[2] = matches[2].replace(/^"(.+)"$/, "$1");
                switch (matches[1]) {
                    case "realm":
                        realm = matches[2];
                        break;
                    case "nonce":
                        nonce = matches[2];
                        break;
                    case "qop":
                        qop = matches[2];
                        break;
                    case "host":
                        host = matches[2];
                        break;
                }
            }

            var digest_uri = connection.servtype + "/" + connection.domain;
            if (host !== null) {
                digest_uri = digest_uri + "/" + host;
            }

            var cred = utils.utf16to8(connection.authcid + ":" + realm + ":" + this._connection.pass);
            var A1 = MD5.hash(cred) + ":" + nonce + ":" + cnonce;
            var A2 = 'AUTHENTICATE:' + digest_uri;

            var responseText = "";
            responseText += 'charset=utf-8,';
            responseText += 'username=' + this._quote(utils.utf16to8(connection.authcid)) + ',';
            responseText += 'realm=' + this._quote(realm) + ',';
            responseText += 'nonce=' + this._quote(nonce) + ',';
            responseText += 'nc=00000001,';
            responseText += 'cnonce=' + this._quote(cnonce) + ',';
            responseText += 'digest-uri=' + this._quote(digest_uri) + ',';
            responseText += 'response=' + MD5.hexdigest(MD5.hexdigest(A1) + ":" +
                    nonce + ":00000001:" +
                    cnonce + ":auth:" +
                    MD5.hexdigest(A2)) + ",";
            responseText += 'qop=auth';

            this.onChallenge = function () {
                return "";
            };

            return responseText;
        };

        Strophe.Connection.prototype.mechanisms[Strophe.SASLMD5.prototype.name] = Strophe.SASLMD5;

        /** PrivateConstructor: SASLOAuthBearer
         *  SASL OAuth Bearer authentication.
         */
        Strophe.SASLOAuthBearer = function () {
        };

        Strophe.SASLOAuthBearer.prototype = new Strophe.SASLMechanism("OAUTHBEARER", true, 50);

        Strophe.SASLOAuthBearer.prototype.test = function (connection) {
            return connection.authcid !== null;
        };

        Strophe.SASLOAuthBearer.prototype.onChallenge = function (connection) {
            var auth_str = 'n,a=';
            auth_str = auth_str + connection.authzid;
            auth_str = auth_str + ',';
            auth_str = auth_str + "\u0001";
            auth_str = auth_str + 'auth=Bearer ';
            auth_str = auth_str + connection.pass;
            auth_str = auth_str + "\u0001";
            auth_str = auth_str + "\u0001";
            return utils.utf16to8(auth_str);
        };

        Strophe.Connection.prototype.mechanisms[Strophe.SASLOAuthBearer.prototype.name] = Strophe.SASLOAuthBearer;


        /** PrivateConstructor: SASLExternal
         *  SASL EXTERNAL authentication.
         *
         *  The EXTERNAL mechanism allows a client to request the server to use
         *  credentials established by means external to the mechanism to
         *  authenticate the client. The external means may be, for instance,
         *  TLS services.
         */
        Strophe.SASLExternal = function () {
        };
        Strophe.SASLExternal.prototype = new Strophe.SASLMechanism("EXTERNAL", true, 60);

        Strophe.SASLExternal.prototype.onChallenge = function (connection) {
            /** According to XEP-178, an authzid SHOULD NOT be presented when the
             * authcid contained or implied in the client certificate is the JID (i.e.
             * authzid) with which the user wants to log in as.
             *
             * To NOT send the authzid, the user should therefore set the authcid equal
             * to the JID when instantiating a new Strophe.Connection object.
             */
            return connection.authcid === connection.authzid ? '' : connection.authzid;
        };

        Strophe.Connection.prototype.mechanisms[Strophe.SASLExternal.prototype.name] = Strophe.SASLExternal;

        return {
            Strophe: Strophe,
            $build: $build,
            $msg: $msg,
            $iq: $iq,
            $pres: $pres,
            SHA1: SHA1,
            Base64: Base64,
            MD5: MD5,
        };
    }));

    /*
     This program is distributed under the terms of the MIT license.
     Please see the LICENSE file for details.

     Copyright 2006-2008, OGG, LLC
     */

    /* jshint undef: true, unused: true:, noarg: true, latedef: true */
    /* global define, window, setTimeout, clearTimeout, XMLHttpRequest, ActiveXObject, Strophe, $build */

    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define('strophe-bosh', ['strophe-core'], function (core) {
                return factory(
                    core.Strophe,
                    core.$build
                );
            });
        } else {
            // Browser globals
            return factory(Strophe, $build);
        }
    }(this, function (Strophe, $build) {

        /** PrivateClass: Strophe.Request
         *  _Private_ helper class that provides a cross implementation abstraction
         *  for a BOSH related XMLHttpRequest.
         *
         *  The Strophe.Request class is used internally to encapsulate BOSH request
         *  information.  It is not meant to be used from user's code.
         */

        /** PrivateConstructor: Strophe.Request
         *  Create and initialize a new Strophe.Request object.
         *
         *  Parameters:
         *    (XMLElement) elem - The XML data to be sent in the request.
         *    (Function) func - The function that will be called when the
         *      XMLHttpRequest readyState changes.
         *    (Integer) rid - The BOSH rid attribute associated with this request.
         *    (Integer) sends - The number of times this same request has been
         *      sent.
         */
        Strophe.Request = function (elem, func, rid, sends) {
            this.id = ++Strophe._requestId;
            this.xmlData = elem;
            this.data = Strophe.serialize(elem);
            // save original function in case we need to make a new request
            // from this one.
            this.origFunc = func;
            this.func = func;
            this.rid = rid;
            this.date = NaN;
            this.sends = sends || 0;
            this.abort = false;
            this.dead = null;

            this.age = function () {
                if (!this.date) {
                    return 0;
                }
                var now = new Date();
                return (now - this.date) / 1000;
            };
            this.timeDead = function () {
                if (!this.dead) {
                    return 0;
                }
                var now = new Date();
                return (now - this.dead) / 1000;
            };
            this.xhr = this._newXHR();
        };

        Strophe.Request.prototype = {
            /** PrivateFunction: getResponse
             *  Get a response from the underlying XMLHttpRequest.
             *
             *  This function attempts to get a response from the request and checks
             *  for errors.
             *
             *  Throws:
             *    "parsererror" - A parser error occured.
             *    "badformat" - The entity has sent XML that cannot be processed.
             *
             *  Returns:
             *    The DOM element tree of the response.
             */
            getResponse: function () {
                var node = null;
                if (this.xhr.responseXML && this.xhr.responseXML.documentElement) {
                    node = this.xhr.responseXML.documentElement;
                    if (node.tagName == "parsererror") {
                        Strophe.error("invalid response received");
                        Strophe.error("responseText: " + this.xhr.responseText);
                        Strophe.error("responseXML: " +
                            Strophe.serialize(this.xhr.responseXML));
                        throw "parsererror";
                    }
                } else if (this.xhr.responseText) {
                    Strophe.error("invalid response received");
                    Strophe.error("responseText: " + this.xhr.responseText);
                    throw "badformat";
                }

                return node;
            },

            /** PrivateFunction: _newXHR
             *  _Private_ helper function to create XMLHttpRequests.
             *
             *  This function creates XMLHttpRequests across all implementations.
             *
             *  Returns:
             *    A new XMLHttpRequest.
             */
            _newXHR: function () {
                var xhr = null;
                if (window.XMLHttpRequest) {
                    xhr = new XMLHttpRequest();
                    if (xhr.overrideMimeType) {
                        xhr.overrideMimeType("text/xml; charset=utf-8");
                    }
                } else if (window.ActiveXObject) {
                    xhr = new ActiveXObject("Microsoft.XMLHTTP");
                }
                // use Function.bind() to prepend ourselves as an argument
                xhr.onreadystatechange = this.func.bind(null, this);
                return xhr;
            }
        };

        /** Class: Strophe.Bosh
         *  _Private_ helper class that handles BOSH Connections
         *
         *  The Strophe.Bosh class is used internally by Strophe.Connection
         *  to encapsulate BOSH sessions. It is not meant to be used from user's code.
         */

        /** File: bosh.js
         *  A JavaScript library to enable BOSH in Strophejs.
         *
         *  this library uses Bidirectional-streams Over Synchronous HTTP (BOSH)
         *  to emulate a persistent, stateful, two-way connection to an XMPP server.
         *  More information on BOSH can be found in XEP 124.
         */

        /** PrivateConstructor: Strophe.Bosh
         *  Create and initialize a Strophe.Bosh object.
         *
         *  Parameters:
         *    (Strophe.Connection) connection - The Strophe.Connection that will use BOSH.
         *
         *  Returns:
         *    A new Strophe.Bosh object.
         */
        Strophe.Bosh = function (connection) {
            this._conn = connection;
            /* request id for body tags */
            this.rid = Math.floor(Math.random() * 4294967295);
            /* The current session ID. */
            this.sid = null;

            // default BOSH values
            this.hold = 1;
            this.wait = 60;
            this.window = 5;
            this.errors = 0;

            this._requests = [];
        };

        Strophe.Bosh.prototype = {
            /** Variable: strip
             *
             *  BOSH-Connections will have all stanzas wrapped in a <body> tag when
             *  passed to <Strophe.Connection.xmlInput> or <Strophe.Connection.xmlOutput>.
             *  To strip this tag, User code can set <Strophe.Bosh.strip> to "body":
             *
             *  > Strophe.Bosh.prototype.strip = "body";
             *
             *  This will enable stripping of the body tag in both
             *  <Strophe.Connection.xmlInput> and <Strophe.Connection.xmlOutput>.
             */
            strip: null,

            /** PrivateFunction: _buildBody
             *  _Private_ helper function to generate the <body/> wrapper for BOSH.
             *
             *  Returns:
             *    A Strophe.Builder with a <body/> element.
             */
            _buildBody: function () {
                var bodyWrap = $build('body', {
                    rid: this.rid++,
                    xmlns: Strophe.NS.HTTPBIND
                });
                if (this.sid !== null) {
                    bodyWrap.attrs({sid: this.sid});
                }
                if (this._conn.options.keepalive && this._conn._sessionCachingSupported()) {
                    this._cacheSession();
                }
                return bodyWrap;
            },

            /** PrivateFunction: _reset
             *  Reset the connection.
             *
             *  This function is called by the reset function of the Strophe Connection
             */
            _reset: function () {
                this.rid = Math.floor(Math.random() * 4294967295);
                this.sid = null;
                this.errors = 0;
                if (this._conn._sessionCachingSupported()) {
                    window.sessionStorage.removeItem('strophe-bosh-session');
                }

                this._conn.nextValidRid(this.rid);
            },

            /** PrivateFunction: _connect
             *  _Private_ function that initializes the BOSH connection.
             *
             *  Creates and sends the Request that initializes the BOSH connection.
             */
            _connect: function (wait, hold, route) {
                this.wait = wait || this.wait;
                this.hold = hold || this.hold;
                this.errors = 0;

                // build the body tag
                var body = this._buildBody().attrs({
                    to: this._conn.domain,
                    "xml:lang": "en",
                    wait: this.wait,
                    hold: this.hold,
                    content: "text/xml; charset=utf-8",
                    ver: "1.6",
                    "xmpp:version": "1.0",
                    "xmlns:xmpp": Strophe.NS.BOSH
                });

                if (route) {
                    body.attrs({
                        route: route
                    });
                }

                var _connect_cb = this._conn._connect_cb;

                this._requests.push(
                    new Strophe.Request(body.tree(),
                        this._onRequestStateChange.bind(
                            this, _connect_cb.bind(this._conn)),
                        body.tree().getAttribute("rid")));
                this._throttledRequestHandler();
            },

            /** PrivateFunction: _attach
             *  Attach to an already created and authenticated BOSH session.
             *
             *  This function is provided to allow Strophe to attach to BOSH
             *  sessions which have been created externally, perhaps by a Web
             *  application.  This is often used to support auto-login type features
             *  without putting user credentials into the page.
             *
             *  Parameters:
             *    (String) jid - The full JID that is bound by the session.
             *    (String) sid - The SID of the BOSH session.
             *    (String) rid - The current RID of the BOSH session.  This RID
             *      will be used by the next request.
             *    (Function) callback The connect callback function.
             *    (Integer) wait - The optional HTTPBIND wait value.  This is the
             *      time the server will wait before returning an empty result for
             *      a request.  The default setting of 60 seconds is recommended.
             *      Other settings will require tweaks to the Strophe.TIMEOUT value.
             *    (Integer) hold - The optional HTTPBIND hold value.  This is the
             *      number of connections the server will hold at one time.  This
             *      should almost always be set to 1 (the default).
             *    (Integer) wind - The optional HTTBIND window value.  This is the
             *      allowed range of request ids that are valid.  The default is 5.
             */
            _attach: function (jid, sid, rid, callback, wait, hold, wind) {
                this._conn.jid = jid;
                this.sid = sid;
                this.rid = rid;

                this._conn.connect_callback = callback;

                this._conn.domain = Strophe.getDomainFromJid(this._conn.jid);

                this._conn.authenticated = true;
                this._conn.connected = true;

                this.wait = wait || this.wait;
                this.hold = hold || this.hold;
                this.window = wind || this.window;

                this._conn._changeConnectStatus(Strophe.Status.ATTACHED, null);
            },

            /** PrivateFunction: _restore
             *  Attempt to restore a cached BOSH session
             *
             *  Parameters:
             *    (String) jid - The full JID that is bound by the session.
             *      This parameter is optional but recommended, specifically in cases
             *      where prebinded BOSH sessions are used where it's important to know
             *      that the right session is being restored.
             *    (Function) callback The connect callback function.
             *    (Integer) wait - The optional HTTPBIND wait value.  This is the
             *      time the server will wait before returning an empty result for
             *      a request.  The default setting of 60 seconds is recommended.
             *      Other settings will require tweaks to the Strophe.TIMEOUT value.
             *    (Integer) hold - The optional HTTPBIND hold value.  This is the
             *      number of connections the server will hold at one time.  This
             *      should almost always be set to 1 (the default).
             *    (Integer) wind - The optional HTTBIND window value.  This is the
             *      allowed range of request ids that are valid.  The default is 5.
             */
            _restore: function (jid, callback, wait, hold, wind) {
                var session = JSON.parse(window.sessionStorage.getItem('strophe-bosh-session'));
                if (typeof session !== "undefined" &&
                    session !== null &&
                    session.rid &&
                    session.sid &&
                    session.jid &&
                    (typeof jid === "undefined" || jid === null || Strophe.getBareJidFromJid(session.jid) == Strophe.getBareJidFromJid(jid))) {
                    this._conn.restored = true;
                    this._attach(session.jid, session.sid, session.rid, callback, wait, hold, wind);
                } else {
                    throw {name: "StropheSessionError", message: "_restore: no restoreable session."};
                }
            },

            /** PrivateFunction: _cacheSession
             *  _Private_ handler for the beforeunload event.
             *
             *  This handler is used to process the Bosh-part of the initial request.
             *  Parameters:
             *    (Strophe.Request) bodyWrap - The received stanza.
             */
            _cacheSession: function () {
                if (this._conn.authenticated) {
                    if (this._conn.jid && this.rid && this.sid) {
                        window.sessionStorage.setItem('strophe-bosh-session', JSON.stringify({
                            'jid': this._conn.jid,
                            'rid': this.rid,
                            'sid': this.sid
                        }));
                    }
                } else {
                    window.sessionStorage.removeItem('strophe-bosh-session');
                }
            },

            /** PrivateFunction: _connect_cb
             *  _Private_ handler for initial connection request.
             *
             *  This handler is used to process the Bosh-part of the initial request.
             *  Parameters:
             *    (Strophe.Request) bodyWrap - The received stanza.
             */
            _connect_cb: function (bodyWrap) {
                var typ = bodyWrap.getAttribute("type");
                var cond, conflict;
                if (typ !== null && typ == "terminate") {
                    // an error occurred
                    cond = bodyWrap.getAttribute("condition");
                    Strophe.error("BOSH-Connection failed: " + cond);
                    conflict = bodyWrap.getElementsByTagName("conflict");
                    if (cond !== null) {
                        if (cond == "remote-stream-error" && conflict.length > 0) {
                            cond = "conflict";
                        }
                        this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, cond);
                    } else {
                        this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "unknown");
                    }
                    this._conn._doDisconnect(cond);
                    return Strophe.Status.CONNFAIL;
                }

                // check to make sure we don't overwrite these if _connect_cb is
                // called multiple times in the case of missing stream:features
                if (!this.sid) {
                    this.sid = bodyWrap.getAttribute("sid");
                }
                var wind = bodyWrap.getAttribute('requests');
                if (wind) {
                    this.window = parseInt(wind, 10);
                }
                var hold = bodyWrap.getAttribute('hold');
                if (hold) {
                    this.hold = parseInt(hold, 10);
                }
                var wait = bodyWrap.getAttribute('wait');
                if (wait) {
                    this.wait = parseInt(wait, 10);
                }
            },

            /** PrivateFunction: _disconnect
             *  _Private_ part of Connection.disconnect for Bosh
             *
             *  Parameters:
             *    (Request) pres - This stanza will be sent before disconnecting.
             */
            _disconnect: function (pres) {
                this._sendTerminate(pres);
            },

            /** PrivateFunction: _doDisconnect
             *  _Private_ function to disconnect.
             *
             *  Resets the SID and RID.
             */
            _doDisconnect: function () {
                this.sid = null;
                this.rid = Math.floor(Math.random() * 4294967295);
                if (this._conn._sessionCachingSupported()) {
                    window.sessionStorage.removeItem('strophe-bosh-session');
                }

                this._conn.nextValidRid(this.rid);
            },

            /** PrivateFunction: _emptyQueue
             * _Private_ function to check if the Request queue is empty.
             *
             *  Returns:
             *    True, if there are no Requests queued, False otherwise.
             */
            _emptyQueue: function () {
                return this._requests.length === 0;
            },

            /** PrivateFunction: _hitError
             *  _Private_ function to handle the error count.
             *
             *  Requests are resent automatically until their error count reaches
             *  5.  Each time an error is encountered, this function is called to
             *  increment the count and disconnect if the count is too high.
             *
             *  Parameters:
             *    (Integer) reqStatus - The request status.
             */
            _hitError: function (reqStatus) {
                this.errors++;
                Strophe.warn("request errored, status: " + reqStatus +
                    ", number of errors: " + this.errors);
                if (this.errors > 4) {
                    this._conn._onDisconnectTimeout();
                }
            },

            /** PrivateFunction: _no_auth_received
             *
             * Called on stream start/restart when no stream:features
             * has been received and sends a blank poll request.
             */
            _no_auth_received: function (_callback) {
                if (_callback) {
                    _callback = _callback.bind(this._conn);
                } else {
                    _callback = this._conn._connect_cb.bind(this._conn);
                }
                var body = this._buildBody();
                this._requests.push(
                    new Strophe.Request(body.tree(),
                        this._onRequestStateChange.bind(
                            this, _callback.bind(this._conn)),
                        body.tree().getAttribute("rid")));
                this._throttledRequestHandler();
            },

            /** PrivateFunction: _onDisconnectTimeout
             *  _Private_ timeout handler for handling non-graceful disconnection.
             *
             *  Cancels all remaining Requests and clears the queue.
             */
            _onDisconnectTimeout: function () {
                this._abortAllRequests();
            },

            /** PrivateFunction: _abortAllRequests
             *  _Private_ helper function that makes sure all pending requests are aborted.
             */
            _abortAllRequests: function _abortAllRequests() {
                var req;
                while (this._requests.length > 0) {
                    req = this._requests.pop();
                    req.abort = true;
                    req.xhr.abort();
                    // jslint complains, but this is fine. setting to empty func
                    // is necessary for IE6
                    req.xhr.onreadystatechange = function () {
                    }; // jshint ignore:line
                }
            },

            /** PrivateFunction: _onIdle
             *  _Private_ handler called by Strophe.Connection._onIdle
             *
             *  Sends all queued Requests or polls with empty Request if there are none.
             */
            _onIdle: function () {
                var data = this._conn._data;

                // if no requests are in progress, poll
                if (this._conn.authenticated && this._requests.length === 0 &&
                    data.length === 0 && !this._conn.disconnecting) {
                    Strophe.info("no requests during idle cycle, sending " +
                        "blank request");
                    data.push(null);
                }

                if (this._conn.paused) {
                    return;
                }

                if (this._requests.length < 2 && data.length > 0) {
                    var body = this._buildBody();
                    for (var i = 0; i < data.length; i++) {
                        if (data[i] !== null) {
                            if (data[i] === "restart") {
                                body.attrs({
                                    to: this._conn.domain,
                                    "xml:lang": "en",
                                    "xmpp:restart": "true",
                                    "xmlns:xmpp": Strophe.NS.BOSH
                                });
                            } else {
                                body.cnode(data[i]).up();
                            }
                        }
                    }
                    delete this._conn._data;
                    this._conn._data = [];
                    this._requests.push(
                        new Strophe.Request(body.tree(),
                            this._onRequestStateChange.bind(
                                this, this._conn._dataRecv.bind(this._conn)),
                            body.tree().getAttribute("rid")));
                    this._throttledRequestHandler();
                }

                if (this._requests.length > 0) {
                    var time_elapsed = this._requests[0].age();
                    if (this._requests[0].dead !== null) {
                        if (this._requests[0].timeDead() >
                            Math.floor(Strophe.SECONDARY_TIMEOUT * this.wait)) {
                            this._throttledRequestHandler();
                        }
                    }

                    if (time_elapsed > Math.floor(Strophe.TIMEOUT * this.wait)) {
                        Strophe.warn("Request " +
                            this._requests[0].id +
                            " timed out, over " + Math.floor(Strophe.TIMEOUT * this.wait) +
                            " seconds since last activity");
                        this._throttledRequestHandler();
                    }
                }
            },

            /** PrivateFunction: _onRequestStateChange
             *  _Private_ handler for Strophe.Request state changes.
             *
             *  This function is called when the XMLHttpRequest readyState changes.
             *  It contains a lot of error handling logic for the many ways that
             *  requests can fail, and calls the request callback when requests
             *  succeed.
             *
             *  Parameters:
             *    (Function) func - The handler for the request.
             *    (Strophe.Request) req - The request that is changing readyState.
             */
            _onRequestStateChange: function (func, req) {
                Strophe.debug("request id " + req.id +
                    "." + req.sends + " state changed to " +
                    req.xhr.readyState);

                if (req.abort) {
                    req.abort = false;
                    return;
                }

                // request complete
                var reqStatus;
                if (req.xhr.readyState == 4) {
                    reqStatus = 0;
                    try {
                        reqStatus = req.xhr.status;
                    } catch (e) {
                        // ignore errors from undefined status attribute.  works
                        // around a browser bug
                    }

                    if (typeof(reqStatus) == "undefined") {
                        reqStatus = 0;
                    }

                    if (this.disconnecting) {
                        if (reqStatus >= 400) {
                            this._hitError(reqStatus);
                            return;
                        }
                    }

                    var reqIs0 = (this._requests[0] == req);
                    var reqIs1 = (this._requests[1] == req);

                    if ((reqStatus > 0 && reqStatus < 500) || req.sends > 5) {
                        // remove from internal queue
                        this._removeRequest(req);
                        Strophe.debug("request id " +
                            req.id +
                            " should now be removed");
                    }

                    // request succeeded
                    if (reqStatus == 200) {
                        // if request 1 finished, or request 0 finished and request
                        // 1 is over Strophe.SECONDARY_TIMEOUT seconds old, we need to
                        // restart the other - both will be in the first spot, as the
                        // completed request has been removed from the queue already
                        if (reqIs1 ||
                            (reqIs0 && this._requests.length > 0 &&
                            this._requests[0].age() > Math.floor(Strophe.SECONDARY_TIMEOUT * this.wait))) {
                            this._restartRequest(0);
                        }

                        this._conn.nextValidRid(Number(req.rid) + 1);

                        // call handler
                        Strophe.debug("request id " +
                            req.id + "." +
                            req.sends + " got 200");
                        func(req);
                        this.errors = 0;
                    } else {
                        Strophe.error("request id " +
                            req.id + "." +
                            req.sends + " error " + reqStatus +
                            " happened");
                        if (reqStatus === 0 ||
                            (reqStatus >= 400 && reqStatus < 600) ||
                            reqStatus >= 12000) {
                            this._hitError(reqStatus);
                            if (reqStatus >= 400 && reqStatus < 500) {
                                this._conn._changeConnectStatus(Strophe.Status.DISCONNECTING, null);
                                this._conn._doDisconnect();
                            }
                        }
                    }

                    if (!((reqStatus > 0 && reqStatus < 500) ||
                        req.sends > 5)) {
                        this._throttledRequestHandler();
                    }
                }
            },

            /** PrivateFunction: _processRequest
             *  _Private_ function to process a request in the queue.
             *
             *  This function takes requests off the queue and sends them and
             *  restarts dead requests.
             *
             *  Parameters:
             *    (Integer) i - The index of the request in the queue.
             */
            _processRequest: function (i) {
                var self = this;
                var req = this._requests[i];
                var reqStatus = -1;

                try {
                    if (req.xhr.readyState == 4) {
                        reqStatus = req.xhr.status;
                    }
                } catch (e) {
                    Strophe.error("caught an error in _requests[" + i +
                        "], reqStatus: " + reqStatus);
                }

                if (typeof(reqStatus) == "undefined") {
                    reqStatus = -1;
                }

                // make sure we limit the number of retries
                if (req.sends > this._conn.maxRetries) {
                    this._conn._onDisconnectTimeout();
                    return;
                }

                var time_elapsed = req.age();
                var primaryTimeout = (!isNaN(time_elapsed) &&
                time_elapsed > Math.floor(Strophe.TIMEOUT * this.wait));
                var secondaryTimeout = (req.dead !== null &&
                req.timeDead() > Math.floor(Strophe.SECONDARY_TIMEOUT * this.wait));
                var requestCompletedWithServerError = (req.xhr.readyState == 4 &&
                (reqStatus < 1 ||
                reqStatus >= 500));
                if (primaryTimeout || secondaryTimeout ||
                    requestCompletedWithServerError) {
                    if (secondaryTimeout) {
                        Strophe.error("Request " +
                            this._requests[i].id +
                            " timed out (secondary), restarting");
                    }
                    req.abort = true;
                    req.xhr.abort();
                    // setting to null fails on IE6, so set to empty function
                    req.xhr.onreadystatechange = function () {
                    };
                    this._requests[i] = new Strophe.Request(req.xmlData,
                        req.origFunc,
                        req.rid,
                        req.sends);
                    req = this._requests[i];
                }

                if (req.xhr.readyState === 0) {
                    Strophe.debug("request id " + req.id +
                        "." + req.sends + " posting");

                    try {
                        var contentType = this._conn.options.contentType || "text/xml; charset=utf-8";
                        req.xhr.open("POST", this._conn.service, this._conn.options.sync ? false : true);
                        req.xhr.setRequestHeader && req.xhr.setRequestHeader("Content-Type", contentType);
                        if (this._conn.options.withCredentials) {
                            req.xhr.withCredentials = true;
                        }
                    } catch (e2) {
                        Strophe.error("XHR open failed.");
                        if (!this._conn.connected) {
                            this._conn._changeConnectStatus(Strophe.Status.CONNFAIL,
                                "bad-service");
                        }
                        this._conn.disconnect();
                        return;
                    }

                    // Fires the XHR request -- may be invoked immediately
                    // or on a gradually expanding retry window for reconnects
                    var self = this
                    var sendFunc = function () {
                        req.date = new Date();
                        if (self._conn.options.customHeaders) {
                            var headers = self._conn.options.customHeaders;
                            for (var header in headers) {
                                if (headers.hasOwnProperty(header)) {
                                    req.xhr.setRequestHeader(header, headers[header]);
                                }
                            }
                        }
                        // fix: ie8 req state error
                        window.XDomainRequest && (req.xhr.readyState = 2)
                        req.xhr.send(req.data);
                    };

                    // Implement progressive backoff for reconnects --
                    // First retry (send == 1) should also be instantaneous
                    if (req.sends > 1) {
                        // Using a cube of the retry number creates a nicely
                        // expanding retry window
                        var backoff = Math.min(Math.floor(Strophe.TIMEOUT * this.wait),
                                Math.pow(req.sends, 3)) * 1000;

                        // XXX: setTimeout should be called only with function expressions (23974bc1)
                        setTimeout(function () {
                            sendFunc();
                        }, backoff);
                    } else {
                        sendFunc();
                    }

                    req.sends++;

                    if (this._conn.xmlOutput !== Strophe.Connection.prototype.xmlOutput) {
                        if (req.xmlData.nodeName === this.strip && req.xmlData.childNodes.length) {
                            this._conn.xmlOutput(req.xmlData.childNodes[0]);
                        } else {
                            this._conn.xmlOutput(req.xmlData);
                        }
                    }
                    if (this._conn.rawOutput !== Strophe.Connection.prototype.rawOutput) {
                        this._conn.rawOutput(req.data);
                    }
                } else {
                    Strophe.debug("_processRequest: " +
                        (i === 0 ? "first" : "second") +
                        " request has readyState of " +
                        req.xhr.readyState);
                }
            },

            /** PrivateFunction: _removeRequest
             *  _Private_ function to remove a request from the queue.
             *
             *  Parameters:
             *    (Strophe.Request) req - The request to remove.
             */
            _removeRequest: function (req) {
                Strophe.debug("removing request");

                var i;
                for (i = this._requests.length - 1; i >= 0; i--) {
                    if (req == this._requests[i]) {
                        this._requests.splice(i, 1);
                    }
                }

                // IE6 fails on setting to null, so set to empty function
                req.xhr.onreadystatechange = function () {
                };

                this._throttledRequestHandler();
            },

            /** PrivateFunction: _restartRequest
             *  _Private_ function to restart a request that is presumed dead.
             *
             *  Parameters:
             *    (Integer) i - The index of the request in the queue.
             */
            _restartRequest: function (i) {
                var req = this._requests[i];
                if (req.dead === null) {
                    req.dead = new Date();
                }

                this._processRequest(i);
            },

            /** PrivateFunction: _reqToData
             * _Private_ function to get a stanza out of a request.
             *
             * Tries to extract a stanza out of a Request Object.
             * When this fails the current connection will be disconnected.
             *
             *  Parameters:
             *    (Object) req - The Request.
             *
             *  Returns:
             *    The stanza that was passed.
             */
            _reqToData: function (req) {
                try {
                    return req.getResponse();
                } catch (e) {
                    if (e != "parsererror") {
                        throw e;
                    }
                    this._conn.disconnect("strophe-parsererror");
                }
            },

            /** PrivateFunction: _sendTerminate
             *  _Private_ function to send initial disconnect sequence.
             *
             *  This is the first step in a graceful disconnect.  It sends
             *  the BOSH server a terminate body and includes an unavailable
             *  presence if authentication has completed.
             */
            _sendTerminate: function (pres) {
                Strophe.info("_sendTerminate was called");
                var body = this._buildBody().attrs({type: "terminate"});

                if (pres) {
                    body.cnode(pres.tree());
                }

                var req = new Strophe.Request(body.tree(),
                    this._onRequestStateChange.bind(
                        this, this._conn._dataRecv.bind(this._conn)),
                    body.tree().getAttribute("rid"));

                this._requests.push(req);
                this._throttledRequestHandler();
            },

            /** PrivateFunction: _send
             *  _Private_ part of the Connection.send function for BOSH
             *
             * Just triggers the RequestHandler to send the messages that are in the queue
             */
            _send: function () {
                clearTimeout(this._conn._idleTimeout);
                this._throttledRequestHandler();

                // XXX: setTimeout should be called only with function expressions (23974bc1)
                this._conn._idleTimeout = setTimeout(function () {
                    this._onIdle();
                }.bind(this._conn), 100);
            },

            /** PrivateFunction: _sendRestart
             *
             *  Send an xmpp:restart stanza.
             */
            _sendRestart: function () {
                this._throttledRequestHandler();
                clearTimeout(this._conn._idleTimeout);
            },

            /** PrivateFunction: _throttledRequestHandler
             *  _Private_ function to throttle requests to the connection window.
             *
             *  This function makes sure we don't send requests so fast that the
             *  request ids overflow the connection window in the case that one
             *  request died.
             */
            _throttledRequestHandler: function () {
                if (!this._requests) {
                    Strophe.debug("_throttledRequestHandler called with " +
                        "undefined requests");
                } else {
                    Strophe.debug("_throttledRequestHandler called with " +
                        this._requests.length + " requests");
                }

                if (!this._requests || this._requests.length === 0) {
                    return;
                }

                if (this._requests.length > 0) {
                    this._processRequest(0);
                }

                if (this._requests.length > 1 &&
                    Math.abs(this._requests[0].rid -
                        this._requests[1].rid) < this.window) {
                    this._processRequest(1);
                }
            }
        };
        return Strophe;
    }));

    /*
     This program is distributed under the terms of the MIT license.
     Please see the LICENSE file for details.

     Copyright 2006-2008, OGG, LLC
     */

    /* jshint undef: true, unused: true:, noarg: true, latedef: true */
    /* global define, window, clearTimeout, WebSocket, DOMParser, Strophe, $build */

    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            define('strophe-websocket', ['strophe-core'], function (core) {
                return factory(
                    core.Strophe,
                    core.$build
                );
            });
        } else {
            // Browser globals
            return factory(Strophe, $build);
        }
    }(this, function (Strophe, $build) {

        /** Class: Strophe.WebSocket
         *  _Private_ helper class that handles WebSocket Connections
         *
         *  The Strophe.WebSocket class is used internally by Strophe.Connection
         *  to encapsulate WebSocket sessions. It is not meant to be used from user's code.
         */

        /** File: websocket.js
         *  A JavaScript library to enable XMPP over Websocket in Strophejs.
         *
         *  This file implements XMPP over WebSockets for Strophejs.
         *  If a Connection is established with a Websocket url (ws://...)
         *  Strophe will use WebSockets.
         *  For more information on XMPP-over-WebSocket see RFC 7395:
         *  http://tools.ietf.org/html/rfc7395
         *
         *  WebSocket support implemented by Andreas Guth (andreas.guth@rwth-aachen.de)
         */

        /** PrivateConstructor: Strophe.Websocket
         *  Create and initialize a Strophe.WebSocket object.
         *  Currently only sets the connection Object.
         *
         *  Parameters:
         *    (Strophe.Connection) connection - The Strophe.Connection that will use WebSockets.
         *
         *  Returns:
         *    A new Strophe.WebSocket object.
         */
        Strophe.Websocket = function (connection) {
            this._conn = connection;
            this.strip = "wrapper";

            var service = connection.service;
            if (service.indexOf("ws:") !== 0 && service.indexOf("wss:") !== 0) {
                // If the service is not an absolute URL, assume it is a path and put the absolute
                // URL together from options, current URL and the path.
                var new_service = "";

                if (connection.options.protocol === "ws" && window.location.protocol !== "https:") {
                    new_service += "ws";
                } else {
                    new_service += "wss";
                }

                new_service += "://" + window.location.host;

                if (service.indexOf("/") !== 0) {
                    new_service += window.location.pathname + service;
                } else {
                    new_service += service;
                }

                connection.service = new_service;
            }
        };

        Strophe.Websocket.prototype = {
            /** PrivateFunction: _buildStream
             *  _Private_ helper function to generate the <stream> start tag for WebSockets
             *
             *  Returns:
             *    A Strophe.Builder with a <stream> element.
             */
            _buildStream: function () {
                return $build("open", {
                    "xmlns": Strophe.NS.FRAMING,
                    "to": this._conn.domain,
                    "version": '1.0'
                });
            },

            /** PrivateFunction: _check_streamerror
             * _Private_ checks a message for stream:error
             *
             *  Parameters:
             *    (Strophe.Request) bodyWrap - The received stanza.
             *    connectstatus - The ConnectStatus that will be set on error.
             *  Returns:
             *     true if there was a streamerror, false otherwise.
             */
            _check_streamerror: function (bodyWrap, connectstatus) {
                var errors;
                if (bodyWrap.getElementsByTagNameNS) {
                    errors = bodyWrap.getElementsByTagNameNS(Strophe.NS.STREAM, "error");
                } else {
                    errors = bodyWrap.getElementsByTagName("stream:error");
                }
                if (errors.length === 0) {
                    return false;
                }
                var error = errors[0];

                var condition = "";
                var text = "";

                var ns = "urn:ietf:params:xml:ns:xmpp-streams";
                for (var i = 0; i < error.childNodes.length; i++) {
                    var e = error.childNodes[i];
                    if (e.getAttribute("xmlns") !== ns) {
                        break;
                    }
                    if (e.nodeName === "text") {
                        text = e.textContent;
                    } else {
                        condition = e.nodeName;
                    }
                }

                var errorString = "WebSocket stream error: ";

                if (condition) {
                    errorString += condition;
                } else {
                    errorString += "unknown";
                }

                if (text) {
                    errorString += " - " + condition;
                }

                Strophe.error(errorString);

                // close the connection on stream_error
                this._conn._changeConnectStatus(connectstatus, condition);
                this._conn._doDisconnect();
                return true;
            },

            /** PrivateFunction: _reset
             *  Reset the connection.
             *
             *  This function is called by the reset function of the Strophe Connection.
             *  Is not needed by WebSockets.
             */
            _reset: function () {
                return;
            },

            /** PrivateFunction: _connect
             *  _Private_ function called by Strophe.Connection.connect
             *
             *  Creates a WebSocket for a connection and assigns Callbacks to it.
             *  Does nothing if there already is a WebSocket.
             */
            _connect: function () {
                // Ensure that there is no open WebSocket from a previous Connection.
                this._closeSocket();

                // Create the new WobSocket
                this.socket = new WebSocket(this._conn.service, "xmpp");
                this.socket.onopen = this._onOpen.bind(this);
                this.socket.onerror = this._onError.bind(this);
                this.socket.onclose = this._onClose.bind(this);
                this.socket.onmessage = this._connect_cb_wrapper.bind(this);
            },

            /** PrivateFunction: _connect_cb
             *  _Private_ function called by Strophe.Connection._connect_cb
             *
             * checks for stream:error
             *
             *  Parameters:
             *    (Strophe.Request) bodyWrap - The received stanza.
             */
            _connect_cb: function (bodyWrap) {
                var error = this._check_streamerror(bodyWrap, Strophe.Status.CONNFAIL);
                if (error) {
                    return Strophe.Status.CONNFAIL;
                }
            },

            /** PrivateFunction: _handleStreamStart
             * _Private_ function that checks the opening <open /> tag for errors.
             *
             * Disconnects if there is an error and returns false, true otherwise.
             *
             *  Parameters:
             *    (Node) message - Stanza containing the <open /> tag.
             */
            _handleStreamStart: function (message) {
                var error = false;

                // Check for errors in the <open /> tag
                var ns = message.getAttribute("xmlns");
                if (typeof ns !== "string") {
                    error = "Missing xmlns in <open />";
                } else if (ns !== Strophe.NS.FRAMING) {
                    error = "Wrong xmlns in <open />: " + ns;
                }

                var ver = message.getAttribute("version");
                if (typeof ver !== "string") {
                    error = "Missing version in <open />";
                } else if (ver !== "1.0") {
                    error = "Wrong version in <open />: " + ver;
                }

                if (error) {
                    this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, error);
                    this._conn._doDisconnect();
                    return false;
                }

                return true;
            },

            /** PrivateFunction: _connect_cb_wrapper
             * _Private_ function that handles the first connection messages.
             *
             * On receiving an opening stream tag this callback replaces itself with the real
             * message handler. On receiving a stream error the connection is terminated.
             */
            _connect_cb_wrapper: function (message) {
                if (message.data.indexOf("<open ") === 0 || message.data.indexOf("<?xml") === 0) {

                    // Strip the XML Declaration, if there is one
                    var data = message.data.replace(/^(<\?.*?\?>\s*)*/, "");
                    if (data === '') return;

                    var streamStart = new DOMParser().parseFromString(data, "text/xml").documentElement;
                    this._conn.xmlInput(streamStart);
                    this._conn.rawInput(message.data);

                    //_handleStreamSteart will check for XML errors and disconnect on error
                    if (this._handleStreamStart(streamStart)) {
                        //_connect_cb will check for stream:error and disconnect on error
                        this._connect_cb(streamStart);
                    }
                } else if (message.data.indexOf("<close ") === 0) { //'<close xmlns="urn:ietf:params:xml:ns:xmpp-framing />') {
                    this._conn.rawInput(message.data);
                    this._conn.xmlInput(message);
                    var see_uri = message.getAttribute("see-other-uri");
                    if (see_uri) {
                        this._conn._changeConnectStatus(Strophe.Status.REDIRECT, "Received see-other-uri, resetting connection");
                        this._conn.reset();
                        this._conn.service = see_uri;
                        this._connect();
                    } else {
                        this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "Received closing stream");
                        this._conn._doDisconnect();
                    }
                } else {
                    var string = this._streamWrap(message.data);
                    var elem = new DOMParser().parseFromString(string, "text/xml").documentElement;
                    this.socket.onmessage = this._onMessage.bind(this);
                    this._conn._connect_cb(elem, null, message.data);
                }
            },

            /** PrivateFunction: _disconnect
             *  _Private_ function called by Strophe.Connection.disconnect
             *
             *  Disconnects and sends a last stanza if one is given
             *
             *  Parameters:
             *    (Request) pres - This stanza will be sent before disconnecting.
             */
            _disconnect: function (pres) {
                if (this.socket && this.socket.readyState !== WebSocket.CLOSED) {
                    if (pres) {
                        this._conn.send(pres);
                    }
                    var close = $build("close", {"xmlns": Strophe.NS.FRAMING});
                    this._conn.xmlOutput(close);
                    var closeString = Strophe.serialize(close);
                    this._conn.rawOutput(closeString);
                    try {
                        this.socket.send(closeString);
                    } catch (e) {
                        Strophe.info("Couldn't send <close /> tag.");
                    }
                }
                this._conn._doDisconnect();
            },

            /** PrivateFunction: _doDisconnect
             *  _Private_ function to disconnect.
             *
             *  Just closes the Socket for WebSockets
             */
            _doDisconnect: function () {
                Strophe.info("WebSockets _doDisconnect was called");
                this._closeSocket();
            },

            /** PrivateFunction _streamWrap
             *  _Private_ helper function to wrap a stanza in a <stream> tag.
             *  This is used so Strophe can process stanzas from WebSockets like BOSH
             */
            _streamWrap: function (stanza) {
                return "<wrapper>" + stanza + '</wrapper>';
            },


            /** PrivateFunction: _closeSocket
             *  _Private_ function to close the WebSocket.
             *
             *  Closes the socket if it is still open and deletes it
             */
            _closeSocket: function () {
                if (this.socket) {
                    try {
                        this.socket.close();
                    } catch (e) {
                    }
                }
                this.socket = null;
            },

            /** PrivateFunction: _emptyQueue
             * _Private_ function to check if the message queue is empty.
             *
             *  Returns:
             *    True, because WebSocket messages are send immediately after queueing.
             */
            _emptyQueue: function () {
                return true;
            },

            /** PrivateFunction: _onClose
             * _Private_ function to handle websockets closing.
             *
             * Nothing to do here for WebSockets
             */
            _onClose: function () {
                if (this._conn.connected && !this._conn.disconnecting) {
                    Strophe.error("Websocket closed unexpectedly");
                    this._conn._doDisconnect();
                } else {
                    Strophe.info("Websocket closed");
                }
            },

            /** PrivateFunction: _no_auth_received
             *
             * Called on stream start/restart when no stream:features
             * has been received.
             */
            _no_auth_received: function (_callback) {
                Strophe.error("Server did not send any auth methods");
                this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "Server did not send any auth methods");
                if (_callback) {
                    _callback = _callback.bind(this._conn);
                    _callback();
                }
                this._conn._doDisconnect();
            },

            /** PrivateFunction: _onDisconnectTimeout
             *  _Private_ timeout handler for handling non-graceful disconnection.
             *
             *  This does nothing for WebSockets
             */
            _onDisconnectTimeout: function () {
            },

            /** PrivateFunction: _abortAllRequests
             *  _Private_ helper function that makes sure all pending requests are aborted.
             */
            _abortAllRequests: function () {
            },

            /** PrivateFunction: _onError
             * _Private_ function to handle websockets errors.
             *
             * Parameters:
             * (Object) error - The websocket error.
             */
            _onError: function (error) {
                Strophe.error("Websocket error " + error);
                this._conn._changeConnectStatus(Strophe.Status.CONNFAIL, "The WebSocket connection could not be established or was disconnected.");
                this._disconnect();
            },

            /** PrivateFunction: _onIdle
             *  _Private_ function called by Strophe.Connection._onIdle
             *
             *  sends all queued stanzas
             */
            _onIdle: function () {
                var data = this._conn._data;
                if (data.length > 0 && !this._conn.paused) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i] !== null) {
                            var stanza, rawStanza;
                            if (data[i] === "restart") {
                                stanza = this._buildStream().tree();
                            } else {
                                stanza = data[i];
                            }
                            rawStanza = Strophe.serialize(stanza);
                            this._conn.xmlOutput(stanza);
                            this._conn.rawOutput(rawStanza);
                            this.socket.send(rawStanza);
                        }
                    }
                    this._conn._data = [];
                }
            },

            /** PrivateFunction: _onMessage
             * _Private_ function to handle websockets messages.
             *
             * This function parses each of the messages as if they are full documents.
             * [TODO : We may actually want to use a SAX Push parser].
             *
             * Since all XMPP traffic starts with
             *  <stream:stream version='1.0'
             *                 xml:lang='en'
             *                 xmlns='jabber:client'
             *                 xmlns:stream='http://etherx.jabber.org/streams'
             *                 id='3697395463'
             *                 from='SERVER'>
             *
             * The first stanza will always fail to be parsed.
             *
             * Additionally, the seconds stanza will always be <stream:features> with
             * the stream NS defined in the previous stanza, so we need to 'force'
             * the inclusion of the NS in this stanza.
             *
             * Parameters:
             * (string) message - The websocket message.
             */
            _onMessage: function (message) {
                WebIM && WebIM.config.isDebug && Strophe.info(WebIM.utils.ts() + 'recv:', message.data);

                var elem, data;
                // check for closing stream
                var close = '<close xmlns="urn:ietf:params:xml:ns:xmpp-framing" />';
                if (message.data === close) {
                    this._conn.rawInput(close);
                    this._conn.xmlInput(message);
                    if (!this._conn.disconnecting) {
                        this._conn._doDisconnect();
                    }
                    return;
                } else if (message.data.search("<open ") === 0) {
                    // This handles stream restarts
                    elem = new DOMParser().parseFromString(message.data, "text/xml").documentElement;
                    if (!this._handleStreamStart(elem)) {
                        return;
                    }
                } else {
                    data = this._streamWrap(message.data);
                    elem = new DOMParser().parseFromString(data, "text/xml").documentElement;
                }

                if (this._check_streamerror(elem, Strophe.Status.ERROR)) {
                    return;
                }

                //handle unavailable presence stanza before disconnecting
                if (this._conn.disconnecting &&
                    elem.firstChild.nodeName === "presence" &&
                    elem.firstChild.getAttribute("type") === "unavailable") {
                    this._conn.xmlInput(elem);
                    this._conn.rawInput(Strophe.serialize(elem));
                    // if we are already disconnecting we will ignore the unavailable stanza and
                    // wait for the </stream:stream> tag before we close the connection
                    return;
                }
                this._conn._dataRecv(elem, message.data);
            },

            /** PrivateFunction: _onOpen
             * _Private_ function to handle websockets connection setup.
             *
             * The opening stream tag is sent here.
             */
            _onOpen: function () {
                Strophe.info("Websocket open");
                var start = this._buildStream();
                this._conn.xmlOutput(start.tree());

                var startString = Strophe.serialize(start);
                this._conn.rawOutput(startString);
                this.socket.send(startString);
            },

            /** PrivateFunction: _reqToData
             * _Private_ function to get a stanza out of a request.
             *
             * WebSockets don't use requests, so the passed argument is just returned.
             *
             *  Parameters:
             *    (Object) stanza - The stanza.
             *
             *  Returns:
             *    The stanza that was passed.
             */
            _reqToData: function (stanza) {
                return stanza;
            },

            /** PrivateFunction: _send
             *  _Private_ part of the Connection.send function for WebSocket
             *
             * Just flushes the messages that are in the queue
             */
            _send: function () {
                this._conn.flush();
            },

            /** PrivateFunction: _sendRestart
             *
             *  Send an xmpp:restart stanza.
             */
            _sendRestart: function () {
                clearTimeout(this._conn._idleTimeout);
                this._conn._onIdle.bind(this._conn)();
            }
        };
        return Strophe;
    }));

    (function (root) {
        if (typeof define === 'function' && define.amd) {
            define("strophe", [
                "strophe-core",
                "strophe-bosh",
                "strophe-websocket"
            ], function (wrapper) {
                return wrapper;
            });
        }
    })(this);

    /* jshint ignore:start */
    if (callback) {
        if (typeof define === 'function' && define.amd) {
            //For backwards compatability
            var n_callback = callback;
            if (typeof requirejs === 'function') {
                requirejs(["strophe"], function (o) {
                    n_callback(o.Strophe, o.$build, o.$msg, o.$iq, o.$pres);
                });
            } else {
                require(["strophe"], function (o) {
                    n_callback(o.Strophe, o.$build, o.$msg, o.$iq, o.$pres);
                });
            }
        } else {
            return callback(Strophe, $build, $msg, $iq, $pres);
        }
    }


})(function (Strophe, build, msg, iq, pres) {
    window.Strophe = Strophe;
    window.$build = build;
    window.$msg = msg;
    window.$iq = iq;
    window.$pres = pres;
});
/* jshint ignore:end */


(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define([], factory);
    else if(typeof exports === 'object')
        exports["WebIM"] = factory();
    else
        root["WebIM"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/    // The module cache
/******/    var installedModules = {};

/******/    // The require function
/******/    function __webpack_require__(moduleId) {

/******/        // Check if module is in cache
/******/        if(installedModules[moduleId])
/******/            return installedModules[moduleId].exports;

/******/        // Create a new module (and put it into the cache)
/******/        var module = installedModules[moduleId] = {
/******/            exports: {},
/******/            id: moduleId,
/******/            loaded: false
/******/        };

/******/        // Execute the module function
/******/        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/        // Flag the module as loaded
/******/        module.loaded = true;

/******/        // Return the exports of the module
/******/        return module.exports;
/******/    }


/******/    // expose the modules object (__webpack_modules__)
/******/    __webpack_require__.m = modules;

/******/    // expose the module cache
/******/    __webpack_require__.c = installedModules;

/******/    // __webpack_public_path__
/******/    __webpack_require__.p = "";

/******/    // Load entry module and return exports
/******/    return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

    module.exports = __webpack_require__(1)


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

    var _version = '1.4.13';
    var _code = __webpack_require__(2).code; 
    var _utils = __webpack_require__(3).utils; 
    var _msg = __webpack_require__(4);
    var _message = _msg._msg;
    var _msgHash = {};
    var Queue = __webpack_require__(39).Queue;
    var CryptoJS = __webpack_require__(5);
    var _ = __webpack_require__(40);

    var Strophe = window.Strophe
    var isStropheLog;
    var stropheConn = null

    window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    var logMessage = function (message) {
    }

    if (window.XDomainRequest) {
        // not support ie8 send is not a function , canot 
        // case send is object, doesn't has a attr of call
        // XDomainRequest.prototype.oldsend = XDomainRequest.prototype.send;
        // XDomainRequest.prototype.send = function () {
        //     XDomainRequest.prototype.oldsend.call(this, arguments);
        //     this.readyState = 2;
        // };
    }

    Strophe.Request.prototype._newXHR = function () {
        var xhr = _utils.xmlrequest(true);
        if (xhr.overrideMimeType) {
            xhr.overrideMimeType('text/xml');
        }
        // use Function.bind() to prepend ourselves as an argument
        xhr.onreadystatechange = this.func.bind(null, this);
        return xhr;
    };

    Strophe.Websocket.prototype._closeSocket = function () {
        if (this.socket) {
            var me = this;
            setTimeout(function () {
                try {
                    me.socket.close();
                } catch (e) {
                }
            }, 0);
        } else {
            this.socket = null;
        }
    };

    /** Function: log
     *  User overrideable logging function.
     *
     *  This function is called whenever the Strophe library calls any
     *  of the logging functions.  The default implementation of this
     *  function does nothing.  If client code wishes to handle the logging
     *  messages, it should override this with
     *  > Strophe.log = function (level, msg) {
         *  >   (user code here)
         *  > };
     *
     *  Please note that data sent and received over the wire is logged
     *  via Strophe.Connection.rawInput() and Strophe.Connection.rawOutput().
     *
     *  The different levels and their meanings are
     *
     *    DEBUG - Messages useful for debugging purposes.
     *    INFO - Informational messages.  This is mostly information like
     *      'disconnect was called' or 'SASL auth succeeded'.
     *    WARN - Warnings about potential problems.  This is mostly used
     *      to report transient connection errors like request timeouts.
     *    ERROR - Some error occurred.
     *    FATAL - A non-recoverable fatal error occurred.
     *
     *  Parameters:
     *    (Integer) level - The log level of the log message.  This will
     *      be one of the values in Strophe.LogLevel.
     *    (String) msg - The log message.
     */
    /* jshint ignore:start */
    Strophe.log =  function (level, msg) {
        if(!isStropheLog){
            return
        }
        switch(level){
            case this.LogLevel.DEBUG:
                console.debug(msg)
                break;
            case this.LogLevel.INFO:
                console.info(msg);
                break;
            case this.LogLevel.WARN:
                console.warn(msg);
                break;
            case this.LogLevel.ERROR:
            case this.LogLevel.FATAL:
                console.error(msg);
                break;
            default:
                console.log(msg);
        }
        return;
    }

    /**
     *
     * Strophe.Websocket has a bug while logout:
     * 1.send: <presence xmlns='jabber:client' type='unavailable'/> is ok;
     * 2.send: <close xmlns='urn:ietf:params:xml:ns:xmpp-framing'/> will cause a problem,log as follows:
     * WebSocket connection to 'ws://im-api.easemob.com/ws/' failed: Data frame received after close_connect @ strophe.js:5292connect @ strophe.js:2491_login @ websdk-1.1.2.js:278suc @ websdk-1.1.2.js:636xhr.onreadystatechange @ websdk-1.1.2.js:2582
     * 3 "Websocket error [object Event]"
     * _changeConnectStatus
     * onError Object {type: 7, msg: "The WebSocket connection could not be established or was disconnected.", reconnect: true}
     *
     * this will trigger socket.onError, therefore _doDisconnect again.
     * Fix it by overide  _onMessage
     */
    Strophe.Websocket.prototype._onMessage = function (message) {
        logMessage(message)
        // 获取Resource
        var data = message.data;
        if (data.indexOf('<jid>') > 0) {
            var start = data.indexOf('<jid>'),
                end = data.indexOf('</jid>'),
                data = data.substring(start + 5, end);
            stropheConn.setJid(data);
        }
        var elem, data;
        // check for closing stream
        // var close = '<close xmlns="urn:ietf:params:xml:ns:xmpp-framing" />';
        // if (message.data === close) {
        //     this._conn.rawInput(close);
        //     this._conn.xmlInput(message);
        //     if (!this._conn.disconnecting) {
        //         this._conn._doDisconnect();
        //     }
        //     return;
        //
        // send and receive close xml: <close xmlns='urn:ietf:params:xml:ns:xmpp-framing'/>
        // so we can't judge whether message.data equals close by === simply.
        if (message.data.indexOf("<close ") === 0) {
            elem = new DOMParser().parseFromString(message.data, "text/xml").documentElement;
            var see_uri = elem.getAttribute("see-other-uri");
            if (see_uri) {
                this._conn._changeConnectStatus(Strophe.Status.REDIRECT, "Received see-other-uri, resetting connection");
                this._conn.reset();
                this._conn.service = see_uri;
                this._connect();
            } else {
                // if (!this._conn.disconnecting) {
                this._conn._doDisconnect("receive <close> from server");
                // }
            }
            return;
        } else if (message.data.search("<open ") === 0) {
            // This handles stream restarts
            elem = new DOMParser().parseFromString(message.data, "text/xml").documentElement;
            if (!this._handleStreamStart(elem)) {
                return;
            }
        } else {
            data = this._streamWrap(message.data);
            elem = new DOMParser().parseFromString(data, "text/xml").documentElement;
        }

        if (this._check_streamerror(elem, Strophe.Status.ERROR)) {
            return;
        }

        //handle unavailable presence stanza before disconnecting
        if (this._conn.disconnecting &&
            elem.firstChild.nodeName === "presence" &&
            elem.firstChild.getAttribute("type") === "unavailable") {
            this._conn.xmlInput(elem);
            this._conn.rawInput(Strophe.serialize(elem));
            // if we are already disconnecting we will ignore the unavailable stanza and
            // wait for the </stream:stream> tag before we close the connection
            return;
        }
        this._conn._dataRecv(elem, message.data);
    };


    var _listenNetwork = function (onlineCallback, offlineCallback) {

        if (window.addEventListener) {
            window.addEventListener('online', onlineCallback);
            window.addEventListener('offline', offlineCallback);

        } else if (window.attachEvent) {
            if (document.body) {
                document.body.attachEvent('ononline', onlineCallback);
                document.body.attachEvent('onoffline', offlineCallback);
            } else {
                window.attachEvent('load', function () {
                    document.body.attachEvent('ononline', onlineCallback);
                    document.body.attachEvent('onoffline', offlineCallback);
                });
            }
        } else {
            /*var onlineTmp = window.ononline;
             var offlineTmp = window.onoffline;

             window.attachEvent('ononline', function () {
             try {
             typeof onlineTmp === 'function' && onlineTmp();
             } catch ( e ) {}
             onlineCallback();
             });
             window.attachEvent('onoffline', function () {
             try {
             typeof offlineTmp === 'function' && offlineTmp();
             } catch ( e ) {}
             offlineCallback();
             });*/
        }
    };

    var _parseRoom = function (result) {
        var rooms = [];
        var items = result.getElementsByTagName('item');
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var roomJid = item.getAttribute('jid');
                var tmp = roomJid.split('@')[0];
                var room = {
                    jid: roomJid,
                    name: item.getAttribute('name'),
                    roomId: tmp.split('_')[1]
                };
                rooms.push(room);
            }
        }
        return rooms;
    };

    var _parseRoomOccupants = function (result) {
        var occupants = [];
        var items = result.getElementsByTagName('item');
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var room = {
                    jid: item.getAttribute('jid'),
                    name: item.getAttribute('name')
                };
                occupants.push(room);
            }
        }
        return occupants;
    };

    var _parseResponseMessage = function (msginfo) {
        var parseMsgData = {errorMsg: true, data: []};

        var msgBodies = msginfo.getElementsByTagName('body');
        if (msgBodies) {
            for (var i = 0; i < msgBodies.length; i++) {
                var msgBody = msgBodies[i];
                var childNodes = msgBody.childNodes;
                if (childNodes && childNodes.length > 0) {
                    var childNode = msgBody.childNodes[0];
                    if (childNode.nodeType == Strophe.ElementType.TEXT) {
                        var jsondata = childNode.wholeText || childNode.nodeValue;
                        jsondata = jsondata.replace('\n', '<br>');
                        try {
                            var data = eval('(' + jsondata + ')');
                            parseMsgData.errorMsg = false;
                            parseMsgData.data = [data];
                        } catch (e) {
                        }
                    }
                }
            }

            var delayTags = msginfo.getElementsByTagName('delay');
            if (delayTags && delayTags.length > 0) {
                var delayTag = delayTags[0];
                var delayMsgTime = delayTag.getAttribute('stamp');
                if (delayMsgTime) {
                    parseMsgData.delayTimeStamp = delayMsgTime;
                }
            }
        } else {
            var childrens = msginfo.childNodes;
            if (childrens && childrens.length > 0) {
                var child = msginfo.childNodes[0];
                if (child.nodeType == Strophe.ElementType.TEXT) {
                    try {
                        var data = eval('(' + child.nodeValue + ')');
                        parseMsgData.errorMsg = false;
                        parseMsgData.data = [data];
                    } catch (e) {
                    }
                }
            }
        }
        return parseMsgData;
    };

    var _parseNameFromJidFn = function (jid, domain) {
        domain = domain || '';
        var tempstr = jid;
        var findex = tempstr.indexOf('_');

        if (findex !== -1) {
            tempstr = tempstr.substring(findex + 1);
        }
        var atindex = tempstr.indexOf('@' + domain);
        if (atindex !== -1) {
            tempstr = tempstr.substring(0, atindex);
        }
        return tempstr;
    };

    var _parseFriend = function (queryTag, conn, from) {
        var rouster = [];
        var items = queryTag.getElementsByTagName('item');
        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var jid = item.getAttribute('jid');
                if (!jid) {
                    continue;
                }
                var subscription = item.getAttribute('subscription');
                var friend = {
                    subscription: subscription,
                    jid: jid
                };
                var ask = item.getAttribute('ask');
                if (ask) {
                    friend.ask = ask;
                }
                var name = item.getAttribute('name');
                if (name) {
                    friend.name = name;
                } else {
                    var n = _parseNameFromJidFn(jid);
                    friend.name = n;
                }
                var groups = [];
                Strophe.forEachChild(item, 'group', function (group) {
                    groups.push(Strophe.getText(group));
                });
                friend.groups = groups;
                rouster.push(friend);
                // B同意之后 -> B订阅A
                // fix: 含有ask标示的好友代表已经发送过反向订阅消息，不需要再次发送。
                if (conn && (subscription == 'from') && !ask) {
                    conn.subscribe({
                        toJid: jid,
                        message: "[resp:true]"
                    });
                }

                if (conn && (subscription == 'to')) {
                    conn.subscribed({
                        toJid: jid
                    });
                }
            }
        }
        return rouster;
    };

    var _login = function (options, conn) {
        if(!options){
            return;
        }
        var accessToken = options.access_token || '';
        if (accessToken == '') {
            var loginfo = _utils.stringify(options);
            conn.onError({
                type: _code.WEBIM_CONNCTION_OPEN_USERGRID_ERROR,
                data: options
            });
            return;
        }
        conn.context.accessToken = options.access_token;
        conn.context.accessTokenExpires = options.expires_in;
        if (conn.isOpening() && conn.context.stropheConn) {
            stropheConn = conn.getStrophe();
        } else if (conn.isOpened() && conn.context.stropheConn) {
            // return;
            stropheConn = conn.getStrophe();
        } else {
            stropheConn = conn.getStrophe();
        }
        var callback = function (status, msg) {
            _loginCallback(status, msg, conn);
        };

        conn.context.stropheConn = stropheConn;
        if (conn.route) {
            stropheConn.connect(conn.context.jid, '$t$' + accessToken, callback, conn.wait, conn.hold, conn.route);
        } else {
            stropheConn.connect(conn.context.jid, '$t$' + accessToken, callback, conn.wait, conn.hold);
        }
    };

    var _parseMessageType = function (msginfo) {
        var receiveinfo = msginfo.getElementsByTagName('received'),
            inviteinfo = msginfo.getElementsByTagName('invite'),
            deliveryinfo = msginfo.getElementsByTagName('delivery'),
            acked = msginfo.getElementsByTagName('acked'),
            error = msginfo.getElementsByTagName('error'),
            msgtype = 'normal';
        if (receiveinfo && receiveinfo.length > 0
            &&
            receiveinfo[0].namespaceURI === 'urn:xmpp:receipts') {

            msgtype = 'received';

        } else if (inviteinfo && inviteinfo.length > 0) {

            msgtype = 'invite';

        } else if (deliveryinfo && deliveryinfo.length > 0) {

            msgtype = 'delivery';           // 消息送达

        } else if (acked && acked.length) {

            msgtype = 'acked';              // 消息已读

        } else if (error && error.length) {

            var errorItem = error[0],
                userMuted = errorItem.getElementsByTagName('user-muted');

            if (userMuted && userMuted.length) {

                msgtype = 'userMuted';

            }

        }
        return msgtype;
    };

    var _handleMessageQueue = function (conn) {
        for (var i in _msgHash) {
            if (_msgHash.hasOwnProperty(i)) {
                _msgHash[i].send(conn);
            }
        }
    };

    var _loginCallback = function (status, msg, conn) {
        var conflict, error;

        if (msg === 'conflict') {
            conflict = true;
            conn.close();
        }

        if (status == Strophe.Status.CONNFAIL) {
            //client offline, ping/pong timeout, server quit, server offline
            error = {
                type: _code.WEBIM_CONNCTION_SERVER_CLOSE_ERROR,
                msg: msg,
                reconnect: true
            };

            conflict && (error.conflict = true);
            conn.onError(error);
        } else if (status == Strophe.Status.ATTACHED || status == Strophe.Status.CONNECTED) {
            // client should limit the speed of sending ack messages  up to 5/s  (后修改为10/s途虎重复收到离线消息)
            conn.autoReconnectNumTotal = 0;
            conn.intervalId = setInterval(function () {
                conn.handelSendQueue();
            }, 100);
            var handleMessage = function (msginfo) {
                var delivery = msginfo.getElementsByTagName('delivery');
                var acked = msginfo.getElementsByTagName('acked');
                if (delivery.length) {
                    conn.handleDeliveredMessage(msginfo);
                    return true;
                }
                if (acked.length) {
                    conn.handleAckedMessage(msginfo);
                    return true;
                }
                var type = _parseMessageType(msginfo);
                switch (type) {
                    case "received":
                        conn.handleReceivedMessage(msginfo);
                        return true;
                    case "invite":
                        conn.handleInviteMessage(msginfo);
                        return true;
                    case "delivery":
                        conn.handleDeliveredMessage(msginfo);
                        return true;
                    case "acked":
                        conn.handleAckedMessage(msginfo);
                        return true;
                    case "userMuted":
                        conn.handleMutedMessage(msginfo);
                        return true;
                    default:
                        conn.handleMessage(msginfo);
                        return true;
                }
            };
            var handlePresence = function (msginfo) {
                conn.handlePresence(msginfo);
                return true;
            };
            var handlePing = function (msginfo) {
                conn.handlePing(msginfo);
                return true;
            };
            var handleIqRoster = function (msginfo) {
                conn.handleIqRoster(msginfo);
                return true;
            };
            var handleIqPrivacy = function (msginfo) {
                conn.handleIqPrivacy(msginfo);
                return true;
            };
            var handleIq = function (msginfo) {
                conn.handleIq(msginfo);
                return true;
            };

            conn.addHandler(handleMessage, null, 'message', null, null, null);
            conn.addHandler(handlePresence, null, 'presence', null, null, null);
            conn.addHandler(handlePing, 'urn:xmpp:ping', 'iq', 'get', null, null);
            conn.addHandler(handleIqRoster, 'jabber:iq:roster', 'iq', 'set', null, null);
            conn.addHandler(handleIqPrivacy, 'jabber:iq:privacy', 'iq', 'set', null, null);
            conn.addHandler(handleIq, null, 'iq', null, null, null);

            conn.registerConfrIQHandler && (conn.registerConfrIQHandler());

            conn.context.status = _code.STATUS_OPENED;

            var supportRecMessage = [
                _code.WEBIM_MESSAGE_REC_TEXT,
                _code.WEBIM_MESSAGE_REC_EMOJI];

            if (_utils.isCanDownLoadFile) {
                supportRecMessage.push(_code.WEBIM_MESSAGE_REC_PHOTO);
                supportRecMessage.push(_code.WEBIM_MESSAGE_REC_AUDIO_FILE);
            }
            var supportSedMessage = [_code.WEBIM_MESSAGE_SED_TEXT];
            if (_utils.isCanUploadFile) {
                supportSedMessage.push(_code.WEBIM_MESSAGE_REC_PHOTO);
                supportSedMessage.push(_code.WEBIM_MESSAGE_REC_AUDIO_FILE);
            }
            conn.notifyVersion();
            conn.retry && _handleMessageQueue(conn);
            conn.heartBeat();
            conn.isAutoLogin && conn.setPresence();
            console.log("conn",conn);

            try {
                if (conn.unSendMsgArr.length > 0) {
                    console.log("unSendMesArr",conn.unSendMsgArr);
                    for (var i in conn.unSendMsgArr) {
                        var dom = conn.unSendMsgArr[i];
                        conn.sendCommand(dom);
                        delete conn.unSendMsgArr[i];
                    }
                }
            } catch (e) {
                console.error(e.message);
            }
            conn.offLineSendConnecting = false;
            conn.logOut = false;
            conn.onOpened({
                canReceive: supportRecMessage,
                canSend: supportSedMessage,
                accessToken: conn.context.accessToken
            });
        } else if (status == Strophe.Status.DISCONNECTING) {
            if (conn.isOpened()) {
                conn.stopHeartBeat();
                conn.context.status = _code.STATUS_CLOSING;

                error = {
                    type: _code.WEBIM_CONNCTION_SERVER_CLOSE_ERROR,
                    msg: msg,
                    reconnect: true
                };

                conflict && (error.conflict = true);
                conn.onError(error);
            }
        } else if (status == Strophe.Status.DISCONNECTED) {
            if (!conn.isClosing() || conn.isOpened()) {
                if (conn.autoReconnectNumTotal < conn.autoReconnectNumMax) {
                    conn.reconnect(!conn.isClosing());
                    return;
                } else {
                    error = {
                        type: _code.WEBIM_CONNCTION_DISCONNECTED
                    };
                    conn.onError(error);
                }
            }
            conn.context.status = _code.STATUS_CLOSED;
            conn.clear();
            conn.onClosed();
        } else if (status == Strophe.Status.AUTHFAIL) {
            error = {
                type: _code.WEBIM_CONNCTION_AUTH_ERROR
            };

            conflict && (error.conflict = true);
            conn.onError(error);
            conn.clear();
        } else if (status == Strophe.Status.ERROR) {
            conn.context.status = _code.STATUS_ERROR;
            error = {
                type: _code.WEBIM_CONNCTION_SERVER_ERROR
            };

            conflict && (error.conflict = true);
            conn.onError(error);
        }
        conn.context.status_now = status;
    };

    var _getJid = function (options, conn) {
        var jid = options.toJid || '';

        if (jid === '') {
            var appKey = conn.context.appKey || '';
            var toJid = appKey + '_' + options.to + '@' + conn.domain;

            if (options.resource) {
                toJid = toJid + '/' + options.resource;
            }
            jid = toJid;
        }
        return jid;
    };

    var _getJidByName = function (name, conn) {
        var options = {
            to: name
        };
        return _getJid(options, conn);
    };

    var _validCheck = function (options, conn) {
        options = options || {};

        if (options.user == '') {
            conn.onError({
                type: _code.WEBIM_CONNCTION_USER_NOT_ASSIGN_ERROR
            });
            return false;
        }

        var user = (options.user + '') || '';
        var appKey = options.appKey || '';
        var devInfos = appKey.split('#');

        if (devInfos.length !== 2) {
            conn.onError({
                type: _code.WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR
            });
            return false;
        }
        var orgName = devInfos[0];
        var appName = devInfos[1];

        if (!orgName) {
            conn.onError({
                type: _code.WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR
            });
            return false;
        }
        if (!appName) {
            conn.onError({
                type: _code.WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR
            });
            return false;
        }

        var jid = appKey + '_' + user.toLowerCase() + '@' + conn.domain,
            resource = options.resource || 'webim';

        if (conn.isMultiLoginSessions) {
            resource += user + new Date().getTime() + Math.floor(Math.random().toFixed(6) * 1000000);
        }
        conn.context.jid = jid + '/' + resource;
        /*jid: {appkey}_{username}@domain/resource*/
        conn.context.userId = user;
        conn.context.appKey = appKey;
        conn.context.appName = appName;
        conn.context.orgName = orgName;

        return true;
    };

    var _getXmppUrl = function (baseUrl, https) {
        if (/^(ws|http)s?:\/\/?/.test(baseUrl)) {
            return baseUrl;
        }

        var url = {
            prefix: 'http',
            base: '://' + baseUrl,
            suffix: '/http-bind/'
        };

        if (https && _utils.isSupportWss) {
            url.prefix = 'wss';
            url.suffix = '/ws/';
        } else {
            if (https) {
                url.prefix = 'https';
            } else if (window.WebSocket) {
                url.prefix = 'ws';
                url.suffix = '/ws/';
            }
        }

        return url.prefix + url.base + url.suffix;
    };


    /**
     * The connection class.
     * @constructor
     * @param {Object} options - 创建连接的初始化参数
     * @param {String} options.url - xmpp服务器的URL
     * @param {String} options.apiUrl - API服务器的URL
     * @param {Boolean} options.isHttpDNS - 防止域名劫持
     * @param {Boolean} options.isMultiLoginSessions - 为true时同一账户可以同时在多个Web页面登录（多标签登录，默认不开启，如有需要请联系商务），为false时同一账号只能在一个Web页面登录
     * @param {Boolean} options.https - 是否启用wss.
     * @param {Number} options.heartBeatWait - 发送心跳包的时间间隔（毫秒）
     * @param {Boolean} options.isAutoLogin - 登录成功后是否自动出席
     * @param {Number} options.autoReconnectNumMax - 掉线后重连的最大次数
     * @param {Number} options.autoReconnectInterval -  掉线后重连的间隔时间（毫秒）
     * @param {Boolean} options.isWindowSDK - 是否运行在WindowsSDK上
     * @param {Boolean} options.encrypt - 是否加密文本消息
     * @param {Boolean} options.delivery - 是否发送delivered ack
     * @returns {Class}  连接实例
     */


    //class
    var connection = function (options) {
        if (!this instanceof connection) {
            return new connection(options);
        }

        var options = options || {};

        this.isHttpDNS = options.isHttpDNS || false;
        this.isMultiLoginSessions = options.isMultiLoginSessions || false;
        this.wait = options.wait || 30;
        this.retry = options.retry || false;
        this.https = options.https && location.protocol === 'https:';
        this.url = _getXmppUrl(options.url, this.https);
        this.hold = options.hold || 1;
        this.route = options.route || null;
        this.domain = options.domain || 'easemob.com';
        this.inactivity = options.inactivity || 30;
        this.heartBeatWait = options.heartBeatWait || 4500;
        this.maxRetries = options.maxRetries || 5;
        this.isAutoLogin = options.isAutoLogin === false ? false : true;
        this.pollingTime = options.pollingTime || 800;
        this.stropheConn = false;
        this.autoReconnectNumMax = options.autoReconnectNumMax || 0;
        this.autoReconnectNumTotal = 0;
        this.autoReconnectInterval = options.autoReconnectInterval || 0;
        this.context = {status: _code.STATUS_INIT};
        this.sendQueue = new Queue();  //instead of sending message immediately,cache them in this queue
        this.intervalId = null;   //clearInterval return value
        this.apiUrl = options.apiUrl || '';
        this.isWindowSDK = options.isWindowSDK || false;
        this.encrypt = options.encrypt || {encrypt: {type: 'none'}};
        this.delivery = options.delivery || false;
        this.user = '';
        this.orgName = '';
        this.appName = '';
        this.token = '';
        this.unSendMsgArr = [];

        this.dnsArr = ['https://rs.easemob.com', 'https://rsbak.easemob.com', 'http://182.92.174.78', 'http://112.126.66.111']; //http dns server hosts
        this.dnsIndex = 0;   //the dns ip used in dnsArr currently
        this.dnsTotal = this.dnsArr.length;  //max number of getting dns retries
        this.restHosts = null; //rest server ips
        this.restIndex = 0;    //the rest ip used in restHosts currently
        this.restTotal = 0;    //max number of getting rest token retries
        this.xmppHosts = null; //xmpp server ips
        this.xmppIndex = 0;    //the xmpp ip used in xmppHosts currently
        this.xmppTotal = 0;    //max number of creating xmpp server connection(ws/bosh) retries

        this.groupOption = {};
        
        // global params
        isStropheLog = options.isStropheLog || false;
    };

    /**
     * 注册新用户
     * @param {Object} options - 用户信息
     * @param {String} options.username - 用户名
     * @param {String} options.password - 密码
     * @param {String} options.nickname - 用户昵称
     * @param {Function} options.success - 注册成功回调
     * @param {Function} options.error - 注册失败
     */

    connection.prototype.registerUser = function (options) {
        if (location.protocol != 'https:' && this.isHttpDNS) {
            this.dnsIndex = 0;
            this.getHttpDNS(options, 'signup');
        } else {
            this.signup(options);
        }
    }

    /**
     * 处理发送队列
     * @private
     */

    connection.prototype.handelSendQueue = function () {
        var options = this.sendQueue.pop();
        if (options !== null) {
            this.sendReceiptsMessage(options);
        }
    };

    /**
     * 注册监听函数
     * @param {Object} options - 回调函数集合
     * @param {connection~onOpened} options.onOpened - 处理登录的回调
     * @param {connection~onTextMessage} options.onTextMessage - 处理文本消息的回调
     * @param {connection~onEmojiMessage} options.onEmojiMessage - 处理表情消息的回调
     * @param {connection~onPictureMessage} options.onPictureMessage - 处理图片消息的回调
     * @param {connection~onAudioMessage} options.onAudioMessage - 处理音频消息的回调
     * @param {connection~onVideoMessage} options.onVideoMessage - 处理视频消息的回调
     * @param {connection~onFileMessage} options.onFileMessage - 处理文件消息的回调
     * @param {connection~onLocationMessage} options.onLocationMessage - 处理位置消息的回调
     * @param {connection~onCmdMessage} options.onCmdMessage - 处理命令消息的回调
     * @param {connection~onPresence} options.onPresence - 处理Presence消息的回调
     * @param {connection~onError} options.onError - 处理错误消息的回调
     * @param {connection~onReceivedMessage} options.onReceivedMessage - 处理Received消息的回调
     * @param {connection~onInviteMessage} options.onInviteMessage - 处理邀请消息的回调
     * @param {connection~onDeliverdMessage} options.onDeliverdMessage - 处理Delivered ACK消息的回调
     * @param {connection~onReadMessage} options.onReadMessage - 处理Read ACK消息的回调
     * @param {connection~onMutedMessage} options.onMutedMessage - 处理禁言消息的回调
     * @param {connection~onOffline} options.onOffline - 处理断网的回调
     * @param {connection~onOnline} options.onOnline - 处理联网的回调
     * @param {connection~onCreateGroup} options.onCreateGroup - 处理创建群组的回调
     */
    connection.prototype.listen = function (options) {
        /**
         * 登录成功后调用
         * @callback connection~onOpened
         */
        /**
         * 收到文本消息
         * @callback connection~onTextMessage
         */
        /**
         * 收到表情消息
         * @callback connection~onEmojiMessage
         */
        /**
         * 收到图片消息
         * @callback connection~onPictureMessage
         */
        /**
         * 收到音频消息
         * @callback connection~onAudioMessage
         */
        /**
         * 收到视频消息
         * @callback connection~onVideoMessage
         */
        /**
         * 收到文件消息
         * @callback connection~onFileMessage
         */
        /**
         * 收到位置消息
         * @callback connection~onLocationMessage
         */
        /**
         * 收到命令消息
         * @callback connection~onCmdMessage
         */
        /**
         * 收到错误消息
         * @callback connection~onError
         */
        /**
         * 收到Presence消息
         * @callback connection~onPresence
         */
        /**
         * 收到Received消息
         * @callback connection~onReceivedMessage
         */
        /**
         * 被邀请进群
         * @callback connection~onInviteMessage
         */
        /**
         * 收到已送达回执
         * @callback connection~onDeliverdMessage
         */
        /**
         * 收到已读回执
         * @callback connection~onReadMessage
         */
        /**
         * 被群管理员禁言
         * @callback connection~onMutedMessage
         */
        /**
         * 浏览器被断网时调用
         * @callback connection~onOffline
         */
        /**
         * 浏览器联网时调用
         * @callback connection~onOnline
         */
        /**
         * 建群成功后调用
         * @callback connection~onCreateGroup
         */
        this.onOpened = options.onOpened || _utils.emptyfn;
        this.onClosed = options.onClosed || _utils.emptyfn;
        this.onTextMessage = options.onTextMessage || _utils.emptyfn;
        this.onEmojiMessage = options.onEmojiMessage || _utils.emptyfn;
        this.onPictureMessage = options.onPictureMessage || _utils.emptyfn;
        this.onAudioMessage = options.onAudioMessage || _utils.emptyfn;
        this.onVideoMessage = options.onVideoMessage || _utils.emptyfn;
        this.onFileMessage = options.onFileMessage || _utils.emptyfn;
        this.onLocationMessage = options.onLocationMessage || _utils.emptyfn;
        this.onCmdMessage = options.onCmdMessage || _utils.emptyfn;
        this.onPresence = options.onPresence || _utils.emptyfn;
        this.onRoster = options.onRoster || _utils.emptyfn;
        this.onError = options.onError || _utils.emptyfn;
        this.onReceivedMessage = options.onReceivedMessage || _utils.emptyfn;
        this.onInviteMessage = options.onInviteMessage || _utils.emptyfn;
        this.onDeliverdMessage = options.onDeliveredMessage || _utils.emptyfn;
        this.onReadMessage = options.onReadMessage || _utils.emptyfn;
        this.onMutedMessage = options.onMutedMessage || _utils.emptyfn;
        this.onOffline = options.onOffline || _utils.emptyfn;
        this.onOnline = options.onOnline || _utils.emptyfn;
        this.onConfirmPop = options.onConfirmPop || _utils.emptyfn;
        this.onCreateGroup = options.onCreateGroup || _utils.emptyfn;
        //for WindowSDK start
        this.onUpdateMyGroupList = options.onUpdateMyGroupList || _utils.emptyfn;
        this.onUpdateMyRoster = options.onUpdateMyRoster || _utils.emptyfn;
        //for WindowSDK end
        this.onBlacklistUpdate = options.onBlacklistUpdate || _utils.emptyfn;

        _listenNetwork(this.onOnline, this.onOffline);
    };

    /**
     * 发送心跳
     * webrtc需要强制心跳，加个默认为false的参数 向下兼容
     * @param {Boolean} forcing - 是否强制发送
     * @private
     */
    connection.prototype.heartBeat = function (forcing) {
        if (forcing !== true) {
            forcing = false;
        }
        var me = this;
        //IE8: strophe auto switch from ws to BOSH, need heartbeat
        var isNeed = !/^ws|wss/.test(me.url) || /mobile/.test(navigator.userAgent);

        if (this.heartBeatID || (!forcing && !isNeed)) {
            return;
        }

        var options = {
            toJid: this.domain,
            type: 'normal'
        };
        this.heartBeatID = setInterval(function () {
            // fix: do heartbeat only when websocket 
            _utils.isSupportWss && me.ping(options);
        }, this.heartBeatWait);
    };

    /**
     * @private
     */

    connection.prototype.stopHeartBeat = function () {
        if (typeof this.heartBeatID == "number") {
            this.heartBeatID = clearInterval(this.heartBeatID);
        }
    };

    /**
     * 发送接收消息回执
     * @param {Object} options -
     * @param {String} options.id - 消息id
     * @private
     */
    connection.prototype.sendReceiptsMessage = function (options) {
        var dom = $msg({
            from: this.context.jid || '',
            to: this.domain,
            id: options.id || ''
        }).c('received', {
            xmlns: 'urn:xmpp:receipts',
            id: options.id || ''
        });
        this.sendCommand(dom.tree());
    };

    /**
     * @private
     */

    connection.prototype.cacheReceiptsMessage = function (options) {
        this.sendQueue.push(options);
    };

    /**
     * @private
     */

    connection.prototype.getStrophe = function () {
        if (location.protocol != 'https:' && this.isHttpDNS) {
            //TODO: try this.xmppTotal times on fail
            var url = '';
            var host = this.xmppHosts[this.xmppIndex];
            cc.log("#####host:"+host);
            cc.log("#####this.xmppIndex:"+this.xmppIndex);
            cc.log("#####this.xmppHosts:"+JSON.stringify(this.xmppHosts));

            var domain = _utils.getXmlFirstChild(host, 'domain');
            cc.log("#####domain:"+domain);


            var ip = _utils.getXmlFirstChild(host, 'ip');
            if (ip) {
                url = ip.textContent;
                var port = _utils.getXmlFirstChild(host, 'port');
                if (port.textContent != '80') {
                    url += ':' + port.textContent;
                }
            } else {
                url = domain.textContent;
            }

            if (url != '') {
                var parter = /(.+\/\/).+(\/.+)/;
                this.url = this.url.replace(parter, "$1" + url + "$2");
            }
        }

        var stropheConn = new Strophe.Connection(this.url, {
            inactivity: this.inactivity,
            maxRetries: this.maxRetries,
            pollingTime: this.pollingTime
        });
        return stropheConn;
    };

    /**
     *
     * @param data
     * @param tagName
     * @private
     */
    connection.prototype.getHostsByTag = function (data, tagName) {
        var tag = _utils.getXmlFirstChild(data, tagName);
        if (!tag) {
            console.log(tagName + ' hosts error');
            return null;
        }
        var hosts = tag.getElementsByTagName('hosts');
        if (hosts.length == 0) {
            console.log(tagName + ' hosts error2');
            return null;
        }
        return hosts[0].getElementsByTagName('host');

    };

    /**
     * @private
     */
    connection.prototype.getRestFromHttpDNS = function (options, type) {
        if (this.restIndex > this.restTotal) {
            console.log('rest hosts all tried,quit');
            return;
        }
        var url = '';
        var host = this.restHosts[this.restIndex];
        var domain = _utils.getXmlFirstChild(host, 'domain');
        var ip = _utils.getXmlFirstChild(host, 'ip');
        if (ip) {
            var port = _utils.getXmlFirstChild(host, 'port');
            url = (location.protocol === 'https:' ? 'https:' : 'http:') + '//' + ip.textContent + ':' + port.textContent;
        } else {
            url = (location.protocol === 'https:' ? 'https:' : 'http:') + '//' + domain.textContent;
        }

        if (url != '') {
            this.apiUrl = url;
            options.apiUrl = url;
        }

        if (type == 'login') {
            this.login(options);
        } else {
            this.signup(options);
        }
    };

    /**
     * @private
     */

    connection.prototype.getHttpDNS = function (options, type) {
        // if (this.restHosts) {
        //     this.getRestFromHttpDNS(options, type);
        //     return;
        // }
        var self = this;
        var suc = function (data, xhr) {
            data = new DOMParser().parseFromString(data, "text/xml").documentElement;
            //get rest ips
            var restHosts = self.getHostsByTag(data, 'rest');
            if (!restHosts) {
                cc.log('rest hosts error3');
                return;
            }
            self.restHosts = restHosts;
            self.restTotal = restHosts.length;

            //get xmpp ips
            var makeArray = function(obj){    //伪数组转为数组
              return Array.prototype.slice.call(obj,0); 
            } 
            try{ 
                Array.prototype.slice.call(document.documentElement.childNodes, 0)[0].nodeType; 
            }catch(e){ 
                makeArray = function(obj){ 
                    var res = []; 
                    for(var i=0,len=obj.length; i<len; i++){
                       res.push(obj[i]); 
                    } 
                  return res; 
              } 
            } 
            var xmppHosts = makeArray(self.getHostsByTag(data, 'xmpp'));
            if (!xmppHosts) {
                cc.log('xmpp hosts error3');
                return;
            }
            for(var i = 0; i< xmppHosts.length; i++){
                var httpType = self.https ? 'https' : 'http';
                if(_utils.getXmlFirstChild(xmppHosts[i], 'protocol').textContent === httpType ){
                    var currentPost = xmppHosts[i];
                    xmppHosts.splice(i,1);
                    xmppHosts.unshift(currentPost);
                }
            }
            self.xmppHosts = xmppHosts;
            self.xmppTotal = xmppHosts.length;

            self.getRestFromHttpDNS(options, type);
        };
        var error = function (res, xhr, msg) {

            cc.log('getHttpDNS error', res, msg);
            self.dnsIndex++;
            if (self.dnsIndex < self.dnsTotal) {
                self.getHttpDNS(options, type);
            }

        };
        var options2 = {
            url: this.dnsArr[this.dnsIndex] + '/easemob/server.xml',
            dataType: 'text',
            type: 'GET',

            // url: 'http://www.easemob.com/easemob/server.xml',
            // dataType: 'xml',
            data: {app_key: encodeURIComponent(options.appKey)},
            success: suc || _utils.emptyfn,
            error: error || _utils.emptyfn
        };
        _utils.ajax(options2);
    };

    /**
     * @private
     */

    connection.prototype.signup = function (options) {
        var self = this;
        var orgName = options.orgName || '';
        var appName = options.appName || '';
        var appKey = options.appKey || '';
        var suc = options.success || EMPTYFN;
        var err = options.error || EMPTYFN;

        if (!orgName && !appName && appKey) {
            var devInfos = appKey.split('#');
            if (devInfos.length === 2) {
                orgName = devInfos[0];
                appName = devInfos[1];
            }
        }
        if (!orgName && !appName) {
            err({
                type: _code.WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR
            });
            return;
        }

        var error = function (res, xhr, msg) {
            if (location.protocol != 'https:' && self.isHttpDNS) {
                if ((self.restIndex + 1) < self.restTotal) {
                    self.restIndex++;
                    self.getRestFromHttpDNS(options, 'signup');
                    return;
                }
            }
            self.clear();
            err(res);
        };
        var https = options.https || https;
        var apiUrl = options.apiUrl;
        var restUrl = apiUrl + '/' + orgName + '/' + appName + '/users';

        var userjson = {
            username: options.username,
            password: options.password,
            nickname: options.nickname || ''
        };

        var userinfo = _utils.stringify(userjson);
        var options2 = {
            url: restUrl,
            dataType: 'json',
            data: userinfo,
            success: suc,
            error: error
        };
        _utils.ajax(options2);
    };

    /**
     * 登录
     * @param {Object} options - 用户信息
     * @param {String} options.user - 用户名
     * @param {String} options.pwd - 用户密码，跟token二选一
     * @param {String} options.accessToken - token，跟密码二选一
     * @param {String} options.appKey - Appkey
     */

    connection.prototype.open = function (options) {   
        var appkey = options.appKey,
            orgName = appkey.split('#')[0],
            appName = appkey.split('#')[1];
        this.orgName = orgName;
        this.appName = appName;
        if (options.accessToken) {
            this.token = options.accessToken;
        }
        if (options.xmppURL) {
            this.url = _getXmppUrl(options.xmppURL, this.https);
        }
        if (location.protocol != 'https:' && this.isHttpDNS) {
            this.dnsIndex = 0;
            this.getHttpDNS(options, 'login');
        } else {
            this.login(options);
        }
    };

    /**
     *
     * @param options
     * @private
     */

    connection.prototype.login = function (options) {
        this.user = options.user;
        var pass = _validCheck(options, this);

        if (!pass) {
            return;
        }

        var conn = this;

        if (conn.isOpened()) {
            return;
        }

        if (options.accessToken) {
            options.access_token = options.accessToken;
            conn.context.restTokenData = options;
            _login(options, conn);
        } else {
            var apiUrl = options.apiUrl;
            var userId = this.context.userId;
            var pwd = options.pwd || '';
            var appName = this.context.appName;
            var orgName = this.context.orgName;

            var suc = function (data, xhr) {
                conn.context.status = _code.STATUS_DOLOGIN_IM;
                conn.context.restTokenData = data;
                if (options.success)
                    options.success(data);
                conn.token = data.access_token;
                _login(data, conn);
            };
            var error = function (res, xhr, msg) {
                if (options.error)
                    options.error();
                if (location.protocol != 'https:' && conn.isHttpDNS) {
                    if ((conn.restIndex + 1) < conn.restTotal) {
                        conn.restIndex++;
                        conn.getRestFromHttpDNS(options, 'login');
                        return;
                    }
                }
                conn.clear();
                if (res.error && res.error_description) {
                    conn.onError({
                        type: _code.WEBIM_CONNCTION_OPEN_USERGRID_ERROR,
                        data: res,
                        xhr: xhr
                    });
                } else {
                    conn.onError({
                        type: _code.WEBIM_CONNCTION_OPEN_ERROR,
                        data: res,
                        xhr: xhr
                    });
                }
            };

            this.context.status = _code.STATUS_DOLOGIN_USERGRID;

            var loginJson = {
                grant_type: 'password',
                username: userId,
                password: pwd,
                timestamp: +new Date()
            };
            var loginfo = _utils.stringify(loginJson);

            var options2 = {
                url: apiUrl + '/' + orgName + '/' + appName + '/token',
                dataType: 'json',
                data: loginfo,
                success: suc || _utils.emptyfn,
                error: error || _utils.emptyfn
            };
            _utils.ajax(options2);
        }
    };

    /**
     * attach to xmpp server for BOSH
     * @private
     */
    connection.prototype.attach = function (options) {
        var pass = _validCheck(options, this);

        if (!pass) {
            return;
        }

        options = options || {};

        var accessToken = options.accessToken || '';
        if (accessToken == '') {
            this.onError({
                type: _code.WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR
            });
            return;
        }

        var sid = options.sid || '';
        if (sid === '') {
            this.onError({
                type: _code.WEBIM_CONNCTION_SESSIONID_NOT_ASSIGN_ERROR
            });
            return;
        }

        var rid = options.rid || '';
        if (rid === '') {
            this.onError({
                type: _code.WEBIM_CONNCTION_RID_NOT_ASSIGN_ERROR
            });
            return;
        }

        var stropheConn = this.getStrophe();

        this.context.accessToken = accessToken;
        this.context.stropheConn = stropheConn;
        this.context.status = _code.STATUS_DOLOGIN_IM;

        var conn = this;
        var callback = function (status, msg) {
            _loginCallback(status, msg, conn);
        };

        var jid = this.context.jid;
        var wait = this.wait;
        var hold = this.hold;
        var wind = this.wind || 5;
        stropheConn.attach(jid, sid, rid, callback, wait, hold, wind);
    };

    /**
     * 断开连接，同时心跳停止
     * @param {String} reason
     */

    connection.prototype.close = function (reason) {
        this.logOut = true;
        this.stopHeartBeat();

        var status = this.context.status;
        if (status == _code.STATUS_INIT) {
            return;
        }

        if (this.isClosed() || this.isClosing()) {
            return;
        }

        this.context.status = _code.STATUS_CLOSING;
        this.context.stropheConn.disconnect(reason);
    };

    /**
     * strophe 的方法
     * @private
     */

    connection.prototype.addHandler = function (handler, ns, name, type, id, from, options) {
        this.context.stropheConn.addHandler(handler, ns, name, type, id, from, options);
    };

    /**
     * strophe sendIQ
     * @private
     */
    connection.prototype.notifyVersion = function (suc, fail) {
        var jid = _getJid({}, this);
        var dom = $iq({
            from: this.context.jid || ''
            , to: this.domain
            , type: 'result'
        })
            .c('query', {xmlns: 'jabber:iq:version'})
            .c('name')
            .t('easemob')
            .up()
            .c('version')
            .t(_version)
            .up()
            .c('os')
            .t('webim');

        var suc = suc || _utils.emptyfn;
        var error = fail || this.onError;
        var failFn = function (ele) {
            error({
                type: _code.WEBIM_CONNCTION_NOTIFYVERSION_ERROR
                , data: ele
            });
        };
        this.context.stropheConn.sendIQ(dom.tree(), suc, failFn);
        return;
    };

    /**
     * handle all types of presence message
     * @private
     */
    connection.prototype.handlePresence = function (msginfo) {
        if (this.isClosed()) {
            return;
        }
        var from = msginfo.getAttribute('from') || '';
        var to = msginfo.getAttribute('to') || '';
        var type = msginfo.getAttribute('type') || '';
        var presence_type = msginfo.getAttribute('presence_type') || '';
        var fromUser = _parseNameFromJidFn(from);
        var toUser = _parseNameFromJidFn(to);
        var isCreate = false;
        var isMemberJoin = false;
        var isDecline = false;
        var isApply = false;
        var info = {
            from: fromUser,
            to: toUser,
            fromJid: from,
            toJid: to,
            type: type,
            chatroom: msginfo.getElementsByTagName('roomtype').length ? true : false
        };

        var showTags = msginfo.getElementsByTagName('show');
        if (showTags && showTags.length > 0) {
            var showTag = showTags[0];
            info.show = Strophe.getText(showTag);
        }
        var statusTags = msginfo.getElementsByTagName('status');
        if (statusTags && statusTags.length > 0) {
            var statusTag = statusTags[0];
            info.status = Strophe.getText(statusTag);
            info.code = statusTag.getAttribute('code');
        }

        var priorityTags = msginfo.getElementsByTagName('priority');
        if (priorityTags && priorityTags.length > 0) {
            var priorityTag = priorityTags[0];
            info.priority = Strophe.getText(priorityTag);
        }

        var error = msginfo.getElementsByTagName('error');
        if (error && error.length > 0) {
            var error = error[0];
            info.error = {
                code: error.getAttribute('code')
            };
        }

        var destroy = msginfo.getElementsByTagName('destroy');
        if (destroy && destroy.length > 0) {
            var destroy = destroy[0];
            info.destroy = true;

            var reason = destroy.getElementsByTagName('reason');
            if (reason && reason.length > 0) {
                info.reason = Strophe.getText(reason[0]);
            }
        }

        var members = msginfo.getElementsByTagName('item');
        if (members && members.length > 0) {
            var member = members[0];
            var role = member.getAttribute('role');
            var jid = member.getAttribute('jid');
            var affiliation = member.getAttribute('affiliation');
            // dismissed by group
            if (role == 'none' && jid) {
                var kickedMember = _parseNameFromJidFn(jid);
                var actor = member.getElementsByTagName('actor')[0];
                var actorNick = actor.getAttribute('nick');
                info.actor = actorNick;
                info.kicked = kickedMember;
            }
            // Service Acknowledges Room Creation `createGroupACK`
            if (role == 'moderator' && info.code == '201') {
                if (affiliation === 'owner') {
                    info.type = 'createGroupACK';
                    isCreate = true;
                }
                // else
                //     info.type = 'joinPublicGroupSuccess';
            }
        }

        var x = msginfo.getElementsByTagName('x');
        if (x && x.length > 0) {
            // 加群申请
            var apply = x[0].getElementsByTagName('apply');
            // 加群成功
            var accept = x[0].getElementsByTagName('accept');
            // 同意加群后用户进群通知
            var item = x[0].getElementsByTagName('item');
            // 加群被拒绝
            var decline = x[0].getElementsByTagName('decline');
            // 被设为管理员
            var addAdmin = x[0].getElementsByTagName('add_admin');
            // 被取消管理员
            var removeAdmin = x[0].getElementsByTagName('remove_admin');
            // 被禁言
            var addMute = x[0].getElementsByTagName('add_mute');
            // 取消禁言
            var removeMute = x[0].getElementsByTagName('remove_mute');

            if (apply && apply.length > 0) {
                isApply = true;
                info.toNick = apply[0].getAttribute('toNick');
                info.type = 'joinGroupNotifications';
                var groupJid = apply[0].getAttribute('to');
                var gid = groupJid.split('@')[0].split('_');
                gid = gid[gid.length - 1];
                info.gid = gid;
            } else if (accept && accept.length > 0) {
                info.type = 'joinPublicGroupSuccess';
            } else if (item && item.length > 0) {
                var affiliation = item[0].getAttribute('affiliation'),
                    role = item[0].getAttribute('role');
                if (affiliation == 'member'
                    ||
                    role == 'participant') {
                    isMemberJoin = true;
                    info.mid = info.fromJid.split('/');
                    info.mid = info.mid[info.mid.length - 1];
                    info.type = 'memberJoinPublicGroupSuccess';
                    var roomtype = msginfo.getElementsByTagName('roomtype');
                    if (roomtype && roomtype.length > 0) {
                        var type = roomtype[0].getAttribute('type');
                        if (type == 'chatroom') {
                            info.type = 'memberJoinChatRoomSuccess';
                        }
                    }
                }
            } else if (decline && decline.length) {
                isDecline = true;
                var gid = decline[0].getAttribute("fromNick");
                var owner = _parseNameFromJidFn(decline[0].getAttribute("from"));
                info.type = "joinPublicGroupDeclined";
                info.owner = owner;
                info.gid = gid;
            } else if (addAdmin && addAdmin.length > 0) {
                var gid = _parseNameFromJidFn(addAdmin[0].getAttribute('mucjid'));
                var owner = _parseNameFromJidFn(addAdmin[0].getAttribute('from'));
                info.owner = owner;
                info.gid = gid;
                info.type = "addAdmin";
            } else if (removeAdmin && removeAdmin.length > 0) {
                var gid = _parseNameFromJidFn(removeAdmin[0].getAttribute('mucjid'));
                var owner = _parseNameFromJidFn(removeAdmin[0].getAttribute('from'));
                info.owner = owner;
                info.gid = gid;
                info.type = "removeAdmin";
            } else if (addMute && addMute.length > 0) {
                var gid = _parseNameFromJidFn(addMute[0].getAttribute('mucjid'));
                var owner = _parseNameFromJidFn(addMute[0].getAttribute('from'));
                info.owner = owner;
                info.gid = gid;
                info.type = "addMute";
            } else if (removeMute && removeMute.length > 0) {
                var gid = _parseNameFromJidFn(removeMute[0].getAttribute('mucjid'));
                var owner = _parseNameFromJidFn(removeMute[0].getAttribute('from'));
                info.owner = owner;
                info.gid = gid;
                info.type = "removeMute";
            }
        }


        if (info.chatroom) {
            // diff the
            info.presence_type = presence_type;
            info.original_type = info.type;
            var reflectUser = from.slice(from.lastIndexOf('/') + 1);

            if (reflectUser === this.context.userId) {
                if (info.type === '' && !info.code) {
                    info.type = 'joinChatRoomSuccess';
                } else if (presence_type === 'unavailable' || info.type === 'unavailable') {
                    if (!info.status) {// logout successfully.
                        info.type = 'leaveChatRoom';
                    } else if (info.code == 110) {// logout or dismissied by admin.
                        info.type = 'leaveChatRoom';
                    } else if (info.error && info.error.code == 406) {// The chat room is full.
                        info.type = 'reachChatRoomCapacity';
                    }
                }
            }
        } else {
            info.presence_type = presence_type;
            info.original_type = type;

            if (/subscribe/.test(info.type)) {
                //subscribe | subscribed | unsubscribe | unsubscribed
            } else if (type == ""
                &&
                !info.status
                &&
                !info.error
                &&
                !isCreate
                &&
                !isApply
                &&
                !isMemberJoin
                &&
                !isDecline
            ) {
                console.log(2222222, msginfo, info, isApply);
                // info.type = 'joinPublicGroupSuccess';
            } else if (presence_type === 'unavailable' || type === 'unavailable') {// There is no roomtype when a chat room is deleted.
                if (info.destroy) {// Group or Chat room Deleted.
                    info.type = 'deleteGroupChat';
                } else if (info.code == 307 || info.code == 321) {// Dismissed by group.
                    var nick = msginfo.getAttribute('nick');
                    if (!nick)
                        info.type = 'leaveGroup';
                    else
                        info.type = 'removedFromGroup';
                }
            }
        }
        this.onPresence(info, msginfo);
    };

    /**
     * @private
     */

    connection.prototype.handlePing = function (e) {
        if (this.isClosed()) {
            return;
        }
        var id = e.getAttribute('id');
        var from = e.getAttribute('from');
        var to = e.getAttribute('to');
        var dom = $iq({
            from: to
            , to: from
            , id: id
            , type: 'result'
        });
        this.sendCommand(dom.tree());
    };

    /**
     * @private
     */

    connection.prototype.handleIq = function (iq) {
        return true;
    };

    /**
     * @private
     */
    connection.prototype.handleIqPrivacy = function (msginfo) {
        var list = msginfo.getElementsByTagName('list');
        if (list.length == 0) {
            return;
        }
        this.getBlacklist();
    };

    /**
     * @private
     */
    connection.prototype.handleIqRoster = function (e) {
        var id = e.getAttribute('id');
        var from = e.getAttribute('from') || '';
        var name = _parseNameFromJidFn(from);
        var curJid = this.context.jid;
        var curUser = this.context.userId;

        var iqresult = $iq({type: 'result', id: id, from: curJid});
        this.sendCommand(iqresult.tree());

        var msgBodies = e.getElementsByTagName('query');
        if (msgBodies && msgBodies.length > 0) {
            var queryTag = msgBodies[0];
            var rouster = _parseFriend(queryTag, this, from);
            this.onRoster(rouster);
        }
        return true;
    };

    /**
     * @private
     */
    connection.prototype.handleMessage = function (msginfo) {
        var self = this;
        if (this.isClosed()) {
            return;
        }

        var id = msginfo.getAttribute('id') || '';


        // cache ack into sendQueue first , handelSendQueue will do the send thing with the speed of  5/s
        this.cacheReceiptsMessage({
            id: id
        });
        var parseMsgData = _parseResponseMessage(msginfo);
        if (parseMsgData.errorMsg) {
            this.handlePresence(msginfo);
            return;
        }
        // send error
        var error = msginfo.getElementsByTagName('error');
        var errorCode = '';
        var errorText = '';
        var errorBool = false;
        if (error.length > 0) {
            errorBool = true;
            errorCode = error[0].getAttribute('code');
            var textDOM = error[0].getElementsByTagName('text');
            errorText = textDOM[0].textContent || textDOM[0].text;
        }

        var msgDatas = parseMsgData.data;
        for (var i in msgDatas) {
            if (!msgDatas.hasOwnProperty(i)) {
                continue;
            }
            var msg = msgDatas[i];
            if (!msg.from || !msg.to) {
                continue;
            }

            var from = (msg.from + '').toLowerCase();
            var too = (msg.to + '').toLowerCase();
            var extmsg = msg.ext || {};
            var chattype = '';
            var typeEl = msginfo.getElementsByTagName('roomtype');
            if (typeEl.length) {
                chattype = typeEl[0].getAttribute('type') || 'chat';
            } else {
                chattype = msginfo.getAttribute('type') || 'chat';
            }

            var msgBodies = msg.bodies;
            if (!msgBodies || msgBodies.length == 0) {
                continue;
            }
            var msgBody = msg.bodies[0];
            var type = msgBody.type;
            var isCmdMsg = false;

            try {
                switch (type) {
                    case 'txt':
                        var receiveMsg = msgBody.msg;
                        if (self.encrypt.type === 'base64') {
                            receiveMsg = atob(receiveMsg);
                        } else if (self.encrypt.type === 'aes') {
                            var key = CryptoJS.enc.Utf8.parse(self.encrypt.key);
                            var iv = CryptoJS.enc.Utf8.parse(self.encrypt.iv);
                            var mode = self.encrypt.mode.toLowerCase();
                            var option = {};
                            if (mode === 'cbc') {
                                option = {
                                    iv: iv,
                                    mode: CryptoJS.mode.CBC,
                                    padding: CryptoJS.pad.Pkcs7
                                };
                            } else if (mode === 'ebc') {
                                option = {
                                    mode: CryptoJS.mode.ECB,
                                    padding: CryptoJS.pad.Pkcs7
                                }
                            }
                            var encryptedBase64Str = receiveMsg;
                            var decryptedData = CryptoJS.AES.decrypt(encryptedBase64Str, key, option);
                            var decryptedStr = decryptedData.toString(CryptoJS.enc.Utf8);
                            receiveMsg = decryptedStr;
                        }
                        var emojibody = _utils.parseTextMessage(receiveMsg, WebIM.Emoji);
                        if (emojibody.isemoji) {
                            var msg = {
                                id: id
                                , type: chattype
                                , from: from
                                , to: too
                                , delay: parseMsgData.delayTimeStamp
                                , data: emojibody.body
                                , ext: extmsg
                            };
                            !msg.delay && delete msg.delay;
                            msg.error = errorBool;
                            msg.errorText = errorText;
                            msg.errorCode = errorCode;
                            this.onEmojiMessage(msg);
                        } else {
                            var msg = {
                                id: id
                                , type: chattype
                                , from: from
                                , to: too
                                , delay: parseMsgData.delayTimeStamp
                                , data: receiveMsg
                                , ext: extmsg
                            };
                            !msg.delay && delete msg.delay;
                            msg.error = errorBool;
                            msg.errorText = errorText;
                            msg.errorCode = errorCode;
                            this.onTextMessage(msg);
                        }
                        break;
                    case 'img':
                        var rwidth = 0;
                        var rheight = 0;
                        if (msgBody.size) {
                            rwidth = msgBody.size.width;
                            rheight = msgBody.size.height;
                        }
                        var msg = {
                            id: id
                            , type: chattype
                            , from: from
                            , to: too
                            ,
                            url: (location.protocol != 'https:' && self.isHttpDNS) ? (self.apiUrl + msgBody.url.substr(msgBody.url.indexOf("/", 9))) : msgBody.url
                            , secret: msgBody.secret
                            , filename: msgBody.filename
                            , thumb: msgBody.thumb
                            , thumb_secret: msgBody.thumb_secret
                            , file_length: msgBody.file_length || ''
                            , width: rwidth
                            , height: rheight
                            , filetype: msgBody.filetype || ''
                            , accessToken: this.context.accessToken || ''
                            , ext: extmsg
                            , delay: parseMsgData.delayTimeStamp
                        };
                        !msg.delay && delete msg.delay;
                        msg.error = errorBool;
                        msg.errorText = errorText;
                        msg.errorCode = errorCode;
                        this.onPictureMessage(msg);
                        break;
                    case 'audio':
                        var msg = {
                            id: id
                            , type: chattype
                            , from: from
                            , to: too
                            ,
                            url: (location.protocol != 'https:' && self.isHttpDNS) ? (self.apiUrl + msgBody.url.substr(msgBody.url.indexOf("/", 9))) : msgBody.url
                            , secret: msgBody.secret
                            , filename: msgBody.filename
                            , length: msgBody.length || ''
                            , file_length: msgBody.file_length || ''
                            , filetype: msgBody.filetype || ''
                            , accessToken: this.context.accessToken || ''
                            , ext: extmsg
                            , delay: parseMsgData.delayTimeStamp
                        };
                        !msg.delay && delete msg.delay;
                        msg.error = errorBool;
                        msg.errorText = errorText;
                        msg.errorCode = errorCode;
                        this.onAudioMessage(msg);
                        break;
                    case 'file':
                        var msg = {
                            id: id
                            , type: chattype
                            , from: from
                            , to: too
                            ,
                            url: (location.protocol != 'https:' && self.isHttpDNS) ? (self.apiUrl + msgBody.url.substr(msgBody.url.indexOf("/", 9))) : msgBody.url
                            , secret: msgBody.secret
                            , filename: msgBody.filename
                            , file_length: msgBody.file_length
                            , accessToken: this.context.accessToken || ''
                            , ext: extmsg
                            , delay: parseMsgData.delayTimeStamp
                        };
                        !msg.delay && delete msg.delay;
                        msg.error = errorBool;
                        msg.errorText = errorText;
                        msg.errorCode = errorCode;
                        this.onFileMessage(msg);
                        break;
                    case 'loc':
                        var msg = {
                            id: id
                            , type: chattype
                            , from: from
                            , to: too
                            , addr: msgBody.addr
                            , lat: msgBody.lat
                            , lng: msgBody.lng
                            , ext: extmsg
                            , delay: parseMsgData.delayTimeStamp
                        };
                        !msg.delay && delete msg.delay;
                        msg.error = errorBool;
                        msg.errorText = errorText;
                        msg.errorCode = errorCode;
                        this.onLocationMessage(msg);
                        break;
                    case 'video':
                        var msg = {
                            id: id
                            , type: chattype
                            , from: from
                            , to: too
                            ,
                            url: (location.protocol != 'https:' && self.isHttpDNS) ? (self.apiUrl + msgBody.url.substr(msgBody.url.indexOf("/", 9))) : msgBody.url
                            , secret: msgBody.secret
                            , filename: msgBody.filename
                            , file_length: msgBody.file_length
                            , accessToken: this.context.accessToken || ''
                            , ext: extmsg
                            , delay: parseMsgData.delayTimeStamp
                        };
                        !msg.delay && delete msg.delay;
                        msg.error = errorBool;
                        msg.errorText = errorText;
                        msg.errorCode = errorCode;
                        this.onVideoMessage(msg);
                        break;
                    case 'cmd':
                        var msg = {
                            id: id
                            , from: from
                            , to: too
                            , action: msgBody.action
                            , ext: extmsg
                            , delay: parseMsgData.delayTimeStamp
                        };
                        !msg.delay && delete msg.delay;
                        msg.error = errorBool;
                        msg.errorText = errorText;
                        msg.errorCode = errorCode;
                        if(msgBody.action === 'em_retrieve_dns'){
                            isCmdMsg = true;
                        }
                        if(msgBody.action.indexOf("em_") !== 0){
                            self.onCmdMessage(msg);
                        }
                        else{
                            var ackMessage = new WebIM.message("read", self.getUniqueId())
                            ackMessage.set({ id: msg.id, to: msg.from, ext: { logo: "easemob" } })
                            self.send(ackMessage.body)
                            self.handelSendQueue();        
                        }
                        break;
                }
                ;
                if (self.delivery) {
                    var msgId = self.getUniqueId();
                    var bodyId = msg.id;
                    var deliverMessage = new WebIM.message('delivery', msgId);
                    deliverMessage.set({
                        id: bodyId
                        , to: msg.from
                    });
                    self.send(deliverMessage.body);
                }
                isCmdMsg && this.close();       //action==em_retrieve_dns 的cmd消息用于迁集群，退出重新登录以获取config信息
            } catch (e) {
                this.onError({
                    type: _code.WEBIM_CONNCTION_CALLBACK_INNER_ERROR
                    , data: e
                });
            }
        }
    };

    /**
     * @private
     */
    connection.prototype.handleDeliveredMessage = function (message) {
        var id = message.id;
        var body = message.getElementsByTagName('body');
        var mid = 0;
        mid = body[0].innerHTML;
        var msg = {
            mid: mid
        };
        this.onDeliverdMessage(msg);
        this.sendReceiptsMessage({
            id: id
        });
    };

    /**
     * @private
     */
    connection.prototype.handleAckedMessage = function (message) {
        var id = message.id;
        var body = message.getElementsByTagName('body');
        var mid = 0;
        mid = body[0].innerHTML;
        var msg = {
            mid: mid
        };
        this.onReadMessage(msg);
        this.sendReceiptsMessage({
            id: id
        });
    };

    /**
     * @private
     */
    connection.prototype.handleReceivedMessage = function (message) {
        try {
            var received = message.getElementsByTagName("received");
            var mid = received[0].getAttribute('mid');
            var body = message.getElementsByTagName("body");
            var id = body[0].innerHTML;
            var msg = {
                mid: mid,
                id: id
            };
            this.onReceivedMessage(msg);
        } catch (e) {
            this.onError({
                type: _code.WEBIM_CONNCTION_CALLBACK_INNER_ERROR
                , data: e
            });
        }

        var rcv = message.getElementsByTagName('received'),
            id,
            mid;

        if (rcv.length > 0) {
            if (rcv[0].childNodes && rcv[0].childNodes.length > 0) {
                id = rcv[0].childNodes[0].nodeValue;
            } else {
                id = rcv[0].innerHTML || rcv[0].innerText;
            }
            mid = rcv[0].getAttribute('mid');
        }

        if (_msgHash[id]) {
            try {
                _msgHash[id].msg.success instanceof Function && _msgHash[id].msg.success(id, mid);
            } catch (e) {
                this.onError({
                    type: _code.WEBIM_CONNCTION_CALLBACK_INNER_ERROR
                    , data: e
                });
            }
            delete _msgHash[id];
        }
    };

    /**
     * @private
     */
    connection.prototype.handleInviteMessage = function (message) {
        var form = null;
        var invitemsg = message.getElementsByTagName('invite');
        var reasonDom = message.getElementsByTagName('reason')[0];
        var reasonMsg = reasonDom.textContent;
        var id = message.getAttribute('id') || '';
        this.sendReceiptsMessage({
            id: id
        });

        if (invitemsg && invitemsg.length > 0) {
            var fromJid = invitemsg[0].getAttribute('from');
            form = _parseNameFromJidFn(fromJid);
        }
        var xmsg = message.getElementsByTagName('x');
        var roomid = null;
        if (xmsg && xmsg.length > 0) {
            for (var i = 0; i < xmsg.length; i++) {
                if ('jabber:x:conference' === xmsg[i].namespaceURI) {
                    var roomjid = xmsg[i].getAttribute('jid');
                    roomid = _parseNameFromJidFn(roomjid);
                }
            }
        }
        this.onInviteMessage({
            type: 'invite',
            from: form,
            roomid: roomid,
            reason: reasonMsg
        });
    };

    /**
     * @private
     */
    connection.prototype.handleMutedMessage = function (message) {
        var id = message.id;
        this.onMutedMessage({
            mid: id
        });
    };

    /**
     * @private
     */
    connection.prototype.sendCommand = function (dom, id) {
        if (this.isOpened()) {
            this.context.stropheConn.send(dom);
        } else {
            this.unSendMsgArr.push(dom);
            if(!this.offLineSendConnecting && !this.logOut){
                this.offLineSendConnecting = true;
                this.reconnect();
            }
            this.onError({
                type: _code.WEBIM_CONNCTION_DISCONNECTED,
                reconnect: true
            });
        }
    };

    /**
     * 随机生成一个id用于消息id
     * @param {String} [prefix=WEBIM_] - 前缀
     * @returns {String} 唯一的id
     */
    connection.prototype.getUniqueId = function (prefix) {
        // fix: too frequently msg sending will make same id
        if (this.autoIncrement) {
            this.autoIncrement++
        } else {
            this.autoIncrement = 1
        }
        var cdate = new Date();
        var offdate = new Date(2010, 1, 1);
        var offset = cdate.getTime() - offdate.getTime();
        var hexd = parseFloat(offset).toString(16) + this.autoIncrement;

        if (typeof prefix === 'string' || typeof prefix === 'number') {
            return prefix + '_' + hexd;
        } else {
            return 'WEBIM_' + hexd;
        }
    };

    /**
     * send message
     * @param {Object} messageSource - 由 Class Message 生成
     * @example
     *var deliverMessage = new WebIM.message('delivery', msgId);
     *deliverMessage.set({
     *  id: msgId, 
     *  to: msg.from
     *});
     *conn.send(deliverMessage.body);
     */

    connection.prototype.send = function (messageSource) {
        var self = this;
        var message = messageSource;
        if (message.type === 'txt') {
            if (this.encrypt.type === 'base64') {
                message = _.clone(messageSource);
                message.msg = btoa(message.msg);
            } else if (this.encrypt.type === 'aes') {
                message = _.clone(messageSource);
                var key = CryptoJS.enc.Utf8.parse(this.encrypt.key);
                var iv = CryptoJS.enc.Utf8.parse(this.encrypt.iv);
                var mode = this.encrypt.mode.toLowerCase();
                var option = {};
                if (mode === 'cbc') {
                    option = {
                        iv: iv,
                        mode: CryptoJS.mode.CBC,
                        padding: CryptoJS.pad.Pkcs7
                    };
                } else if (mode === 'ebc') {
                    option = {
                        mode: CryptoJS.mode.ECB,
                        padding: CryptoJS.pad.Pkcs7
                    }
                }
                var encryptedData = CryptoJS.AES.encrypt(message.msg, key, option);

                message.msg = encryptedData.toString();
            }
        }
        if (this.isWindowSDK) {
            WebIM.doQuery('{"type":"sendMessage","to":"' + message.to + '","message_type":"' + message.type + '","msg":"' + encodeURI(message.msg) + '","chatType":"' + message.chatType + '"}',
                function (response) {
                },
                function (code, msg) {
                    var message = {
                        data: {
                            data: "send"
                        },
                        type: _code.WEBIM_MESSAGE_SED_ERROR
                    };
                    self.onError(message);
                });
        } else {
            if (Object.prototype.toString.call(message) === '[object Object]') {
                var appKey = this.context.appKey || '';
                var toJid = appKey + '_' + message.to + '@' + this.domain;

                if (message.group) {
                    toJid = appKey + '_' + message.to + '@conference.' + this.domain;
                }
                if (message.resource) {
                    toJid = toJid + '/' + message.resource;
                }

                message.toJid = toJid;
                message.id = message.id || this.getUniqueId();
                _msgHash[message.id] = new _message(message);
                _msgHash[message.id].send(this);
            } else if (typeof message === 'string') {
                _msgHash[message] && _msgHash[message].send(this);
            }
        }
    };

    /**
     * 添加联系人，已废弃不用
     * @param {Object} options
     * @deprecated
     */

    connection.prototype.addRoster = function (options) {
        var jid = _getJid(options, this);
        var name = options.name || '';
        var groups = options.groups || '';

        var iq = $iq({type: 'set'});
        iq.c('query', {xmlns: 'jabber:iq:roster'});
        iq.c('item', {jid: jid, name: name});

        if (groups) {
            for (var i = 0; i < groups.length; i++) {
                iq.c('group').t(groups[i]).up();
            }
        }
        var suc = options.success || _utils.emptyfn;
        var error = options.error || _utils.emptyfn;
        this.context.stropheConn.sendIQ(iq.tree(), suc, error);
    };

    /**
     * 删除联系人
     *
     * @param {Object} options
     * @param {String} options.to - 想要删除的联系人ID
     * @param {String} options.resource - （****不清楚）
     * @param {Function} options.error - 获取好友列表失败
     * @param {Function} options.success - 成功回调，在这里面调用connection.unsubscribed才能真正删除联系人
     * @fires connection#unsubscribed
     */

    connection.prototype.removeRoster = function (options) {
        var jid = _getJid(options, this);
        var iq = $iq({type: 'set'}).c('query', {xmlns: 'jabber:iq:roster'}).c('item', {
            jid: jid,
            subscription: 'remove'
        });

        var suc = options.success || _utils.emptyfn;
        var error = options.error || _utils.emptyfn;
        this.context.stropheConn.sendIQ(iq, suc, error);
    };

    /**
     * 获取联系人
     * @param {Object} options
     * @param {Function} options.error - 获取好友列表失败
     * @param {Function} options.success - 获取好友列表成功
     */
    connection.prototype.getRoster = function (options) {
        var conn = this;
        var dom = $iq({
            type: 'get'
        }).c('query', {xmlns: 'jabber:iq:roster'});

        var options = options || {};
        var suc = options.success || this.onRoster;
        var completeFn = function (ele) {
            var rouster = [];
            var msgBodies = ele.getElementsByTagName('query');
            if (msgBodies && msgBodies.length > 0) {
                var queryTag = msgBodies[0];
                rouster = _parseFriend(queryTag);
            }
            suc(rouster, ele);
        };
        var error = options.error || this.onError;
        var failFn = function (ele) {
            error({
                type: _code.WEBIM_CONNCTION_GETROSTER_ERROR
                , data: ele
            });
        };
        if (this.isOpened()) {
            this.context.stropheConn.sendIQ(dom.tree(), completeFn, failFn);
        } else {
            error({
                type: _code.WEBIM_CONNCTION_DISCONNECTED
            });
        }
    };

    /**
     * 订阅和反向订阅
     * @example
     *
     * A订阅B（A添加B为好友）
     * A执行：
     *  conn.subscribe({
                    to: 'B',
                    message: 'Hello~'
                });
     B的监听函数onPresence参数message.type == subscribe监听到有人订阅他
     B执行：
     conn.subscribed({
                    to: 'A',
                    message: '[resp:true]'
              });
     同意A的订阅请求
     B继续执行：
     conn.subscribe({
                    to: 'A',
                    message: '[resp:true]'
                });
     反向订阅A，这样才算双方添加好友成功。
     若B拒绝A的订阅请求，只需执行：
     conn.unsubscribed({
                            to: 'A',
                            message: 'I don't want to be subscribed'
                        });
     另外，在监听函数onPresence参数message.type == "subscribe"这个case中，加一句
     if (message && message.status === '[resp:true]') {
                return;
            }
     否则会进入死循环
     *
     * @param {Object} options - 想要订阅的联系人信息
     * @param {String} options.to - 想要订阅的联系人ID
     * @param {String} options.nick - 想要订阅的联系人ID （非必须）
     * @param {String} options.message - 发送给想要订阅的联系人的验证消息（非必须）
     */
    connection.prototype.subscribe = function (options) {
        var jid = _getJid(options, this);
        var pres = $pres({to: jid, type: 'subscribe'});
        if (options.message) {
            pres.c('status').t(options.message).up();
        }
        if (options.nick) {
            pres.c('nick', {'xmlns': 'http://jabber.org/protocol/nick'}).t(options.nick);
        }
        this.sendCommand(pres.tree());
    };

    /**
     * 被订阅后确认同意被订阅
     * @param {Object} options - 订阅人的信息
     * @param {String} options.to - 订阅人的ID
     * @param {String} options.message=[resp:true] - 默认为[resp:true]，后续将去掉该参数
     */
    connection.prototype.subscribed = function (options) {
        var jid = _getJid(options, this);
        var pres = $pres({to: jid, type: 'subscribed'});

        if (options.message) {
            pres.c('status').t(options.message).up();
        }
        this.sendCommand(pres.tree());
    };

    /**
     * 取消订阅成功，废弃不用
     * @param {Object} options
     * @deprecated
     */
    connection.prototype.unsubscribe = function (options) {
        var jid = _getJid(options, this);
        var pres = $pres({to: jid, type: 'unsubscribe'});

        if (options.message) {
            pres.c('status').t(options.message);
        }
        this.sendCommand(pres.tree());
    };

    /**
     * 拒绝对方的订阅请求
     * @function connection#event:unsubscribed
     * @param {Object} options -
     * @param {String} options.to - 订阅人的ID
     * @param {String} options.message - 发送给拒绝订阅的联系人的验证消息（非必须）
     */
    connection.prototype.unsubscribed = function (options) {
        var jid = _getJid(options, this);
        var pres = $pres({to: jid, type: 'unsubscribed'});

        if (options.message) {
            pres.c('status').t(options.message).up();
        }
        this.sendCommand(pres.tree());
    };

    /**
     * 加入公开群组
     * @param {Object} options
     * @deprecated
     */
    connection.prototype.joinPublicGroup = function (options) {
        var roomJid = this.context.appKey + '_' + options.roomId + '@conference.' + this.domain;
        var room_nick = roomJid + '/' + this.context.userId;
        var suc = options.success || _utils.emptyfn;
        var err = options.error || _utils.emptyfn;
        var errorFn = function (ele) {
            err({
                type: _code.WEBIM_CONNCTION_JOINROOM_ERROR,
                data: ele
            });
        };
        var iq = $pres({
            from: this.context.jid,
            to: room_nick
        })
            .c('x', {xmlns: Strophe.NS.MUC});

        this.context.stropheConn.sendIQ(iq.tree(), suc, errorFn);
    };

    /**
     * 获取聊天室列表
     * @param {Object} options
     * @deprecated
     */
    connection.prototype.listRooms = function (options) {
        var iq = $iq({
            to: options.server || 'conference.' + this.domain,
            from: this.context.jid,
            type: 'get'
        })
            .c('query', {xmlns: Strophe.NS.DISCO_ITEMS});

        var suc = options.success || _utils.emptyfn;
        var error = options.error || this.onError;
        var completeFn = function (result) {
            var rooms = [];
            rooms = _parseRoom(result);
            try {
                suc(rooms);
            } catch (e) {
                error({
                    type: _code.WEBIM_CONNCTION_GETROOM_ERROR,
                    data: e
                });
            }
        };
        var err = options.error || _utils.emptyfn;
        var errorFn = function (ele) {
            err({
                type: _code.WEBIM_CONNCTION_GETROOM_ERROR
                , data: ele
            });
        };
        this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
    };

    /**
     * 获取群组成员列表
     * @param {Object} options
     * @deprecated
     */
    connection.prototype.queryRoomMember = function (options) {
        var domain = this.domain;
        var members = [];
        var iq = $iq({
            to: this.context.appKey + '_' + options.roomId + '@conference.' + this.domain
            , type: 'get'
        })
            .c('query', {xmlns: Strophe.NS.MUC + '#admin'})
            .c('item', {affiliation: 'member'});

        var suc = options.success || _utils.emptyfn;
        var completeFn = function (result) {
            var items = result.getElementsByTagName('item');

            if (items) {
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    var mem = {
                        jid: item.getAttribute('jid')
                        , affiliation: 'member'
                    };
                    members.push(mem);
                }
            }
            suc(members);
        };
        var err = options.error || _utils.emptyfn;
        var errorFn = function (ele) {
            err({
                type: _code.WEBIM_CONNCTION_GETROOMMEMBER_ERROR
                , data: ele
            });
        };
        this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
    };

    /**
     * 获取群组信息
     * @param {Object} options
     * @deprecated
     */
    connection.prototype.queryRoomInfo = function (options) {
        var domain = this.domain;
        var iq = $iq({
            to: this.context.appKey + '_' + options.roomId + '@conference.' + domain,
            type: 'get'
        }).c('query', {xmlns: Strophe.NS.DISCO_INFO});

        var suc = options.success || _utils.emptyfn;
        var members = [];

        var completeFn = function (result) {
            var settings = '';
            var features = result.getElementsByTagName('feature');
            if (features) {
                settings = features[1].getAttribute('var') + '|' + features[3].getAttribute('var') + '|' + features[4].getAttribute('var');
            }
            switch (settings) {
                case 'muc_public|muc_membersonly|muc_notallowinvites':
                    settings = 'PUBLIC_JOIN_APPROVAL';
                    break;
                case 'muc_public|muc_open|muc_notallowinvites':
                    settings = 'PUBLIC_JOIN_OPEN';
                    break;
                case 'muc_hidden|muc_membersonly|muc_allowinvites':
                    settings = 'PRIVATE_MEMBER_INVITE';
                    break;
                case 'muc_hidden|muc_membersonly|muc_notallowinvites':
                    settings = 'PRIVATE_OWNER_INVITE';
                    break;
            }
            var owner = '';
            var fields = result.getElementsByTagName('field');
            var fieldValues = {};
            if (fields) {
                for (var i = 0; i < fields.length; i++) {
                    var field = fields[i];
                    var fieldVar = field.getAttribute('var');
                    var fieldSimplify = fieldVar.split('_')[1];
                    switch (fieldVar) {
                        case 'muc#roominfo_occupants':
                        case 'muc#roominfo_maxusers':
                        case 'muc#roominfo_affiliations':
                        case 'muc#roominfo_description':
                            fieldValues[fieldSimplify] = (field.textContent || field.text || '');
                            break;
                        case 'muc#roominfo_owner':
                            var mem = {
                                jid: (field.textContent || field.text) + '@' + domain
                                , affiliation: 'owner'
                            };
                            members.push(mem);
                            fieldValues[fieldSimplify] = (field.textContent || field.text);
                            break;
                    }

                    // if (field.getAttribute('label') === 'owner') {
                    //     var mem = {
                    //         jid: (field.textContent || field.text) + '@' + domain
                    //         , affiliation: 'owner'
                    //     };
                    //     members.push(mem);
                    //     break;
                    // }
                }
                fieldValues['name'] = (result.getElementsByTagName('identity')[0]).getAttribute('name');
            }
            suc(settings, members, fieldValues);
        };
        var err = options.error || _utils.emptyfn;
        var errorFn = function (ele) {
            err({
                type: _code.WEBIM_CONNCTION_GETROOMINFO_ERROR
                , data: ele
            });
        };
        this.context.stropheConn.sendIQ(iq.tree(), completeFn, errorFn);
    };

    /**
     * 获取聊天室管理员
     * @param {Object} options
     * @deprecated
     */
    connection.prototype.queryRoomOccupants = function (options) {
        var suc = options.success || _utils.emptyfn;
        var completeFn = function (result) {
            var occupants = [];
            occupants = _parseRoomOccupants(result);
            suc(occupants);
        }
        var err = options.error || _utils.emptyfn;
        var errorFn = function (ele) {
            err({
                type: _code.WEBIM_CONNCTION_GETROOMOCCUPANTS_ERROR
                , data: ele
            });
        };
        var attrs = {
            xmlns: Strophe.NS.DISCO_ITEMS
        };
        var info = $iq({
            from: this.context.jid
            , to: this.context.appKey + '_' + options.roomId + '@conference.' + this.domain
            , type: 'get'
        }).c('query', attrs);
        this.context.stropheConn.sendIQ(info.tree(), completeFn, errorFn);
    };

    /**
     *
     * @deprecated
     * @private
     */
    connection.prototype.setUserSig = function (desc) {
        var dom = $pres({xmlns: 'jabber:client'});
        desc = desc || '';
        dom.c('status').t(desc);
        this.sendCommand(dom.tree());
    };

    /**
     *
     * @private
     */
    connection.prototype.setPresence = function (type, status) {
        var dom = $pres({xmlns: 'jabber:client'});
        if (type) {
            if (status) {
                dom.c('show').t(type);
                dom.up().c('status').t(status);
            } else {
                dom.c('show').t(type);
            }
        }
        this.sendCommand(dom.tree());
    };

    /**
     * @private
     *
     */
    connection.prototype.getPresence = function () {
        var dom = $pres({xmlns: 'jabber:client'});
        var conn = this;
        this.sendCommand(dom.tree());
    };

    /**
     * @private
     *
     */
    connection.prototype.ping = function (options) {
        var options = options || {};
        var jid = _getJid(options, this);

        var dom = $iq({
            from: this.context.jid || ''
            , to: jid
            , type: 'get'
        }).c('ping', {xmlns: 'urn:xmpp:ping'});

        var suc = options.success || _utils.emptyfn;
        var error = options.error || this.onError;
        var failFn = function (ele) {
            error({
                type: _code.WEBIM_CONNCTION_PING_ERROR
                , data: ele
            });
        };
        if (this.isOpened()) {
            this.context.stropheConn.sendIQ(dom.tree(), suc, failFn);
        } else {
            error({
                type: _code.WEBIM_CONNCTION_DISCONNECTED
            });
        }
        return;
    };

    /**
     * @private
     *
     */
    connection.prototype.isOpened = function () {
        return this.context.status == _code.STATUS_OPENED;
    };

    /**
     * @private
     *
     */
    connection.prototype.isOpening = function () {
        var status = this.context.status;
        return status == _code.STATUS_DOLOGIN_USERGRID || status == _code.STATUS_DOLOGIN_IM;
    };

    /**
     * @private
     *
     */
    connection.prototype.isClosing = function () {
        return this.context.status == _code.STATUS_CLOSING;
    };

    /**
     * @private
     *
     */
    connection.prototype.isClosed = function () {
        return this.context.status == _code.STATUS_CLOSED;
    };

    /**
     * @private
     *
     */
    connection.prototype.clear = function () {
        var key = this.context.appKey;
        if (this.errorType != _code.WEBIM_CONNCTION_DISCONNECTED) {
            // this.context = {
            //     status: _code.STATUS_INIT,
            //     appKey: key
            // };
            if (this.logOut) {
                this.unSendMsgArr = [];
                this.offLineSendConnecting = false;
                this.context = {
                    status: _code.STATUS_INIT,
                    appKey: key
                };
            }
        }
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.restIndex = 0;
        this.xmppIndex = 0;

        if (this.errorType == _code.WEBIM_CONNCTION_CLIENT_LOGOUT || this.errorType == -1) {
            var message = {
                data: {
                    data: "logout"
                },
                type: _code.WEBIM_CONNCTION_CLIENT_LOGOUT
            };
            this.onError(message);
        }
    };

    /**
     * 获取聊天室列表（分页）
     * @param {Object} options
     * @param {String} options.apiUrl - rest的接口地址
     * @param {Number} options.pagenum - 页码，默认1
     * @param {Number} options.pagesize - 每页数量，默认20
     * @param {String} options.success - 成功之后的回调，参数为返回值；
     */
    connection.prototype.getChatRooms = function (options) {

        if (!_utils.isCanSetRequestHeader) {
            conn.onError({
                type: _code.WEBIM_CONNCTION_NOT_SUPPORT_CHATROOM_ERROR
            });
            return;
        }

        var conn = this,
            token = options.accessToken || this.context.accessToken;

        if (token) {
            var apiUrl = options.apiUrl;
            var appName = this.context.appName;
            var orgName = this.context.orgName;

            if (!appName || !orgName) {
                conn.onError({
                    type: _code.WEBIM_CONNCTION_AUTH_ERROR
                });
                return;
            }

            var suc = function (data, xhr) {
                typeof options.success === 'function' && options.success(data);
            };

            var error = function (res, xhr, msg) {
                if (res.error && res.error_description) {
                    conn.onError({
                        type: _code.WEBIM_CONNCTION_LOAD_CHATROOM_ERROR,
                        msg: res.error_description,
                        data: res,
                        xhr: xhr
                    });
                }
            };

            var pageInfo = {
                pagenum: parseInt(options.pagenum) || 1,
                pagesize: parseInt(options.pagesize) || 20
            };

            var opts = {
                url: apiUrl + '/' + orgName + '/' + appName + '/chatrooms',
                dataType: 'json',
                type: 'GET',
                headers: {'Authorization': 'Bearer ' + token},
                data: pageInfo,
                success: suc || _utils.emptyfn,
                error: error || _utils.emptyfn
            };
            _utils.ajax(opts);
        } else {
            conn.onError({
                type: _code.WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR
            });
        }

    };

    /**
     * 加入聊天室
     * @param {Object} options
     * @param {String} options.roomId - 加入聊天室的id
     * @param {Function} options.success - 加入聊天室成功之后的回调
     * @param {Function} options.error - 加入聊天室失败之后的回调
     */
    connection.prototype.joinChatRoom = function (options) {
        var roomJid = this.context.appKey + '_' + options.roomId + '@conference.' + this.domain;
        var room_nick = roomJid + '/' + this.context.userId;
        var suc = options.success || _utils.emptyfn;
        var err = options.error || _utils.emptyfn;
        var errorFn = function (ele) {
            err({
                type: _code.WEBIM_CONNCTION_JOINCHATROOM_ERROR
                , data: ele
            });
        };

        var iq = $pres({
            from: this.context.jid,
            to: room_nick
        })
            .c('x', {xmlns: Strophe.NS.MUC + '#user'})
            .c('item', {affiliation: 'member', role: 'participant'})
            .up().up()
            .c('roomtype', {xmlns: 'easemob:x:roomtype', type: 'chatroom'});

        this.context.stropheConn.sendIQ(iq.tree(), suc, errorFn);
    };

    /**
     * 退出聊天室
     * @param {Object} options
     * @param {String} options.roomId - 退出聊天室的id
     * @param {Function} options.success - 退出聊天室成功之后的回调
     * @param {Function} options.error - 退出聊天室失败之后的回调
     */
    connection.prototype.quitChatRoom = function (options) {
        var roomJid = this.context.appKey + '_' + options.roomId + '@conference.' + this.domain;
        var room_nick = roomJid + '/' + this.context.userId;
        var suc = options.success || _utils.emptyfn;
        var err = options.error || _utils.emptyfn;
        var errorFn = function (ele) {
            err({
                type: _code.WEBIM_CONNCTION_QUITCHATROOM_ERROR
                , data: ele
            });
        };
        var iq = $pres({
            from: this.context.jid,
            to: room_nick,
            type: 'unavailable'
        })
            .c('x', {xmlns: Strophe.NS.MUC + '#user'})
            .c('item', {affiliation: 'none', role: 'none'})
            .up().up()
            .c('roomtype', {xmlns: 'easemob:x:roomtype', type: 'chatroom'});

        this.context.stropheConn.sendIQ(iq.tree(), suc, errorFn);
    };

    /**
     * for windowSDK
     * @private
     *
     */
    connection.prototype._onReceiveInviteFromGroup = function (info) {
        info = eval('(' + info + ')');
        var self = this;
        var options = {
            title: "Group invitation",
            msg: info.user + " invites you to join into group:" + info.group_id,
            agree: function agree() {
                WebIM.doQuery('{"type":"acceptInvitationFromGroup","id":"' + info.group_id + '","user":"' + info.user + '"}', function (response) {
                }, function (code, msg) {
                    var message = {
                        data: {
                            data: "acceptInvitationFromGroup error:" + msg
                        },
                        type: _code.WEBIM_CONNECTION_ACCEPT_INVITATION_FROM_GROUP
                    };
                    self.onError(message);
                });
            },
            reject: function reject() {
                WebIM.doQuery('{"type":"declineInvitationFromGroup","id":"' + info.group_id + '","user":"' + info.user + '"}', function (response) {
                }, function (code, msg) {
                    var message = {
                        data: {
                            data: "declineInvitationFromGroup error:" + msg
                        },
                        type: _code.WEBIM_CONNECTION_DECLINE_INVITATION_FROM_GROUP
                    };
                    self.onError(message);
                });
            }
        };

        this.onConfirmPop(options);
    };

    /**
     * for windowSDK
     * @private
     *
     */
    connection.prototype._onReceiveInviteAcceptionFromGroup = function (info) {
        info = eval('(' + info + ')');
        var options = {
            title: "Group invitation response",
            msg: info.user + " agreed to join into group:" + info.group_id,
            agree: function agree() {
            }
        };
        this.onConfirmPop(options);
    };

    /**
     * for windowSDK
     * @private
     *
     */
    connection.prototype._onReceiveInviteDeclineFromGroup = function (info) {
        info = eval('(' + info + ')');
        var options = {
            title: "Group invitation response",
            msg: info.user + " rejected to join into group:" + info.group_id,
            agree: function agree() {
            }
        };
        this.onConfirmPop(options);
    };

    /**
     * for windowSDK
     * @private
     *
     */
    connection.prototype._onAutoAcceptInvitationFromGroup = function (info) {
        info = eval('(' + info + ')');
        var options = {
            title: "Group invitation",
            msg: "You had joined into the group:" + info.group_name + " automatically.Inviter:" + info.user,
            agree: function agree() {
            }
        };
        this.onConfirmPop(options);
    };

    /**
     * for windowSDK
     * @private
     *
     */
    connection.prototype._onLeaveGroup = function (info) {
        info = eval('(' + info + ')');
        var options = {
            title: "Group notification",
            msg: "You have been out of the group:" + info.group_id + ".Reason:" + info.msg,
            agree: function agree() {
            }
        };
        this.onConfirmPop(options);
    };

    /**
     * for windowSDK
     * @private
     *
     */
    connection.prototype._onReceiveJoinGroupApplication = function (info) {
        info = eval('(' + info + ')');
        var self = this;
        var options = {
            title: "Group join application",
            msg: info.user + " applys to join into group:" + info.group_id,
            agree: function agree() {
                WebIM.doQuery('{"type":"acceptJoinGroupApplication","id":"' + info.group_id + '","user":"' + info.user + '"}', function (response) {
                }, function (code, msg) {
                    var message = {
                        data: {
                            data: "acceptJoinGroupApplication error:" + msg
                        },
                        type: _code.WEBIM_CONNECTION_ACCEPT_JOIN_GROUP
                    };
                    self.onError(message);
                });
            },
            reject: function reject() {
                WebIM.doQuery('{"type":"declineJoinGroupApplication","id":"' + info.group_id + '","user":"' + info.user + '"}', function (response) {
                }, function (code, msg) {
                    var message = {
                        data: {
                            data: "declineJoinGroupApplication error:" + msg
                        },
                        type: _code.WEBIM_CONNECTION_DECLINE_JOIN_GROUP
                    };
                    self.onError(message);
                });
            }
        };
        this.onConfirmPop(options);
    };

    /**
     * for windowSDK
     * @private
     *
     */
    connection.prototype._onReceiveAcceptionFromGroup = function (info) {
        info = eval('(' + info + ')');
        var options = {
            title: "Group notification",
            msg: "You had joined into the group:" + info.group_name + ".",
            agree: function agree() {
            }
        };
        this.onConfirmPop(options);
    };

    /**
     * for windowSDK
     * @private
     *
     */
    connection.prototype._onReceiveRejectionFromGroup = function () {
        info = eval('(' + info + ')');
        var options = {
            title: "Group notification",
            msg: "You have been rejected to join into the group:" + info.group_name + ".",
            agree: function agree() {
            }
        };
        this.onConfirmPop(options);
    };

    /**
     * for windowSDK
     * @private
     *
     */
    connection.prototype._onUpdateMyGroupList = function (options) {
        this.onUpdateMyGroupList(options);
    };

    /**
     * for windowSDK
     * @private
     *
     */
    connection.prototype._onUpdateMyRoster = function (options) {
        this.onUpdateMyRoster(options);
    };

    /**
     * @private
     *
     */
    connection.prototype.reconnect = function (v) {
        var that = this;
        v && that.xmppIndex++;       //重连时改变ip地址
        setTimeout(function () {
            cc.log("reconnect:"+that.xmppIndex);
            try {
                _login(that.context.restTokenData, that);
            } catch (error) {
                cc.log("reconnect error:"+error);
                that.xmppIndex = 0;
            }

        }, (this.autoReconnectNumTotal == 0 ? 0 : this.autoReconnectInterval) * 1000);
        this.autoReconnectNumTotal++;
    };

    /**
     *
     * @private
     * @deprecated
     */
    connection.prototype.closed = function () {
        var message = {
            data: {
                data: "Closed error"
            },
            type: _code.WEBIM_CONNECTION_CLOSED
        };
        this.onError(message);
    };

    /**
     * used for blacklist
     * @private
     *
     */
    function _parsePrivacy(iq) {
        var list = {};
        var items = iq.getElementsByTagName('item');

        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var jid = item.getAttribute('value');
                var order = item.getAttribute('order');
                var type = item.getAttribute('type');
                if (!jid) {
                    continue;
                }
                var n = _parseNameFromJidFn(jid);
                list[n] = {
                    type: type,
                    order: order,
                    jid: jid,
                    name: n
                };
            }
        }
        return list;
    };

    /**
     * 获取好友黑名单
     * @param {Object} options
     * @param {Function} options.success - 获取好友黑名单成功之后的回调
     * @param {Function} options.error - 获取好友黑名单失败之后的回调
     * @returns {Object} 好友列表
     */
    connection.prototype.getBlacklist = function (options) {
        options = (options || {});
        var iq = $iq({type: 'get'});
        var sucFn = options.success || _utils.emptyfn;
        var errFn = options.error || _utils.emptyfn;
        var me = this;

        iq.c('query', {xmlns: 'jabber:iq:privacy'})
            .c('list', {name: 'special'});

        this.context.stropheConn.sendIQ(iq.tree(), function (iq) {
            me.onBlacklistUpdate(_parsePrivacy(iq));
            sucFn();
        }, function () {
            me.onBlacklistUpdate([]);
            errFn();
        });
    };

    /**
     * 将好友加入到黑名单
     * @param {Object} options
     * @param {Object[]} options.list - json数组，调用这个函数后黑名单的所有名单列表（已经存在的黑名单加上这次新加黑名单），json的key值为好友的ID
     * @param {Object} options.list[].type=jid - 要加到黑名单的好友对象的type，默认是jid
     * @param {Number} options.list[].order - 要加到黑名单的好友对象的order，所有order不重复
     * @param {string} options.list[].jid - 要加到黑名单的好友的jid
     * @param {string} options.list[].name - 要加到黑名单的好友的ID
     */
    connection.prototype.addToBlackList = function (options) {
        var iq = $iq({type: 'set'});
        var blacklist = options.list || {};
        var type = options.type || 'jid';
        var sucFn = options.success || _utils.emptyfn;
        var errFn = options.error || _utils.emptyfn;
        var piece = iq.c('query', {xmlns: 'jabber:iq:privacy'})
            .c('list', {name: 'special'});

        var keys = Object.keys(blacklist);
        var len = keys.length;
        var order = 2;

        for (var i = 0; i < len; i++) {
            var item = blacklist[keys[i]];
            var type = item.type || 'jid';
            var jid = item.jid;

            piece = piece.c('item', {action: 'deny', order: order++, type: type, value: jid})
                .c('message');
            if (i !== len - 1) {
                piece = piece.up().up();
            }
        }

        // console.log('addToBlackList', blacklist, piece.tree());
        this.context.stropheConn.sendIQ(piece.tree(), sucFn, errFn);
    };

    /**
     * 将好友从黑名单移除
     * @param {Object} options
     * @param {Object[]} options.list - json数组，调用这个函数后黑名单的所有名单列表（已经存在的黑名单去掉这次新加黑名单），json的key值为好友的ID
     * @param {Object} options.list[].type=jid - 要加到黑名单的好友对象的type，默认是jid
     * @param {Number} options.list[].order - 要加到黑名单的好友对象的order，所有order不重复
     * @param {string} options.list[].jid - 要加到黑名单的好友的jid
     * @param {string} options.list[].name - 要加到黑名单的好友的ID
     */
    connection.prototype.removeFromBlackList = function (options) {

        var iq = $iq({type: 'set'});
        var blacklist = options.list || {};
        var sucFn = options.success || _utils.emptyfn;
        var errFn = options.error || _utils.emptyfn;
        var piece = iq.c('query', {xmlns: 'jabber:iq:privacy'})
            .c('list', {name: 'special'});

        var keys = Object.keys(blacklist);
        var len = keys.length;

        for (var i = 0; i < len; i++) {
            var item = blacklist[keys[i]];
            var type = item.type || 'jid';
            var jid = item.jid;
            var order = item.order;

            piece = piece.c('item', {action: 'deny', order: order, type: type, value: jid})
                .c('message');
            if (i !== len - 1) {
                piece = piece.up().up();
            }
        }

        // console.log('removeFromBlackList', blacklist, piece.tree());
        this.context.stropheConn.sendIQ(piece.tree(), sucFn, errFn);
    };

    /**
     *
     * @private
     */
    connection.prototype._getGroupJid = function (to) {
        var appKey = this.context.appKey || '';
        return appKey + '_' + to + '@conference.' + this.domain;
    };

    /**
     * 加入群组黑名单
     * @param {Object} options
     * @deprecated
     */
    connection.prototype.addToGroupBlackList = function (options) {
        var sucFn = options.success || _utils.emptyfn;
        var errFn = options.error || _utils.emptyfn;
        var jid = _getJid(options, this);
        var affiliation = 'admin';//options.affiliation || 'admin';
        var to = this._getGroupJid(options.roomId);
        var iq = $iq({type: 'set', to: to});

        iq.c('query', {xmlns: 'http://jabber.org/protocol/muc#' + affiliation})
            .c('item', {
                affiliation: 'outcast',
                jid: jid
            });

        this.context.stropheConn.sendIQ(iq.tree(), sucFn, errFn);
    };

    /**
     *
     * @private
     */
    function _parseGroupBlacklist(iq) {
        var list = {};
        var items = iq.getElementsByTagName('item');

        if (items) {
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var jid = item.getAttribute('jid');
                var affiliation = item.getAttribute('affiliation');
                var nick = item.getAttribute('nick');
                if (!jid) {
                    continue;
                }
                var n = _parseNameFromJidFn(jid);
                list[n] = {
                    jid: jid,
                    affiliation: affiliation,
                    nick: nick,
                    name: n
                };
            }
        }
        return list;
    }

    /**
     * 获取群组黑名单
     * @param {Object} options
     * @deprecated
     */
    connection.prototype.getGroupBlacklist = function (options) {
        var sucFn = options.success || _utils.emptyfn;
        var errFn = options.error || _utils.emptyfn;

        // var jid = _getJid(options, this);
        var affiliation = 'admin';//options.affiliation || 'admin';
        var to = this._getGroupJid(options.roomId);
        var iq = $iq({type: 'get', to: to});

        iq.c('query', {xmlns: 'http://jabber.org/protocol/muc#' + affiliation})
            .c('item', {
                affiliation: 'outcast',
            });

        this.context.stropheConn.sendIQ(iq.tree(), function (msginfo) {
            sucFn(_parseGroupBlacklist(msginfo));
        }, function () {
            errFn();
        });
    };

    /**
     * 从群组黑名单删除
     * @param {Object} options
     * @deprecated
     */
    connection.prototype.removeGroupMemberFromBlacklist = function (options) {
        var sucFn = options.success || _utils.emptyfn;
        var errFn = options.error || _utils.emptyfn;

        var jid = _getJid(options, this);
        var affiliation = 'admin';//options.affiliation || 'admin';
        var to = this._getGroupJid(options.roomId);
        var iq = $iq({type: 'set', to: to});

        iq.c('query', {xmlns: 'http://jabber.org/protocol/muc#' + affiliation})
            .c('item', {
                affiliation: 'none',
                jid: jid
            });

        this.context.stropheConn.sendIQ(iq.tree(), function (msginfo) {
            sucFn();
        }, function () {
            errFn();
        });
    };

    /**
     * changeGroupSubject 修改群名称
     *
     * @param options
     * @deprecated
     */
    // <iq to='easemob-demo#chatdemoui_roomid@conference.easemob.com' type='set' id='3940489311' xmlns='jabber:client'>
    //     <query xmlns='http://jabber.org/protocol/muc#owner'>
    //         <x type='submit' xmlns='jabber:x:data'>
    //             <field var='FORM_TYPE'><value>http://jabber.org/protocol/muc#roomconfig</value></field>
    //             <field var='muc#roomconfig_roomname'><value>Room Name</value></field>
    //         </x>
    //     </query>
    // </iq>

    connection.prototype.changeGroupSubject = function (options) {
        var sucFn = options.success || _utils.emptyfn;
        var errFn = options.error || _utils.emptyfn;

        // must be `owner`
        var affiliation = 'owner';
        var to = this._getGroupJid(options.roomId);
        var iq = $iq({type: 'set', to: to});

        iq.c('query', {xmlns: 'http://jabber.org/protocol/muc#' + affiliation})
            .c('x', {type: 'submit', xmlns: 'jabber:x:data'})
            .c('field', {'var': 'FORM_TYPE'})
            .c('value')
            .t('http://jabber.org/protocol/muc#roomconfig')
            .up().up()
            .c('field', {'var': 'muc#roomconfig_roomname'})
            .c('value')
            .t(options.subject)
            .up().up()
            .c('field', {'var': 'muc#roomconfig_roomdesc'})
            .c('value')
            .t(options.description);


        this.context.stropheConn.sendIQ(iq.tree(), function (msginfo) {
            sucFn();
        }, function () {
            errFn();
        });
    };

    /**
     * 删除群组
     *
     * @param {Object} options -
     * @example
     <iq id="9BEF5D20-841A-4048-B33A-F3F871120E58" to="easemob-demo#chatdemoui_1477462231499@conference.easemob.com" type="set">
     <query xmlns="http://jabber.org/protocol/muc#owner">
     <destroy>
     <reason>xxx destory group yyy</reason>
     </destroy>
     </query>
     </iq>
     * @deprecated
     */
    connection.prototype.destroyGroup = function (options) {
        var sucFn = options.success || _utils.emptyfn;
        var errFn = options.error || _utils.emptyfn;

        // must be `owner`
        var affiliation = 'owner';
        var to = this._getGroupJid(options.roomId);
        var iq = $iq({type: 'set', to: to});

        iq.c('query', {xmlns: 'http://jabber.org/protocol/muc#' + affiliation})
            .c('destroy')
            .c('reason').t(options.reason || '');

        this.context.stropheConn.sendIQ(iq.tree(), function (msginfo) {
            sucFn();
        }, function () {
            errFn();
        });
    };

    /**
     * 主动离开群组
     *
     * @param {Object} options -
     * @example
     <iq id="5CD33172-7B62-41B7-98BC-CE6EF840C4F6_easemob_occupants_change_affiliation" to="easemob-demo#chatdemoui_1477481609392@conference.easemob.com" type="set">
     <query xmlns="http://jabber.org/protocol/muc#admin">
     <item affiliation="none" jid="easemob-demo#chatdemoui_lwz2@easemob.com"/>
     </query>
     </iq>
     <presence to="easemob-demo#chatdemoui_1479811172349@conference.easemob.com/mt002" type="unavailable"/>
     * @deprecated
     */
    connection.prototype.leaveGroupBySelf = function (options) {
        var self = this;
        var sucFn = options.success || _utils.emptyfn;
        var errFn = options.error || _utils.emptyfn;

        // must be `owner`
        var jid = _getJid(options, this);
        var affiliation = 'admin';
        var to = this._getGroupJid(options.roomId);
        var iq = $iq({type: 'set', to: to});

        iq.c('query', {xmlns: 'http://jabber.org/protocol/muc#' + affiliation})
            .c('item', {
                affiliation: 'none',
                jid: jid
            });

        this.context.stropheConn.sendIQ(iq.tree(), function (msgInfo) {
            sucFn(msgInfo);
            var pres = $pres({type: 'unavailable', to: to + '/' + self.context.userId});
            self.sendCommand(pres.tree());
        }, function (errInfo) {
            errFn(errInfo);
        });
    };

    /**
     * 群主从群组中踢人，后续会改为调用RestFul API
     *
     * @param {Object} options -
     * @param {string[]} options.list - 需要从群组移除的好友ID组成的数组
     * @param {string} options.roomId - 群组ID
     * @deprecated
     * @example
     <iq id="9fb25cf4-1183-43c9-961e-9df70e300de4:sendIQ" to="easemob-demo#chatdemoui_1477481597120@conference.easemob.com" type="set" xmlns="jabber:client">
     <query xmlns="http://jabber.org/protocol/muc#admin">
     <item affiliation="none" jid="easemob-demo#chatdemoui_lwz4@easemob.com"/>
     <item jid="easemob-demo#chatdemoui_lwz4@easemob.com" role="none"/>
     <item affiliation="none" jid="easemob-demo#chatdemoui_lwz2@easemob.com"/>
     <item jid="easemob-demo#chatdemoui_lwz2@easemob.com" role="none"/>
     </query>
     </iq>
     */
    connection.prototype.leaveGroup = function (options) {
        var sucFn = options.success || _utils.emptyfn;
        var errFn = options.error || _utils.emptyfn;
        var list = options.list || [];
        var affiliation = 'admin';
        var to = this._getGroupJid(options.roomId);
        var iq = $iq({type: 'set', to: to});
        var piece = iq.c('query', {xmlns: 'http://jabber.org/protocol/muc#' + affiliation});
        var keys = Object.keys(list);
        var len = keys.length;

        for (var i = 0; i < len; i++) {
            var name = list[keys[i]];
            var jid = _getJidByName(name, this);

            piece = piece.c('item', {
                affiliation: 'none',
                jid: jid
            }).up().c('item', {
                role: 'none',
                jid: jid,
            }).up();
        }

        this.context.stropheConn.sendIQ(iq.tree(), function (msgInfo) {
            sucFn(msgInfo);
        }, function (errInfo) {
            errFn(errInfo);
        });
    };

    /**
     * 添加群组成员
     *
     * @param {Object} options -
     * @deprecated
     * @example
     Attention the sequence: message first (每个成员单独发一条message), iq second (多个成员可以合成一条iq发)
     <!-- 添加成员通知：send -->
     <message to='easemob-demo#chatdemoui_1477482739698@conference.easemob.com'>
     <x xmlns='http://jabber.org/protocol/muc#user'>
     <invite to='easemob-demo#chatdemoui_lwz2@easemob.com'>
     <reason>liuwz invite you to join group '谢谢'</reason>
     </invite>
     </x>
     </message>
     <!-- 添加成员：send -->
     <iq id='09DFB1E5-C939-4C43-B5A7-8000DA0E3B73_easemob_occupants_change_affiliation' to='easemob-demo#chatdemoui_1477482739698@conference.easemob.com' type='set'>
     <query xmlns='http://jabber.org/protocol/muc#admin'>
     <item affiliation='member' jid='easemob-demo#chatdemoui_lwz2@easemob.com'/>
     </query>
     </iq>
     */
    connection.prototype.addGroupMembers = function (options) {
        console.log(10101010);
        var sucFn = options.success || _utils.emptyfn;
        var errFn = options.error || _utils.emptyfn;
        var list = options.list || [];
        var affiliation = 'admin';
        var to = this._getGroupJid(options.roomId);
        var iq = $iq({type: 'set', to: to});
        var piece = iq.c('query', {xmlns: 'http://jabber.org/protocol/muc#' + affiliation});
        var len = list.length;

        for (var i = 0; i < len; i++) {

            var name = list[i];
            var jid = _getJidByName(name, this);

            piece = piece.c('item', {
                affiliation: 'member',
                jid: jid
            }).up();

            var dom = $msg({
                to: to
            }).c('x', {
                xmlns: 'http://jabber.org/protocol/muc#user'
            }).c('invite', {
                to: jid
            }).c('reason').t(options.reason || '');

            this.sendCommand(dom.tree());

        }

        this.context.stropheConn.sendIQ(iq.tree(), function (msgInfo) {
            sucFn(msgInfo);
        }, function (errInfo) {
            errFn(errInfo);
        });
    };

    /**
     * acceptInviteFromGroup 接受加入申请
     *
     * @param {Object} options - 参数
     * @param {Function} options.success - 成功回调，默认为空
     * @param {Function} options.error - 失败回调，默认为空
     * @param {Array} options.list - 列表，默认[]
     * @param {String} options.roomId - 聊天室id
     * @param {String} options.reason - 原因
     * @deprecated
     */
    connection.prototype.acceptInviteFromGroup = function (options) {
        options.success = function () {
            // then send sendAcceptInviteMessage
            // connection.prototype.sendAcceptInviteMessage(optoins);
        };
        this.addGroupMembers(options);
    };

    /**
     * 拒绝入群申请
     * @param {Object} options -
     * @example
     throw request for now 暂时不处理，直接丢弃

     <message to='easemob-demo#chatdemoui_mt002@easemob.com' from='easmeob-demo#chatdemoui_mt001@easemob.com' id='B83B7210-BCFF-4DEE-AB28-B9FE5579C1E2'>
     <x xmlns='http://jabber.org/protocol/muc#user'>
     <apply to='easemob-demo#chatdemoui_groupid1@conference.easemob.com' from='easmeob-demo#chatdemoui_mt001@easemob.com' toNick='llllll'>
     <reason>reject</reason>
     </apply>
     </x>
     </message>
     * @deprecated
     */
    connection.prototype.rejectInviteFromGroup = function (options) {
        // var from = _getJidByName(options.from, this);
        // var dom = $msg({
        //     from: from,
        //     to: _getJidByName(options.to, this)
        // }).c('x', {
        //     xmlns: 'http://jabber.org/protocol/muc#user'
        // }).c('apply', {
        //     from: from,
        //     to: this._getGroupJid(options.groupId),
        //     toNick: options.groupName
        // }).c('reason').t(options.reason || '');
        //
        // this.sendCommand(dom.tree());
    };

    /**
     * 创建群组-异步
     * @param {Object} p -
     * @deprecated
     */
    connection.prototype.createGroupAsync = function (p) {
        var roomId = p.from
        var me = this;
        var toRoom = this._getGroupJid(roomId);
        var to = toRoom + '/' + this.context.userId;
        var options = this.groupOption;
        var suc = p.success || _utils.emptyfn;

        // Creating a Reserved Room
        var iq = $iq({type: 'get', to: toRoom})
            .c('query', {xmlns: 'http://jabber.org/protocol/muc#owner'});

        // Strophe.info('step 1 ----------');
        // Strophe.info(options);
        me.context.stropheConn.sendIQ(iq.tree(), function (msgInfo) {
            // console.log(msgInfo);

            // for ie hack
            if ('setAttribute' in msgInfo) {
                // Strophe.info('step 3 ----------');
                var x = msgInfo.getElementsByTagName('x')[0];
                x.setAttribute('type', 'submit');
            } else {
                // Strophe.info('step 4 ----------');
                Strophe.forEachChild(msgInfo, 'x', function (field) {
                    field.setAttribute('type', 'submit');
                });
            }

            Strophe.info('step 5 ----------');
            Strophe.forEachChild(x, 'field', function (field) {
                var fieldVar = field.getAttribute('var');
                var valueDom = field.getElementsByTagName('value')[0];
                Strophe.info(fieldVar);
                switch (fieldVar) {
                    case 'muc#roomconfig_maxusers':
                        _setText(valueDom, options.optionsMaxUsers || 200);
                        break;
                    case 'muc#roomconfig_roomname':
                        _setText(valueDom, options.subject || '');
                        break;
                    case 'muc#roomconfig_roomdesc':
                        _setText(valueDom, options.description || '');
                        break;
                    case 'muc#roomconfig_publicroom': // public 1
                        _setText(valueDom, +options.optionsPublic);
                        break;
                    case 'muc#roomconfig_membersonly':
                        _setText(valueDom, +options.optionsMembersOnly);
                        break;
                    case 'muc#roomconfig_moderatedroom':
                        _setText(valueDom, +options.optionsModerate);
                        break;
                    case 'muc#roomconfig_persistentroom':
                        _setText(valueDom, 1);
                        break;
                    case 'muc#roomconfig_allowinvites':
                        _setText(valueDom, +options.optionsAllowInvites);
                        break;
                    case 'muc#roomconfig_allowvisitornickchange':
                        _setText(valueDom, 0);
                        break;
                    case 'muc#roomconfig_allowvisitorstatus':
                        _setText(valueDom, 0);
                        break;
                    case 'allow_private_messages':
                        _setText(valueDom, 0);
                        break;
                    case 'allow_private_messages_from_visitors':
                        _setText(valueDom, 'nobody');
                        break;
                    default:
                        break;
                }
            });

            var iq = $iq({to: toRoom, type: 'set'})
                .c('query', {xmlns: 'http://jabber.org/protocol/muc#owner'})
                .cnode(x);

            me.context.stropheConn.sendIQ(iq.tree(), function (msgInfo) {
                me.addGroupMembers({
                    list: options.members,
                    roomId: roomId
                });

                suc(options);
            }, function (errInfo) {
                // errFn(errInfo);
            });
            // sucFn(msgInfo);
        }, function (errInfo) {
            // errFn(errInfo);
        });
    };

    /**
     * 创建群组
     * @param {Object} options -
     * @deprecated
     * @example
     * 1. 创建申请 -> 得到房主身份
     * 2. 获取房主信息 -> 得到房间form
     * 3. 完善房间form -> 创建成功
     * 4. 添加房间成员
     * 5. 消息通知成员
     */
    connection.prototype.createGroup = function (options) {
        this.groupOption = options;
        var roomId = +new Date();
        var toRoom = this._getGroupJid(roomId);
        var to = toRoom + '/' + this.context.userId;

        var pres = $pres({to: to})
            .c('x', {xmlns: 'http://jabber.org/protocol/muc'}).up()
            .c('create', {xmlns: 'http://jabber.org/protocol/muc'}).up();

        // createGroupACK
        this.sendCommand(pres.tree());
    };
    /**
     * 通过RestFul API接口创建群组
     * @param opt {Object} - 群组信息
     * @param opt.data.groupname {string} - 群组名
     * @param opt.data.desc {string} - 群组描述
     * @param opt.data.members {string[]} - 群好友列表
     * @param opt.data.public {Boolean} - true: 公开群，false: 私有群
     * @param opt.data.approval {Boolean} - 前提：opt.data.public=true, true: 加群需要审批，false: 加群无需审批
     * @param opt.data.allowinvites {Boolean} - 前提：opt.data.public=false, true: 允许成员邀请入群，false: 不允许成员邀请入群
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     * @since 1.4.11
     */
    connection.prototype.createGroupNew = function (opt) {
        opt.data.owner = this.user;
        opt.data.invite_need_confirm = false;
        var options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/chatgroups',
            dataType: 'json',
            type: 'POST',
            data: JSON.stringify(opt.data),
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
        options.success = function (respData) {
            opt.success(respData);
            this.onCreateGroup(respData);
        }.bind(this);
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API屏蔽群组，只对移动端有效
     * @param {Object} opt -
     * @param {string} opt.groupId - 需要屏蔽的群组ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     * @since 1.4.11
     */
    connection.prototype.blockGroup = function (opt) {
        var groupId = opt.groupId;
        groupId = 'notification_ignore_' + groupId;
        var data = {
            entities: []
        };
        data.entities[0] = {};
        data.entities[0][groupId] = true;
        var options = {
            type: 'PUT',
            url: this.apiUrl + '/' + this.orgName + '/'
            + this.appName + '/' + 'users' + '/' + this.user,
            data: JSON.stringify(data),
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };
    /**
     * 通过RestFul API发出入群申请
     * @param {Object} opt -
     * @param {String} opt.groupId - 群组ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     * @since 1.4.11
     */
    connection.prototype.joinGroup = function (opt) {
        var options = {
            url: this.apiUrl + '/' + this.orgName + '/'
            + this.appName + '/' + 'chatgroups' + '/' + opt.groupId + '/' + 'apply',
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify({ message: 'join group' }),    // 后端参数变更，申请入群需要填写入群消息
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };
    /**
     * 通过RestFul API分页获取群组列表
     * @param {Object} opt -
     * @param {Number} opt.limit - 每一页群组的最大数目
     * @param {string} opt.cursor=null - 游标，如果数据还有下一页，API 返回值会包含此字段，传递此字段可获取下一页的数据，为null时获取第一页数据
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     * @since 1.4.11
     */
    connection.prototype.listGroups = function (opt) {
        var requestData = [];
        requestData['limit'] = opt.limit;
        requestData['cursor'] = opt.cursor;
        if (!requestData['cursor'])
            delete requestData['cursor'];
        if (isNaN(opt.limit)) {
            throw 'The parameter \"limit\" should be a number';
            return;
        }
        var options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/publicchatgroups',
            type: 'GET',
            dataType: 'json',
            data: requestData,
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API根据groupId获取群组详情
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     * @since 1.4.11
     */
    connection.prototype.getGroupInfo = function (opt) {
        var options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/chatgroups/' + opt.groupId,
            type: 'GET',
            dataType: 'json',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API列出某用户所加入的所有群组
     * @param {Object} opt - 加入两个回调函数即可，success, error
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     * @since 1.4.11
     */
    connection.prototype.getGroup = function (opt) {
        var options = {
            url: this.apiUrl + '/' + this.orgName +
            '/' + this.appName + '/' + 'users' + '/' +
            this.user + '/' + 'joined_chatgroups',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API分页列出群组的所有成员
     * @param {Object} opt -
     * @param {Number} opt.pageNum - 页码
     * @param {Number} opt.pageSize - 每一页的最大群成员数目
     * @param {string} opt.groupId - 群ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.listGroupMember = function (opt) {
        if (isNaN(opt.pageNum) || opt.pageNum <= 0) {
            throw 'The parameter \"pageNum\" should be a positive number';
            return;
        } else if (isNaN(opt.pageSize) || opt.pageSize <= 0) {
            throw 'The parameter \"pageSize\" should be a positive number';
            return;
        } else if (opt.groupId === null && typeof opt.groupId === 'undefined') {
            throw 'The parameter \"groupId\" should be added';
            return;
        }
        var requestData = [],
            groupId = opt.groupId;
        requestData['pagenum'] = opt.pageNum;
        requestData['pagesize'] = opt.pageSize;
        var options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/chatgroups'
            + '/' + groupId + '/users',
            dataType: 'json',
            type: 'GET',
            data: requestData,
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API禁止群用户发言
     * @param {Object} opt -
     * @param {string} opt.username - 被禁言的群成员的ID
     * @param {Number} opt.muteDuration - 被禁言的时长
     * @param {string} opt.groupId - 群ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     * @since 1.4.11
     */
    connection.prototype.mute = function (opt) {
        var groupId = opt.groupId,
            requestData = {
                "usernames": [opt.username],
                "mute_duration": opt.muteDuration
            },
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/' + 'chatgroups'
                + '/' + groupId + '/' + 'mute',
                dataType: 'json',
                type: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(requestData)
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API取消对用户禁言
     * @param {Object} opt -
     * @param {string} opt.groupId - 群ID
     * @param {string} opt.username - 被取消禁言的群用户ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     * @since 1.4.11
     */
    connection.prototype.removeMute = function (opt) {
        var groupId = opt.groupId,
            username = opt.username;
        var options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/' + 'chatgroups'
            + '/' + groupId + '/' + 'mute' + '/' + username,
            dataType: 'json',
            type: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API获取群组下所有管理员
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     * @since 1.4.11
     */
    connection.prototype.getGroupAdmin = function (opt) {
        var groupId = opt.groupId;
        var options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/chatgroups'
            + '/' + groupId + '/admin',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API获取群组下所有被禁言成员
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.getMuted = function (opt) {
        var groupId = opt.groupId;
        var options = {
            url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/chatgroups'
            + '/' + groupId + '/mute',
            dataType: 'json',
            type: 'GET',
            headers: {
                'Authorization': 'Bearer ' + this.token,
                'Content-Type': 'application/json'
            }
        };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API设置群管理员
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组ID
     * @param {string} opt.username - 用户ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.setAdmin = function (opt) {
        var groupId = opt.groupId,
            requestData = {
                newadmin: opt.username
            },
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/' + 'chatgroups'
                + '/' + groupId + '/' + 'admin',
                type: "POST",
                dataType: 'json',
                data: JSON.stringify(requestData),
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API取消群管理员
     * @param {Object} opt -
     * @param {string} opt.gorupId - 群组ID
     * @param {string} opt.username - 用户ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.removeAdmin = function (opt) {
        var groupId = opt.groupId,
            username = opt.username,
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName + '/' + 'chatgroups'
                + '/' + groupId + '/' + 'admin' + '/' + username,
                type: 'DELETE',
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API同意用户加入群
     * @param {Object} opt -
     * @param {string} opt.applicant - 申请加群的用户名
     * @param {Object} opt.groupId - 群组ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.agreeJoinGroup = function (opt) {
        var groupId = opt.groupId,
            requestData = {
                "applicant": opt.applicant,
                "verifyResult": true,
                "reason": "no clue"
            },
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId + '/' + 'apply_verify',
                type: 'POST',
                dataType: "json",
                data: JSON.stringify(requestData),
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API拒绝用户加入群
     * @param {Object} opt -
     * @param {string} opt.applicant - 申请加群的用户名
     * @param {Object} opt.groupId - 群组ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.rejectJoinGroup = function (opt) {
        var groupId = opt.groupId,
            requestData = {
                "applicant": opt.applicant,
                "verifyResult": false,
                "reason": "no clue"
            },
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId + '/' + 'apply_verify',
                type: 'POST',
                dataType: "json",
                data: JSON.stringify(requestData),
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API添加用户至群组黑名单(单个)
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组ID
     * @param {stirng} opt.username - 用户ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.groupBlockSingle = function (opt) {
        var groupId = opt.groupId,
            username = opt.username,
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId + '/' + 'blocks' + '/'
                + 'users' + '/' + username,
                type: 'POST',
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API添加用户至群组黑名单(批量)
     * @param {Object} opt -
     * @param {string[]} opt.username - 用户ID数组
     * @param {string} opt.groupId - 群组ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.groupBlockMulti = function (opt) {
        var groupId = opt.groupId,
            usernames = opt.usernames,
            requestData = {
                usernames: usernames
            },
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId + '/' + 'blocks' + '/'
                + 'users',
                data: JSON.stringify(requestData),
                type: 'POST',
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API将用户从群黑名单移除（单个）
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组ID
     * @param {string} opt.username - 用户名
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.removeGroupBlockSingle = function (opt) {
        var groupId = opt.groupId,
            username = opt.username,
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId + '/' + 'blocks' + '/'
                + 'users' + '/' + username,
                type: 'DELETE',
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API将用户从群黑名单移除（批量）
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组名
     * @param {string[]} opt.username - 用户ID数组
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.removeGroupBlockMulti = function (opt) {
        var groupId = opt.groupId,
            username = opt.username.join(','),
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId + '/' + 'blocks' + '/'
                + 'users' + '/' + username,
                type: 'DELETE',
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API解散群组
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.dissolveGroup = function (opt) {
        var groupId = opt.groupId,
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId + '?version=v3',
                type: 'DELETE',
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API获取群组黑名单
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.getGroupBlacklistNew = function (opt) {
        var groupId = opt.groupId,
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId + '/' + 'blocks' + '/' + 'users',
                type: 'GET',
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API离开群组
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组ID
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.quitGroup = function (opt) {
        var groupId = opt.groupId,
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId + '/' + 'quit',
                type: 'DELETE',
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API修改群信息
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组ID
     * @param {string} opt.groupName - 群组名
     * @param {string} opt.description - 群组简介
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.modifyGroup = function (opt) {
        var groupId = opt.groupId,
            requestData = {
                groupname: opt.groupName,
                description: opt.description
            },
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId,
                type: 'PUT',
                data: JSON.stringify(requestData),
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API删除单个群成员
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组ID
     * @param {string} opt.username - 用户名
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.removeSingleGroupMember = function (opt) {
        var groupId = opt.groupId,
            username = opt.username,
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId + '/' + 'users' + '/'
                + username,
                type: 'DELETE',
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API删除多个群成员
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组ID
     * @param {string[]} opt.users - 用户ID数组
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.removeMultiGroupMember = function (opt) {
        var groupId = opt.groupId,
            users = opt.users.join(','),
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId + '/' + 'users' + '/'
                + users,
                type: 'DELETE',
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    /**
     * 通过RestFul API邀请群成员
     * @param {Object} opt -
     * @param {string} opt.groupId - 群组名
     * @param {string[]} opt.users - 用户名ID数组
     * @param {Function} opt.success - 成功之后的回调
     * @param {Function} opt.error - 失败之后的回调
     */
    connection.prototype.inviteToGroup = function (opt) {
        var groupId = opt.groupId,
            users = opt.users,
            requestData = {
                usernames: users
            },
            options = {
                url: this.apiUrl + '/' + this.orgName + '/' + this.appName
                + '/' + 'chatgroups' + '/' + groupId + '/' + 'invite',
                type: 'POST',
                data: JSON.stringify(requestData),
                dataType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + this.token,
                    'Content-Type': 'application/json'
                }
            };
        options.success = opt.success || _utils.emptyfn;
        options.error = opt.error || _utils.emptyfn;
        WebIM.utils.ajax(options);
    };

    function _setText(valueDom, v) {
        if ('textContent' in valueDom) {
            valueDom.textContent = v;
        } else if ('text' in valueDom) {
            valueDom.text = v;
        } else {
            // Strophe.info('_setText 4 ----------');
            // valueDom.innerHTML = v;
        }
    }


    var WebIM = window.WebIM || {};
    WebIM.connection = connection;
    WebIM.utils = _utils;
    WebIM.statusCode = _code;
    WebIM.message = _msg.message;
    WebIM.doQuery = function (str, suc, fail) {
        if (typeof window.cefQuery === 'undefined') {
            return;
        }
        window.cefQuery({
                request: str,
                persistent: false,
                onSuccess: suc,
                onFailure: fail
            }
        );
    };

    /**************************** debug ****************************/
    WebIM.debug = function (bool) {

        logMessage = function (message) {
            bool && console.log(WebIM.utils.ts() + '[recv] ', message.data);
        }

        Strophe.Connection.prototype.rawOutput = function (data) {
            bool && console.log('%c ' + WebIM.utils.ts() + '[send] ' + data, "background-color: #e2f7da");
        }

    }

    module.exports = WebIM;

    if (false) {
        module.hot.accept();
    }


/***/ }),
/* 2 */
/***/ (function(module, exports) {

    ;
    (function () {
        //管理各种错误信息
        exports.code = {
            WEBIM_CONNCTION_USER_NOT_ASSIGN_ERROR: 0,
            WEBIM_CONNCTION_OPEN_ERROR: 1,
            WEBIM_CONNCTION_AUTH_ERROR: 2,
            WEBIM_CONNCTION_OPEN_USERGRID_ERROR: 3,
            WEBIM_CONNCTION_ATTACH_ERROR: 4,
            WEBIM_CONNCTION_ATTACH_USERGRID_ERROR: 5,
            WEBIM_CONNCTION_REOPEN_ERROR: 6,
            WEBIM_CONNCTION_SERVER_CLOSE_ERROR: 7,  //7: client-side network offline (net::ERR_INTERNET_DISCONNECTED)
            WEBIM_CONNCTION_SERVER_ERROR: 8,        //8: offline by multi login
            WEBIM_CONNCTION_IQ_ERROR: 9,

            WEBIM_CONNCTION_PING_ERROR: 10,
            WEBIM_CONNCTION_NOTIFYVERSION_ERROR: 11,
            WEBIM_CONNCTION_GETROSTER_ERROR: 12,
            WEBIM_CONNCTION_CROSSDOMAIN_ERROR: 13,
            WEBIM_CONNCTION_LISTENING_OUTOF_MAXRETRIES: 14,
            WEBIM_CONNCTION_RECEIVEMSG_CONTENTERROR: 15,
            WEBIM_CONNCTION_DISCONNECTED: 16,    //16: server-side close the websocket connection
            WEBIM_CONNCTION_AJAX_ERROR: 17,
            WEBIM_CONNCTION_JOINROOM_ERROR: 18,
            WEBIM_CONNCTION_GETROOM_ERROR: 19,

            WEBIM_CONNCTION_GETROOMINFO_ERROR: 20,
            WEBIM_CONNCTION_GETROOMMEMBER_ERROR: 21,
            WEBIM_CONNCTION_GETROOMOCCUPANTS_ERROR: 22,
            WEBIM_CONNCTION_LOAD_CHATROOM_ERROR: 23,
            WEBIM_CONNCTION_NOT_SUPPORT_CHATROOM_ERROR: 24,
            WEBIM_CONNCTION_JOINCHATROOM_ERROR: 25,
            WEBIM_CONNCTION_QUITCHATROOM_ERROR: 26,
            WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR: 27,
            WEBIM_CONNCTION_TOKEN_NOT_ASSIGN_ERROR: 28,
            WEBIM_CONNCTION_SESSIONID_NOT_ASSIGN_ERROR: 29,

            WEBIM_CONNCTION_RID_NOT_ASSIGN_ERROR: 30,
            WEBIM_CONNCTION_CALLBACK_INNER_ERROR: 31,  //31: 处理下行消息出错 try/catch抛出异常
            WEBIM_CONNCTION_CLIENT_OFFLINE: 32,        //32: client offline
            WEBIM_CONNCTION_CLIENT_LOGOUT: 33,        //33: client logout
            WEBIM_CONNCTION_CLIENT_TOO_MUCH_ERROR: 34, // 34: Over amount of the tabs a user opened in the same browser
            WEBIM_CONNECTION_ACCEPT_INVITATION_FROM_GROUP: 35,
            WEBIM_CONNECTION_DECLINE_INVITATION_FROM_GROUP: 36,
            WEBIM_CONNECTION_ACCEPT_JOIN_GROUP: 37,
            WEBIM_CONNECTION_DECLINE_JOIN_GROUP: 38,
            WEBIM_CONNECTION_CLOSED: 39,


            WEBIM_UPLOADFILE_BROWSER_ERROR: 100,
            WEBIM_UPLOADFILE_ERROR: 101,
            WEBIM_UPLOADFILE_NO_LOGIN: 102,
            WEBIM_UPLOADFILE_NO_FILE: 103,


            WEBIM_DOWNLOADFILE_ERROR: 200,
            WEBIM_DOWNLOADFILE_NO_LOGIN: 201,
            WEBIM_DOWNLOADFILE_BROWSER_ERROR: 202,


            WEBIM_MESSAGE_REC_TEXT: 300,
            WEBIM_MESSAGE_REC_TEXT_ERROR: 301,
            WEBIM_MESSAGE_REC_EMOTION: 302,
            WEBIM_MESSAGE_REC_PHOTO: 303,
            WEBIM_MESSAGE_REC_AUDIO: 304,
            WEBIM_MESSAGE_REC_AUDIO_FILE: 305,
            WEBIM_MESSAGE_REC_VEDIO: 306,
            WEBIM_MESSAGE_REC_VEDIO_FILE: 307,
            WEBIM_MESSAGE_REC_FILE: 308,
            WEBIM_MESSAGE_SED_TEXT: 309,
            WEBIM_MESSAGE_SED_EMOTION: 310,
            WEBIM_MESSAGE_SED_PHOTO: 311,
            WEBIM_MESSAGE_SED_AUDIO: 312,
            WEBIM_MESSAGE_SED_AUDIO_FILE: 313,
            WEBIM_MESSAGE_SED_VEDIO: 314,
            WEBIM_MESSAGE_SED_VEDIO_FILE: 315,
            WEBIM_MESSAGE_SED_FILE: 316,
            WEBIM_MESSAGE_SED_ERROR: 317,


            STATUS_INIT: 400,
            STATUS_DOLOGIN_USERGRID: 401,
            STATUS_DOLOGIN_IM: 402,
            STATUS_OPENED: 403,
            STATUS_CLOSING: 404,
            STATUS_CLOSED: 405,
            STATUS_ERROR: 406
        };
    }());


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

    ;
    (function () {

        var EMPTYFN = function () {
        };
        var _code = __webpack_require__(2).code;
        var WEBIM_FILESIZE_LIMIT = 10485760;

        var _createStandardXHR = function () {
            try {
                return new window.XMLHttpRequest();
            } catch (e) {
                return false;
            }
        };

        var _createActiveXHR = function () {
            try {
                return new window.ActiveXObject('Microsoft.XMLHTTP');
            } catch (e) {
                return false;
            }
        };

        var _xmlrequest = function (crossDomain) {
            crossDomain = crossDomain || true;
            var temp = _createStandardXHR() || _createActiveXHR();

            if ('withCredentials' in temp) {
                return temp;
            }
            if (!crossDomain) {
                return temp;
            }
            if (typeof window.XDomainRequest === 'undefined') {
                return temp;
            }
            var xhr = new XDomainRequest();
            xhr.readyState = 0;
            xhr.status = 100;
            xhr.onreadystatechange = EMPTYFN;
            xhr.onload = function () {
                xhr.readyState = 4;
                xhr.status = 200;

                var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                xmlDoc.async = 'false';
                xmlDoc.loadXML(xhr.responseText);
                xhr.responseXML = xmlDoc;
                xhr.response = xhr.responseText;
                xhr.onreadystatechange();
            };
            xhr.ontimeout = xhr.onerror = function () {
                xhr.readyState = 4;
                xhr.status = 500;
                xhr.onreadystatechange();
            };
            return xhr;
        };

        var _hasFlash = (function () {
            if ('ActiveXObject' in window) {
                try {
                    return new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                } catch (ex) {
                    return 0;
                }
            } else {
                if (navigator.plugins && navigator.plugins.length > 0) {
                    return navigator.plugins['Shockwave Flash'];
                }
            }
            return 0;
        }());

        var _tmpUtilXHR = _xmlrequest(),
            _hasFormData = typeof FormData !== 'undefined',
            _hasBlob = typeof Blob !== 'undefined',
            _isCanSetRequestHeader = _tmpUtilXHR.setRequestHeader || false,
            _hasOverrideMimeType = _tmpUtilXHR.overrideMimeType || false,
            _isCanUploadFileAsync = _isCanSetRequestHeader && _hasFormData,
            _isCanUploadFile = _isCanUploadFileAsync || _hasFlash,
            _isCanDownLoadFile = _isCanSetRequestHeader && (_hasBlob || _hasOverrideMimeType);

        if (!Object.keys) {
            Object.keys = (function () {
                'use strict';
                var hasOwnProperty = Object.prototype.hasOwnProperty,
                    hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
                    dontEnums = [
                        'toString',
                        'toLocaleString',
                        'valueOf',
                        'hasOwnProperty',
                        'isPrototypeOf',
                        'propertyIsEnumerable',
                        'constructor'
                    ],
                    dontEnumsLength = dontEnums.length;

                return function (obj) {
                    if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
                        throw new TypeError('Object.keys called on non-object');
                    }

                    var result = [], prop, i;

                    for (prop in obj) {
                        if (hasOwnProperty.call(obj, prop)) {
                            result.push(prop);
                        }
                    }

                    if (hasDontEnumBug) {
                        for (i = 0; i < dontEnumsLength; i++) {
                            if (hasOwnProperty.call(obj, dontEnums[i])) {
                                result.push(dontEnums[i]);
                            }
                        }
                    }
                    return result;
                };
            }());
        }

        var utils = {
            hasFormData: _hasFormData,

            hasBlob: _hasBlob,

            emptyfn: EMPTYFN,

            isCanSetRequestHeader: _isCanSetRequestHeader,

            hasOverrideMimeType: _hasOverrideMimeType,

            isCanUploadFileAsync: _isCanUploadFileAsync,

            isCanUploadFile: _isCanUploadFile,

            isCanDownLoadFile: _isCanDownLoadFile,

            isSupportWss: (function () {
                var notSupportList = [
                    //1: QQ browser X5 core
                    /MQQBrowser[\/]5([.]\d+)?\sTBS/

                    //2: etc.
                    //...
                ];

                if (!window.WebSocket) {
                    return false;
                }

                var ua = window.navigator.userAgent;
                for (var i = 0, l = notSupportList.length; i < l; i++) {
                    if (notSupportList[i].test(ua)) {
                        return false;
                    }
                }
                return true;
            }()),

            getIEVersion: (function () {
                var ua = navigator.userAgent, matches, tridentMap = {'4': 8, '5': 9, '6': 10, '7': 11};

                matches = ua.match(/MSIE (\d+)/i);

                if (matches && matches[1]) {
                    return +matches[1];
                }
                matches = ua.match(/Trident\/(\d+)/i);
                if (matches && matches[1]) {
                    return tridentMap[matches[1]] || null;
                }
                return null;
            }()),


            stringify: function (json) {
                if (typeof JSON !== 'undefined' && JSON.stringify) {
                    return JSON.stringify(json);
                } else {
                    var s = '',
                        arr = [];

                    var iterate = function (json) {
                        var isArr = false;

                        if (Object.prototype.toString.call(json) === '[object Array]') {
                            arr.push(']', '[');
                            isArr = true;
                        } else if (Object.prototype.toString.call(json) === '[object Object]') {
                            arr.push('}', '{');
                        }

                        for (var o in json) {
                            if (Object.prototype.toString.call(json[o]) === '[object Null]') {
                                json[o] = 'null';
                            } else if (Object.prototype.toString.call(json[o]) === '[object Undefined]') {
                                json[o] = 'undefined';
                            }

                            if (json[o] && typeof json[o] === 'object') {
                                s += ',' + (isArr ? '' : '"' + o + '":' + (isArr ? '"' : '')) + iterate(json[o]) + '';
                            } else {
                                s += ',"' + (isArr ? '' : o + '":"') + json[o] + '"';
                            }
                        }

                        if (s != '') {
                            s = s.slice(1);
                        }

                        return arr.pop() + s + arr.pop();
                    };
                    return iterate(json);
                }
            },
            login: function (options) {
                var options = options || {};
                var suc = options.success || EMPTYFN;
                var err = options.error || EMPTYFN;

                var appKey = options.appKey || '';
                var devInfos = appKey.split('#');
                if (devInfos.length !== 2) {
                    err({
                        type: _code.WEBIM_CONNCTION_APPKEY_NOT_ASSIGN_ERROR
                    });
                    return false;
                }

                var orgName = devInfos[0];
                var appName = devInfos[1];
                var https = https || options.https;
                var user = options.user || '';
                var pwd = options.pwd || '';

                var apiUrl = options.apiUrl;

                var loginJson = {
                    grant_type: 'password',
                    username: user,
                    password: pwd,
                    timestamp: +new Date()
                };
                var loginfo = utils.stringify(loginJson);

                var options = {
                    url: apiUrl + '/' + orgName + '/' + appName + '/token',
                    dataType: 'json',
                    data: loginfo,
                    success: suc,
                    error: err
                };
                return utils.ajax(options);
            },

            getFileUrl: function (fileInputId) {
                var uri = {
                    url: '',
                    filename: '',
                    filetype: '',
                    data: ''
                };

                var fileObj = typeof fileInputId === 'string' ? document.getElementById(fileInputId) : fileInputId;

                if (!utils.isCanUploadFileAsync || !fileObj) {
                    return uri;
                }
                try {
                    if (window.URL.createObjectURL) {
                        var fileItems = fileObj.files;
                        if (fileItems.length > 0) {
                            var u = fileItems.item(0);
                            uri.data = u;
                            uri.url = window.URL.createObjectURL(u);
                            uri.filename = u.name || '';
                        }
                    } else { // IE
                        var u = document.getElementById(fileInputId).value;
                        uri.url = u;
                        var pos1 = u.lastIndexOf('/');
                        var pos2 = u.lastIndexOf('\\');
                        var pos = Math.max(pos1, pos2);
                        if (pos < 0)
                            uri.filename = u;
                        else
                            uri.filename = u.substring(pos + 1);
                    }
                    var index = uri.filename.lastIndexOf('.');
                    if (index != -1) {
                        uri.filetype = uri.filename.substring(index + 1).toLowerCase();
                    }
                    return uri;

                } catch (e) {
                    throw e;
                }
            },

            getFileSize: function (file) {
                var fileSize = this.getFileLength(file);
                if (fileSize > 10000000) {
                    return false;
                }
                var kb = Math.round(fileSize / 1000);
                if (kb < 1000) {
                    fileSize = kb + ' KB';
                } else if (kb >= 1000) {
                    var mb = kb / 1000;
                    if (mb < 1000) {
                        fileSize = mb.toFixed(1) + ' MB';
                    } else {
                        var gb = mb / 1000;
                        fileSize = gb.toFixed(1) + ' GB';
                    }
                }
                return fileSize;
            },

            getFileLength: function (file) {
                var fileLength = 0;
                if (file) {
                    if (file.files) {
                        if (file.files.length > 0) {
                            fileLength = file.files[0].size;
                        }
                    } else if (file.select && 'ActiveXObject' in window) {
                        file.select();
                        var fileobject = new ActiveXObject('Scripting.FileSystemObject');
                        var file = fileobject.GetFile(file.value);
                        fileLength = file.Size;
                    }
                }
                return fileLength;
            },

            hasFlash: _hasFlash,

            trim: function (str) {

                str = typeof str === 'string' ? str : '';

                return str.trim
                    ? str.trim()
                    : str.replace(/^\s|\s$/g, '');
            },

            parseEmoji: function (msg) {
                if (typeof WebIM.Emoji === 'undefined' || typeof WebIM.Emoji.map === 'undefined') {
                    return msg;
                } else {
                    var emoji = WebIM.Emoji,
                        reg = null;

                    for (var face in emoji.map) {
                        if (emoji.map.hasOwnProperty(face)) {
                            while (msg.indexOf(face) > -1) {
                                msg = msg.replace(face, '<img class="emoji" src="' + emoji.path + emoji.map[face] + '" />');
                            }
                        }
                    }
                    return msg;
                }
            },

            parseLink: function (msg) {

                var reg = /(https?\:\/\/|www\.)([a-zA-Z0-9-]+(\.[a-zA-Z0-9]+)+)(\:[0-9]{2,4})?\/?((\.[:_0-9a-zA-Z-]+)|[:_0-9a-zA-Z-]*\/?)*\??[:_#@*&%0-9a-zA-Z-/=]*/gm;

                msg = msg.replace(reg, function (v) {

                    var prefix = /^https?/gm.test(v);

                    return "<a href='"
                        + (prefix ? v : '//' + v)
                        + "' target='_blank'>"
                        + v
                        + "</a>";

                });

                return msg;

            },

            parseJSON: function (data) {

                if (window.JSON && window.JSON.parse) {
                    return window.JSON.parse(data + '');
                }

                var requireNonComma,
                    depth = null,
                    str = utils.trim(data + '');

                return str && !utils.trim(
                    str.replace(/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g
                        , function (token, comma, open, close) {

                            if (requireNonComma && comma) {
                                depth = 0;
                            }

                            if (depth === 0) {
                                return token;
                            }

                            requireNonComma = open || comma;
                            depth += !close - !open;
                            return '';
                        })
                )
                    ? (Function('return ' + str))()
                    : (Function('Invalid JSON: ' + data))();
            },

            parseUploadResponse: function (response) {
                return response.indexOf('callback') > -1 ? //lte ie9
                    response.slice(9, -1) : response;
            },

            parseDownloadResponse: function (response) {
                return ((response && response.type && response.type === 'application/json')
                || 0 > Object.prototype.toString.call(response).indexOf('Blob'))
                    ? this.url + '?token=' : window.URL.createObjectURL(response);
            },

            uploadFile: function (options) {
                var options = options || {};
                options.onFileUploadProgress = options.onFileUploadProgress || EMPTYFN;
                options.onFileUploadComplete = options.onFileUploadComplete || EMPTYFN;
                options.onFileUploadError = options.onFileUploadError || EMPTYFN;
                options.onFileUploadCanceled = options.onFileUploadCanceled || EMPTYFN;

                var acc = options.accessToken || this.context.accessToken;
                if (!acc) {
                    options.onFileUploadError({
                        type: _code.WEBIM_UPLOADFILE_NO_LOGIN
                        , id: options.id
                    });
                    return;
                }

                var orgName, appName, devInfos;
                var appKey = options.appKey || this.context.appKey || '';

                if (appKey) {
                    devInfos = appKey.split('#');
                    orgName = devInfos[0];
                    appName = devInfos[1];
                }

                if (!orgName && !appName) {
                    options.onFileUploadError({
                        type: _code.WEBIM_UPLOADFILE_ERROR
                        , id: options.id
                    });
                    return;
                }

                var apiUrl = options.apiUrl;
                var uploadUrl = apiUrl + '/' + orgName + '/' + appName + '/chatfiles';

                if (!utils.isCanUploadFileAsync) {
                    if (utils.hasFlash && typeof options.flashUpload === 'function') {
                        options.flashUpload && options.flashUpload(uploadUrl, options);
                    } else {
                        options.onFileUploadError({
                            type: _code.WEBIM_UPLOADFILE_BROWSER_ERROR
                            , id: options.id
                        });
                    }
                    return;
                }

                var fileSize = options.file.data ? options.file.data.size : undefined;
                if (fileSize > WEBIM_FILESIZE_LIMIT) {
                    options.onFileUploadError({
                        type: _code.WEBIM_UPLOADFILE_ERROR
                        , id: options.id
                    });
                    return;
                } else if (fileSize <= 0) {
                    options.onFileUploadError({
                        type: _code.WEBIM_UPLOADFILE_ERROR
                        , id: options.id
                    });
                    return;
                }

                var xhr = utils.xmlrequest();
                var onError = function (e) {
                    options.onFileUploadError({
                        type: _code.WEBIM_UPLOADFILE_ERROR,
                        id: options.id,
                        xhr: xhr
                    });
                };
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', options.onFileUploadProgress, false);
                }
                if (xhr.addEventListener) {
                    xhr.addEventListener('abort', options.onFileUploadCanceled, false);
                    xhr.addEventListener('load', function (e) {
                        try {
                            var json = utils.parseJSON(xhr.responseText);
                            try {
                                options.onFileUploadComplete(json);
                            } catch (e) {
                                options.onFileUploadError({
                                    type: _code.WEBIM_CONNCTION_CALLBACK_INNER_ERROR
                                    , data: e
                                });
                            }
                        } catch (e) {
                            options.onFileUploadError({
                                type: _code.WEBIM_UPLOADFILE_ERROR,
                                data: xhr.responseText,
                                id: options.id,
                                xhr: xhr
                            });
                        }
                    }, false);
                    xhr.addEventListener('error', onError, false);
                } else if (xhr.onreadystatechange) {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (ajax.status === 200) {
                                try {
                                    var json = utils.parseJSON(xhr.responseText);
                                    options.onFileUploadComplete(json);
                                } catch (e) {
                                    options.onFileUploadError({
                                        type: _code.WEBIM_UPLOADFILE_ERROR,
                                        data: xhr.responseText,
                                        id: options.id,
                                        xhr: xhr
                                    });
                                }
                            } else {
                                options.onFileUploadError({
                                    type: _code.WEBIM_UPLOADFILE_ERROR,
                                    data: xhr.responseText,
                                    id: options.id,
                                    xhr: xhr
                                });
                            }
                        } else {
                            xhr.abort();
                            options.onFileUploadCanceled();
                        }
                    }
                }

                xhr.open('POST', uploadUrl);

                xhr.setRequestHeader('restrict-access', 'true');
                xhr.setRequestHeader('Accept', '*/*');// Android QQ browser has some problem with this attribute.
                xhr.setRequestHeader('Authorization', 'Bearer ' + acc);

                var formData = new FormData();
                formData.append('file', options.file.data);
                // fix: ie8 status error
                window.XDomainRequest && (xhr.readyState = 2)
                xhr.send(formData);
            },


            download: function (options) {
                options.onFileDownloadComplete = options.onFileDownloadComplete || EMPTYFN;
                options.onFileDownloadError = options.onFileDownloadError || EMPTYFN;

                var accessToken = options.accessToken || this.context.accessToken;
                if (!accessToken) {
                    options.onFileDownloadError({
                        type: _code.WEBIM_DOWNLOADFILE_NO_LOGIN,
                        id: options.id
                    });
                    return;
                }

                var onError = function (e) {
                    options.onFileDownloadError({
                        type: _code.WEBIM_DOWNLOADFILE_ERROR,
                        id: options.id,
                        xhr: xhr
                    });
                };

                if (!utils.isCanDownLoadFile) {
                    options.onFileDownloadComplete();
                    return;
                }
                var xhr = utils.xmlrequest();
                if ('addEventListener' in xhr) {
                    xhr.addEventListener('load', function (e) {
                        options.onFileDownloadComplete(xhr.response, xhr);
                    }, false);
                    xhr.addEventListener('error', onError, false);
                } else if ('onreadystatechange' in xhr) {
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (ajax.status === 200) {
                                options.onFileDownloadComplete(xhr.response, xhr);
                            } else {
                                options.onFileDownloadError({
                                    type: _code.WEBIM_DOWNLOADFILE_ERROR,
                                    id: options.id,
                                    xhr: xhr
                                });
                            }
                        } else {
                            xhr.abort();
                            options.onFileDownloadError({
                                type: _code.WEBIM_DOWNLOADFILE_ERROR,
                                id: options.id,
                                xhr: xhr
                            });
                        }
                    }
                }

                var method = options.method || 'GET';
                var resType = options.responseType || 'blob';
                var mimeType = options.mimeType || 'text/plain; charset=x-user-defined';
                xhr.open(method, options.url);
                if (typeof Blob !== 'undefined') {
                    xhr.responseType = resType;
                } else {
                    xhr.overrideMimeType(mimeType);
                }

                var innerHeaer = {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/octet-stream',
                    'share-secret': options.secret,
                    'Authorization': 'Bearer ' + accessToken
                };
                var headers = options.headers || {};
                for (var key in headers) {
                    innerHeaer[key] = headers[key];
                }
                for (var key in innerHeaer) {
                    if (innerHeaer[key]) {
                        xhr.setRequestHeader(key, innerHeaer[key]);
                    }
                }
                // fix: ie8 status error
                window.XDomainRequest && (xhr.readyState = 2)
                xhr.send(null);
            },

            parseTextMessage: function (message, faces) {
                if (typeof message !== 'string') {
                    return;
                }

                if (Object.prototype.toString.call(faces) !== '[object Object]') {
                    return {
                        isemoji: false,
                        body: [
                            {
                                type: 'txt',
                                data: message
                            }
                        ]
                    };
                }

                var receiveMsg = message;
                var emessage = [];
                var expr = /\[[^[\]]{2,3}\]/mg;
                var emoji = receiveMsg.match(expr);

                if (!emoji || emoji.length < 1) {
                    return {
                        isemoji: false,
                        body: [
                            {
                                type: 'txt',
                                data: message
                            }
                        ]
                    };
                }
                var isemoji = false;
                for (var i = 0; i < emoji.length; i++) {
                    var tmsg = receiveMsg.substring(0, receiveMsg.indexOf(emoji[i])),
                        existEmoji = WebIM.Emoji.map[emoji[i]];

                    if (tmsg) {
                        emessage.push({
                            type: 'txt',
                            data: tmsg
                        });
                    }
                    if (!existEmoji) {
                        emessage.push({
                            type: 'txt',
                            data: emoji[i]
                        });
                        continue;
                    }
                    var emojiStr = WebIM.Emoji.map ? WebIM.Emoji.path + existEmoji : null;

                    if (emojiStr) {
                        isemoji = true;
                        emessage.push({
                            type: 'emoji',
                            data: emojiStr
                        });
                    } else {
                        emessage.push({
                            type: 'txt',
                            data: emoji[i]
                        });
                    }
                    var restMsgIndex = receiveMsg.indexOf(emoji[i]) + emoji[i].length;
                    receiveMsg = receiveMsg.substring(restMsgIndex);
                }
                if (receiveMsg) {
                    emessage.push({
                        type: 'txt',
                        data: receiveMsg
                    });
                }
                if (isemoji) {
                    return {
                        isemoji: isemoji,
                        body: emessage
                    };
                }
                return {
                    isemoji: false,
                    body: [
                        {
                            type: 'txt',
                            data: message
                        }
                    ]
                };
            },

            parseUri: function () {
                var pattern = /([^\?|&])\w+=([^&]+)/g;
                var uri = {};
                if (window.location.search) {
                    var args = window.location.search.match(pattern);
                    for (var i in args) {
                        var str = args[i];
                        var eq = str.indexOf('=');
                        var key = str.substr(0, eq);
                        var value = str.substr(eq + 1);
                        uri[key] = value;
                    }
                }
                return uri;
            },

            parseHrefHash: function () {
                var pattern = /([^\#|&])\w+=([^&]+)/g;
                var uri = {};
                if (window.location.hash) {
                    var args = window.location.hash.match(pattern);
                    for (var i in args) {
                        var str = args[i];
                        var eq = str.indexOf('=');
                        var key = str.substr(0, eq);
                        var value = str.substr(eq + 1);
                        uri[key] = value;
                    }
                }
                return uri;
            },

            xmlrequest: _xmlrequest,


            getXmlFirstChild: function (data, tagName) {
                var children = data.getElementsByTagName(tagName);
                if (children.length == 0) {
                    return null;
                } else {
                    return children[0];
                }
            },
            ajax: function (options) {
                var dataType = options.dataType || 'text';
                var suc = options.success || EMPTYFN;
                var error = options.error || EMPTYFN;
                var xhr = utils.xmlrequest();

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        var status = xhr.status || 0;
                        if (status === 200) {
                            try {
                                switch (dataType) {
                                    case 'text':
                                        suc(xhr.responseText);
                                        return;
                                    case 'json':
                                        var json = utils.parseJSON(xhr.responseText);
                                        suc(json, xhr);
                                        return;
                                    case 'xml':
                                        if (xhr.responseXML && xhr.responseXML.documentElement) {
                                            suc(xhr.responseXML.documentElement, xhr);
                                        } else {
                                            error({
                                                type: _code.WEBIM_CONNCTION_AJAX_ERROR,
                                                data: xhr.responseText
                                            });
                                        }
                                        return;
                                }
                                suc(xhr.response || xhr.responseText, xhr);
                            } catch (e) {
                                error({
                                    type: _code.WEBIM_CONNCTION_AJAX_ERROR,
                                    data: e
                                });
                            }
                            return;
                        } else {
                            error({
                                type: _code.WEBIM_CONNCTION_AJAX_ERROR,
                                data: xhr.responseText
                            });
                            return;
                        }
                    }
                    if (xhr.readyState === 0) {
                        error({
                            type: _code.WEBIM_CONNCTION_AJAX_ERROR,
                            data: xhr.responseText
                        });
                    }
                };

                if (options.responseType) {
                    if (xhr.responseType) {
                        xhr.responseType = options.responseType;
                    }
                }
                if (options.mimeType) {
                    if (utils.hasOverrideMimeType) {
                        xhr.overrideMimeType(options.mimeType);
                    }
                }

                var type = options.type || 'POST',
                    data = options.data || null,
                    tempData = '';

                if (type.toLowerCase() === 'get' && data) {
                    for (var o in data) {
                        if (data.hasOwnProperty(o)) {
                            tempData += o + '=' + data[o] + '&';
                        }
                    }
                    tempData = tempData ? tempData.slice(0, -1) : tempData;
                    options.url += (options.url.indexOf('?') > 0 ? '&' : '?') + (tempData ? tempData + '&' : tempData) + '_v=' + new Date().getTime();
                    data = null;
                    tempData = null;
                }
                xhr.open(type, options.url, utils.isCanSetRequestHeader);

                if (utils.isCanSetRequestHeader) {
                    var headers = options.headers || {};
                    for (var key in headers) {
                        if (headers.hasOwnProperty(key)) {
                            xhr.setRequestHeader(key, headers[key]);
                        }
                    }
                }
                // fix: ie8 status error
                window.XDomainRequest && (xhr.readyState = 2)
                xhr.send(data);
                return xhr;
            },
            ts: function () {
                var d = new Date();
                var Hours = d.getHours(); //获取当前小时数(0-23)
                var Minutes = d.getMinutes(); //获取当前分钟数(0-59)
                var Seconds = d.getSeconds(); //获取当前秒数(0-59)
                var Milliseconds = d.getMilliseconds(); //获取当前毫秒
                return (Hours < 10 ? "0" + Hours : Hours) + ':' + (Minutes < 10 ? "0" + Minutes : Minutes) + ':' + (Seconds < 10 ? "0" + Seconds : Seconds) + ':' + Milliseconds + ' ';
            },

            getObjectKey: function (obj, val) {
                for (var key in obj) {
                    if (obj[key] == val) {
                        return key;
                    }
                }
                return '';
            },

            sprintf: function () {
                var arg = arguments,
                    str = arg[0] || '',
                    i, len;
                for (i = 1, len = arg.length; i < len; i++) {
                    str = str.replace(/%s/, arg[i]);
                }
                return str;
            },

            setCookie: function (name, value, days) {
                var cookie = name + '=' + encodeURIComponent(value);
                if (typeof days == 'number') {
                    cookie += '; max-age: ' + (days * 60 * 60 * 24);
                }
                document.cookie = cookie;
            },

            getCookie: function () {
                var allCookie = {};
                var all = document.cookie;
                if (all === "") {
                    return allCookie;
                }
                var list = all.split("; ");
                for (var i = 0; i < list.length; i++) {
                    var cookie = list[i];
                    var p = cookie.indexOf('=');
                    var name = cookie.substring(0, p);
                    var value = cookie.substring(p + 1);
                    value = decodeURIComponent(value);
                    allCookie[name] = value;
                }
                return allCookie;
            }
        };


        exports.utils = utils;
    }());

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

    var CryptoJS = __webpack_require__(5);
    ;(function () {
        'use strict';

        var _utils = __webpack_require__(3).utils;
        var Message = function (type, id) {
            if (!this instanceof Message) {
                return new Message(type);
            }

            this._msg = {};

            if (typeof Message[type] === 'function') {
                Message[type].prototype.setGroup = this.setGroup;
                this._msg = new Message[type](id);
            }
            return this._msg;
        }
        Message.prototype.setGroup = function (group) {
            this.body.group = group;
        }

        /*
         * Read Message
         */
        Message.read = function (id) {
            this.id = id;
            this.type = 'read';
        };

        Message.read.prototype.set = function (opt) {
            this.body = {
                ackId: opt.id
                , to: opt.to
            }
        };

        /*
         * deliver message
         */
        Message.delivery = function (id) {
            this.id = id;
            this.type = 'delivery';
        };

        Message.delivery.prototype.set = function (opt) {
            this.body = {
                bodyId: opt.id
                , to: opt.to
            };
        };

        /*
         * text message
         */
        Message.txt = function (id) {
            this.id = id;
            this.type = 'txt';
            this.body = {};
        };
        Message.txt.prototype.set = function (opt) {
            this.value = opt.msg;
            this.body = {
                id: this.id
                , to: opt.to
                , msg: this.value
                , type: this.type
                , roomType: opt.roomType
                , ext: opt.ext || {}
                , success: opt.success
                , fail: opt.fail
            };

            !opt.roomType && delete this.body.roomType;

        };

        /*
         * cmd message
         */
        Message.cmd = function (id) {
            this.id = id;
            this.type = 'cmd';
            this.body = {};
        };
        Message.cmd.prototype.set = function (opt) {
            this.value = '';

            this.body = {
                to: opt.to
                , action: opt.action
                , msg: this.value
                , type: this.type
                , roomType: opt.roomType
                , ext: opt.ext || {}
                , success: opt.success
            };
            !opt.roomType && delete this.body.roomType;
        };

        /*
         * loc message
         */
        Message.location = function (id) {
            this.id = id;
            this.type = 'loc';
            this.body = {};
        };
        Message.location.prototype.set = function (opt) {
            this.body = {
                to: opt.to
                , type: this.type
                , roomType: opt.roomType
                , addr: opt.addr
                , lat: opt.lat
                , lng: opt.lng
                , ext: opt.ext || {}
            };
        };

        /*
         * img message
         */
        Message.img = function (id) {
            this.id = id;
            this.type = 'img';
            this.body = {};
        };
        Message.img.prototype.set = function (opt) {
            opt.file = opt.file || _utils.getFileUrl(opt.fileInputId);

            this.value = opt.file;

            this.body = {
                id: this.id,
                file: this.value,
                apiUrl: opt.apiUrl,
                to: opt.to,
                type: this.type,
                ext: opt.ext || {},
                roomType: opt.roomType,
                onFileUploadError: opt.onFileUploadError,
                onFileUploadComplete: opt.onFileUploadComplete,
                success: opt.success,
                fail: opt.fail,
                flashUpload: opt.flashUpload,
                width: opt.width,
                height: opt.height,
                body: opt.body,
                uploadError: opt.uploadError,
                uploadComplete: opt.uploadComplete
            };

            !opt.roomType && delete this.body.roomType;
        };

        /*
         * audio message
         */
        Message.audio = function (id) {
            this.id = id;
            this.type = 'audio';
            this.body = {};
        };
        Message.audio.prototype.set = function (opt) {
            opt.file = opt.file || _utils.getFileUrl(opt.fileInputId);

            this.value = opt.file;
            this.filename = opt.filename || this.value.filename;

            this.body = {
                id: this.id
                , file: this.value
                , filename: this.filename
                , apiUrl: opt.apiUrl
                , to: opt.to
                , type: this.type
                , ext: opt.ext || {}
                , length: opt.length || 0
                , roomType: opt.roomType
                , file_length: opt.file_length
                , onFileUploadError: opt.onFileUploadError
                , onFileUploadComplete: opt.onFileUploadComplete
                , success: opt.success
                , fail: opt.fail
                , flashUpload: opt.flashUpload
                , body: opt.body
            };
            !opt.roomType && delete this.body.roomType;
        };

        /*
         * file message
         */
        Message.file = function (id) {
            this.id = id;
            this.type = 'file';
            this.body = {};
        };
        Message.file.prototype.set = function (opt) {
            opt.file = opt.file || _utils.getFileUrl(opt.fileInputId);

            this.value = opt.file;
            this.filename = opt.filename || this.value.filename;

            this.body = {
                id: this.id
                , file: this.value
                , filename: this.filename
                , apiUrl: opt.apiUrl
                , to: opt.to
                , type: this.type
                , ext: opt.ext || {}
                , roomType: opt.roomType
                , onFileUploadError: opt.onFileUploadError
                , onFileUploadComplete: opt.onFileUploadComplete
                , success: opt.success
                , fail: opt.fail
                , flashUpload: opt.flashUpload
                , body: opt.body
            };
            !opt.roomType && delete this.body.roomType;
        };

        /*
         * video message
         */
        Message.video = function (id) {

        };
        Message.video.prototype.set = function (opt) {

        };

        var _Message = function (message) {

            if (!this instanceof _Message) {
                return new _Message(message, conn);
            }

            this.msg = message;
        };

        _Message.prototype.send = function (conn) {
            var me = this;

            var _send = function (message) {

                message.ext = message.ext || {};
                message.ext.weichat = message.ext.weichat || {};
                message.ext.weichat.originType = message.ext.weichat.originType || 'webim';

                var dom;
                var json = {
                    from: conn.context.userId || ''
                    , to: message.to
                    , bodies: [message.body]
                    , ext: message.ext || {}
                };
                var jsonstr = _utils.stringify(json);
                dom = $msg({
                    type: message.group || 'chat'
                    , to: message.toJid
                    , id: message.id
                    , xmlns: 'jabber:client'
                }).c('body').t(jsonstr);

                if (message.roomType) {
                    dom.up().c('roomtype', {xmlns: 'easemob:x:roomtype', type: 'chatroom'});
                }
                if (message.bodyId) {
                    dom = $msg({
                        from: conn.context.jid || ''
                        , to: message.toJid
                        , id: message.id
                        , xmlns: 'jabber:client'
                    }).c('body').t(message.bodyId);
                    var delivery = {
                        xmlns: 'urn:xmpp:receipts'
                        , id: message.bodyId
                    };
                    dom.up().c('delivery', delivery);
                }
                if (message.ackId) {

                    if (conn.context.jid.indexOf(message.toJid) >= 0) {
                        return;
                    }
                    dom = $msg({
                        from: conn.context.jid || ''
                        , to: message.toJid
                        , id: message.id
                        , xmlns: 'jabber:client'
                    }).c('body').t(message.ackId);
                    var read = {
                        xmlns: 'urn:xmpp:receipts'
                        , id: message.ackId
                    };
                    dom.up().c('acked', read);
                }

                setTimeout(function () {
                    if (typeof _msgHash !== 'undefined' && _msgHash[message.id]) {
                        _msgHash[message.id].msg.fail instanceof Function
                        && _msgHash[message.id].msg.fail(message.id);
                    }
                }, 60000);
                conn.sendCommand(dom.tree(), message.id);
            };


            if (me.msg.file) {
                if (me.msg.body && me.msg.body.url) {// Only send msg
                    _send(me.msg);
                    return;
                }
                var _tmpComplete = me.msg.onFileUploadComplete;
                var _complete = function (data) {
                    if (data.entities[0]['file-metadata']) {
                        var file_len = data.entities[0]['file-metadata']['content-length'];
                        // me.msg.file_length = file_len;
                        me.msg.filetype = data.entities[0]['file-metadata']['content-type'];
                        if (file_len > 204800) {
                            me.msg.thumbnail = true;
                        }
                    }

                    me.msg.body = {
                        type: me.msg.type || 'file'
                        ,
                        url: ((location.protocol != 'https:' && conn.isHttpDNS) ? (conn.apiUrl + data.uri.substr(data.uri.indexOf("/", 9))) : data.uri) + '/' + data.entities[0]['uuid']
                        , secret: data.entities[0]['share-secret']
                        , filename: me.msg.file.filename || me.msg.filename
                        , size: {
                            width: me.msg.width || 0
                            , height: me.msg.height || 0
                        }
                        , length: me.msg.length || 0
                        , file_length: me.msg.ext.file_length || 0
                        , filetype: me.msg.filetype
                    }
                    _send(me.msg);
                    _tmpComplete instanceof Function && _tmpComplete(data, me.msg.id);
                };

                me.msg.onFileUploadComplete = _complete;
                _utils.uploadFile.call(conn, me.msg);
            } else {
                me.msg.body = {
                    type: me.msg.type === 'chat' ? 'txt' : me.msg.type
                    , msg: me.msg.msg
                };
                if (me.msg.type === 'cmd') {
                    me.msg.body.action = me.msg.action;
                } else if (me.msg.type === 'loc') {
                    me.msg.body.addr = me.msg.addr;
                    me.msg.body.lat = me.msg.lat;
                    me.msg.body.lng = me.msg.lng;
                }

                _send(me.msg);
            }
        };

        exports._msg = _Message;
        exports.message = Message;
    }());


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(7), __webpack_require__(8), __webpack_require__(9), __webpack_require__(10), __webpack_require__(11), __webpack_require__(12), __webpack_require__(13), __webpack_require__(14), __webpack_require__(15), __webpack_require__(16), __webpack_require__(17), __webpack_require__(18), __webpack_require__(19), __webpack_require__(20), __webpack_require__(21), __webpack_require__(22), __webpack_require__(23), __webpack_require__(24), __webpack_require__(25), __webpack_require__(26), __webpack_require__(27), __webpack_require__(28), __webpack_require__(29), __webpack_require__(30), __webpack_require__(31), __webpack_require__(32), __webpack_require__(33), __webpack_require__(34), __webpack_require__(35), __webpack_require__(36), __webpack_require__(37), __webpack_require__(38));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./x64-core", "./lib-typedarrays", "./enc-utf16", "./enc-base64", "./md5", "./sha1", "./sha256", "./sha224", "./sha512", "./sha384", "./sha3", "./ripemd160", "./hmac", "./pbkdf2", "./evpkdf", "./cipher-core", "./mode-cfb", "./mode-ctr", "./mode-ctr-gladman", "./mode-ofb", "./mode-ecb", "./pad-ansix923", "./pad-iso10126", "./pad-iso97971", "./pad-zeropadding", "./pad-nopadding", "./format-hex", "./aes", "./tripledes", "./rc4", "./rabbit", "./rabbit-legacy"], factory);
        }
        else {
            // Global (browser)
            root.CryptoJS = factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        return CryptoJS;

    }));

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory) {
        if (true) {
            // CommonJS
            module.exports = exports = factory();
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define([], factory);
        }
        else {
            // Global (browser)
            root.CryptoJS = factory();
        }
    }(this, function () {

        /**
         * CryptoJS core components.
         */
        var CryptoJS = CryptoJS || (function (Math, undefined) {
            /*
             * Local polyfil of Object.create
             */
            var create = Object.create || (function () {
                function F() {};

                return function (obj) {
                    var subtype;

                    F.prototype = obj;

                    subtype = new F();

                    F.prototype = null;

                    return subtype;
                };
            }())

            /**
             * CryptoJS namespace.
             */
            var C = {};

            /**
             * Library namespace.
             */
            var C_lib = C.lib = {};

            /**
             * Base object for prototypal inheritance.
             */
            var Base = C_lib.Base = (function () {


                return {
                    /**
                     * Creates a new object that inherits from this object.
                     *
                     * @param {Object} overrides Properties to copy into the new object.
                     *
                     * @return {Object} The new object.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var MyType = CryptoJS.lib.Base.extend({
                     *         field: 'value',
                     *
                     *         method: function () {
                     *         }
                     *     });
                     */
                    extend: function (overrides) {
                        // Spawn
                        var subtype = create(this);

                        // Augment
                        if (overrides) {
                            subtype.mixIn(overrides);
                        }

                        // Create default initializer
                        if (!subtype.hasOwnProperty('init') || this.init === subtype.init) {
                            subtype.init = function () {
                                subtype.$super.init.apply(this, arguments);
                            };
                        }

                        // Initializer's prototype is the subtype object
                        subtype.init.prototype = subtype;

                        // Reference supertype
                        subtype.$super = this;

                        return subtype;
                    },

                    /**
                     * Extends this object and runs the init method.
                     * Arguments to create() will be passed to init().
                     *
                     * @return {Object} The new object.
                     *
                     * @static
                     *
                     * @example
                     *
                     *     var instance = MyType.create();
                     */
                    create: function () {
                        var instance = this.extend();
                        instance.init.apply(instance, arguments);

                        return instance;
                    },

                    /**
                     * Initializes a newly created object.
                     * Override this method to add some logic when your objects are created.
                     *
                     * @example
                     *
                     *     var MyType = CryptoJS.lib.Base.extend({
                     *         init: function () {
                     *             // ...
                     *         }
                     *     });
                     */
                    init: function () {
                    },

                    /**
                     * Copies properties into this object.
                     *
                     * @param {Object} properties The properties to mix in.
                     *
                     * @example
                     *
                     *     MyType.mixIn({
                     *         field: 'value'
                     *     });
                     */
                    mixIn: function (properties) {
                        for (var propertyName in properties) {
                            if (properties.hasOwnProperty(propertyName)) {
                                this[propertyName] = properties[propertyName];
                            }
                        }

                        // IE won't copy toString using the loop above
                        if (properties.hasOwnProperty('toString')) {
                            this.toString = properties.toString;
                        }
                    },

                    /**
                     * Creates a copy of this object.
                     *
                     * @return {Object} The clone.
                     *
                     * @example
                     *
                     *     var clone = instance.clone();
                     */
                    clone: function () {
                        return this.init.prototype.extend(this);
                    }
                };
            }());

            /**
             * An array of 32-bit words.
             *
             * @property {Array} words The array of 32-bit words.
             * @property {number} sigBytes The number of significant bytes in this word array.
             */
            var WordArray = C_lib.WordArray = Base.extend({
                /**
                 * Initializes a newly created word array.
                 *
                 * @param {Array} words (Optional) An array of 32-bit words.
                 * @param {number} sigBytes (Optional) The number of significant bytes in the words.
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.lib.WordArray.create();
                 *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607]);
                 *     var wordArray = CryptoJS.lib.WordArray.create([0x00010203, 0x04050607], 6);
                 */
                init: function (words, sigBytes) {
                    words = this.words = words || [];

                    if (sigBytes != undefined) {
                        this.sigBytes = sigBytes;
                    } else {
                        this.sigBytes = words.length * 4;
                    }
                },

                /**
                 * Converts this word array to a string.
                 *
                 * @param {Encoder} encoder (Optional) The encoding strategy to use. Default: CryptoJS.enc.Hex
                 *
                 * @return {string} The stringified word array.
                 *
                 * @example
                 *
                 *     var string = wordArray + '';
                 *     var string = wordArray.toString();
                 *     var string = wordArray.toString(CryptoJS.enc.Utf8);
                 */
                toString: function (encoder) {
                    return (encoder || Hex).stringify(this);
                },

                /**
                 * Concatenates a word array to this word array.
                 *
                 * @param {WordArray} wordArray The word array to append.
                 *
                 * @return {WordArray} This word array.
                 *
                 * @example
                 *
                 *     wordArray1.concat(wordArray2);
                 */
                concat: function (wordArray) {
                    // Shortcuts
                    var thisWords = this.words;
                    var thatWords = wordArray.words;
                    var thisSigBytes = this.sigBytes;
                    var thatSigBytes = wordArray.sigBytes;

                    // Clamp excess bits
                    this.clamp();

                    // Concat
                    if (thisSigBytes % 4) {
                        // Copy one byte at a time
                        for (var i = 0; i < thatSigBytes; i++) {
                            var thatByte = (thatWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                            thisWords[(thisSigBytes + i) >>> 2] |= thatByte << (24 - ((thisSigBytes + i) % 4) * 8);
                        }
                    } else {
                        // Copy one word at a time
                        for (var i = 0; i < thatSigBytes; i += 4) {
                            thisWords[(thisSigBytes + i) >>> 2] = thatWords[i >>> 2];
                        }
                    }
                    this.sigBytes += thatSigBytes;

                    // Chainable
                    return this;
                },

                /**
                 * Removes insignificant bits.
                 *
                 * @example
                 *
                 *     wordArray.clamp();
                 */
                clamp: function () {
                    // Shortcuts
                    var words = this.words;
                    var sigBytes = this.sigBytes;

                    // Clamp
                    words[sigBytes >>> 2] &= 0xffffffff << (32 - (sigBytes % 4) * 8);
                    words.length = Math.ceil(sigBytes / 4);
                },

                /**
                 * Creates a copy of this word array.
                 *
                 * @return {WordArray} The clone.
                 *
                 * @example
                 *
                 *     var clone = wordArray.clone();
                 */
                clone: function () {
                    var clone = Base.clone.call(this);
                    clone.words = this.words.slice(0);

                    return clone;
                },

                /**
                 * Creates a word array filled with random bytes.
                 *
                 * @param {number} nBytes The number of random bytes to generate.
                 *
                 * @return {WordArray} The random word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.lib.WordArray.random(16);
                 */
                random: function (nBytes) {
                    var words = [];

                    var r = (function (m_w) {
                        var m_w = m_w;
                        var m_z = 0x3ade68b1;
                        var mask = 0xffffffff;

                        return function () {
                            m_z = (0x9069 * (m_z & 0xFFFF) + (m_z >> 0x10)) & mask;
                            m_w = (0x4650 * (m_w & 0xFFFF) + (m_w >> 0x10)) & mask;
                            var result = ((m_z << 0x10) + m_w) & mask;
                            result /= 0x100000000;
                            result += 0.5;
                            return result * (Math.random() > .5 ? 1 : -1);
                        }
                    });

                    for (var i = 0, rcache; i < nBytes; i += 4) {
                        var _r = r((rcache || Math.random()) * 0x100000000);

                        rcache = _r() * 0x3ade67b7;
                        words.push((_r() * 0x100000000) | 0);
                    }

                    return new WordArray.init(words, nBytes);
                }
            });

            /**
             * Encoder namespace.
             */
            var C_enc = C.enc = {};

            /**
             * Hex encoding strategy.
             */
            var Hex = C_enc.Hex = {
                /**
                 * Converts a word array to a hex string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The hex string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hexString = CryptoJS.enc.Hex.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    // Shortcuts
                    var words = wordArray.words;
                    var sigBytes = wordArray.sigBytes;

                    // Convert
                    var hexChars = [];
                    for (var i = 0; i < sigBytes; i++) {
                        var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                        hexChars.push((bite >>> 4).toString(16));
                        hexChars.push((bite & 0x0f).toString(16));
                    }

                    return hexChars.join('');
                },

                /**
                 * Converts a hex string to a word array.
                 *
                 * @param {string} hexStr The hex string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Hex.parse(hexString);
                 */
                parse: function (hexStr) {
                    // Shortcut
                    var hexStrLength = hexStr.length;

                    // Convert
                    var words = [];
                    for (var i = 0; i < hexStrLength; i += 2) {
                        words[i >>> 3] |= parseInt(hexStr.substr(i, 2), 16) << (24 - (i % 8) * 4);
                    }

                    return new WordArray.init(words, hexStrLength / 2);
                }
            };

            /**
             * Latin1 encoding strategy.
             */
            var Latin1 = C_enc.Latin1 = {
                /**
                 * Converts a word array to a Latin1 string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The Latin1 string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var latin1String = CryptoJS.enc.Latin1.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    // Shortcuts
                    var words = wordArray.words;
                    var sigBytes = wordArray.sigBytes;

                    // Convert
                    var latin1Chars = [];
                    for (var i = 0; i < sigBytes; i++) {
                        var bite = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                        latin1Chars.push(String.fromCharCode(bite));
                    }

                    return latin1Chars.join('');
                },

                /**
                 * Converts a Latin1 string to a word array.
                 *
                 * @param {string} latin1Str The Latin1 string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Latin1.parse(latin1String);
                 */
                parse: function (latin1Str) {
                    // Shortcut
                    var latin1StrLength = latin1Str.length;

                    // Convert
                    var words = [];
                    for (var i = 0; i < latin1StrLength; i++) {
                        words[i >>> 2] |= (latin1Str.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
                    }

                    return new WordArray.init(words, latin1StrLength);
                }
            };

            /**
             * UTF-8 encoding strategy.
             */
            var Utf8 = C_enc.Utf8 = {
                /**
                 * Converts a word array to a UTF-8 string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The UTF-8 string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var utf8String = CryptoJS.enc.Utf8.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    try {
                        return decodeURIComponent(escape(Latin1.stringify(wordArray)));
                    } catch (e) {
                        throw new Error('Malformed UTF-8 data');
                    }
                },

                /**
                 * Converts a UTF-8 string to a word array.
                 *
                 * @param {string} utf8Str The UTF-8 string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Utf8.parse(utf8String);
                 */
                parse: function (utf8Str) {
                    return Latin1.parse(unescape(encodeURIComponent(utf8Str)));
                }
            };

            /**
             * Abstract buffered block algorithm template.
             *
             * The property blockSize must be implemented in a concrete subtype.
             *
             * @property {number} _minBufferSize The number of blocks that should be kept unprocessed in the buffer. Default: 0
             */
            var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm = Base.extend({
                /**
                 * Resets this block algorithm's data buffer to its initial state.
                 *
                 * @example
                 *
                 *     bufferedBlockAlgorithm.reset();
                 */
                reset: function () {
                    // Initial values
                    this._data = new WordArray.init();
                    this._nDataBytes = 0;
                },

                /**
                 * Adds new data to this block algorithm's buffer.
                 *
                 * @param {WordArray|string} data The data to append. Strings are converted to a WordArray using UTF-8.
                 *
                 * @example
                 *
                 *     bufferedBlockAlgorithm._append('data');
                 *     bufferedBlockAlgorithm._append(wordArray);
                 */
                _append: function (data) {
                    // Convert string to WordArray, else assume WordArray already
                    if (typeof data == 'string') {
                        data = Utf8.parse(data);
                    }

                    // Append
                    this._data.concat(data);
                    this._nDataBytes += data.sigBytes;
                },

                /**
                 * Processes available data blocks.
                 *
                 * This method invokes _doProcessBlock(offset), which must be implemented by a concrete subtype.
                 *
                 * @param {boolean} doFlush Whether all blocks and partial blocks should be processed.
                 *
                 * @return {WordArray} The processed data.
                 *
                 * @example
                 *
                 *     var processedData = bufferedBlockAlgorithm._process();
                 *     var processedData = bufferedBlockAlgorithm._process(!!'flush');
                 */
                _process: function (doFlush) {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;
                    var dataSigBytes = data.sigBytes;
                    var blockSize = this.blockSize;
                    var blockSizeBytes = blockSize * 4;

                    // Count blocks ready
                    var nBlocksReady = dataSigBytes / blockSizeBytes;
                    if (doFlush) {
                        // Round up to include partial blocks
                        nBlocksReady = Math.ceil(nBlocksReady);
                    } else {
                        // Round down to include only full blocks,
                        // less the number of blocks that must remain in the buffer
                        nBlocksReady = Math.max((nBlocksReady | 0) - this._minBufferSize, 0);
                    }

                    // Count words ready
                    var nWordsReady = nBlocksReady * blockSize;

                    // Count bytes ready
                    var nBytesReady = Math.min(nWordsReady * 4, dataSigBytes);

                    // Process blocks
                    if (nWordsReady) {
                        for (var offset = 0; offset < nWordsReady; offset += blockSize) {
                            // Perform concrete-algorithm logic
                            this._doProcessBlock(dataWords, offset);
                        }

                        // Remove processed words
                        var processedWords = dataWords.splice(0, nWordsReady);
                        data.sigBytes -= nBytesReady;
                    }

                    // Return processed words
                    return new WordArray.init(processedWords, nBytesReady);
                },

                /**
                 * Creates a copy of this object.
                 *
                 * @return {Object} The clone.
                 *
                 * @example
                 *
                 *     var clone = bufferedBlockAlgorithm.clone();
                 */
                clone: function () {
                    var clone = Base.clone.call(this);
                    clone._data = this._data.clone();

                    return clone;
                },

                _minBufferSize: 0
            });

            /**
             * Abstract hasher template.
             *
             * @property {number} blockSize The number of 32-bit words this hasher operates on. Default: 16 (512 bits)
             */
            var Hasher = C_lib.Hasher = BufferedBlockAlgorithm.extend({
                /**
                 * Configuration options.
                 */
                cfg: Base.extend(),

                /**
                 * Initializes a newly created hasher.
                 *
                 * @param {Object} cfg (Optional) The configuration options to use for this hash computation.
                 *
                 * @example
                 *
                 *     var hasher = CryptoJS.algo.SHA256.create();
                 */
                init: function (cfg) {
                    // Apply config defaults
                    this.cfg = this.cfg.extend(cfg);

                    // Set initial values
                    this.reset();
                },

                /**
                 * Resets this hasher to its initial state.
                 *
                 * @example
                 *
                 *     hasher.reset();
                 */
                reset: function () {
                    // Reset data buffer
                    BufferedBlockAlgorithm.reset.call(this);

                    // Perform concrete-hasher logic
                    this._doReset();
                },

                /**
                 * Updates this hasher with a message.
                 *
                 * @param {WordArray|string} messageUpdate The message to append.
                 *
                 * @return {Hasher} This hasher.
                 *
                 * @example
                 *
                 *     hasher.update('message');
                 *     hasher.update(wordArray);
                 */
                update: function (messageUpdate) {
                    // Append
                    this._append(messageUpdate);

                    // Update the hash
                    this._process();

                    // Chainable
                    return this;
                },

                /**
                 * Finalizes the hash computation.
                 * Note that the finalize operation is effectively a destructive, read-once operation.
                 *
                 * @param {WordArray|string} messageUpdate (Optional) A final message update.
                 *
                 * @return {WordArray} The hash.
                 *
                 * @example
                 *
                 *     var hash = hasher.finalize();
                 *     var hash = hasher.finalize('message');
                 *     var hash = hasher.finalize(wordArray);
                 */
                finalize: function (messageUpdate) {
                    // Final message update
                    if (messageUpdate) {
                        this._append(messageUpdate);
                    }

                    // Perform concrete-hasher logic
                    var hash = this._doFinalize();

                    return hash;
                },

                blockSize: 512/32,

                /**
                 * Creates a shortcut function to a hasher's object interface.
                 *
                 * @param {Hasher} hasher The hasher to create a helper for.
                 *
                 * @return {Function} The shortcut function.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var SHA256 = CryptoJS.lib.Hasher._createHelper(CryptoJS.algo.SHA256);
                 */
                _createHelper: function (hasher) {
                    return function (message, cfg) {
                        return new hasher.init(cfg).finalize(message);
                    };
                },

                /**
                 * Creates a shortcut function to the HMAC's object interface.
                 *
                 * @param {Hasher} hasher The hasher to use in this HMAC helper.
                 *
                 * @return {Function} The shortcut function.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var HmacSHA256 = CryptoJS.lib.Hasher._createHmacHelper(CryptoJS.algo.SHA256);
                 */
                _createHmacHelper: function (hasher) {
                    return function (message, key) {
                        return new C_algo.HMAC.init(hasher, key).finalize(message);
                    };
                }
            });

            /**
             * Algorithm namespace.
             */
            var C_algo = C.algo = {};

            return C;
        }(Math));


        return CryptoJS;

    }));

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function (undefined) {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var Base = C_lib.Base;
            var X32WordArray = C_lib.WordArray;

            /**
             * x64 namespace.
             */
            var C_x64 = C.x64 = {};

            /**
             * A 64-bit word.
             */
            var X64Word = C_x64.Word = Base.extend({
                /**
                 * Initializes a newly created 64-bit word.
                 *
                 * @param {number} high The high 32 bits.
                 * @param {number} low The low 32 bits.
                 *
                 * @example
                 *
                 *     var x64Word = CryptoJS.x64.Word.create(0x00010203, 0x04050607);
                 */
                init: function (high, low) {
                    this.high = high;
                    this.low = low;
                }

                /**
                 * Bitwise NOTs this word.
                 *
                 * @return {X64Word} A new x64-Word object after negating.
                 *
                 * @example
                 *
                 *     var negated = x64Word.not();
                 */
                // not: function () {
                    // var high = ~this.high;
                    // var low = ~this.low;

                    // return X64Word.create(high, low);
                // },

                /**
                 * Bitwise ANDs this word with the passed word.
                 *
                 * @param {X64Word} word The x64-Word to AND with this word.
                 *
                 * @return {X64Word} A new x64-Word object after ANDing.
                 *
                 * @example
                 *
                 *     var anded = x64Word.and(anotherX64Word);
                 */
                // and: function (word) {
                    // var high = this.high & word.high;
                    // var low = this.low & word.low;

                    // return X64Word.create(high, low);
                // },

                /**
                 * Bitwise ORs this word with the passed word.
                 *
                 * @param {X64Word} word The x64-Word to OR with this word.
                 *
                 * @return {X64Word} A new x64-Word object after ORing.
                 *
                 * @example
                 *
                 *     var ored = x64Word.or(anotherX64Word);
                 */
                // or: function (word) {
                    // var high = this.high | word.high;
                    // var low = this.low | word.low;

                    // return X64Word.create(high, low);
                // },

                /**
                 * Bitwise XORs this word with the passed word.
                 *
                 * @param {X64Word} word The x64-Word to XOR with this word.
                 *
                 * @return {X64Word} A new x64-Word object after XORing.
                 *
                 * @example
                 *
                 *     var xored = x64Word.xor(anotherX64Word);
                 */
                // xor: function (word) {
                    // var high = this.high ^ word.high;
                    // var low = this.low ^ word.low;

                    // return X64Word.create(high, low);
                // },

                /**
                 * Shifts this word n bits to the left.
                 *
                 * @param {number} n The number of bits to shift.
                 *
                 * @return {X64Word} A new x64-Word object after shifting.
                 *
                 * @example
                 *
                 *     var shifted = x64Word.shiftL(25);
                 */
                // shiftL: function (n) {
                    // if (n < 32) {
                        // var high = (this.high << n) | (this.low >>> (32 - n));
                        // var low = this.low << n;
                    // } else {
                        // var high = this.low << (n - 32);
                        // var low = 0;
                    // }

                    // return X64Word.create(high, low);
                // },

                /**
                 * Shifts this word n bits to the right.
                 *
                 * @param {number} n The number of bits to shift.
                 *
                 * @return {X64Word} A new x64-Word object after shifting.
                 *
                 * @example
                 *
                 *     var shifted = x64Word.shiftR(7);
                 */
                // shiftR: function (n) {
                    // if (n < 32) {
                        // var low = (this.low >>> n) | (this.high << (32 - n));
                        // var high = this.high >>> n;
                    // } else {
                        // var low = this.high >>> (n - 32);
                        // var high = 0;
                    // }

                    // return X64Word.create(high, low);
                // },

                /**
                 * Rotates this word n bits to the left.
                 *
                 * @param {number} n The number of bits to rotate.
                 *
                 * @return {X64Word} A new x64-Word object after rotating.
                 *
                 * @example
                 *
                 *     var rotated = x64Word.rotL(25);
                 */
                // rotL: function (n) {
                    // return this.shiftL(n).or(this.shiftR(64 - n));
                // },

                /**
                 * Rotates this word n bits to the right.
                 *
                 * @param {number} n The number of bits to rotate.
                 *
                 * @return {X64Word} A new x64-Word object after rotating.
                 *
                 * @example
                 *
                 *     var rotated = x64Word.rotR(7);
                 */
                // rotR: function (n) {
                    // return this.shiftR(n).or(this.shiftL(64 - n));
                // },

                /**
                 * Adds this word with the passed word.
                 *
                 * @param {X64Word} word The x64-Word to add with this word.
                 *
                 * @return {X64Word} A new x64-Word object after adding.
                 *
                 * @example
                 *
                 *     var added = x64Word.add(anotherX64Word);
                 */
                // add: function (word) {
                    // var low = (this.low + word.low) | 0;
                    // var carry = (low >>> 0) < (this.low >>> 0) ? 1 : 0;
                    // var high = (this.high + word.high + carry) | 0;

                    // return X64Word.create(high, low);
                // }
            });

            /**
             * An array of 64-bit words.
             *
             * @property {Array} words The array of CryptoJS.x64.Word objects.
             * @property {number} sigBytes The number of significant bytes in this word array.
             */
            var X64WordArray = C_x64.WordArray = Base.extend({
                /**
                 * Initializes a newly created word array.
                 *
                 * @param {Array} words (Optional) An array of CryptoJS.x64.Word objects.
                 * @param {number} sigBytes (Optional) The number of significant bytes in the words.
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.x64.WordArray.create();
                 *
                 *     var wordArray = CryptoJS.x64.WordArray.create([
                 *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
                 *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
                 *     ]);
                 *
                 *     var wordArray = CryptoJS.x64.WordArray.create([
                 *         CryptoJS.x64.Word.create(0x00010203, 0x04050607),
                 *         CryptoJS.x64.Word.create(0x18191a1b, 0x1c1d1e1f)
                 *     ], 10);
                 */
                init: function (words, sigBytes) {
                    words = this.words = words || [];

                    if (sigBytes != undefined) {
                        this.sigBytes = sigBytes;
                    } else {
                        this.sigBytes = words.length * 8;
                    }
                },

                /**
                 * Converts this 64-bit word array to a 32-bit word array.
                 *
                 * @return {CryptoJS.lib.WordArray} This word array's data as a 32-bit word array.
                 *
                 * @example
                 *
                 *     var x32WordArray = x64WordArray.toX32();
                 */
                toX32: function () {
                    // Shortcuts
                    var x64Words = this.words;
                    var x64WordsLength = x64Words.length;

                    // Convert
                    var x32Words = [];
                    for (var i = 0; i < x64WordsLength; i++) {
                        var x64Word = x64Words[i];
                        x32Words.push(x64Word.high);
                        x32Words.push(x64Word.low);
                    }

                    return X32WordArray.create(x32Words, this.sigBytes);
                },

                /**
                 * Creates a copy of this word array.
                 *
                 * @return {X64WordArray} The clone.
                 *
                 * @example
                 *
                 *     var clone = x64WordArray.clone();
                 */
                clone: function () {
                    var clone = Base.clone.call(this);

                    // Clone "words" array
                    var words = clone.words = this.words.slice(0);

                    // Clone each X64Word object
                    var wordsLength = words.length;
                    for (var i = 0; i < wordsLength; i++) {
                        words[i] = words[i].clone();
                    }

                    return clone;
                }
            });
        }());


        return CryptoJS;

    }));

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Check if typed arrays are supported
            if (typeof ArrayBuffer != 'function') {
                return;
            }

            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;

            // Reference original init
            var superInit = WordArray.init;

            // Augment WordArray.init to handle typed arrays
            var subInit = WordArray.init = function (typedArray) {
                // Convert buffers to uint8
                if (typedArray instanceof ArrayBuffer) {
                    typedArray = new Uint8Array(typedArray);
                }

                // Convert other array views to uint8
                if (
                    typedArray instanceof Int8Array ||
                    (typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray) ||
                    typedArray instanceof Int16Array ||
                    typedArray instanceof Uint16Array ||
                    typedArray instanceof Int32Array ||
                    typedArray instanceof Uint32Array ||
                    typedArray instanceof Float32Array ||
                    typedArray instanceof Float64Array
                ) {
                    typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
                }

                // Handle Uint8Array
                if (typedArray instanceof Uint8Array) {
                    // Shortcut
                    var typedArrayByteLength = typedArray.byteLength;

                    // Extract bytes
                    var words = [];
                    for (var i = 0; i < typedArrayByteLength; i++) {
                        words[i >>> 2] |= typedArray[i] << (24 - (i % 4) * 8);
                    }

                    // Initialize this word array
                    superInit.call(this, words, typedArrayByteLength);
                } else {
                    // Else call normal init
                    superInit.apply(this, arguments);
                }
            };

            subInit.prototype = WordArray;
        }());


        return CryptoJS.lib.WordArray;

    }));

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var C_enc = C.enc;

            /**
             * UTF-16 BE encoding strategy.
             */
            var Utf16BE = C_enc.Utf16 = C_enc.Utf16BE = {
                /**
                 * Converts a word array to a UTF-16 BE string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The UTF-16 BE string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var utf16String = CryptoJS.enc.Utf16.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    // Shortcuts
                    var words = wordArray.words;
                    var sigBytes = wordArray.sigBytes;

                    // Convert
                    var utf16Chars = [];
                    for (var i = 0; i < sigBytes; i += 2) {
                        var codePoint = (words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff;
                        utf16Chars.push(String.fromCharCode(codePoint));
                    }

                    return utf16Chars.join('');
                },

                /**
                 * Converts a UTF-16 BE string to a word array.
                 *
                 * @param {string} utf16Str The UTF-16 BE string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Utf16.parse(utf16String);
                 */
                parse: function (utf16Str) {
                    // Shortcut
                    var utf16StrLength = utf16Str.length;

                    // Convert
                    var words = [];
                    for (var i = 0; i < utf16StrLength; i++) {
                        words[i >>> 1] |= utf16Str.charCodeAt(i) << (16 - (i % 2) * 16);
                    }

                    return WordArray.create(words, utf16StrLength * 2);
                }
            };

            /**
             * UTF-16 LE encoding strategy.
             */
            C_enc.Utf16LE = {
                /**
                 * Converts a word array to a UTF-16 LE string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The UTF-16 LE string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var utf16Str = CryptoJS.enc.Utf16LE.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    // Shortcuts
                    var words = wordArray.words;
                    var sigBytes = wordArray.sigBytes;

                    // Convert
                    var utf16Chars = [];
                    for (var i = 0; i < sigBytes; i += 2) {
                        var codePoint = swapEndian((words[i >>> 2] >>> (16 - (i % 4) * 8)) & 0xffff);
                        utf16Chars.push(String.fromCharCode(codePoint));
                    }

                    return utf16Chars.join('');
                },

                /**
                 * Converts a UTF-16 LE string to a word array.
                 *
                 * @param {string} utf16Str The UTF-16 LE string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Utf16LE.parse(utf16Str);
                 */
                parse: function (utf16Str) {
                    // Shortcut
                    var utf16StrLength = utf16Str.length;

                    // Convert
                    var words = [];
                    for (var i = 0; i < utf16StrLength; i++) {
                        words[i >>> 1] |= swapEndian(utf16Str.charCodeAt(i) << (16 - (i % 2) * 16));
                    }

                    return WordArray.create(words, utf16StrLength * 2);
                }
            };

            function swapEndian(word) {
                return ((word << 8) & 0xff00ff00) | ((word >>> 8) & 0x00ff00ff);
            }
        }());


        return CryptoJS.enc.Utf16;

    }));

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var C_enc = C.enc;

            /**
             * Base64 encoding strategy.
             */
            var Base64 = C_enc.Base64 = {
                /**
                 * Converts a word array to a Base64 string.
                 *
                 * @param {WordArray} wordArray The word array.
                 *
                 * @return {string} The Base64 string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
                 */
                stringify: function (wordArray) {
                    // Shortcuts
                    var words = wordArray.words;
                    var sigBytes = wordArray.sigBytes;
                    var map = this._map;

                    // Clamp excess bits
                    wordArray.clamp();

                    // Convert
                    var base64Chars = [];
                    for (var i = 0; i < sigBytes; i += 3) {
                        var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
                        var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                        var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                        var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                        for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                            base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                        }
                    }

                    // Add padding
                    var paddingChar = map.charAt(64);
                    if (paddingChar) {
                        while (base64Chars.length % 4) {
                            base64Chars.push(paddingChar);
                        }
                    }

                    return base64Chars.join('');
                },

                /**
                 * Converts a Base64 string to a word array.
                 *
                 * @param {string} base64Str The Base64 string.
                 *
                 * @return {WordArray} The word array.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
                 */
                parse: function (base64Str) {
                    // Shortcuts
                    var base64StrLength = base64Str.length;
                    var map = this._map;
                    var reverseMap = this._reverseMap;

                    if (!reverseMap) {
                            reverseMap = this._reverseMap = [];
                            for (var j = 0; j < map.length; j++) {
                                reverseMap[map.charCodeAt(j)] = j;
                            }
                    }

                    // Ignore padding
                    var paddingChar = map.charAt(64);
                    if (paddingChar) {
                        var paddingIndex = base64Str.indexOf(paddingChar);
                        if (paddingIndex !== -1) {
                            base64StrLength = paddingIndex;
                        }
                    }

                    // Convert
                    return parseLoop(base64Str, base64StrLength, reverseMap);

                },

                _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
            };

            function parseLoop(base64Str, base64StrLength, reverseMap) {
              var words = [];
              var nBytes = 0;
              for (var i = 0; i < base64StrLength; i++) {
                  if (i % 4) {
                      var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
                      var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
                      words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
                      nBytes++;
                  }
              }
              return WordArray.create(words, nBytes);
            }
        }());


        return CryptoJS.enc.Base64;

    }));

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function (Math) {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var Hasher = C_lib.Hasher;
            var C_algo = C.algo;

            // Constants table
            var T = [];

            // Compute constants
            (function () {
                for (var i = 0; i < 64; i++) {
                    T[i] = (Math.abs(Math.sin(i + 1)) * 0x100000000) | 0;
                }
            }());

            /**
             * MD5 hash algorithm.
             */
            var MD5 = C_algo.MD5 = Hasher.extend({
                _doReset: function () {
                    this._hash = new WordArray.init([
                        0x67452301, 0xefcdab89,
                        0x98badcfe, 0x10325476
                    ]);
                },

                _doProcessBlock: function (M, offset) {
                    // Swap endian
                    for (var i = 0; i < 16; i++) {
                        // Shortcuts
                        var offset_i = offset + i;
                        var M_offset_i = M[offset_i];

                        M[offset_i] = (
                            (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
                            (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
                        );
                    }

                    // Shortcuts
                    var H = this._hash.words;

                    var M_offset_0  = M[offset + 0];
                    var M_offset_1  = M[offset + 1];
                    var M_offset_2  = M[offset + 2];
                    var M_offset_3  = M[offset + 3];
                    var M_offset_4  = M[offset + 4];
                    var M_offset_5  = M[offset + 5];
                    var M_offset_6  = M[offset + 6];
                    var M_offset_7  = M[offset + 7];
                    var M_offset_8  = M[offset + 8];
                    var M_offset_9  = M[offset + 9];
                    var M_offset_10 = M[offset + 10];
                    var M_offset_11 = M[offset + 11];
                    var M_offset_12 = M[offset + 12];
                    var M_offset_13 = M[offset + 13];
                    var M_offset_14 = M[offset + 14];
                    var M_offset_15 = M[offset + 15];

                    // Working varialbes
                    var a = H[0];
                    var b = H[1];
                    var c = H[2];
                    var d = H[3];

                    // Computation
                    a = FF(a, b, c, d, M_offset_0,  7,  T[0]);
                    d = FF(d, a, b, c, M_offset_1,  12, T[1]);
                    c = FF(c, d, a, b, M_offset_2,  17, T[2]);
                    b = FF(b, c, d, a, M_offset_3,  22, T[3]);
                    a = FF(a, b, c, d, M_offset_4,  7,  T[4]);
                    d = FF(d, a, b, c, M_offset_5,  12, T[5]);
                    c = FF(c, d, a, b, M_offset_6,  17, T[6]);
                    b = FF(b, c, d, a, M_offset_7,  22, T[7]);
                    a = FF(a, b, c, d, M_offset_8,  7,  T[8]);
                    d = FF(d, a, b, c, M_offset_9,  12, T[9]);
                    c = FF(c, d, a, b, M_offset_10, 17, T[10]);
                    b = FF(b, c, d, a, M_offset_11, 22, T[11]);
                    a = FF(a, b, c, d, M_offset_12, 7,  T[12]);
                    d = FF(d, a, b, c, M_offset_13, 12, T[13]);
                    c = FF(c, d, a, b, M_offset_14, 17, T[14]);
                    b = FF(b, c, d, a, M_offset_15, 22, T[15]);

                    a = GG(a, b, c, d, M_offset_1,  5,  T[16]);
                    d = GG(d, a, b, c, M_offset_6,  9,  T[17]);
                    c = GG(c, d, a, b, M_offset_11, 14, T[18]);
                    b = GG(b, c, d, a, M_offset_0,  20, T[19]);
                    a = GG(a, b, c, d, M_offset_5,  5,  T[20]);
                    d = GG(d, a, b, c, M_offset_10, 9,  T[21]);
                    c = GG(c, d, a, b, M_offset_15, 14, T[22]);
                    b = GG(b, c, d, a, M_offset_4,  20, T[23]);
                    a = GG(a, b, c, d, M_offset_9,  5,  T[24]);
                    d = GG(d, a, b, c, M_offset_14, 9,  T[25]);
                    c = GG(c, d, a, b, M_offset_3,  14, T[26]);
                    b = GG(b, c, d, a, M_offset_8,  20, T[27]);
                    a = GG(a, b, c, d, M_offset_13, 5,  T[28]);
                    d = GG(d, a, b, c, M_offset_2,  9,  T[29]);
                    c = GG(c, d, a, b, M_offset_7,  14, T[30]);
                    b = GG(b, c, d, a, M_offset_12, 20, T[31]);

                    a = HH(a, b, c, d, M_offset_5,  4,  T[32]);
                    d = HH(d, a, b, c, M_offset_8,  11, T[33]);
                    c = HH(c, d, a, b, M_offset_11, 16, T[34]);
                    b = HH(b, c, d, a, M_offset_14, 23, T[35]);
                    a = HH(a, b, c, d, M_offset_1,  4,  T[36]);
                    d = HH(d, a, b, c, M_offset_4,  11, T[37]);
                    c = HH(c, d, a, b, M_offset_7,  16, T[38]);
                    b = HH(b, c, d, a, M_offset_10, 23, T[39]);
                    a = HH(a, b, c, d, M_offset_13, 4,  T[40]);
                    d = HH(d, a, b, c, M_offset_0,  11, T[41]);
                    c = HH(c, d, a, b, M_offset_3,  16, T[42]);
                    b = HH(b, c, d, a, M_offset_6,  23, T[43]);
                    a = HH(a, b, c, d, M_offset_9,  4,  T[44]);
                    d = HH(d, a, b, c, M_offset_12, 11, T[45]);
                    c = HH(c, d, a, b, M_offset_15, 16, T[46]);
                    b = HH(b, c, d, a, M_offset_2,  23, T[47]);

                    a = II(a, b, c, d, M_offset_0,  6,  T[48]);
                    d = II(d, a, b, c, M_offset_7,  10, T[49]);
                    c = II(c, d, a, b, M_offset_14, 15, T[50]);
                    b = II(b, c, d, a, M_offset_5,  21, T[51]);
                    a = II(a, b, c, d, M_offset_12, 6,  T[52]);
                    d = II(d, a, b, c, M_offset_3,  10, T[53]);
                    c = II(c, d, a, b, M_offset_10, 15, T[54]);
                    b = II(b, c, d, a, M_offset_1,  21, T[55]);
                    a = II(a, b, c, d, M_offset_8,  6,  T[56]);
                    d = II(d, a, b, c, M_offset_15, 10, T[57]);
                    c = II(c, d, a, b, M_offset_6,  15, T[58]);
                    b = II(b, c, d, a, M_offset_13, 21, T[59]);
                    a = II(a, b, c, d, M_offset_4,  6,  T[60]);
                    d = II(d, a, b, c, M_offset_11, 10, T[61]);
                    c = II(c, d, a, b, M_offset_2,  15, T[62]);
                    b = II(b, c, d, a, M_offset_9,  21, T[63]);

                    // Intermediate hash value
                    H[0] = (H[0] + a) | 0;
                    H[1] = (H[1] + b) | 0;
                    H[2] = (H[2] + c) | 0;
                    H[3] = (H[3] + d) | 0;
                },

                _doFinalize: function () {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);

                    var nBitsTotalH = Math.floor(nBitsTotal / 0x100000000);
                    var nBitsTotalL = nBitsTotal;
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = (
                        (((nBitsTotalH << 8)  | (nBitsTotalH >>> 24)) & 0x00ff00ff) |
                        (((nBitsTotalH << 24) | (nBitsTotalH >>> 8))  & 0xff00ff00)
                    );
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                        (((nBitsTotalL << 8)  | (nBitsTotalL >>> 24)) & 0x00ff00ff) |
                        (((nBitsTotalL << 24) | (nBitsTotalL >>> 8))  & 0xff00ff00)
                    );

                    data.sigBytes = (dataWords.length + 1) * 4;

                    // Hash final blocks
                    this._process();

                    // Shortcuts
                    var hash = this._hash;
                    var H = hash.words;

                    // Swap endian
                    for (var i = 0; i < 4; i++) {
                        // Shortcut
                        var H_i = H[i];

                        H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
                               (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
                    }

                    // Return final computed hash
                    return hash;
                },

                clone: function () {
                    var clone = Hasher.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                }
            });

            function FF(a, b, c, d, x, s, t) {
                var n = a + ((b & c) | (~b & d)) + x + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            }

            function GG(a, b, c, d, x, s, t) {
                var n = a + ((b & d) | (c & ~d)) + x + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            }

            function HH(a, b, c, d, x, s, t) {
                var n = a + (b ^ c ^ d) + x + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            }

            function II(a, b, c, d, x, s, t) {
                var n = a + (c ^ (b | ~d)) + x + t;
                return ((n << s) | (n >>> (32 - s))) + b;
            }

            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.MD5('message');
             *     var hash = CryptoJS.MD5(wordArray);
             */
            C.MD5 = Hasher._createHelper(MD5);

            /**
             * Shortcut function to the HMAC's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {WordArray|string} key The secret key.
             *
             * @return {WordArray} The HMAC.
             *
             * @static
             *
             * @example
             *
             *     var hmac = CryptoJS.HmacMD5(message, key);
             */
            C.HmacMD5 = Hasher._createHmacHelper(MD5);
        }(Math));


        return CryptoJS.MD5;

    }));

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var Hasher = C_lib.Hasher;
            var C_algo = C.algo;

            // Reusable object
            var W = [];

            /**
             * SHA-1 hash algorithm.
             */
            var SHA1 = C_algo.SHA1 = Hasher.extend({
                _doReset: function () {
                    this._hash = new WordArray.init([
                        0x67452301, 0xefcdab89,
                        0x98badcfe, 0x10325476,
                        0xc3d2e1f0
                    ]);
                },

                _doProcessBlock: function (M, offset) {
                    // Shortcut
                    var H = this._hash.words;

                    // Working variables
                    var a = H[0];
                    var b = H[1];
                    var c = H[2];
                    var d = H[3];
                    var e = H[4];

                    // Computation
                    for (var i = 0; i < 80; i++) {
                        if (i < 16) {
                            W[i] = M[offset + i] | 0;
                        } else {
                            var n = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];
                            W[i] = (n << 1) | (n >>> 31);
                        }

                        var t = ((a << 5) | (a >>> 27)) + e + W[i];
                        if (i < 20) {
                            t += ((b & c) | (~b & d)) + 0x5a827999;
                        } else if (i < 40) {
                            t += (b ^ c ^ d) + 0x6ed9eba1;
                        } else if (i < 60) {
                            t += ((b & c) | (b & d) | (c & d)) - 0x70e44324;
                        } else /* if (i < 80) */ {
                            t += (b ^ c ^ d) - 0x359d3e2a;
                        }

                        e = d;
                        d = c;
                        c = (b << 30) | (b >>> 2);
                        b = a;
                        a = t;
                    }

                    // Intermediate hash value
                    H[0] = (H[0] + a) | 0;
                    H[1] = (H[1] + b) | 0;
                    H[2] = (H[2] + c) | 0;
                    H[3] = (H[3] + d) | 0;
                    H[4] = (H[4] + e) | 0;
                },

                _doFinalize: function () {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
                    data.sigBytes = dataWords.length * 4;

                    // Hash final blocks
                    this._process();

                    // Return final computed hash
                    return this._hash;
                },

                clone: function () {
                    var clone = Hasher.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                }
            });

            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.SHA1('message');
             *     var hash = CryptoJS.SHA1(wordArray);
             */
            C.SHA1 = Hasher._createHelper(SHA1);

            /**
             * Shortcut function to the HMAC's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {WordArray|string} key The secret key.
             *
             * @return {WordArray} The HMAC.
             *
             * @static
             *
             * @example
             *
             *     var hmac = CryptoJS.HmacSHA1(message, key);
             */
            C.HmacSHA1 = Hasher._createHmacHelper(SHA1);
        }());


        return CryptoJS.SHA1;

    }));

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function (Math) {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var Hasher = C_lib.Hasher;
            var C_algo = C.algo;

            // Initialization and round constants tables
            var H = [];
            var K = [];

            // Compute constants
            (function () {
                function isPrime(n) {
                    var sqrtN = Math.sqrt(n);
                    for (var factor = 2; factor <= sqrtN; factor++) {
                        if (!(n % factor)) {
                            return false;
                        }
                    }

                    return true;
                }

                function getFractionalBits(n) {
                    return ((n - (n | 0)) * 0x100000000) | 0;
                }

                var n = 2;
                var nPrime = 0;
                while (nPrime < 64) {
                    if (isPrime(n)) {
                        if (nPrime < 8) {
                            H[nPrime] = getFractionalBits(Math.pow(n, 1 / 2));
                        }
                        K[nPrime] = getFractionalBits(Math.pow(n, 1 / 3));

                        nPrime++;
                    }

                    n++;
                }
            }());

            // Reusable object
            var W = [];

            /**
             * SHA-256 hash algorithm.
             */
            var SHA256 = C_algo.SHA256 = Hasher.extend({
                _doReset: function () {
                    this._hash = new WordArray.init(H.slice(0));
                },

                _doProcessBlock: function (M, offset) {
                    // Shortcut
                    var H = this._hash.words;

                    // Working variables
                    var a = H[0];
                    var b = H[1];
                    var c = H[2];
                    var d = H[3];
                    var e = H[4];
                    var f = H[5];
                    var g = H[6];
                    var h = H[7];

                    // Computation
                    for (var i = 0; i < 64; i++) {
                        if (i < 16) {
                            W[i] = M[offset + i] | 0;
                        } else {
                            var gamma0x = W[i - 15];
                            var gamma0  = ((gamma0x << 25) | (gamma0x >>> 7))  ^
                                          ((gamma0x << 14) | (gamma0x >>> 18)) ^
                                           (gamma0x >>> 3);

                            var gamma1x = W[i - 2];
                            var gamma1  = ((gamma1x << 15) | (gamma1x >>> 17)) ^
                                          ((gamma1x << 13) | (gamma1x >>> 19)) ^
                                           (gamma1x >>> 10);

                            W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16];
                        }

                        var ch  = (e & f) ^ (~e & g);
                        var maj = (a & b) ^ (a & c) ^ (b & c);

                        var sigma0 = ((a << 30) | (a >>> 2)) ^ ((a << 19) | (a >>> 13)) ^ ((a << 10) | (a >>> 22));
                        var sigma1 = ((e << 26) | (e >>> 6)) ^ ((e << 21) | (e >>> 11)) ^ ((e << 7)  | (e >>> 25));

                        var t1 = h + sigma1 + ch + K[i] + W[i];
                        var t2 = sigma0 + maj;

                        h = g;
                        g = f;
                        f = e;
                        e = (d + t1) | 0;
                        d = c;
                        c = b;
                        b = a;
                        a = (t1 + t2) | 0;
                    }

                    // Intermediate hash value
                    H[0] = (H[0] + a) | 0;
                    H[1] = (H[1] + b) | 0;
                    H[2] = (H[2] + c) | 0;
                    H[3] = (H[3] + d) | 0;
                    H[4] = (H[4] + e) | 0;
                    H[5] = (H[5] + f) | 0;
                    H[6] = (H[6] + g) | 0;
                    H[7] = (H[7] + h) | 0;
                },

                _doFinalize: function () {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = Math.floor(nBitsTotal / 0x100000000);
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 15] = nBitsTotal;
                    data.sigBytes = dataWords.length * 4;

                    // Hash final blocks
                    this._process();

                    // Return final computed hash
                    return this._hash;
                },

                clone: function () {
                    var clone = Hasher.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                }
            });

            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.SHA256('message');
             *     var hash = CryptoJS.SHA256(wordArray);
             */
            C.SHA256 = Hasher._createHelper(SHA256);

            /**
             * Shortcut function to the HMAC's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {WordArray|string} key The secret key.
             *
             * @return {WordArray} The HMAC.
             *
             * @static
             *
             * @example
             *
             *     var hmac = CryptoJS.HmacSHA256(message, key);
             */
            C.HmacSHA256 = Hasher._createHmacHelper(SHA256);
        }(Math));


        return CryptoJS.SHA256;

    }));

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(13));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./sha256"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var C_algo = C.algo;
            var SHA256 = C_algo.SHA256;

            /**
             * SHA-224 hash algorithm.
             */
            var SHA224 = C_algo.SHA224 = SHA256.extend({
                _doReset: function () {
                    this._hash = new WordArray.init([
                        0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939,
                        0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4
                    ]);
                },

                _doFinalize: function () {
                    var hash = SHA256._doFinalize.call(this);

                    hash.sigBytes -= 4;

                    return hash;
                }
            });

            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.SHA224('message');
             *     var hash = CryptoJS.SHA224(wordArray);
             */
            C.SHA224 = SHA256._createHelper(SHA224);

            /**
             * Shortcut function to the HMAC's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {WordArray|string} key The secret key.
             *
             * @return {WordArray} The HMAC.
             *
             * @static
             *
             * @example
             *
             *     var hmac = CryptoJS.HmacSHA224(message, key);
             */
            C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
        }());


        return CryptoJS.SHA224;

    }));

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(7));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./x64-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var Hasher = C_lib.Hasher;
            var C_x64 = C.x64;
            var X64Word = C_x64.Word;
            var X64WordArray = C_x64.WordArray;
            var C_algo = C.algo;

            function X64Word_create() {
                return X64Word.create.apply(X64Word, arguments);
            }

            // Constants
            var K = [
                X64Word_create(0x428a2f98, 0xd728ae22), X64Word_create(0x71374491, 0x23ef65cd),
                X64Word_create(0xb5c0fbcf, 0xec4d3b2f), X64Word_create(0xe9b5dba5, 0x8189dbbc),
                X64Word_create(0x3956c25b, 0xf348b538), X64Word_create(0x59f111f1, 0xb605d019),
                X64Word_create(0x923f82a4, 0xaf194f9b), X64Word_create(0xab1c5ed5, 0xda6d8118),
                X64Word_create(0xd807aa98, 0xa3030242), X64Word_create(0x12835b01, 0x45706fbe),
                X64Word_create(0x243185be, 0x4ee4b28c), X64Word_create(0x550c7dc3, 0xd5ffb4e2),
                X64Word_create(0x72be5d74, 0xf27b896f), X64Word_create(0x80deb1fe, 0x3b1696b1),
                X64Word_create(0x9bdc06a7, 0x25c71235), X64Word_create(0xc19bf174, 0xcf692694),
                X64Word_create(0xe49b69c1, 0x9ef14ad2), X64Word_create(0xefbe4786, 0x384f25e3),
                X64Word_create(0x0fc19dc6, 0x8b8cd5b5), X64Word_create(0x240ca1cc, 0x77ac9c65),
                X64Word_create(0x2de92c6f, 0x592b0275), X64Word_create(0x4a7484aa, 0x6ea6e483),
                X64Word_create(0x5cb0a9dc, 0xbd41fbd4), X64Word_create(0x76f988da, 0x831153b5),
                X64Word_create(0x983e5152, 0xee66dfab), X64Word_create(0xa831c66d, 0x2db43210),
                X64Word_create(0xb00327c8, 0x98fb213f), X64Word_create(0xbf597fc7, 0xbeef0ee4),
                X64Word_create(0xc6e00bf3, 0x3da88fc2), X64Word_create(0xd5a79147, 0x930aa725),
                X64Word_create(0x06ca6351, 0xe003826f), X64Word_create(0x14292967, 0x0a0e6e70),
                X64Word_create(0x27b70a85, 0x46d22ffc), X64Word_create(0x2e1b2138, 0x5c26c926),
                X64Word_create(0x4d2c6dfc, 0x5ac42aed), X64Word_create(0x53380d13, 0x9d95b3df),
                X64Word_create(0x650a7354, 0x8baf63de), X64Word_create(0x766a0abb, 0x3c77b2a8),
                X64Word_create(0x81c2c92e, 0x47edaee6), X64Word_create(0x92722c85, 0x1482353b),
                X64Word_create(0xa2bfe8a1, 0x4cf10364), X64Word_create(0xa81a664b, 0xbc423001),
                X64Word_create(0xc24b8b70, 0xd0f89791), X64Word_create(0xc76c51a3, 0x0654be30),
                X64Word_create(0xd192e819, 0xd6ef5218), X64Word_create(0xd6990624, 0x5565a910),
                X64Word_create(0xf40e3585, 0x5771202a), X64Word_create(0x106aa070, 0x32bbd1b8),
                X64Word_create(0x19a4c116, 0xb8d2d0c8), X64Word_create(0x1e376c08, 0x5141ab53),
                X64Word_create(0x2748774c, 0xdf8eeb99), X64Word_create(0x34b0bcb5, 0xe19b48a8),
                X64Word_create(0x391c0cb3, 0xc5c95a63), X64Word_create(0x4ed8aa4a, 0xe3418acb),
                X64Word_create(0x5b9cca4f, 0x7763e373), X64Word_create(0x682e6ff3, 0xd6b2b8a3),
                X64Word_create(0x748f82ee, 0x5defb2fc), X64Word_create(0x78a5636f, 0x43172f60),
                X64Word_create(0x84c87814, 0xa1f0ab72), X64Word_create(0x8cc70208, 0x1a6439ec),
                X64Word_create(0x90befffa, 0x23631e28), X64Word_create(0xa4506ceb, 0xde82bde9),
                X64Word_create(0xbef9a3f7, 0xb2c67915), X64Word_create(0xc67178f2, 0xe372532b),
                X64Word_create(0xca273ece, 0xea26619c), X64Word_create(0xd186b8c7, 0x21c0c207),
                X64Word_create(0xeada7dd6, 0xcde0eb1e), X64Word_create(0xf57d4f7f, 0xee6ed178),
                X64Word_create(0x06f067aa, 0x72176fba), X64Word_create(0x0a637dc5, 0xa2c898a6),
                X64Word_create(0x113f9804, 0xbef90dae), X64Word_create(0x1b710b35, 0x131c471b),
                X64Word_create(0x28db77f5, 0x23047d84), X64Word_create(0x32caab7b, 0x40c72493),
                X64Word_create(0x3c9ebe0a, 0x15c9bebc), X64Word_create(0x431d67c4, 0x9c100d4c),
                X64Word_create(0x4cc5d4be, 0xcb3e42b6), X64Word_create(0x597f299c, 0xfc657e2a),
                X64Word_create(0x5fcb6fab, 0x3ad6faec), X64Word_create(0x6c44198c, 0x4a475817)
            ];

            // Reusable objects
            var W = [];
            (function () {
                for (var i = 0; i < 80; i++) {
                    W[i] = X64Word_create();
                }
            }());

            /**
             * SHA-512 hash algorithm.
             */
            var SHA512 = C_algo.SHA512 = Hasher.extend({
                _doReset: function () {
                    this._hash = new X64WordArray.init([
                        new X64Word.init(0x6a09e667, 0xf3bcc908), new X64Word.init(0xbb67ae85, 0x84caa73b),
                        new X64Word.init(0x3c6ef372, 0xfe94f82b), new X64Word.init(0xa54ff53a, 0x5f1d36f1),
                        new X64Word.init(0x510e527f, 0xade682d1), new X64Word.init(0x9b05688c, 0x2b3e6c1f),
                        new X64Word.init(0x1f83d9ab, 0xfb41bd6b), new X64Word.init(0x5be0cd19, 0x137e2179)
                    ]);
                },

                _doProcessBlock: function (M, offset) {
                    // Shortcuts
                    var H = this._hash.words;

                    var H0 = H[0];
                    var H1 = H[1];
                    var H2 = H[2];
                    var H3 = H[3];
                    var H4 = H[4];
                    var H5 = H[5];
                    var H6 = H[6];
                    var H7 = H[7];

                    var H0h = H0.high;
                    var H0l = H0.low;
                    var H1h = H1.high;
                    var H1l = H1.low;
                    var H2h = H2.high;
                    var H2l = H2.low;
                    var H3h = H3.high;
                    var H3l = H3.low;
                    var H4h = H4.high;
                    var H4l = H4.low;
                    var H5h = H5.high;
                    var H5l = H5.low;
                    var H6h = H6.high;
                    var H6l = H6.low;
                    var H7h = H7.high;
                    var H7l = H7.low;

                    // Working variables
                    var ah = H0h;
                    var al = H0l;
                    var bh = H1h;
                    var bl = H1l;
                    var ch = H2h;
                    var cl = H2l;
                    var dh = H3h;
                    var dl = H3l;
                    var eh = H4h;
                    var el = H4l;
                    var fh = H5h;
                    var fl = H5l;
                    var gh = H6h;
                    var gl = H6l;
                    var hh = H7h;
                    var hl = H7l;

                    // Rounds
                    for (var i = 0; i < 80; i++) {
                        // Shortcut
                        var Wi = W[i];

                        // Extend message
                        if (i < 16) {
                            var Wih = Wi.high = M[offset + i * 2]     | 0;
                            var Wil = Wi.low  = M[offset + i * 2 + 1] | 0;
                        } else {
                            // Gamma0
                            var gamma0x  = W[i - 15];
                            var gamma0xh = gamma0x.high;
                            var gamma0xl = gamma0x.low;
                            var gamma0h  = ((gamma0xh >>> 1) | (gamma0xl << 31)) ^ ((gamma0xh >>> 8) | (gamma0xl << 24)) ^ (gamma0xh >>> 7);
                            var gamma0l  = ((gamma0xl >>> 1) | (gamma0xh << 31)) ^ ((gamma0xl >>> 8) | (gamma0xh << 24)) ^ ((gamma0xl >>> 7) | (gamma0xh << 25));

                            // Gamma1
                            var gamma1x  = W[i - 2];
                            var gamma1xh = gamma1x.high;
                            var gamma1xl = gamma1x.low;
                            var gamma1h  = ((gamma1xh >>> 19) | (gamma1xl << 13)) ^ ((gamma1xh << 3) | (gamma1xl >>> 29)) ^ (gamma1xh >>> 6);
                            var gamma1l  = ((gamma1xl >>> 19) | (gamma1xh << 13)) ^ ((gamma1xl << 3) | (gamma1xh >>> 29)) ^ ((gamma1xl >>> 6) | (gamma1xh << 26));

                            // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
                            var Wi7  = W[i - 7];
                            var Wi7h = Wi7.high;
                            var Wi7l = Wi7.low;

                            var Wi16  = W[i - 16];
                            var Wi16h = Wi16.high;
                            var Wi16l = Wi16.low;

                            var Wil = gamma0l + Wi7l;
                            var Wih = gamma0h + Wi7h + ((Wil >>> 0) < (gamma0l >>> 0) ? 1 : 0);
                            var Wil = Wil + gamma1l;
                            var Wih = Wih + gamma1h + ((Wil >>> 0) < (gamma1l >>> 0) ? 1 : 0);
                            var Wil = Wil + Wi16l;
                            var Wih = Wih + Wi16h + ((Wil >>> 0) < (Wi16l >>> 0) ? 1 : 0);

                            Wi.high = Wih;
                            Wi.low  = Wil;
                        }

                        var chh  = (eh & fh) ^ (~eh & gh);
                        var chl  = (el & fl) ^ (~el & gl);
                        var majh = (ah & bh) ^ (ah & ch) ^ (bh & ch);
                        var majl = (al & bl) ^ (al & cl) ^ (bl & cl);

                        var sigma0h = ((ah >>> 28) | (al << 4))  ^ ((ah << 30)  | (al >>> 2)) ^ ((ah << 25) | (al >>> 7));
                        var sigma0l = ((al >>> 28) | (ah << 4))  ^ ((al << 30)  | (ah >>> 2)) ^ ((al << 25) | (ah >>> 7));
                        var sigma1h = ((eh >>> 14) | (el << 18)) ^ ((eh >>> 18) | (el << 14)) ^ ((eh << 23) | (el >>> 9));
                        var sigma1l = ((el >>> 14) | (eh << 18)) ^ ((el >>> 18) | (eh << 14)) ^ ((el << 23) | (eh >>> 9));

                        // t1 = h + sigma1 + ch + K[i] + W[i]
                        var Ki  = K[i];
                        var Kih = Ki.high;
                        var Kil = Ki.low;

                        var t1l = hl + sigma1l;
                        var t1h = hh + sigma1h + ((t1l >>> 0) < (hl >>> 0) ? 1 : 0);
                        var t1l = t1l + chl;
                        var t1h = t1h + chh + ((t1l >>> 0) < (chl >>> 0) ? 1 : 0);
                        var t1l = t1l + Kil;
                        var t1h = t1h + Kih + ((t1l >>> 0) < (Kil >>> 0) ? 1 : 0);
                        var t1l = t1l + Wil;
                        var t1h = t1h + Wih + ((t1l >>> 0) < (Wil >>> 0) ? 1 : 0);

                        // t2 = sigma0 + maj
                        var t2l = sigma0l + majl;
                        var t2h = sigma0h + majh + ((t2l >>> 0) < (sigma0l >>> 0) ? 1 : 0);

                        // Update working variables
                        hh = gh;
                        hl = gl;
                        gh = fh;
                        gl = fl;
                        fh = eh;
                        fl = el;
                        el = (dl + t1l) | 0;
                        eh = (dh + t1h + ((el >>> 0) < (dl >>> 0) ? 1 : 0)) | 0;
                        dh = ch;
                        dl = cl;
                        ch = bh;
                        cl = bl;
                        bh = ah;
                        bl = al;
                        al = (t1l + t2l) | 0;
                        ah = (t1h + t2h + ((al >>> 0) < (t1l >>> 0) ? 1 : 0)) | 0;
                    }

                    // Intermediate hash value
                    H0l = H0.low  = (H0l + al);
                    H0.high = (H0h + ah + ((H0l >>> 0) < (al >>> 0) ? 1 : 0));
                    H1l = H1.low  = (H1l + bl);
                    H1.high = (H1h + bh + ((H1l >>> 0) < (bl >>> 0) ? 1 : 0));
                    H2l = H2.low  = (H2l + cl);
                    H2.high = (H2h + ch + ((H2l >>> 0) < (cl >>> 0) ? 1 : 0));
                    H3l = H3.low  = (H3l + dl);
                    H3.high = (H3h + dh + ((H3l >>> 0) < (dl >>> 0) ? 1 : 0));
                    H4l = H4.low  = (H4l + el);
                    H4.high = (H4h + eh + ((H4l >>> 0) < (el >>> 0) ? 1 : 0));
                    H5l = H5.low  = (H5l + fl);
                    H5.high = (H5h + fh + ((H5l >>> 0) < (fl >>> 0) ? 1 : 0));
                    H6l = H6.low  = (H6l + gl);
                    H6.high = (H6h + gh + ((H6l >>> 0) < (gl >>> 0) ? 1 : 0));
                    H7l = H7.low  = (H7l + hl);
                    H7.high = (H7h + hh + ((H7l >>> 0) < (hl >>> 0) ? 1 : 0));
                },

                _doFinalize: function () {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
                    dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 30] = Math.floor(nBitsTotal / 0x100000000);
                    dataWords[(((nBitsLeft + 128) >>> 10) << 5) + 31] = nBitsTotal;
                    data.sigBytes = dataWords.length * 4;

                    // Hash final blocks
                    this._process();

                    // Convert hash to 32-bit word array before returning
                    var hash = this._hash.toX32();

                    // Return final computed hash
                    return hash;
                },

                clone: function () {
                    var clone = Hasher.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                },

                blockSize: 1024/32
            });

            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.SHA512('message');
             *     var hash = CryptoJS.SHA512(wordArray);
             */
            C.SHA512 = Hasher._createHelper(SHA512);

            /**
             * Shortcut function to the HMAC's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {WordArray|string} key The secret key.
             *
             * @return {WordArray} The HMAC.
             *
             * @static
             *
             * @example
             *
             *     var hmac = CryptoJS.HmacSHA512(message, key);
             */
            C.HmacSHA512 = Hasher._createHmacHelper(SHA512);
        }());


        return CryptoJS.SHA512;

    }));

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(7), __webpack_require__(15));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./x64-core", "./sha512"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_x64 = C.x64;
            var X64Word = C_x64.Word;
            var X64WordArray = C_x64.WordArray;
            var C_algo = C.algo;
            var SHA512 = C_algo.SHA512;

            /**
             * SHA-384 hash algorithm.
             */
            var SHA384 = C_algo.SHA384 = SHA512.extend({
                _doReset: function () {
                    this._hash = new X64WordArray.init([
                        new X64Word.init(0xcbbb9d5d, 0xc1059ed8), new X64Word.init(0x629a292a, 0x367cd507),
                        new X64Word.init(0x9159015a, 0x3070dd17), new X64Word.init(0x152fecd8, 0xf70e5939),
                        new X64Word.init(0x67332667, 0xffc00b31), new X64Word.init(0x8eb44a87, 0x68581511),
                        new X64Word.init(0xdb0c2e0d, 0x64f98fa7), new X64Word.init(0x47b5481d, 0xbefa4fa4)
                    ]);
                },

                _doFinalize: function () {
                    var hash = SHA512._doFinalize.call(this);

                    hash.sigBytes -= 16;

                    return hash;
                }
            });

            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.SHA384('message');
             *     var hash = CryptoJS.SHA384(wordArray);
             */
            C.SHA384 = SHA512._createHelper(SHA384);

            /**
             * Shortcut function to the HMAC's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {WordArray|string} key The secret key.
             *
             * @return {WordArray} The HMAC.
             *
             * @static
             *
             * @example
             *
             *     var hmac = CryptoJS.HmacSHA384(message, key);
             */
            C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
        }());


        return CryptoJS.SHA384;

    }));

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(7));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./x64-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function (Math) {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var Hasher = C_lib.Hasher;
            var C_x64 = C.x64;
            var X64Word = C_x64.Word;
            var C_algo = C.algo;

            // Constants tables
            var RHO_OFFSETS = [];
            var PI_INDEXES  = [];
            var ROUND_CONSTANTS = [];

            // Compute Constants
            (function () {
                // Compute rho offset constants
                var x = 1, y = 0;
                for (var t = 0; t < 24; t++) {
                    RHO_OFFSETS[x + 5 * y] = ((t + 1) * (t + 2) / 2) % 64;

                    var newX = y % 5;
                    var newY = (2 * x + 3 * y) % 5;
                    x = newX;
                    y = newY;
                }

                // Compute pi index constants
                for (var x = 0; x < 5; x++) {
                    for (var y = 0; y < 5; y++) {
                        PI_INDEXES[x + 5 * y] = y + ((2 * x + 3 * y) % 5) * 5;
                    }
                }

                // Compute round constants
                var LFSR = 0x01;
                for (var i = 0; i < 24; i++) {
                    var roundConstantMsw = 0;
                    var roundConstantLsw = 0;

                    for (var j = 0; j < 7; j++) {
                        if (LFSR & 0x01) {
                            var bitPosition = (1 << j) - 1;
                            if (bitPosition < 32) {
                                roundConstantLsw ^= 1 << bitPosition;
                            } else /* if (bitPosition >= 32) */ {
                                roundConstantMsw ^= 1 << (bitPosition - 32);
                            }
                        }

                        // Compute next LFSR
                        if (LFSR & 0x80) {
                            // Primitive polynomial over GF(2): x^8 + x^6 + x^5 + x^4 + 1
                            LFSR = (LFSR << 1) ^ 0x71;
                        } else {
                            LFSR <<= 1;
                        }
                    }

                    ROUND_CONSTANTS[i] = X64Word.create(roundConstantMsw, roundConstantLsw);
                }
            }());

            // Reusable objects for temporary values
            var T = [];
            (function () {
                for (var i = 0; i < 25; i++) {
                    T[i] = X64Word.create();
                }
            }());

            /**
             * SHA-3 hash algorithm.
             */
            var SHA3 = C_algo.SHA3 = Hasher.extend({
                /**
                 * Configuration options.
                 *
                 * @property {number} outputLength
                 *   The desired number of bits in the output hash.
                 *   Only values permitted are: 224, 256, 384, 512.
                 *   Default: 512
                 */
                cfg: Hasher.cfg.extend({
                    outputLength: 512
                }),

                _doReset: function () {
                    var state = this._state = []
                    for (var i = 0; i < 25; i++) {
                        state[i] = new X64Word.init();
                    }

                    this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
                },

                _doProcessBlock: function (M, offset) {
                    // Shortcuts
                    var state = this._state;
                    var nBlockSizeLanes = this.blockSize / 2;

                    // Absorb
                    for (var i = 0; i < nBlockSizeLanes; i++) {
                        // Shortcuts
                        var M2i  = M[offset + 2 * i];
                        var M2i1 = M[offset + 2 * i + 1];

                        // Swap endian
                        M2i = (
                            (((M2i << 8)  | (M2i >>> 24)) & 0x00ff00ff) |
                            (((M2i << 24) | (M2i >>> 8))  & 0xff00ff00)
                        );
                        M2i1 = (
                            (((M2i1 << 8)  | (M2i1 >>> 24)) & 0x00ff00ff) |
                            (((M2i1 << 24) | (M2i1 >>> 8))  & 0xff00ff00)
                        );

                        // Absorb message into state
                        var lane = state[i];
                        lane.high ^= M2i1;
                        lane.low  ^= M2i;
                    }

                    // Rounds
                    for (var round = 0; round < 24; round++) {
                        // Theta
                        for (var x = 0; x < 5; x++) {
                            // Mix column lanes
                            var tMsw = 0, tLsw = 0;
                            for (var y = 0; y < 5; y++) {
                                var lane = state[x + 5 * y];
                                tMsw ^= lane.high;
                                tLsw ^= lane.low;
                            }

                            // Temporary values
                            var Tx = T[x];
                            Tx.high = tMsw;
                            Tx.low  = tLsw;
                        }
                        for (var x = 0; x < 5; x++) {
                            // Shortcuts
                            var Tx4 = T[(x + 4) % 5];
                            var Tx1 = T[(x + 1) % 5];
                            var Tx1Msw = Tx1.high;
                            var Tx1Lsw = Tx1.low;

                            // Mix surrounding columns
                            var tMsw = Tx4.high ^ ((Tx1Msw << 1) | (Tx1Lsw >>> 31));
                            var tLsw = Tx4.low  ^ ((Tx1Lsw << 1) | (Tx1Msw >>> 31));
                            for (var y = 0; y < 5; y++) {
                                var lane = state[x + 5 * y];
                                lane.high ^= tMsw;
                                lane.low  ^= tLsw;
                            }
                        }

                        // Rho Pi
                        for (var laneIndex = 1; laneIndex < 25; laneIndex++) {
                            // Shortcuts
                            var lane = state[laneIndex];
                            var laneMsw = lane.high;
                            var laneLsw = lane.low;
                            var rhoOffset = RHO_OFFSETS[laneIndex];

                            // Rotate lanes
                            if (rhoOffset < 32) {
                                var tMsw = (laneMsw << rhoOffset) | (laneLsw >>> (32 - rhoOffset));
                                var tLsw = (laneLsw << rhoOffset) | (laneMsw >>> (32 - rhoOffset));
                            } else /* if (rhoOffset >= 32) */ {
                                var tMsw = (laneLsw << (rhoOffset - 32)) | (laneMsw >>> (64 - rhoOffset));
                                var tLsw = (laneMsw << (rhoOffset - 32)) | (laneLsw >>> (64 - rhoOffset));
                            }

                            // Transpose lanes
                            var TPiLane = T[PI_INDEXES[laneIndex]];
                            TPiLane.high = tMsw;
                            TPiLane.low  = tLsw;
                        }

                        // Rho pi at x = y = 0
                        var T0 = T[0];
                        var state0 = state[0];
                        T0.high = state0.high;
                        T0.low  = state0.low;

                        // Chi
                        for (var x = 0; x < 5; x++) {
                            for (var y = 0; y < 5; y++) {
                                // Shortcuts
                                var laneIndex = x + 5 * y;
                                var lane = state[laneIndex];
                                var TLane = T[laneIndex];
                                var Tx1Lane = T[((x + 1) % 5) + 5 * y];
                                var Tx2Lane = T[((x + 2) % 5) + 5 * y];

                                // Mix rows
                                lane.high = TLane.high ^ (~Tx1Lane.high & Tx2Lane.high);
                                lane.low  = TLane.low  ^ (~Tx1Lane.low  & Tx2Lane.low);
                            }
                        }

                        // Iota
                        var lane = state[0];
                        var roundConstant = ROUND_CONSTANTS[round];
                        lane.high ^= roundConstant.high;
                        lane.low  ^= roundConstant.low;;
                    }
                },

                _doFinalize: function () {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;
                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;
                    var blockSizeBits = this.blockSize * 32;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x1 << (24 - nBitsLeft % 32);
                    dataWords[((Math.ceil((nBitsLeft + 1) / blockSizeBits) * blockSizeBits) >>> 5) - 1] |= 0x80;
                    data.sigBytes = dataWords.length * 4;

                    // Hash final blocks
                    this._process();

                    // Shortcuts
                    var state = this._state;
                    var outputLengthBytes = this.cfg.outputLength / 8;
                    var outputLengthLanes = outputLengthBytes / 8;

                    // Squeeze
                    var hashWords = [];
                    for (var i = 0; i < outputLengthLanes; i++) {
                        // Shortcuts
                        var lane = state[i];
                        var laneMsw = lane.high;
                        var laneLsw = lane.low;

                        // Swap endian
                        laneMsw = (
                            (((laneMsw << 8)  | (laneMsw >>> 24)) & 0x00ff00ff) |
                            (((laneMsw << 24) | (laneMsw >>> 8))  & 0xff00ff00)
                        );
                        laneLsw = (
                            (((laneLsw << 8)  | (laneLsw >>> 24)) & 0x00ff00ff) |
                            (((laneLsw << 24) | (laneLsw >>> 8))  & 0xff00ff00)
                        );

                        // Squeeze state to retrieve hash
                        hashWords.push(laneLsw);
                        hashWords.push(laneMsw);
                    }

                    // Return final computed hash
                    return new WordArray.init(hashWords, outputLengthBytes);
                },

                clone: function () {
                    var clone = Hasher.clone.call(this);

                    var state = clone._state = this._state.slice(0);
                    for (var i = 0; i < 25; i++) {
                        state[i] = state[i].clone();
                    }

                    return clone;
                }
            });

            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.SHA3('message');
             *     var hash = CryptoJS.SHA3(wordArray);
             */
            C.SHA3 = Hasher._createHelper(SHA3);

            /**
             * Shortcut function to the HMAC's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {WordArray|string} key The secret key.
             *
             * @return {WordArray} The HMAC.
             *
             * @static
             *
             * @example
             *
             *     var hmac = CryptoJS.HmacSHA3(message, key);
             */
            C.HmacSHA3 = Hasher._createHmacHelper(SHA3);
        }(Math));


        return CryptoJS.SHA3;

    }));

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        /** @preserve
        (c) 2012 by Cédric Mesnil. All rights reserved.

        Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

            - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
            - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

        THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        */

        (function (Math) {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var Hasher = C_lib.Hasher;
            var C_algo = C.algo;

            // Constants table
            var _zl = WordArray.create([
                0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,
                7,  4, 13,  1, 10,  6, 15,  3, 12,  0,  9,  5,  2, 14, 11,  8,
                3, 10, 14,  4,  9, 15,  8,  1,  2,  7,  0,  6, 13, 11,  5, 12,
                1,  9, 11, 10,  0,  8, 12,  4, 13,  3,  7, 15, 14,  5,  6,  2,
                4,  0,  5,  9,  7, 12,  2, 10, 14,  1,  3,  8, 11,  6, 15, 13]);
            var _zr = WordArray.create([
                5, 14,  7,  0,  9,  2, 11,  4, 13,  6, 15,  8,  1, 10,  3, 12,
                6, 11,  3,  7,  0, 13,  5, 10, 14, 15,  8, 12,  4,  9,  1,  2,
                15,  5,  1,  3,  7, 14,  6,  9, 11,  8, 12,  2, 10,  0,  4, 13,
                8,  6,  4,  1,  3, 11, 15,  0,  5, 12,  2, 13,  9,  7, 10, 14,
                12, 15, 10,  4,  1,  5,  8,  7,  6,  2, 13, 14,  0,  3,  9, 11]);
            var _sl = WordArray.create([
                 11, 14, 15, 12,  5,  8,  7,  9, 11, 13, 14, 15,  6,  7,  9,  8,
                7, 6,   8, 13, 11,  9,  7, 15,  7, 12, 15,  9, 11,  7, 13, 12,
                11, 13,  6,  7, 14,  9, 13, 15, 14,  8, 13,  6,  5, 12,  7,  5,
                  11, 12, 14, 15, 14, 15,  9,  8,  9, 14,  5,  6,  8,  6,  5, 12,
                9, 15,  5, 11,  6,  8, 13, 12,  5, 12, 13, 14, 11,  8,  5,  6 ]);
            var _sr = WordArray.create([
                8,  9,  9, 11, 13, 15, 15,  5,  7,  7,  8, 11, 14, 14, 12,  6,
                9, 13, 15,  7, 12,  8,  9, 11,  7,  7, 12,  7,  6, 15, 13, 11,
                9,  7, 15, 11,  8,  6,  6, 14, 12, 13,  5, 14, 13, 13,  7,  5,
                15,  5,  8, 11, 14, 14,  6, 14,  6,  9, 12,  9, 12,  5, 15,  8,
                8,  5, 12,  9, 12,  5, 14,  6,  8, 13,  6,  5, 15, 13, 11, 11 ]);

            var _hl =  WordArray.create([ 0x00000000, 0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xA953FD4E]);
            var _hr =  WordArray.create([ 0x50A28BE6, 0x5C4DD124, 0x6D703EF3, 0x7A6D76E9, 0x00000000]);

            /**
             * RIPEMD160 hash algorithm.
             */
            var RIPEMD160 = C_algo.RIPEMD160 = Hasher.extend({
                _doReset: function () {
                    this._hash  = WordArray.create([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0]);
                },

                _doProcessBlock: function (M, offset) {

                    // Swap endian
                    for (var i = 0; i < 16; i++) {
                        // Shortcuts
                        var offset_i = offset + i;
                        var M_offset_i = M[offset_i];

                        // Swap
                        M[offset_i] = (
                            (((M_offset_i << 8)  | (M_offset_i >>> 24)) & 0x00ff00ff) |
                            (((M_offset_i << 24) | (M_offset_i >>> 8))  & 0xff00ff00)
                        );
                    }
                    // Shortcut
                    var H  = this._hash.words;
                    var hl = _hl.words;
                    var hr = _hr.words;
                    var zl = _zl.words;
                    var zr = _zr.words;
                    var sl = _sl.words;
                    var sr = _sr.words;

                    // Working variables
                    var al, bl, cl, dl, el;
                    var ar, br, cr, dr, er;

                    ar = al = H[0];
                    br = bl = H[1];
                    cr = cl = H[2];
                    dr = dl = H[3];
                    er = el = H[4];
                    // Computation
                    var t;
                    for (var i = 0; i < 80; i += 1) {
                        t = (al +  M[offset+zl[i]])|0;
                        if (i<16){
                        t +=  f1(bl,cl,dl) + hl[0];
                        } else if (i<32) {
                        t +=  f2(bl,cl,dl) + hl[1];
                        } else if (i<48) {
                        t +=  f3(bl,cl,dl) + hl[2];
                        } else if (i<64) {
                        t +=  f4(bl,cl,dl) + hl[3];
                        } else {// if (i<80) {
                        t +=  f5(bl,cl,dl) + hl[4];
                        }
                        t = t|0;
                        t =  rotl(t,sl[i]);
                        t = (t+el)|0;
                        al = el;
                        el = dl;
                        dl = rotl(cl, 10);
                        cl = bl;
                        bl = t;

                        t = (ar + M[offset+zr[i]])|0;
                        if (i<16){
                        t +=  f5(br,cr,dr) + hr[0];
                        } else if (i<32) {
                        t +=  f4(br,cr,dr) + hr[1];
                        } else if (i<48) {
                        t +=  f3(br,cr,dr) + hr[2];
                        } else if (i<64) {
                        t +=  f2(br,cr,dr) + hr[3];
                        } else {// if (i<80) {
                        t +=  f1(br,cr,dr) + hr[4];
                        }
                        t = t|0;
                        t =  rotl(t,sr[i]) ;
                        t = (t+er)|0;
                        ar = er;
                        er = dr;
                        dr = rotl(cr, 10);
                        cr = br;
                        br = t;
                    }
                    // Intermediate hash value
                    t    = (H[1] + cl + dr)|0;
                    H[1] = (H[2] + dl + er)|0;
                    H[2] = (H[3] + el + ar)|0;
                    H[3] = (H[4] + al + br)|0;
                    H[4] = (H[0] + bl + cr)|0;
                    H[0] =  t;
                },

                _doFinalize: function () {
                    // Shortcuts
                    var data = this._data;
                    var dataWords = data.words;

                    var nBitsTotal = this._nDataBytes * 8;
                    var nBitsLeft = data.sigBytes * 8;

                    // Add padding
                    dataWords[nBitsLeft >>> 5] |= 0x80 << (24 - nBitsLeft % 32);
                    dataWords[(((nBitsLeft + 64) >>> 9) << 4) + 14] = (
                        (((nBitsTotal << 8)  | (nBitsTotal >>> 24)) & 0x00ff00ff) |
                        (((nBitsTotal << 24) | (nBitsTotal >>> 8))  & 0xff00ff00)
                    );
                    data.sigBytes = (dataWords.length + 1) * 4;

                    // Hash final blocks
                    this._process();

                    // Shortcuts
                    var hash = this._hash;
                    var H = hash.words;

                    // Swap endian
                    for (var i = 0; i < 5; i++) {
                        // Shortcut
                        var H_i = H[i];

                        // Swap
                        H[i] = (((H_i << 8)  | (H_i >>> 24)) & 0x00ff00ff) |
                               (((H_i << 24) | (H_i >>> 8))  & 0xff00ff00);
                    }

                    // Return final computed hash
                    return hash;
                },

                clone: function () {
                    var clone = Hasher.clone.call(this);
                    clone._hash = this._hash.clone();

                    return clone;
                }
            });


            function f1(x, y, z) {
                return ((x) ^ (y) ^ (z));

            }

            function f2(x, y, z) {
                return (((x)&(y)) | ((~x)&(z)));
            }

            function f3(x, y, z) {
                return (((x) | (~(y))) ^ (z));
            }

            function f4(x, y, z) {
                return (((x) & (z)) | ((y)&(~(z))));
            }

            function f5(x, y, z) {
                return ((x) ^ ((y) |(~(z))));

            }

            function rotl(x,n) {
                return (x<<n) | (x>>>(32-n));
            }


            /**
             * Shortcut function to the hasher's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             *
             * @return {WordArray} The hash.
             *
             * @static
             *
             * @example
             *
             *     var hash = CryptoJS.RIPEMD160('message');
             *     var hash = CryptoJS.RIPEMD160(wordArray);
             */
            C.RIPEMD160 = Hasher._createHelper(RIPEMD160);

            /**
             * Shortcut function to the HMAC's object interface.
             *
             * @param {WordArray|string} message The message to hash.
             * @param {WordArray|string} key The secret key.
             *
             * @return {WordArray} The HMAC.
             *
             * @static
             *
             * @example
             *
             *     var hmac = CryptoJS.HmacRIPEMD160(message, key);
             */
            C.HmacRIPEMD160 = Hasher._createHmacHelper(RIPEMD160);
        }(Math));


        return CryptoJS.RIPEMD160;

    }));

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var Base = C_lib.Base;
            var C_enc = C.enc;
            var Utf8 = C_enc.Utf8;
            var C_algo = C.algo;

            /**
             * HMAC algorithm.
             */
            var HMAC = C_algo.HMAC = Base.extend({
                /**
                 * Initializes a newly created HMAC.
                 *
                 * @param {Hasher} hasher The hash algorithm to use.
                 * @param {WordArray|string} key The secret key.
                 *
                 * @example
                 *
                 *     var hmacHasher = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, key);
                 */
                init: function (hasher, key) {
                    // Init hasher
                    hasher = this._hasher = new hasher.init();

                    // Convert string to WordArray, else assume WordArray already
                    if (typeof key == 'string') {
                        key = Utf8.parse(key);
                    }

                    // Shortcuts
                    var hasherBlockSize = hasher.blockSize;
                    var hasherBlockSizeBytes = hasherBlockSize * 4;

                    // Allow arbitrary length keys
                    if (key.sigBytes > hasherBlockSizeBytes) {
                        key = hasher.finalize(key);
                    }

                    // Clamp excess bits
                    key.clamp();

                    // Clone key for inner and outer pads
                    var oKey = this._oKey = key.clone();
                    var iKey = this._iKey = key.clone();

                    // Shortcuts
                    var oKeyWords = oKey.words;
                    var iKeyWords = iKey.words;

                    // XOR keys with pad constants
                    for (var i = 0; i < hasherBlockSize; i++) {
                        oKeyWords[i] ^= 0x5c5c5c5c;
                        iKeyWords[i] ^= 0x36363636;
                    }
                    oKey.sigBytes = iKey.sigBytes = hasherBlockSizeBytes;

                    // Set initial values
                    this.reset();
                },

                /**
                 * Resets this HMAC to its initial state.
                 *
                 * @example
                 *
                 *     hmacHasher.reset();
                 */
                reset: function () {
                    // Shortcut
                    var hasher = this._hasher;

                    // Reset
                    hasher.reset();
                    hasher.update(this._iKey);
                },

                /**
                 * Updates this HMAC with a message.
                 *
                 * @param {WordArray|string} messageUpdate The message to append.
                 *
                 * @return {HMAC} This HMAC instance.
                 *
                 * @example
                 *
                 *     hmacHasher.update('message');
                 *     hmacHasher.update(wordArray);
                 */
                update: function (messageUpdate) {
                    this._hasher.update(messageUpdate);

                    // Chainable
                    return this;
                },

                /**
                 * Finalizes the HMAC computation.
                 * Note that the finalize operation is effectively a destructive, read-once operation.
                 *
                 * @param {WordArray|string} messageUpdate (Optional) A final message update.
                 *
                 * @return {WordArray} The HMAC.
                 *
                 * @example
                 *
                 *     var hmac = hmacHasher.finalize();
                 *     var hmac = hmacHasher.finalize('message');
                 *     var hmac = hmacHasher.finalize(wordArray);
                 */
                finalize: function (messageUpdate) {
                    // Shortcut
                    var hasher = this._hasher;

                    // Compute HMAC
                    var innerHash = hasher.finalize(messageUpdate);
                    hasher.reset();
                    var hmac = hasher.finalize(this._oKey.clone().concat(innerHash));

                    return hmac;
                }
            });
        }());


    }));

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(12), __webpack_require__(19));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./sha1", "./hmac"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var Base = C_lib.Base;
            var WordArray = C_lib.WordArray;
            var C_algo = C.algo;
            var SHA1 = C_algo.SHA1;
            var HMAC = C_algo.HMAC;

            /**
             * Password-Based Key Derivation Function 2 algorithm.
             */
            var PBKDF2 = C_algo.PBKDF2 = Base.extend({
                /**
                 * Configuration options.
                 *
                 * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
                 * @property {Hasher} hasher The hasher to use. Default: SHA1
                 * @property {number} iterations The number of iterations to perform. Default: 1
                 */
                cfg: Base.extend({
                    keySize: 128/32,
                    hasher: SHA1,
                    iterations: 1
                }),

                /**
                 * Initializes a newly created key derivation function.
                 *
                 * @param {Object} cfg (Optional) The configuration options to use for the derivation.
                 *
                 * @example
                 *
                 *     var kdf = CryptoJS.algo.PBKDF2.create();
                 *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8 });
                 *     var kdf = CryptoJS.algo.PBKDF2.create({ keySize: 8, iterations: 1000 });
                 */
                init: function (cfg) {
                    this.cfg = this.cfg.extend(cfg);
                },

                /**
                 * Computes the Password-Based Key Derivation Function 2.
                 *
                 * @param {WordArray|string} password The password.
                 * @param {WordArray|string} salt A salt.
                 *
                 * @return {WordArray} The derived key.
                 *
                 * @example
                 *
                 *     var key = kdf.compute(password, salt);
                 */
                compute: function (password, salt) {
                    // Shortcut
                    var cfg = this.cfg;

                    // Init HMAC
                    var hmac = HMAC.create(cfg.hasher, password);

                    // Initial values
                    var derivedKey = WordArray.create();
                    var blockIndex = WordArray.create([0x00000001]);

                    // Shortcuts
                    var derivedKeyWords = derivedKey.words;
                    var blockIndexWords = blockIndex.words;
                    var keySize = cfg.keySize;
                    var iterations = cfg.iterations;

                    // Generate key
                    while (derivedKeyWords.length < keySize) {
                        var block = hmac.update(salt).finalize(blockIndex);
                        hmac.reset();

                        // Shortcuts
                        var blockWords = block.words;
                        var blockWordsLength = blockWords.length;

                        // Iterations
                        var intermediate = block;
                        for (var i = 1; i < iterations; i++) {
                            intermediate = hmac.finalize(intermediate);
                            hmac.reset();

                            // Shortcut
                            var intermediateWords = intermediate.words;

                            // XOR intermediate with block
                            for (var j = 0; j < blockWordsLength; j++) {
                                blockWords[j] ^= intermediateWords[j];
                            }
                        }

                        derivedKey.concat(block);
                        blockIndexWords[0]++;
                    }
                    derivedKey.sigBytes = keySize * 4;

                    return derivedKey;
                }
            });

            /**
             * Computes the Password-Based Key Derivation Function 2.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             * @param {Object} cfg (Optional) The configuration options to use for this computation.
             *
             * @return {WordArray} The derived key.
             *
             * @static
             *
             * @example
             *
             *     var key = CryptoJS.PBKDF2(password, salt);
             *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8 });
             *     var key = CryptoJS.PBKDF2(password, salt, { keySize: 8, iterations: 1000 });
             */
            C.PBKDF2 = function (password, salt, cfg) {
                return PBKDF2.create(cfg).compute(password, salt);
            };
        }());


        return CryptoJS.PBKDF2;

    }));

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(12), __webpack_require__(19));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./sha1", "./hmac"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var Base = C_lib.Base;
            var WordArray = C_lib.WordArray;
            var C_algo = C.algo;
            var MD5 = C_algo.MD5;

            /**
             * This key derivation function is meant to conform with EVP_BytesToKey.
             * www.openssl.org/docs/crypto/EVP_BytesToKey.html
             */
            var EvpKDF = C_algo.EvpKDF = Base.extend({
                /**
                 * Configuration options.
                 *
                 * @property {number} keySize The key size in words to generate. Default: 4 (128 bits)
                 * @property {Hasher} hasher The hash algorithm to use. Default: MD5
                 * @property {number} iterations The number of iterations to perform. Default: 1
                 */
                cfg: Base.extend({
                    keySize: 128/32,
                    hasher: MD5,
                    iterations: 1
                }),

                /**
                 * Initializes a newly created key derivation function.
                 *
                 * @param {Object} cfg (Optional) The configuration options to use for the derivation.
                 *
                 * @example
                 *
                 *     var kdf = CryptoJS.algo.EvpKDF.create();
                 *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8 });
                 *     var kdf = CryptoJS.algo.EvpKDF.create({ keySize: 8, iterations: 1000 });
                 */
                init: function (cfg) {
                    this.cfg = this.cfg.extend(cfg);
                },

                /**
                 * Derives a key from a password.
                 *
                 * @param {WordArray|string} password The password.
                 * @param {WordArray|string} salt A salt.
                 *
                 * @return {WordArray} The derived key.
                 *
                 * @example
                 *
                 *     var key = kdf.compute(password, salt);
                 */
                compute: function (password, salt) {
                    // Shortcut
                    var cfg = this.cfg;

                    // Init hasher
                    var hasher = cfg.hasher.create();

                    // Initial values
                    var derivedKey = WordArray.create();

                    // Shortcuts
                    var derivedKeyWords = derivedKey.words;
                    var keySize = cfg.keySize;
                    var iterations = cfg.iterations;

                    // Generate key
                    while (derivedKeyWords.length < keySize) {
                        if (block) {
                            hasher.update(block);
                        }
                        var block = hasher.update(password).finalize(salt);
                        hasher.reset();

                        // Iterations
                        for (var i = 1; i < iterations; i++) {
                            block = hasher.finalize(block);
                            hasher.reset();
                        }

                        derivedKey.concat(block);
                    }
                    derivedKey.sigBytes = keySize * 4;

                    return derivedKey;
                }
            });

            /**
             * Derives a key from a password.
             *
             * @param {WordArray|string} password The password.
             * @param {WordArray|string} salt A salt.
             * @param {Object} cfg (Optional) The configuration options to use for this computation.
             *
             * @return {WordArray} The derived key.
             *
             * @static
             *
             * @example
             *
             *     var key = CryptoJS.EvpKDF(password, salt);
             *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8 });
             *     var key = CryptoJS.EvpKDF(password, salt, { keySize: 8, iterations: 1000 });
             */
            C.EvpKDF = function (password, salt, cfg) {
                return EvpKDF.create(cfg).compute(password, salt);
            };
        }());


        return CryptoJS.EvpKDF;

    }));

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(21));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./evpkdf"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        /**
         * Cipher core components.
         */
        CryptoJS.lib.Cipher || (function (undefined) {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var Base = C_lib.Base;
            var WordArray = C_lib.WordArray;
            var BufferedBlockAlgorithm = C_lib.BufferedBlockAlgorithm;
            var C_enc = C.enc;
            var Utf8 = C_enc.Utf8;
            var Base64 = C_enc.Base64;
            var C_algo = C.algo;
            var EvpKDF = C_algo.EvpKDF;

            /**
             * Abstract base cipher template.
             *
             * @property {number} keySize This cipher's key size. Default: 4 (128 bits)
             * @property {number} ivSize This cipher's IV size. Default: 4 (128 bits)
             * @property {number} _ENC_XFORM_MODE A constant representing encryption mode.
             * @property {number} _DEC_XFORM_MODE A constant representing decryption mode.
             */
            var Cipher = C_lib.Cipher = BufferedBlockAlgorithm.extend({
                /**
                 * Configuration options.
                 *
                 * @property {WordArray} iv The IV to use for this operation.
                 */
                cfg: Base.extend(),

                /**
                 * Creates this cipher in encryption mode.
                 *
                 * @param {WordArray} key The key.
                 * @param {Object} cfg (Optional) The configuration options to use for this operation.
                 *
                 * @return {Cipher} A cipher instance.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var cipher = CryptoJS.algo.AES.createEncryptor(keyWordArray, { iv: ivWordArray });
                 */
                createEncryptor: function (key, cfg) {
                    return this.create(this._ENC_XFORM_MODE, key, cfg);
                },

                /**
                 * Creates this cipher in decryption mode.
                 *
                 * @param {WordArray} key The key.
                 * @param {Object} cfg (Optional) The configuration options to use for this operation.
                 *
                 * @return {Cipher} A cipher instance.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var cipher = CryptoJS.algo.AES.createDecryptor(keyWordArray, { iv: ivWordArray });
                 */
                createDecryptor: function (key, cfg) {
                    return this.create(this._DEC_XFORM_MODE, key, cfg);
                },

                /**
                 * Initializes a newly created cipher.
                 *
                 * @param {number} xformMode Either the encryption or decryption transormation mode constant.
                 * @param {WordArray} key The key.
                 * @param {Object} cfg (Optional) The configuration options to use for this operation.
                 *
                 * @example
                 *
                 *     var cipher = CryptoJS.algo.AES.create(CryptoJS.algo.AES._ENC_XFORM_MODE, keyWordArray, { iv: ivWordArray });
                 */
                init: function (xformMode, key, cfg) {
                    // Apply config defaults
                    this.cfg = this.cfg.extend(cfg);

                    // Store transform mode and key
                    this._xformMode = xformMode;
                    this._key = key;

                    // Set initial values
                    this.reset();
                },

                /**
                 * Resets this cipher to its initial state.
                 *
                 * @example
                 *
                 *     cipher.reset();
                 */
                reset: function () {
                    // Reset data buffer
                    BufferedBlockAlgorithm.reset.call(this);

                    // Perform concrete-cipher logic
                    this._doReset();
                },

                /**
                 * Adds data to be encrypted or decrypted.
                 *
                 * @param {WordArray|string} dataUpdate The data to encrypt or decrypt.
                 *
                 * @return {WordArray} The data after processing.
                 *
                 * @example
                 *
                 *     var encrypted = cipher.process('data');
                 *     var encrypted = cipher.process(wordArray);
                 */
                process: function (dataUpdate) {
                    // Append
                    this._append(dataUpdate);

                    // Process available blocks
                    return this._process();
                },

                /**
                 * Finalizes the encryption or decryption process.
                 * Note that the finalize operation is effectively a destructive, read-once operation.
                 *
                 * @param {WordArray|string} dataUpdate The final data to encrypt or decrypt.
                 *
                 * @return {WordArray} The data after final processing.
                 *
                 * @example
                 *
                 *     var encrypted = cipher.finalize();
                 *     var encrypted = cipher.finalize('data');
                 *     var encrypted = cipher.finalize(wordArray);
                 */
                finalize: function (dataUpdate) {
                    // Final data update
                    if (dataUpdate) {
                        this._append(dataUpdate);
                    }

                    // Perform concrete-cipher logic
                    var finalProcessedData = this._doFinalize();

                    return finalProcessedData;
                },

                keySize: 128/32,

                ivSize: 128/32,

                _ENC_XFORM_MODE: 1,

                _DEC_XFORM_MODE: 2,

                /**
                 * Creates shortcut functions to a cipher's object interface.
                 *
                 * @param {Cipher} cipher The cipher to create a helper for.
                 *
                 * @return {Object} An object with encrypt and decrypt shortcut functions.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var AES = CryptoJS.lib.Cipher._createHelper(CryptoJS.algo.AES);
                 */
                _createHelper: (function () {
                    function selectCipherStrategy(key) {
                        if (typeof key == 'string') {
                            return PasswordBasedCipher;
                        } else {
                            return SerializableCipher;
                        }
                    }

                    return function (cipher) {
                        return {
                            encrypt: function (message, key, cfg) {
                                return selectCipherStrategy(key).encrypt(cipher, message, key, cfg);
                            },

                            decrypt: function (ciphertext, key, cfg) {
                                return selectCipherStrategy(key).decrypt(cipher, ciphertext, key, cfg);
                            }
                        };
                    };
                }())
            });

            /**
             * Abstract base stream cipher template.
             *
             * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 1 (32 bits)
             */
            var StreamCipher = C_lib.StreamCipher = Cipher.extend({
                _doFinalize: function () {
                    // Process partial blocks
                    var finalProcessedBlocks = this._process(!!'flush');

                    return finalProcessedBlocks;
                },

                blockSize: 1
            });

            /**
             * Mode namespace.
             */
            var C_mode = C.mode = {};

            /**
             * Abstract base block cipher mode template.
             */
            var BlockCipherMode = C_lib.BlockCipherMode = Base.extend({
                /**
                 * Creates this mode for encryption.
                 *
                 * @param {Cipher} cipher A block cipher instance.
                 * @param {Array} iv The IV words.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var mode = CryptoJS.mode.CBC.createEncryptor(cipher, iv.words);
                 */
                createEncryptor: function (cipher, iv) {
                    return this.Encryptor.create(cipher, iv);
                },

                /**
                 * Creates this mode for decryption.
                 *
                 * @param {Cipher} cipher A block cipher instance.
                 * @param {Array} iv The IV words.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var mode = CryptoJS.mode.CBC.createDecryptor(cipher, iv.words);
                 */
                createDecryptor: function (cipher, iv) {
                    return this.Decryptor.create(cipher, iv);
                },

                /**
                 * Initializes a newly created mode.
                 *
                 * @param {Cipher} cipher A block cipher instance.
                 * @param {Array} iv The IV words.
                 *
                 * @example
                 *
                 *     var mode = CryptoJS.mode.CBC.Encryptor.create(cipher, iv.words);
                 */
                init: function (cipher, iv) {
                    this._cipher = cipher;
                    this._iv = iv;
                }
            });

            /**
             * Cipher Block Chaining mode.
             */
            var CBC = C_mode.CBC = (function () {
                /**
                 * Abstract base CBC mode.
                 */
                var CBC = BlockCipherMode.extend();

                /**
                 * CBC encryptor.
                 */
                CBC.Encryptor = CBC.extend({
                    /**
                     * Processes the data block at offset.
                     *
                     * @param {Array} words The data words to operate on.
                     * @param {number} offset The offset where the block starts.
                     *
                     * @example
                     *
                     *     mode.processBlock(data.words, offset);
                     */
                    processBlock: function (words, offset) {
                        // Shortcuts
                        var cipher = this._cipher;
                        var blockSize = cipher.blockSize;

                        // XOR and encrypt
                        xorBlock.call(this, words, offset, blockSize);
                        cipher.encryptBlock(words, offset);

                        // Remember this block to use with next block
                        this._prevBlock = words.slice(offset, offset + blockSize);
                    }
                });

                /**
                 * CBC decryptor.
                 */
                CBC.Decryptor = CBC.extend({
                    /**
                     * Processes the data block at offset.
                     *
                     * @param {Array} words The data words to operate on.
                     * @param {number} offset The offset where the block starts.
                     *
                     * @example
                     *
                     *     mode.processBlock(data.words, offset);
                     */
                    processBlock: function (words, offset) {
                        // Shortcuts
                        var cipher = this._cipher;
                        var blockSize = cipher.blockSize;

                        // Remember this block to use with next block
                        var thisBlock = words.slice(offset, offset + blockSize);

                        // Decrypt and XOR
                        cipher.decryptBlock(words, offset);
                        xorBlock.call(this, words, offset, blockSize);

                        // This block becomes the previous block
                        this._prevBlock = thisBlock;
                    }
                });

                function xorBlock(words, offset, blockSize) {
                    // Shortcut
                    var iv = this._iv;

                    // Choose mixing block
                    if (iv) {
                        var block = iv;

                        // Remove IV for subsequent blocks
                        this._iv = undefined;
                    } else {
                        var block = this._prevBlock;
                    }

                    // XOR blocks
                    for (var i = 0; i < blockSize; i++) {
                        words[offset + i] ^= block[i];
                    }
                }

                return CBC;
            }());

            /**
             * Padding namespace.
             */
            var C_pad = C.pad = {};

            /**
             * PKCS #5/7 padding strategy.
             */
            var Pkcs7 = C_pad.Pkcs7 = {
                /**
                 * Pads data using the algorithm defined in PKCS #5/7.
                 *
                 * @param {WordArray} data The data to pad.
                 * @param {number} blockSize The multiple that the data should be padded to.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     CryptoJS.pad.Pkcs7.pad(wordArray, 4);
                 */
                pad: function (data, blockSize) {
                    // Shortcut
                    var blockSizeBytes = blockSize * 4;

                    // Count padding bytes
                    var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

                    // Create padding word
                    var paddingWord = (nPaddingBytes << 24) | (nPaddingBytes << 16) | (nPaddingBytes << 8) | nPaddingBytes;

                    // Create padding
                    var paddingWords = [];
                    for (var i = 0; i < nPaddingBytes; i += 4) {
                        paddingWords.push(paddingWord);
                    }
                    var padding = WordArray.create(paddingWords, nPaddingBytes);

                    // Add padding
                    data.concat(padding);
                },

                /**
                 * Unpads data that had been padded using the algorithm defined in PKCS #5/7.
                 *
                 * @param {WordArray} data The data to unpad.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     CryptoJS.pad.Pkcs7.unpad(wordArray);
                 */
                unpad: function (data) {
                    // Get number of padding bytes from last byte
                    var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

                    // Remove padding
                    data.sigBytes -= nPaddingBytes;
                }
            };

            /**
             * Abstract base block cipher template.
             *
             * @property {number} blockSize The number of 32-bit words this cipher operates on. Default: 4 (128 bits)
             */
            var BlockCipher = C_lib.BlockCipher = Cipher.extend({
                /**
                 * Configuration options.
                 *
                 * @property {Mode} mode The block mode to use. Default: CBC
                 * @property {Padding} padding The padding strategy to use. Default: Pkcs7
                 */
                cfg: Cipher.cfg.extend({
                    mode: CBC,
                    padding: Pkcs7
                }),

                reset: function () {
                    // Reset cipher
                    Cipher.reset.call(this);

                    // Shortcuts
                    var cfg = this.cfg;
                    var iv = cfg.iv;
                    var mode = cfg.mode;

                    // Reset block mode
                    if (this._xformMode == this._ENC_XFORM_MODE) {
                        var modeCreator = mode.createEncryptor;
                    } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                        var modeCreator = mode.createDecryptor;
                        // Keep at least one block in the buffer for unpadding
                        this._minBufferSize = 1;
                    }

                    if (this._mode && this._mode.__creator == modeCreator) {
                        this._mode.init(this, iv && iv.words);
                    } else {
                        this._mode = modeCreator.call(mode, this, iv && iv.words);
                        this._mode.__creator = modeCreator;
                    }
                },

                _doProcessBlock: function (words, offset) {
                    this._mode.processBlock(words, offset);
                },

                _doFinalize: function () {
                    // Shortcut
                    var padding = this.cfg.padding;

                    // Finalize
                    if (this._xformMode == this._ENC_XFORM_MODE) {
                        // Pad data
                        padding.pad(this._data, this.blockSize);

                        // Process final blocks
                        var finalProcessedBlocks = this._process(!!'flush');
                    } else /* if (this._xformMode == this._DEC_XFORM_MODE) */ {
                        // Process final blocks
                        var finalProcessedBlocks = this._process(!!'flush');

                        // Unpad data
                        padding.unpad(finalProcessedBlocks);
                    }

                    return finalProcessedBlocks;
                },

                blockSize: 128/32
            });

            /**
             * A collection of cipher parameters.
             *
             * @property {WordArray} ciphertext The raw ciphertext.
             * @property {WordArray} key The key to this ciphertext.
             * @property {WordArray} iv The IV used in the ciphering operation.
             * @property {WordArray} salt The salt used with a key derivation function.
             * @property {Cipher} algorithm The cipher algorithm.
             * @property {Mode} mode The block mode used in the ciphering operation.
             * @property {Padding} padding The padding scheme used in the ciphering operation.
             * @property {number} blockSize The block size of the cipher.
             * @property {Format} formatter The default formatting strategy to convert this cipher params object to a string.
             */
            var CipherParams = C_lib.CipherParams = Base.extend({
                /**
                 * Initializes a newly created cipher params object.
                 *
                 * @param {Object} cipherParams An object with any of the possible cipher parameters.
                 *
                 * @example
                 *
                 *     var cipherParams = CryptoJS.lib.CipherParams.create({
                 *         ciphertext: ciphertextWordArray,
                 *         key: keyWordArray,
                 *         iv: ivWordArray,
                 *         salt: saltWordArray,
                 *         algorithm: CryptoJS.algo.AES,
                 *         mode: CryptoJS.mode.CBC,
                 *         padding: CryptoJS.pad.PKCS7,
                 *         blockSize: 4,
                 *         formatter: CryptoJS.format.OpenSSL
                 *     });
                 */
                init: function (cipherParams) {
                    this.mixIn(cipherParams);
                },

                /**
                 * Converts this cipher params object to a string.
                 *
                 * @param {Format} formatter (Optional) The formatting strategy to use.
                 *
                 * @return {string} The stringified cipher params.
                 *
                 * @throws Error If neither the formatter nor the default formatter is set.
                 *
                 * @example
                 *
                 *     var string = cipherParams + '';
                 *     var string = cipherParams.toString();
                 *     var string = cipherParams.toString(CryptoJS.format.OpenSSL);
                 */
                toString: function (formatter) {
                    return (formatter || this.formatter).stringify(this);
                }
            });

            /**
             * Format namespace.
             */
            var C_format = C.format = {};

            /**
             * OpenSSL formatting strategy.
             */
            var OpenSSLFormatter = C_format.OpenSSL = {
                /**
                 * Converts a cipher params object to an OpenSSL-compatible string.
                 *
                 * @param {CipherParams} cipherParams The cipher params object.
                 *
                 * @return {string} The OpenSSL-compatible string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var openSSLString = CryptoJS.format.OpenSSL.stringify(cipherParams);
                 */
                stringify: function (cipherParams) {
                    // Shortcuts
                    var ciphertext = cipherParams.ciphertext;
                    var salt = cipherParams.salt;

                    // Format
                    if (salt) {
                        var wordArray = WordArray.create([0x53616c74, 0x65645f5f]).concat(salt).concat(ciphertext);
                    } else {
                        var wordArray = ciphertext;
                    }

                    return wordArray.toString(Base64);
                },

                /**
                 * Converts an OpenSSL-compatible string to a cipher params object.
                 *
                 * @param {string} openSSLStr The OpenSSL-compatible string.
                 *
                 * @return {CipherParams} The cipher params object.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var cipherParams = CryptoJS.format.OpenSSL.parse(openSSLString);
                 */
                parse: function (openSSLStr) {
                    // Parse base64
                    var ciphertext = Base64.parse(openSSLStr);

                    // Shortcut
                    var ciphertextWords = ciphertext.words;

                    // Test for salt
                    if (ciphertextWords[0] == 0x53616c74 && ciphertextWords[1] == 0x65645f5f) {
                        // Extract salt
                        var salt = WordArray.create(ciphertextWords.slice(2, 4));

                        // Remove salt from ciphertext
                        ciphertextWords.splice(0, 4);
                        ciphertext.sigBytes -= 16;
                    }

                    return CipherParams.create({ ciphertext: ciphertext, salt: salt });
                }
            };

            /**
             * A cipher wrapper that returns ciphertext as a serializable cipher params object.
             */
            var SerializableCipher = C_lib.SerializableCipher = Base.extend({
                /**
                 * Configuration options.
                 *
                 * @property {Formatter} format The formatting strategy to convert cipher param objects to and from a string. Default: OpenSSL
                 */
                cfg: Base.extend({
                    format: OpenSSLFormatter
                }),

                /**
                 * Encrypts a message.
                 *
                 * @param {Cipher} cipher The cipher algorithm to use.
                 * @param {WordArray|string} message The message to encrypt.
                 * @param {WordArray} key The key.
                 * @param {Object} cfg (Optional) The configuration options to use for this operation.
                 *
                 * @return {CipherParams} A cipher params object.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key);
                 *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv });
                 *     var ciphertextParams = CryptoJS.lib.SerializableCipher.encrypt(CryptoJS.algo.AES, message, key, { iv: iv, format: CryptoJS.format.OpenSSL });
                 */
                encrypt: function (cipher, message, key, cfg) {
                    // Apply config defaults
                    cfg = this.cfg.extend(cfg);

                    // Encrypt
                    var encryptor = cipher.createEncryptor(key, cfg);
                    var ciphertext = encryptor.finalize(message);

                    // Shortcut
                    var cipherCfg = encryptor.cfg;

                    // Create and return serializable cipher params
                    return CipherParams.create({
                        ciphertext: ciphertext,
                        key: key,
                        iv: cipherCfg.iv,
                        algorithm: cipher,
                        mode: cipherCfg.mode,
                        padding: cipherCfg.padding,
                        blockSize: cipher.blockSize,
                        formatter: cfg.format
                    });
                },

                /**
                 * Decrypts serialized ciphertext.
                 *
                 * @param {Cipher} cipher The cipher algorithm to use.
                 * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
                 * @param {WordArray} key The key.
                 * @param {Object} cfg (Optional) The configuration options to use for this operation.
                 *
                 * @return {WordArray} The plaintext.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, key, { iv: iv, format: CryptoJS.format.OpenSSL });
                 *     var plaintext = CryptoJS.lib.SerializableCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, key, { iv: iv, format: CryptoJS.format.OpenSSL });
                 */
                decrypt: function (cipher, ciphertext, key, cfg) {
                    // Apply config defaults
                    cfg = this.cfg.extend(cfg);

                    // Convert string to CipherParams
                    ciphertext = this._parse(ciphertext, cfg.format);

                    // Decrypt
                    var plaintext = cipher.createDecryptor(key, cfg).finalize(ciphertext.ciphertext);

                    return plaintext;
                },

                /**
                 * Converts serialized ciphertext to CipherParams,
                 * else assumed CipherParams already and returns ciphertext unchanged.
                 *
                 * @param {CipherParams|string} ciphertext The ciphertext.
                 * @param {Formatter} format The formatting strategy to use to parse serialized ciphertext.
                 *
                 * @return {CipherParams} The unserialized ciphertext.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var ciphertextParams = CryptoJS.lib.SerializableCipher._parse(ciphertextStringOrParams, format);
                 */
                _parse: function (ciphertext, format) {
                    if (typeof ciphertext == 'string') {
                        return format.parse(ciphertext, this);
                    } else {
                        return ciphertext;
                    }
                }
            });

            /**
             * Key derivation function namespace.
             */
            var C_kdf = C.kdf = {};

            /**
             * OpenSSL key derivation function.
             */
            var OpenSSLKdf = C_kdf.OpenSSL = {
                /**
                 * Derives a key and IV from a password.
                 *
                 * @param {string} password The password to derive from.
                 * @param {number} keySize The size in words of the key to generate.
                 * @param {number} ivSize The size in words of the IV to generate.
                 * @param {WordArray|string} salt (Optional) A 64-bit salt to use. If omitted, a salt will be generated randomly.
                 *
                 * @return {CipherParams} A cipher params object with the key, IV, and salt.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32);
                 *     var derivedParams = CryptoJS.kdf.OpenSSL.execute('Password', 256/32, 128/32, 'saltsalt');
                 */
                execute: function (password, keySize, ivSize, salt) {
                    // Generate random salt
                    if (!salt) {
                        salt = WordArray.random(64/8);
                    }

                    // Derive key and IV
                    var key = EvpKDF.create({ keySize: keySize + ivSize }).compute(password, salt);

                    // Separate key and IV
                    var iv = WordArray.create(key.words.slice(keySize), ivSize * 4);
                    key.sigBytes = keySize * 4;

                    // Return params
                    return CipherParams.create({ key: key, iv: iv, salt: salt });
                }
            };

            /**
             * A serializable cipher wrapper that derives the key from a password,
             * and returns ciphertext as a serializable cipher params object.
             */
            var PasswordBasedCipher = C_lib.PasswordBasedCipher = SerializableCipher.extend({
                /**
                 * Configuration options.
                 *
                 * @property {KDF} kdf The key derivation function to use to generate a key and IV from a password. Default: OpenSSL
                 */
                cfg: SerializableCipher.cfg.extend({
                    kdf: OpenSSLKdf
                }),

                /**
                 * Encrypts a message using a password.
                 *
                 * @param {Cipher} cipher The cipher algorithm to use.
                 * @param {WordArray|string} message The message to encrypt.
                 * @param {string} password The password.
                 * @param {Object} cfg (Optional) The configuration options to use for this operation.
                 *
                 * @return {CipherParams} A cipher params object.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password');
                 *     var ciphertextParams = CryptoJS.lib.PasswordBasedCipher.encrypt(CryptoJS.algo.AES, message, 'password', { format: CryptoJS.format.OpenSSL });
                 */
                encrypt: function (cipher, message, password, cfg) {
                    // Apply config defaults
                    cfg = this.cfg.extend(cfg);

                    // Derive key and other params
                    var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize);

                    // Add IV to config
                    cfg.iv = derivedParams.iv;

                    // Encrypt
                    var ciphertext = SerializableCipher.encrypt.call(this, cipher, message, derivedParams.key, cfg);

                    // Mix in derived params
                    ciphertext.mixIn(derivedParams);

                    return ciphertext;
                },

                /**
                 * Decrypts serialized ciphertext using a password.
                 *
                 * @param {Cipher} cipher The cipher algorithm to use.
                 * @param {CipherParams|string} ciphertext The ciphertext to decrypt.
                 * @param {string} password The password.
                 * @param {Object} cfg (Optional) The configuration options to use for this operation.
                 *
                 * @return {WordArray} The plaintext.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, formattedCiphertext, 'password', { format: CryptoJS.format.OpenSSL });
                 *     var plaintext = CryptoJS.lib.PasswordBasedCipher.decrypt(CryptoJS.algo.AES, ciphertextParams, 'password', { format: CryptoJS.format.OpenSSL });
                 */
                decrypt: function (cipher, ciphertext, password, cfg) {
                    // Apply config defaults
                    cfg = this.cfg.extend(cfg);

                    // Convert string to CipherParams
                    ciphertext = this._parse(ciphertext, cfg.format);

                    // Derive key and other params
                    var derivedParams = cfg.kdf.execute(password, cipher.keySize, cipher.ivSize, ciphertext.salt);

                    // Add IV to config
                    cfg.iv = derivedParams.iv;

                    // Decrypt
                    var plaintext = SerializableCipher.decrypt.call(this, cipher, ciphertext, derivedParams.key, cfg);

                    return plaintext;
                }
            });
        }());


    }));

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        /**
         * Cipher Feedback block mode.
         */
        CryptoJS.mode.CFB = (function () {
            var CFB = CryptoJS.lib.BlockCipherMode.extend();

            CFB.Encryptor = CFB.extend({
                processBlock: function (words, offset) {
                    // Shortcuts
                    var cipher = this._cipher;
                    var blockSize = cipher.blockSize;

                    generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

                    // Remember this block to use with next block
                    this._prevBlock = words.slice(offset, offset + blockSize);
                }
            });

            CFB.Decryptor = CFB.extend({
                processBlock: function (words, offset) {
                    // Shortcuts
                    var cipher = this._cipher;
                    var blockSize = cipher.blockSize;

                    // Remember this block to use with next block
                    var thisBlock = words.slice(offset, offset + blockSize);

                    generateKeystreamAndEncrypt.call(this, words, offset, blockSize, cipher);

                    // This block becomes the previous block
                    this._prevBlock = thisBlock;
                }
            });

            function generateKeystreamAndEncrypt(words, offset, blockSize, cipher) {
                // Shortcut
                var iv = this._iv;

                // Generate keystream
                if (iv) {
                    var keystream = iv.slice(0);

                    // Remove IV for subsequent blocks
                    this._iv = undefined;
                } else {
                    var keystream = this._prevBlock;
                }
                cipher.encryptBlock(keystream, 0);

                // Encrypt
                for (var i = 0; i < blockSize; i++) {
                    words[offset + i] ^= keystream[i];
                }
            }

            return CFB;
        }());


        return CryptoJS.mode.CFB;

    }));

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        /**
         * Counter block mode.
         */
        CryptoJS.mode.CTR = (function () {
            var CTR = CryptoJS.lib.BlockCipherMode.extend();

            var Encryptor = CTR.Encryptor = CTR.extend({
                processBlock: function (words, offset) {
                    // Shortcuts
                    var cipher = this._cipher
                    var blockSize = cipher.blockSize;
                    var iv = this._iv;
                    var counter = this._counter;

                    // Generate keystream
                    if (iv) {
                        counter = this._counter = iv.slice(0);

                        // Remove IV for subsequent blocks
                        this._iv = undefined;
                    }
                    var keystream = counter.slice(0);
                    cipher.encryptBlock(keystream, 0);

                    // Increment counter
                    counter[blockSize - 1] = (counter[blockSize - 1] + 1) | 0

                    // Encrypt
                    for (var i = 0; i < blockSize; i++) {
                        words[offset + i] ^= keystream[i];
                    }
                }
            });

            CTR.Decryptor = Encryptor;

            return CTR;
        }());


        return CryptoJS.mode.CTR;

    }));

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        /** @preserve
         * Counter block mode compatible with  Dr Brian Gladman fileenc.c
         * derived from CryptoJS.mode.CTR
         * Jan Hruby jhruby.web@gmail.com
         */
        CryptoJS.mode.CTRGladman = (function () {
            var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();

            function incWord(word)
            {
                if (((word >> 24) & 0xff) === 0xff) { //overflow
                var b1 = (word >> 16)&0xff;
                var b2 = (word >> 8)&0xff;
                var b3 = word & 0xff;

                if (b1 === 0xff) // overflow b1
                {
                b1 = 0;
                if (b2 === 0xff)
                {
                    b2 = 0;
                    if (b3 === 0xff)
                    {
                        b3 = 0;
                    }
                    else
                    {
                        ++b3;
                    }
                }
                else
                {
                    ++b2;
                }
                }
                else
                {
                ++b1;
                }

                word = 0;
                word += (b1 << 16);
                word += (b2 << 8);
                word += b3;
                }
                else
                {
                word += (0x01 << 24);
                }
                return word;
            }

            function incCounter(counter)
            {
                if ((counter[0] = incWord(counter[0])) === 0)
                {
                    // encr_data in fileenc.c from  Dr Brian Gladman's counts only with DWORD j < 8
                    counter[1] = incWord(counter[1]);
                }
                return counter;
            }

            var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
                processBlock: function (words, offset) {
                    // Shortcuts
                    var cipher = this._cipher
                    var blockSize = cipher.blockSize;
                    var iv = this._iv;
                    var counter = this._counter;

                    // Generate keystream
                    if (iv) {
                        counter = this._counter = iv.slice(0);

                        // Remove IV for subsequent blocks
                        this._iv = undefined;
                    }

                    incCounter(counter);

                    var keystream = counter.slice(0);
                    cipher.encryptBlock(keystream, 0);

                    // Encrypt
                    for (var i = 0; i < blockSize; i++) {
                        words[offset + i] ^= keystream[i];
                    }
                }
            });

            CTRGladman.Decryptor = Encryptor;

            return CTRGladman;
        }());




        return CryptoJS.mode.CTRGladman;

    }));

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        /**
         * Output Feedback block mode.
         */
        CryptoJS.mode.OFB = (function () {
            var OFB = CryptoJS.lib.BlockCipherMode.extend();

            var Encryptor = OFB.Encryptor = OFB.extend({
                processBlock: function (words, offset) {
                    // Shortcuts
                    var cipher = this._cipher
                    var blockSize = cipher.blockSize;
                    var iv = this._iv;
                    var keystream = this._keystream;

                    // Generate keystream
                    if (iv) {
                        keystream = this._keystream = iv.slice(0);

                        // Remove IV for subsequent blocks
                        this._iv = undefined;
                    }
                    cipher.encryptBlock(keystream, 0);

                    // Encrypt
                    for (var i = 0; i < blockSize; i++) {
                        words[offset + i] ^= keystream[i];
                    }
                }
            });

            OFB.Decryptor = Encryptor;

            return OFB;
        }());


        return CryptoJS.mode.OFB;

    }));

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        /**
         * Electronic Codebook block mode.
         */
        CryptoJS.mode.ECB = (function () {
            var ECB = CryptoJS.lib.BlockCipherMode.extend();

            ECB.Encryptor = ECB.extend({
                processBlock: function (words, offset) {
                    this._cipher.encryptBlock(words, offset);
                }
            });

            ECB.Decryptor = ECB.extend({
                processBlock: function (words, offset) {
                    this._cipher.decryptBlock(words, offset);
                }
            });

            return ECB;
        }());


        return CryptoJS.mode.ECB;

    }));

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        /**
         * ANSI X.923 padding strategy.
         */
        CryptoJS.pad.AnsiX923 = {
            pad: function (data, blockSize) {
                // Shortcuts
                var dataSigBytes = data.sigBytes;
                var blockSizeBytes = blockSize * 4;

                // Count padding bytes
                var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;

                // Compute last byte position
                var lastBytePos = dataSigBytes + nPaddingBytes - 1;

                // Pad
                data.clamp();
                data.words[lastBytePos >>> 2] |= nPaddingBytes << (24 - (lastBytePos % 4) * 8);
                data.sigBytes += nPaddingBytes;
            },

            unpad: function (data) {
                // Get number of padding bytes from last byte
                var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

                // Remove padding
                data.sigBytes -= nPaddingBytes;
            }
        };


        return CryptoJS.pad.Ansix923;

    }));

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        /**
         * ISO 10126 padding strategy.
         */
        CryptoJS.pad.Iso10126 = {
            pad: function (data, blockSize) {
                // Shortcut
                var blockSizeBytes = blockSize * 4;

                // Count padding bytes
                var nPaddingBytes = blockSizeBytes - data.sigBytes % blockSizeBytes;

                // Pad
                data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes - 1)).
                     concat(CryptoJS.lib.WordArray.create([nPaddingBytes << 24], 1));
            },

            unpad: function (data) {
                // Get number of padding bytes from last byte
                var nPaddingBytes = data.words[(data.sigBytes - 1) >>> 2] & 0xff;

                // Remove padding
                data.sigBytes -= nPaddingBytes;
            }
        };


        return CryptoJS.pad.Iso10126;

    }));

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        /**
         * ISO/IEC 9797-1 Padding Method 2.
         */
        CryptoJS.pad.Iso97971 = {
            pad: function (data, blockSize) {
                // Add 0x80 byte
                data.concat(CryptoJS.lib.WordArray.create([0x80000000], 1));

                // Zero pad the rest
                CryptoJS.pad.ZeroPadding.pad(data, blockSize);
            },

            unpad: function (data) {
                // Remove zero padding
                CryptoJS.pad.ZeroPadding.unpad(data);

                // Remove one more byte -- the 0x80 byte
                data.sigBytes--;
            }
        };


        return CryptoJS.pad.Iso97971;

    }));

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        /**
         * Zero padding strategy.
         */
        CryptoJS.pad.ZeroPadding = {
            pad: function (data, blockSize) {
                // Shortcut
                var blockSizeBytes = blockSize * 4;

                // Pad
                data.clamp();
                data.sigBytes += blockSizeBytes - ((data.sigBytes % blockSizeBytes) || blockSizeBytes);
            },

            unpad: function (data) {
                // Shortcut
                var dataWords = data.words;

                // Unpad
                var i = data.sigBytes - 1;
                while (!((dataWords[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff)) {
                    i--;
                }
                data.sigBytes = i + 1;
            }
        };


        return CryptoJS.pad.ZeroPadding;

    }));

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        /**
         * A noop padding strategy.
         */
        CryptoJS.pad.NoPadding = {
            pad: function () {
            },

            unpad: function () {
            }
        };


        return CryptoJS.pad.NoPadding;

    }));

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function (undefined) {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var CipherParams = C_lib.CipherParams;
            var C_enc = C.enc;
            var Hex = C_enc.Hex;
            var C_format = C.format;

            var HexFormatter = C_format.Hex = {
                /**
                 * Converts the ciphertext of a cipher params object to a hexadecimally encoded string.
                 *
                 * @param {CipherParams} cipherParams The cipher params object.
                 *
                 * @return {string} The hexadecimally encoded string.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var hexString = CryptoJS.format.Hex.stringify(cipherParams);
                 */
                stringify: function (cipherParams) {
                    return cipherParams.ciphertext.toString(Hex);
                },

                /**
                 * Converts a hexadecimally encoded ciphertext string to a cipher params object.
                 *
                 * @param {string} input The hexadecimally encoded string.
                 *
                 * @return {CipherParams} The cipher params object.
                 *
                 * @static
                 *
                 * @example
                 *
                 *     var cipherParams = CryptoJS.format.Hex.parse(hexString);
                 */
                parse: function (input) {
                    var ciphertext = Hex.parse(input);
                    return CipherParams.create({ ciphertext: ciphertext });
                }
            };
        }());


        return CryptoJS.format.Hex;

    }));

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(10), __webpack_require__(11), __webpack_require__(21), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var BlockCipher = C_lib.BlockCipher;
            var C_algo = C.algo;

            // Lookup tables
            var SBOX = [];
            var INV_SBOX = [];
            var SUB_MIX_0 = [];
            var SUB_MIX_1 = [];
            var SUB_MIX_2 = [];
            var SUB_MIX_3 = [];
            var INV_SUB_MIX_0 = [];
            var INV_SUB_MIX_1 = [];
            var INV_SUB_MIX_2 = [];
            var INV_SUB_MIX_3 = [];

            // Compute lookup tables
            (function () {
                // Compute double table
                var d = [];
                for (var i = 0; i < 256; i++) {
                    if (i < 128) {
                        d[i] = i << 1;
                    } else {
                        d[i] = (i << 1) ^ 0x11b;
                    }
                }

                // Walk GF(2^8)
                var x = 0;
                var xi = 0;
                for (var i = 0; i < 256; i++) {
                    // Compute sbox
                    var sx = xi ^ (xi << 1) ^ (xi << 2) ^ (xi << 3) ^ (xi << 4);
                    sx = (sx >>> 8) ^ (sx & 0xff) ^ 0x63;
                    SBOX[x] = sx;
                    INV_SBOX[sx] = x;

                    // Compute multiplication
                    var x2 = d[x];
                    var x4 = d[x2];
                    var x8 = d[x4];

                    // Compute sub bytes, mix columns tables
                    var t = (d[sx] * 0x101) ^ (sx * 0x1010100);
                    SUB_MIX_0[x] = (t << 24) | (t >>> 8);
                    SUB_MIX_1[x] = (t << 16) | (t >>> 16);
                    SUB_MIX_2[x] = (t << 8)  | (t >>> 24);
                    SUB_MIX_3[x] = t;

                    // Compute inv sub bytes, inv mix columns tables
                    var t = (x8 * 0x1010101) ^ (x4 * 0x10001) ^ (x2 * 0x101) ^ (x * 0x1010100);
                    INV_SUB_MIX_0[sx] = (t << 24) | (t >>> 8);
                    INV_SUB_MIX_1[sx] = (t << 16) | (t >>> 16);
                    INV_SUB_MIX_2[sx] = (t << 8)  | (t >>> 24);
                    INV_SUB_MIX_3[sx] = t;

                    // Compute next counter
                    if (!x) {
                        x = xi = 1;
                    } else {
                        x = x2 ^ d[d[d[x8 ^ x2]]];
                        xi ^= d[d[xi]];
                    }
                }
            }());

            // Precomputed Rcon lookup
            var RCON = [0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36];

            /**
             * AES block cipher algorithm.
             */
            var AES = C_algo.AES = BlockCipher.extend({
                _doReset: function () {
                    // Skip reset of nRounds has been set before and key did not change
                    if (this._nRounds && this._keyPriorReset === this._key) {
                        return;
                    }

                    // Shortcuts
                    var key = this._keyPriorReset = this._key;
                    var keyWords = key.words;
                    var keySize = key.sigBytes / 4;

                    // Compute number of rounds
                    var nRounds = this._nRounds = keySize + 6;

                    // Compute number of key schedule rows
                    var ksRows = (nRounds + 1) * 4;

                    // Compute key schedule
                    var keySchedule = this._keySchedule = [];
                    for (var ksRow = 0; ksRow < ksRows; ksRow++) {
                        if (ksRow < keySize) {
                            keySchedule[ksRow] = keyWords[ksRow];
                        } else {
                            var t = keySchedule[ksRow - 1];

                            if (!(ksRow % keySize)) {
                                // Rot word
                                t = (t << 8) | (t >>> 24);

                                // Sub word
                                t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];

                                // Mix Rcon
                                t ^= RCON[(ksRow / keySize) | 0] << 24;
                            } else if (keySize > 6 && ksRow % keySize == 4) {
                                // Sub word
                                t = (SBOX[t >>> 24] << 24) | (SBOX[(t >>> 16) & 0xff] << 16) | (SBOX[(t >>> 8) & 0xff] << 8) | SBOX[t & 0xff];
                            }

                            keySchedule[ksRow] = keySchedule[ksRow - keySize] ^ t;
                        }
                    }

                    // Compute inv key schedule
                    var invKeySchedule = this._invKeySchedule = [];
                    for (var invKsRow = 0; invKsRow < ksRows; invKsRow++) {
                        var ksRow = ksRows - invKsRow;

                        if (invKsRow % 4) {
                            var t = keySchedule[ksRow];
                        } else {
                            var t = keySchedule[ksRow - 4];
                        }

                        if (invKsRow < 4 || ksRow <= 4) {
                            invKeySchedule[invKsRow] = t;
                        } else {
                            invKeySchedule[invKsRow] = INV_SUB_MIX_0[SBOX[t >>> 24]] ^ INV_SUB_MIX_1[SBOX[(t >>> 16) & 0xff]] ^
                                                       INV_SUB_MIX_2[SBOX[(t >>> 8) & 0xff]] ^ INV_SUB_MIX_3[SBOX[t & 0xff]];
                        }
                    }
                },

                encryptBlock: function (M, offset) {
                    this._doCryptBlock(M, offset, this._keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX);
                },

                decryptBlock: function (M, offset) {
                    // Swap 2nd and 4th rows
                    var t = M[offset + 1];
                    M[offset + 1] = M[offset + 3];
                    M[offset + 3] = t;

                    this._doCryptBlock(M, offset, this._invKeySchedule, INV_SUB_MIX_0, INV_SUB_MIX_1, INV_SUB_MIX_2, INV_SUB_MIX_3, INV_SBOX);

                    // Inv swap 2nd and 4th rows
                    var t = M[offset + 1];
                    M[offset + 1] = M[offset + 3];
                    M[offset + 3] = t;
                },

                _doCryptBlock: function (M, offset, keySchedule, SUB_MIX_0, SUB_MIX_1, SUB_MIX_2, SUB_MIX_3, SBOX) {
                    // Shortcut
                    var nRounds = this._nRounds;

                    // Get input, add round key
                    var s0 = M[offset]     ^ keySchedule[0];
                    var s1 = M[offset + 1] ^ keySchedule[1];
                    var s2 = M[offset + 2] ^ keySchedule[2];
                    var s3 = M[offset + 3] ^ keySchedule[3];

                    // Key schedule row counter
                    var ksRow = 4;

                    // Rounds
                    for (var round = 1; round < nRounds; round++) {
                        // Shift rows, sub bytes, mix columns, add round key
                        var t0 = SUB_MIX_0[s0 >>> 24] ^ SUB_MIX_1[(s1 >>> 16) & 0xff] ^ SUB_MIX_2[(s2 >>> 8) & 0xff] ^ SUB_MIX_3[s3 & 0xff] ^ keySchedule[ksRow++];
                        var t1 = SUB_MIX_0[s1 >>> 24] ^ SUB_MIX_1[(s2 >>> 16) & 0xff] ^ SUB_MIX_2[(s3 >>> 8) & 0xff] ^ SUB_MIX_3[s0 & 0xff] ^ keySchedule[ksRow++];
                        var t2 = SUB_MIX_0[s2 >>> 24] ^ SUB_MIX_1[(s3 >>> 16) & 0xff] ^ SUB_MIX_2[(s0 >>> 8) & 0xff] ^ SUB_MIX_3[s1 & 0xff] ^ keySchedule[ksRow++];
                        var t3 = SUB_MIX_0[s3 >>> 24] ^ SUB_MIX_1[(s0 >>> 16) & 0xff] ^ SUB_MIX_2[(s1 >>> 8) & 0xff] ^ SUB_MIX_3[s2 & 0xff] ^ keySchedule[ksRow++];

                        // Update state
                        s0 = t0;
                        s1 = t1;
                        s2 = t2;
                        s3 = t3;
                    }

                    // Shift rows, sub bytes, add round key
                    var t0 = ((SBOX[s0 >>> 24] << 24) | (SBOX[(s1 >>> 16) & 0xff] << 16) | (SBOX[(s2 >>> 8) & 0xff] << 8) | SBOX[s3 & 0xff]) ^ keySchedule[ksRow++];
                    var t1 = ((SBOX[s1 >>> 24] << 24) | (SBOX[(s2 >>> 16) & 0xff] << 16) | (SBOX[(s3 >>> 8) & 0xff] << 8) | SBOX[s0 & 0xff]) ^ keySchedule[ksRow++];
                    var t2 = ((SBOX[s2 >>> 24] << 24) | (SBOX[(s3 >>> 16) & 0xff] << 16) | (SBOX[(s0 >>> 8) & 0xff] << 8) | SBOX[s1 & 0xff]) ^ keySchedule[ksRow++];
                    var t3 = ((SBOX[s3 >>> 24] << 24) | (SBOX[(s0 >>> 16) & 0xff] << 16) | (SBOX[(s1 >>> 8) & 0xff] << 8) | SBOX[s2 & 0xff]) ^ keySchedule[ksRow++];

                    // Set output
                    M[offset]     = t0;
                    M[offset + 1] = t1;
                    M[offset + 2] = t2;
                    M[offset + 3] = t3;
                },

                keySize: 256/32
            });

            /**
             * Shortcut functions to the cipher's object interface.
             *
             * @example
             *
             *     var ciphertext = CryptoJS.AES.encrypt(message, key, cfg);
             *     var plaintext  = CryptoJS.AES.decrypt(ciphertext, key, cfg);
             */
            C.AES = BlockCipher._createHelper(AES);
        }());


        return CryptoJS.AES;

    }));

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(10), __webpack_require__(11), __webpack_require__(21), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var WordArray = C_lib.WordArray;
            var BlockCipher = C_lib.BlockCipher;
            var C_algo = C.algo;

            // Permuted Choice 1 constants
            var PC1 = [
                57, 49, 41, 33, 25, 17, 9,  1,
                58, 50, 42, 34, 26, 18, 10, 2,
                59, 51, 43, 35, 27, 19, 11, 3,
                60, 52, 44, 36, 63, 55, 47, 39,
                31, 23, 15, 7,  62, 54, 46, 38,
                30, 22, 14, 6,  61, 53, 45, 37,
                29, 21, 13, 5,  28, 20, 12, 4
            ];

            // Permuted Choice 2 constants
            var PC2 = [
                14, 17, 11, 24, 1,  5,
                3,  28, 15, 6,  21, 10,
                23, 19, 12, 4,  26, 8,
                16, 7,  27, 20, 13, 2,
                41, 52, 31, 37, 47, 55,
                30, 40, 51, 45, 33, 48,
                44, 49, 39, 56, 34, 53,
                46, 42, 50, 36, 29, 32
            ];

            // Cumulative bit shift constants
            var BIT_SHIFTS = [1,  2,  4,  6,  8,  10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28];

            // SBOXes and round permutation constants
            var SBOX_P = [
                {
                    0x0: 0x808200,
                    0x10000000: 0x8000,
                    0x20000000: 0x808002,
                    0x30000000: 0x2,
                    0x40000000: 0x200,
                    0x50000000: 0x808202,
                    0x60000000: 0x800202,
                    0x70000000: 0x800000,
                    0x80000000: 0x202,
                    0x90000000: 0x800200,
                    0xa0000000: 0x8200,
                    0xb0000000: 0x808000,
                    0xc0000000: 0x8002,
                    0xd0000000: 0x800002,
                    0xe0000000: 0x0,
                    0xf0000000: 0x8202,
                    0x8000000: 0x0,
                    0x18000000: 0x808202,
                    0x28000000: 0x8202,
                    0x38000000: 0x8000,
                    0x48000000: 0x808200,
                    0x58000000: 0x200,
                    0x68000000: 0x808002,
                    0x78000000: 0x2,
                    0x88000000: 0x800200,
                    0x98000000: 0x8200,
                    0xa8000000: 0x808000,
                    0xb8000000: 0x800202,
                    0xc8000000: 0x800002,
                    0xd8000000: 0x8002,
                    0xe8000000: 0x202,
                    0xf8000000: 0x800000,
                    0x1: 0x8000,
                    0x10000001: 0x2,
                    0x20000001: 0x808200,
                    0x30000001: 0x800000,
                    0x40000001: 0x808002,
                    0x50000001: 0x8200,
                    0x60000001: 0x200,
                    0x70000001: 0x800202,
                    0x80000001: 0x808202,
                    0x90000001: 0x808000,
                    0xa0000001: 0x800002,
                    0xb0000001: 0x8202,
                    0xc0000001: 0x202,
                    0xd0000001: 0x800200,
                    0xe0000001: 0x8002,
                    0xf0000001: 0x0,
                    0x8000001: 0x808202,
                    0x18000001: 0x808000,
                    0x28000001: 0x800000,
                    0x38000001: 0x200,
                    0x48000001: 0x8000,
                    0x58000001: 0x800002,
                    0x68000001: 0x2,
                    0x78000001: 0x8202,
                    0x88000001: 0x8002,
                    0x98000001: 0x800202,
                    0xa8000001: 0x202,
                    0xb8000001: 0x808200,
                    0xc8000001: 0x800200,
                    0xd8000001: 0x0,
                    0xe8000001: 0x8200,
                    0xf8000001: 0x808002
                },
                {
                    0x0: 0x40084010,
                    0x1000000: 0x4000,
                    0x2000000: 0x80000,
                    0x3000000: 0x40080010,
                    0x4000000: 0x40000010,
                    0x5000000: 0x40084000,
                    0x6000000: 0x40004000,
                    0x7000000: 0x10,
                    0x8000000: 0x84000,
                    0x9000000: 0x40004010,
                    0xa000000: 0x40000000,
                    0xb000000: 0x84010,
                    0xc000000: 0x80010,
                    0xd000000: 0x0,
                    0xe000000: 0x4010,
                    0xf000000: 0x40080000,
                    0x800000: 0x40004000,
                    0x1800000: 0x84010,
                    0x2800000: 0x10,
                    0x3800000: 0x40004010,
                    0x4800000: 0x40084010,
                    0x5800000: 0x40000000,
                    0x6800000: 0x80000,
                    0x7800000: 0x40080010,
                    0x8800000: 0x80010,
                    0x9800000: 0x0,
                    0xa800000: 0x4000,
                    0xb800000: 0x40080000,
                    0xc800000: 0x40000010,
                    0xd800000: 0x84000,
                    0xe800000: 0x40084000,
                    0xf800000: 0x4010,
                    0x10000000: 0x0,
                    0x11000000: 0x40080010,
                    0x12000000: 0x40004010,
                    0x13000000: 0x40084000,
                    0x14000000: 0x40080000,
                    0x15000000: 0x10,
                    0x16000000: 0x84010,
                    0x17000000: 0x4000,
                    0x18000000: 0x4010,
                    0x19000000: 0x80000,
                    0x1a000000: 0x80010,
                    0x1b000000: 0x40000010,
                    0x1c000000: 0x84000,
                    0x1d000000: 0x40004000,
                    0x1e000000: 0x40000000,
                    0x1f000000: 0x40084010,
                    0x10800000: 0x84010,
                    0x11800000: 0x80000,
                    0x12800000: 0x40080000,
                    0x13800000: 0x4000,
                    0x14800000: 0x40004000,
                    0x15800000: 0x40084010,
                    0x16800000: 0x10,
                    0x17800000: 0x40000000,
                    0x18800000: 0x40084000,
                    0x19800000: 0x40000010,
                    0x1a800000: 0x40004010,
                    0x1b800000: 0x80010,
                    0x1c800000: 0x0,
                    0x1d800000: 0x4010,
                    0x1e800000: 0x40080010,
                    0x1f800000: 0x84000
                },
                {
                    0x0: 0x104,
                    0x100000: 0x0,
                    0x200000: 0x4000100,
                    0x300000: 0x10104,
                    0x400000: 0x10004,
                    0x500000: 0x4000004,
                    0x600000: 0x4010104,
                    0x700000: 0x4010000,
                    0x800000: 0x4000000,
                    0x900000: 0x4010100,
                    0xa00000: 0x10100,
                    0xb00000: 0x4010004,
                    0xc00000: 0x4000104,
                    0xd00000: 0x10000,
                    0xe00000: 0x4,
                    0xf00000: 0x100,
                    0x80000: 0x4010100,
                    0x180000: 0x4010004,
                    0x280000: 0x0,
                    0x380000: 0x4000100,
                    0x480000: 0x4000004,
                    0x580000: 0x10000,
                    0x680000: 0x10004,
                    0x780000: 0x104,
                    0x880000: 0x4,
                    0x980000: 0x100,
                    0xa80000: 0x4010000,
                    0xb80000: 0x10104,
                    0xc80000: 0x10100,
                    0xd80000: 0x4000104,
                    0xe80000: 0x4010104,
                    0xf80000: 0x4000000,
                    0x1000000: 0x4010100,
                    0x1100000: 0x10004,
                    0x1200000: 0x10000,
                    0x1300000: 0x4000100,
                    0x1400000: 0x100,
                    0x1500000: 0x4010104,
                    0x1600000: 0x4000004,
                    0x1700000: 0x0,
                    0x1800000: 0x4000104,
                    0x1900000: 0x4000000,
                    0x1a00000: 0x4,
                    0x1b00000: 0x10100,
                    0x1c00000: 0x4010000,
                    0x1d00000: 0x104,
                    0x1e00000: 0x10104,
                    0x1f00000: 0x4010004,
                    0x1080000: 0x4000000,
                    0x1180000: 0x104,
                    0x1280000: 0x4010100,
                    0x1380000: 0x0,
                    0x1480000: 0x10004,
                    0x1580000: 0x4000100,
                    0x1680000: 0x100,
                    0x1780000: 0x4010004,
                    0x1880000: 0x10000,
                    0x1980000: 0x4010104,
                    0x1a80000: 0x10104,
                    0x1b80000: 0x4000004,
                    0x1c80000: 0x4000104,
                    0x1d80000: 0x4010000,
                    0x1e80000: 0x4,
                    0x1f80000: 0x10100
                },
                {
                    0x0: 0x80401000,
                    0x10000: 0x80001040,
                    0x20000: 0x401040,
                    0x30000: 0x80400000,
                    0x40000: 0x0,
                    0x50000: 0x401000,
                    0x60000: 0x80000040,
                    0x70000: 0x400040,
                    0x80000: 0x80000000,
                    0x90000: 0x400000,
                    0xa0000: 0x40,
                    0xb0000: 0x80001000,
                    0xc0000: 0x80400040,
                    0xd0000: 0x1040,
                    0xe0000: 0x1000,
                    0xf0000: 0x80401040,
                    0x8000: 0x80001040,
                    0x18000: 0x40,
                    0x28000: 0x80400040,
                    0x38000: 0x80001000,
                    0x48000: 0x401000,
                    0x58000: 0x80401040,
                    0x68000: 0x0,
                    0x78000: 0x80400000,
                    0x88000: 0x1000,
                    0x98000: 0x80401000,
                    0xa8000: 0x400000,
                    0xb8000: 0x1040,
                    0xc8000: 0x80000000,
                    0xd8000: 0x400040,
                    0xe8000: 0x401040,
                    0xf8000: 0x80000040,
                    0x100000: 0x400040,
                    0x110000: 0x401000,
                    0x120000: 0x80000040,
                    0x130000: 0x0,
                    0x140000: 0x1040,
                    0x150000: 0x80400040,
                    0x160000: 0x80401000,
                    0x170000: 0x80001040,
                    0x180000: 0x80401040,
                    0x190000: 0x80000000,
                    0x1a0000: 0x80400000,
                    0x1b0000: 0x401040,
                    0x1c0000: 0x80001000,
                    0x1d0000: 0x400000,
                    0x1e0000: 0x40,
                    0x1f0000: 0x1000,
                    0x108000: 0x80400000,
                    0x118000: 0x80401040,
                    0x128000: 0x0,
                    0x138000: 0x401000,
                    0x148000: 0x400040,
                    0x158000: 0x80000000,
                    0x168000: 0x80001040,
                    0x178000: 0x40,
                    0x188000: 0x80000040,
                    0x198000: 0x1000,
                    0x1a8000: 0x80001000,
                    0x1b8000: 0x80400040,
                    0x1c8000: 0x1040,
                    0x1d8000: 0x80401000,
                    0x1e8000: 0x400000,
                    0x1f8000: 0x401040
                },
                {
                    0x0: 0x80,
                    0x1000: 0x1040000,
                    0x2000: 0x40000,
                    0x3000: 0x20000000,
                    0x4000: 0x20040080,
                    0x5000: 0x1000080,
                    0x6000: 0x21000080,
                    0x7000: 0x40080,
                    0x8000: 0x1000000,
                    0x9000: 0x20040000,
                    0xa000: 0x20000080,
                    0xb000: 0x21040080,
                    0xc000: 0x21040000,
                    0xd000: 0x0,
                    0xe000: 0x1040080,
                    0xf000: 0x21000000,
                    0x800: 0x1040080,
                    0x1800: 0x21000080,
                    0x2800: 0x80,
                    0x3800: 0x1040000,
                    0x4800: 0x40000,
                    0x5800: 0x20040080,
                    0x6800: 0x21040000,
                    0x7800: 0x20000000,
                    0x8800: 0x20040000,
                    0x9800: 0x0,
                    0xa800: 0x21040080,
                    0xb800: 0x1000080,
                    0xc800: 0x20000080,
                    0xd800: 0x21000000,
                    0xe800: 0x1000000,
                    0xf800: 0x40080,
                    0x10000: 0x40000,
                    0x11000: 0x80,
                    0x12000: 0x20000000,
                    0x13000: 0x21000080,
                    0x14000: 0x1000080,
                    0x15000: 0x21040000,
                    0x16000: 0x20040080,
                    0x17000: 0x1000000,
                    0x18000: 0x21040080,
                    0x19000: 0x21000000,
                    0x1a000: 0x1040000,
                    0x1b000: 0x20040000,
                    0x1c000: 0x40080,
                    0x1d000: 0x20000080,
                    0x1e000: 0x0,
                    0x1f000: 0x1040080,
                    0x10800: 0x21000080,
                    0x11800: 0x1000000,
                    0x12800: 0x1040000,
                    0x13800: 0x20040080,
                    0x14800: 0x20000000,
                    0x15800: 0x1040080,
                    0x16800: 0x80,
                    0x17800: 0x21040000,
                    0x18800: 0x40080,
                    0x19800: 0x21040080,
                    0x1a800: 0x0,
                    0x1b800: 0x21000000,
                    0x1c800: 0x1000080,
                    0x1d800: 0x40000,
                    0x1e800: 0x20040000,
                    0x1f800: 0x20000080
                },
                {
                    0x0: 0x10000008,
                    0x100: 0x2000,
                    0x200: 0x10200000,
                    0x300: 0x10202008,
                    0x400: 0x10002000,
                    0x500: 0x200000,
                    0x600: 0x200008,
                    0x700: 0x10000000,
                    0x800: 0x0,
                    0x900: 0x10002008,
                    0xa00: 0x202000,
                    0xb00: 0x8,
                    0xc00: 0x10200008,
                    0xd00: 0x202008,
                    0xe00: 0x2008,
                    0xf00: 0x10202000,
                    0x80: 0x10200000,
                    0x180: 0x10202008,
                    0x280: 0x8,
                    0x380: 0x200000,
                    0x480: 0x202008,
                    0x580: 0x10000008,
                    0x680: 0x10002000,
                    0x780: 0x2008,
                    0x880: 0x200008,
                    0x980: 0x2000,
                    0xa80: 0x10002008,
                    0xb80: 0x10200008,
                    0xc80: 0x0,
                    0xd80: 0x10202000,
                    0xe80: 0x202000,
                    0xf80: 0x10000000,
                    0x1000: 0x10002000,
                    0x1100: 0x10200008,
                    0x1200: 0x10202008,
                    0x1300: 0x2008,
                    0x1400: 0x200000,
                    0x1500: 0x10000000,
                    0x1600: 0x10000008,
                    0x1700: 0x202000,
                    0x1800: 0x202008,
                    0x1900: 0x0,
                    0x1a00: 0x8,
                    0x1b00: 0x10200000,
                    0x1c00: 0x2000,
                    0x1d00: 0x10002008,
                    0x1e00: 0x10202000,
                    0x1f00: 0x200008,
                    0x1080: 0x8,
                    0x1180: 0x202000,
                    0x1280: 0x200000,
                    0x1380: 0x10000008,
                    0x1480: 0x10002000,
                    0x1580: 0x2008,
                    0x1680: 0x10202008,
                    0x1780: 0x10200000,
                    0x1880: 0x10202000,
                    0x1980: 0x10200008,
                    0x1a80: 0x2000,
                    0x1b80: 0x202008,
                    0x1c80: 0x200008,
                    0x1d80: 0x0,
                    0x1e80: 0x10000000,
                    0x1f80: 0x10002008
                },
                {
                    0x0: 0x100000,
                    0x10: 0x2000401,
                    0x20: 0x400,
                    0x30: 0x100401,
                    0x40: 0x2100401,
                    0x50: 0x0,
                    0x60: 0x1,
                    0x70: 0x2100001,
                    0x80: 0x2000400,
                    0x90: 0x100001,
                    0xa0: 0x2000001,
                    0xb0: 0x2100400,
                    0xc0: 0x2100000,
                    0xd0: 0x401,
                    0xe0: 0x100400,
                    0xf0: 0x2000000,
                    0x8: 0x2100001,
                    0x18: 0x0,
                    0x28: 0x2000401,
                    0x38: 0x2100400,
                    0x48: 0x100000,
                    0x58: 0x2000001,
                    0x68: 0x2000000,
                    0x78: 0x401,
                    0x88: 0x100401,
                    0x98: 0x2000400,
                    0xa8: 0x2100000,
                    0xb8: 0x100001,
                    0xc8: 0x400,
                    0xd8: 0x2100401,
                    0xe8: 0x1,
                    0xf8: 0x100400,
                    0x100: 0x2000000,
                    0x110: 0x100000,
                    0x120: 0x2000401,
                    0x130: 0x2100001,
                    0x140: 0x100001,
                    0x150: 0x2000400,
                    0x160: 0x2100400,
                    0x170: 0x100401,
                    0x180: 0x401,
                    0x190: 0x2100401,
                    0x1a0: 0x100400,
                    0x1b0: 0x1,
                    0x1c0: 0x0,
                    0x1d0: 0x2100000,
                    0x1e0: 0x2000001,
                    0x1f0: 0x400,
                    0x108: 0x100400,
                    0x118: 0x2000401,
                    0x128: 0x2100001,
                    0x138: 0x1,
                    0x148: 0x2000000,
                    0x158: 0x100000,
                    0x168: 0x401,
                    0x178: 0x2100400,
                    0x188: 0x2000001,
                    0x198: 0x2100000,
                    0x1a8: 0x0,
                    0x1b8: 0x2100401,
                    0x1c8: 0x100401,
                    0x1d8: 0x400,
                    0x1e8: 0x2000400,
                    0x1f8: 0x100001
                },
                {
                    0x0: 0x8000820,
                    0x1: 0x20000,
                    0x2: 0x8000000,
                    0x3: 0x20,
                    0x4: 0x20020,
                    0x5: 0x8020820,
                    0x6: 0x8020800,
                    0x7: 0x800,
                    0x8: 0x8020000,
                    0x9: 0x8000800,
                    0xa: 0x20800,
                    0xb: 0x8020020,
                    0xc: 0x820,
                    0xd: 0x0,
                    0xe: 0x8000020,
                    0xf: 0x20820,
                    0x80000000: 0x800,
                    0x80000001: 0x8020820,
                    0x80000002: 0x8000820,
                    0x80000003: 0x8000000,
                    0x80000004: 0x8020000,
                    0x80000005: 0x20800,
                    0x80000006: 0x20820,
                    0x80000007: 0x20,
                    0x80000008: 0x8000020,
                    0x80000009: 0x820,
                    0x8000000a: 0x20020,
                    0x8000000b: 0x8020800,
                    0x8000000c: 0x0,
                    0x8000000d: 0x8020020,
                    0x8000000e: 0x8000800,
                    0x8000000f: 0x20000,
                    0x10: 0x20820,
                    0x11: 0x8020800,
                    0x12: 0x20,
                    0x13: 0x800,
                    0x14: 0x8000800,
                    0x15: 0x8000020,
                    0x16: 0x8020020,
                    0x17: 0x20000,
                    0x18: 0x0,
                    0x19: 0x20020,
                    0x1a: 0x8020000,
                    0x1b: 0x8000820,
                    0x1c: 0x8020820,
                    0x1d: 0x20800,
                    0x1e: 0x820,
                    0x1f: 0x8000000,
                    0x80000010: 0x20000,
                    0x80000011: 0x800,
                    0x80000012: 0x8020020,
                    0x80000013: 0x20820,
                    0x80000014: 0x20,
                    0x80000015: 0x8020000,
                    0x80000016: 0x8000000,
                    0x80000017: 0x8000820,
                    0x80000018: 0x8020820,
                    0x80000019: 0x8000020,
                    0x8000001a: 0x8000800,
                    0x8000001b: 0x0,
                    0x8000001c: 0x20800,
                    0x8000001d: 0x820,
                    0x8000001e: 0x20020,
                    0x8000001f: 0x8020800
                }
            ];

            // Masks that select the SBOX input
            var SBOX_MASK = [
                0xf8000001, 0x1f800000, 0x01f80000, 0x001f8000,
                0x0001f800, 0x00001f80, 0x000001f8, 0x8000001f
            ];

            /**
             * DES block cipher algorithm.
             */
            var DES = C_algo.DES = BlockCipher.extend({
                _doReset: function () {
                    // Shortcuts
                    var key = this._key;
                    var keyWords = key.words;

                    // Select 56 bits according to PC1
                    var keyBits = [];
                    for (var i = 0; i < 56; i++) {
                        var keyBitPos = PC1[i] - 1;
                        keyBits[i] = (keyWords[keyBitPos >>> 5] >>> (31 - keyBitPos % 32)) & 1;
                    }

                    // Assemble 16 subkeys
                    var subKeys = this._subKeys = [];
                    for (var nSubKey = 0; nSubKey < 16; nSubKey++) {
                        // Create subkey
                        var subKey = subKeys[nSubKey] = [];

                        // Shortcut
                        var bitShift = BIT_SHIFTS[nSubKey];

                        // Select 48 bits according to PC2
                        for (var i = 0; i < 24; i++) {
                            // Select from the left 28 key bits
                            subKey[(i / 6) | 0] |= keyBits[((PC2[i] - 1) + bitShift) % 28] << (31 - i % 6);

                            // Select from the right 28 key bits
                            subKey[4 + ((i / 6) | 0)] |= keyBits[28 + (((PC2[i + 24] - 1) + bitShift) % 28)] << (31 - i % 6);
                        }

                        // Since each subkey is applied to an expanded 32-bit input,
                        // the subkey can be broken into 8 values scaled to 32-bits,
                        // which allows the key to be used without expansion
                        subKey[0] = (subKey[0] << 1) | (subKey[0] >>> 31);
                        for (var i = 1; i < 7; i++) {
                            subKey[i] = subKey[i] >>> ((i - 1) * 4 + 3);
                        }
                        subKey[7] = (subKey[7] << 5) | (subKey[7] >>> 27);
                    }

                    // Compute inverse subkeys
                    var invSubKeys = this._invSubKeys = [];
                    for (var i = 0; i < 16; i++) {
                        invSubKeys[i] = subKeys[15 - i];
                    }
                },

                encryptBlock: function (M, offset) {
                    this._doCryptBlock(M, offset, this._subKeys);
                },

                decryptBlock: function (M, offset) {
                    this._doCryptBlock(M, offset, this._invSubKeys);
                },

                _doCryptBlock: function (M, offset, subKeys) {
                    // Get input
                    this._lBlock = M[offset];
                    this._rBlock = M[offset + 1];

                    // Initial permutation
                    exchangeLR.call(this, 4,  0x0f0f0f0f);
                    exchangeLR.call(this, 16, 0x0000ffff);
                    exchangeRL.call(this, 2,  0x33333333);
                    exchangeRL.call(this, 8,  0x00ff00ff);
                    exchangeLR.call(this, 1,  0x55555555);

                    // Rounds
                    for (var round = 0; round < 16; round++) {
                        // Shortcuts
                        var subKey = subKeys[round];
                        var lBlock = this._lBlock;
                        var rBlock = this._rBlock;

                        // Feistel function
                        var f = 0;
                        for (var i = 0; i < 8; i++) {
                            f |= SBOX_P[i][((rBlock ^ subKey[i]) & SBOX_MASK[i]) >>> 0];
                        }
                        this._lBlock = rBlock;
                        this._rBlock = lBlock ^ f;
                    }

                    // Undo swap from last round
                    var t = this._lBlock;
                    this._lBlock = this._rBlock;
                    this._rBlock = t;

                    // Final permutation
                    exchangeLR.call(this, 1,  0x55555555);
                    exchangeRL.call(this, 8,  0x00ff00ff);
                    exchangeRL.call(this, 2,  0x33333333);
                    exchangeLR.call(this, 16, 0x0000ffff);
                    exchangeLR.call(this, 4,  0x0f0f0f0f);

                    // Set output
                    M[offset] = this._lBlock;
                    M[offset + 1] = this._rBlock;
                },

                keySize: 64/32,

                ivSize: 64/32,

                blockSize: 64/32
            });

            // Swap bits across the left and right words
            function exchangeLR(offset, mask) {
                var t = ((this._lBlock >>> offset) ^ this._rBlock) & mask;
                this._rBlock ^= t;
                this._lBlock ^= t << offset;
            }

            function exchangeRL(offset, mask) {
                var t = ((this._rBlock >>> offset) ^ this._lBlock) & mask;
                this._lBlock ^= t;
                this._rBlock ^= t << offset;
            }

            /**
             * Shortcut functions to the cipher's object interface.
             *
             * @example
             *
             *     var ciphertext = CryptoJS.DES.encrypt(message, key, cfg);
             *     var plaintext  = CryptoJS.DES.decrypt(ciphertext, key, cfg);
             */
            C.DES = BlockCipher._createHelper(DES);

            /**
             * Triple-DES block cipher algorithm.
             */
            var TripleDES = C_algo.TripleDES = BlockCipher.extend({
                _doReset: function () {
                    // Shortcuts
                    var key = this._key;
                    var keyWords = key.words;

                    // Create DES instances
                    this._des1 = DES.createEncryptor(WordArray.create(keyWords.slice(0, 2)));
                    this._des2 = DES.createEncryptor(WordArray.create(keyWords.slice(2, 4)));
                    this._des3 = DES.createEncryptor(WordArray.create(keyWords.slice(4, 6)));
                },

                encryptBlock: function (M, offset) {
                    this._des1.encryptBlock(M, offset);
                    this._des2.decryptBlock(M, offset);
                    this._des3.encryptBlock(M, offset);
                },

                decryptBlock: function (M, offset) {
                    this._des3.decryptBlock(M, offset);
                    this._des2.encryptBlock(M, offset);
                    this._des1.decryptBlock(M, offset);
                },

                keySize: 192/32,

                ivSize: 64/32,

                blockSize: 64/32
            });

            /**
             * Shortcut functions to the cipher's object interface.
             *
             * @example
             *
             *     var ciphertext = CryptoJS.TripleDES.encrypt(message, key, cfg);
             *     var plaintext  = CryptoJS.TripleDES.decrypt(ciphertext, key, cfg);
             */
            C.TripleDES = BlockCipher._createHelper(TripleDES);
        }());


        return CryptoJS.TripleDES;

    }));

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(10), __webpack_require__(11), __webpack_require__(21), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var StreamCipher = C_lib.StreamCipher;
            var C_algo = C.algo;

            /**
             * RC4 stream cipher algorithm.
             */
            var RC4 = C_algo.RC4 = StreamCipher.extend({
                _doReset: function () {
                    // Shortcuts
                    var key = this._key;
                    var keyWords = key.words;
                    var keySigBytes = key.sigBytes;

                    // Init sbox
                    var S = this._S = [];
                    for (var i = 0; i < 256; i++) {
                        S[i] = i;
                    }

                    // Key setup
                    for (var i = 0, j = 0; i < 256; i++) {
                        var keyByteIndex = i % keySigBytes;
                        var keyByte = (keyWords[keyByteIndex >>> 2] >>> (24 - (keyByteIndex % 4) * 8)) & 0xff;

                        j = (j + S[i] + keyByte) % 256;

                        // Swap
                        var t = S[i];
                        S[i] = S[j];
                        S[j] = t;
                    }

                    // Counters
                    this._i = this._j = 0;
                },

                _doProcessBlock: function (M, offset) {
                    M[offset] ^= generateKeystreamWord.call(this);
                },

                keySize: 256/32,

                ivSize: 0
            });

            function generateKeystreamWord() {
                // Shortcuts
                var S = this._S;
                var i = this._i;
                var j = this._j;

                // Generate keystream word
                var keystreamWord = 0;
                for (var n = 0; n < 4; n++) {
                    i = (i + 1) % 256;
                    j = (j + S[i]) % 256;

                    // Swap
                    var t = S[i];
                    S[i] = S[j];
                    S[j] = t;

                    keystreamWord |= S[(S[i] + S[j]) % 256] << (24 - n * 8);
                }

                // Update counters
                this._i = i;
                this._j = j;

                return keystreamWord;
            }

            /**
             * Shortcut functions to the cipher's object interface.
             *
             * @example
             *
             *     var ciphertext = CryptoJS.RC4.encrypt(message, key, cfg);
             *     var plaintext  = CryptoJS.RC4.decrypt(ciphertext, key, cfg);
             */
            C.RC4 = StreamCipher._createHelper(RC4);

            /**
             * Modified RC4 stream cipher algorithm.
             */
            var RC4Drop = C_algo.RC4Drop = RC4.extend({
                /**
                 * Configuration options.
                 *
                 * @property {number} drop The number of keystream words to drop. Default 192
                 */
                cfg: RC4.cfg.extend({
                    drop: 192
                }),

                _doReset: function () {
                    RC4._doReset.call(this);

                    // Drop
                    for (var i = this.cfg.drop; i > 0; i--) {
                        generateKeystreamWord.call(this);
                    }
                }
            });

            /**
             * Shortcut functions to the cipher's object interface.
             *
             * @example
             *
             *     var ciphertext = CryptoJS.RC4Drop.encrypt(message, key, cfg);
             *     var plaintext  = CryptoJS.RC4Drop.decrypt(ciphertext, key, cfg);
             */
            C.RC4Drop = StreamCipher._createHelper(RC4Drop);
        }());


        return CryptoJS.RC4;

    }));

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(10), __webpack_require__(11), __webpack_require__(21), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var StreamCipher = C_lib.StreamCipher;
            var C_algo = C.algo;

            // Reusable objects
            var S  = [];
            var C_ = [];
            var G  = [];

            /**
             * Rabbit stream cipher algorithm
             */
            var Rabbit = C_algo.Rabbit = StreamCipher.extend({
                _doReset: function () {
                    // Shortcuts
                    var K = this._key.words;
                    var iv = this.cfg.iv;

                    // Swap endian
                    for (var i = 0; i < 4; i++) {
                        K[i] = (((K[i] << 8)  | (K[i] >>> 24)) & 0x00ff00ff) |
                               (((K[i] << 24) | (K[i] >>> 8))  & 0xff00ff00);
                    }

                    // Generate initial state values
                    var X = this._X = [
                        K[0], (K[3] << 16) | (K[2] >>> 16),
                        K[1], (K[0] << 16) | (K[3] >>> 16),
                        K[2], (K[1] << 16) | (K[0] >>> 16),
                        K[3], (K[2] << 16) | (K[1] >>> 16)
                    ];

                    // Generate initial counter values
                    var C = this._C = [
                        (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
                        (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
                        (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
                        (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
                    ];

                    // Carry bit
                    this._b = 0;

                    // Iterate the system four times
                    for (var i = 0; i < 4; i++) {
                        nextState.call(this);
                    }

                    // Modify the counters
                    for (var i = 0; i < 8; i++) {
                        C[i] ^= X[(i + 4) & 7];
                    }

                    // IV setup
                    if (iv) {
                        // Shortcuts
                        var IV = iv.words;
                        var IV_0 = IV[0];
                        var IV_1 = IV[1];

                        // Generate four subvectors
                        var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
                        var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
                        var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
                        var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

                        // Modify counter values
                        C[0] ^= i0;
                        C[1] ^= i1;
                        C[2] ^= i2;
                        C[3] ^= i3;
                        C[4] ^= i0;
                        C[5] ^= i1;
                        C[6] ^= i2;
                        C[7] ^= i3;

                        // Iterate the system four times
                        for (var i = 0; i < 4; i++) {
                            nextState.call(this);
                        }
                    }
                },

                _doProcessBlock: function (M, offset) {
                    // Shortcut
                    var X = this._X;

                    // Iterate the system
                    nextState.call(this);

                    // Generate four keystream words
                    S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
                    S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
                    S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
                    S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

                    for (var i = 0; i < 4; i++) {
                        // Swap endian
                        S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
                               (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

                        // Encrypt
                        M[offset + i] ^= S[i];
                    }
                },

                blockSize: 128/32,

                ivSize: 64/32
            });

            function nextState() {
                // Shortcuts
                var X = this._X;
                var C = this._C;

                // Save old counter values
                for (var i = 0; i < 8; i++) {
                    C_[i] = C[i];
                }

                // Calculate new counter values
                C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
                C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
                C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
                C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
                C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
                C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
                C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
                C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
                this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

                // Calculate the g-values
                for (var i = 0; i < 8; i++) {
                    var gx = X[i] + C[i];

                    // Construct high and low argument for squaring
                    var ga = gx & 0xffff;
                    var gb = gx >>> 16;

                    // Calculate high and low result of squaring
                    var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
                    var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

                    // High XOR low
                    G[i] = gh ^ gl;
                }

                // Calculate new state values
                X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
                X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
                X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
                X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
                X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
                X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
                X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
                X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
            }

            /**
             * Shortcut functions to the cipher's object interface.
             *
             * @example
             *
             *     var ciphertext = CryptoJS.Rabbit.encrypt(message, key, cfg);
             *     var plaintext  = CryptoJS.Rabbit.decrypt(ciphertext, key, cfg);
             */
            C.Rabbit = StreamCipher._createHelper(Rabbit);
        }());


        return CryptoJS.Rabbit;

    }));

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

    ;(function (root, factory, undef) {
        if (true) {
            // CommonJS
            module.exports = exports = factory(__webpack_require__(6), __webpack_require__(10), __webpack_require__(11), __webpack_require__(21), __webpack_require__(22));
        }
        else if (typeof define === "function" && define.amd) {
            // AMD
            define(["./core", "./enc-base64", "./md5", "./evpkdf", "./cipher-core"], factory);
        }
        else {
            // Global (browser)
            factory(root.CryptoJS);
        }
    }(this, function (CryptoJS) {

        (function () {
            // Shortcuts
            var C = CryptoJS;
            var C_lib = C.lib;
            var StreamCipher = C_lib.StreamCipher;
            var C_algo = C.algo;

            // Reusable objects
            var S  = [];
            var C_ = [];
            var G  = [];

            /**
             * Rabbit stream cipher algorithm.
             *
             * This is a legacy version that neglected to convert the key to little-endian.
             * This error doesn't affect the cipher's security,
             * but it does affect its compatibility with other implementations.
             */
            var RabbitLegacy = C_algo.RabbitLegacy = StreamCipher.extend({
                _doReset: function () {
                    // Shortcuts
                    var K = this._key.words;
                    var iv = this.cfg.iv;

                    // Generate initial state values
                    var X = this._X = [
                        K[0], (K[3] << 16) | (K[2] >>> 16),
                        K[1], (K[0] << 16) | (K[3] >>> 16),
                        K[2], (K[1] << 16) | (K[0] >>> 16),
                        K[3], (K[2] << 16) | (K[1] >>> 16)
                    ];

                    // Generate initial counter values
                    var C = this._C = [
                        (K[2] << 16) | (K[2] >>> 16), (K[0] & 0xffff0000) | (K[1] & 0x0000ffff),
                        (K[3] << 16) | (K[3] >>> 16), (K[1] & 0xffff0000) | (K[2] & 0x0000ffff),
                        (K[0] << 16) | (K[0] >>> 16), (K[2] & 0xffff0000) | (K[3] & 0x0000ffff),
                        (K[1] << 16) | (K[1] >>> 16), (K[3] & 0xffff0000) | (K[0] & 0x0000ffff)
                    ];

                    // Carry bit
                    this._b = 0;

                    // Iterate the system four times
                    for (var i = 0; i < 4; i++) {
                        nextState.call(this);
                    }

                    // Modify the counters
                    for (var i = 0; i < 8; i++) {
                        C[i] ^= X[(i + 4) & 7];
                    }

                    // IV setup
                    if (iv) {
                        // Shortcuts
                        var IV = iv.words;
                        var IV_0 = IV[0];
                        var IV_1 = IV[1];

                        // Generate four subvectors
                        var i0 = (((IV_0 << 8) | (IV_0 >>> 24)) & 0x00ff00ff) | (((IV_0 << 24) | (IV_0 >>> 8)) & 0xff00ff00);
                        var i2 = (((IV_1 << 8) | (IV_1 >>> 24)) & 0x00ff00ff) | (((IV_1 << 24) | (IV_1 >>> 8)) & 0xff00ff00);
                        var i1 = (i0 >>> 16) | (i2 & 0xffff0000);
                        var i3 = (i2 << 16)  | (i0 & 0x0000ffff);

                        // Modify counter values
                        C[0] ^= i0;
                        C[1] ^= i1;
                        C[2] ^= i2;
                        C[3] ^= i3;
                        C[4] ^= i0;
                        C[5] ^= i1;
                        C[6] ^= i2;
                        C[7] ^= i3;

                        // Iterate the system four times
                        for (var i = 0; i < 4; i++) {
                            nextState.call(this);
                        }
                    }
                },

                _doProcessBlock: function (M, offset) {
                    // Shortcut
                    var X = this._X;

                    // Iterate the system
                    nextState.call(this);

                    // Generate four keystream words
                    S[0] = X[0] ^ (X[5] >>> 16) ^ (X[3] << 16);
                    S[1] = X[2] ^ (X[7] >>> 16) ^ (X[5] << 16);
                    S[2] = X[4] ^ (X[1] >>> 16) ^ (X[7] << 16);
                    S[3] = X[6] ^ (X[3] >>> 16) ^ (X[1] << 16);

                    for (var i = 0; i < 4; i++) {
                        // Swap endian
                        S[i] = (((S[i] << 8)  | (S[i] >>> 24)) & 0x00ff00ff) |
                               (((S[i] << 24) | (S[i] >>> 8))  & 0xff00ff00);

                        // Encrypt
                        M[offset + i] ^= S[i];
                    }
                },

                blockSize: 128/32,

                ivSize: 64/32
            });

            function nextState() {
                // Shortcuts
                var X = this._X;
                var C = this._C;

                // Save old counter values
                for (var i = 0; i < 8; i++) {
                    C_[i] = C[i];
                }

                // Calculate new counter values
                C[0] = (C[0] + 0x4d34d34d + this._b) | 0;
                C[1] = (C[1] + 0xd34d34d3 + ((C[0] >>> 0) < (C_[0] >>> 0) ? 1 : 0)) | 0;
                C[2] = (C[2] + 0x34d34d34 + ((C[1] >>> 0) < (C_[1] >>> 0) ? 1 : 0)) | 0;
                C[3] = (C[3] + 0x4d34d34d + ((C[2] >>> 0) < (C_[2] >>> 0) ? 1 : 0)) | 0;
                C[4] = (C[4] + 0xd34d34d3 + ((C[3] >>> 0) < (C_[3] >>> 0) ? 1 : 0)) | 0;
                C[5] = (C[5] + 0x34d34d34 + ((C[4] >>> 0) < (C_[4] >>> 0) ? 1 : 0)) | 0;
                C[6] = (C[6] + 0x4d34d34d + ((C[5] >>> 0) < (C_[5] >>> 0) ? 1 : 0)) | 0;
                C[7] = (C[7] + 0xd34d34d3 + ((C[6] >>> 0) < (C_[6] >>> 0) ? 1 : 0)) | 0;
                this._b = (C[7] >>> 0) < (C_[7] >>> 0) ? 1 : 0;

                // Calculate the g-values
                for (var i = 0; i < 8; i++) {
                    var gx = X[i] + C[i];

                    // Construct high and low argument for squaring
                    var ga = gx & 0xffff;
                    var gb = gx >>> 16;

                    // Calculate high and low result of squaring
                    var gh = ((((ga * ga) >>> 17) + ga * gb) >>> 15) + gb * gb;
                    var gl = (((gx & 0xffff0000) * gx) | 0) + (((gx & 0x0000ffff) * gx) | 0);

                    // High XOR low
                    G[i] = gh ^ gl;
                }

                // Calculate new state values
                X[0] = (G[0] + ((G[7] << 16) | (G[7] >>> 16)) + ((G[6] << 16) | (G[6] >>> 16))) | 0;
                X[1] = (G[1] + ((G[0] << 8)  | (G[0] >>> 24)) + G[7]) | 0;
                X[2] = (G[2] + ((G[1] << 16) | (G[1] >>> 16)) + ((G[0] << 16) | (G[0] >>> 16))) | 0;
                X[3] = (G[3] + ((G[2] << 8)  | (G[2] >>> 24)) + G[1]) | 0;
                X[4] = (G[4] + ((G[3] << 16) | (G[3] >>> 16)) + ((G[2] << 16) | (G[2] >>> 16))) | 0;
                X[5] = (G[5] + ((G[4] << 8)  | (G[4] >>> 24)) + G[3]) | 0;
                X[6] = (G[6] + ((G[5] << 16) | (G[5] >>> 16)) + ((G[4] << 16) | (G[4] >>> 16))) | 0;
                X[7] = (G[7] + ((G[6] << 8)  | (G[6] >>> 24)) + G[5]) | 0;
            }

            /**
             * Shortcut functions to the cipher's object interface.
             *
             * @example
             *
             *     var ciphertext = CryptoJS.RabbitLegacy.encrypt(message, key, cfg);
             *     var plaintext  = CryptoJS.RabbitLegacy.decrypt(ciphertext, key, cfg);
             */
            C.RabbitLegacy = StreamCipher._createHelper(RabbitLegacy);
        }());


        return CryptoJS.RabbitLegacy;

    }));

/***/ }),
/* 39 */
/***/ (function(module, exports) {

    ;(function () {
        function Array_h(length) {
            this.array = length === undefined ? [] : new Array(length);
        }

        Array_h.prototype = {
            /**
             * 返回数组长度
             *
             * @return {Number} length [数组长度]
             */
            length: function () {
                return this.array.length;
            },

            at: function (index) {
                return this.array[index];
            },

            set: function (index, obj) {
                this.array[index] = obj;
            },

            /**
             * 向数组的末尾添加一个或多个元素，并返回新的长度。
             *
             * @param  {*} obj [description]
             * @return {Number} length [新数组的长度]
             */
            push: function (obj) {
                return this.array.push(obj);
            },

            /**
             * 返回数组中选定的元素
             *
             * @param  {Number} start [开始索引值]
             * @param  {Number} end [结束索引值]
             * @return {Array} newArray  [新的数组]
             */
            slice: function (start, end) {
                return this.array = this.array.slice(start, end);
            },

            concat: function (array) {
                this.array = this.array.concat(array);
            },

            remove: function (index, count) {
                count = count === undefined ? 1 : count;
                this.array.splice(index, count);
            },

            join: function (separator) {
                return this.array.join(separator);
            },

            clear: function () {
                this.array.length = 0;
            }
        };

        /**
         * 先进先出队列 (First Input First Output)
         *
         * 一种先进先出的数据缓存器
         */
        var Queue = function () {
            this._array_h = new Array_h();
        };

        Queue.prototype = {
            _index: 0,

            /**
             * 排队
             *
             * @param  {Object} obj [description]
             * @return {[type]}     [description]
             */
            push: function (obj) {
                this._array_h.push(obj);
            },

            /**
             * 出队
             *
             * @return {Object} [description]
             */
            pop: function () {
                var ret = null;
                if (this._array_h.length()) {
                    ret = this._array_h.at(this._index);
                    if (++this._index * 2 >= this._array_h.length()) {
                        this._array_h.slice(this._index);
                        this._index = 0;
                    }
                }
                return ret;
            },

            /**
             * 返回队列中头部(即最新添加的)的动态对象
             *
             * @return {Object} [description]
             */
            head: function () {
                var ret = null, len = this._array_h.length();
                if (len) {
                    ret = this._array_h.at(len - 1);
                }
                return ret;
            },

            /**
             * 返回队列中尾部(即最早添加的)的动态对象
             *
             * @return {Object} [description]
             */
            tail: function () {
                var ret = null, len = this._array_h.length();
                if (len) {
                    ret = this._array_h.at(this._index);
                }
                return ret;
            },

            /**
             * 返回数据队列长度
             *
             * @return {Number} [description]
             */
            length: function () {
                return this._array_h.length() - this._index;
            },

            /**
             * 队列是否为空
             *
             * @return {Boolean} [description]
             */
            empty: function () {
                return (this._array_h.length() === 0);
            },

            clear: function () {
                this._array_h.clear();
            }
        };
        exports.Queue = Queue;
    }());


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

    var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(global, module) {//     Underscore.js 1.9.1
    //     http://underscorejs.org
    //     (c) 2009-2018 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
    //     Underscore may be freely distributed under the MIT license.

    (function() {

      // Baseline setup
      // --------------

      // Establish the root object, `window` (`self`) in the browser, `global`
      // on the server, or `this` in some virtual machines. We use `self`
      // instead of `window` for `WebWorker` support.
      var root = typeof self == 'object' && self.self === self && self ||
                typeof global == 'object' && global.global === global && global ||
                this ||
                {};

      // Save the previous value of the `_` variable.
      var previousUnderscore = root._;

      // Save bytes in the minified (but not gzipped) version:
      var ArrayProto = Array.prototype, ObjProto = Object.prototype;
      var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

      // Create quick reference variables for speed access to core prototypes.
      var push = ArrayProto.push,
          slice = ArrayProto.slice,
          toString = ObjProto.toString,
          hasOwnProperty = ObjProto.hasOwnProperty;

      // All **ECMAScript 5** native function implementations that we hope to use
      // are declared here.
      var nativeIsArray = Array.isArray,
          nativeKeys = Object.keys,
          nativeCreate = Object.create;

      // Naked function reference for surrogate-prototype-swapping.
      var Ctor = function(){};

      // Create a safe reference to the Underscore object for use below.
      var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
      };

      // Export the Underscore object for **Node.js**, with
      // backwards-compatibility for their old module API. If we're in
      // the browser, add `_` as a global object.
      // (`nodeType` is checked to ensure that `module`
      // and `exports` are not HTML elements.)
      if (typeof exports != 'undefined' && !exports.nodeType) {
        if (typeof module != 'undefined' && !module.nodeType && module.exports) {
          exports = module.exports = _;
        }
        exports._ = _;
      } else {
        root._ = _;
      }

      // Current version.
      _.VERSION = '1.9.1';

      // Internal function that returns an efficient (for current engines) version
      // of the passed-in callback, to be repeatedly applied in other Underscore
      // functions.
      var optimizeCb = function(func, context, argCount) {
        if (context === void 0) return func;
        switch (argCount == null ? 3 : argCount) {
          case 1: return function(value) {
            return func.call(context, value);
          };
          // The 2-argument case is omitted because we’re not using it.
          case 3: return function(value, index, collection) {
            return func.call(context, value, index, collection);
          };
          case 4: return function(accumulator, value, index, collection) {
            return func.call(context, accumulator, value, index, collection);
          };
        }
        return function() {
          return func.apply(context, arguments);
        };
      };

      var builtinIteratee;

      // An internal function to generate callbacks that can be applied to each
      // element in a collection, returning the desired result — either `identity`,
      // an arbitrary callback, a property matcher, or a property accessor.
      var cb = function(value, context, argCount) {
        if (_.iteratee !== builtinIteratee) return _.iteratee(value, context);
        if (value == null) return _.identity;
        if (_.isFunction(value)) return optimizeCb(value, context, argCount);
        if (_.isObject(value) && !_.isArray(value)) return _.matcher(value);
        return _.property(value);
      };

      // External wrapper for our callback generator. Users may customize
      // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
      // This abstraction hides the internal-only argCount argument.
      _.iteratee = builtinIteratee = function(value, context) {
        return cb(value, context, Infinity);
      };

      // Some functions take a variable number of arguments, or a few expected
      // arguments at the beginning and then a variable number of values to operate
      // on. This helper accumulates all remaining arguments past the function’s
      // argument length (or an explicit `startIndex`), into an array that becomes
      // the last argument. Similar to ES6’s "rest parameter".
      var restArguments = function(func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function() {
          var length = Math.max(arguments.length - startIndex, 0),
              rest = Array(length),
              index = 0;
          for (; index < length; index++) {
            rest[index] = arguments[index + startIndex];
          }
          switch (startIndex) {
            case 0: return func.call(this, rest);
            case 1: return func.call(this, arguments[0], rest);
            case 2: return func.call(this, arguments[0], arguments[1], rest);
          }
          var args = Array(startIndex + 1);
          for (index = 0; index < startIndex; index++) {
            args[index] = arguments[index];
          }
          args[startIndex] = rest;
          return func.apply(this, args);
        };
      };

      // An internal function for creating a new object that inherits from another.
      var baseCreate = function(prototype) {
        if (!_.isObject(prototype)) return {};
        if (nativeCreate) return nativeCreate(prototype);
        Ctor.prototype = prototype;
        var result = new Ctor;
        Ctor.prototype = null;
        return result;
      };

      var shallowProperty = function(key) {
        return function(obj) {
          return obj == null ? void 0 : obj[key];
        };
      };

      var has = function(obj, path) {
        return obj != null && hasOwnProperty.call(obj, path);
      }

      var deepGet = function(obj, path) {
        var length = path.length;
        for (var i = 0; i < length; i++) {
          if (obj == null) return void 0;
          obj = obj[path[i]];
        }
        return length ? obj : void 0;
      };

      // Helper for collection methods to determine whether a collection
      // should be iterated as an array or as an object.
      // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
      // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
      var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
      var getLength = shallowProperty('length');
      var isArrayLike = function(collection) {
        var length = getLength(collection);
        return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
      };

      // Collection Functions
      // --------------------

      // The cornerstone, an `each` implementation, aka `forEach`.
      // Handles raw objects in addition to array-likes. Treats all
      // sparse array-likes as if they were dense.
      _.each = _.forEach = function(obj, iteratee, context) {
        iteratee = optimizeCb(iteratee, context);
        var i, length;
        if (isArrayLike(obj)) {
          for (i = 0, length = obj.length; i < length; i++) {
            iteratee(obj[i], i, obj);
          }
        } else {
          var keys = _.keys(obj);
          for (i = 0, length = keys.length; i < length; i++) {
            iteratee(obj[keys[i]], keys[i], obj);
          }
        }
        return obj;
      };

      // Return the results of applying the iteratee to each element.
      _.map = _.collect = function(obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length,
            results = Array(length);
        for (var index = 0; index < length; index++) {
          var currentKey = keys ? keys[index] : index;
          results[index] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
      };

      // Create a reducing function iterating left or right.
      var createReduce = function(dir) {
        // Wrap code that reassigns argument variables in a separate function than
        // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
        var reducer = function(obj, iteratee, memo, initial) {
          var keys = !isArrayLike(obj) && _.keys(obj),
              length = (keys || obj).length,
              index = dir > 0 ? 0 : length - 1;
          if (!initial) {
            memo = obj[keys ? keys[index] : index];
            index += dir;
          }
          for (; index >= 0 && index < length; index += dir) {
            var currentKey = keys ? keys[index] : index;
            memo = iteratee(memo, obj[currentKey], currentKey, obj);
          }
          return memo;
        };

        return function(obj, iteratee, memo, context) {
          var initial = arguments.length >= 3;
          return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
        };
      };

      // **Reduce** builds up a single result from a list of values, aka `inject`,
      // or `foldl`.
      _.reduce = _.foldl = _.inject = createReduce(1);

      // The right-associative version of reduce, also known as `foldr`.
      _.reduceRight = _.foldr = createReduce(-1);

      // Return the first value which passes a truth test. Aliased as `detect`.
      _.find = _.detect = function(obj, predicate, context) {
        var keyFinder = isArrayLike(obj) ? _.findIndex : _.findKey;
        var key = keyFinder(obj, predicate, context);
        if (key !== void 0 && key !== -1) return obj[key];
      };

      // Return all the elements that pass a truth test.
      // Aliased as `select`.
      _.filter = _.select = function(obj, predicate, context) {
        var results = [];
        predicate = cb(predicate, context);
        _.each(obj, function(value, index, list) {
          if (predicate(value, index, list)) results.push(value);
        });
        return results;
      };

      // Return all the elements for which a truth test fails.
      _.reject = function(obj, predicate, context) {
        return _.filter(obj, _.negate(cb(predicate)), context);
      };

      // Determine whether all of the elements match a truth test.
      // Aliased as `all`.
      _.every = _.all = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
          var currentKey = keys ? keys[index] : index;
          if (!predicate(obj[currentKey], currentKey, obj)) return false;
        }
        return true;
      };

      // Determine if at least one element in the object matches a truth test.
      // Aliased as `any`.
      _.some = _.any = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = !isArrayLike(obj) && _.keys(obj),
            length = (keys || obj).length;
        for (var index = 0; index < length; index++) {
          var currentKey = keys ? keys[index] : index;
          if (predicate(obj[currentKey], currentKey, obj)) return true;
        }
        return false;
      };

      // Determine if the array or object contains a given item (using `===`).
      // Aliased as `includes` and `include`.
      _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
        if (!isArrayLike(obj)) obj = _.values(obj);
        if (typeof fromIndex != 'number' || guard) fromIndex = 0;
        return _.indexOf(obj, item, fromIndex) >= 0;
      };

      // Invoke a method (with arguments) on every item in a collection.
      _.invoke = restArguments(function(obj, path, args) {
        var contextPath, func;
        if (_.isFunction(path)) {
          func = path;
        } else if (_.isArray(path)) {
          contextPath = path.slice(0, -1);
          path = path[path.length - 1];
        }
        return _.map(obj, function(context) {
          var method = func;
          if (!method) {
            if (contextPath && contextPath.length) {
              context = deepGet(context, contextPath);
            }
            if (context == null) return void 0;
            method = context[path];
          }
          return method == null ? method : method.apply(context, args);
        });
      });

      // Convenience version of a common use case of `map`: fetching a property.
      _.pluck = function(obj, key) {
        return _.map(obj, _.property(key));
      };

      // Convenience version of a common use case of `filter`: selecting only objects
      // containing specific `key:value` pairs.
      _.where = function(obj, attrs) {
        return _.filter(obj, _.matcher(attrs));
      };

      // Convenience version of a common use case of `find`: getting the first object
      // containing specific `key:value` pairs.
      _.findWhere = function(obj, attrs) {
        return _.find(obj, _.matcher(attrs));
      };

      // Return the maximum element (or element-based computation).
      _.max = function(obj, iteratee, context) {
        var result = -Infinity, lastComputed = -Infinity,
            value, computed;
        if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
          obj = isArrayLike(obj) ? obj : _.values(obj);
          for (var i = 0, length = obj.length; i < length; i++) {
            value = obj[i];
            if (value != null && value > result) {
              result = value;
            }
          }
        } else {
          iteratee = cb(iteratee, context);
          _.each(obj, function(v, index, list) {
            computed = iteratee(v, index, list);
            if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
              result = v;
              lastComputed = computed;
            }
          });
        }
        return result;
      };

      // Return the minimum element (or element-based computation).
      _.min = function(obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity,
            value, computed;
        if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
          obj = isArrayLike(obj) ? obj : _.values(obj);
          for (var i = 0, length = obj.length; i < length; i++) {
            value = obj[i];
            if (value != null && value < result) {
              result = value;
            }
          }
        } else {
          iteratee = cb(iteratee, context);
          _.each(obj, function(v, index, list) {
            computed = iteratee(v, index, list);
            if (computed < lastComputed || computed === Infinity && result === Infinity) {
              result = v;
              lastComputed = computed;
            }
          });
        }
        return result;
      };

      // Shuffle a collection.
      _.shuffle = function(obj) {
        return _.sample(obj, Infinity);
      };

      // Sample **n** random values from a collection using the modern version of the
      // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
      // If **n** is not specified, returns a single random element.
      // The internal `guard` argument allows it to work with `map`.
      _.sample = function(obj, n, guard) {
        if (n == null || guard) {
          if (!isArrayLike(obj)) obj = _.values(obj);
          return obj[_.random(obj.length - 1)];
        }
        var sample = isArrayLike(obj) ? _.clone(obj) : _.values(obj);
        var length = getLength(sample);
        n = Math.max(Math.min(n, length), 0);
        var last = length - 1;
        for (var index = 0; index < n; index++) {
          var rand = _.random(index, last);
          var temp = sample[index];
          sample[index] = sample[rand];
          sample[rand] = temp;
        }
        return sample.slice(0, n);
      };

      // Sort the object's values by a criterion produced by an iteratee.
      _.sortBy = function(obj, iteratee, context) {
        var index = 0;
        iteratee = cb(iteratee, context);
        return _.pluck(_.map(obj, function(value, key, list) {
          return {
            value: value,
            index: index++,
            criteria: iteratee(value, key, list)
          };
        }).sort(function(left, right) {
          var a = left.criteria;
          var b = right.criteria;
          if (a !== b) {
            if (a > b || a === void 0) return 1;
            if (a < b || b === void 0) return -1;
          }
          return left.index - right.index;
        }), 'value');
      };

      // An internal function used for aggregate "group by" operations.
      var group = function(behavior, partition) {
        return function(obj, iteratee, context) {
          var result = partition ? [[], []] : {};
          iteratee = cb(iteratee, context);
          _.each(obj, function(value, index) {
            var key = iteratee(value, index, obj);
            behavior(result, value, key);
          });
          return result;
        };
      };

      // Groups the object's values by a criterion. Pass either a string attribute
      // to group by, or a function that returns the criterion.
      _.groupBy = group(function(result, value, key) {
        if (has(result, key)) result[key].push(value); else result[key] = [value];
      });

      // Indexes the object's values by a criterion, similar to `groupBy`, but for
      // when you know that your index values will be unique.
      _.indexBy = group(function(result, value, key) {
        result[key] = value;
      });

      // Counts instances of an object that group by a certain criterion. Pass
      // either a string attribute to count by, or a function that returns the
      // criterion.
      _.countBy = group(function(result, value, key) {
        if (has(result, key)) result[key]++; else result[key] = 1;
      });

      var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
      // Safely create a real, live array from anything iterable.
      _.toArray = function(obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (_.isString(obj)) {
          // Keep surrogate pair characters together
          return obj.match(reStrSymbol);
        }
        if (isArrayLike(obj)) return _.map(obj, _.identity);
        return _.values(obj);
      };

      // Return the number of elements in an object.
      _.size = function(obj) {
        if (obj == null) return 0;
        return isArrayLike(obj) ? obj.length : _.keys(obj).length;
      };

      // Split a collection into two arrays: one whose elements all satisfy the given
      // predicate, and one whose elements all do not satisfy the predicate.
      _.partition = group(function(result, value, pass) {
        result[pass ? 0 : 1].push(value);
      }, true);

      // Array Functions
      // ---------------

      // Get the first element of an array. Passing **n** will return the first N
      // values in the array. Aliased as `head` and `take`. The **guard** check
      // allows it to work with `_.map`.
      _.first = _.head = _.take = function(array, n, guard) {
        if (array == null || array.length < 1) return n == null ? void 0 : [];
        if (n == null || guard) return array[0];
        return _.initial(array, array.length - n);
      };

      // Returns everything but the last entry of the array. Especially useful on
      // the arguments object. Passing **n** will return all the values in
      // the array, excluding the last N.
      _.initial = function(array, n, guard) {
        return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
      };

      // Get the last element of an array. Passing **n** will return the last N
      // values in the array.
      _.last = function(array, n, guard) {
        if (array == null || array.length < 1) return n == null ? void 0 : [];
        if (n == null || guard) return array[array.length - 1];
        return _.rest(array, Math.max(0, array.length - n));
      };

      // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
      // Especially useful on the arguments object. Passing an **n** will return
      // the rest N values in the array.
      _.rest = _.tail = _.drop = function(array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
      };

      // Trim out all falsy values from an array.
      _.compact = function(array) {
        return _.filter(array, Boolean);
      };

      // Internal implementation of a recursive `flatten` function.
      var flatten = function(input, shallow, strict, output) {
        output = output || [];
        var idx = output.length;
        for (var i = 0, length = getLength(input); i < length; i++) {
          var value = input[i];
          if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
            // Flatten current level of array or arguments object.
            if (shallow) {
              var j = 0, len = value.length;
              while (j < len) output[idx++] = value[j++];
            } else {
              flatten(value, shallow, strict, output);
              idx = output.length;
            }
          } else if (!strict) {
            output[idx++] = value;
          }
        }
        return output;
      };

      // Flatten out an array, either recursively (by default), or just one level.
      _.flatten = function(array, shallow) {
        return flatten(array, shallow, false);
      };

      // Return a version of the array that does not contain the specified value(s).
      _.without = restArguments(function(array, otherArrays) {
        return _.difference(array, otherArrays);
      });

      // Produce a duplicate-free version of the array. If the array has already
      // been sorted, you have the option of using a faster algorithm.
      // The faster algorithm will not work with an iteratee if the iteratee
      // is not a one-to-one function, so providing an iteratee will disable
      // the faster algorithm.
      // Aliased as `unique`.
      _.uniq = _.unique = function(array, isSorted, iteratee, context) {
        if (!_.isBoolean(isSorted)) {
          context = iteratee;
          iteratee = isSorted;
          isSorted = false;
        }
        if (iteratee != null) iteratee = cb(iteratee, context);
        var result = [];
        var seen = [];
        for (var i = 0, length = getLength(array); i < length; i++) {
          var value = array[i],
              computed = iteratee ? iteratee(value, i, array) : value;
          if (isSorted && !iteratee) {
            if (!i || seen !== computed) result.push(value);
            seen = computed;
          } else if (iteratee) {
            if (!_.contains(seen, computed)) {
              seen.push(computed);
              result.push(value);
            }
          } else if (!_.contains(result, value)) {
            result.push(value);
          }
        }
        return result;
      };

      // Produce an array that contains the union: each distinct element from all of
      // the passed-in arrays.
      _.union = restArguments(function(arrays) {
        return _.uniq(flatten(arrays, true, true));
      });

      // Produce an array that contains every item shared between all the
      // passed-in arrays.
      _.intersection = function(array) {
        var result = [];
        var argsLength = arguments.length;
        for (var i = 0, length = getLength(array); i < length; i++) {
          var item = array[i];
          if (_.contains(result, item)) continue;
          var j;
          for (j = 1; j < argsLength; j++) {
            if (!_.contains(arguments[j], item)) break;
          }
          if (j === argsLength) result.push(item);
        }
        return result;
      };

      // Take the difference between one array and a number of other arrays.
      // Only the elements present in just the first array will remain.
      _.difference = restArguments(function(array, rest) {
        rest = flatten(rest, true, true);
        return _.filter(array, function(value){
          return !_.contains(rest, value);
        });
      });

      // Complement of _.zip. Unzip accepts an array of arrays and groups
      // each array's elements on shared indices.
      _.unzip = function(array) {
        var length = array && _.max(array, getLength).length || 0;
        var result = Array(length);

        for (var index = 0; index < length; index++) {
          result[index] = _.pluck(array, index);
        }
        return result;
      };

      // Zip together multiple lists into a single array -- elements that share
      // an index go together.
      _.zip = restArguments(_.unzip);

      // Converts lists into objects. Pass either a single array of `[key, value]`
      // pairs, or two parallel arrays of the same length -- one of keys, and one of
      // the corresponding values. Passing by pairs is the reverse of _.pairs.
      _.object = function(list, values) {
        var result = {};
        for (var i = 0, length = getLength(list); i < length; i++) {
          if (values) {
            result[list[i]] = values[i];
          } else {
            result[list[i][0]] = list[i][1];
          }
        }
        return result;
      };

      // Generator function to create the findIndex and findLastIndex functions.
      var createPredicateIndexFinder = function(dir) {
        return function(array, predicate, context) {
          predicate = cb(predicate, context);
          var length = getLength(array);
          var index = dir > 0 ? 0 : length - 1;
          for (; index >= 0 && index < length; index += dir) {
            if (predicate(array[index], index, array)) return index;
          }
          return -1;
        };
      };

      // Returns the first index on an array-like that passes a predicate test.
      _.findIndex = createPredicateIndexFinder(1);
      _.findLastIndex = createPredicateIndexFinder(-1);

      // Use a comparator function to figure out the smallest index at which
      // an object should be inserted so as to maintain order. Uses binary search.
      _.sortedIndex = function(array, obj, iteratee, context) {
        iteratee = cb(iteratee, context, 1);
        var value = iteratee(obj);
        var low = 0, high = getLength(array);
        while (low < high) {
          var mid = Math.floor((low + high) / 2);
          if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
        }
        return low;
      };

      // Generator function to create the indexOf and lastIndexOf functions.
      var createIndexFinder = function(dir, predicateFind, sortedIndex) {
        return function(array, item, idx) {
          var i = 0, length = getLength(array);
          if (typeof idx == 'number') {
            if (dir > 0) {
              i = idx >= 0 ? idx : Math.max(idx + length, i);
            } else {
              length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
            }
          } else if (sortedIndex && idx && length) {
            idx = sortedIndex(array, item);
            return array[idx] === item ? idx : -1;
          }
          if (item !== item) {
            idx = predicateFind(slice.call(array, i, length), _.isNaN);
            return idx >= 0 ? idx + i : -1;
          }
          for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
            if (array[idx] === item) return idx;
          }
          return -1;
        };
      };

      // Return the position of the first occurrence of an item in an array,
      // or -1 if the item is not included in the array.
      // If the array is large and already in sort order, pass `true`
      // for **isSorted** to use binary search.
      _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
      _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

      // Generate an integer Array containing an arithmetic progression. A port of
      // the native Python `range()` function. See
      // [the Python documentation](http://docs.python.org/library/functions.html#range).
      _.range = function(start, stop, step) {
        if (stop == null) {
          stop = start || 0;
          start = 0;
        }
        if (!step) {
          step = stop < start ? -1 : 1;
        }

        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var range = Array(length);

        for (var idx = 0; idx < length; idx++, start += step) {
          range[idx] = start;
        }

        return range;
      };

      // Chunk a single array into multiple arrays, each containing `count` or fewer
      // items.
      _.chunk = function(array, count) {
        if (count == null || count < 1) return [];
        var result = [];
        var i = 0, length = array.length;
        while (i < length) {
          result.push(slice.call(array, i, i += count));
        }
        return result;
      };

      // Function (ahem) Functions
      // ------------------

      // Determines whether to execute a function as a constructor
      // or a normal function with the provided arguments.
      var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
        if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
        var self = baseCreate(sourceFunc.prototype);
        var result = sourceFunc.apply(self, args);
        if (_.isObject(result)) return result;
        return self;
      };

      // Create a function bound to a given object (assigning `this`, and arguments,
      // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
      // available.
      _.bind = restArguments(function(func, context, args) {
        if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
        var bound = restArguments(function(callArgs) {
          return executeBound(func, bound, context, this, args.concat(callArgs));
        });
        return bound;
      });

      // Partially apply a function by creating a version that has had some of its
      // arguments pre-filled, without changing its dynamic `this` context. _ acts
      // as a placeholder by default, allowing any combination of arguments to be
      // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
      _.partial = restArguments(function(func, boundArgs) {
        var placeholder = _.partial.placeholder;
        var bound = function() {
          var position = 0, length = boundArgs.length;
          var args = Array(length);
          for (var i = 0; i < length; i++) {
            args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
          }
          while (position < arguments.length) args.push(arguments[position++]);
          return executeBound(func, bound, this, this, args);
        };
        return bound;
      });

      _.partial.placeholder = _;

      // Bind a number of an object's methods to that object. Remaining arguments
      // are the method names to be bound. Useful for ensuring that all callbacks
      // defined on an object belong to it.
      _.bindAll = restArguments(function(obj, keys) {
        keys = flatten(keys, false, false);
        var index = keys.length;
        if (index < 1) throw new Error('bindAll must be passed function names');
        while (index--) {
          var key = keys[index];
          obj[key] = _.bind(obj[key], obj);
        }
      });

      // Memoize an expensive function by storing its results.
      _.memoize = function(func, hasher) {
        var memoize = function(key) {
          var cache = memoize.cache;
          var address = '' + (hasher ? hasher.apply(this, arguments) : key);
          if (!has(cache, address)) cache[address] = func.apply(this, arguments);
          return cache[address];
        };
        memoize.cache = {};
        return memoize;
      };

      // Delays a function for the given number of milliseconds, and then calls
      // it with the arguments supplied.
      _.delay = restArguments(function(func, wait, args) {
        return setTimeout(function() {
          return func.apply(null, args);
        }, wait);
      });

      // Defers a function, scheduling it to run after the current call stack has
      // cleared.
      _.defer = _.partial(_.delay, _, 1);

      // Returns a function, that, when invoked, will only be triggered at most once
      // during a given window of time. Normally, the throttled function will run
      // as much as it can, without ever going more than once per `wait` duration;
      // but if you'd like to disable the execution on the leading edge, pass
      // `{leading: false}`. To disable execution on the trailing edge, ditto.
      _.throttle = function(func, wait, options) {
        var timeout, context, args, result;
        var previous = 0;
        if (!options) options = {};

        var later = function() {
          previous = options.leading === false ? 0 : _.now();
          timeout = null;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        };

        var throttled = function() {
          var now = _.now();
          if (!previous && options.leading === false) previous = now;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0 || remaining > wait) {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };

        throttled.cancel = function() {
          clearTimeout(timeout);
          previous = 0;
          timeout = context = args = null;
        };

        return throttled;
      };

      // Returns a function, that, as long as it continues to be invoked, will not
      // be triggered. The function will be called after it stops being called for
      // N milliseconds. If `immediate` is passed, trigger the function on the
      // leading edge, instead of the trailing.
      _.debounce = function(func, wait, immediate) {
        var timeout, result;

        var later = function(context, args) {
          timeout = null;
          if (args) result = func.apply(context, args);
        };

        var debounced = restArguments(function(args) {
          if (timeout) clearTimeout(timeout);
          if (immediate) {
            var callNow = !timeout;
            timeout = setTimeout(later, wait);
            if (callNow) result = func.apply(this, args);
          } else {
            timeout = _.delay(later, wait, this, args);
          }

          return result;
        });

        debounced.cancel = function() {
          clearTimeout(timeout);
          timeout = null;
        };

        return debounced;
      };

      // Returns the first function passed as an argument to the second,
      // allowing you to adjust arguments, run code before and after, and
      // conditionally execute the original function.
      _.wrap = function(func, wrapper) {
        return _.partial(wrapper, func);
      };

      // Returns a negated version of the passed-in predicate.
      _.negate = function(predicate) {
        return function() {
          return !predicate.apply(this, arguments);
        };
      };

      // Returns a function that is the composition of a list of functions, each
      // consuming the return value of the function that follows.
      _.compose = function() {
        var args = arguments;
        var start = args.length - 1;
        return function() {
          var i = start;
          var result = args[start].apply(this, arguments);
          while (i--) result = args[i].call(this, result);
          return result;
        };
      };

      // Returns a function that will only be executed on and after the Nth call.
      _.after = function(times, func) {
        return function() {
          if (--times < 1) {
            return func.apply(this, arguments);
          }
        };
      };

      // Returns a function that will only be executed up to (but not including) the Nth call.
      _.before = function(times, func) {
        var memo;
        return function() {
          if (--times > 0) {
            memo = func.apply(this, arguments);
          }
          if (times <= 1) func = null;
          return memo;
        };
      };

      // Returns a function that will be executed at most one time, no matter how
      // often you call it. Useful for lazy initialization.
      _.once = _.partial(_.before, 2);

      _.restArguments = restArguments;

      // Object Functions
      // ----------------

      // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
      var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
      var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
        'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

      var collectNonEnumProps = function(obj, keys) {
        var nonEnumIdx = nonEnumerableProps.length;
        var constructor = obj.constructor;
        var proto = _.isFunction(constructor) && constructor.prototype || ObjProto;

        // Constructor is a special case.
        var prop = 'constructor';
        if (has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

        while (nonEnumIdx--) {
          prop = nonEnumerableProps[nonEnumIdx];
          if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
            keys.push(prop);
          }
        }
      };

      // Retrieve the names of an object's own properties.
      // Delegates to **ECMAScript 5**'s native `Object.keys`.
      _.keys = function(obj) {
        if (!_.isObject(obj)) return [];
        if (nativeKeys) return nativeKeys(obj);
        var keys = [];
        for (var key in obj) if (has(obj, key)) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
      };

      // Retrieve all the property names of an object.
      _.allKeys = function(obj) {
        if (!_.isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        // Ahem, IE < 9.
        if (hasEnumBug) collectNonEnumProps(obj, keys);
        return keys;
      };

      // Retrieve the values of an object's properties.
      _.values = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
          values[i] = obj[keys[i]];
        }
        return values;
      };

      // Returns the results of applying the iteratee to each element of the object.
      // In contrast to _.map it returns an object.
      _.mapObject = function(obj, iteratee, context) {
        iteratee = cb(iteratee, context);
        var keys = _.keys(obj),
            length = keys.length,
            results = {};
        for (var index = 0; index < length; index++) {
          var currentKey = keys[index];
          results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
        }
        return results;
      };

      // Convert an object into a list of `[key, value]` pairs.
      // The opposite of _.object.
      _.pairs = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = Array(length);
        for (var i = 0; i < length; i++) {
          pairs[i] = [keys[i], obj[keys[i]]];
        }
        return pairs;
      };

      // Invert the keys and values of an object. The values must be serializable.
      _.invert = function(obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
          result[obj[keys[i]]] = keys[i];
        }
        return result;
      };

      // Return a sorted list of the function names available on the object.
      // Aliased as `methods`.
      _.functions = _.methods = function(obj) {
        var names = [];
        for (var key in obj) {
          if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
      };

      // An internal function for creating assigner functions.
      var createAssigner = function(keysFunc, defaults) {
        return function(obj) {
          var length = arguments.length;
          if (defaults) obj = Object(obj);
          if (length < 2 || obj == null) return obj;
          for (var index = 1; index < length; index++) {
            var source = arguments[index],
                keys = keysFunc(source),
                l = keys.length;
            for (var i = 0; i < l; i++) {
              var key = keys[i];
              if (!defaults || obj[key] === void 0) obj[key] = source[key];
            }
          }
          return obj;
        };
      };

      // Extend a given object with all the properties in passed-in object(s).
      _.extend = createAssigner(_.allKeys);

      // Assigns a given object with all the own properties in the passed-in object(s).
      // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
      _.extendOwn = _.assign = createAssigner(_.keys);

      // Returns the first key on an object that passes a predicate test.
      _.findKey = function(obj, predicate, context) {
        predicate = cb(predicate, context);
        var keys = _.keys(obj), key;
        for (var i = 0, length = keys.length; i < length; i++) {
          key = keys[i];
          if (predicate(obj[key], key, obj)) return key;
        }
      };

      // Internal pick helper function to determine if `obj` has key `key`.
      var keyInObj = function(value, key, obj) {
        return key in obj;
      };

      // Return a copy of the object only containing the whitelisted properties.
      _.pick = restArguments(function(obj, keys) {
        var result = {}, iteratee = keys[0];
        if (obj == null) return result;
        if (_.isFunction(iteratee)) {
          if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
          keys = _.allKeys(obj);
        } else {
          iteratee = keyInObj;
          keys = flatten(keys, false, false);
          obj = Object(obj);
        }
        for (var i = 0, length = keys.length; i < length; i++) {
          var key = keys[i];
          var value = obj[key];
          if (iteratee(value, key, obj)) result[key] = value;
        }
        return result;
      });

      // Return a copy of the object without the blacklisted properties.
      _.omit = restArguments(function(obj, keys) {
        var iteratee = keys[0], context;
        if (_.isFunction(iteratee)) {
          iteratee = _.negate(iteratee);
          if (keys.length > 1) context = keys[1];
        } else {
          keys = _.map(flatten(keys, false, false), String);
          iteratee = function(value, key) {
            return !_.contains(keys, key);
          };
        }
        return _.pick(obj, iteratee, context);
      });

      // Fill in a given object with default properties.
      _.defaults = createAssigner(_.allKeys, true);

      // Creates an object that inherits from the given prototype object.
      // If additional properties are provided then they will be added to the
      // created object.
      _.create = function(prototype, props) {
        var result = baseCreate(prototype);
        if (props) _.extendOwn(result, props);
        return result;
      };

      // Create a (shallow-cloned) duplicate of an object.
      _.clone = function(obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
      };

      // Invokes interceptor with the obj, and then returns obj.
      // The primary purpose of this method is to "tap into" a method chain, in
      // order to perform operations on intermediate results within the chain.
      _.tap = function(obj, interceptor) {
        interceptor(obj);
        return obj;
      };

      // Returns whether an object has a given set of `key:value` pairs.
      _.isMatch = function(object, attrs) {
        var keys = _.keys(attrs), length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
          var key = keys[i];
          if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
      };


      // Internal recursive comparison function for `isEqual`.
      var eq, deepEq;
      eq = function(a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // `null` or `undefined` only equal to itself (strict comparison).
        if (a == null || b == null) return false;
        // `NaN`s are equivalent, but non-reflexive.
        if (a !== a) return b !== b;
        // Exhaust primitive checks
        var type = typeof a;
        if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
        return deepEq(a, b, aStack, bStack);
      };

      // Internal recursive comparison function for `isEqual`.
      deepEq = function(a, b, aStack, bStack) {
        // Unwrap any wrapped objects.
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
          // Strings, numbers, regular expressions, dates, and booleans are compared by value.
          case '[object RegExp]':
          // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
          case '[object String]':
            // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
            // equivalent to `new String("5")`.
            return '' + a === '' + b;
          case '[object Number]':
            // `NaN`s are equivalent, but non-reflexive.
            // Object(NaN) is equivalent to NaN.
            if (+a !== +a) return +b !== +b;
            // An `egal` comparison is performed for other numeric values.
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
          case '[object Date]':
          case '[object Boolean]':
            // Coerce dates and booleans to numeric primitive values. Dates are compared by their
            // millisecond representations. Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;
          case '[object Symbol]':
            return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
        }

        var areArrays = className === '[object Array]';
        if (!areArrays) {
          if (typeof a != 'object' || typeof b != 'object') return false;

          // Objects with different constructors are not equivalent, but `Object`s or `Array`s
          // from different frames are.
          var aCtor = a.constructor, bCtor = b.constructor;
          if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                                   _.isFunction(bCtor) && bCtor instanceof bCtor)
                              && ('constructor' in a && 'constructor' in b)) {
            return false;
          }
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

        // Initializing stack of traversed objects.
        // It's done here since we only need them for objects and arrays comparison.
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
          // Linear search. Performance is inversely proportional to the number of
          // unique nested structures.
          if (aStack[length] === a) return bStack[length] === b;
        }

        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);

        // Recursively compare objects and arrays.
        if (areArrays) {
          // Compare array lengths to determine if a deep comparison is necessary.
          length = a.length;
          if (length !== b.length) return false;
          // Deep compare the contents, ignoring non-numeric properties.
          while (length--) {
            if (!eq(a[length], b[length], aStack, bStack)) return false;
          }
        } else {
          // Deep compare objects.
          var keys = _.keys(a), key;
          length = keys.length;
          // Ensure that both objects contain the same number of properties before comparing deep equality.
          if (_.keys(b).length !== length) return false;
          while (length--) {
            // Deep compare each member
            key = keys[length];
            if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
          }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
      };

      // Perform a deep comparison to check if two objects are equal.
      _.isEqual = function(a, b) {
        return eq(a, b);
      };

      // Is a given array, string, or object empty?
      // An "empty" object has no enumerable own-properties.
      _.isEmpty = function(obj) {
        if (obj == null) return true;
        if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
        return _.keys(obj).length === 0;
      };

      // Is a given value a DOM element?
      _.isElement = function(obj) {
        return !!(obj && obj.nodeType === 1);
      };

      // Is a given value an array?
      // Delegates to ECMA5's native Array.isArray
      _.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) === '[object Array]';
      };

      // Is a given variable an object?
      _.isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
      };

      // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError, isMap, isWeakMap, isSet, isWeakSet.
      _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function(name) {
        _['is' + name] = function(obj) {
          return toString.call(obj) === '[object ' + name + ']';
        };
      });

      // Define a fallback version of the method in browsers (ahem, IE < 9), where
      // there isn't any inspectable "Arguments" type.
      if (!_.isArguments(arguments)) {
        _.isArguments = function(obj) {
          return has(obj, 'callee');
        };
      }

      // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
      // IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
      var nodelist = root.document && root.document.childNodes;
      if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
        _.isFunction = function(obj) {
          return typeof obj == 'function' || false;
        };
      }

      // Is a given object a finite number?
      _.isFinite = function(obj) {
        return !_.isSymbol(obj) && isFinite(obj) && !isNaN(parseFloat(obj));
      };

      // Is the given value `NaN`?
      _.isNaN = function(obj) {
        return _.isNumber(obj) && isNaN(obj);
      };

      // Is a given value a boolean?
      _.isBoolean = function(obj) {
        return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
      };

      // Is a given value equal to null?
      _.isNull = function(obj) {
        return obj === null;
      };

      // Is a given variable undefined?
      _.isUndefined = function(obj) {
        return obj === void 0;
      };

      // Shortcut function for checking if an object has a given property directly
      // on itself (in other words, not on a prototype).
      _.has = function(obj, path) {
        if (!_.isArray(path)) {
          return has(obj, path);
        }
        var length = path.length;
        for (var i = 0; i < length; i++) {
          var key = path[i];
          if (obj == null || !hasOwnProperty.call(obj, key)) {
            return false;
          }
          obj = obj[key];
        }
        return !!length;
      };

      // Utility Functions
      // -----------------

      // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
      // previous owner. Returns a reference to the Underscore object.
      _.noConflict = function() {
        root._ = previousUnderscore;
        return this;
      };

      // Keep the identity function around for default iteratees.
      _.identity = function(value) {
        return value;
      };

      // Predicate-generating functions. Often useful outside of Underscore.
      _.constant = function(value) {
        return function() {
          return value;
        };
      };

      _.noop = function(){};

      // Creates a function that, when passed an object, will traverse that object’s
      // properties down the given `path`, specified as an array of keys or indexes.
      _.property = function(path) {
        if (!_.isArray(path)) {
          return shallowProperty(path);
        }
        return function(obj) {
          return deepGet(obj, path);
        };
      };

      // Generates a function for a given object that returns a given property.
      _.propertyOf = function(obj) {
        if (obj == null) {
          return function(){};
        }
        return function(path) {
          return !_.isArray(path) ? obj[path] : deepGet(obj, path);
        };
      };

      // Returns a predicate for checking whether an object has a given set of
      // `key:value` pairs.
      _.matcher = _.matches = function(attrs) {
        attrs = _.extendOwn({}, attrs);
        return function(obj) {
          return _.isMatch(obj, attrs);
        };
      };

      // Run a function **n** times.
      _.times = function(n, iteratee, context) {
        var accum = Array(Math.max(0, n));
        iteratee = optimizeCb(iteratee, context, 1);
        for (var i = 0; i < n; i++) accum[i] = iteratee(i);
        return accum;
      };

      // Return a random integer between min and max (inclusive).
      _.random = function(min, max) {
        if (max == null) {
          max = min;
          min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
      };

      // A (possibly faster) way to get the current timestamp as an integer.
      _.now = Date.now || function() {
        return new Date().getTime();
      };

      // List of HTML entities for escaping.
      var escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '`': '&#x60;'
      };
      var unescapeMap = _.invert(escapeMap);

      // Functions for escaping and unescaping strings to/from HTML interpolation.
      var createEscaper = function(map) {
        var escaper = function(match) {
          return map[match];
        };
        // Regexes for identifying a key that needs to be escaped.
        var source = '(?:' + _.keys(map).join('|') + ')';
        var testRegexp = RegExp(source);
        var replaceRegexp = RegExp(source, 'g');
        return function(string) {
          string = string == null ? '' : '' + string;
          return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
        };
      };
      _.escape = createEscaper(escapeMap);
      _.unescape = createEscaper(unescapeMap);

      // Traverses the children of `obj` along `path`. If a child is a function, it
      // is invoked with its parent as context. Returns the value of the final
      // child, or `fallback` if any child is undefined.
      _.result = function(obj, path, fallback) {
        if (!_.isArray(path)) path = [path];
        var length = path.length;
        if (!length) {
          return _.isFunction(fallback) ? fallback.call(obj) : fallback;
        }
        for (var i = 0; i < length; i++) {
          var prop = obj == null ? void 0 : obj[path[i]];
          if (prop === void 0) {
            prop = fallback;
            i = length; // Ensure we don't continue iterating.
          }
          obj = _.isFunction(prop) ? prop.call(obj) : prop;
        }
        return obj;
      };

      // Generate a unique integer id (unique within the entire client session).
      // Useful for temporary DOM ids.
      var idCounter = 0;
      _.uniqueId = function(prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
      };

      // By default, Underscore uses ERB-style template delimiters, change the
      // following template settings to use alternative delimiters.
      _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
      };

      // When customizing `templateSettings`, if you don't want to define an
      // interpolation, evaluation or escaping regex, we need one that is
      // guaranteed not to match.
      var noMatch = /(.)^/;

      // Certain characters need to be escaped so that they can be put into a
      // string literal.
      var escapes = {
        "'": "'",
        '\\': '\\',
        '\r': 'r',
        '\n': 'n',
        '\u2028': 'u2028',
        '\u2029': 'u2029'
      };

      var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

      var escapeChar = function(match) {
        return '\\' + escapes[match];
      };

      // JavaScript micro-templating, similar to John Resig's implementation.
      // Underscore templating handles arbitrary delimiters, preserves whitespace,
      // and correctly escapes quotes within interpolated code.
      // NB: `oldSettings` only exists for backwards compatibility.
      _.template = function(text, settings, oldSettings) {
        if (!settings && oldSettings) settings = oldSettings;
        settings = _.defaults({}, settings, _.templateSettings);

        // Combine delimiters into one regular expression via alternation.
        var matcher = RegExp([
          (settings.escape || noMatch).source,
          (settings.interpolate || noMatch).source,
          (settings.evaluate || noMatch).source
        ].join('|') + '|$', 'g');

        // Compile the template source, escaping string literals appropriately.
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
          source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
          index = offset + match.length;

          if (escape) {
            source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
          } else if (interpolate) {
            source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
          } else if (evaluate) {
            source += "';\n" + evaluate + "\n__p+='";
          }

          // Adobe VMs need the match returned to produce the correct offset.
          return match;
        });
        source += "';\n";

        // If a variable is not specified, place data values in local scope.
        if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

        source = "var __t,__p='',__j=Array.prototype.join," +
          "print=function(){__p+=__j.call(arguments,'');};\n" +
          source + 'return __p;\n';

        var render;
        try {
          render = new Function(settings.variable || 'obj', '_', source);
        } catch (e) {
          e.source = source;
          throw e;
        }

        var template = function(data) {
          return render.call(this, data, _);
        };

        // Provide the compiled source as a convenience for precompilation.
        var argument = settings.variable || 'obj';
        template.source = 'function(' + argument + '){\n' + source + '}';

        return template;
      };

      // Add a "chain" function. Start chaining a wrapped Underscore object.
      _.chain = function(obj) {
        var instance = _(obj);
        instance._chain = true;
        return instance;
      };

      // OOP
      // ---------------
      // If Underscore is called as a function, it returns a wrapped object that
      // can be used OO-style. This wrapper holds altered versions of all the
      // underscore functions. Wrapped objects may be chained.

      // Helper function to continue chaining intermediate results.
      var chainResult = function(instance, obj) {
        return instance._chain ? _(obj).chain() : obj;
      };

      // Add your own custom functions to the Underscore object.
      _.mixin = function(obj) {
        _.each(_.functions(obj), function(name) {
          var func = _[name] = obj[name];
          _.prototype[name] = function() {
            var args = [this._wrapped];
            push.apply(args, arguments);
            return chainResult(this, func.apply(_, args));
          };
        });
        return _;
      };

      // Add all of the Underscore functions to the wrapper object.
      _.mixin(_);

      // Add all mutator Array functions to the wrapper.
      _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
          var obj = this._wrapped;
          method.apply(obj, arguments);
          if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
          return chainResult(this, obj);
        };
      });

      // Add all accessor Array functions to the wrapper.
      _.each(['concat', 'join', 'slice'], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
          return chainResult(this, method.apply(this._wrapped, arguments));
        };
      });

      // Extracts the result from a wrapped and chained object.
      _.prototype.value = function() {
        return this._wrapped;
      };

      // Provide unwrapping proxy for some methods used in engine operations
      // such as arithmetic and JSON stringification.
      _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

      _.prototype.toString = function() {
        return String(this._wrapped);
      };

      // AMD registration happens at the end for compatibility with AMD loaders
      // that may not enforce next-turn semantics on modules. Even though general
      // practice for AMD registration is to be anonymous, underscore registers
      // as a named module because, like jQuery, it is a base library that is
      // popular enough to be bundled in a third party lib, but not be part of
      // an AMD load request. Those cases could generate an error when an
      // anonymous define() is called outside of a loader request.
      if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
          return _;
        }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
      }
    }());

    /* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(41)(module)))

/***/ }),
/* 41 */
/***/ (function(module, exports) {

    module.exports = function(module) {
        if(!module.webpackPolyfill) {
            module.deprecate = function() {};
            module.paths = [];
            // module.parent = undefined by default
            module.children = [];
            module.webpackPolyfill = 1;
        }
        return module;
    }


/***/ })
/******/ ])
});
;