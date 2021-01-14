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
}


export default class RemoteUser {
  element: AFrame.Entity = document.createElement("a-entity");
  emote: AFrame.Entity = document.createElement("a-image");
  emoteTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

  constructor(parentElement: HTMLElement) {
    // Emote
    this.emote.setAttribute("width", "724");
    this.emote.setAttribute("height", "515");
    this.emote.setAttribute("position", "0.016 0.4 0");
    this.emote.setAttribute("rotation", "0 180 0");
    this.emote.setAttribute("scale", "0.001 0.001 0.001");
    this.emote.setAttribute("geometry", "primitive: plane;");
    this.emote.setAttribute("material", "src: #emote-image-unamused");
    this.emote.setAttribute("transparent", "true");
    this.emote.setAttribute("visible", "false");
    this.element.appendChild(this.emote);
    
    // Main append
    this.element.setAttribute("gltf-model", "#asset-remote-user");
    parentElement.appendChild(this.element);
  }

  setNetworkTransform(packet: NetworkTransform) {
    if (this.element.object3D !== undefined) {
      this.element.object3D.position.set(packet.position.x, packet.position.y, packet.position.z);
      this.element.object3D.rotation.setFromQuaternion(new THREE.Quaternion(
        packet.rotation._x, packet.rotation._y, packet.rotation._z, packet.rotation._w
      ));
    } else {
      this.element.setAttribute("position", `${packet.position.x} ${packet.position.y} ${packet.position.z}`);
    }
  }

  setEmote(name: string) {
    this.emote.setAttribute('material', `src: #emote-image-${name}`);
    this.emote.setAttribute('visible', 'true');

    if (typeof this.emoteTimeout !== "undefined")
      clearTimeout(this.emoteTimeout);

    this.emoteTimeout = setTimeout(() => {
      this.emote.setAttribute("visible", "false");
      this.emoteTimeout = undefined;
    }, 2000);
  }
}
