import BinaryIO from '../binary/BinaryIO.mjs'

export default class RoomDistance {
  static readFrom(binary) {
    return {
      distance: binary.readFloat32(), // -1 means use truedist
      startPosition: binary.readVector3(),
      endPosition: binary.readVector3()
    }
  }

  static accumulateFrom(roomDistance) {
    const buffer = Buffer.alloc(this.sizeOf(), 0)
    const binary = new BinaryIO(buffer.buffer)

    binary.writeFloat32(roomDistance.distance)
    binary.writeVector3(roomDistance.startPosition)
    binary.writeVector3(roomDistance.endPosition)

    return buffer
  }

  static sizeOf() {
    return 4 + 3 * 4 + 3 * 4
  }
}
