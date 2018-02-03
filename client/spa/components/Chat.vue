<template>
  <div class="chat">
    <div class="link-list link-list_row">
      <router-link class="link" to="/createPartyDialog">Создать групповой диалог</router-link>
      <router-link class="link" v-show="dialogType === 'party'" to="/dialogSettings">Настройки диалога</router-link>
    </div>
    <div class="chat-menu">
      <chat-select @dialogSelect="dialogSelect(arguments)" dialoguesType="tat" :dialoguesId="tatDialoguesId" :dialoguesNames="tatDialoguesNames"
        defaultOption="Выберите личный диалог"></chat-select>
      <chat-select @dialogSelect="dialogSelect(arguments)" dialoguesType="party" :dialoguesId="partyDialoguesId" :dialoguesNames="partyDialoguesNames"
        :isCreator="isCreator" defaultOption="Выберите групповой диалог"></chat-select>
    </div>
    <template v-show="connection">
      <div class="chat__messages">
        <div class="chat__message" v-for="message in messages">{{message}}</div>
      </div>
      <div class="chat__writing">
        <textarea class="textarea" placeholder="Напишите сообщение..." id="chat-input" v-model="message"></textarea>
        <button class="simple-button" @click="sendMessage">Отправить сообщение</button>
      </div>
    </template>
  </div>
</template>

<script>
  import axios from "axios";
  import io from 'socket.io-client'

  import ChatSelect from './ChatSelect';

  export default {
    name: 'chat',
    props: {
      reinitChat: {
        type: Boolean,
        required: true
      }
    },
    data() {
      return {
        dialogType: null,
        tatDialoguesId: [],
        tatDialoguesNames: [],
        partyDialoguesId: [],
        partyDialoguesNames: [],
        isCreator: [],
        message: '',
        messages: [],
        users: [],
        socket: null,
        socketDialogName: ''
      }
    },
    created() {
      // this.chatInit();
    },
    watch: {
      reinitChat: {
        handler: function (value) {
          if (value) this.chatInit();
        }
      }
    },
    methods: {
      chatInit() {
        this.socket = io();

        this.socket.on('chat message', msg => this.messages.push(msg));

        axios
        .get("/dialogues/initDialogues")
        .then(({data}) => {
          this.tatDialoguesId = data.tatDialoguesId;
          this.tatDialoguesNames = data.tatDialoguesNames;
          this.partyDialoguesId = data.partyDialoguesId;
          this.partyDialoguesNames = data.partyDialoguesNames;
          this.isCreator = data.isCreator;
          this.$emit('chatReady');
        })
        .catch(error => {
          console.log(error);
        });
      },
      dialogSelect(props) {
        let dialogType = props[0],
          dialogId = props[1];

        this.messages.length = 0;

        if(this.socketDialogName) {
          this.socket.emit('leave room', this.socketDialogName);
        }

        this.dialogType = dialogType;
        this.socketDialogName = `${dialogType}-${dialogId}`;

        this.socket.emit('join room', this.socketDialogName);

        // this.connection.onClosed = function (e) {
        //   if (e) {
        //     this.messages.push('Connection closed with error: ' + e);
        //   } else {
        //     this.messages.push('Disconnected');
        //   }
        // };

        // this.connection.on('SetUsersOnline', usersOnline => {
        //   usersOnline.forEach(user => this.addUserOnline(user));
        // });

        // this.connection.on('UsersJoined', users => {
        //   users.forEach(user => {
        //     this.messages.push('Пользователь ' + user.Name + ' присоединился к чату');
        //     this.addUserOnline(user);
        //   });
        // });

        // this.connection.on('UsersLeft', users => {
        //   users.forEach(user => {
        //     this.messages.push('Пользователь ' + user.Name + ' покинул чат');
        //   });
        // });

        // this.connection.on('Send', (userName, message) => {
        //   this.messages.push(userName + ': ' + message);
        // });

        // this.connection.start(this.transportType).catch((err) => {
        //   console.log(err);
        // });
      },

      sendMessage() {
        this.socket.emit('chat message', this.message);
        this.message = '';
      },

      addUserOnline(user) {
        this.users.push(user);
      },

      getParameterByName(name, url) {
        if (!url) {
          url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
      }
    },
    components: {
      ChatSelect
    }
  }

</script>

<style>
  .chat {
    background-color: #efeef1;
  }

  .chat-menu {
    display: flex;
    justify-content: space-between;
  }

  .chat__messages {
    height: calc(100% - 189px);
    padding: 10px 0;
    overflow-y: auto;
  }

</style>
