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
  font-family: 'FuturaBT-Book', WorkSans-Regular, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  color: inherit;
  text-decoration: underline;
  transition: filter 0.2s;
}

::selection {
  background: #ff0;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s linear;
}
.fade-enter, .fade-leave-to {
  opacity: 0
}

.question {
  font-family: 'FuturaBT-Bold', Menlo, WorkSans-Regular, Helvetica, Arial, sans-serif;
  margin-bottom: 10px;
}
</style>
