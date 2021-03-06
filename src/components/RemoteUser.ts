// -*- coding: utf-8 -*-

import AFrame from "aframe";
import * as THREE from "three";


interface NetworkTransform {
  position: {
    x: number
    y: number
    z: number
  }
  rotation: {
    _x: number,
    _y: number,
    _z: number,
    _w: number
  }
  headRotation: {
    _x: number,
    _y: number,
    _z: number,
    _w: number
  }
}

export default class RemoteUser {
  userID: string;
  name: string;
  element: AFrame.Entity = document.createElement("a-entity");
  emote: AFrame.Entity = document.createElement("a-image");
  nameTag: AFrame.Entity = document.createElement("a-text");
  emoteTimeout: ReturnType<typeof setTimeout> | undefined = undefined;
  timeJoinedMilli = 0;
  lastUpdate: Date = new Date();
  presenter: boolean;

  constructor(parentElement: HTMLElement, userID: string) {
    // Data
    this.userID = userID;
    this.name = "";
    this.presenter=false;

    // Emote
    this.emote.setAttribute("width", "724");
    this.emote.setAttribute("height", "515");
    this.emote.setAttribute("position", "0.016 0.5 0");
    this.emote.setAttribute("rotation", "0 180 0");
    this.emote.setAttribute("scale", "0.001 0.001 0.001");
    this.emote.setAttribute("geometry", "primitive: plane;");
    this.emote.setAttribute("material", "src: #emote-image-unamused");
    this.emote.setAttribute("transparent", "true");
    this.emote.setAttribute("visible", "false");
    this.element.appendChild(this.emote);

    // Nametag
    this.nameTag.setAttribute("position", "0 0.3 -0.15");
    this.nameTag.setAttribute("rotation", "0 180 0");
    this.nameTag.setAttribute("color", "lightgreen");
    this.nameTag.setAttribute("align", "center");
    this.nameTag.setAttribute("baseline", "center");
    this.nameTag.setAttribute("width", "2");
    this.nameTag.setAttribute("value", "Hello");
    this.element.appendChild(this.nameTag);
    
    // Main append
    this.element.setAttribute("gltf-model", "#asset-remote-user");
    this.element.setAttribute("cube-env-map", "path: /LythwoodSkybox/; extension: jpg; reflectivity: 0.4;");
    this.element.toggleAttribute("animation-mixer");
    parentElement.appendChild(this.element);
  }

  setNetworkTransform(packet: NetworkTransform) {
    if (this.element.object3D !== undefined) {
      this.element.object3D.position.set(packet.position.x, packet.position.y, packet.position.z);
      this.element.object3D.rotation.setFromQuaternion(new THREE.Quaternion(
        packet.rotation._x, packet.rotation._y, packet.rotation._z, packet.rotation._w
      ));

      const head: THREE.Object3D = this.element.object3D.getObjectByName("Head") as THREE.Object3D;

      if (head === undefined) return;

      head.rotation.setFromQuaternion(new THREE.Quaternion(
        packet.headRotation._x, packet.headRotation._y, packet.headRotation._z, packet.headRotation._w
      ));
    } else {
      this.element.setAttribute("position", `${packet.position.x} ${packet.position.y} ${packet.position.z}`);
    }

    this.lastUpdate = new Date();
  }

  setEmote(name: string) {
    this.emote.setAttribute('material', `src: #emote-image-${name}`);
    this.emote.setAttribute('visible', 'true');

    if (this.emoteTimeout !== undefined)
      clearTimeout(this.emoteTimeout);

    this.emoteTimeout = setTimeout(() => {
      this.emote.setAttribute("visible", "false");
      this.emoteTimeout = undefined;
    }, 2000);
    this.lastUpdate = new Date();
  }

  setName(name: string) {
    this.name = name;
    this.nameTag.setAttribute("value", this.name);
    this.lastUpdate = new Date();
  }

  setPresenter(presenter: boolean) {
    if (presenter) {
      this.nameTag.setAttribute("color", "blue");
      this.nameTag.setAttribute("width", "3");
    } else {
      this.nameTag.setAttribute("color", "lightgreen");
      this.nameTag.setAttribute("width", "2");
    }
  }

  destroy() {
    this.element.remove();
  }
}
