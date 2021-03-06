import { times, map } from '../../node_modules/ramda/src/index.mjs'
import BinaryIO from '../binary/BinaryIO.mjs'
import RoomData from './RoomData.mjs'
import EPData from './EPData.mjs'

export default class Room {
  static readFrom(binary) {
    const { numberOfPortals, numberOfPolygons } = RoomData.readFrom(binary)

    return {
      portals: times(() => binary.readInt32(), numberOfPortals),
      polygons: times(() => EPData.readFrom(binary), numberOfPolygons)
    }
  }

  static accumulateFrom(room) {
    const roomData = RoomData.accumulateFrom(room)

    const portals = Buffer.alloc(room.portals.length * 4)
    const binary = new BinaryIO(portals.buffer)
    binary.writeInt32Array(room.portals)

    const polygons = Buffer.concat(map(EPData.accumulateFrom.bind(EPData), room.polygons))

    return Buffer.concat([roomData, portals, polygons])
  }
}
