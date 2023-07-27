// ==UserScript==
// @name         Simple PloudOS DynamicIP Copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a simple button to copy Dynamic IP address from PloudOS manage page
// @author       HageFX78
// @match        https://ploudos.com/manage/*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==
GM_addStyle ( `

#dyncp {
    padding: 10px 14px 10px 14px;
    border-style: none;
    border-radius: 2px;
    font-size: 14px;
    font-weight: bold;
    position: absolute;
    left: 70%;
    top: 10.4em;
}

.not_copied:hover{
    background-color: green;
}
.not_copied {
    color: white;
    background-color: #32CD32;
}
.copied {
    background-color: #265730;
}

` );

window.addEventListener('load', function() {
    'use strict';

    function copy(str) {
        let temp = document.createElement('textarea');
        document.body.appendChild(temp);
        temp.value = str;
        temp.select();
        document.execCommand('copy');
        temp.remove();
    }

    function addCopyBtn(ele)
    {

        let btn = document.createElement("button");
        btn.id = "dyncp";
        btn.className = "not_copied";
        btn.innerHTML = "Copy Dyn. IP";
        btn.onclick = () =>{
            btn.innerHTML = "Copied"
            btn.className = "copied"
            setTimeout(resetButton, 1000, btn);
            let dynmTag = document.getElementsByTagName("tr");
            const str = dynmTag[2].textContent.replace("Dyn. IP", '').trim();
            copy(str);
        }

        ele.appendChild(btn);
    }
    function serverIsStarted()
    {
        if(document.getElementsByTagName("h2")[0].textContent != "Status") return; //Check if page is main page

        let dynmTag = document.getElementsByTagName("tr");

        if(typeof(dynmTag) != 'undefined' && dynmTag != null && dynmTag.length == 5)
        {
            obs.disconnect();
            let tagTopPlaceBtn = document.getElementsByTagName("h2")[0];
            addCopyBtn(tagTopPlaceBtn);
        }
        else
        {
            obs.observe(document.getElementById('status'),{childList: true});
        }
    }
    function resetButton(btn)
    {
        btn.className = "not_copied";
        btn.innerHTML = "Copy Dyn. IP";
    }

    var obs = new MutationObserver(function (e) {
        if (e[0].removedNodes){
            console.log("Rechecking server start status.");
            serverIsStarted();
        };
    });

    serverIsStarted();//init
});
