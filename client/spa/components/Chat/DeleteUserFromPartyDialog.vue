<template>
  <div>
    <h1 class="h1">Удаление пользователя из диалога</h1>
    <form class="simple-form simple-form_left">
      <input class="simple-input" type="text" v-model="userLogin">
    </form>
    <button class="simple-button" @click="submit()">Удалить</button>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: "add-user-to-party-dialog",
    data() {
      return {
        userLogin: ''
      }
    },
    methods: {
      submit() {
        axios
        .post('/dialogues/removeUserFromPartyDialog', {
          id: this.$store.state.dialogId,
          login: this.userLogin
        })
        .then(response => {
          this.$router.push('/');
          alert('Вы успешно добавили пользователя в диалог!');
        })
        .catch(err => alert('Что-то пошло не так... Попробуйте еще разок!'));
      }
    }
  }

</script>
