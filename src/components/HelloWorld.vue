<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div v-for="message in messages" v-bind:key="message.key">
      <h3>{{message.nickname}}: {{message.text}}</h3>
      
    </div>
    
  </div>
</template>

<script>
import api from "../api"
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  data () {
    return {
      messages: []
    }
  },
  mounted () {
    this.getMessages()
  },
  methods : {

    getMessages() {
      api.db('messages').on('child_added', snapshot => {
        this.messages.push(snapshot.val())
      })
    }


  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
