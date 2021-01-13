<template>
  <link
    href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"
    rel="stylesheet"
  />
  <a-scene core-bootstrapper hide-on-enter-vr-click="#desktop-cursor">
    <AFrameCoreComponents />
    <router-view />
  </a-scene>
  <div id="nav">
    <router-link to="/environment-1">Environment 1</router-link> |
    <router-link to="/environment-2">Environment 2</router-link> |
    <router-link to="/environment-3">Environment 3</router-link>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import AFrameCoreComponents from "@/components/AFrameCoreComponents.vue"; // @ is an alias to /src

@Options({
  components: {
    AFrameCoreComponents
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  position: absolute;
  z-index: 10;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

a-scene {
  width: 100%;
  height: 100%;
  position: absolute !important;
}
</style>
