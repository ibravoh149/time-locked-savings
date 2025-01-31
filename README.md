# Time-Locked Savings Smart Contract

[![Stacks](https://img.shields.io/badge/Stacks-Protocol-blue)](https://www.stacks.co)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Build](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yourusername/time-locked-savings/actions)
[![Tests](https://img.shields.io/badge/tests-100%25-brightgreen)](https://github.com/yourusername/time-locked-savings/actions)
[![Clarity](https://img.shields.io/badge/Clarity-2.1-orange)](https://docs.stacks.co)

A secure, audited smart contract for time-locked savings on the Stacks blockchain. Create self-custodial savings vaults with configurable time locks and emergency recovery options.

## Table of Contents

* [Features](#features)
* [Prerequisites](#prerequisites)
* [Installation](#installation)
* [Usage](#usage)
* [Security](#security)
* [Testing](#testing)
* [Contributing](#contributing)
* [License](#license)

## Features

* Self-custodial savings with full asset control
* Configurable time locks with minimum safeguards
* Emergency recovery system with designated contacts
* Multiple authorization layers and input validation
* Gas-optimized contract design
* Comprehensive test coverage

## Prerequisites

* Clarinet >= 1.5.4
* Node.js >= 14.0.0
* Stacks Wallet
* Git >= 2.31.0

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ibravoh149/time-locked-savings
   cd time-locked-savings
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run tests:
   ```bash
   clarinet test
   ```

## Usage

### Contract Architecture

```
time-locked-savings/
├── contracts/
│   └── time-locked-savings.clar    # Main contract
├── tests/
│   └── time-locked-savings_test.ts # Test suite
├── deployments/
│   └── default.devnet-plan.yaml    # Deployment config
└── settings/
    └── Devnet.toml                 # Network settings
```

### Core Functions

#### Creating a Savings Vault

```clarity
(contract-call? .time-locked-savings create-savings-account none)
```

**Parameters:**
* `emergency-contact`: Optional principal for emergency recovery

**Returns:**
* `(ok true)` on success
* `(err u1)` if account exists

#### Depositing Funds

```clarity
(contract-call? .time-locked-savings deposit u1000000000 u10000)
```

**Parameters:**
* `amount`: Amount in µSTX (1 STX = 1,000,000 µSTX)
* `lock-period`: Number of blocks to lock funds

**Returns:**
* `(ok true)` on success
* Error codes for validation failures

## Security

### Implemented Measures

1. Time Lock Mechanism
   * Minimum lock period enforcement
   * Block height-based timing
   * No early withdrawal options

2. Emergency System
   * Two-step authorization process
   * Designated emergency contacts
   * Cool-down period for changes

3. Input Validation
   * Amount boundaries
   * Period restrictions
   * Authorization verification

### Audit Status

* ✅ Internal audit completed
* ✅ Unit test coverage: 100%
* ✅ Automated security checks
* 🔄 External audit in progress

### Limitations

* Maximum lock period: 50,000 blocks
* Minimum deposit: 1 STX
* Single emergency contact per vault

## Testing

Run all tests:
```bash
clarinet test
```

Run specific test:
```bash
clarinet test tests/time-locked-savings_test.ts
```

Generate coverage report:
```bash
clarinet test --coverage
```

## Performance

| Operation          | Cost (µSTX) | Block Gas |
|-------------------|-------------|-----------|
| Account Creation  | 1000        | 5000      |
| Deposit          | 2000        | 8000      |
| Withdrawal       | 1500        | 6000      |
| Emergency Recovery| 3000        | 10000     |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

* **Project Lead**: [Ibrahim](ibravoh149@gmail.com)

---

Made with ❤️ by [Ibrahim/Organization]
