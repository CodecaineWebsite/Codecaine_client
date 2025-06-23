import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/useAuthStore";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "mainLayout",
      component: () => import("../layouts/MainLayout.vue"),
      children: [
        {
          path: "",
          name: "redirect",
          redirect: "/trending",
        },
        {
          path: "your-work",
          name: "your-work",
          component: () => import("../views/YourWork.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "following",
          name: "following",
          component: () => import("../views/Following.vue"),
          meta: { requiresAuth: true },
        },
        {
          path: "trending",
          name: "trending",
          component: () => import("../views/Trending.vue"),
        },
        {
          path: "search",
          name: "search",
          component: () => import("../views/Search.vue"),
        },
        {
          path: "search/:category",
          name: "search-category",
          component: () => import("../views/Search.vue"),
        },
        {
          path: "signup",
          name: "signup",
          component: () => import("../views/Signup.vue"),
          meta: {
            requiresGuest: true,
          },
        },
        {
          path: "login",
          name: "login",
          component: () => import("../views/Login.vue"),
          meta: {
            requiresGuest: true,
          },
        },
        {
          path: ":username",
          component: () => import("../layouts/ProfileLayout.vue"),
          children: [
            {
              path: "",
              redirect: (to) => {
                return `/${to.params.username}/caines`;
              },
            },
            {
              path: "caines",
              name: "Profilecaines",
              component: () => import("../views/UsersCaines.vue"),
              children: [
                {
                  path: "",
                  redirect: (to) => {
                    return `/${to.params.username}/caines/showcase`;
                  },
                },
                {
                  path: "showcase",
                  name: "cainesShowcase",
                  component: () => import("../views/Showcase.vue"),
                },
                {
                  path: "public",
                  name: "cainesPublic",
                  component: () => import("../views/Public.vue"),
                },
                {
                  path: "private",
                  name: "cainesPrivate",
                  component: () => import("../views/Private.vue"),
                  meta: { requiresPrivate: true },
                },
                {
                  path: "loved",
                  name: "cainesLoved",
                  component: () => import("../views/Loved.vue"),
                },
              ],
            },
            {
              path: "following",
              name: "Profilefollowing",
              component: () => import("../views/UsersFollowing.vue"),
            },
            {
              path: "followers",
              name: "Profilefollowers",
              component: () => import("../views/UsersFollowers.vue"),
            },
          ],
        },
        {
          path: "settings",
          component: () => import("../layouts/SettingLayout.vue"),
          children: [
            {
              path: "",
              redirect: "/settings/profile",
            },
            {
              path: "profile",
              name: "SettingProfile",
              component: () => import("../views/SettingProfile.vue"),
              meta: { requiresAuth: true },
            },
            {
              path: "account",
              name: "settingAccount",
              component: () => import("../views/SettingAccount.vue"),
              meta: { requiresAuth: true },
            },
            {
              path: "billing",
              name: "billing",
              component: () => import("../views/Billing.vue"),
            },
          ],
        },
      ],
    },
    {
      path: "/pen",
      name: "newPen",
      component: () => import("../views/Pen.vue"),
    },
    {
      path: "/:username/pen/:id",
      name: "pen",
      component: () => import("../views/Pen.vue"),
    },
    {
      path: "/:username/full/:id",
      name: "full-page",
      component: () => import("../views/PenFullView.vue"),
    },
    {
      path: "/:username/details/:pen_id",
      name: "pen-details",
      component: () => import("../views/PenDetailPage.vue"),
      meta: { canBeModal: true },
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import("../views/NotFound.vue")
    }
  ],
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresGuest && authStore.idToken) {
    return next("/");
  }
  if (to.meta.requiresAuth && !authStore.idToken) {
    return next({ path: "/login", query: { redirect: to.fullPath } });
  }
  next();
});
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  if (to.meta.requiresPrivate) {
    const currentUser = authStore.userProfile?.username;
    const routeUser = to.params.username;
    if (currentUser !== routeUser) {
      return next(`/${to.params.username}/caines`);
    }
  }
  next();
});
export default router;
