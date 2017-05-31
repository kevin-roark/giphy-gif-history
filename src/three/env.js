import * as THREE from 'three'

import Orb from './orb'

export default class Env {
  constructor (options = {}) {
    let { size, load = true } = options
    this.size = size || new THREE.Vector3(5000, 500, 5000)

    this.group = new THREE.Group()
    if (load) {
      this.load()
    }
  }

  load () {
    this.loadMaterials()
    this.loadWalls()
    this.loadOrb()
    this.loadLights()

    this.loaded = true
  }

  loadMaterials () {
    this.colorPalette = [0xff0000, 0x0000ff, 0xffffff]

    this.basicGreyMaterial = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      color: 0x666666,
      side: THREE.BackSide
    })
  }

  loadWalls () {
    let { size, basicGreyMaterial } = this

    let far = new THREE.Mesh(new THREE.BoxBufferGeometry(size.x, size.y, 1), basicGreyMaterial)
    far.position.set(0, 0, size.z / 2)
    let back = new THREE.Mesh(new THREE.BoxBufferGeometry(size.x, size.y, 1), basicGreyMaterial)
    back.position.set(0, 0, size.z / -2)
    let left = new THREE.Mesh(new THREE.BoxBufferGeometry(1, size.y, size.z), basicGreyMaterial)
    left.position.set(-size.x / 2, 0, 0)
    let right = new THREE.Mesh(new THREE.BoxBufferGeometry(1, size.y, size.z), basicGreyMaterial)
    right.position.set(size.x / 2, 0, 0)
    let top = new THREE.Mesh(new THREE.BoxBufferGeometry(size.x, 1, size.z), basicGreyMaterial)
    top.position.set(0, size.y / 2, 0)
    let bottom = new THREE.Mesh(new THREE.BoxBufferGeometry(size.x, 1, size.z), basicGreyMaterial)
    bottom.position.set(0, size.y / -2, 0)

    // this.walls = { far, left, right, top, bottom, back }
    this.walls = { bottom }
    for (let wall in this.walls) {
      this.walls[wall].name = `${wall}-wall`
      this.walls[wall].receiveShadow = true
      this.group.add(this.walls[wall])
    }
  }

  loadOrb () {
    this.orb = new Orb()
    this.orb.group.position.set(0, 100, 0)
    this.group.add(this.orb.group)
  }

  loadLights () {
    const add = light => this.group.add(light)

    const setupShadow = light => { // eslint-disable-line
      light.castShadow = true
      light.shadow.mapSize.width = light.shadow.mapSize.height = 512
      light.shadow.camera.far = 1000
    }

    this.ambient = new THREE.AmbientLight(0x888888, 0.5)
    add(this.ambient)

    let pointLight = this.pointLight = new THREE.PointLight(0xffffff, 1, 1000, 1.75)
    pointLight.position.set(0, -80, 50)
    // setupShadow(pointLight)
    // add(pointLight)

    let spotLight = this.spotLight = new THREE.SpotLight(0xffffff, 2, 1000, Math.PI / 3)
    spotLight.position.set(0, 400, 50)
    setupShadow(spotLight)
    add(spotLight)
    add(spotLight.target)
    spotLight.target.position.set(0, 0, 0)
  }

  update (time, delta) {
    if (!this.loaded) {
      return
    }
  }
}
