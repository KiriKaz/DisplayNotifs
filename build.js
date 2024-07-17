const pluginMeta = require('./pluginMeta.json');
const packageMeta = require('./package.json');

const buildMeta = (pluginMeta, packageMeta) => {
	let outString = [];

	outString.push("/**");

	const info = pluginMeta.info

	for(const [key, value] of Object.entries(info)) {
		if(key === "authors") {
			outString.push(` * @author ${value.map(a => a.name).join(", ")}`);
			continue;
		}
		outString.push(` * @${key} ${value}`);
	}

	outString.push(` * @version ${packageMeta.version}`);
	outString.push(` * @github ${packageMeta.repository}`);

	outString.push(" */");

	return outString.join("\n");
};

require('esbuild').build({
	entryPoints: ['src/index.js'],
	platform: "node",
	bundle: true,
	outfile: 'dist/DisplayNotifs.plugin.js',
	color: true,
	logLevel: "info",
	banner: {
		js: buildMeta(pluginMeta, packageMeta)
	}
})
.then(() => {
	// console.log('DN built.')
})
.catch((e) => {
	// console.error(e)
});