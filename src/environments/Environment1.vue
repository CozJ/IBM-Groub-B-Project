<template>
  <a-box color="red" position="0 2 -5" rotation="0 45 45" scale="2 2 2"></a-box>
  <a-entity obj-model="obj: #obj; mtl: #mtl;" position="-3 2 0" scale="5 5 5"></a-entity>

  <a-assets>
    <a-assets-item id="mtl" :src="require('../assets/Room/materials.mtl')"></a-assets-item>
    <a-assets-item id="obj" :src="require('../assets/Room/model.obj')"></a-assets-item>
  </a-assets>

</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

import AFrameAsset from "@/components/AFrameAsset.vue"; // @ is an alias to /src

@Options({
  components: {
    AFrameAsset
  }
})
export default class Environment1 extends Vue {
  msg!: string;
}
</script>
