bump:
	@echo "Have you bumped the version in the task.json file? (y/n)"
	@read answer && if [ "$$answer" = "y" ]; then \
		npx tfx-cli extension create --manifest-globs vss-extension.json --rev-version; \
	else \
		echo "Please bump the version first in task.json file."; \
	fi

publish:
	npx tfx-cli extension publish --manifest-globs vss-extension.json --rev-version --share-with christianpfarher