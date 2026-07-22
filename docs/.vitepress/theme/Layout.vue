<script setup>
import { useData } from 'vitepress'
import PortfolioLayout from './PortfolioLayout.vue'

const { frontmatter } = useData()
</script>

<template>
  <PortfolioLayout v-if="frontmatter.layout === 'portfolio'" />
  <div v-else class="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
    <Content />
  </div>
</template>
