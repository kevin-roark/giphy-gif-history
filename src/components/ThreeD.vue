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
      console.log('loading three bassee')
      this.threeBase = new ThreeBase(this.$refs.div)
      this.threeBase.load().then(() => {
        console.log('is loaded')
        this.threeBase.setTimelineItem(this.timelineItem)
        this.update()
      })
    } else {
      console.log('activating!?!')
      this.threeBase.activate()
      this.threeBase.setTimelineItem(this.timelineItem)
    }

    this.$watch('timelineItem', item => {
      console.log('new item!')
      this.threeBase.setTimelineItem(item)
    })

    console.log('mount count', this.mountCount)
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
