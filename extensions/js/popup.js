console.log('popup init');

// send to contentScript
document.getElementById('getBtn').addEventListener('click', function() {
    sendMessageToContentScript({
        type: 'SHADER_VIEWER',
        data: {
            type: 'GET_SHADER'
        }
    });
});

// from contentScript
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('onMessage', request);
    if (request.type === 'SHADER_VIEWER') {
        const event = request.data;
        if (event) {
            const type = event.type;
            const data = event.data;
            switch (type) {
                case 'OPEN_VIEWER':
                    const programs = data?.programs;
                    if (programs && Object.keys(programs).length > 0) {
                        window.open('result.html?data=' + encodeURIComponent(JSON.stringify(programs)));
                    } else {
                        sendMessageToContentScript({
                            type: 'SHADER_VIEWER',
                            data: {
                                type: 'LOG_WARN',
                                data: 'No shader found!'
                            }
                        });
                    }
                    break;
            }
        }
    }
});


//////////////////////////////--- Utils ---//////////////////////////////

function sendMessageToContentScript(message) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message);
    });
}