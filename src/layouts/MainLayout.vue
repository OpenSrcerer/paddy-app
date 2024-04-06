<template>
  <q-layout
    view="lHh Lpr lFf"
  >
    <q-header>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="toolbar-content-wrapper">
          <slot name="toolbar">
            <h5>Paddy App</h5>
            <div id="made-with-love">Made with ❤️</div>
          </slot>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Daemon Menu
        </q-item-label>

        <!-- Navigation Links -->
        <div v-if="navLinks.length">
          <EssentialLink
            v-for="link in navLinks"
            :key="link.title"
            v-bind="link"
            :active="isLinkActive(link)"
          />
          <hr>
        </div>

        <!-- Management Links -->
        <div v-if="actionLinks.length">
          <EssentialLink
            v-for="link in actionLinks"
            :key="link.title"
            v-bind="link"
            :active="isLinkActive(link)"
          />
          <hr>
        </div>

        <!-- Default Links -->
        <EssentialLink
          v-for="link in defaultLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container
      v-touch-swipe.right="openLeftDrawer"
      v-touch-swipe.left="closeLeftDrawer"
      style="height: 100dvh"
    >
      <slot/>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import { LocalStorage } from 'quasar';
import { LoginCredential } from 'src/backend/session/dto/LoginCredential';
import { useRoute } from 'vue-router';

const route = useRoute()

export interface MainLayoutProps {
  navLinks?: EssentialLinkProps[],
  actionLinks?: EssentialLinkProps[],
}
const props = withDefaults(defineProps<MainLayoutProps>(), {
  navLinks: () => [],
  actionLinks: () => []
})

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => leftDrawerOpen.value = !leftDrawerOpen.value
const openLeftDrawer = () => leftDrawerOpen.value = true
const closeLeftDrawer = () => leftDrawerOpen.value = false

const defaultLinks = [
  {
    title: 'Logout',
    caption: '',
    icon: 'logout',
    route: '/',
    action() { LocalStorage.remove(LoginCredential.REFRESH_TOKEN) },
    dangerous: true
  }
]

const isLinkActive = (link: EssentialLinkProps): boolean => {
  if (!link.route) return false
  return route.path.endsWith(link.route);
}
</script>

<style lang="scss">
@media (max-width: 350px) {
  #made-with-love {
    display: none;
  }
}

.toolbar-content-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
}

.q-header {
  border-bottom: 1px solid rgb(255, 255, 255)
}

.q-drawer__content, .q-layout__section--marginal {
  background-color: $dark;
}
</style>

<style scoped lang="scss">
.q-toolbar__title h5 {
  margin: 0;
}
</style>
