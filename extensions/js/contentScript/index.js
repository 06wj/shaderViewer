// console.log('ShaderViewer init');

insertUrlScript('js/contentScript/injectWebGL.js');

// from popup send to window
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.type == 'SHADER_VIEWER') {
        const data = request.data;
        switch (data.type) {
            case 'GET_SHADER':
                // window send shader data
                insertUrlScript('js/contentScript/openViewer.js');
                break;
            case 'LOG_LOG':
                console.log(data.data);
                break;
            case 'LOG_WARN':
                console.warn(data.data);
                break;
        }
    }
});

// from window send to popup
window.addEventListener("message", function (e) {
    const data = e.data;
    if (data.type === 'SHADER_VIEWER') {
        chrome.runtime.sendMessage(data);
    }
}, false);

//////////////////////////////--- Utils ---//////////////////////////////
function insertUrlScript(url) {
    var script = document.createElement('script');
    script.src = chrome.runtime.getURL(url);
    script.onload = function () {
        this.remove();
    };
    insertHeaderNode(script);
    return script;
}

function insertHeaderNode(node) {
    var targets = [document.body, document.head, document.documentElement];
    for (var n = 0; n < targets.length; n++) {
        var target = targets[n];
        if (target) {
            if (target.firstElementChild) {
                target.insertBefore(node, target.firstElementChild);
            } else {
                target.appendChild(node);
            }
            break;
        }
    }
};