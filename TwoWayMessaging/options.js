(function() {

    var timeDelaySec = 5;

    window.onload = function() {
        inject_rm = document.getElementById("inject_rm");
        backgtound_rm = document.getElementById("backgtound_rm");
        backgtound2_rm = document.getElementById("backgtound2_rm");
        content_rm = document.getElementById("content_rm");
        undef_rm = document.getElementById("undef_rm");

        inject_em = document.getElementById("inject_em");
        backgtound_em = document.getElementById("backgtound_em");
        backgtound2_em = document.getElementById("backgtound2_em");
        content_em = document.getElementById("content_em");
        undef_em = document.getElementById("undef_em");
    }


    // request data
    var myVar = setInterval(myTimer, timeDelaySec * 1000);

    function myTimer() {
        var d = new Date();
        chrome.runtime.sendMessage({
            "from": 'options',
            "cmd": 3,
            "data": { "TYPE": "chrome.runtime.sendMessage" }
        }, response => {
            console.log(response);
        });
    }

    var myVar2 = setInterval(myTimer2, timeDelaySec * 1000);

    function myTimer2() {
        reguest(1, { "TYPE": "secure chrome.runtime.sendMessage" })
            .then(response => {
                console.log("CONTENT requested UDID:", response);
            })
            .catch(e => {
                console.log(e);
            });
    }


    //sending messages
    var selfid =
        "kndpglafofpainnmogckdkmfbimanbeh"; //for shiped PEM
        // "fakieblpcehflecaegeonegkaaedcdhk";

    function reguest(cmd, data) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                selfid, {
                    "from": 'options',
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

    /// on income messages

    chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
        console.log("OPTIONS: extension.onMessage");
        console.log(request);
        if (request.from == "background") {
            backgtound_em.classList.toggle("flash");
        } else if (request.from == "background2") {
            backgtound2_em.classList.toggle("flash");
        } else if (request.from == "content") {
            content_em.classList.toggle("flash");
        } else if (request.from == "injected") {
            inject_em.classList.toggle("flash");
        } else {
            undef_em.classList.toggle("flash");
        }

    });

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        console.log("OPTIONS: runtime.onMessage");
        console.log(request);
        if (request.from == "background") {
            backgtound_rm.classList.toggle("flash");
        } else if (request.from == "background2") {
            backgtound2_rm.classList.toggle("flash");
        } else if (request.from == "content") {
            content_rm.classList.toggle("flash");
        } else if (request.from == "injected") {
            inject_rm.classList.toggle("flash");
        } else {
            undef_rm.classList.toggle("flash");
        }
    });

    chrome.runtime.onMessageExternal.addListener(function(request, sender, sendResponse) {
        console.log("runtime.onMessageExternal");
        console.log(request);
        if (request.from == "background") {
            backgtound_rm.classList.toggle("flash");
        } else if (request.from == "background2") {
            backgtound2_rm.classList.toggle("flash");
        } else if (request.from == "content") {
            content_rm.classList.toggle("flash");
        } else if (request.from == "injected") {
            inject_rm.classList.toggle("flash");
        } else {
            undef_rm.classList.toggle("flash");
        }
        return true;
    });
})();