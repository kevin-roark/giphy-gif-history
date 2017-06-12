<template>
  <div class="splash" :style="splashStyle">
    <h1 class="title">History of the GIF</h1>

    <h2 class="presented-by">Presented By</h2>
    <img class="logo giphy-arts" src="static/img/giphy-arts.png" alt="Giphy Arts" />

    <div class="timeline-link" @click="onEnterClick">ENTER</div>

    <div class="credits">
      <ul class="credits-list">
        <li>Text by: Celine</li>
        <li>
          Website by:
          <a href="https://computerlab.io/" target="_blank">Computer Lab</a> &amp;
          <a href="http://www.kevinroark.com" target="_blank">Kevin Roark</a>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import * as THREE from 'three'

export default {
  data: () => ({
    rainbowColor: { r: 0, g: 0, b: 0 }
  }),
  mounted () {
    let color = new THREE.Color()
    let hue = 0
    this.rainbowInterval = setInterval(() => {
      hue += 0.002
      color.setHSL(hue, 1, 0.75)
      this.rainbowColor = { r: Math.round(color.r * 255), g: Math.round(color.g * 255), b: Math.round(color.b * 255) }

      if (hue >= 1) {
        hue = 0
      }
    }, 20)
  },
  beforeDestroy () {
    clearInterval(this.rainbowInterval)
  },
  computed: {
    splashStyle () {
      let c = this.rainbowColor
      let color = `rgb(${c.r}, ${c.g}, ${c.b})`
      let bgColor = `rgba(${c.r}, ${c.g}, ${c.b}, 0.25)`
      return { background: bgColor, border: `2px solid ${color}` }
    }
  },
  methods: {
    onEnterClick () {
      this.$emit('exitSplash')
    }
  }
}
</script>

<style scoped>
.splash {
  box-sizing: border-box;
  position: fixed;
  top: 0; left: 0;
  width: calc(100% - 100px);
  margin: 50px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.80);
}

.title {
  margin: 0 0 40px 0;
  padding: 0;
  font-family: 'FuturaBT-Bold', Menlo, WorkSans-Regular, Helvetica, Arial, sans-serif;
  font-size: 72px;
  font-weight: normal;
}

.presented-by {
  margin: 0 0 20px 0;
  padding: 0;
  font-family: 'FuturaBT-Bold', Menlo, WorkSans-Regular, Helvetica, Arial, sans-serif;
  font-size: 28px;
  font-weight: normal;
  color: #111;
}

.giphy-arts {
  display: block;
  width: 300px;
  margin: 0 0 40px 0;
  padding: 0;
}

.credits {

}

.credits-list {
  text-align: right;
  list-style: none;
  margin: 60px 0 0 0;
  padding: 0;
}

.credits-list li {
  margin: 0;
  padding: 0;
}

.timeline-link {
  display: inline-block;
  margin-left: 50%;
  transform: translateX(-50%);
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  background: #FFF35C;
  color: #222;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  border: 2px solid #000;
  font-family: 'FuturaBT-Bold', Menlo, WorkSans-Regular, Helvetica, Arial, sans-serif;
  font-size: 36px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
  .timeline-link:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  }
</style>
