<template>
  <div class="main-nav">
    <router-link class="link" v-for="item in homeNavProps" :key="item.id" :to="item.path()" @click.native="item.clickHandler">{{item.name}}</router-link>
    <a class="link" href="/auth/logout">Выйти</a>
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
    }
  }

</script>

<style scoped>
  .main-nav {
    display: flex;
    align-items: center;
    padding: 10px 30px;
    background-color: #17141f;
  }

  .link {
    color: #cbc8d0;
    text-decoration: none;
    margin: 0 10px;
    font-family: Rubik;
  }

  .link:hover {
    text-decoration: underline;
  }

</style>
