dist:
	mkdir dist
	npm run asbuild:release
	cp pack/* dist
	cp out/release/* dist
	cp package.json dist
	cp package-lock.json dist
	cp README.md dist

publish: dist
	cd dist && npm publish

prerelease: dist
	cd dist && npm publish --tag next