export function navigateByNotification(n, router, authStore) {
  if (n.type === "comment" || n.type === "favorite") {
    if (n.pen?.id) {
      router.push({
        name: "dose",
        params: {
          username: authStore.userProfile.username,
          id: n.pen.id,
        },
      });
    }
  } else if (n.type === "follow") {
    if (n.sender?.username) {
      router.push({
        name: "dosesShowcase",
        params: { username: n.sender.username },
      });
    }
  }
}
