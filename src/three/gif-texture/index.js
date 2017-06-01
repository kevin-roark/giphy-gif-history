
import * as THREE from 'three'
import SuperGif from './supergif'

class GifTexture {
  constructor (options) {
    let { gif, width, height, onLoad, onError } = options
    this.width = width
    this.height = height
    this.onLoad = onLoad
    this.onError = onError

    // load gif
    if (typeof gif === 'string') {
      let image = new window.Image()
      image.onload = () => {
        this.handleImageLoad(image)
      }

      image.style.display = 'none'
      image.src = gif
    } else if (gif instanceof window.Image) {
      if (gif.naturalWidth !== undefined && gif.naturalWidth > 0) {
        // already loaded
        this.handleImageLoad(gif)
      } else {
        gif.addEventListener('load', () => {
          this.handleImageLoad(gif)
        })
      }
    } else {
      throw new Error(`Supplied "gif" option of unsupported type: ${gif}`)
    }
  }

  getTexture () {
    return this.texture
  }

  isPlaying () {
    if (!this.superGif) {
      return false
    }

    return this.superGif.get_playing()
  }

  play () {
    if (this.superGif) {
      return this.superGif.play()
    }
  }

  pause () {
    if (this.superGif) {
      return this.superGif.pause()
    }
  }

  toggle () {
    if (this.isPlaying()) {
      this.pause()
    } else {
      this.play()
    }
  }

  dispose () {
    if (this.texture) {
      this.texture.dispose()
      this.texture = null
    }

    if (this.superGif) {
      this.superGif.dispose()
      this.superGif = null
    }
  }

  handleImageLoad (image) {
    let { width = image.width, height = image.height, onLoad, onError } = this

    if (!image.naturalWidth && !image.naturalHeight) {
      if (onError) {
        onError('GIF failed to load')
      }
      return
    }

    width = nearestPow2(width)
    height = nearestPow2(height)

    let superGif = this.superGif = new SuperGif({
      gif: image,
      c_w: width,
      c_h: height,
      onFrameChange: this.onFrameChange.bind(this)
    })

    superGif.load(() => {
      let canvas = superGif.get_canvas()
      canvas.width = width
      canvas.height = height

      let texture = this.texture = new THREE.Texture(canvas)
      if (onLoad) {
        onLoad(texture)
      }
    })
  }

  // called by SuperGif whenever the frame of the gif updates
  onFrameChange () {
    if (this.texture) {
      // tell threejs to redraw the texture
      this.texture.needsUpdate = true
    }
  }
}

export default GifTexture

function nearestPow2 (aSize) {
  return Math.pow(2, Math.round(Math.log(aSize) / Math.log(2)))
}
