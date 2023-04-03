# compiles TS to JS
find assembly -type f | grep '.ts$' | xargs -P10 -I {} npm run esbuild {} --  --outdir=dist/js --platform=node --target=node18 --format=esm

# let's find the end of an import statement,
# split the finding into two capture groups,
# combine the two catpure groups and insert '.js'
# there are three capture groups in fact, but the second one (\.\/|\.\.\/)
# is only used for matching the input, not for changing the output
SED_REGEX='s/([\} ]{0,1} from "(\.\/|\.\.\/){1,}[A-Za-z0-9\/]*)(";)/\1.js\3/'

# find all js files within our compiled server code
# and change the relative imports
find dist/js -type f -name '*.js' -exec sed -ri "$SED_REGEX" {} +

# throw error for json encoder
sed -E "s/import \{ JSONEncoder \} from \"\.\.\/node_modules\/assemblyscript-json\/assembly\"/Object.defineProperty(globalThis, \"JSONEncoder\", { get(){ throw new Error(\"Unsupported in JS version\") } });/" dist/js/storageInfo.js > dist/js/storageInfo.js1

# overwrite content
mv dist/js/storageInfo.js1 dist/js/storageInfo.js