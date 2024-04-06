<template>
  <q-item
    clickable
    :disable="disable"
    :class="!active ? undefined : 'active-link active-link-background'"
    :tag="!!route ? undefined : 'a'"
    :target="!!route ? undefined : '_blank'"
    :href="!!route ? undefined : link"
    @click.prevent="onClick"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon
        :class="getTextClass"
        :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label :class="getTextClass">{{ title }}</q-item-label>
      <q-item-label :class="getTextClass" caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { computed } from 'vue';

const router = useRouter()

export interface EssentialLinkProps {
  title: string;
  caption?: string;
  link?: string;
  route?: string;
  icon?: string;
  active?: boolean;
  dangerous?: boolean;
  disable?: boolean;
  action?: () => any
}
const props = withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
  active: false,
  disable: false,
  dangerous: false
});

const onClick = async () => {
  if (!!props.action) { props.action() }
  if (!!props.route) { await router.replace(props.route) }
}

const getTextClass = computed(() => {
  if (props.active && props.dangerous) {
    return 'active-link dangerous'
  } else if (props.dangerous) {
    return 'dangerous'
  } else if (props.active) {
    return 'active-link'
  } else {
    return 'undefined'
  }
})
</script>

<style scoped lang="scss">
.q-item:hover:not(.active-link-background) {
  background-color: rgba(248, 248, 255, 0.11);
}

.active-link-background {
  background-color: ghostwhite;
}

.active-link {
  color: $dark;
}

.dangerous {
  color: #ff3030;
}
</style>
