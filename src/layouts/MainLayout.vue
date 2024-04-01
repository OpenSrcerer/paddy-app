<template>
  <q-layout view="lHh Lpr lFf">
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
          Quick Links
        </q-item-label>

        <EssentialLink
          v-for="link in links"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container style="height: 100vh">
      <slot/>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';

export interface MainLayoutProps {
  links?: EssentialLinkProps[]
}
const props = withDefaults(defineProps<MainLayoutProps>(), {
  links: () => [
    {
      title: 'My Blog',
      caption: 'danielstefani.online',
      icon: 'school',
      link: 'https://danielstefani.online'
    }
  ]
})

const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => leftDrawerOpen.value = !leftDrawerOpen.value
</script>

<style lang="scss">
@media (max-width: 462px) {
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
