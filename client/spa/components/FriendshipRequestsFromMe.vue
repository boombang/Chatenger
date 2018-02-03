<template>
  <div>
    <h1 class="h1">Заявки в друзья от меня</h1>
    <div class="link-list link-list_border">
      <router-link class="link" to="/friends">Друзья</router-link>
      <router-link class="link" to="/fr-req-to-me">Заявки в друзья ко мне</router-link>
      <router-link class="link" to="/blackList">Черный список</router-link>
    </div>
    <div class="link-list">
      <template v-for="user in users">
        <div class="link-button-line">
          <router-link class="link link-button-line__item" :to="'/profile/' + user.id" :key="user.id">{{user.login}}</router-link>
          <button class="simple-button link-button-line__item" @click="cancelFriendshipRequestFromMe(user.id)">Отменить запрос в друзья</button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import axios from "axios";

  export default {
    name: 'friends',
    data() {
      return {
        users: []
      }
    },
    created() {
      this.$emit('loadStart');
       axios
      .get("/friends/showFriendshipRequestsFromMe")
      .then(response => {
        this.users = response.data.users;
        this.$emit('loadEnd');
      })
      .catch(error => {
        this.$emit('loadEnd');
        this.$router.go(-1);
      });
    },
    methods: {
      cancelFriendshipRequestFromMe(id) {
        this.$emit('loadStart');
        axios
      .post("/friends/cancelFriendshipRequestFromMe", {
        id
      })
      .then(response => {
        this.$router.push('/friends');
          this.$emit('loadEnd');
      })
      .catch(error => {
        this.$emit('loadEnd');
        this.$router.go(-1);
      });
      }
    }
  }

</script>
