<template>
  <a-box hoverable grabbable draggable droppable color="blue" position="0 4 -5" rotation="0 45 45" scale="1 1 1"></a-box>
  <!-- Camera entity -->
  <a-entity id="rig" movement-controls="constrainToNavMesh: false" position="0 0 0">
    <a-entity camera capture-mouse raycaster
              position="0 1.8 0" look-controls="pointerLockEnabled: true"
              super-hands="colliderEvent: raycaster-intersection; colliderEventProperty: els; colliderEndEvent: raycaster-intersection-cleared; colliderEndEventProperty: clearedEls;"
    ></a-entity>
  </a-entity>
  <!-- Hands -->
  <a-entity sphere-collider="objects: a-box" super-hands hand-controls="hand: right"></a-entity>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    msg: String
  }
})
export default class AFrameCoreComponents extends Vue {
  msg!: string;
}
</script>
