import * as THREE from 'three'
import * as TWEEN from 'tween.js'
import * as Stats from 'stats.js'

import { cameraFOV, useControls, dev } from './config'
import Env from './env'
import OrbitControls from './orbit-controls'
import Person from './person'
import textureManager from './texture-manager'

export default class ThreeBase {
  constructor (container = document.body) {
    this.container = container
    this.people = []
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
      this.addInitialPeople()

      this.loaded = true
      return this
    })
  }

  setupThree () {
    let { container } = this

    const renderer = this.renderer = new THREE.WebGLRenderer({
      // antialias: true
    })
    // renderer.autoClear = false
    renderer.setClearColor(0xbbddff)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    container.appendChild(renderer.domElement)

    let scene = this.scene = new THREE.Scene()

    let camera = this.camera = new THREE.PerspectiveCamera(cameraFOV, window.innerWidth / window.innerHeight, 1, 10000)
    camera.position.set(0, 200, 300)

    let env = this.env = new Env({ renderer, scene })
    env.group.position.y = env.size.y / 2 - 50
    scene.add(env.group)

    if (useControls) {
      let controls = this.controls = new OrbitControls(camera, renderer.domElement)
      controls.target.set(0, 0, 0)
    } else {
      let cameraParent = this.cameraParent = new THREE.Object3D()
      cameraParent.add(camera)
      scene.add(cameraParent)

      this.setupCameraMotion()
    }

    this.onResize()
    window.addEventListener('resize', this.onResize)

    window.THREE = THREE
    window.renderer = renderer
    window.scene = scene
    window.camera = camera
  }

  destruct () {
    window.removeEventListener('resize', this.onResize)

    if (this.renderer) {
      const el = this.renderer.domElement
      el.parentNode.removeChild(el)
    }
  }

  onResize () {
    let { camera, renderer, container } = this
    let { clientWidth: width, clientHeight: height } = container

    camera.aspect = width / height
    camera.updateProjectionMatrix()

    renderer.setSize(width, height)
  }

  update (time, delta) {
    const { loaded, stats, renderer, scene, camera, controls, people, env } = this

    if (dev) {
      stats.begin()
    }

    if (useControls) {
      controls.update()
    }

    if (loaded) {
      env.update(time, delta)

      for (let i = people.length - 1; i > -1; i--) {
        people[i].update(time, delta)
      }
    }

    if (dev) {
      stats.end()
    }

    renderer.render(scene, camera)
  }

  setupCameraMotion () {
    let { cameraParent } = this

    this.cameraMotionTween = new TWEEN.Tween(cameraParent.rotation)
      .to({ y: Math.PI * 2 }, 30000)
      .repeat(Infinity)
      .start()
  }

  addInitialPeople () {
    for (let i = 0; i < 10; i++) {
      let person = new Person(`person ${i}`)
      person.group.position.set(0, -48, 0)
      this.scene.add(person.group)
      this.people.push(person)
      person.load()
    }
  }
}
