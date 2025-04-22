const controllers = new Set<AbortController>();

export function createTrackedAbortController(): AbortController {
  const controller = new AbortController();
  controllers.add(controller);

  controller.signal.addEventListener("abort", () => {
    controllers.delete(controller);
  });

  return controller;
}

export function abortAllControllers() {
  for (const controller of controllers) {
    controller.abort();
  }
  controllers.clear();
}

if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    abortAllControllers();
  });
}

