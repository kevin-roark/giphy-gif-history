<template>
<div class="timeline-nav">
  <div class="timeline">
    <div
      v-for="(item, index) in timeline"
      :class="timelineItemClass(item, index)"
      :style="timelineItemStyle(item, index)"
      @click="() => onTimelineItemClick(index)"
      @mouseenter="() => onTimelineItemMouseEnter(index)"
      @mouseleave="() => onTimelineItemMouseLeave(index)"
    >
      <span class="timeline-item-year">{{ item.time }}</span>
    </div>
    <div class="timeline-line" />
  </div>
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
  data: () => ({ hoverIndex: null }),
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
    timelineItemClass (item, index) {
      return ['timeline-item', { active: index === this.timelineIndex }]
    },
    timelineItemStyle (item, index) {
      const url = require(`../assets/gifs/${item.gifs[0].url}`)
      if (index === this.timelineIndex || index === this.hoverIndex) {
        return { backgroundImage: `url(${url})` }
      }
      return { backgroundColor: '#fff' }
    },
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
    onTimelineItemClick (index) {
      this.moveTo(index)
    },
    onTimelineItemMouseEnter (index) {
      this.hoverIndex = index
    },
    onTimelineItemMouseLeave (index) {
      this.hoverIndex = null
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

.timeline {
  position: fixed;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.timeline-item {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 100% 100%;
  margin: 8px 0;
  cursor: pointer;
  transform: scale(0.5, 0.5);
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.80);
  transition: all 0.2s;
}

.timeline-item:not(.active):hover {
  transform: scale(0.8, 0.8);
}

.timeline-item.active {
  transform: scale(1, 1);
  box-shadow: 0 2px 6px 0 #FF6666;
}

.timeline-item-year {
  position: absolute;
  top: 25px;
  left: -14px;
  transform: translate(-100%, -50%);
  white-space: nowrap;
  color: #fff;
  font-family: Menlo-Regular, monospace;
  font-size: 24px;
  opacity: 0.9;
  transition: all 0.2s;
}

.timeline-item.active .timeline-item-year, .timeline-item:hover .timeline-item-year {
  left: -7px;
  opacity: 1;
}

.timeline-line {
  position: absolute;
  top: 30px;
  height: calc(100% - 60px);
  left: 20px;
  width: 8px;
  background: #fff;
  border: 1px solid #6157FF;
  z-index: -1;
}

button {
  position: absolute;
  top: 0;
  background: #fff;
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
