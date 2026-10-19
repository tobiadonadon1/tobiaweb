/** Where signing in and creating an account happen. */
export const ACCOUNT_HREF = "/projects/construct/account";

/** The plans: Free, Pro, Ultimate, Universal. */
export const JOIN_HREF = "/projects/construct/join";

/**
 * Universal starts with an email: this opens the person's own mail app with
 * a note to Tobia already written, for them to fill in and send.
 */
export const UNIVERSAL_MAILTO =
  "mailto:tobia@donadon.com?subject=" +
  encodeURIComponent("Construct Universal") +
  "&body=" +
  encodeURIComponent(
    "Hi Tobia,\n\nI'd like to talk about Construct Universal.\n\nWhat I'm building:\n\n\nWhere I'd like your help (building, design, marketing):\n\n\nThanks,\n",
  );
