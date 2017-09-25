<template>
  <div>
    <h1 class="h1">Черный список</h1>
    <div class="link-list link-list_border">
      <router-link class="link" to="/friends">Друзья</router-link>
      <router-link class="link" to="/fr-req-to-me">Заявки в друзья ко мне</router-link>
      <router-link class="link" to="/fr-req-from-me">Заявки в друзья от меня</router-link>
      <router-link class="link" to="/addToBlackList">Добавить в черный список</router-link>
    </div>
    <div class="link-list">
      <template v-for="user in users">
        <div class="link-button-line">
          <router-link class="link link-button-line__item" :to="'/profile/' + user.id" :key="user.id">{{user.login}}</router-link>
          <button class="simple-button link-button-line__item" @click="removeFromBlackList(user.id)">Удалить из черного списка</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'black-list',
    data() {
      return {
        users: []
      }
    },
    created() {
      this.$emit('loadStart');
      this.$http.get('/api/friends/showBlackList').then(response => {
        this.users = response.body;
        this.$emit('loadEnd');
      }, response => {
        this.$emit('loadEnd');
        this.$router.go(-1);
      })
    },
    methods: {
      removeFromBlackList(id) {
        this.$emit('loadStart');
        this.$http.post('/api/friends/RemoveFromBlackList', JSON.stringify({
          id: id
        })).then(response => {
          this.users = response.body;
          this.$emit('loadEnd');
        }, response => {
          this.$emit('loadEnd');
          this.$router.go(-1);
        })
      }
    }
  }

</script>
