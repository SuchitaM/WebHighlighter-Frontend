
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//     if (request.method == "getUserId")
//       sendResponse({status: localStorage['status']});
//     else
//       sendResponse({}); // snub them.
// });


// //message to content script of the current active tab.
// chrome.tabs.onActivated.addListener(function (activeInfo){

//  chrome.tabs.get(activeInfo.tabId, function(tab){
	  
//        chrome.tabs.sendMessage(tab.id, {"message": "Tab changed","url": tab.url});
//   });

// });

// //message from content script
// //open new tab
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if( request.message === "open_hostname_tab" ) {
//       //chrome.tabs.create({"url": request.url});
//     }
//   }
// );


// chrome.app.runtime.onLaunched.addListener(function (launchData) {
//   chrome.app.window.create(
//     // Url
//     '/popup.html',
//     // CreateWindowOptions
//     {
//             'width': 400,
//             'height': 1000
//     },
//     // Callback
//     function(win) {
//         win.contentWindow.launchData = launchData;
//         win.maximize();
//         win.show();
//     });
// });