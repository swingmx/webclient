<template>
  <div class="set-ip-modal">
    <label for="">Change the </label>
    <input
      id="modal-input"
      type="text"
      class="rounded-sm"
      v-model="ip_address"
    />
    <button
      class="circular btn-active"
      @click.prevent="setBaseApiUrl(ip_address)"
    >
      Set address
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { setBaseApiUrl, baseApiUrl } from "@/config";

const emit = defineEmits<{
  (e: "setTitle", title: string): void;
}>();
const title = "Set backend address";

const ip_address = ref("http://localhost:1970");

onMounted(() => {
  emit("setTitle", title);
  document.getElementById("modal-input")?.focus();
});
</script>

<style lang="scss">
.set-ip-modal {
  #modal-input {
    margin-top: 1rem;
  }

  button {
    margin: 0 auto;
    margin-top: $small;
    padding: 0 1rem;
  }
}
</style>
