<template>
  <!--Assets-->
  <a-assets>
    <a-assets-item
      id="room-obj"
      :src="require('../assets/room/Pavillion.gltf')"
    ></a-assets-item>
    <a-assets-item
      id="asset-navmesh"
      :src="require('../assets/room/navmesh.gltf')"
    ></a-assets-item>

    <a-assets-item
      id="asset-objects-chairComfy-mtl"
      :src="require('../assets/room/objects/chairComfy.mtl')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-chairComfy-obj"
      :src="require('../assets/room/objects/chairComfy.obj')"
    ></a-assets-item>
  </a-assets>

  <!-- Skybox -->
  <a-entity cubemap="folder: /GenericSkybox/"></a-entity>

  <!--Objects-->
  <a-box
    id="test-target-one"
    body="shape: box"
    static-body
    hoverable
    grabbable
    draggable
    droppable
    color="red"
    position="0 5 -3"
    rotation="0 45 45"
    scale="1 1 1"
  ></a-box>

  <a-entity
    body="type: static; shape: box"
    gltf-model="#room-obj"
    cube-env-map="path: /LythwoodSkybox/; extension: jpg; reflectivity: 0.4;"
    position="0 0 5"
    scale="1 1 1"
  ></a-entity>
  <a-entity
    gltf-model="#asset-navmesh"
    nav-mesh
    visible="false"
    position="0 0 5"
    scale="1 1 1"
  ></a-entity>

  <a-entity
    body="type: static; shape: box"
    obj-model="obj: #asset-objects-chairComfy-obj; mtl: #asset-objects-chairComfy-mtl;"
    position="-7 0.5 14"
    rotation="0 135 0"
    scale="0.75 0.75 0.75"
  ></a-entity>

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
export default class Environment1 extends Vue {}
</script>
