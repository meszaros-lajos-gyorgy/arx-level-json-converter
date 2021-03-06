# arx-level-json-converter

Converts Arx Fatalis level data to JSON and back

## installation

`npm i arx-level-json-converter -g`

This will give you access to `to-json`, `from-json`, `combine` and `separate`

## examples

`--version` will give you the version for any tool

`cat fast.fts | to-json --ext=fts --pretty > fast.fts.json`

`to-json level8.dlf --output=level8.dlf.min.json`

`cat level8.dlf.min.json | from-json --ext=dlf > level8.dlf.repacked`

`from-json fast.fts.json --ext=fts --output=fast.fts.repacked`

`combine fast.fts.json level8.llf.json level8.dlf.json --pretty --output=level8.json`

`combine fast.fts.json level8.llf.json level8.dlf.json --pretty > level8.json`

`separate level8.json --pretty --llf=level8.llf.json --dlf=level8.dlf.json --fts=fast.fts.json`

`cat level8.json | separate --pretty --llf=level8.llf.json --dlf=level8.dlf.json --fts=fast.fts.json`
