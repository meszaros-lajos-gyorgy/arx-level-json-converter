import BinaryIO from '../binary/BinaryIO.mjs'

export default class EPData {
  static readFrom(binary) {
    const data = {
      px: binary.readInt16(),
      py: binary.readInt16(),
      idx: binary.readInt16()
    }

    binary.readInt16()

    return data
  }

  static accumulateFrom(polygon) {
    const buffer = Buffer.alloc(this.sizeOf(), 0)
    const binary = new BinaryIO(buffer.buffer)

    binary.writeInt16(polygon.px)
    binary.writeInt16(polygon.py)
    binary.writeInt16(polygon.idx)

    binary.writeInt16(0)

    return buffer
  }

  static sizeOf() {
    return 4 * 2
  }
}
