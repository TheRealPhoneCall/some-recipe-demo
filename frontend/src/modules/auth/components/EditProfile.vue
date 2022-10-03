<script setup lang="ts">

import { ref, computed, toRef } from 'vue'
import { useUserAuthStore } from '../store'
import { useUiStore } from 'src/stores/ui-store'
import DwPhotoField from 'src/components/fields/DwPhotoField.vue'

const profileForm = ref<HTMLFormElement | null>(null)
const userAuthStore = useUserAuthStore()
const uiStore = useUiStore()

const user = toRef(userAuthStore, 'authedUser')
const toChangePwd = ref(false)
const isPwd = ref(false)
const password = ref('')
const passwordConfirm = ref('')
const toChangePhoto = ref(false)

const isPasswordConfirmed = computed(() => {
  return password.value !== '' && password.value === passwordConfirm.value
})

const photoFilter = computed(() => {
  return {
    filterId: user.value?.username,
    filterType: 'profile'
  }
})

async function onSubmit () {
  console.log('Edit profile submit')
  try {
    let payload = {}
    if (toChangePwd.value && isPasswordConfirmed.value) {
      payload = { ...user.value, password: password.value }
    } else {
      payload = user.value
    }
    await userAuthStore.updateAccount(payload)
    console.log(userAuthStore.authedUser, user.value, payload)
    uiStore.editProfileDialog = false
  } catch (err) {
    console.log(err)
  }
}

</script>

<template>
  <q-dialog
    v-model="uiStore.editProfileDialog"
    position="bottom"
    full-height
    maximized
  >
    <q-card
      ref="profileForm"
      class="q-pa-none"
      v-if="user"
      style="width: 80rem"
      flat
    >
      <q-card-section class="row">
        <div class="text-h6">Edit Profile</div>
        <q-space />
        <q-btn icon="close" @click="uiStore.editProfileDialog = false" flat />
      </q-card-section>

      <q-card-section>

        <q-input
          filled
          v-model="user.firstName"
          label="First Name"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Your first name please']"
        />

        <q-input
          filled
          v-model="user.lastName"
          label="Last Name"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Your last name please']"
        />

        <q-input
          filled
          v-model="user.email"
          label="Email"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Your email please']"
        />

        <q-input
          filled
          v-model="user.username"
          label="Username"
          lazy-rules
          :rules="[ val => val && val.length > 0 || 'Please input your username']"
        />

        <q-btn
          no-caps
          label="Change Password"
          outline
          @click="toChangePwd = !toChangePwd"
          rounded
        />

        <div v-if="toChangePwd">
          <br />
          <q-input
            v-model="password"
            filled
            :type="!isPwd ? 'text' : 'password'"
            label="Password"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <br />

          <q-input
            v-model="passwordConfirm"
            filled
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
          <br />
        </div>
        <br />
        <br />

        <q-btn
          no-caps
          label="Change Photo"
          outline
          @click="toChangePhoto = !toChangePhoto"
          rounded
        />

        <div v-if="toChangePhoto">
          <br />
          <dw-photo-field
            v-model="user.photo"
            filled
            :uploader="user.username"
            :filter="photoFilter"
            label="Photo"
            class="full-width"
            :rules="[
              val => val !== {} ||
              'Please upload a profile photo'
            ]"
          />
        </div>

      </q-card-section>
      <q-card-section>
        <q-btn
          label="Submit"
          color="primary"
          @click="onSubmit"
          :loading="userAuthStore.loading"
        />
          <!-- type="submit" -->
        <q-btn
          label="Cancel"
          color="primary"
          flat
          v-close-popup
        />
      </q-card-section>
    </q-card>

  </q-dialog>
</template>
