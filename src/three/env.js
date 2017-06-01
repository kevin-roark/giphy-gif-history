import * as THREE from 'three'
import * as TWEEN from 'tween.js'

export default class Env {
  constructor (options = {}) {
    let { size, load = true } = options
    this.size = size || new THREE.Vector3(250, 400, 500)

    this.group = new THREE.Group()
    this.group.position.set(0, this.size.y / 2 - 2, 0)
    if (load) {
      this.load()
    }
  }

  load () {
    this.loadMaterials()
    this.loadWalls()
    this.loadLights()

    this.loaded = true
  }

  loadMaterials () {
    this.basicGreyMaterial = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      color: 0x666666,
      side: THREE.BackSide
    })

    this.floorMaterial = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      color: 0x666666,
      side: THREE.BackSide
    })
  }

  loadWalls () {
    let { size, basicGreyMaterial, floorMaterial } = this

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
    let bottom = new THREE.Mesh(new THREE.BoxBufferGeometry(size.x, 1, size.z), floorMaterial)
    bottom.position.set(0, size.y / -2, 0)

    this.walls = { far, left, right, top, bottom, back }
    for (let wall in this.walls) {
      this.walls[wall].name = `${wall}-wall`
      this.walls[wall].receiveShadow = true
      this.group.add(this.walls[wall])
    }
  }

  loadLights () {
    const add = light => this.group.add(light)

    const setupShadow = light => { // eslint-disable-line
      light.castShadow = true
      light.shadow.mapSize.width = light.shadow.mapSize.height = 512
      light.shadow.camera.far = 1000
    }

    this.ambient = new THREE.AmbientLight(0xaaaaaa, 0.5)
    // this.ambient = new THREE.AmbientLight(0xffffff, 0.5)
    add(this.ambient)

    let pointLight = this.pointLight = new THREE.PointLight(0xffffff, 1, 666, 1.25)
    pointLight.name = 'pointlight'
    pointLight.position.set(0, 150, 0)
    // setupShadow(pointLight)
    add(pointLight)

    let spotLight = this.spotLight = new THREE.SpotLight(0xffffff, 2, 1000, Math.PI / 15)
    spotLight.name = 'spotlight'
    spotLight.position.set(0, 80, 50)
    setupShadow(spotLight)
    add(spotLight)
    add(spotLight.target)
    spotLight.target.position.set(0, 0, 0)
    new TWEEN.Tween(spotLight.position)
      .to({ x: -10, z: -50, y: 40 }, 6000)
      .easing(TWEEN.Easing.Bounce.InOut)
      .yoyo(true)
      .repeat(Infinity)
      // .start()
  }

  update (time, delta) {
    if (!this.loaded) {
      return
    }
  }

  setFloorColor (color) {
    this.floorMaterial.color.set(color)
  }
}
