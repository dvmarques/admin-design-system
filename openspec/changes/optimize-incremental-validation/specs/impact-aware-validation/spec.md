## ADDED Requirements

### Requirement: Conservative workspace impact classification
The system SHALL identify changed workspaces and transitive consumers, including implicit token consumers, using a trusted list of workspace manifests. It SHALL return full validation for unknown files, global configuration changes, missing revisions, invalid manifests, or ambiguous input. This classification MUST NOT bypass mandatory pull-request, release, or protected-branch checks.

#### Scenario: Token changes propagate to consumers
- **WHEN** a token source file changes
- **THEN** tokens, components, admin, docs and admin-demo are affected

#### Scenario: Unknown files fail closed
- **WHEN** a changed path cannot be classified reliably
- **THEN** the system returns full validation

### Requirement: Optional focused feedback
The system SHALL provide explicit developer commands for scoped lint, type checking and tests, without replacing full release validation. The commands SHALL propagate process failures and expose the calculated scope in a concise diagnostic output.

#### Scenario: Scoped app change
- **WHEN** only a recognized application source file changes
- **THEN** the developer can run focused validation for the affected application

#### Scenario: Global configuration change
- **WHEN** a global build or CI configuration changes
- **THEN** the command executes full validation for its selected category

### Requirement: Auditable performance comparison
The system SHALL document a repeatable measurement procedure using identifiable GitHub Actions runs and shall distinguish measured job duration, failures, reruns, token use and cost from unavailable or estimated data. It MUST NOT report unverified savings.

#### Scenario: Missing telemetry
- **WHEN** token or cost telemetry is unavailable
- **THEN** the report explicitly identifies the missing metric instead of inventing a value
