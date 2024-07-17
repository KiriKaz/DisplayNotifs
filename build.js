const pluginMeta = require('./pluginMeta.json');
const packageMeta = require('./package.json');

const esbuild = require('esbuild');

const buildMeta = (pluginMeta, packageMeta) => {
	let outString = [];

	outString.push("/**");

	const info = pluginMeta.info

	for(const [key, value] of Object.entries(info)) {
		switch(key) {
		case "authors":
			outString.push(` * @author ${value.map(a => a.name).join(", ")}`);
			continue;
		case "github_raw":
			outString.push(` * @source ${value}`);
			outString.push(` * @updateUrl ${value}`);
			continue;
		case "version":
			continue;
		default:
			outString.push(` * @${key} ${value}`);
		}
	}

	outString.push(` * @version ${packageMeta.version}`);
	outString.push(` * @website ${packageMeta.repository}`);

	outString.push(" */");

	return outString.join("\n");
};

esbuild.build({
	entryPoints: ['src/index.js'],
	platform: "node",
	bundle: true,
	outfile: 'dist/DisplayNotifs.plugin.js',
	color: true,
	logLevel: "info",
	banner: {
		js: buildMeta(pluginMeta, packageMeta)
	},
	loader: {
		'.js': 'jsx',
		'.css': 'text'
	},
	inject: ['./src/styles.css'],
	jsxFactory: "BdApi.React.createElement",
})
.then(() => {
	// console.log('DN built.')
})
.catch((e) => {
	// console.error(e)
});