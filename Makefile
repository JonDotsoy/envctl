PWD = `pwd`

build:
	bun build ./src/cli.ts --compile --outfile=./dist/envctl

uninstall:
	rm ~/.bin/envctl

install: build
	ln -s ${PWD}/dist/envctl ~/.bin/envctl

reinstall: uninstall install