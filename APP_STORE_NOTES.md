# Coinly — App Store Submission Notes

Internal reference for whoever submits Coinly to the App Store / Play Store.

## App metadata (from `mobile/app.json`)

| Field | Value |
|---|---|
| Name | Coinly |
| Slug | coinly |
| Version | 1.0.0 |
| iOS bundle identifier | `com.coinly.app` |
| iOS build number | 1 |
| Android package | `com.coinly.app` |
| Android versionCode | 1 |
| Orientation | portrait |
| Tablet support (iOS) | no |

> **Action required before submission:** replace `extra.eas.projectId`
> (`"TODO-eas-project-id"`) with the real EAS project id (`eas init` or the
> Expo dashboard), and confirm the bundle id / package match what's registered
> in App Store Connect and the Play Console.

## Age rating

**Recommended rating: 4+ (Apple) / Everyone (Google).** If the storefront's
questionnaire flags simulated investing as "simulated gambling" or mature
financial themes, fall back to **12+ / Teen**.

Rationale:

- **Educational.** Coinly is a financial-literacy education app (ages 13+).
- **No real money.** "Brain Bucks" are a virtual reward; there are **no in-app
  purchases** and **no real-money transactions**.
- **No real trading.** All trading is **simulated / paper** — virtual cash and
  prices only. No brokerage, no real financial risk.
- **No objectionable content.** No violence, no mature themes.
- **No user-generated content / social features.** No chat, no public profiles,
  no user content visible to other users. The in-app AI assistant is private to
  the user.

## Data & privacy (for App Privacy / Data Safety forms)

Collected and linked to the user's account: **email address**, **display name**,
and **app usage / progress** (including a simulated portfolio). Used for **app
functionality** (account, sync) and **personalization**. **Not** used for
tracking or advertising and **not** sold. Data is stored in Supabase with
Row-Level Security. See [PRIVACY_POLICY.md](PRIVACY_POLICY.md).

> A public **privacy policy URL** is required by both stores. Host
> `PRIVACY_POLICY.md` (or an equivalent page) at a public URL and enter it in
> App Store Connect / Play Console.

## Pre-submission checklist

- [ ] Replace `extra.eas.projectId` with the real id.
- [ ] Set a real privacy contact email in `PRIVACY_POLICY.md` and publish it at a public URL.
- [ ] Rotate `EXPO_PUBLIC_GEMINI_API_KEY` (it is present in git history) and commit the `mobile/.env` untrack.
- [ ] Verify Supabase RLS is enabled with correct policies on `profiles`, `user_progress`, `portfolios`, `game_states`.
- [ ] Confirm `assets/icon.png` (1024×1024) has no transparency / alpha channel and no pre-rounded corners.
- [ ] Confirm email confirmation setting in Supabase Auth matches the intended sign-up flow.
