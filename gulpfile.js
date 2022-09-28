const { src, dest } = require("gulp");
const concat = require("gulp-concat");
const ts = require("gulp-typescript");
const uglify = require("gulp-uglify");
const merge2 = require("merge2");
const tsProject = ts.createProject("tsconfig.json");

const build = () => {
	const result = src([
		"./src/regex.ts",
		"./src/toggle.hex.ts",
		"./src/handle.errors.ts",
		"./src/ayncat.ts",
	])
		.pipe(concat("index.ts"))
		.pipe(tsProject());

	return merge2([
		result.dts.pipe(dest("dist")),
		result.js.pipe(uglify()).pipe(dest("dist")),
	]);
};

module.exports = { build };
