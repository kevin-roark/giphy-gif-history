<template>
  <div class="splash" :style="splashStyle">
    <h1 class="title" :style="titleStyle">History of the GIF</h1>

    <div class="enter-container">
      <div>
        <h2 class="presented-by">Presented By</h2>
        <div class="logos">
          <a class="logo" href="https://giphy.art" target="_blank">
            <img class="giphy-arts" src="static/img/giphy-arts-logo.png" alt="Giphy Arts" />
          </a>
          <a class="logo" href="https://computerlab.io" target="_blank">
            <img class="computer-lab" src="static/img/computer-lab-logo.png" alt="Computer Lab" />
          </a>
        </div>
      </div>

      <div class="timeline-link" @click="onEnterClick">ENTER</div>
    </div>

    <div class="credits">
      <ul class="credits-list">
        <li style="margin-bottom: 8px;">
          Contributions by: Celine Katzman, Michael Worthy
        </li>
        <li>
          Website by:
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
    rainbowColor: { r: 0, g: 0, b: 0 },
    windowWidth: 1000
  }),
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize)

    let color = new THREE.Color()
    let hue = 0
    this.rainbowInterval = setInterval(() => {
      hue += 0.002
      color.setHSL(hue, 1, 0.6)
      this.rainbowColor = { r: Math.round(color.r * 255), g: Math.round(color.g * 255), b: Math.round(color.b * 255) }

      if (hue >= 1) {
        hue = 0
      }
    }, 20)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)

    clearInterval(this.rainbowInterval)
  },
  computed: {
    splashStyle () {
      let c = this.rainbowColor
      let bgColor = `rgba(${c.r}, ${c.g}, ${c.b}, 0.25)`
      return { background: bgColor }
    },
    titleStyle () {
      if (this.windowWidth <= 800) {
        return null
      }

      let c = this.rainbowColor
      let color = `rgb(${c.r}, ${c.g}, ${c.b})`
      return { borderBottom: `5px solid ${color}` }
    }
    // enterStyle () {
    //   let c = this.rainbowColor
    //   let color = `rgb(${c.r}, ${c.g}, ${c.b})`
    //   return { background: color }
    // }
  },
  methods: {
    onResize () {
      this.windowWidth = window.innerWidth
    },
    onEnterClick () {
      this.$emit('exitSplash')
    }
  }
}
</script>

<style scoped>
.splash {
  position: fixed;
  top: 50px; left: 50%;
  transform: translateX(-50%);
  max-height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 20px 20px 20px 40px;
  border-radius: 4px;
  box-shadow: 0 2px 6px 0 rgba(0,0,0,0.80);
}

.title {
  margin: 0 40px 0 40px;
  padding: 0;
  font-family: 'FuturaBT-Bold', Menlo, WorkSans-Regular, Helvetica, Arial, sans-serif;
  font-size: 84px;
  font-weight: normal;
  white-space: pre;
  color: #fff;
}

.enter-container {
  margin-top: 40px;
  text-align: center;
}

.presented-by {
  margin: 0;
  padding: 0;
  font-family: 'FuturaBT-Bold', Menlo, WorkSans-Regular, Helvetica, Arial, sans-serif;
  font-size: 32px;
  font-weight: normal;
  color: #eee;
  text-decoration: underline;
}

.logos {
  margin: 40px 0 20px 0;
  vertical-align: top;
}

.logo {
  display: inline-block;
  margin: 0 0 0 0;
  padding: 0;
  position: relative;
  vertical-align: top;
}

.logo img {
  height: 244px;
}

.giphy-arts {
  transform: translate(-15px, -16px);
}

img.computer-lab {
  height: 220px;
}

.credits-list {
  float: right;
  max-width: 70%;
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
  padding: 20px 80px;
  border-radius: 4px;
  text-align: center;
  background: #000;
  color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  border: 2px solid transparent;
  font-family: 'FuturaBT-Bold', Menlo, WorkSans-Regular, Helvetica, Arial, sans-serif;
  font-size: 36px;
  letter-spacing: 1 px;
  cursor: pointer;
}
  .timeline-link:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
  }

@media only screen and (max-width: 800px) {
  .splash {
    top: 10px;
    left: 10px;
    width: calc(100vw - 50px);
    max-height: calc(100vh - 20px);
    transform: none;
    padding: 15px;
  }

  .title {
    margin: 0;
    font-size: 48px;
    white-space: normal;
  }

  .enter-container {
    margin-top: 20px;
  }

  .logo img {
    height: 100px;
  }

  .giphy-arts {
    transform: translate(-7px, -4px);
  }

  img.computer-lab {
    height: 90px;
  }

  .timeline-link {
    padding: 20px 60px;
  }
}
</style>
