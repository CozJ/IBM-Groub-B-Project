<template>
  <!--Assets-->


  <a-assets>
    <!-- UI -->
    <img id="vrRespawnButton" width="256" height="256" :src="require('../assets/ui/refresh-24px.svg')">

    <!-- Screenshare -->
    <canvas ref="uiCanvas" id="ui-canvas" width="1600" height="900"></canvas>

    <a-assets-item
      :id="'emote-image-' + name"
      v-for="name in emotes"
      :key="'emote-image-' + name"
      :src="require('../assets/emotes/' + name + '.png')"
    ></a-assets-item>
    <img
      :id="'emote-icon-' + name"
      v-for="name in emotes"
      width="256" height="256"
      :key="'emote-icon-' + name"
      :src="require('../assets/emotes/icons/' + name + '.svg')"
    >

    <!-- Remote users -->
    <a-assets-item
      id="asset-remote-user"
      :src="require('../assets/players/remote_user.gltf')"
    ></a-assets-item>
  </a-assets>
      

<!--
  <a-entity
    id="ybot"
    position="15 0 -5"
    rotation="0 -45 0"
    scale="1 1 1"
    animation-mixer
    :gltf-model="`${require('../assets/room/objects/ybot.gltf')}`"
  ></a-entity>
  -->
  <!-- The above way of handling GLTF models is extremely dumb, but for whatever reason aframe refuses to load the asset by ID reference -->

  <video class="canvasReader" ref="screenshareVideo" autoplay muted></video>

  <a-box
    id="testBox"
    test-raycast-thing
    data-raycastable
    color="green"
    position="3.5 1 -0.4"
    scale="1 1 1"
    rotation="-20 0 0"
  >
  </a-box>

  <!-- Camera entity -->
  <a-entity
    id="rig"
    ref="playerRig"
    movement-controls="constrainToNavMesh: true"
    position="0 0 0"
  >
    <a-entity
      ref="playerCamera"
      camera
      capture-mouse
      position="0 1.8 0"
      look-controls="pointerLockEnabled: true"
      body="type: static; shape: sphere; sphereRadius: 0.001"
    >
      <a-entity
        hide-on-enter-vr-click
        visible="true"
        position="0 0 -0.1"
        scale="0.1 0.1 0.1"
        geometry="primitive: ring; radiusOuter: 0.020; radiusInner: 0.013;"
        material="color: #ADD8E6; shader: flat"
        raycaster="far: 20; showLine: true; objects: [data-raycastable];"
        cursor
      >
      </a-entity>
      <a-entity
        show-on-enter-vr-click
        visible="false"
        position="0 0.20 -0.6"
        scale="0.05 0.05 0.05"
        rotation="-20 0 0"
      >
        <a-text position="-5 -8 0.6" width="10" ref="vrChatBackLog" value=""></a-text>
        <a-plane
          id="vrMenu"
          respawn-vr
          data-raycastable
          transparent="true"
          src="#vrRespawnButton"
          :position="`${0 - (emotes.length / 2)} 0 0`"
        />
        <a-plane
          v-for="(name, index) in emotes"
          :key="'emote-button-vr-' + name"
          transparent="true"
          data-raycastable
          :src="'#emote-icon-' + name"
          :id="'button'"
          :position="`${index + 1 - (emotes.length / 2)} 0 0`"
          :pick-emote="name"
        />
      </a-entity>
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
        transparent="true"
      ></a-image>-
    </a-entity>
    <!-- Hands -->
    <a-entity laser-controls="hand: right" raycaster="showLine: true; far: 100; objects: [data-raycastable]" line="color: orange; opacity: 0.5" ></a-entity>
  </a-entity>

  <!-- Remote user store -->
  <a-entity id="remote-user-store" ref="remoteUserStore">
  </a-entity>

  <!--Function for checking who is presenter and setting them as presenter-->


  <!-- Menu stuff -->
  <div id="icon-rollout">
    <material-button class="material-icons em-3">more_horiz</material-button>
    <div id="favorites-menu">
      <material-button class="material-icons em-3 orange">star</material-button>
      <material-button class="material-icons em-3" @click="toggleChat">message</material-button>
      <material-button class="material-icons em-3" show-on-presenter @click="shareVideo">tv</material-button>
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
      <material-button-svg v-for="name in emotes" :key="'emote-menu-button-' + name" @click="sendEmote(name)" v-html="require('!html-loader!@/assets/emotes/icons/' + name + '.svg')" />
    </div>
  </div>

  <div ref="chatHolder" id="chat-holder">
    <input type="text" ref="chatEntry" @keyup.enter="sendChat()">
    <div ref="chatBacklog"></div>
  </div>

  <div ref="joinScreen" id="join-screen">
    Enter a room code and a name to start chatting.
    <b>Room code</b>
    <input ref="roomCode" type="text" value="default">
    <b>Name</b>
    <input ref="nameEntry" type="text">
    <button @click="joinSession($refs.roomCode.value, $refs.nameEntry.value)">Join room</button>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import RemoteUser from "@/components/RemoteUser";

