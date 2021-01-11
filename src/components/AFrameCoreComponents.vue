<template>
  <a-box hoverable grabbable draggable droppable color="blue" position="0 4 -8" rotation="0 45 45" scale="1 1 1"></a-box>

  <!-- Camera entity -->
  <a-entity id="rig" movement-controls="constrainToNavMesh: false" position="0 0 0">
    <a-entity camera capture-mouse raycaster
              position="0 1.8 0" look-controls="pointerLockEnabled: true"
              body="type: static; shape: sphere; sphereRadius: 0.001"
              super-hands="colliderEvent: raycaster-intersection; colliderEventProperty: els; colliderEndEvent: raycaster-intersection-cleared; colliderEndEventProperty: clearedEls;"
    ></a-entity>
  </a-entity>
  <!-- Hands -->
  <a-entity sphere-collider="objects: .aframe-interactable" super-hands hand-controls="hand: left"></a-entity>
  <a-entity sphere-collider="objects: .aframe-interactable" super-hands hand-controls="hand: right"></a-entity>

  <!-- Menu stuff -->
  <div id="icon-rollout">
    <material-button class="material-icons em-3">more_horiz</material-button>
    <div id="favorites-menu">
      <material-button class="material-icons em-3">star</material-button>
      <material-button class="material-icons em-3">create</material-button>
      <material-button class="material-icons em-3">tv</material-button>
    </div>
    <material-button class="material-icons em-3">help</material-button>
    <material-button class="material-icons em-3">insert_emoticon</material-button>
  </div>

</template>

<style scoped lang="scss">

@for $i from 1 through 10 {
  .material-icons.em-#{$i} {
    font-size: $i * 1em;
  }
}

material-button {
  cursor: pointer;
  user-select: none;
}

#icon-rollout {
  position: absolute;
  top: 1em;
  right: 1em;
  display: flex;
  flex-direction: column;
  z-index: 1;

  * {
    margin: .1em 0;
  }

  #favorites-menu {
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, .75);
    color: rgba(255, 255, 255, 1);
    border-radius: .5em;
    padding: .5em;

    span {
      margin: .1em 0;
    }
  }
}

</style>

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
