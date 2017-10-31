let postcss = require('postcss');
let writeFile = require('write');
let path = require('path');

module.exports = postcss.plugin('postcss-mq-split', opts => {
	return (css, result) => {
		css.walkAtRules("media", rule => {
			if (!rule.params.match(/^--split-/))
				return;
			let fileinfo = path.parse(result.opts.to);
			let fileName = fileinfo.dir + '/' + fileinfo.name + rule.params.substr(7) + fileinfo.ext;

			let newCss = postcss.parse('@charset "UTF-8"');
			newCss.append(rule.nodes);
			rule.remove();

			return new Promise((resolve, reject) => {
				writeFile(fileName, newCss.toString(), err => {
					if (err)
						reject(err);
					resolve();
				});
			});
		});
	};
});
