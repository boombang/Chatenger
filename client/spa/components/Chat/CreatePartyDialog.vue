<template>
  <div>
    <h1 class="h1">Создание группового диалога</h1>
    <simple-form class="simple-form_left" :formProps="formProps" @submitOk="submitOk($event)">
    </simple-form>
  </div>
</template>

<script>
  import SimpleForm from "../Simple/SimpleForm.vue";

  export default {
    name: "create-party-dialog",
    data() {
      return {
        formProps: {
          formSubmitName: "Создать диалог",
          httpPath: "/dialogues/createPartyDialog",
          validation: () => {
            return true
          },
          inputProps: [{
            name: "name",
            type: "text",
            maxlength: 20,
            placeholder: 'Название диалога',
            required: true
          }]
        },
        redirectPath: "/"
      }
    },
    methods: {
      submitOk($event) {
        alert('Вы создали новый групповой диалог!');
        this.$emit('chatLoad');
        this.$router.push(this.redirectPath);
      }
    },
    components: {
      SimpleForm
    }
  }

</script>
