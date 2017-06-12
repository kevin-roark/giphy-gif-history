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
    this.wallMaterialCanvas = document.createElement('canvas')
    this.wallMaterialCanvas.width = this.wallMaterialCanvas.height = 2048

    let ctx = this.wallMaterialCanvas.getContext('2d')
    let grd = this.wallGradient = ctx.createLinearGradient(0, 0, 0, 2048)
    grd.addColorStop(0, '#E646B6')
    grd.addColorStop(0.5, '#93F')
    grd.addColorStop(1, '#6157FF')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 2048, 2048)

    this.wallMaterialTexture = new THREE.Texture(this.wallMaterialCanvas)
    this.wallMaterialTexture.needsUpdate = true

    this.basicGreyMaterial = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      color: 0xcccccc,
      side: THREE.BackSide,
      map: this.wallMaterialTexture
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
    far.position.set(0, -1, size.z / 2)
    let back = new THREE.Mesh(new THREE.BoxBufferGeometry(size.x, size.y, 1), basicGreyMaterial)
    back.position.set(0, -1, size.z / -2 + 1)
    let left = new THREE.Mesh(new THREE.BoxBufferGeometry(1, size.y, size.z), basicGreyMaterial)
    left.position.set(-size.x / 2 + 1, -1, 0)
    let right = new THREE.Mesh(new THREE.BoxBufferGeometry(1, size.y, size.z), basicGreyMaterial)
    right.position.set(size.x / 2 - 1, -1, 0)
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

    let pointLight2 = this.pointLight2 = new THREE.PointLight(0xffffff, 1, 1000, 1.25)
    pointLight2.name = 'pointlight'
    pointLight2.position.set(0, -170, -45)
    // setupShadow(pointLight2)
    add(pointLight2)
    // pointLight2.add(new THREE.Mesh(
    //   new THREE.SphereBufferGeometry(5),
    //   new THREE.MeshBasicMaterial({ color: 0xff0000 })
    // ))

    let spotLight = this.spotLight = new THREE.SpotLight(0xffffff, 2, 1000, Math.PI / 15)
    spotLight.name = 'spotlight'
    spotLight.position.set(0, 80, 20)
    setupShadow(spotLight)
    add(spotLight)
    add(spotLight.target)
    spotLight.target.position.set(0, 0, -10)
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
