import BinaryIO from '../binary/BinaryIO.mjs'

export default class UniqueHeader {
  static readFrom(binary) {
    return {
      path: binary.readString(256),
      check: binary.readUint8Array(512)
    }
  }

  static accumulateFrom(uniqueHeader) {
    const buffer = Buffer.alloc(this.sizeOf(), 0)
    const binary = new BinaryIO(buffer.buffer)

    binary.writeString(uniqueHeader.path, 256)
    binary.writeUint8Array(uniqueHeader.check)

    return buffer
  }

  static sizeOf() {
    return 768
  }
}
