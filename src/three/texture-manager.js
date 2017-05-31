import * as THREE from 'three'

class TextureManager {
  constructor () {
    this.textureLoader = new THREE.TextureLoader()
    this.textureCubeLoader = new THREE.CubeTextureLoader()
    this.textures = {}
    this.textureCubes = {}
  }

  loadKnownTextures () {
    let textures = [
      // { name: 'trump-1' },
      // { name: 'alex-jones-1', options: { repeatX: 1, repeatY: 2 } }
    ]
    let envMaps = [
      // { name: 'trump-1' }
    ]

    return Promise.all(
      textures.map(t => this.loadNamedTexture(t.name, t.options))
      .concat(envMaps.map(em => this.loadNamedEnvMap(em.name)))
    )
  }

  nameToPath (name) {
    return require(`../assets/${name}.jpg`)
  }

  loadNamedTexture (name, options) {
    return this.loadTexture(this.nameToPath(name, options))
  }

  loadTexture (path, options = {}) {
    return new Promise(resolve => {
      if (this.textures[path]) {
        return resolve(this.textures[path])
      }

      this.textureLoader.load(path, texture => {
        let { wrap = THREE.RepeatWrapping, repeatX = 3, repeatY = 1 } = options
        texture.wrapS = texture.wrapT = wrap
        texture.repeat.set(repeatX, repeatY)

        this.textures[path] = texture
        return resolve(texture)
      })
    })
  }

  loadNamedEnvMap (names, options) {
    let paths = Array.isArray(names) ? names.map(n => this.nameToPath(n)) : this.nameToPath(names)
    return this.loadEnvMap(paths, options)
  }

  loadEnvMap (paths, options = {}) {
    return new Promise(resolve => {
      paths = Array.isArray(paths) ? paths : [paths]
      while (paths.length < 6) {
        paths = paths.concat(paths)
      }
      paths = paths.slice(0, 6)

      let key = paths.join('-')
      if (this.textureCubes[key]) {
        return resolve(this.textureCubes[key])
      }

      let { format = THREE.RGBFormat, mapping = THREE.CubeReflectionMapping } = options
      this.textureCubeLoader.load(paths, textureCube => {
        textureCube.format = format
        textureCube.mapping = mapping

        this.textureCubes[key] = textureCube
        return resolve(textureCube)
      })
    })
  }
}

const textureManager = new TextureManager()

export default textureManager
