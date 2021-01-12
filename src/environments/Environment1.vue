<template>
  <!--Assets-->
  <a-assets>
    <a-assets-item id="asset-mtl" :src="require('../assets/Room/model.mtl')"></a-assets-item>
    <a-assets-item id="asset-obj" :src="require('../assets/Room/model.obj')"></a-assets-item>
    <a-assets-item id="asset-navmesh" :src="require('../assets/Room/navmesh.gltf')"></a-assets-item>
  </a-assets>

  <!--SkyBox-->
  <a-entity environment="preset: starry"></a-entity>

  <!--Objects-->
  <a-box id="test-target-one" body="shape: box" hoverable grabbable draggable droppable color="red" position="0 5 -3" rotation="0 45 45" scale="1 1 1"></a-box>
  <a-entity body="type: static; shape: box" obj-model="obj: #asset-obj; mtl: #asset-mtl;" position="4 -0.2 0" scale="1 1 1"></a-entity>

  <a-entity gltf-model="#asset-navmesh" nav-mesh visible="true" position="4 -0.2 0" scale="1 1 1"></a-entity>

  <!-- Ground collider -->
  <a-box body="type: static; shape: box" width=100 height=1 depth=100 position="0 -0.8 0" visible="false"></a-box>
  
  <!--lights-->
  <a-light type="ambient" intensity="0.6" color="#fff" position="20 20 0"></a-light>

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
