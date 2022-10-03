<script setup lang="ts">

import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAuthStore } from '../store'

const signupForm = ref<HTMLFormElement | null>(null)
const userAuth = useUserAuthStore()
const router = useRouter()

const state = reactive({
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  passwordConfirm: '',
  btnLoading: false,
  accept: false,
  isPwd: true,
  userType: 'user'
})

const isPasswordConfirmed = computed(() => {
  return state.password !== '' && state.password === state.passwordConfirm
})

async function onSubmit () {
  console.log('Submitting registration')
  if (signupForm.value?.validate() && isPasswordConfirmed) {
    const {
      firstName, lastName,
      email, username, password, userType
    } = state

    const payload = {
      firstName,
      lastName,
      email,
      username,
      password,
      userType
    }

    try {
      await userAuth.signUp(payload)

      setTimeout(() => {
        router.push('/recipes')
      }, 1000)
    } catch (err) {
      console.log(err)
    }
  }
}

</script>

<template>
  <q-page>
    <q-form
      ref="signupForm"
      @submit.prevent="onSubmit"
      class="row justify-center q-px-none q-mx-none"
    >
      <q-card
        style="width: 80%"
        class="fixed-center q-px-none"
      >
        <q-card-section>
          <div class="text-h6">Sign Up</div>
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            v-model="state.firstName"
            label="First Name"
            dense
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Your first name please']"
          />

          <q-input
            filled
            dense
            v-model="state.lastName"
            label="Last Name"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Your last name please']"
          />

          <q-input
            filled
            dense
            v-model="state.email"
            label="Email"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Your email please']"
          />

          <q-input
            filled
            dense
            v-model="state.username"
            label="Username"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please input your username']"
          />

          <q-input
            v-model="state.password"
            filled
            dense
            :type="!state.isPwd ? 'text' : 'password'"
            label="Password"
          >
            <template v-slot:append>
              <q-icon
                :name="state.isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="state.isPwd = !state.isPwd"
              />
            </template>
          </q-input>
          <br />

          <q-input
            v-model="state.passwordConfirm"
            filled
            dense
            type="password"
            label="Confirm Password"
            debounce="1000"
          >
            <template v-slot:append>
              <q-icon
                :name="isPasswordConfirmed ? 'done' : 'close'"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-field
            :value="state.accept"
            :rules="[ value => value || 'Please accept our user agreement']"
            borderless
            dense
          >
            <template v-slot:control>
              <q-checkbox
                v-model="state.accept"
                label="Do you accept our user agreement?"
                color="primary"
              />
            </template>
          </q-field>

        </q-card-section>
        <q-card-section>
          <q-btn
            label="Sign Up"
            color="primary"
            @click="onSubmit"
            :loading="state.btnLoading"
          />
          <q-btn
            label="Cancel"
            color="primary"
            flat
            to="/recipes"
          />
        </q-card-section>
      </q-card>

    </q-form>
  </q-page>
</template>
