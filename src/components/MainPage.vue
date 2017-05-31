<template>
  <div id="main-screen">
    <ThreeD :timelineItem="timelineItem" />

    <div class="timeline-hud">
      <div class="timeline-year">{{ timelineItem.time }}</div>
      <div class="timeline-text">{{ timelineItem.text }}</div>
    </div>

    <TimelineNav
      :timeline="timeline"
      :timelineIndex="timelineIndex"
      @timelineIndexRequest="onTimelineIndexRequest"
    />
  </div>
</template>

<script>
import timelineData from '../timeline'
import TimelineNav from './TimelineNav'
import ThreeD from './ThreeD'

export default {
  components: { TimelineNav, ThreeD },
  data: () => ({
    timeline: timelineData,
    timelineIndex: 0
  }),
  computed: {
    timelineItem () {
      return this.timeline[this.timelineIndex]
    }
  },
  methods: {
    onTimelineIndexRequest (index) {
      this.timelineIndex = index
    }
  }
}
</script>

<style scoped>
.timeline-hud {
  margin-top: 150px;
  color: #fff;
  user-select: none;
}

.timeline-year {
  font-family: Menlo-Regular, monospace;
  font-size: 66px;
  color: #FFFFFF;
  line-height: 66px;
  margin-bottom: 20px;
}

.timeline-text {
  font-family: WorkSans-Regular, Helvetica, sans-serif;
  font-size: 28px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.50);
  max-width: 800px;
}
</style>
