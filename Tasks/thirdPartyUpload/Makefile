# Define the test files
TEST_FILES := test_upload_test_results.py test_utils.py test_azure_utils.py

# Define the default target
.PHONY: test

js-install: 
	npm install

python-install:
	pip3 install -r requirements.txt
	pip3 install -r dev-requirements.txt

install-all: js-install python-install 

test-all: test-python test-js

test-python:
	pytest $(TEST_FILES)
	
test-js:
	npx jest

	