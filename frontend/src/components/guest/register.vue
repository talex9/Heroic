<template>
  <div class="heroic-guest-register">
    <heroic-title>Register</heroic-title>
    <heroic-loading v-if="loading">Processing</heroic-loading>
    <div v-if="!loading" class="left-inner">
      <h1>Registration</h1>
      <p>Nice to see a new face around these parts!</p>

      <form @submit.prevent="register()" novalidate>
        <div class="form-group" :class="{'is-invalid': error == 'username'}">
          <label>Username</label>
          <input type="text" class="form-control" v-model="user.username">
          <div class="invalid-feedback">Invalid Username</div>
        </div>
        <div class="form-group" :class="{'is-invalid': error == 'email'}">
          <label>Email</label>
          <input type="text" class="form-control" v-model="user.mail">
          <div class="invalid-feedback">Invalid Email</div>
        </div>
        <div class="form-group" :class="{'is-invalid': error == 'password'}">
          <label>Password</label>
          <input type="password" class="form-control" v-model="user.password">
          <div class="invalid-feedback">Invalid Password</div>
        </div>
        <button type="submit" class="btn btn-green w-100">Let's go!</button>
      </form>
      <router-link :to="{ name: 'Guest.Login' }" class="link">Or Login...</router-link>
    </div>
  </div>
</template>

<script>
import { API, Store } from '../../app'

export default {
  data () {
    return {
      loading: false,
      submitted: false,
      error: null,
      user: {
        username: '',
        mail: '',
        password: ''
      }
    }
  },
  created: function () {
    this.$watch('user', (newV, oldV) => {
      this.submitted = false
      this.error = null
    }, {
      deep: true
    })
  },
  methods: {
    async register () {
      try {
        this.loading = true
        this.submitted = true

        await API.post('user', { user: this.user })

        await Store.Session.dispatch('login', {
          username: this.user.username,
          password: this.user.password
        })

        this.$router.push({ name: 'Home.Home' })
      } catch (e) {
        this.loading = false
        this.submitted = true
        this.error = e.response.data.message
      }
    }
  }
}
</script>
