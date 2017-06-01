<template>
<div class="timeline-nav">
  <button v-if="canGoLeft" class="left-button" @click="onLeftClick">Left</button>
  <button v-if="canGoRight" class="right-button" @click="onRightClick">Right</button>
</div>
</template>

<script>
export default {
  props: {
    timeline: Array,
    timelineIndex: Number
  },
  computed: {
    canGoLeft () {
      return this.timelineIndex !== 0
    },
    canGoRight () {
      return this.timelineIndex !== this.timeline.length - 1
    }
  },
  mounted () {
    window.addEventListener('keydown', this.onKeyDown)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeyDown)
  },
  methods: {
    moveBack () {
      if (this.canGoLeft) {
        this.moveTo(this.timelineIndex - 1)
      }
    },
    moveForward () {
      if (this.canGoRight) {
        this.moveTo(this.timelineIndex + 1)
      }
    },
    moveTo (index) {
      this.$emit('timelineIndexRequest', index)
    },
    onLeftClick () {
      this.moveBack()
    },
    onRightClick () {
      this.moveForward()
    },
    onKeyDown (ev) {
      if (ev.keyCode === 37) {
        ev.preventDefault()
        this.moveBack()
      } else if (ev.keyCode === 39) {
        ev.preventDefault()
        this.moveForward()
      }
    }
  }
}
</script>

<style scoped>
.timeline-nav {
  position: fixed;
  left: 0; bottom: 0;
  width: 100%;
  height: 60px;
  padding: 0 20px 40px 20px;
  box-sizing: border-box;
}

button {
  position: absolute;
  top: 0;
  background: #f00;
  padding: 20px;
  cursor: pointer;
}

.left-button {
  left: 5px;
}

.right-button {
  right: 5px;
}
</style>
