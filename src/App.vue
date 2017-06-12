<template>
  <div id="app">
    <router-view></router-view>
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
  font-family: WorkSans-Regular, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: inherit;
  text-decoration: underline;
}

a:hover, a:focus {
  filter: invert(1);
}
</style>
