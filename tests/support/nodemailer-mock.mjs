/**
 * A stand-in for `nodemailer`, installed by hooks.mjs. Records every message
 * the shop hands to Gmail in `globalThis.__mail`, and fails on demand
 * (`globalThis.__mailDown`), so the tests can read exactly what a buyer would
 * receive without sending anything.
 */
export default {
  createTransport(options) {
    return {
      async sendMail(message) {
        globalThis.__mail ??= [];
        globalThis.__mail.push({ options, message });
        if (globalThis.__mailDown) throw new Error("mock: Gmail refused the connection");
        return { accepted: [message.to], messageId: `<mock-${globalThis.__mail.length}@gmail.com>`, response: "250 OK" };
      },
    };
  },
};
