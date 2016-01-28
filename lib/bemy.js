'use strict';
const BemyView = require('./bemy-view'),
	  child = require('child_process'),
	  path = require('path'),
	  bemyPath = '/Users/frux/.nvm/versions/node/v5.1.0/bin/',
	  nodePath = '/Users/frux/.nvm/versions/node/v5.1.0/bin/';

let bemyView,
	modalPanel;

function execAuto(selectedPath){
	return new Promise((resolve, reject) => {
		const enviroment = process.env;

		if(path.isAbsolute(selectedPath)){
			enviroment.PATH += `${enviroment.PATH.length ? ':' : ''}${nodePath}:${bemyPath}`;

			child.exec(
				`bemy -f ${selectedPath}`,
				{
					cwd: (path.extname ? path.dirname(selectedPath) : selectedPath),
					env: enviroment
				},
				(err, stdout, stderr) => {
					if(err){
						reject(err);
					}else{
						resolve(stdout);
					}
				}
			);
		}else{
			reject(`Invalid path ${selectedPath}`);
		}
	})
	.catch(err => {
		console.log(err);
	});
};

function execCreate(selectedPath, fileTypes){
	return new Promise((resolve, reject) => {
		const enviroment = process.env;

		if(path.isAbsolute(selectedPath)){
			enviroment.PATH += `${enviroment.PATH.length ? ':' : ''}${nodePath}:${bemyPath}`;

			child.exec(
				`bemy -t create -f ${selectedPath} -p "${fileTypes}"`,
				{
					cwd: (path.extname ? path.dirname(selectedPath) : selectedPath),
					env: enviroment
				},
				(err, stdout, stderr) => {
					if(err){
						reject(err);
					}else{
						resolve(stdout);
					}
				}
			);
		}else{
			reject(`Invalid path ${selectedPath}`);
		}
	})
	.catch(err => {
		console.log(err);
	});
};

function getSelectedPath(){
	var treeViewPackage = atom.packages.getActivePackage('tree-view');
	if(treeViewPackage){
		return treeViewPackage.mainModule.treeView.selectedPath;
	}
}

module.exports = {
	activate: function(state){
		let textEditor;

		bemyView = new BemyView(state.bemyViewState);
		textEditor = bemyView.getElement().querySelector('atom-text-editor');


		textEditor.addEventListener('keydown', function(e){
			let nativeInput = textEditor.shadowRoot.querySelector('input'),
				inputDisplay = textEditor.shadowRoot.querySelector('span.text');

			if(e.keyCode === 13){
				if(inputDisplay){
					execCreate(getSelectedPath(), inputDisplay.innerHTML)
						.then(stdout => {
							console.log(stdout);
						})
						.catch(err => {
							console.log(err);
						});
				}
				modalPanel.hide();

				//nativeInput.value = '';
				//inputDisplay.innerHTML = '';
			}
		});

		modalPanel = atom.workspace.addModalPanel({
			item: bemyView.getElement(),
			visible: false
		});
		atom.commands.add('.tree-view.full-menu .entry', 'bemy:auto', this.auto);
		atom.commands.add('.tree-view.full-menu .header.list-item', 'bemy:auto', this.auto);
		atom.commands.add('menu', 'bemy:auto', this.auto);
		atom.commands.add('.tree-view.full-menu .entry', 'bemy:create', this.create);
		atom.commands.add('.tree-view.full-menu .header.list-item', 'bemy:create', this.create);
		atom.commands.add('menu', 'bemy:create', this.create);
	},
	auto: function(){
		execAuto(getSelectedPath());
	},
	create: function(){
		if(modalPanel.isVisible()){
			modalPanel.hide();
		}else{
			modalPanel.show();
		}
	}
}