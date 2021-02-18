<template>
  <!--Assets-->
  <a-assets>
    <a-assets-item
      id="room-obj"
      :src="require('../assets/room/SpaceDomesFinished.gltf')"
    ></a-assets-item>

  </a-assets>

  <!-- Skybox -->
  <a-entity
    body="type: static; shape: box"
    cubemap="folder: /SpaceSkyBox/" 
  ></a-entity>

  <!--Objects-->
 
 <a-entity
    body="type: static; shape: box"
    gltf-model="#room-obj"
    position="25 -1.8 51"
    scale="1 1 1"
  ></a-entity>
  
   <!--
         cube-env-map="path: /LythwoodSkybox/; extension: jpg; reflectivity: 0.4;"

-->

  <!--lights-->
  <a-light
    type="ambient"
    intensity="0.4"
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
