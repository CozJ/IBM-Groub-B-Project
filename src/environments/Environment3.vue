<template>
  <a-assets>
    <a-assets-item
      id="asset-objects-chairBasic-mtl"
      :src="require('../assets/Room/objects/chairBasic.mtl')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-chairBasic-obj"
      :src="require('../assets/Room/objects/chairBasic.obj')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-chairComfy-mtl"
      :src="require('../assets/Room/objects/chairComfy.mtl')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-chairComfy-obj"
      :src="require('../assets/Room/objects/chairComfy.obj')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-tableLong-mtl"
      :src="require('../assets/Room/objects/tableLong.mtl')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-tableLong-obj"
      :src="require('../assets/Room/objects/tableLong.obj')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-tableRegular-mtl"
      :src="require('../assets/Room/objects/tableRegular.mtl')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-tableRegular-obj"
      :src="require('../assets/Room/objects/tableRegular.obj')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-Tree1-mtl"
      :src="require('../assets/Room/objects/Tree1.mtl')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-Tree1-obj"
      :src="require('../assets/Room/objects/Tree1.obj')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-Tree2-mtl"
      :src="require('../assets/Room/objects/Tree2.mtl')"
    ></a-assets-item>
    <a-assets-item
      id="asset-objects-Tree2-obj"
      :src="require('../assets/Room/objects/Tree2.obj')"
    ></a-assets-item>
  </a-assets>

  <!--SkyBox-->
  <a-entity environment="preset: forest" position="0 0 0"></a-entity>

  <!--Objects-->
  <a-box
    color="green"
    position="0 2 -5"
    rotation="0 45 45"
    scale="2 2 2"
  ></a-box>

  <a-entity
    body="type: static; shape: box"
    obj-model="obj: #asset-objects-chairBasic-obj; mtl: #asset-objects-chairBasic-mtl;"
    position="5 0.75 -1.5"
    rotation="0 0 0"
    scale="0.75 0.75 0.75"
  ></a-entity>
  <a-entity
    body="type: static; shape: box"
    obj-model="obj: #asset-objects-chairBasic-obj; mtl: #asset-objects-chairBasic-mtl;"
    position="7.25 0.75 -1.5"
    rotation="0 0 0"
    scale="0.75 0.75 0.75"
  ></a-entity>
  <a-entity
    body="type: static; shape: box"
    obj-model="obj: #asset-objects-chairBasic-obj; mtl: #asset-objects-chairBasic-mtl;"
    position="5 0.75 1.5"
    rotation="0 180 0"
    scale="0.75 0.75 0.75"
  ></a-entity>
  <a-entity
    body="type: static; shape: box"
    obj-model="obj: #asset-objects-chairBasic-obj; mtl: #asset-objects-chairBasic-mtl;"
    position="7.25 0.75 1.5"
    rotation="0 180 0"
    scale="0.75 0.75 0.75"
  ></a-entity>

  <a-entity
    body="type: static; shape: box"
    obj-model="obj: #asset-objects-tableLong-obj; mtl: #asset-objects-tableLong-mtl;"
    position="6 1.25 0"
    rotation="0 90 0"
    scale="0.75 0.75 0.75"
  ></a-entity>
  <a-entity
    body="type: static; shape: box"
    obj-model="obj: #asset-objects-Tree1-obj; mtl: #asset-objects-Tree1-mtl;"
    position="5 1.5 -6"
    rotation="0 90 0"
    scale="0.75 0.75 0.75"
  ></a-entity>
  <a-entity
    body="type: static; shape: box"
    obj-model="obj: #asset-objects-Tree2-obj; mtl: #asset-objects-Tree2-mtl;"
    position="15 0 -6"
    rotation="0 90 0"
    scale="0.75 0.75 0.75"
  ></a-entity>

  <!-- Ground collider -->
  <a-box
    body="type: static; shape: box"
    width="100"
    height="1"
    depth="100"
    position="0 -0.8 0"
    visible="false"
  ></a-box>

  <!--Lights-->
  <a-light
    type="point"
    intensity="1.5"
    color="#fff"
    position="-200 -140 -70"
  ></a-light>
  <a-light
    type="ambient"
    intensity="0.3"
    color="#fff"
    position="20 20 0"
  ></a-light>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Environment3 extends Vue {}
</script>
