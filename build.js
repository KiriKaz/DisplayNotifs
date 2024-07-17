const pluginMeta = require('./pluginMeta.json');
const packageMeta = require('./package.json');

const esbuild = require('esbuild');

const buildMeta = (pluginMeta, packageMeta) => {
	let outString = [];

	const info = pluginMeta.info

	const pluginMetaOut = {}

	for(const [key, value] of Object.entries(info)) {
		switch(key) {
		case "authors":
			pluginMetaOut['author'] = value.map(a => a.name).join(", ");
			continue;
		case "github_raw":
			pluginMetaOut['source'] = value;
			pluginMetaOut['updateUrl'] = value;
			continue;
		case "version":
			continue;
		default:
			pluginMetaOut[key] = value;
		}
	}

	pluginMetaOut['description'] = packageMeta.description;
	pluginMetaOut['version'] = packageMeta.version;
	pluginMetaOut['website'] = packageMeta.repository;

	outString.push("/**");

	['name', 'description', 'author', 'version', 'source', 'updateUrl', 'website'].forEach(key => {
		outString.push(` * @${key} ${pluginMetaOut[key]}`);
		delete pluginMetaOut[key];
	})

	if(Object.keys(pluginMetaOut).length > 0) {
		for(const [key, value] of Object.entries(pluginMetaOut)) {
			outString.push(` * @${key} ${value}`);
		}
	}

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