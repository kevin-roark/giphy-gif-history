import * as THREE from 'three'
import * as TWEEN from 'tween.js'
import * as Stats from 'stats.js'

import { choice } from '../util'
import { cameraFOV, useControls, dev } from './config'
import Env from './env'
import GifTexture from './gif-texture'
import OrbitControls from './orbit-controls'
import textureManager from './texture-manager'

const TEXT_CANVAS_SIZE = 2048
const TEXT_FONT_SIZE = 600

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

    let yearCanvas = this.yearCanvas = document.createElement('canvas')
    yearCanvas.width = yearCanvas.height = TEXT_CANVAS_SIZE

    let yearCanvasTexture = this.yearCanvasTexture = new THREE.Texture(yearCanvas)

    let pedestal = this.pedestal = new THREE.Mesh(
      new THREE.BoxBufferGeometry(50, 50, 50),
      new THREE.MeshStandardMaterial({
        map: yearCanvasTexture
      })
    )
    pedestal.name = 'PEDESTAL'
    pedestal.receiveShadow = pedestal.castShadow = true
    pedestal.position.set(0, 25, -80)
    scene.add(pedestal)

    let gifCube = this.gifCube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(25, 25, 25),
      new THREE.MeshBasicMaterial({ color: 0x000000 })
    )
    gifCube.name = 'GIF CUBE'
    gifCube.castShadow = true
    gifCube.position.set(0, 45, 10)
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
    this.item = item

    const colors = ['#E646B6', '#6157FF', '#00E6CC', '#FFC636', '#FF6666', '#9933FF', '#00CCFF', '#FFF35C']
    colors.sort(() => Math.random() - 0.5)

    this.env.setFloorColor(colors[0])

    let yearContext = this.yearCanvas.getContext('2d')
    yearContext.fillStyle = colors[1]
    yearContext.fillRect(0, 0, 2048, 2048)

    yearContext.fillStyle = '#fff'
    yearContext.font = `${TEXT_FONT_SIZE}px FuturaBT-Bold`
    let textSize = yearContext.measureText(item.time)
    yearContext.fillText(item.time, TEXT_CANVAS_SIZE / 2 - textSize.width / 2, TEXT_CANVAS_SIZE / 2 - 100)

    this.yearCanvasTexture.needsUpdate = true
    this.pedestal.material.needsUpdate = true

    if (this.gifTexture) {
      this.gifTexture.dispose()
      this.setTexture(null)
    }

    const gif = choice(item.gifs)

    const aspectRatio = gif.width / gif.height
    const xScale = Math.min(1.5, Math.max(aspectRatio, 1))
    const yScale = xScale / aspectRatio
    this.gifCube.scale.set(xScale, yScale, 1)
    this.gifCube.position.y = 40 + 10 * yScale

    this.gifTexture = new GifTexture({
      gif: require(`../assets/gifs/${gif.url}`),
      onLoad: texture => {
        if (item === this.item) {
          this.setTexture(texture)
        }
      },
      onError: err => {
        console.log('Error loading gif:', err)
      }
    })

    this.setupCameraMotion()
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
    let { camera } = this
    if (this.cameraTween) {
      this.cameraTween.stop()
    }

    camera.position.set(0, 150, 200)

    const cameraTarget = new THREE.Vector3(0, 40, -100)
    this.cameraTween = new TWEEN.Tween(camera.position)
      .to({ x: 0, y: 60, z: 20 }, 15000)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .onUpdate(() => {
        camera.lookAt(cameraTarget)
      })
      .start()
  }
}
