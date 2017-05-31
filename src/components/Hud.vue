<template>
<div class="hud">
  ORB WORLD
</div>
</template>

<script>
import socket from '@/util/socket'

export default {
  mounted () {
    socket.on('orb', () => {
      console.log('orb!!')
    })
  }
}
</script>

<style scoped>
.hud {
  position: fixed;
  top: 0; left: 0;
  color: #000;
  font-family: monospace;
  font-size: 100px;
  user-select: none;
}
</style>
