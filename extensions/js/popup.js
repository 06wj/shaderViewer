console.log('popup init');
document.getElementById('getBtn').addEventListener('click', function() {
    sendMessageToContentScript({
        type: 'SHADER_VIEWER',
        data: {
            type: 'GET_SHADER'
        }
    }, function(response) {});
});

function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
            if (callback) callback(response);
        });
    });
}

function openViewer(programs){
    window.open('result.html?data=' + encodeURIComponent(JSON.stringify(programs)));
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('onMessage', request);
    if (request.type === 'SHADER_VIEWER') {
        const event = request.data;
        if(event){
            const type = event.type;
            const data = event.data;
            switch(type){
                case 'OPEN_VIEWER':
                    if(data && data.programs && Object.keys(data.programs).length > 0){
                        openViewer(data.programs);
                    }
                    else{
                        console.warn('no shader detect!')
                    }
                    break;
            }
        }
    }
});