<template>
<div class="timeline-container">
  <div class="about-link" @click="onAboutClick">About</div>

  <div v-if="!isMobile || readingText" class="timeline-hud">
    <div v-if="timelineItem.title" class="timeline-title" v-html="timelineItem.title" />
    <div v-else class="timeline-year">{{ timelineItem.time }}</div>
    <div class="timeline-text" v-html="processedText" />
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
    },
    processedText () {
      return this.timelineItem.text
        .replace(/\n\n/g, '\n\n<br /><br />')
        .replace(/<a href/g, '<a target="_blank" href')
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
  border-radius: 2px;
  background: rgba(0, 0, 0, 0.1);
  max-width: 33%;
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  padding: 10px;
}

.timeline-title {
  font-family: 'FuturaBT-Bold', Menlo, WorkSans-Regular, Helvetica, Arial, sans-serif;
  font-size: 48px;
  margin-bottom: 20px;
}

.timeline-year {
  font-family: 'FuturaBT-Bold', Menlo, WorkSans-Regular, Helvetica, Arial, sans-serif;
  font-size: 28px;
  margin-bottom: 12px;
}

.timeline-text {
  font-family: 'FuturaBT-Book', WorkSans-Regular, Helvetica, Arial, sans-serif;
  font-size: 25px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.50);
}

@media only screen and (max-width: 800px) {
  .timeline-hud {
    margin-top: 50px;
    background: rgba(30, 30, 30, 0.7);
    max-width: 100%;
    max-height: calc(100vh - 180px);
  }

  .timeline-title {
    font-size: 32px;
    margin-bottom: 10px;
  }

  .timeline-year {
    font-size: 24px;
    margin-bottom: 8px;
  }

  .timeline-text {
    font-size: 18px;
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
