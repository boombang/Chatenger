<template>
  <div class="nav">
    <router-link class="link" v-for="item in homeNavProps" :key="item.id" :to="item.path()" @click.native="item.clickHandler">{{item.name}}</router-link>
    <a class="link" href="/auth/logout">Logout</a>
  </div>
</template>

<script>
  export default {
    name: "core-nav",
    props: {
      homeNavProps: {
        type: Array,
        required: true
      }
    }
  }

</script>

<style scoped>
  .nav {
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
