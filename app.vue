<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-100 via-slate-100 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
    <NuxtLayout>
      <Suspense>
        <template #default>
          <NuxtPage />
        </template>
        <template #fallback>
          <div class="flex min-h-[60vh] items-center justify-center">
            <span class="animate-pulse text-lg font-semibold text-slate-500">Loading…</span>
          </div>
        </template>
      </Suspense>
    </NuxtLayout>
  </div>
</template>
