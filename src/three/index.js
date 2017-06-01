import * as THREE from 'three'
import * as TWEEN from 'tween.js'
import * as Stats from 'stats.js'

import { choice } from '../util'
import { cameraFOV, useControls, dev } from './config'
import Env from './env'
import GifTexture from './gif-texture'
import OrbitControls from './orbit-controls'
import textureManager from './texture-manager'

export default class ThreeBase {
  constructor (container = document.body) {
    this.container = container
    this.loaded = false

    if (dev) {
      let stats = this.stats = new Stats()
      stats.showPanel(0)
      document.body.appendChild(stats.dom)
    }

    this.onResize = this.onResize.bind(this)
  }

  load () {
    return Promise.all([
      textureManager.loadKnownTextures(),
      this.setupThree()
    ])
    .then(() => {
      this.loaded = true
      return this
    })
  }

  setupThree () {
    const renderer = this.renderer = new THREE.WebGLRenderer({
      // antialias: true
    })
    renderer.autoClear = false
    renderer.setClearColor(0xffffff)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    let scene = this.scene = new THREE.Scene()

    let camera = this.camera = new THREE.PerspectiveCamera(cameraFOV, window.innerWidth / window.innerHeight, 1, 10000)

    this.loadScene()

    if (useControls) {
      let controls = this.controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(0, 0, 0)
    } else {
      let cameraParent = this.cameraParent = new THREE.Object3D()
      cameraParent.add(camera)
      scene.add(cameraParent)

      camera.position.set(0, 60, 20)
      camera.lookAt(new THREE.Vector3(0, 40, -100))

      this.setupCameraMotion()
    }

    this.activate()

    window.THREE = THREE
    window.renderer = renderer
    window.scene = scene
    window.camera = camera
  }

  loadScene () {
    let { scene, renderer } = this

    let env = this.env = new Env({ renderer, scene })
    scene.add(env.group)

    let pedestal = this.pedestal = new THREE.Mesh(
      new THREE.BoxBufferGeometry(34, 50, 50),
      new THREE.MeshStandardMaterial()
    )
    pedestal.name = 'PEDESTAL'
    pedestal.receiveShadow = pedestal.castShadow = true
    pedestal.position.set(0, 25, -100)
    scene.add(pedestal)

    let gifCube = this.gifCube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(25, 25, 25),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    )
    gifCube.name = 'GIF CUBE'
    gifCube.castShadow = true
    gifCube.position.set(0, 45, 18)
    new TWEEN.Tween(gifCube.rotation).to({ y: Math.PI * 2 }, 15000).repeat(Infinity).start()
    pedestal.add(gifCube)
  }

  activate () {
    this.container.appendChild(this.renderer.domElement)

    this.onResize()
    window.addEventListener('resize', this.onResize)
  }

  deactivate () {
    window.removeEventListener('resize', this.onResize)

    if (this.renderer) {
      const el = this.renderer.domElement
      el.parentNode.removeChild(el)
    }
  }

  setTimelineItem (item) {
    const colors = [0xff0000, 0x0000ff, 0xffff00]
    colors.sort(() => Math.random() - 0.5)

    this.env.setFloorColor(colors[0])

    this.pedestal.material.color.set(colors[1])

    if (this.gifTexture) {
      this.gifTexture.dispose()
      this.setTexture(null)
    }

    const gif = choice(item.gifs)
    this.gifTexture = new GifTexture({
      gif: gif.url,
      onLoad: texture => {
        this.setTexture(texture)
      },
      onError: err => {
        console.log('Error loading gif:', err)
      }
    })
  }

  setTexture (texture) {
    this.gifCube.material.map = texture
    this.gifCube.material.color.set(texture ? 0xffffff : 0x000000)
    this.gifCube.material.needsUpdate = true
  }

  onResize () {
    let { camera, renderer, container } = this
    let { clientWidth: width, clientHeight: height } = container

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
  }

  update (time, delta) {
    const { loaded, stats, renderer, scene, camera, controls, env } = this

    if (dev) {
      stats.begin()
    }

    if (useControls) {
      controls.update()
    }

    if (loaded) {
      env.update(time, delta)
    }

    if (dev) {
      stats.end()
    }

    renderer.render(scene, camera)
  }

  setupCameraMotion () {
    // TODO: nice zoom from end of room to beginning
  }
}
