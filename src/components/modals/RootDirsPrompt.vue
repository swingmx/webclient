<template>
  <div class="root-dirs-prompt">
    <h3 class="t-center">Where do you want to look for music?</h3>
    <div class="options-group">
      <div class="option">
        <b>Everywhere</b>
        <div class="info">Scan all folders in your home directory.</div>
      </div>
      <br />
      <div class="option" @click="modal.showSetRootDirsModal">
        <b>Customize root directories</b>
        <div class="info">Select folders to scan for music.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import useModalStore from "@/stores/modal";

const modal = useModalStore();
</script>

<style lang="scss">
.root-dirs-prompt {
  .option {
    padding: 1rem;
    border-radius: $small;
    border: solid $darkestblue;
    position: relative;

    .info {
      margin-top: $smaller;
      font-size: small;
    }
  }
}
</style>
