<template>
  <div>
    <h1 class="h1">Друзья</h1>
    <div class="link-list link-list_border">
      <router-link class="link" to="/fr-req-to-me">Заявки в друзья ко мне</router-link>
      <router-link class="link" to="/fr-req-from-me">Заявки в друзья от меня</router-link>
      <router-link class="link" to="/blackList">Черный список</router-link>
    </div>
    <div class="link-list">
      <router-link class="link" v-for="user in users" :to="'/profile/' + user.id" :key="user.id">{{user.login}}</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'friends',
    data() {
      return {
        users: []
      }
    },
    created() {
      this.$emit('loadStart');
      this.$http.get('/api/friends/getFriends').then(response => {
        this.users = response.body;
        this.$emit('loadEnd');
      }, response => {
        this.$emit('loadEnd');
        this.$router.go(-1);
      })
    }
  }

</script>
