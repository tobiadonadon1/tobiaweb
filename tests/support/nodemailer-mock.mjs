/**
 * A stand-in for `nodemailer`, installed by hooks.mjs. Records every message
 * the shop hands to Gmail in `globalThis.__mail`, and fails on demand
 * (`globalThis.__mailDown`), so the tests can read exactly what a buyer would
 * receive without sending anything. `globalThis.__mailRefusesZips` answers any
 * message with an attachment the way Gmail answers a zip holding a script.
 */
export default {
  createTransport(options) {
    return {
      async sendMail(message) {
        globalThis.__mail ??= [];
        globalThis.__mail.push({ options, message });
        if (globalThis.__mailDown) throw new Error("mock: Gmail refused the connection");
        if (globalThis.__mailRefusesZips && message.attachments?.length) {
          const err = new Error(
            "Message failed: 552-5.7.0 This message was blocked because its content presents a potential security issue.",
          );
          err.code = "EMESSAGE";
          err.responseCode = 552;
          throw err;
        }
        return { accepted: [message.to], messageId: `<mock-${globalThis.__mail.length}@gmail.com>`, response: "250 OK" };
      },
    };
  },
};
