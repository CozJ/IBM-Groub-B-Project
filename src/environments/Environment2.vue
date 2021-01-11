<template>
  <a-box color="green" position="0 2 -5" rotation="0 45 45" scale="2 2 2"></a-box>
  <a-entity cubemap="folder: /SkyBoxes/"></a-entity>

  <a-light type="point" intensity="0.6" color="#fff" position="-40 -40 20"></a-light>
  <a-light type="ambient" intensity="0.3" color="#fff" position="20 20 0"></a-light>

</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
})
export default class Environment2 extends Vue {
}
</script>
