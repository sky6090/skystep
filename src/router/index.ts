import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/pages/OnboardingPage.vue'),
    },
    {
      path: '/learn',
      name: 'learn',
      meta: { backTo: '/' },
      component: () => import('@/pages/LearnPage.vue'),
    },
    {
      path: '/review',
      name: 'review',
      meta: { backTo: '/' },
      component: () => import('@/pages/ReviewPage.vue'),
    },
    {
      path: '/practice',
      name: 'practice',
      meta: { backTo: '/' },
      component: () => import('@/pages/PracticePage.vue'),
    },
    {
      path: '/exam',
      name: 'exam',
      meta: { backTo: '/practice' },
      component: () => import('@/pages/ExamPage.vue'),
    },
    {
      path: '/writing-exam',
      name: 'writing-exam',
      meta: { backTo: '/practice' },
      component: () => import('@/pages/WritingExamPage.vue'),
    },
    {
      path: '/writing',
      name: 'writing',
      meta: { backTo: '/' },
      component: () => import('@/pages/WritingPage.vue'),
    },
    {
      path: '/wordbook',
      name: 'wordbook',
      component: () => import('@/pages/WordbookPage.vue'),
    },
    { path: '/pet', name: 'pet', component: () => import('@/pages/PetPage.vue') },
    {
      path: '/shop',
      name: 'shop',
      meta: { backTo: '/pet' },
      component: () => import('@/pages/ShopPage.vue'),
    },
    {
      path: '/dictionary',
      name: 'dictionary',
      component: () => import('@/pages/DictionaryPage.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/pages/SettingsPage.vue'),
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

export default router
