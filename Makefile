PWD = `pwd`

all: install

build:
	bun build ./src/bin.ts --compile --outfile=./dist/envctl

install: build
	bun install
