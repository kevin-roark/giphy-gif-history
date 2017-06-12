<template>
<div class="timeline-container">
  <div class="about-link" @click="onAboutClick">About</div>

  <div class="timeline-hud">
    <div class="timeline-year">{{ timelineItem.time }}</div>
    <div class="timeline-text" v-html="timelineItem.text" />
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
  methods: {
    onTimelineIndexRequest (index) {
      this.$router.push(`/timeline/${index}`)
    },
    onAboutClick () {
      this.$emit('enterSplash')
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
  margin-top: 150px;
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
  text-shadow: 0 2px 4px rgba(0,0,0,0.50);
  max-width: 800px;
}
</style>
