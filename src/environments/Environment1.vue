<template>
  <!--Assets-->
  <a-assets>
    <a-assets-item
      id="asset-mtl"
      :src="require('../assets/Room/model.mtl')"
    ></a-assets-item>
    <a-assets-item
      id="asset-obj"
      :src="require('../assets/Room/model.obj')"
    ></a-assets-item>
    <a-assets-item
      id="asset-navmesh"
      :src="require('../assets/Room/navmesh.gltf')"
    ></a-assets-item>

    <a-assets-item
      id="asset-objects-chairComfy-mtl"
      :src="require('../assets/Room/objects/chairComfy.mtl')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-chairComfy-obj"
      :src="require('../assets/Room/objects/chairComfy.obj')"
    ></a-assets-item>
  </a-assets>

  <!--SkyBox-->
  <a-entity environment="preset: starry" position="0 -5 0"></a-entity>

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
    obj-model="obj: #asset-obj; mtl: #asset-mtl;"
    position="4 -0.2 0"
    scale="1 1 1"
  ></a-entity>

  <a-entity
    body="type: static; shape: box"
    obj-model="obj: #asset-objects-chairComfy-obj; mtl: #asset-objects-chairComfy-mtl;"
    position="4 0.5 -8"
    rotation="0 0 0"
    scale="0.75 0.75 0.75"
  ></a-entity>

  <a-entity
    gltf-model="#asset-navmesh"
    nav-mesh
    visible="false"
    position="4 -0.2 0"
    scale="1 1 1"
  ></a-entity>

  <!--lights-->
  <a-light
    type="ambient"
    intensity="0.3"
    color="#fff"
    position="20 20 0"
  ></a-light>
  <a-light
    type="point"
    intensity="1"
    color="#fff"
    position="-200 140 -70"
  ></a-light>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  components: {}
})
export default class Environment1 extends Vue {}
</script>
