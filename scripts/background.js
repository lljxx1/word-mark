
var stroer = new dictionary();

var sharedContextmenuId=null;
function createSharedContextmenu() {
	if (!sharedContextmenuId) {
		sharedContextmenuId = chrome.contextMenus.create({
			title: 'mark',
			contexts: ['all'],
			onclick: function(info, tab) {
				var text = info.selectionText;
				text = text || tab.title;
				var link = info.linkUrl || info.frameUrl || info.pageUrl;
				var image_rex = /\.(jpg|png|gif|bmp)$/ig;
				if (link.toLowerCase().indexOf('javascript') === 0 || link === info.srcUrl || image_rex.test(link)) {
					link = info.frameUrl || info.pageUrl;
				}
				
				stroer.get(text).then(function(translte){
					// console.log(translte);
				}, function(error){
				});
			}
		});
	}
}

function removeSharedContextmenu(){
	if(sharedContextmenuId){chrome.contextMenus.remove(sharedContextmenuId);sharedContextmenuId=null;
	}
}
createSharedContextmenu();

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if (request.method) {
        methodManager[request.method](request, sender, sendResponse);
    }
});



var methodManager = {
    mark: function(request, sender, sendResponse) {
        if(request['word'] && request['data']){
        	stroer.set(request['word'], request['data']);
        	sendResponse('done');
        }
    }
}