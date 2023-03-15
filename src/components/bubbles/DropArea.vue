<template>
  <div class="bin-drop-area t-center rounded-sm">
    <div class="bin-count circular">10</div>
    DROP TRACKS HERE
    <br />
  </div>
</template>

<style lang="scss">
.bin-drop-area {
  // background-color: $gray;
  color: $pink;
  padding: $medium;
  border-radius: $small;
  height: 5rem;
  position: relative;
  display: grid;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23989696FF' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='100' stroke-linecap='square'/%3e%3c/svg%3e");
  border-radius: 10px;

  .bin-count {
    position: absolute;
    top: -$medium;
    right: -$medium;
    font-size: 14px;
    width: 2rem;
    aspect-ratio: 1;
    font-weight: 600;

    background-color: $pink;
    color: white;

    padding: $smaller;
    margin-bottom: $small;

    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
