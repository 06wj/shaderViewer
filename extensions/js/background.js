 chrome.runtime.onInstalled.addListener(function() {
     console.log('onInstalled');

     chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
         if(request.type === 'SHADER_VIEWER'){
            console.log(request.data);
         }
     });
 });