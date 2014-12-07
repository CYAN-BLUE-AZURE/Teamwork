(function() {
    $(function() {
		var submitButton = $('.search-form input[type=submit]');
		var searchInput = $('#search');
		
		var search = function(){
			var searchValue = htmlEncode(searchInput.val());
			if (searchValue !== ''){
				var words = searchValue.split(' ');
				var sections = $('.section legend');
				
				for(var i = 0; i < sections.length; i++){
					var parent = sections[i].parentNode;
					parent.style.display = "block";
					if (!areWordsInTheText(words, sections[i].innerText)){
						parent.style.display = "none";
					}
				}
			}
		}
		
		submitButton.click(search);
		
		function htmlEncode(string){
			var el = document.createElement('div');
			el.innerText = string;
			return el.innerHTML;
		}
		
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