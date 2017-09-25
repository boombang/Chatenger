<template>
  <div class="container app-enter">
    <h1 class="h1">Добро пожаловать на Chatenger!</h1>
    <simple-form :formProps="formProps" @submitOk="submitOk($event)">
    </simple-form>
    <router-link class="app-enter__link link" to="/registration">Зарегистрироваться</router-link>
  </div>
</template>

<script>
  import SimpleForm from "./SimpleForm.vue";

  export default {
    name: 'welcome',
    data() {
      return {
        formProps: {
          formSubmitName: "Войти",
          httpPath: "/welcome/auth-local",
          validation: () => {
            return true;
          },
          inputProps: [{
            name: "login",
            type: "text",
            maxlength: 30,
            placeholder: 'Введите ваш логин',
            required: true
          }, {
            name: "password",
            type: "password",
            maxlength: 40,
            placeholder: 'Введите ваш пароль',
            required: true
          }]
        }
      }
    },
    methods: {
      submitOk($event) {
        this.$router.push("/");
      }
    },
    components: {
      SimpleForm
    }
  }

</script>

<style>
  .app-enter {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 15vh;
    background: #edeef0;
    height: 100vh;
    width: 100%;
  }

</style>
