# Hacker Badge System

## Getting Started

### Prerequisites

* `pnpm` and Rust toolchain (`cargo`)
* Firestore project

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
*Note: Make sure to copy your Firebase service account credentials (.json) into the base directory*

#### Building

```
> cargo build --manifest-path api/Cargo.toml 
```

#### Run Project

```
> cargo run --manifest-path api/Cargo.toml
```
