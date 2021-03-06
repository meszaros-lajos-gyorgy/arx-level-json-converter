#!/usr/bin/env node --experimental-modules

import fs from 'fs'
import minimist from 'minimist'
import { fileExists, getPackageVersion, streamToBuffer, stringifyJSON } from './helpers.mjs'
import { pluck, unnest, reject, evolve, map, dissoc, reduce, append, assoc } from '../node_modules/ramda/src/index.mjs'
import { isZeroVertex } from '../src/common/helpers.mjs'
import { getCellCoordinateFromPolygon, getPolygons } from '../src/fts/FTS.mjs'

const args = minimist(process.argv.slice(2), {
  string: ['dlf', 'llf', 'fts'],
  boolean: ['version', 'pretty']
});

(async () => {
  if (args.version) {
    console.log(await getPackageVersion())
    process.exit(0)
  }

  let filename = args._[0]

  let hasErrors = false

  let input
  if (filename) {
    if (await fileExists(filename)) {
      input = fs.createReadStream(filename)
    } else {
      console.error('error: input file does not exist')
      hasErrors = true
    }
  } else {
    input = process.openStdin()
  }

  const json = JSON.parse(await streamToBuffer(input))
  const extension = json.meta.type

  if (extension !== 'combined') {
    console.error('error: unsupported meta type, expected "combined"')
    hasErrors = true
  }

  if (hasErrors) {
    process.exit(1)
  }

  const output = {
    dlf: fs.createWriteStream(args.dlf),
    llf: fs.createWriteStream(args.llf),
    fts: fs.createWriteStream(args.fts)
  }

  const numberOfPolygons = json.fts.polygons.length

  const dlf = json.dlf
  dlf.header.numberOfBackgroundPolygons = numberOfPolygons
  dlf.meta = {
    type: 'dlf'
  }
  dlf.scene = {
    name: json.header.name
  }

  output.dlf.write(stringifyJSON(dlf, args.pretty))

  const llf = json.llf
  llf.meta = {
    type: 'llf'
  }
  llf.header.numberOfBackgroundPolygons = numberOfPolygons

  // TODO: refactor this ASAP!!!
  const polygons = (json => {
    const sizeX = json.fts.sceneHeader.sizeX

    // predicting the final location of polygons based on how FTS.mjs calculates cell indices
    const _cells = reduce((cells, polygon) => {
      const cellX = getCellCoordinateFromPolygon('x', polygon)
      const cellY = getCellCoordinateFromPolygon('z', polygon)

      const polygons = cells[cellY * sizeX + cellX].polygons
      const idx = polygons.length
      cells[cellY * sizeX + cellX].polygons = append({ ...polygon }, polygons)
      polygon.idx = idx // TODO: this is a rather ugly hack for getting the indexes into polygons

      return cells
    }, json.fts.cells.map(assoc('polygons', [])), json.fts.polygons)

    return getPolygons(_cells)
  })(json)

  // TODO: generate colors, not just get them from vertices
  llf.colors = pluck('color', reject(isZeroVertex, unnest(pluck('vertices', polygons))))

  output.llf.write(stringifyJSON(llf, args.pretty))

  const fts = json.fts
  fts.meta = {
    type: 'fts'
  }
  fts.header.path = `C:\\ARX\\Game\\${json.header.name}`
  fts.polygons = map(evolve({
    vertices: map(dissoc('color'))
  }), fts.polygons)

  output.fts.write(stringifyJSON(fts, args.pretty))
})()
