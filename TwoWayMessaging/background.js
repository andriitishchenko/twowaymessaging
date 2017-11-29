(function() {
    //utils
    window.cmd = window.cmd || {
        GETUUIDCALLBACK: 1,
        SENTMSG: 2,
        GETEXTLIST: 3
    }

    var timeDelaySec = 5;
    var thisID = guid();
    var str = "BACKGROUND = " + thisID;
    var myVar = setInterval(myTimer, timeDelaySec * 1000);

    //lets send messages by timer
    function myTimer() {
        var d = new Date();

        console.log(str);
        messageToContent("POST", { "id": thisID });

        setTimeout(function() {
            messageToContent2("POST", { "id2": thisID });
        }, 500);
    }

    //utils
    function guid() {
        function _p8(s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    }

    //send message to all
    function messageToContent(type, json) {
        chrome.runtime.sendMessage({
            from: 'background',
            subject: 'chrome.runtime.sendMessage',
            type: type,
            json: json
        });
    }

    //send message to active tab 
    function messageToContent2(data, json) {
        //switch focus to other window to test this type of messages
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            if (tabs.length == 0) {
                console.log("Chnage focus to other Chromium tab!");
                return;
            }
            chrome.tabs.sendMessage(tabs[0].id, {
                from: 'background2',
                subject: 'chrome.tabs.query',
                data: data,
                json: json
            }, response => {
                console.log(response);
            });
        });
    }



    // retriving messages from WEB Page, Content and 
    // cases when specified extension ID as reciever
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

    // retriving messages from internal extension pages (Options, etc)
    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        console.log("extension.onMessage");
        console.log(request);
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (sendResponse) {
            sendResponse({ from: 'from_background', subject: "extension.onMessage",type: "CALLBACK" });
        }
    });
    // retriving messages from internal extension pages 
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log("runtime.onMessage");
        console.log(request);
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (sendResponse) {
            sendResponse({ from: 'from_background', subject: "runtime.onMessage",type: "CALLBACK" });
        }
    });

    function getUUID(callback) {
        callback(thisID);
        //send message to last active
        chrome.tabs.query({
            'active': true,
            'lastFocusedWindow': true
        }, tabs => {
            console.log(tabs);
            chrome.tabs.sendMessage(tabs[0].id, {from: 'from_background', subject: "chrome.tabs.sendMessage", type: "POST" }, r => {
                console.log(r);
            });
        });
        return;
    }

})();