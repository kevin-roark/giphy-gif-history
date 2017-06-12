<template>
<div class="timeline-container">
  <div class="about-link" @click="onAboutClick">About</div>

  <div class="timeline-hud">
    <!-- <div class="timeline-year">{{ timelineItem.time }}</div> -->
    <div v-if="!isMobile || readingText" class="timeline-text" v-html="timelineItem.text" />
  </div>

  <div v-if="isMobile" class="read-button" @click="onReadClick">
    {{ readingText ? 'Stop!' : 'Read!' }}
  </div>

  <TimelineNav
    :timeline="timeline"
    :timelineIndex="timelineIndex"
    @timelineIndexRequest="onTimelineIndexRequest"
  />
</div>
</template>

<script>
import TimelineNav from './TimelineNav'
export default {
  components: { TimelineNav },
  props: ['timeline', 'timelineIndex', 'timelineItem'],
  data: () => ({ windowWidth: 1000, readingText: false }),
  computed: {
    isMobile () {
      return this.windowWidth <= 800
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  methods: {
    onResize () {
      this.windowWidth = window.innerWidth
    },
    onTimelineIndexRequest (index) {
      this.$router.push(`/timeline/${index}`)
    },
    onAboutClick () {
      this.$emit('enterSplash')
    },
    onReadClick () {
      this.readingText = !this.readingText
    }
  }
}
</script>

<style scoped>
.about-link {
  position: fixed;
  top: 5px;
  right: 5px;
  color: #fff;
  text-decoration: underline;
  font-size: 12px;
  cursor: pointer;
}

.timeline-hud {
  margin-top: 50px;
  color: #fff;
  user-select: none;
}

.timeline-year {
  font-family: 'FuturaBT-Bold', Menlo, WorkSans-Regular, Helvetica, Arial, sans-serif;
  font-size: 66px;
  color: #fff;
  line-height: 66px;
  margin-bottom: 20px;
}

.timeline-text {
  font-family: 'FuturaBT-Book', WorkSans-Regular, Helvetica, Arial, sans-serif;
  font-size: 28px;
  background: rgba(0, 0, 0, 0.05);
  text-shadow: 0 2px 4px rgba(0,0,0,0.50);
  max-width: 33%;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 10px;
}

@media only screen and (max-width: 800px) {
  .timeline-hud {
    margin-top: 50px;
  }

  .timeline-text {
    background: rgba(0, 0, 0, 0.5);
    max-width: 100%;
    max-height: calc(100vh - 180px);
  }

  .read-button {
    box-sizing: border-box;
    cursor: pointer;
    background: #000;
    color: #fff;
    position: fixed;
    left: 0;
    top: 0;
    padding: 8px;
    font-family: 'FuturaBT-Book', WorkSans-Regular, Helvetica, Arial, sans-serif;
    font-size: 16px;
  }
}
</style>
