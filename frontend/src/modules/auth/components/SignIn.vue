<script setup lang="ts">

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserAuthStore } from '../store'

const signinForm = ref<HTMLFormElement | null>(null)
const router = useRouter()
const userAuth = useUserAuthStore()

const state = reactive({
  username: '',
  password: '',
  isPwd: true
})

async function onSubmit () {
  console.log('Signing user')
  if (signinForm.value?.validate()) {
    const { username, password } = state
    const payload = { username, password }
    try {
      await userAuth.signIn(payload)

      setTimeout(() => {
        router.push('/recipes')
      })
    } catch (e) {
      console.log(e)
    }
  }
}

</script>

<template>
  <q-page>
    <q-form
      ref="signinForm"
      @submit="onSubmit"
      class="row justify-center q-pa-none"
    >
      <q-card
        style="max-width: 80%"
        class="fixed-center col-xs-10 col-sm-10 col-md-8 col-lg-5 q-pa-none"
      >
        <q-card-section>
          <div class="text-h6">Login</div>
          <q-space />
        </q-card-section>

        <q-card-section>
          <q-input
            filled
            v-model="state.username"
            label="username"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Your username please']"
          />

          <q-input
            v-model="state.password"
            filled
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

        </q-card-section>
        <q-card-section v-if="userAuth.error">
          <div
            class="text-caption"
            style="color: red"
          >{{ userAuth.error }}</div>
        </q-card-section>
        <q-card-section>
          <q-btn
            label="Login"
            type="submit"
            color="primary"
            :loading="userAuth.loading"
          />
          <q-btn
            label="Sign Up"
            color="primary"
            flat
            to="/auth/sign-up"
          />
        </q-card-section>
      </q-card>

    </q-form>
  </q-page>
</template>
