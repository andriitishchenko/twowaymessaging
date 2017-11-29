(function() {
    //some util code
    var cmd = {
        GETUUIDCALLBACK: 1,
        SENTMSG: 2,
        GETEXTLIST: 3
    }

    //change this varioable if loaded unpacked extension. It displays on Extension page
    var selfid =
        "kndpglafofpainnmogckdkmfbimanbeh";  //for shiped PEM
        // "fakieblpcehflecaegeonegkaaedcdhk";

    function reguest(cmd, data) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                //1 param: requaried for messages from WEB PAGE
                selfid,
                //2 param: custom object as a parameter
                {
                    "from": 'injected',
                    "cmd": cmd,
                    "data": data
                },
                //3 param: callback function
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

    function requestUUIDFromBackgroung() {
        reguest(cmd.GETUUIDCALLBACK, { "TYPE": "secure chrome.runtime.sendMessage" })
            .then(response => {
                console.log("INJECT requested UDID:", response);
            })
            .catch(e => {
                console.log(e);
            });
    }

    function initUI() {
        //panel with buttons
        var div = document.getElementById('inject_ui_div'); //this div created in content.js

        var b1 = newButton("Secure sendMessage from Inject", "inj_button", function() {
            requestUUIDFromBackgroung();
        });
        div.appendChild(b1);
    }

    function newButton(title, cssclass, clickHandler) {
        var b = document.createElement('button');
        b.setAttribute("class", cssclass);
        b.innerHTML = title;
        b.addEventListener("click", clickHandler);
        return b;
    }

    //init
    requestUUIDFromBackgroung();
    initUI();
})();