<template>
<div class="timeline-nav">
  <div class="timeline">
    <div
      v-for="item in computedTimeline"
      :class="timelineItemClass(item)"
      :style="timelineItemStyle(item)"
      @click="() => onTimelineItemClick(item)"
      @mouseenter="() => onTimelineItemMouseEnter(item)"
      @mouseleave="() => onTimelineItemMouseLeave(item)"
    >
      <span class="timeline-item-year">{{ item.time }}</span>
    </div>
    <div class="timeline-line" />
  </div>
</div>
</template>

<script>
export default {
  props: {
    timeline: Array,
    timelineIndex: Number
  },
  data: () => ({ hoverItem: null, windowWidth: window.innerWidth }),
  computed: {
    canGoLeft () {
      return this.timelineIndex !== 0
    },
    canGoRight () {
      return this.timelineIndex !== this.timeline.length - 1
    },
    isMobile () {
      return this.windowWidth <= 800
    },
    computedTimeline () {
      if (!this.isMobile) {
        return this.timeline
      }

      // limit to 3 timeline items on mobile
      let startIndex = Math.min(this.timeline.length - 3, Math.max(0, this.timelineIndex - 1))
      return this.timeline.slice(startIndex, startIndex + 3)
    }
  },
  mounted () {
    this.onResize()

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    timelineItemClass (item) {
      const index = this.timeline.indexOf(item)
      return ['timeline-item', { active: index === this.timelineIndex }]
    },
    timelineItemStyle (item) {
      const index = this.timeline.indexOf(item)
      const url = require(`../assets/gifs/${item.gifs[0].url}`)
      if (index === this.timelineIndex || item === this.hoverItem) {
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
    onTimelineItemClick (item) {
      const index = this.timeline.indexOf(item)
      this.moveTo(index)
    },
    onTimelineItemMouseEnter (item) {
      this.hoverItem = item
    },
    onTimelineItemMouseLeave (item) {
      this.hoverItem = null
    },
    onKeyDown (ev) {
      if (ev.keyCode === 37) {
        ev.preventDefault()
        this.moveBack()
      } else if (ev.keyCode === 39) {
        ev.preventDefault()
        this.moveForward()
      }
    },
    onResize () {
      this.windowWidth = window.innerWidth
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

@media only screen and (max-width: 800px) {
  .timeline {
    right: auto;
    top: auto;
    bottom: 20px;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .timeline-item {
    margin: 0 40px;
  }

  .timeline-item-year {
    transform: translateX(-50%);
    top: 65px;
    left: 45%;
    color: #000;
  }

  .timeline-item.active .timeline-item-year, .timeline-item:hover .timeline-item-year {
    left: 45%;
    top: 58px;
    opacity: 1;
  }

  .timeline-line {
    width: 250px;
    height: 8px;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid rgba(97, 87, 255, 0.7);
  }
}
</style>
