import * as THREE from 'three'
import * as TWEEN from 'tween.js'
import * as Stats from 'stats.js'

import { choice } from '../util'
import { cameraFOV, useControls, dev } from './config'
import Env from './env'
import GifTexture from './gif-texture'
import OrbitControls from './orbit-controls'
import textureManager from './texture-manager'

const TEXT_CANVAS_SIZE = { w: 1024, h: 2048 }
const TEXT_FONT_SIZE = 320

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
      this.setTexture(null)

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          this.updatePedestal(this.item, this.pedestalColor)
        })
      }

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
    yearCanvas.width = TEXT_CANVAS_SIZE.w
    yearCanvas.height = TEXT_CANVAS_SIZE.h
    let yearCanvasTexture = this.yearCanvasTexture = new THREE.Texture(yearCanvas)
    let yearCanvasMaterial = this.yearCanvasMaterial = new THREE.MeshStandardMaterial({
      map: yearCanvasTexture,
      roughness: 1,
      metalness: 0.4
    })

    let standardPedestalMaterial = this.standardPedestalMaterial = new THREE.MeshStandardMaterial()

    let pedestal = this.pedestal = new THREE.Mesh(
      new THREE.BoxBufferGeometry(20, 40, 20),
      [
        standardPedestalMaterial,
        standardPedestalMaterial,
        standardPedestalMaterial,
        standardPedestalMaterial,
        yearCanvasMaterial,
        standardPedestalMaterial
      ]
    )
    pedestal.name = 'PEDESTAL'
    pedestal.receiveShadow = pedestal.castShadow = true
    pedestal.position.set(0, 25, -80)
    scene.add(pedestal)

    let gifCube = this.gifCube = new THREE.Mesh(
      new THREE.BoxBufferGeometry(25, 25, 25),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    gifCube.name = 'GIF CUBE'
    gifCube.castShadow = true
    gifCube.position.set(0, 39, 20)
    // new TWEEN.Tween(gifCube.rotation).to({ y: Math.PI * 2 }, 15000).repeat(Infinity).start()
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
    this.gif = choice(item.gifs)

    const colors = ['#E646B6', '#6157FF', '#00E6CC', '#FFC636', '#FF6666', '#9933FF', '#00CCFF', '#FFF35C']
    colors.sort(() => Math.random() - 0.5)

    this.env.setFloorColor(colors[0])

    this.updatePedestal(item, colors[1])

    if (this.gifTexture) {
      this.gifTexture.dispose()
      this.setTexture(null)
    }

    if (item) {
      const gif = this.gif

      const scale = this.getScale(gif)
      this.gifCube.scale.set(scale.x, scale.y, scale.z)
      this.gifCube.position.y = 39 + 10 * scale.y

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
    } else {
      this.camera.position.set(0, 150, 200)
      this.camera.lookAt(new THREE.Vector3(0, 40, -100))
    }
  }

  updatePedestal (item, color = '#6157FF') {
    this.pedestalColor = color

    let yearContext = this.yearCanvas.getContext('2d')
    yearContext.fillStyle = color
    yearContext.fillRect(0, 0, 2048, 2048)

    if (item) {
      yearContext.fillStyle = '#fff'
      yearContext.font = `${TEXT_FONT_SIZE}px FuturaBT-Bold`
      let texts = item.time.split('-')
      texts = texts.map((t, i) => i === 0 && texts.length > 1 ? t + '-' : t)
      let textSize = yearContext.measureText(texts[0])
      let initY = texts.length > 1 ? TEXT_CANVAS_SIZE.h / 2 - 250 : TEXT_CANVAS_SIZE.h / 2 - 90
      texts.forEach((text, i) => {
        let x = TEXT_CANVAS_SIZE.w / 2 - textSize.width / 2
        let y = initY + (i * 400)
        yearContext.fillText(text, x, y)
      })
    }

    this.yearCanvasTexture.needsUpdate = true
    this.yearCanvasMaterial.needsUpdate = true

    this.standardPedestalMaterial.color.set(color)
  }

  getScale (gif = this.gif) {
    if (!gif) {
      gif = { width: 1, height: 1 }
    }

    const aspectRatio = gif.width / gif.height
    const x = Math.min(1.5, Math.max(aspectRatio, 1))
    const y = x / aspectRatio

    return { x, y, z: 1 }
  }

  setTexture (texture) {
    this.hasTexture = !!texture

    if (texture) {
      this.gifCube.material.map = texture
    }

    this.gifCube.material.color.set(texture ? 0xffffff : 0xcccccc)
    this.gifCube.material.needsUpdate = true

    if (this.textureLoadingTween) {
      this.textureLoadingTween.stop()
    }

    let scale = this.getScale(this.gif)
    if (!texture) {
      scale.x *= 0.1
      scale.y *= 0.1
      scale.z *= 0.1
    }

    this.textureLoadingTween = new TWEEN.Tween(this.gifCube.scale)
      .to(scale, 600)
      .easing(texture ? TWEEN.Easing.Quadratic.Out : TWEEN.Easing.Quadratic.In)
      .start()
  }

  onResize () {
    let { camera, renderer, container } = this
    let { clientWidth: width, clientHeight: height } = container

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
  }

  update (time, delta) {
    const { loaded, stats, renderer, scene, camera, controls, env, gifCube, hasTexture } = this

    if (dev) {
      stats.begin()
    }

    if (useControls) {
      controls.update()
    }

    if (loaded && delta) {
      env.update(time, delta)

      gifCube.rotation.y += (hasTexture ? 0.0002 : 0.005) * delta
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

    const cameraTarget = new THREE.Vector3(0, 40, -100)
    const tweenTo = (x, y, z, duration) => {
      this.cameraTween = new TWEEN.Tween(camera.position)
        .to({ x, y, z }, duration)
        .easing(TWEEN.Easing.Sinusoidal.Out)
        .onUpdate(() => {
          camera.lookAt(cameraTarget)
        })
        .start()

      return this.cameraTween
    }

    tweenTo(0, 150, 200, 1000).onComplete(() => {
      tweenTo(0, 60, 20, 15000)
    })
  }
}
