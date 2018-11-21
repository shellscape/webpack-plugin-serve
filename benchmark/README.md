# [WIP] Development server benchmarks
> This is a first draft, updates are going to be made into this folder to be able to run automatically all the benchmarks without having to manually run each of them.

## Usage
There are 3 servers available:
* `webpack-serve (ws)`
* `webpack-dev-server (wds)`
* `webpack-plugin-serve (wps)`

To run any of them, just run `npm run` + name of server (first initial letters).

> E.g: `npm run ws`

## Results

`GOT = general output time`

Results for 9 modules: 

|X |GOT|Plugins|
|---|---|---|
|WPS|1.23s|0.025s|
|WDS|1.44s|-|
|WS|1.29s|-|

Results for 14 modules:

|X |GOT|Plugins|
|---|---|---|
|WPS|1.31s|0.025s|
|WDS|1.61s|-|
|WS|1.58s|-|


## Computer specs
Intel® Core™ i5-4200U CPU @ 1.60GHz × 4<br/>
Ubuntu 18.04 LTS<br/>
8gb Ram DDR3
