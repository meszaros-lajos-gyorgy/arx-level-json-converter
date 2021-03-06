import BinaryIO from '../binary/BinaryIO.mjs'
import { repeat } from '../../node_modules/ramda/src/index.mjs'

export default class Scene {
  static readFrom(binary) {
    const data = {
      name: binary.readString(512)
    }

    binary.readInt32Array(16) // pad
    binary.readFloat32Array(16) // fpad

    return data
  }

  static accumulateFrom(json) {
    const buffer = Buffer.alloc(this.sizeOf(), 0)
    const binary = new BinaryIO(buffer.buffer)

    binary.writeString(json.scene.name, 512)
    binary.writeInt32Array(repeat(0, 16))
    binary.writeFloat32Array(repeat(0, 16))

    return buffer
  }

  static sizeOf() {
    return 512 + 4 * 16 + 4 * 16
  }
}
