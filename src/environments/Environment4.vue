<template>
  <!--Assets-->
  <a-assets>
    <a-assets-item
      id="room-obj"
      :src="require('../assets/room/SpaceDomesFinished.gltf')"
    ></a-assets-item>
    <a-assets-item
      id="asset-navmesh"
      :src="require('../assets/room/SpaceDomesNavmesh.gltf')"
    ></a-assets-item>

  </a-assets>

  <!-- Skybox -->
  <a-entity
    body="type: static; shape: box"
    cubemap="folder: /PurpleSkybox/" 
  ></a-entity>

  <!--Objects-->
 
 <a-entity
    body="type: static; shape: box"
    gltf-model="#room-obj"
    position="0 0 0"
    scale="1 1 1"
    whiteboard-canvas
  ></a-entity>
  <a-entity
    gltf-model="#asset-navmesh"
    nav-mesh
    visible="false"
    position="0 0 0"
    scale="1 1 1"
  ></a-entity>

  <!--lights-->
  <a-light
    type="ambient"
    intensity="1"
    color="#fff"
    position="0 0 0"
  ></a-light>
  <a-entity
    light="type: directional; intensity: 1"
    position="0 20 20"
  ></a-entity>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  components: {}
})
export default class Environment4 extends Vue {}
</script>
