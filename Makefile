PWD = `pwd`

all: uninstall build install

build:
	bun build ./src/cli.ts --compile --outfile=./dist/envctl

uninstall:
	unlink ~/.bin/envctl

install: build
	ln -s ${PWD}/dist/envctl ~/.bin/envctl

reinstall: uninstall install