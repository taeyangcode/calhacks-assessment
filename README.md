# Hacker Badge System

## Getting Started

### Prerequisites

- `pnpm` and Rust toolchain (`cargo`)
- Firestore project

#### Navigate to Project

```
> git clone git@github.com:taeyangcode/calhacks-assessment.git
> cd calhacks-assessment/
```

#### Setup Environment Variables

```
> cp .env.template .env
```

Input values for each key; key names are self-explanatory.

_Note: Make sure to copy your Firebase service account credentials (.json) into the base directory_

#### Building

```
> cargo build --manifest-path api/Cargo.toml
> pnpm -C frontend install
```

#### Run Project

Running two terminal instances is recommended.

```
> cargo run --manifest-path api/Cargo.toml
> pnpm -C frontend dev
```
