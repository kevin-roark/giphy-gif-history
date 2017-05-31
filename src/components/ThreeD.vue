<template>
  <div class="three-d" ref="div"></div>
</template>

<script>
import * as TWEEN from 'tween.js'
import socket from '../util/socket'
import ThreeBase from '../three'

export default {
  data: () => ({ mountCount: 0 }),
  mounted () {
    this.mountCount += 1

    this.threeBase = new ThreeBase(this.$refs.div)
    this.threeBase.load().then(() => {
      socket.on('orb', this.onOrb)

      if (this.mountCount === 1) {
        this.update()
      }
    })
  },
  beforeDestroy () {
    socket.off('orb', this.onOrb)

    this.threeBase.destruct()
  },
  methods: {
    onOrb (orb) {
      console.log('3D orb!!!!!!!!!!')
    },
    update (time) {
      requestAnimationFrame(this.update)
      if (!this.lastTime) this.lastTime = time

      const delta = time - this.lastTime

      TWEEN.update(time)
      this.threeBase.update(time, delta)

      this.lastTime = time
    }
  }
}
</script>

<style scoped>
.three-d, .three-d canvas {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  overflow: none;
}
</style>
