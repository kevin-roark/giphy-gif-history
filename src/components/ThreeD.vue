<template>
  <div class="three-d" ref="div"></div>
</template>

<script>
import * as TWEEN from 'tween.js'
import ThreeBase from '../three'

export default {
  props: { timelineItem: Object },
  data: () => ({ mountCount: 0 }),
  mounted () {
    this.mountCount += 1
    if (this.mountCount === 1) {
      this.threeBase = new ThreeBase(this.$refs.div)
      this.threeBase.load().then(() => {
        this.threeBase.setTimelineItem(this.timelineItem)
        this.update()
      })
    } else {
      this.threeBase.activate()
      this.threeBase.setTimelineItem(this.timelineItem)
    }

    this.$watch('timelineItem', item => {
      this.threeBase.setTimelineItem(item)
    })
  },
  beforeDestroy () {
    this.threeBase.deactivate()
  },
  methods: {
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
  z-index: -1;
}
</style>
