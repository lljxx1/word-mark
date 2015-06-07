var wordmark = true;

$(document).keypress(function(e){
	if(e.which == 99 && e.target.nodeName !== "TEXTAREA" && e.target.nodeName !== "INPUT"){
		wordmark = wordmark ? false : true;
	}
})


$(document).dblclick(function(e){
	hanldeEvent(e);
}).mouseup(function(e){
	hanldeEvent(e);
});


var current;

function hanldeEvent(e){

	debug('check status');
	if(!wordmark) return false;

	var select = window.getSelection();
	var text = select+"";

	debug('check selected is empty');
	if(text === ""){
		return;
	}

	var target = $(e.target);

	debug('check is on result div');
	if(target.parents('.wordsmark').length) return false;

	debug('check is same');
	if(current && current === text){
		return;
	}

	current = text;

	debug('createExplain start');
	createExplain(text, select, e)
}


function createExplain(text, select, event){
	var container, close, mark;
	var explain = $('#result_'+text);
	debug('#result_'+text);
	if(explain.length){
		debug(explain);
		setPostion(explain);
		explain.show();
		clear();
		return;
	}

	function clear(){
		current = "";
	}

	var protocol = "";

	if(window.location.protocol == "file:"){
		protocol = "http:";
	}

	JSONP(protocol+"//fanyi.youdao.com/openapi.do?keyfrom=youdaoapi1&key=1878307094&type=data&doctype=json&version=1.1&q="+text).then(function(data){
		createPopUp(data)
		clear()
	})

	function setPostion(container){
		debug('set position');
		container.css({
	  		'position' : 'fixed',
	  		'top' : event.clientY,
	  		'left': event.clientX
	  	});
	}

	function createPopUp(data) {
	  	container = $('<div id="result_'+text+'" class="wordsmark" style="z-index: 888;position:relative;min-width:180px;background:white; padding: 10px 40px 10px 10px; box-shadow: 0px 1px 2px #ccc;font: 13px/1.25 \'Helvetica Neue\',Helvetica,\'Microsoft YaHei\',Arial;text-align:left"></div>');

	  	var doc = $('<div class="word"></div>'), ul, h2 = $('<h2 style="text-transform: capitalize;font-weight: normal;font-size: 14px;margin: 0 0 0.5em 0;color: #1A9307;"></h2>'), exp, acts, remove;
			doc.append(h2)
			h2.append('<a target="_blank" href="http://dict.youdao.com/search?q='+data['query']+'&ue=utf8&keyfrom=chrome.extension.wordmark" style="color: #1A9307;text-decoration: none;">'+data['query']+'</a>');
			
			doc.append(exp = $('<div class="explains"></div>'))
			if(data['basic']){
				data['basic']['phonetic'] && h2.append('<span style="margin-left: 5px;">[ '+data['basic']['phonetic']+' ]</span>')
				exp.append(ul = $('<ul style="margin:0; padding:0"></ul>'))
				data['basic']['explains'].forEach(function(explain){
					ul.append('<li style="list-style:none; margin:0; padding:0;color: #777;line-height:1.75">'+explain+'</li>')
				})
			}
			doc.append('<div style="clear:both"></div>');

			
	  	container.append(doc);

	  	setPostion(container);

	  	$(document).click(function(event){
	  		if($(event.srcElement).parents('.wordsmark').length < 1){
	  			container.hide();
	  		}
		})

	  	container.append(close = $('<a href="#" style="position: absolute;top: 8px;right: 8px;text-decoration: none;color: red;">x</a>'));

	  	container.append(mark = $('<a href="#" style="position: absolute;top: 20px;right: 8px;text-decoration: none;color: red;">mark</a>'));

	  	mark.click(function(){
	  		chrome.extension.sendRequest({method: "mark", word: data['query'], data: data}, function(response){ 
	  		})
	  		return false;
	  	})

	  	close.click(function(event){
	  		container.hide();
	  		return false;
	  	})
	  	
	  	$('body').append(container);
	}
}

function isEnglish(s){  
    for(var i=0;i<s.length;i++)
    {
        if(s.charCodeAt(i)>126)
        {
            return false;
        }
    }
    return true; 
}

$(window).scroll(function(){
	$('.wordsmark').hide();
})


function insertaudio(a, query, action, type){  
	return  '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="15px" height="15px" align="absmiddle" id="speach_flash">' +'<param name="allowScriptAccess" value="sameDomain" />' +'<param name="movie" value="http://cidian.youdao.com/chromeplus/voice.swf" />' +'<param name="loop" value="false" />' +'<param name="menu" value="false" />' +'<param name="quality" value="high" />' +'<param name="wmode"  value="transparent">'+'<param name="FlashVars" value="audio=' + a + '">' +'<embed wmode="transparent" src="http://cidian.youdao.com/chromeplus/voice.swf" loop="false" menu="false" quality="high" bgcolor="#ffffff" width="15" height="15" align="absmiddle" allowScriptAccess="sameDomain" FlashVars="audio=' + a + '" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />' +'</object>' ;
}