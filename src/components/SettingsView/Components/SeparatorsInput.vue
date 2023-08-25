<template>
  <div class="artist-separators-input">
    <form @submit.prevent="submitInput">
      <input
        v-model="input"
        type="search"
        class="rounded-sm"
      />
      <div class="preview">
        <span
          v-for="p in preview_items"
          :key="p"
          class="circular"
          :class="!default_input_list.includes(p) ? 'new' : ''"
          ><b>
            {{ p }}
          </b></span
        >
      </div>
      <button>Save</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

const input = ref("");

const props = defineProps<{
  default: () => string[];
  submit: (input: string) => void;
}>();

let default_input_list = <string[]>[];
const splitInput = (input: string) => {
  const i = input
    .trim()
    .split(",")
    .filter((x) => x.trim() != "");

  // trim and remove duplicates
  const trimmed = i.map((x) => x.trim());
  const unique = [...new Set(trimmed)];

  return [",", ...unique];
};
function submitInput() {
  // check if input has changed
  function joinAndSort(arr: string[]) {
    return arr.slice(1).sort().join(",");
  }

  const default_ = joinAndSort(default_input_list);
  const preview_ = joinAndSort(preview_items.value);

  if (preview_ == default_) return;

  props.submit(preview_);
}

const preview_items = computed(() => splitInput(input.value));

onMounted(() => {
  const default_ = props.default();
  if (!default_) return;

  input.value = default_.join(", ");
  default_input_list = splitInput(input.value);
});
</script>

<style lang="scss">
.artist-separators-input {
  margin-top: $small;

  input {
    width: 100%;
    border: none;
    outline: none;

    padding: $small;
    background-color: $gray5;
    color: white;
    font-size: 1rem;
  }

  .preview {
    display: flex;
    gap: $small;
    margin: $medium 0;

    span {
      background-color: $gray3;
      color: white;
      font-size: 1rem;
      padding: $smaller 1rem;
      font-size: 14px;
    }

    span.new {
      background-color: $darkblue;
    }
  }

  button {
    padding: 0 1rem;
  }
}
</style>
