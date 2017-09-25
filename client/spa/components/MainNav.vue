<template>
  <div class="main-nav">
    <router-link class="main-nav__link" v-for="item in homeNavProps" :key="item.id" :to="item.path()" @click.native="item.clickHandler">{{item.name}}</router-link>
  </div>
</template>

<script>
  export default {
    name: "main-nav",
    props: {
      homeNavProps: {
        type: Array,
        required: true
      }
    },
    data() {
      return {

      }
    }
  }

</script>

<style>
  .main-nav {
    display: flex;
    align-items: center;
    padding: 10px 30px;
    background-color: #17141f;
    &__link {
      color: #cbc8d0;
      text-decoration: none;
      margin: 0 10px;
    }
    &__link:hover {
      text-decoration: underline;
    }
  }

</style>
