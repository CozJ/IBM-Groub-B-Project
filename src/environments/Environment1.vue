<template>
  <a-box id="test-target-one" body="shape: box" hoverable grabbable draggable droppable color="red" position="0 5 -3" rotation="0 45 45" scale="1 1 1"></a-box>
  <a-entity body="type: static; shape: box" obj-model="obj: #obj; mtl: #mtl;" position="-3 2 0" scale="5 5 5"></a-entity>

  <!-- Ground collider -->
  <a-box body="type: static; shape: box" width=100 height=1 depth=100 position="0 -0.8 0" visible="false"></a-box>

  <a-light color="#aa8" position="10 10 0"></a-light>

  <a-assets>
    <a-assets-item id="mtl" :src="require('../assets/Room/materials.mtl')"></a-assets-item>
    <a-assets-item id="obj" :src="require('../assets/Room/model.obj')"></a-assets-item>
  </a-assets>

</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  components: {
  }
})
export default class Environment1 extends Vue {
}
</script>
