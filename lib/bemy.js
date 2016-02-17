'use strict';

const BemyView = require('./bemy-view'),
	child = require('child_process'),
	path = require('path');

let bemyView,
	modalPanel;

function getEnvPATH(){
	return `${process.env.PATH}${process.env.PATH.length ? ':' : ''}${atom.config.get('atom-bemy.nodePath')}:${__dirname}/node_modules/.bin`;
}

function execAuto(selectedPath){
	return new Promise((resolve, reject) => {
		const enviroment = {
			PATH: getEnvPATH()
		};

		if(path.isAbsolute(selectedPath)){
			child.exec(
				`bemy -f ${selectedPath}`,
				{
					cwd: (path.extname ? path.dirname(selectedPath) : selectedPath),
					env: enviroment,
					shell: process.env.SHELL
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
		throw err;
	});
};

function execCreate(selectedPath, fileTypes){
	return new Promise((resolve, reject) => {
		const enviroment = {
			PATH: getEnvPATH()
		};

		if(path.isAbsolute(selectedPath)){
			child.exec(
				`bemy -t create -f ${selectedPath} -p "${fileTypes}"`,
				{
					cwd: (path.extname ? path.dirname(selectedPath) : selectedPath),
					env: enviroment,
					shell: process.env.SHELL
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
		throw err;
	});
};

function getSelectedPath(){
	var treeViewPackage = atom.packages.getActivePackage('tree-view');
	if(treeViewPackage){
		return treeViewPackage.mainModule.treeView.selectedPath;
	}
}

module.exports = {
	config: {
		nodePath: {
			type: 'string',
			default: '/usr/bin'
		}
	},
	activate: function(state){
		let input;

		bemyView = new BemyView(state.bemyViewState);
		input = bemyView.getElement().querySelector('.bemy-input');

		input.addEventListener('keydown', function(e){
			if(e.keyCode === 13){
				execCreate(getSelectedPath(), input.value)
					.then(stdout => {
						console.log(stdout);
					})
					.catch(err => {
						console.log(err);
					});

				input.value = '';
				modalPanel.hide();
			}else if(e.keyCode === 27){
				input.value = '';
				modalPanel.hide();
			}
		});

		modalPanel = atom.workspace.addModalPanel({
			item: bemyView.getElement(),
			visible: false
		});

		atom.commands.add('.platform-darwin .tree-view', 'bemy:auto', this.auto);
		atom.commands.add('.platform-darwin .tree-view', 'bemy:create', this.create);
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
