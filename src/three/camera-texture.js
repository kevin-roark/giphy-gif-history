import * as THREE from 'three'
import { cameraTextureFOV } from './config'

export default class CameraTexture {
  constructor (options) {
    let {
      renderer, scene,
      renderTargetSize = { width: 2048, height: 2048 },
      cameraProvider = () => {
        return new THREE.PerspectiveCamera(cameraTextureFOV, window.innerWidth / window.innerHeight, 1, 2000)
      }
    } = options

    this.renderer = renderer
    this.scene = scene
    this.renderTargetSize = renderTargetSize
    this.camera = cameraProvider()

    this.cameraParent = new THREE.Object3D()
    this.cameraParent.add(this.camera)
    this.scene.add(this.cameraParent)

    this.renderTarget = new THREE.WebGLRenderTarget(renderTargetSize.width, renderTargetSize.height, {
      format: THREE.RGBFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.NearestFilter
    })

    this.texture = this.renderTarget.texture

    window.addEventListener('resize', this._resize.bind(this))
  }

  _resize () {
    let { renderer, camera } = this
    let { clientWidth: width, clientHeight: height } = renderer.domElement

    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  update () {
    this.renderer.render(this.scene, this.camera, this.renderTarget, true)
  }

  getCameraParent () {
    return this.cameraParent
  }

  getCamera () {
    return this.camera
  }
}
