<template>
  <div id="app">
    <MainPage />
  </div>
</template>

<script>
import MainPage from './components/MainPage'

export default {
  name: 'app',
  components: { MainPage }
}
</script>

<style>
#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
