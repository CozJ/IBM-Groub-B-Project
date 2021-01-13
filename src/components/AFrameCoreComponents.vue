<template>
  <!--Assets-->
  <a-assets>
    <canvas ref="uiCanvas" id="ui-canvas"></canvas>
  </a-assets>

  <a-box
    id=".aframe-interactable"
    hoverable
    grabbable
    draggable
    droppable
    material="src:#ui-canvas"
    position="0 1 -8"
    rotation="0 45 45"
    scale="1 1 1"
  ></a-box>

  <!-- Camera entity -->
  <a-entity
    id="rig"
    ref="playerRig"
    movement-controls="constrainToNavMesh: true"
    position="0 0 0"
  >
    <a-entity
      camera
      capture-mouse
      raycaster
      position="0 1.8 0"
      look-controls="pointerLockEnabled: true"
      body="type: static; shape: sphere; sphereRadius: 0.001"
      super-hands="colliderEvent: raycaster-intersection; colliderEventProperty: els; colliderEndEvent: raycaster-intersection-cleared; colliderEndEventProperty: clearedEls;"
    >
      <a-entity
        id="desktop-cursor"
        visible="true"
        position="0 0 -1"
        scale="0.1 0.1 0.1"
        geometry="primitive: ring; radiusOuter: 0.20; radiusInner: 0.13;"
        material="color: #ADD8E6; shader: flat"
        cursor="maxDistance: 5;"
      >
      </a-entity>
    </a-entity>
    <!-- Hands -->
    <a-entity
      sphere-collider="objects: a-box" super-hands hand-controls="hand: left"></a-entity> <!--might be unnessecary-->

    <a-entity
      sphere-collider="objects: a-box" super-hands hand-controls="hand: right"></a-entity> <!--might be unnessecary-->
  </a-entity>

  <!-- Menu stuff -->
  <div id="icon-rollout">
    <material-button class="material-icons em-3">more_horiz</material-button>
    <div id="favorites-menu">
      <material-button class="material-icons em-3 orange">star</material-button>
      <material-button class="material-icons em-3">create</material-button>
      <material-button class="material-icons em-3">tv</material-button>
    </div>
    <material-button class="material-icons em-3 orange" @click="helpButton"
      >help</material-button
    >
    <material-button class="material-icons em-3 orange" @click="respawnButton"
      >refresh</material-button
    >
    <material-button class="material-icons em-3 orange" @click="emoteButton"
      >insert_emoticon</material-button
    >
  </div>
</template>

<script lang="ts">
import AFrame from "aframe";

import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    msg: String
  },
  methods: {
    helpButton: function() {
      alert("Help");
    },
    respawnButton: function() {
      const playerRig: AFrame.Entity = this.$refs.playerRig;

      playerRig.object3D.position.set(0, 0, 0);
    },
    emoteButton: function() {
      alert("Emotes");
    }
  },
  mounted: function() {
    // When component mounted

    AFrame.registerComponent("core-bootstrapper", {
      init: () => {
        // And AFrame has loaded
        const canvas: HTMLCanvasElement = this.$refs.uiCanvas;
        const ctx: CanvasRenderingContext2D = canvas.getContext(
          "2d"
        ) as CanvasRenderingContext2D;

        ctx.beginPath();
        ctx.rect(20, 20, 150, 100);
        ctx.fillStyle = "red";
        ctx.fill();
      }
    });

    AFrame.registerComponent("hide-on-enter-vr-click", {
      schema: { type: "selector" },

      init: function() {
        const sceneEl = this.el;
        const target = this.data;

        sceneEl.addEventListener("enter-vr", function() {
          target.setAttribute("visible", "false");
        });
      }
    });

    AFrame.registerComponent('phase-shift', {
        init: function () {
          const el = this.el
          el.addEventListener('gripdown', function () {
            el.setAttribute('collision-filter', {collisionForces: true})
          })
          el.addEventListener('gripup', function () {
            el.setAttribute('collision-filter', {collisionForces: false})
          })
        }
      })

  }
})
export default class AFrameCoreComponents extends Vue {
  msg!: string;
}
</script>

<style scoped lang="scss">
@for $i from 1 through 10 {
  .material-icons.em-#{$i} {
    font-size: $i * 1em;
  }
}

material-button {
  cursor: pointer;
  user-select: none;

  &.orange {
    color: rgb(255, 81, 0);
  }
}

#icon-rollout {
  position: absolute;
  top: 1em;
  right: 1em;
  display: flex;
  flex-direction: column;
  z-index: 1;

  * {
    margin: 0.1em 0;
  }

  #favorites-menu {
    display: flex;
    flex-direction: column;
    background-color: rgba(0, 0, 0, 0.75);
    color: rgba(255, 255, 255, 1);
    border-radius: 0.5em;
    padding: 0.5em;

    span {
      margin: 0.1em 0;
    }
  }
}
</style>
