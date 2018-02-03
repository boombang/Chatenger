<template>
  <form class="simple-form" @submit.prevent="onSubmit" method="POST" :action="formProps.httpPath">
    <simple-input v-for="item in formProps.inputProps" :key="item.id" v-model="values[item.name]" :placeholder="item.placeholder"
      :type="item.type" :name="item.name" :required="item.required" :disabled="disabled">
    </simple-input>
    <button class="simple-button" type="submit" :disabled="disabled">{{formProps.formSubmitName}}</button>
  </form>
</template>

<script>
import axios from "axios";

import SimpleInput from "./SimpleInput.vue";

export default {
  name: "simple-form",
  props: {
    formProps: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      disabled: false,
      values: {}
    };
  },
  created() {
    this.formProps.inputProps.forEach(inputProp => {
      this.values[inputProp.name] = undefined;
    });
  },
  methods: {
    onSubmit(e) {
      this.disabled = true;
      if (this.formProps.validation()) {
        if (this.formProps.isNotAjax) {
          e.target.submit();
        } else {
          axios
            .post(this.formProps.httpPath, this.values)
            .then(response => {
              this.$emit("submitOk", response.body);
            })
            .catch(error => {
              this.$emit("submitBad", error);
            })
            .then(() => {
              this.disabled = false;
            });
        }
      } else {
        this.disabled = false;
      }
    }
  },
  components: {
    SimpleInput
  }
};
</script>

<style>
.simple-form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.simple-form_left {
  align-items: flex-start;
}
</style>
