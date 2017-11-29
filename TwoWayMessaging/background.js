(function() {

    window.cmd = window.cmd || {
        GETUUIDCALLBACK: 1,
        SENTMSG: 2,
        GETEXTLIST: 3
    }

    var timeDelaySec = 5;
    var selfName = "BACKGROUND ";
    var thisID = guid();
    var str = selfName + " = " + thisID;
    var myVar = setInterval(myTimer, timeDelaySec * 1000);

    function myTimer() {
        var d = new Date();

        console.log(str);
        messageToContent(selfName, { "id": thisID });

        setTimeout(function() {
            messageToContent2(selfName, { "id2": thisID });
        }, 500);


        try {
            chrome.good.logger.log(1, str);
        } catch (e) {
            // console.log(e);        
        }
    }


    function guid() {
        function _p8(s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    function messageToContent(data, json) {
        chrome.runtime.sendMessage({
            from: 'background',
            subject: 'custom BG Demo Object',
            data: data,
            json: json
        });
    }


    function messageToContent2(data, json) {
        //switch focus to other window to test this type of messages
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                from: 'background2',
                subject: 'custom BG Demo Object2',
                data: data,
                json: json
            }, function(response) {
                console.log(response);
            });
        });
    }

    chrome.runtime.onMessageExternal.addListener(
        function(request, sender, sendResponse) {
            console.log("runtime.onMessageExternal");
            console.log(request);

            if (request.cmd) {
                switch (request.cmd) {
                    // case cmd.GETEXTLIST:
                    //     getText(request.data, sendResponse);
                    //     break;
                    case cmd.GETUUIDCALLBACK:
                        getUUID(sendResponse);
                    case cmd.SENTMSG:
                        sendResponse({ "from_background": "onMessageExternal" });
                        break;
                        break;
                    default:
                        break;
                }
            }
            if (sendResponse) {
                sendResponse({ "from_background": "onMessageExternal" });
            }
            return true;
        });
    // ===
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        console.log("extension.onMessage");
        console.log(request);
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (sendResponse) {
            sendResponse({ "from_background": "extension.onMessage" });
        }
    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log("runtime.onMessage");
        console.log(request);
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (sendResponse) {
            sendResponse({ "from_background": "runtime.onMessage" });
        }
    });

    ////======
    // function getText(data, callback) {
    //     console.log(data);
    //     callback("This is responce from backgrount");
    // }


    function getUUID(callback) {
        callback(thisID);
        

        //send message to last active
        chrome.tabs.query({
            'active': true,
            'lastFocusedWindow': true
        }, function(tabs) {
            console.log(tabs);
            chrome.tabs.sendMessage(tabs[0].id, {test:"test"}, function(r) {
              console.log(r);
            });
        });
        return;
    }

})();