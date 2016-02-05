'use strict';

const fs = require('fs');
const os = require('os');
const spawnSync = require('child_process').spawnSync;

function execSync(command, cwd, env, args, input){
	let options = {
			cwd: null,
			env: env,
			encoding: 'utf8'
		},
		done,
		code,
		stdout,
		stderr,
		error;

	if(cwd && cwd.length > 0){
		options.cwd = fs.realpathSync(cwd);
	}

	if(input && input.length){
		options.input = input;
	}

	done = spawnSync(command, args, options);
	code = done.status;

	stdout = ''
	if(done.stdout && done.stdout.length > 0){
		stdout = done.stdout;
	}

	stderr = '';

	if(done.stderr && done.stderr.length > 0){
		stderr = done.stderr
	}

	error = done.error;
	if(error && error.code){
		switch (error.code) {
			case 'ENOENT':
				code = 127;
			break;
			case 'ENOTCONN':
				error = null;
				code = 0;
			break;
		}
	}

	return {
		code,
		stdout,
		stderr,
		error
	};
}

module.exports = function getRealEnv(){
	let shell = (!process.env.SHELL || process.env.SHELL === '/bin/sh' ? '/bin/bash' : process.env.SHELL),
		result = execSync(shell, null, process.env, ['--login'], 'env');

	if(result && result.code === 0 && result.stdout && result.stdout.length > 0){
		let newenv = {};
		for(let line of result.stdout.split(os.EOL)){
			if (line.includes('=')){
				let components = line.split('=');

				if (components.length === 2){
					newenv[components[0]] = components[1];
				}else if(components.length > 2){
					let k = components.shift();
					let v = components.join('=');
					newenv[k] = v;
				}
			}
		}
		return newenv;
	}

	return process.env;
};
