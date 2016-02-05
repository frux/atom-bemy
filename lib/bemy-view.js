module.exports = function(serializedState){
	var self = this;
	var element = document.createElement('div');

	element.className = 'bemy';
	element.innerHTML = `<input type="text" class="bemy-input" style="width: 100%; font-size: 1.15em; line-height: 2em; max-height: none; padding-left: 0.5em; border-radius: 3px; color: #d7dae0; border: 1px solid #181a1f; background-color: #1b1d23;" autofocus tabindex="-1" data-encoding="utf8">`;

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
