# 🛒 SauceDemo – Playwright Automation Demo Project

A demo end-to-end test automation project for the [SauceDemo](https://www.saucedemo.com) website — a simple e-commerce application designed specifically for testing practice. The project is built with [Playwright](https://playwright.dev/) and TypeScript.

---

## 📹 Video Recording

> 🎬 **Watch the test execution demo on YouTube:** [https://youtu.be/Uxl-Jh51bOE](https://youtu.be/Uxl-Jh51bOE)

---

## 📋 About the Project

This project demonstrates automated E2E testing of key user flows on the [www.saucedemo.com](https://www.saucedemo.com) website, including:

- 🔐 User authentication (login / logout)
- 🛍️ Adding and removing items from the shopping cart
- 💳 Checkout flow (customer details → order summary → order confirmation)

The tests are written using the **Page Object Model (POM)** pattern for maintainability and clarity.

### Tech Stack

| Tool                                  | Version           |
| ------------------------------------- | ----------------- |
| [Playwright](https://playwright.dev/) | ^1.59.1           |
| TypeScript                            | via `@types/node` |
| Node.js                               | LTS               |
| dotenv                                | ^17.4.2           |

### CI/CD

Tests are automatically executed on every push and pull request to the `main` / `master` branch via **GitHub Actions**. Test credentials are stored securely as GitHub Secrets in the `TEST` environment.

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Git](https://git-scm.com/)
- A SauceDemo account — use the standard credentials provided at [www.saucedemo.com](https://www.saucedemo.com)

---

## 🚀 Project Setup

### 1. Clone the repository

```bash
git clone https://github.com/lazovskih/SwagLabs_saucedemo.git
cd SwagLabs_saucedemo
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
cp .env.example .env   # if an example file is available, otherwise create manually
```

Add your credentials to `.env` and to Environment secrets:

```env
STANDARD_USER=set_username
LOCKED_OUT_USER=set_lockedout_username
DEMO_PASSWORD=set_password
URL=https://www.saucedemo.com
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## ▶️ Running Tests

### Run all tests (headless)

```bash
npm test
```

or equivalently:

```bash
npx playwright test
```

### Run tests in headed mode (browser visible)

```bash
npm run test:headed
```

### Run tests with the interactive Playwright UI

```bash
npx playwright test --ui
```

### Run a specific test file

```bash
npx playwright test tests/e2e/login.spec.ts
npx playwright test tests/e2e/cart.spec.ts
npx playwright test tests/e2e/checkout.spec.ts
```

### Run tests on a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
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
Saucedemo_Playwright/
├── .github/
│   └── workflows/
│       └── playwright.yml          # GitHub Actions CI workflow
├── data/
│   ├── products.json               # Product catalog test data
│   └── shipping.json               # Customer checkout test data
├── tests/
│   ├── e2e/                        # End-to-end test suites
│   │   ├── cart.spec.ts            # Shopping cart flow tests
│   │   ├── checkout.spec.ts        # Checkout and order placement tests
│   │   └── login.spec.ts           # Authentication & session tests
│   ├── fixtures/                   # Playwright setup & fixtures
│   │   └── auth.setup.ts           # Global authentication setup project
│   ├── pages/                      # Page Object Model (POM) classes
│   │   ├── BasePage.ts             # Base page class with common methods & navigation
│   │   ├── CartPage.ts             # Shopping cart page object
│   │   ├── CheckoutComplete.ts     # Order completion confirmation page object
│   │   ├── CheckoutStepOnePage.ts  # Checkout customer info page object
│   │   ├── CheckoutStepTwoPage.ts  # Checkout overview & calculation page object
│   │   ├── LoginPage.ts            # Login page object
│   │   └── ProductsPage.ts         # Products catalog & inventory page object
│   ├── types/                      # TypeScript type declarations
│   │   └── index.ts                # Product and ShippingData interfaces
│   └── utilities/                  # Helper utilities
│       └── index.ts                # Currency parsing and product ID utilities
├── playwright.config.ts            # Multi-browser & project dependency config
├── tsconfig.json                   # TypeScript configuration & path aliases
├── package.json                    # Project dependencies and npm scripts
├── .env                            # Local environment variables (not committed)
├── .env.example                    # Environment variable template
└── README.md                       # Project documentation
```

---

## 🌐 Target Application

- **URL:** [https://www.saucedemo.com](https://www.saucedemo.com)
- **Type:** Demo e-commerce web application
- **Purpose:** QA automation practice

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
