<template>
  <!--Assets-->
  <a-assets>
    <a-assets-item
      id="gltf"
      :src="require('../assets/Room/Room.gltf')"
    ></a-assets-item>
    <img
      id="thumbEnvironment3"
      crossOrigin="anonymous"
      src="@/assets/thumbEnvironment3.png"
    />
  </a-assets>

  <!--SkyBox-->
  <a-entity cubemap="folder: /SpaceSkyBox/"></a-entity>

  <a-link
    position="20 1.5 5"
    href="javascript:vueRouterReference.push('environment-3')"
    image="#thumbEnvironment3"
    title="Go to environment 3"
  ></a-link>

  <!--Objects-->
  <a-box
    color="green"
    position="0 2 -5"
    rotation="0 45 45"
    scale="2 2 2"
  ></a-box>
  <a-entity gltf-model="#gltf"></a-entity>

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
export default class Environment2 extends Vue {}
</script>
