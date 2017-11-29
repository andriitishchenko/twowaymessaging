(function() {
    var timeDelaySec = 5;
    var selfName = "CONTENT JS";
    var thisID = guid();
    var str = selfName + " = " + thisID;
    var myVar = setInterval(myTimer, timeDelaySec * 1000);

    function myTimer() {
        var d = new Date();
        console.log("TICK " + str);
    }

    var cmd = {
        GETUUIDCALLBACK: 1,
        SENTMSG: 2,
        GETEXTLIST: 3
    }


    function guid() {
        function _p8(s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    function init() {
        //inject js
        var s = document.createElement('script');
        s.src = chrome.extension.getURL('inject.js');
        (document.head || document.documentElement).appendChild(s);
        s.onload = function() {
            s.parentNode.removeChild(s);
        };
        //add content UI elements
        initUI();
    }
    init();


    function initUI() {
        //panel with buttons
        var div = document.createElement('div');
        var b1 = newButton("CONTENT Request UUID from BG", "inj_button", function() {
            reguest(cmd.GETUUIDCALLBACK, { "TYPE": "secure chrome.runtime.sendMessage" })
                .then(response => {
                    console.log("CONTENT requested UDID:", response);
                })
                .catch(e => {
                    console.log(e);
                });
        });

        var b2 = newButton("CONTENT TEST 2", "inj_button", function() {
            chrome.runtime.sendMessage({
                "from": 'content',
                "cmd": cmd.SENTMSG,
                "data": { "TYPE": "chrome.runtime.sendMessage" }
            }, function(response) {
                console.log(response);
            });
        });

        div.appendChild(b1);
        div.appendChild(b2);

        document.body.appendChild(div);
    }

    function newButton(title, cssclass, clickHandler) {
        var b = document.createElement('button');
        b.setAttribute("class", cssclass);
        b.innerHTML = title;
        b.addEventListener("click", clickHandler);
        return b;
    }

    //sending messages
    //kndpglafofpainnmogckdkmfbimanbeh
    var selfid =
        // "kndpglafofpainnmogckdkmfbimanbeh";
        "fakieblpcehflecaegeonegkaaedcdhk";

    function reguest(cmd, data) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                selfid, {
                    "from": 'content',
                    "cmd": cmd,
                    "data": data
                },
                function(result) {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(Error("Undefined bg response"));
                    }
                    return true;
                }
            );
        });
    }

    // reading messages
    chrome.extension.onMessage.addListener(function(request, sender, sendResponseParam) {
        console.log(selfName);
        console.log("extension.onMessage");
        console.log(request);

    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log(selfName);
        console.log("runtime.onMessage");
        console.log(request);
    });



})();