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

## Approach to the Challenge

I approached the project by first sitting with my girlfriend and drawing a mock up of how the many parts of the application would communicate on my iPad. I created a rough outline and design flow that would address each of the goals in the project, and noted down the key criteria that I needed to implement before the less necessary features. After I completed the outline, I began to think of languages, technologies, and frameworks that would work the best towards completing the project, while also considering the relevancy of them to Hackathons @ Berkeley. From there on I worked on scaffolding the main aspects of the project (component hierarchy, design choices, API organization, etc.) before implementing the raw logic.

## Reflection

Although I really enjoy the many features that Rust offers to developers, I feel that it might have been more overkill than I thought for a more-or-less crud application. I also feel that my initial reaction to the assessment was a foresight that I could build an extremely robust and error-prone system, though it was only after beginning that I quickly realized that my initial ambitiousness was unreasonable for the timespan. I don't believe that my intentions were necessarily "misguided", but I do believe that in the future I should try to consider the reasonability and practicality of my choices more acutely.
