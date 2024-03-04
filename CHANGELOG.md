# Changelog

## [1.3.0](https://github.com/JonDotsoy/envctl/compare/v1.2.1...v1.3.0) (2024-03-04)


### Features

* **license:** add MIT License and update package.json ([6093389](https://github.com/JonDotsoy/envctl/commit/6093389ed2f30e79064e59d61e0e825d3ca6e345))

## [1.2.1](https://github.com/JonDotsoy/envctl/compare/v1.2.0...v1.2.1) (2024-03-04)


### Bug Fixes

* **subcommands:** Ensure consistent newline endings in CLI messages ([28a38d9](https://github.com/JonDotsoy/envctl/commit/28a38d97b560e02c5ac01e0f83bfb60f217e0a10))

## [1.2.0](https://github.com/JonDotsoy/envctl/compare/v1.1.0...v1.2.0) (2024-03-04)


### Features

* **cli:** add version command to display application version ([635bcee](https://github.com/JonDotsoy/envctl/commit/635bcee98bce42a8ba62391013aafcb45e8573f8))
* **utils:** Add `getPackageJson` utility function ([1183b8b](https://github.com/JonDotsoy/envctl/commit/1183b8ba185c4f4499fc749bde9c7a27749e9a58))

## [1.1.0](https://github.com/JonDotsoy/envctl/compare/v1.0.1...v1.1.0) (2024-03-04)


### Features

* enhance .env file selection for build process ([f40cd35](https://github.com/JonDotsoy/envctl/commit/f40cd351657f68bab18c1a8a51f623677d7f180a))
* **envctl:** support .env.sample files in addition to .env.template ([3341a31](https://github.com/JonDotsoy/envctl/commit/3341a31e23b479af65712ccee5031e7acf62b49f))
* **fig-autocomplete:** update context listing in envctl to use dynamic envs generator ([70e1eb7](https://github.com/JonDotsoy/envctl/commit/70e1eb764e5d9b29259a2a471f86ce8eaa63f42d))


### Bug Fixes

* **envctl:** include .env.example in template search patterns ([2359f91](https://github.com/JonDotsoy/envctl/commit/2359f91a28b4b703b760d73e8fd2aed34a02dd8e))

## [1.0.1](https://github.com/JonDotsoy/envctl/compare/v1.0.0...v1.0.1) (2024-03-04)


### Features

* **cli:** update snapshot for CLI help message ([aca8ef7](https://github.com/JonDotsoy/envctl/commit/aca8ef7908062d9a81d254f45e46de3720a24e27))
* **subcommands:** switch from throwing error to controller messaging in list ([77a15c9](https://github.com/JonDotsoy/envctl/commit/77a15c952939de8a2619ec776f21074a6ed76af6))


### Miscellaneous Chores

* release 1.0.1 ([a765936](https://github.com/JonDotsoy/envctl/commit/a765936a4376fc4ab84fd084cd246a5d7bfd0cb0))

## 1.0.0 (2024-03-03)


### Features

* Add Envctl class for enhanced .env file handling ([28d4d9d](https://github.com/JonDotsoy/envctl/commit/28d4d9dcd9c007d7fe9bd382a9119c060b224760))
* **cli:** add help flag for CLI tool ([4b56b74](https://github.com/JonDotsoy/envctl/commit/4b56b74faa59dfa29a6b77f7d40f5205ca775dc0))
* enhance CLI with new commands and refactor code base ([38dafbd](https://github.com/JonDotsoy/envctl/commit/38dafbdc0838372f8845d701207ac34543cba1d8))
* implement CLI subcommand execution with error handling and messaging ([391a532](https://github.com/JonDotsoy/envctl/commit/391a532940443dc0169a45a9c511abf838614a2e))
* improve code formatting and consistency in bin.ts ([2a1cffc](https://github.com/JonDotsoy/envctl/commit/2a1cffc147517adf273f7cc56e56f8c4bd0f8c31))
* Initialize envctl project with basic CLI ([eae444a](https://github.com/JonDotsoy/envctl/commit/eae444a869cd4275edeef88478f4a02473eea9c4))
* integrate fig ([2b12535](https://github.com/JonDotsoy/envctl/commit/2b12535afa3ec274851b449c0245f3e27734ea30))
* Set package.json to private ([997dd88](https://github.com/JonDotsoy/envctl/commit/997dd88b6ee37b8b4eab98782084435cb24f7c50))
* streamline build process and update command entry ([1b200b4](https://github.com/JonDotsoy/envctl/commit/1b200b4b5d69ac719c23a8e16b947f51d035d12f))
* Update bun.lockb to latest dependencies ([014a61a](https://github.com/JonDotsoy/envctl/commit/014a61a2fbf756da08a011ee5c650b2733b333b5))
* Update README to reflect new file structure and command usage ([f20c5d9](https://github.com/JonDotsoy/envctl/commit/f20c5d9f0acb88c0b73e406c5b01787e8e19698c))
* **utils/tests_tools:** Add utilities for cleaning terminal colors and handling writable streams ([853e9ec](https://github.com/JonDotsoy/envctl/commit/853e9ecc703bd845c8cedf0c0e9a692e427413b5))
* **utils:** Add utilities for workspace & global message handling ([3383797](https://github.com/JonDotsoy/envctl/commit/33837975aae11236aa9d4870ec224363497409c4))
