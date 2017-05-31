import * as THREE from 'three'

export let loader = new THREE.JSONLoader()

let cache = {}

export function loadModel (modelName, options = {}, callback) {
  let { skinning = false, morphTargets = true, morphTargetCorrection = 0.001 } = options

  loader.load(modelName, (geometry, materials) => {
    if (morphTargetCorrection != null && morphTargetCorrection > 0) {
      geometry.morphTargets.forEach(target => {
        var vertices = target.vertices
        for (var i = 0; i < vertices.length; i++) {
          var vertex = vertices[i]
          vertex.x *= morphTargetCorrection
          vertex.y *= morphTargetCorrection
          vertex.z *= morphTargetCorrection
        }
      })
    }

    // if (!materials) materials = [ new THREE.MeshStandardMaterial() ]

    if (materials) {
      materials.forEach(material => {
        material.opacity = 1
        material.transparent = false
        material.morphTargets = morphTargets
        material.skinning = skinning
      })
    }

    cache[modelName] = { geometry, materials }

    callback(geometry, materials)
  })
}
