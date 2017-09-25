<template>
  <div class="container app-enter">
    <h1 class="h1">Добро пожаловать на Chatenger!</h1>
    <router-link class="app-enter__link link" to="/auth">Обратно ко входу</router-link>
    <h2 class="h2">Регистрация</h2>
    <simple-form :formProps="formProps" @submitOk="submitOk($event)">
    </simple-form>
  </div>
</template>

<script>
  import SimpleForm from "./SimpleForm.vue";

  export default {
    name: 'registration',
    data() {
      return {
        formProps: {
          formSubmitName: "Зарегистрироваться",
          httpPath: "/welcome/signup",
          validation: () => {
            let
              passwordInput = document.querySelector('input[name="password"]'),
              confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
            if (passwordInput.value !== confirmPasswordInput.value) {
              alert("Пароли не совпадают");
              return false;
            }
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
          }, {
            name: "confirmPassword",
            type: "password",
            maxlength: 40,
            placeholder: 'Повторите ваш пароль',
            required: true
          }, {
            name: "email",
            type: "email",
            maxlength: 129,
            placeholder: 'Введите ваш email',
            required: true
          }]
        }
      }
    },
    methods: {
      submitOk($event) {
        this.$router.push("/auth");
      }
    },
    components: {
      SimpleForm
    }
  }

</script>
<style scoped>


</style>
