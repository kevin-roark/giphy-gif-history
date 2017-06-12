<template>
  <div id="main-screen">
    <ThreeD :timelineItem="timelineItem" />

    <transition name="fade">
      <keep-alive>
        <Timeline
          v-if="!showingAbout"
          :timeline="timeline"
          :timelineIndex="timelineIndex"
          :timelineItem="timelineItem"
          @enterSplash="onEnterSplash"
        />
      </keep-alive>
    </transition>

    <transition name="fade">
      <keep-alive>
        <Splash v-if="showingAbout" @exitSplash="onExitSplash" />
      </keep-alive>
    </transition>
  </div>
</template>

<script>
import timelineData from '../timeline'
import Splash from './Splash'
import Timeline from './Timeline'
import ThreeD from './ThreeD'

export default {
  props: { routeIndex: String },
  components: { Timeline, ThreeD, Splash },
  data: () => ({
    timeline: timelineData,
    showingAbout: true
  }),
  computed: {
    timelineIndex () {
      return Number(this.routeIndex)
    },
    timelineItem () {
      return this.timeline[this.timelineIndex || 0]
    }
  },
  methods: {
    onEnterSplash () {
      this.showingAbout = true
    },
    onExitSplash () {
      this.showingAbout = false
    }
  }
}
</script>

<style scoped>

</style>
