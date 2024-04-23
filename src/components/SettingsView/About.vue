<template>
  <div class="aboutswingmusic">
    Swing Music is a labor of love developed by
    <a href="https://github.com/cwilvx" target="_blank">@<u>cwilvx</u></a> on GitHub. If you like this software, please
    consider donating to support development and giving it a star on GitHub. <br /><br /><br />
    <div class="flex">
      <a href="https://swingmusic.vercel.app/support-us.html" target="_blank"> <button>Donate</button></a
      ><a href="https://github.com/cwilvx/swingmusic" target="_blank"><button>Star on Github</button></a>
      <a href="https://github.com/cwilvx" target="_blank"><button>Follow @cwilvx on Github</button></a>
    </div>

    <br /><br />
    If you encounter any bugs, please open an issue on GitHub. If you would like to get involved in development, start
    with the
    <a href="https://github.com/cwilvx/swingmusic/blob/master/.github/contributing.md" target="_blank"
      ><u>contribution guidelines</u></a
    >.

    <br /><br /><br />
    <div class="flex">
      <a href="https://github.com/cwilvx/swingmusic/issues/new/choose" target="_blank">
        <button>Open an Issue</button>
      </a>
      <a href="https://github.com/cwilvx/swingmusic/blob/master/.github/contributing.md" target="_blank"
        ><button>Contribute</button></a
      >
    </div>
    <br /><br />
    Hope you enjoy using Swing Music as much as I enjoy building it.
    <br /><br />
    <div class="hireme rounded">
      <h2>Hire me</h2>
      If you like my work, and would like me to work for you or your company, I'm open to offers. Feel free to reach out
      to me via email.
      <br /><br />
      <div class="flex">
        <a
          href="mailto:geoffreymungai45@gmail.com?subject=Job Offer&body=Hi Mungai,
        "
          target="_blank"
          ><button>Write Email</button></a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.aboutswingmusic {
  padding: $small;
  margin-top: 2rem;
  font-weight: 600;

  .flex {
    gap: 1rem;
  }

  .hireme {
    background-color: #ffffff;
    background-image: linear-gradient(37deg, #bfeaf0 0%, #ffffff00 50%, #a7dcff 100%);
    padding: 1rem;
    color: $black;

    button {
      background-color: $blue;
    }

    h2 {
      margin-top: $small;
    }
  }
}
</style>
