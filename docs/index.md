---
layout: custom
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  const userLang = navigator.language || navigator.userLanguage
  if (userLang.startsWith('pt')) {
    window.location.replace('./pt/')
  } else {
    window.location.replace('./en/')
  }
})
</script>
