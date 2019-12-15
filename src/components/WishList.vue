<template>
  <div>
    <div id="main-content" class="container">
      <b-list-group>
        <b-list-group-item
          v-for="message in this.received_messages"
          :key="message.id"
        >{{message.name}}</b-list-group-item>
      </b-list-group>
      <br>
      <b-button squared variant="info" v-on:click="fetchData">More</b-button>
    </div>
  </div>
</template>

<script>
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import axios from "axios";

export default {
  name: "websocketdemo",
  data() {
    return {
      received_messages: [],
      send_message: null,
      connected: false,
      page: -1
    };
  },
  methods: {
    fetchData() {
      this.page++;
      axios({
        method: "GET",
        url:
          "http://localhost:8080/fetchAllByPageNumber?pageNumber=" + this.page
      }).then(
        result => {
          this.received_messages.push(...Array.from(new Set(result.data)));
        },
        error => {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      );
    },
    connect() {
      this.socket = new SockJS("http://localhost:8080/wl-websocket");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
        {},
        frame => {
          this.connected = true;
          this.stompClient.subscribe("/topic/wishes/", tick => {
            let data = JSON.parse(tick.body);
            if ("ADD" === data.type) {
              if (!this.received_messages.find(x => x.id === data.wishDto.id)) {
                this.received_messages.splice(0, 0, data.wishDto);
                if (this.received_messages.length > 10 * (this.page + 1)) {
                  this.received_messages.splice(10);
                }
              }
            } else {
              if (this.received_messages.find(x => x.id === data.wishDto.id)) {
                this.received_messages.splice(
                  this.received_messages.findIndex(
                    x => x.id === data.wishDto.id
                  ),
                  1
                );
              }
            }
            //this.received_messages.push(JSON.parse(tick.body).content);
          });
        },
        error => {
          this.connected = false;
        }
      );
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
      this.connected = false;
    },
    tickleConnection() {
      this.connected ? this.disconnect() : this.connect();
    }
  },
  mounted() {
    this.connect();
    this.fetchData();
  }
};
</script>


