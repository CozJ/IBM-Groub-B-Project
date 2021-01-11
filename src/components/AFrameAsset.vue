<template>
  <a-assets-item id="{{ id }}" src="../assets/Room/materials.mtl"></a-assets-item>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    id: String
  }
})
export default class AFrameAsset extends Vue {
  id!: string;
}
</script>
