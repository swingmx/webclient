<template>
  <div class="settingsnav">
    <button @click="resetClient">
      &nbsp;&nbsp; {{ $t('Nav.ResetClient') }} &nbsp;&nbsp;
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const resetClient = () => {
  localStorage.clear();
  router.go(0);
};
</script>
