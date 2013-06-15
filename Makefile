
build: components index.js
	@component build --dev

components: component.json
	@component install --dev

test: build node_modules
	@./node_modules/.bin/mocha -R spec

node_modules: package.json
	@npm install

clean:
	rm -fr build components template.js node_modules

.PHONY: clean test
