<template>
  <div id="app">
    <div v-if="!connected" class="connection-status">Connecting...</div>

    <ThreeD />
    <Hud />
  </div>
</template>

<script>
import Hud from './components/Hud'
import ThreeD from './components/ThreeD'
import socket from './util/socket'

export default {
  name: 'app',
  components: { Hud, ThreeD },
  data () {
    return { connected: false, scoreboard: [] }
  },
  mounted () {
    socket.on('connect', () => {
      this.connected = true
    })
    socket.on('disconnect', () => {
      this.connected = false
    })
  }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.connection-status {
  position: fixed;
  top: 10px;
  left: 10px;
  color: #f00;
  font-size: 24px;
}
</style>
