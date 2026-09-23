/**
 * A stand-in for the `stripe` package, installed by hooks.mjs.
 *
 * Everything the shop calls, backed by an in-memory account the tests fill
 * in through `globalThis.__stripe`. Errors are the package's real error
 * classes, and webhook verification is the package's real code, so a test
 * that passes here is exercising the same signature check production runs.
 */
import Real from "stripe";

const state = () => {
  globalThis.__stripe ??= {
    sessions: new Map(),
    paymentIntents: new Map(),
    products: new Set(),
    createdSessions: [],
    createdProducts: [],
  };
  return globalThis.__stripe;
};

const invalid = (message, code, param) =>
  new Real.errors.StripeInvalidRequestError({ type: "invalid_request_error", message, code, param });

export default class Stripe {
  static errors = Real.errors;

  constructor(key) {
    if (!key) throw new Error("mock: no key");
    const real = new Real("sk_test_mock");
    this.webhooks = real.webhooks;

    this.checkout = {
      sessions: {
        retrieve: async (id, params) => {
          const s = state().sessions.get(id);
          if (!s) throw invalid(`No such checkout.session: '${id}'`, "resource_missing", "id");
          const out = structuredClone(s);
          if (params?.expand?.includes("payment_intent") && typeof out.payment_intent === "string") {
            out.payment_intent = structuredClone(state().paymentIntents.get(out.payment_intent));
          }
          return out;
        },
        create: async (params) => {
          if (state().failCreate) {
            throw new Real.errors.StripeAPIError({ type: "api_error", message: "mock: Stripe is down" });
          }
          const product = params.line_items?.[0]?.price_data?.product;
          if (!state().products.has(product)) {
            throw invalid(`No such product: '${product}'`, "resource_missing", "line_items[0][price_data][product]");
          }
          state().createdSessions.push(params);
          const id = `cs_test_created${state().createdSessions.length}`;
          return { id, url: `https://checkout.stripe.com/c/pay/${id}` };
        },
      },
    };

    this.paymentIntents = {
      update: async (id, params) => {
        const pi = state().paymentIntents.get(id);
        if (!pi) throw invalid(`No such payment_intent: '${id}'`, "resource_missing", "id");
        pi.metadata = { ...pi.metadata, ...params.metadata };
        return structuredClone(pi);
      },
    };

    this.products = {
      create: async (params) => {
        if (state().products.has(params.id)) {
          throw invalid("Product already exists.", "resource_already_exists", "id");
        }
        state().products.add(params.id);
        state().createdProducts.push(params);
        return { object: "product", ...params };
      },
    };
  }
}
