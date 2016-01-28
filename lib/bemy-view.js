module.exports = function(serializedState){
	var self = this;
	var element = document.createElement('div');

	element.className = 'bemy';
	element.innerHTML = '<atom-text-editor class="editor mini" tabindex="-1" mini="" data-grammar="text plain null-grammar" data-encoding="utf8"></atom-text-editor>';

	this.intialize = function(){
		return element;
	};
	this.serialize = function(){
		return element.querySelector('atom-text-editor').value;
	};
	this.destroy = function(){};
	this.getElement = function(){
		return element;
	};
};
