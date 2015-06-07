function JSONP(url){
	return new Promise(function(resolve, reject){
		debug(url);
		
		$.getJSON(url).then(function(data){
			resolve(data);
		})

		setTimeout(function(){
        	reject('time out');
        }, 3000);
	})
}


function debug(msg){
	// console.log(msg);
}

function dictionary(){

	var self = this, wordsMap;

	function init(){
		(wordsMap = localStorage.getItem('wordsMap')) && (wordsMap = decode(wordsMap));
		wordsMap = wordsMap || {};
		debug('init');
	}

	init();

	function encode(data){
		return JSON.stringify(data)
	}

	function decode(data){
		return JSON.parse(data)
	}

	this.set = function(word, data){
		word = word.toLowerCase().trim();
		debug('set '+word);
		wordsMap[word] = 1;
		localStorage.setItem(word, encode(data));
		self.save();
	}

	this.save = function(){
		debug('save ');
		localStorage.setItem('wordsMap', encode(wordsMap));
	}

	this.all = function(){
		debug('get all');
		console.log(wordsMap);
		return wordsMap;
	}

	this.del = function(word){
		debug(wordsMap);
		debug('del '+word);
		word = word.toLowerCase();
		delete wordsMap[word];
		localStorage.removeItem(word);
		debug(wordsMap);
		self.save();
	}

	this.clear = function(){
		localStorage.removeItem('wordsMap');
	}

	this.get = function(word){
		return new Promise(function(resolve, reject){
			debug('get '+word);
			debug(wordsMap);
			if(wordsMap.hasOwnProperty(word)){
				debug('return by local');
				wordsMap[word] += 1;
				self.save();
				resolve(decode(localStorage.getItem(word)), word);
			}else{
				JSONP("http://fanyi.youdao.com/openapi.do?keyfrom=youdaoapi1&key=1878307094&type=data&doctype=json&version=1.1&q="+word).then(function(data){
					debug('return by jsonp');
					resolve(data, word);
					self.set(word, data);
				})
			}
		})
	}
}


