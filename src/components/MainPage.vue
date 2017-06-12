<template>
  <div id="main-screen">
    <ThreeD :timelineItem="timelineItem" />

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
import timelineData from '../timeline'
import TimelineNav from './TimelineNav'
import ThreeD from './ThreeD'

export default {
  props: { routeIndex: String },
  components: { TimelineNav, ThreeD },
  data: () => ({
    timeline: timelineData
  }),
  computed: {
    timelineIndex () {
      return Number(this.routeIndex)
    },
    timelineItem () {
      return this.timeline[this.timelineIndex]
    }
  },
  methods: {
    onTimelineIndexRequest (index) {
      this.$router.push(`/timeline/${index}`)
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
