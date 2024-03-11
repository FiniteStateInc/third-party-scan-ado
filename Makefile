bump:
	npx tfx-cli extension create --manifest-globs vss-extension.json --rev-version

publish:
	npx tfx-cli extension publish --manifest-globs vss-extension.json --rev-version --share-with christianpfarher