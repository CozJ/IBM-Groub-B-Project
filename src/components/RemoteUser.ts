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

  constructor(parentElement: HTMLElement) {
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
}
