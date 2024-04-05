<template>
  <q-item
    clickable
    :class="!active ? undefined : 'active-link'"
    :tag="!!route ? undefined : 'a'"
    :target="!!route ? undefined : '_blank'"
    :href="!!route ? undefined : link"
    @click.prevent="onClick"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :class="!active ? undefined : 'active-link'" :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="!active ? undefined : 'active-link'">{{ title }}</q-item-label>
      <q-item-label :class="!active ? undefined : 'active-link'" caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  route?: string;
  icon?: string;
  active?: boolean;
  action?: () => any
}
const props = withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
  active: false
});

const onClick = async () => {
  if (!!props.action) { props.action() }
  if (!!props.route) { await router.replace(props.route) }
}
</script>

<style scoped lang="scss">
.active-link {
  background-color: ghostwhite;
  color: black;
}
</style>
