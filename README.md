# 🛒 SauceDemo – Playwright Automation Demo Project

A demo end-to-end test automation project for the [SauceDemo](https://www.saucedemo.com) website — a simple e-commerce application designed specifically for testing practice. The project is built with [Playwright](https://playwright.dev/) and TypeScript.

---

## 📹 Video Recording

> 🎬 **Watch the test execution demo on YouTube:** [https://youtu.be/Uxl-Jh51bOE](https://youtu.be/Uxl-Jh51bOE)

---

## 📋 About the Project

This project demonstrates automated E2E testing of key user flows on the [www.saucedemo.com](https://www.saucedemo.com) website, including:

- 🔐 **User authentication** — valid/invalid login, locked-out user handling, logout, and route access control
- 🛍️ **Inventory page cart & catalog interactions** — adding and removing items on the products page, verifying `Add to cart` / `Remove` button state transitions, validating shopping cart contents and cart badge counts, and verifying product details (name, price, image, and description)
- 🔍 **Item details page interactions** — adding and removing items directly on the product item details page, verifying shopping cart contents and cart badge count updates, confirming button state synchronization between the inventory, item details, and cart pages, and validating item details
- 💳 **Checkout flow** — customer shipping details → order summary with subtotal, tax, and total calculation → order confirmation
- 🔃 **Product catalog sorting** — sorting items by name (A–Z / Z–A) and price (low-to-high / high-to-low)

The tests are architected using the **Page Object Model (POM)** with **component composition**, **Playwright custom fixtures** (`test.extend`), and **strict separation of concerns** (all test assertions reside exclusively in spec files).

### Tech Stack

| Tool                                                       | Version  |
| ---------------------------------------------------------- | -------- |
| [Playwright](https://playwright.dev/)                      | ^1.59.1  |
| [TypeScript](https://www.typescriptlang.org/)              | ^6.0.3   |
| [Node.js](https://nodejs.org/)                             | 22 LTS   |
| [ESLint](https://eslint.org/) + `eslint-plugin-playwright` | ^10.13.0 |
| [Husky](https://typicode.github.io/husky/) + `lint-staged` | ^9.1.7   |
| [dotenv](https://github.com/motdotla/dotenv)               | ^17.4.2  |

### CI/CD

Tests and static analysis quality gates (`eslint` and `tsc --noEmit`) are automatically executed via **GitHub Actions**. Test credentials are stored securely as GitHub Secrets in the `TEST` environment.

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (v22 LTS recommended)
- [Git](https://git-scm.com/)
- A SauceDemo account — use the standard credentials provided at [www.saucedemo.com](https://www.saucedemo.com)

---

## 🚀 Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/lazovskih/SwagLabs_Saucedemo_Playwright.git
cd SwagLabs_Saucedemo_Playwright
```

### 2. Install dependencies

```bash
npm ci
```

### 3. Install Playwright browsers

```bash
npx playwright install --with-deps
```

### 4. Configure environment variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Add your credentials to `.env` and to GitHub Environment secrets:

```env
STANDARD_USER=<set_standard_username>
LOCKED_OUT_USER=<set_lockedout_username>
DEMO_PASSWORD=<set_demo_password>
URL=https://www.saucedemo.com
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## ▶️ Running Tests & Quality Checks

### Run all tests (headless, runs ESLint automatically via `pretest`)

```bash
npm test
```

or run Playwright directly:

```bash
npx playwright test
```

### Run tests in headed mode (browser visible)

```bash
npm run test:headed
```

### Run tests with the interactive Playwright UI

```bash
npm run test:ui
```

### Run a specific test file

```bash
npx playwright test tests/e2e/1_login.spec.ts
npx playwright test tests/e2e/2_inventory.spec.ts
npx playwright test tests/e2e/3_inventory_item.spec.ts
npx playwright test tests/e2e/4_checkout.spec.ts
npx playwright test tests/e2e/5_inventory_sort.spec.ts
```

### Run tests on a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run linting and TypeScript type-checking

```bash
npm run lint
npm run lint:fix
npm run typecheck
```

---

## 📊 Viewing the Test Report

After a test run, open the HTML report with:

```bash
npm run test:report
```

or:

```bash
npx playwright show-report
```

---

## 📁 Project Structure

```
SwagLabs_Saucedemo_Playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml                       # GitHub Actions CI workflow
├── .husky/
│   └── pre-commit                               # Pre-commit hook running lint-staged
├── data/
│   ├── locale.json                              # Store currency & tax rate test data
│   ├── products.json                            # Product catalog test data
│   └── shipping.json                            # Customer checkout test data
├── tests/
│   ├── e2e/                                     # End-to-end test suites
│   │   ├── 1_login.spec.ts                      # Authentication, logout & access control tests
│   │   ├── 2_inventory.spec.ts                  # Inventory page cart, badge & product detail tests
│   │   ├── 3_inventory_item.spec.ts             # Item details page cart, badge & item detail tests
│   │   ├── 4_checkout.spec.ts                   # Checkout flow & order total calculation tests
│   │   └── 5_inventory_sort.spec.ts             # Product catalog sorting tests
│   ├── fixtures/                                # Playwright setup & custom fixtures
│   │   ├── auth.setup.ts                        # Global authentication setup project
│   │   └── pages.fixture.ts                     # Custom page object fixtures
│   ├── pages/                                   # Page Object Model (POM) classes
│   │   ├── components/
│   │   │   └── ProductActionsComponent.ts       # Shared product/cart item actions component
│   │   ├── BasePage.ts                          # Abstract base page with navigation & mount sync
│   │   ├── InternalPage.ts                      # Abstract base for authenticated pages (header/menu)
│   │   ├── CartPage.ts                          # Shopping cart page object
│   │   ├── CheckoutCompletePage.ts              # Order completion confirmation page object
│   │   ├── CheckoutStepOnePage.ts               # Checkout customer info page object
│   │   ├── CheckoutStepTwoPage.ts               # Checkout overview & calculation page object
│   │   ├── InventoryItemPage.ts                 # Single product item detail page object
│   │   ├── InventoryPage.ts                     # Products catalog & inventory page object
│   │   └── LoginPage.ts                         # Login page object
│   ├── types/                                   # TypeScript type declarations
│   │   └── index.ts                             # Product, PricingConfig, ShippingData & CartButtonAction
│   └── utilities/                               # Helper utilities
│       ├── env.ts                               # Environment variable validation & config
│       └── index.ts                             # Currency parsing, cents math, and product helpers
├── eslint.config.mjs                            # ESLint flat configuration (TS + Playwright)
├── playwright.config.ts                         # Multi-browser & project dependency config
├── tsconfig.json                                # TypeScript configuration & path aliases
├── package.json                                 # Project dependencies and npm scripts
├── .env                                         # Local environment variables (not committed)
├── .env.example                                 # Environment variable template
└── README.md                                    # Project documentation
```

---

## 🌐 Target Application

- **URL:** [https://www.saucedemo.com](https://www.saucedemo.com)
- **Type:** Demo e-commerce web application
- **Purpose:** QA automation practice

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
