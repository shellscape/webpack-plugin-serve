# [WIP] Development server benchmarks
> This is a first draft, updates are going to be made into this folder to be able to run automate all the benchmarks without having to manually run each of them.

## Usage
There are 3 servers available:
* `webpack-serve (ws)`
* `webpack-dev-server (wds)`
* `webpack-plugin-serve (wps)`

To run any of them, just run `npm run` + name of server (first initial letters).

> E.g: `npm run ws`

## Results

`GOT = general output time`

|X |GOT|Plugins|Loaders|
|---|---|---|---|
|WPS|0.117s|0.024s|0.016s|
|WDS|0.474s|-|0.355s|
|WS|0.289s|-|0.148s|

## Computer specs
Intel® Core™ i5-4200U CPU @ 1.60GHz × 4<br/>
Ubuntu 18.04 LTS<br/>
8gb Ram DDR3