import AFrame, { registerComponent } from "aframe";
//need in import the shader but not sure how
import * as THREE from "three";
import SimplePeer from "simple-peer";

// workaround
declare global {
  interface MediaDevices {
    getDisplayMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
  }

  interface MediaStreamConstraints {
    cursor?: ConstrainDOMString;
  }
}

function registerComponentSafe(name: string, component: AFrame.ComponentDefinition<object>) {
  // Delete the old component if it was already registered
  if (AFrame.components[name] !== null)
    delete AFrame.components[name];

  AFrame.registerComponent(name, component);
}

const userJoin = new Audio(require('../assets/sounds/userJoin.mp3'));
const userLeave = new Audio(require('../assets/sounds/userLeave.mp3'));
const textMessage = new Audio(require('../assets/sounds/textMessage.mp3'));

@Options({
  components: {
  },
  data: function() {
    return {
      subscribedEvents: {},
      roomEvents: {},
      roomName: null,
      playerName: null,

      timeoutEvents: [],
      intervalEvents: [],

      emotesOpen: false,
      emotes: [
        "happy",
        "surprised",
        "unhappy",
        "angry",
        "unamused",
        "wave",
      ],
      emoteTimeout: null,

      playerObjects: {},
      activeStream: null,
      p2pConnections: {},
      timeJoined: new Date()
    }
  },
  emits: [
    'network-event',
    'network-subscribe',
    'network-unsubscribe'
  ],
  props: {
    msg: String
  },
  methods: {
    /* JavaScript events */
    setTimeout: function(callback: (...args: any[]) => void, ms: number) {
      const value: NodeJS.Timeout = setTimeout(callback, ms);
      (this.$data.timeoutEvents as NodeJS.Timeout[]).push(value);
      return value;
    },
    setInterval: function(callback: (...args: any[]) => void, ms: number) {
      const value: NodeJS.Timeout = setInterval(callback, ms);
      (this.$data.intervalEvents as NodeJS.Timeout[]).push(value);
      return value;
    },

    /* Deepstream events */
    setEvent: function(eventName: string, callback: (data: object) => void) {
      // Unsubscribe previous handler if it exists
      if (this.$data.subscribedEvents[eventName] !== null)
        this.$emit("network-unsubscribe", eventName, this.$data.subscribedEvents[eventName]);

      this.$data.subscribedEvents[eventName] = callback;
      this.$emit("network-subscribe", eventName, callback);
    },
    fireEvent: function(eventName: string, data: object) {
      this.$emit("network-event", eventName, data);
    },
    setRoomEvent: function(eventName: string, callback: (data: object) => void) {
      this.$data.roomEvents[eventName] = callback;
      this.updateRoomEvents();
    },
    fireRoomEvent: function(eventName: string, data: object) {
      this.$emit("network-event", `room/${this.$data.roomName}/${eventName}`, data);
    },
    updateRoomEvents: function() {
      for (const [key, value] of Object.entries(this.$data.subscribedEvents) as [string, () => void][]) {
        if (key.startsWith("room/")) {
          this.$emit("network-unsubscribe", key, value);
          delete this.$data.subscribedEvents[key];
        }
      }

      if (this.$data.roomName === null)
        return;

      for (const [key, value] of Object.entries(this.$data.roomEvents) as [string, () => void][]) {
        this.setEvent(`room/${this.$data.roomName}/${key}`, value);
      }
    },
    setRoom: function(roomName: string) {
      if (this.$data.roomName !== null)
        this.fireRoomEvent("player/leave");

      this.$data.roomName = roomName;
      this.updateRoomEvents();
      this.fireRoomEvent("player/join", {name: this.$data.playerName});
      
      this.setTimeout(() => {
        this.networkIdentify();
      }, 500);
    },

    presenterCheck: function(){
      let presenter: RemoteUser | null = null;

      for (const remoteUser of Object.values(this.$data.playerObjects) as RemoteUser[]) {
        if (remoteUser.timeJoinedMilli < this.$data.timeJoined.getTime()) {
          // potential presenter
          if (presenter == null || (remoteUser.timeJoinedMilli < presenter.timeJoinedMilli))
            presenter = remoteUser;
        }

        remoteUser.setPresenter(false);
      }

      if (presenter === null) {
        document.body.classList.remove('not-presenter');
        document.body.classList.add('presenter');
      } else {
        presenter.setPresenter(true);
        document.body.classList.remove('presenter');
        document.body.classList.add('not-presenter');
      }
    },

    joinSession: function(roomName: string, playerName: string) {
      if (roomName.trim().length === 0) {
        alert("Please enter a valid room code.");
        return;
      }

      if (playerName.trim().length === 0) {
        alert("Please enter a valid player name.");
        return;
      }

      this.$data.playerName = playerName;
      this.$data.timeJoined = new Date();
      this.setRoom(roomName);

      const joinScreen: HTMLDivElement = this.$refs.joinScreen;
      joinScreen.style.visibility = 'hidden';
    },

    userJoined: function(data: {userID: string, name: string}) {
      this.addChatLine(`* ${data.name} has joined room "${this.$data.roomName}"`);
      userJoin.play();
    },
    networkIdentify: function(data: {userID: string, name: string, timeJoined: number, respond: boolean} | undefined) {
      // This operates as a send/recv dual purpose function
      console.log("TRIGGER IDENTIFY");
      console.log(data);

      if (data !== undefined) {
        const remoteUser: RemoteUser = this.getRemoteUser(data);

        if (remoteUser === undefined) return;

        console.log("IDENTIFY (recv)");

        remoteUser.setName(data.name);
        remoteUser.timeJoinedMilli = data.timeJoined;

        this.presenterCheck();

        if (!data.respond)
          return;

        // If we're streaming allow the new user to join the stream
        this.setTimeout(() => {          
          if (this.$data.activeStream)
            this.fireRoomEvent("player/start-stream", {});
        }, 100);
      }

      console.log("IDENTIFY (send)");

      this.fireRoomEvent("player/identify", {
        respond: data === undefined,  // Ask for response when initiating
        name: this.$data.playerName,
        timeJoined: this.$data.timeJoined.getTime()
      });
    },
    userCleanup: function() {
      let userDeleted = false;

      for (const remoteUser of Object.values(this.$data.playerObjects) as RemoteUser[]) {
        if (new Date().getTime() - remoteUser.lastUpdate.getTime() > 30000) {
          // This user has been idle for more than 30 seconds
          remoteUser.destroy();
          delete this.$data.playerObjects[remoteUser.userID];
          this.addChatLine(`* ${remoteUser.name} was idle for too long and has been destroyed.`);
          userDeleted = true;
        }
      }

      if (userDeleted) {
        this.presenterCheck();
        userLeave.play();
      }
    },

    /* User interface */
    shareVideo: function() {
      navigator.mediaDevices.getDisplayMedia({ cursor: 'motion' }).then(
        stream => {
          this.$data.activeStream = stream;
          this.displayStream(stream);

          // Abandon existing connections
          for (const value of Object.values(this.$data.p2pConnections) as Array<SimplePeer.Instance>) {
            value.destroy();
          }
          this.$data.p2pConnections = {};

          // Request that people in the room connect to us via RTC
          this.fireRoomEvent("player/start-stream", {});
        }).catch(
        error => {
          alert( 'error while accessing usermedia ' + error.toString() );
        });
    },
    displayStream: function(stream: MediaStream) {
      console.log(`Being asked to display ${stream}`);
      console.log(stream);

      const video: HTMLVideoElement = this.$refs.screenshareVideo;

      video.srcObject = stream;
      video.play();

      const canvas: HTMLCanvasElement = this.$refs.uiCanvas;
      const ctx: CanvasRenderingContext2D = canvas.getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      function drawFrame() {
        ctx.drawImage(video, 0, 0, 1600, 900);
        requestAnimationFrame(drawFrame);
      }

      drawFrame();
    },
    helpButton: function() {
      window.open( 
              "https://youtu.be/oAArtTKU2NI","_blank");
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

      this.fireRoomEvent("player/emote", {
        emoteName: name
      });

      if (this.$data.emoteTimeout !== null)
        clearTimeout(this.$data.emoteTimeout);

      // Hide the emote after some time
      this.$data.emoteTimeout = setTimeout(() => {
        emoteHUD.setAttribute('visible', 'false');
        this.$data.emoteTimeout = null;
      }, 2000);
    },

    /* Chat */
    sendChat: function() {
      const entry: HTMLInputElement = this.$refs.chatEntry;

      this.fireRoomEvent("player/send-chat-message", {
        name: this.$data.playerName,
        message: entry.value
      });

      entry.value = "";
      entry.blur();  // defocus

      const scene: AFrame.Scene = this.$refs.playerRig.sceneEl;
      scene.requestPointerLock();
    },
    addChatLine: function(line: string) {
      const chat: HTMLInputElement = this.$refs.chatBacklog;
      const VrChat: AFrame.Entity = this.$refs.vrChatBackLog; 
      const scrolledDown: boolean = chat.scrollHeight - chat.clientHeight <= chat.scrollTop + 1;

      chat.innerText += `\n${line}`;
      if (VrChat.getAttribute("value").length > 100)
      {
        VrChat.setAttribute("value", "\n")
      }
      VrChat.setAttribute("value", VrChat.getAttribute("value") + `\n${line}`)

      if (scrolledDown)
        chat.scrollTop = chat.scrollHeight - chat.clientHeight;
    },
    receiveChat: function(data: {userID: string, name: string, message: string}) {
      this.addChatLine(`<${data.name}> ${data.message}`);
      textMessage.play();
    },
    toggleChat: function() {
      const chat: HTMLInputElement = this.$refs.chatHolder;
      chat.style.visibility = (chat.style.visibility == 'hidden') ? 'unset' : 'hidden';
      chat.scrollTop = chat.scrollHeight - chat.clientHeight;
    },

    /* Utility functions */
    getRemoteUser: function(data: {userID: string}) {
      const userID: string = data.userID;
      const remoteUserStore: AFrame.Entity = this.$refs.remoteUserStore;

      const ourUserID: string = this.$parent.$data.userID;

      if (userID === ourUserID) return undefined;

      const remoteUser: RemoteUser = this.$data.playerObjects[userID] ?? new RemoteUser(remoteUserStore, userID);
      this.$data.playerObjects[userID] = remoteUser;

      return remoteUser;
    },
    getPeerConnection: function(userID: string, opts: SimplePeer.Options, ifNew: (connection: SimplePeer.Instance) => void | null) {
      if (!this.$data.p2pConnections[userID]) {
        const p2pConnection: SimplePeer.Instance = this.$data.p2pConnections[userID] = new SimplePeer(opts);

        p2pConnection.on('signal', signal => {
          console.log(`Recieved ${signal} from ${userID}`);
          console.log(signal);
          this.fireRoomEvent("player/stream-signal", {
            peer: userID,
            signal: signal
          });
        });

        if(ifNew) ifNew(p2pConnection);
      }

      return this.$data.p2pConnections[userID];
    },

    /* Network recv events */
    updatePlayerTransform: function(data: any) {
      const remoteUser: RemoteUser = this.getRemoteUser(data);

      if (remoteUser === undefined)
        return;

      remoteUser.setNetworkTransform(data);
    },
    receiveEmote: function(data: any) {
      const remoteUser: RemoteUser = this.getRemoteUser(data);

      if (remoteUser === undefined)
        return;

      remoteUser.setEmote(data.emoteName);
    },
    playerStartedStream: function(data: any) {
      const remoteUser: RemoteUser = this.getRemoteUser(data);

      if (remoteUser === undefined) {
        this.addChatLine(`* ${this.$data.playerName} has started a screen share`);
        return;
      }

      this.addChatLine(`* ${remoteUser.name} has started a screen share`);

      // Abandon existing connections
      for (const value of Object.values(this.$data.p2pConnections) as Array<SimplePeer.Instance>) {
        value.destroy();
      }
      this.$data.p2pConnections = {};
      this.$data.activeStream = null;

      const p2pConnection: SimplePeer.Instance = this.getPeerConnection(remoteUser.userID, {
        initiator: false
      }, (connection: SimplePeer.Instance) => {
        console.log(connection);
        connection.on('stream', remoteStream => {
          console.log(`${remoteUser.userID} sent STREAM signal`);
          this.displayStream(remoteStream);
        });
      });

      console.log(`${remoteUser.userID} started stream, requesting a token`);
      this.fireRoomEvent("player/stream-token-request", { streamer: remoteUser.userID });
    },
    streamTokenRequest: function(data: any) {
      const remoteUser: RemoteUser = this.getRemoteUser(data);

      if (remoteUser === undefined)
        return;

      const ourUserID: string = this.$parent.$data.userID;
      if (data.streamer === ourUserID && this.$data.activeStream !== null) {
        console.log(`${remoteUser.userID} requested a token, beginning peer connection`);
        const p2pConnection: SimplePeer.Instance = this.getPeerConnection(remoteUser.userID, {
          initiator: true,
          stream: this.$data.activeStream
        });
      }
    },
    streamSignal: function(data: any) {
      const remoteUser: RemoteUser = this.getRemoteUser(data);

      if (remoteUser === undefined)
        return;

      const ourUserID: string = this.$parent.$data.userID;
      if (data.peer === ourUserID) {
        console.log(`${remoteUser.userID} sent us signal: ${data.signal}`);
        console.log(data.signal);
        const p2pConnection: SimplePeer.Instance = this.$data.p2pConnections[remoteUser.userID];

        if (p2pConnection)
          p2pConnection.signal(data.signal);
      }
    }
  },
  mounted: function() {
    // When component mounted

    // Player interaction stuff
    this.setRoomEvent("player/transform", this.updatePlayerTransform);
    this.setRoomEvent("player/emote", this.receiveEmote);
    // Connections
    this.setRoomEvent("player/join", this.userJoined);
    this.setRoomEvent("player/identify", this.networkIdentify);
    // Chat
    this.setRoomEvent("player/send-chat-message", this.receiveChat);
    // WebRTC stream handshake
    this.setRoomEvent("player/start-stream", this.playerStartedStream);
    this.setRoomEvent("player/stream-token-request", this.streamTokenRequest);
    this.setRoomEvent("player/stream-signal", this.streamSignal);

    this.presenterCheck();
    this.setInterval(this.userCleanup, 100);

    this.setInterval(() => {
      const playerRig: AFrame.Entity = this.$refs.playerRig;
      const playerCamera: AFrame.Entity = this.$refs.playerCamera;

      const playerRigPosition: THREE.Vector3 = new THREE.Vector3();
      const playerRigQuaternion: THREE.Quaternion = new THREE.Quaternion();
      const playerRigScale: THREE.Vector3 = new THREE.Vector3();

      playerRig.object3D.matrixWorld.decompose(playerRigPosition, playerRigQuaternion, playerRigScale);

      const playerCameraPosition: THREE.Vector3 = new THREE.Vector3();
      const playerCameraQuaternion: THREE.Quaternion = new THREE.Quaternion();
      const playerCameraScale: THREE.Vector3 = new THREE.Vector3();

      playerCamera.object3D.matrixWorld.decompose(playerCameraPosition, playerCameraQuaternion, playerCameraScale);

      // Set the rig to turn to face the same way as the camera laterally
      // Get forward vector
      const forwardVec: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
      forwardVec.applyQuaternion(playerCameraQuaternion);
      // Scale to lateral
      forwardVec.y = 0;
      forwardVec.normalize();

      playerRigQuaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), forwardVec);
      playerCameraQuaternion.premultiply(playerRigQuaternion.clone().invert());

      this.fireRoomEvent("player/transform", {
        position: playerCameraPosition,
        rotation: playerRigQuaternion,
        headRotation: playerCameraQuaternion
      });
    }, 100);

    registerComponentSafe("core-bootstrapper", {
      init: () => {
        // And AFrame has loaded

        // Key handler
        document.addEventListener('keypress', (event: KeyboardEvent) => {
          // Only listen to events when the pointer is locked
          if (!document.pointerLockElement) return;

          const regex = /Digit([1-9])/;
          const match = event.code.match(regex);

          if (match !== null) {
            const index: number = parseInt(match[1]) - 1;

            if (index < this.$data.emotes.length) {
              event.preventDefault();
              this.sendEmote(this.$data.emotes[index]);
            }
          } else {
            if (event.code === "KeyT") {
              event.preventDefault();
              const entry: HTMLInputElement = this.$refs.chatEntry;
              document.exitPointerLock();
              entry.focus();
            }
          }
        });
      }
    });

    const canvas: HTMLCanvasElement = this.$refs.uiCanvas;
    const ctx: CanvasRenderingContext2D = canvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    ctx.beginPath();
    ctx.rect(Math.random() * 1180, Math.random() * 620, 100, 100);
    ctx.fillStyle = ["red", "green", "blue", "yellow"][Math.floor(Math.random() * 4)];
    ctx.fill();

    registerComponentSafe("whiteboard-canvas", {
      init: function() {
        const board: AFrame.Entity = this.el;

        board.addEventListener('model-loaded', () => {
          const materialNeedsUpdate: THREE.MeshPhongMaterial[] = [];

          const boardGroup: THREE.Mesh = board.getObject3D('mesh') as THREE.Mesh;

          boardGroup.traverse((childObject) => {
            const childMesh: THREE.Mesh = childObject as THREE.Mesh;
            if (childMesh.material === undefined) return;

            const childMaterial: THREE.MeshPhongMaterial | THREE.MeshPhongMaterial[] = childMesh.material as THREE.MeshPhongMaterial | THREE.MeshPhongMaterial[];

            if (Array.isArray(childMaterial)) {
              for (const material of childMesh.material as THREE.MeshPhongMaterial[]) {
                if (material.name == "WhiteboardCanvas") {
                  materialNeedsUpdate.push(material);
                }
              }
            } else {
              if (childMaterial.name == "WhiteboardCanvas") {
                materialNeedsUpdate.push(childMaterial);
              }
            }
          });

          this.data.interval = setInterval(() => {
            for (const material of materialNeedsUpdate) {
              material.needsUpdate = true;
              material.color = new THREE.Color(0x000000);
              material.emissiveMap = new THREE.CanvasTexture(canvas);
              material.emissiveIntensity = 1;
              material.emissive = new THREE.Color(0xFFFFFF);
            }
          }, 100);
        });
      },
      remove: function() {
        clearInterval(this.data.interval);
      }
    });

    registerComponentSafe("hide-on-enter-vr-click", {
      init: function() {
        const Element: AFrame.Entity = this.el;
        const sceneEl = Element.sceneEl as HTMLElement;
        sceneEl.addEventListener("enter-vr", function() {
        Element.setAttribute("visible", "false");
        });
      }
    });

    registerComponentSafe("show-on-enter-vr-click", {
      init: function() {
        const Element: AFrame.Entity = this.el;
        const sceneEl = Element.sceneEl as HTMLElement;
        sceneEl.addEventListener("enter-vr", function() {
        Element.setAttribute("visible", "true");
        });
      }
    });

    registerComponentSafe("test-raycast-thing", {
      init: function() {
        const element: AFrame.Entity = this.el;

        element.addEventListener("mouseenter", function(){
          element.setAttribute("color", "red")
        })
        element.addEventListener("mouseleave", function(){
          element.setAttribute("color", "blue")
        });
      }
    });

    const sendEmote = this.sendEmote;

    registerComponentSafe("pick-emote", {
      schema: {
        emote: {type: 'string', default: "happy"}
      },

      init: function(){
        const data = this.data;
        const Element: AFrame.Entity = this.el;
        const sceneEl = Element.sceneEl as HTMLElement;
        console.log(data);
        Element.addEventListener("click", function(evt)
        {sendEmote(data);}
        );
      }
    })

    const respawnVR = this.respawnButton;

    registerComponentSafe("respawn-vr",{
      init: function(){

        const Element: AFrame.Entity = this.el;
        const sceneEl = Element.sceneEl as HTMLElement;

        Element.addEventListener("click", function(evt) { respawnVR() });
      }
    })
  
  },

  unmounted: function() {
    for (const [key, value] of Object.entries(this.$data.subscribedEvents) as [string, () => void][]) {
      this.$emit("network-unsubscribe", key, value);
    }
    this.$data.subscribedEvents = {};

    for (const value of Object.values(this.$data.timeoutEvents) as NodeJS.Timeout[]) {
      clearTimeout(value);
    }
    this.$data.timeoutEvents = [];

    for (const value of Object.values(this.$data.intervalEvents) as NodeJS.Timeout[]) {
      clearInterval(value);
    }
    this.$data.intervalEvents = [];
  },

  
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

material-button-svg {
  width: 3em;
  fill: white;
}

material-button, material-button-svg {
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
      max-height: (6 * 3.6em);
    }
  }
}

#chat-holder {
  position: absolute;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  width: 40vw;
  height: 50vh;
  left: 1em;
  bottom: 1em;
  font-size: 1.25em;

  z-index: 2;
  text-align: left;

  div {
    overflow-y: scroll;
    width: auto;
    color: white;
    text-shadow:
    -1.5px -1.5px 0 #000,
     1.5px -1.5px 0 #000,
    -1.5px  1.5px 0 #000,
     1.5px  1.5px 0 #000;
  }

  input {
    width: auto;
    font-size: 1em;
  }
}

#join-screen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  background: rgba(200, 200, 200, .75);
  backdrop-filter: blur(8px);
  font-size: 1.75em;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 3;

  > * {
    margin: .2em 0;
  }

  input {
    font-size: 1em;
    width: calc(max(20em, 40vw));
  }

  button {
    font-size: 1em;
    width: calc(max(10em, 25vw));
    padding: .25em;
  }
}

a-scene video.canvasReader {
  display: initial;
  position: fixed;
  top: 0;
  left: 0;
  opacity: 0.001;
}
</style>
