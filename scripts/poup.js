var bgPage = chrome.extension.getBackgroundPage();

var stroer = bgPage.stroer;

allWords = stroer.all();

var container = $('#main');

var wordsElement = $('<div class="words"></div>');

for(var word in allWords){
	var current = word;
	stroer.get(word).then(function(data){
		var doc = $('<div class="word"></div>'), ul, h2 = $('<h2></h2>'), exp, acts, remove;
		console.log(data)
		doc.append(h2)
		h2.append('<a href="http://dict.youdao.com/search?q='+data['query']+'&ue=utf8&keyfrom=chrome.extension.wordmark">'+data['query']+'</a>');
		
		doc.append(exp = $('<div class="explains"></div>'))
		if(data['basic']){
			data['basic']['phonetic'] && h2.append('<span class="pronounce">[ '+data['basic']['phonetic']+' ]</span>')
			exp.append(ul = $('<ul></ul>'))
			data['basic']['explains'].forEach(function(explain){
				ul.append('<li>'+explain+'</li>')
			})
		}
		doc.append(acts = $('<div class="actions"></div>'))
		acts.append(remove = $('<a href="#" class="remove" data-word="'+data['query']+'"><i class="icon-delete iconfont"></i></a>'));

		doc.append('<div style="clear:both"></div>');

		remove.click(function(){
			doc.remove();
			var wd = $(this).attr('data-word');
			stroer.del(wd);
		})

		wordsElement.append(doc);
	});
}


wordsElement.appendTo(container);
