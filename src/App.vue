<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </div>
  <a-scene>
    <AFrameCoreComponents />
    <Environment1 />
    <router-view />
  </a-scene>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import AFrameCoreComponents from "@/components/AFrameCoreComponents.vue"; // @ is an alias to /src
import Environment1 from "@/environments/Environment1.vue";

@Options({
  components: {
    AFrameCoreComponents,
    Environment1
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
}

</style>
