(function() {
    $(function() {
		var button = $('.search-form button');
		
		button.click(function(){
			var searchValue = $('#search').val();
			var words = searchValue.split(' ');
			var sections = $('.section legend');
			for(var i = 0; i < sections.length; i++){
				if (!areWordsInTheText(words, sections[i].innerText)){
					console.log(sections[i].parentNode.style.display = "none");
				}
			}
		});
		
		function isWordContainsInString(word, string){
			var lowerWord = word.toLowerCase();
			var lowerString = string.toLowerCase();
		
			if (lowerWord.length > lowerString.length){
				return false;
			}
			else if (lowerString.indexOf(lowerWord) > -1){
				return true;
			}
		
			return false;
		}
		
		function areWordsInTheText(words, text){
			for (var i = 0; i < words.length; i++){
				if (isWordContainsInString(words[i], text)){
					return true;
				}
			}
		
			return false;
		}
    });
}());