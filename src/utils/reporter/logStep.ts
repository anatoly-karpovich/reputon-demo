import { test } from "@playwright/test";

export function logStep<This, Args extends any[], Return>(message?: string) {
  return function actualDecorator(
    target: (this: This, ...args: Args) => Promise<Return>,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Promise<Return>>,
  ) {
    async function replaceMethod(this: any, ...args: Args) {
      const name = message ?? `${this.constructor.name}.${context.name as string}`;
      return await test.step(name, async () => target.call(this, ...args), { box: false });
    }
    return replaceMethod;
  };
}
