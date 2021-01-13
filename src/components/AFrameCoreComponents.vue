<template>
  <!--Assets-->
  <a-assets>
    <canvas ref="uiCanvas" id="ui-canvas"></canvas>
    <img id="vrTripleDot" :src="require('../assets/baseline_more_horiz_black_18dp.png')">
    <a-assets-item
      :id="'emote-image-' + name"
      v-for="name in Object.keys(emotes)"
      :key="'emote-image-' + name"
      :src="require('../assets/emotes/emote_' + name + '.png')"
    ></a-assets-item>
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
        hide-on-enter-vr-click
        visible="true"
        position="0 0 -1"
        scale="0.1 0.1 0.1"
        geometry="primitive: ring; radiusOuter: 0.20; radiusInner: 0.13;"
        material="color: #ADD8E6; shader: flat"
        cursor="maxDistance: 5;"
      >
      </a-entity>
      <a-plane
        show-on-enter-vr-click
        visible="false"
        position="0 -0.17 -0.4"
        scale="0.05 0.05 0.05"
        transparent="true"
        rotation="-20 0 0"
        src="#vrTripleDot"
      >
      </a-plane>
      <a-image
        id="local-emote"
        ref="localEmote"
        visible="false"
        position="-0.08 0.2 -1"
        width="724"
        height="515"
        scale="0.00075 0.00075 0.00075"
        geometry="primitive: plane;"
        material="src: #emote-image-unamused"
      ></a-image>
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
    <div id="emotes-menu" ref="emotesMenu">
      <material-button v-for="[name, icon_id] in Object.entries(emotes)" :key="'emote-menu-button-' + name" @click="sendEmote(name)" class="material-icons-outlined em-3">{{ icon_id }}</material-button>
    </div>
  </div>
</template>

<script lang="ts">
import AFrame from "aframe";

import { Options, Vue } from "vue-class-component";

@Options({
  data: function() {
    return {
      emotesOpen: false,
      emotes: {
        "very_happy": "mood",
        "surprised": "not_listed_location",
        "very_unhappy": "sentiment_very_dissatisfied",
        "angry": "not_listed_location",
        "unamused": "sick"
      },
      emoteTimeout: null
    }
  },
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
    emoteButton: function(event: MouseEvent) {
      this.$data.emotesOpen = !this.$data.emotesOpen;

      const button = (event.currentTarget as HTMLElement);
      const menu = this.$refs.emotesMenu as HTMLElement;

      if (this.$data.emotesOpen) {
        button.classList.remove("orange");
        button.classList.add("red");

        menu.classList.add("open");
      } else {
        button.classList.remove("red");
        button.classList.add("orange");

        menu.classList.remove("open");
      }
    },
    sendEmote: function(name: string) {
      const emoteHUD: AFrame.Entity = this.$refs.localEmote;

      emoteHUD.setAttribute('material', `src: #emote-image-${name}`);
      emoteHUD.setAttribute('visible', 'true');

      if (this.$data.emoteTimeout != null)
        clearTimeout(this.$data.emoteTimeout);

      // Hide the emote after some time
      this.$data.emoteTimeout = setTimeout(() => {
        emoteHUD.setAttribute('visible', 'false');
      }, 2000);
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
      init: function() {
        const Element: AFrame.Entity = this.el;
        const sceneEl = Element.sceneEl as HTMLElement;
        sceneEl.addEventListener("enter-vr", function() {
        Element.setAttribute("visible", "false");
        });
      }
    });

    AFrame.registerComponent("show-on-enter-vr-click", {
      init: function() {
        const Element: AFrame.Entity = this.el;
        const sceneEl = Element.sceneEl as HTMLElement;
        sceneEl.addEventListener("enter-vr", function() {
        Element.setAttribute("visible", "true");
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
  .material-icons, .material-icons-outlined {
    &.em-#{$i} {
      font-size: $i * 1em;
    }
  }
}

material-button {
  cursor: pointer;
  user-select: none;

  &.orange {
    color: rgb(255, 81, 0);
  }
  &.red {
    color: rgb(255, 0, 0);
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

  #favorites-menu, #emotes-menu {
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

  #emotes-menu {
    overflow-y: hidden;
    max-height: 0;
    transition: max-height ease-in-out 500ms;

    &.open {
      max-height: (5 * 3.6em);
    }
  }
}
</style>
