<template>
  <div>
    <h1 class="h1">Удаление аккаунта</h1>
    <router-link class="link" to="/editprofile">Обратно к настройкам профиля</router-link>
    <simple-form class="simple-form_left" :formProps="formProps" @submitBad="submitBad">
    </simple-form>
  </div>
</template>

<script>
import SimpleForm from "./SimpleForm.vue";

export default {
  name: "delete-account",
  data() {
    return {
      formProps: {
        formSubmitName: "Удалить акканут",
        isNotAjax: true,
        httpPath: "/profile/deleteAccount",
        validation: () => {
          let passwordInput = document.querySelector('input[name="password"]'),
            confirmPasswordInput = document.querySelector(
              'input[name="confirmPassword"]'
            );
          if (passwordInput.value !== confirmPasswordInput.value) {
            alert("Пароли не совпадают");
            return false;
          }
          return true;
        },
        inputProps: [
          {
            name: "password",
            type: "password",
            maxlength: 40,
            placeholder: "Введите ваш новый пароль",
            required: true
          },
          {
            name: "confirmPassword",
            type: "password",
            maxlength: 40,
            placeholder: "Подтвердите ваш новый пароль",
            required: true
          }
        ]
      },
      redirectPath: "/auth"
    };
  },
  methods: {
    // getCookie(name) {
    //   var matches = document.cookie.match(
    //     new RegExp(
    //       "(?:^|; )" +
    //         name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
    //         "=([^;]*)"
    //     )
    //   );
    //   return matches ? decodeURIComponent(matches[1]) : false;
    // },
    // deleteCookie(name, path, domain) {
    //   if (this.getCookie(name)) {
    //     document.cookie =
    //       name +
    //       "=" +
    //       (path ? ";path=" + path : "") +
    //       (domain ? ";domain=" + domain : "") +
    //       ";expires=Thu, 01 Jan 1970 00:00:01 GMT";
    //   }
    //   this.$store.commit("authFlag", false);
    // },
    submitBad() {
      alert("Упс, что-то пошло не так... Попробуйте снова!");
    }
  },
  components: {
    SimpleForm
  }
};
</script>
