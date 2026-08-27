# Playwright Automation Technical Challenge

This project contains automated end-to-end tests developed using **Playwright with TypeScript**.

## Prerequisites

Make sure the following are installed:

- Node.js
- Google Chrome Browser

## Installation

Clone the repository and install the dependencies:

```bash
npm install
```

Install Playwright browsers:

```bash
npx playwright install
```

## Running the Tests

Set the test environment and execute the Playwright tests:

```bash
export TEST_ENV=qa && npx playwright test
```

The `TEST_ENV` variable determines which environment configuration file is used.

For example:

```text
TEST_ENV=qa
```

will use the QA environment configuration.

## Run Tests in Headed Mode

```bash
export TEST_ENV=qa && npx playwright test --headed
```

## Reports

All the reports are in the "Reports" directory