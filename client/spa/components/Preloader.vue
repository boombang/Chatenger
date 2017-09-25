<template>
  <div class="preloader-wrapper" v-bind:style="{backgroundColor: preloaderProps.themeBackgroundColor}">
    <div class="preloader" v-bind:style="{borderLeftColor: preloaderProps.preloaderColor}"></div>
  </div>
</template>

<script>
  export default {
    name: 'preloader',
    props: {
      preloaderProps: {
        type: Object,
        required: true
      }
    }
  }

</script>

<style scoped>
  @keyframes rotation {
    100% {
      transform: rotate(360deg);
    }
  }
  
  .preloader-wrapper {
    --theme-background-color: transparent;
    display: flex;
    opacity: .9;
    background-color: var(--theme-background-color);
  }
  
  .preloader {
    --preloader-color: #000;
    width: 30px;
    height: 30px;
    border-width: 3px;
    border-style: solid;
    border-color: transparent transparent transparent var(--preloader-color);
    border-radius: 100%;
    animation: rotation 0.6s linear infinite;
    margin: auto;
  }

</style>
