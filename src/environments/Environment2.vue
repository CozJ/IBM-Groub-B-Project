<template>
  <a-box color="green" position="0 2 -5" rotation="0 45 45" scale="2 2 2"></a-box>
  <a-entity cubemap="folder: /SkyBoxes/"></a-entity>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
})
export default class Environment2 extends Vue {
}
</script>
