(function() {
    var cmd = {
        GETUUIDCALLBACK: 1,
        SENTMSG: 2,
        GETEXTLIST: 3
    }

    var selfid = 
    // "kndpglafofpainnmogckdkmfbimanbeh";
    "fakieblpcehflecaegeonegkaaedcdhk";

    function reguest(cmd, data) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                selfid, //this requaried for messages from WEB PAGE
                {
                    "from": 'injected',
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

    function requestUUIDFromBackgroung() {
        reguest(cmd.GETUUIDCALLBACK, { "TYPE": "secure chrome.runtime.sendMessage" })
            .then(response => {
                console.log("INJECT requested UDID:", response);
            })
            .catch(e => {
                console.log(e);
            });
    }


    function init() {
        requestUUIDFromBackgroung();
        initUI();
    }
    init();


    function initUI() {
        //panel with buttons
        var div = document.createElement('div');

        var b1 = newButton("INJECTED Request UUID from BG", "inj_button", function() {
            requestUUIDFromBackgroung();
        });
        div.appendChild(b1);

        // var b2 = newButton("INJECTED TEST 2","inj_button", function(){ 
        // 	chrome.runtime.sendMessage({
        // 			"from": 'content',
        // 			"cmd": cmd.SENTMSG,
        // 			"data": {"a":1}
        // 		}, function(response) {
        // 	  console.log(response);
        // 	});
        // });
        // div.appendChild(b2);

        document.body.appendChild(div);
    }

    function newButton(title, cssclass, clickHandler) {
        var b = document.createElement('button');
        b.setAttribute("class", cssclass);
        b.innerHTML = title;
        b.addEventListener("click", clickHandler);
        return b;
    }

})();