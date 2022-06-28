const { build } = require("esbuild");
const glob = require("glob");
const entryPoints = glob.sync("./src/**/*.ts"); // 適宜読み替えてください

const fs = require("fs");
let jsdomPatch = {
  name: "jsdom-patch",
  setup(build) {
    build.onLoad(
      { filter: /jsdom\/living\/xhr\/XMLHttpRequest-impl\.js$/ },
      async (args) => {
        let contents = await fs.promises.readFile(args.path, "utf8");

        contents = contents.replace(
          'const syncWorkerFile = require.resolve ? require.resolve("./xhr-sync-worker.js") : null;',
          `const syncWorkerFile = "${require.resolve(
            "jsdom/lib/jsdom/living/xhr/xhr-sync-worker.js"
          )}";`
        );

        return { contents, loader: "js" };
      }
    );
  },
};

build({
  entryPoints,
  bundle: true,
  outbase: "./src", // outbaseを指定することで指定したディレクトリの構造が出力先ディレクトリに反映されるようになる,
  outdir: "./dist", // 出力先ディレクトリ
  platform: "node", // 'node' 'browser' 'neutral' のいずれかを指定,
  external: ["vscode", "canvas"], // バンドルに含めたくないライブラリがある場合は、パッケージ名を文字列で列挙する,
  watch: false, // trueにすれば、ファイルを監視して自動で再ビルドしてくれるようになる
  plugins: [jsdomPatch],
});
