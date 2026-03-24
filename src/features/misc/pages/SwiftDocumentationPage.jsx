import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  BookOpenText,
  CheckCircle2,
  FileCheck2,
  Layers,
  ListChecks,
  Moon,
  Scale,
  ShieldCheck,
  Sun,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../../../app/routes/paths'
import { useTheme } from '../../../app/providers/useTheme'
import CardSurface from '../../../components/ui/CardSurface'
import SectionHeader from '../../../components/ui/SectionHeader'

const TOC = [
  { id: 'overview', label: '1. Standards overview' },
  { id: 'architecture', label: '2. Backend conversion architecture' },
  { id: 'mapping', label: '3. MX to MT103 mapping model' },
  { id: 'validation', label: '4. Validation layers' },
  { id: 'cbpr', label: '5. CBPR+ profile rules' },
  { id: 'pacs008', label: '6. pacs.008 semantic requirements' },
  { id: 'testing', label: '7. Testing and certification strategy' },
  { id: 'failures', label: '8. Common failure scenarios' },
  { id: 'security', label: '9. Security and compliance controls' },
  { id: 'operations', label: '10. Operations and observability' },
  { id: 'glossary', label: '11. Glossary' },
]

const FIN_OVERVIEW = [
  'SWIFT FIN is the long-established messaging channel for MT category messages between financial institutions.',
  'MT103 is the canonical customer credit transfer message in FIN and remains common across many correspondent banking flows.',
  'FIN messages are tag-oriented and concise, but less semantically rich than ISO 20022 XML models.',
]

const MX_OVERVIEW = [
  'MX messages are built on ISO 20022 XML schemas and structured business components.',
  'The model supports richer data quality, stronger validation, and better interoperability between systems.',
  'In modernization programs, MX often coexists with legacy MT during phased migration windows.',
]

const ARCHITECTURE_LAYERS = [
  { title: 'Ingress layer', detail: 'Receives XML payloads, authenticates requests, and assigns correlation identifiers.' },
  { title: 'Parsing + schema layer', detail: 'Parses XML safely and validates against the selected pacs.008 XSD release.' },
  { title: 'Business rules layer', detail: 'Applies market/profile constraints and semantic checks.' },
  { title: 'Canonical mapping layer', detail: 'Maps validated input into a stable internal payment domain model.' },
  { title: 'MT rendering layer', detail: 'Builds FIN-compatible MT103 fields and output formatting.' },
  { title: 'Audit layer', detail: 'Stores outcome, rule traces, and operator-grade diagnostics.' },
]

const MAPPING_GUIDE = [
  { mt: ':20: Sender reference', mx: 'CdtTrfTxInf/PmtId/(InstrId|EndToEndId)', note: 'Deterministic source rule required.' },
  { mt: ':23B: Bank operation code', mx: 'Derived by business context', note: 'Often fixed to CRED in many scenarios.' },
  { mt: ':32A: Date/Ccy/Amt', mx: 'IntrBkSttlmDt + IntrBkSttlmAmt', note: 'Currency from @Ccy and FIN format normalization.' },
  { mt: ':50a: Ordering customer', mx: 'Dbtr + DbtrAcct', note: '50A/50F/50K variant policy must be explicit.' },
  { mt: ':57a: Account with institution', mx: 'CdtrAgt', note: 'Routing-sensitive mapping, profile-constrained.' },
  { mt: ':59a: Beneficiary customer', mx: 'Cdtr + CdtrAcct', note: 'Party/account coherence must be validated.' },
  { mt: ':70: Remittance information', mx: 'RmtInf/Ustrd or RmtInf/Strd', note: 'Length and structure normalization often needed.' },
  { mt: ':71A: Details of charges', mx: 'ChrgBr', note: 'Charge bearer code mapping and policy checks.' },
]

const VALIDATION_LAYERS = [
  {
    name: 'Layer 1: Technical gateway',
    checks: ['Authentication and authorization', 'Payload limits and parser hardening', 'Transport-level hygiene'],
  },
  {
    name: 'Layer 2: XSD schema',
    checks: ['Namespace/version correctness', 'Structure and cardinality', 'Datatype/format conformance'],
  },
  {
    name: 'Layer 3: Profile rules',
    checks: ['CBPR+ profile constraints', 'Party/agent role constraints', 'Conditional element presence'],
  },
  {
    name: 'Layer 4: Semantic integrity',
    checks: ['Identifier consistency', 'Amount/currency semantic integrity', 'Debtor/creditor/account coherence'],
  },
  {
    name: 'Layer 5: MT output quality',
    checks: ['FIN syntax conformance', 'Rendering and line policy', 'Mandatory output tags by scenario'],
  },
]

const CBPR_RULES = [
  'Use the exact message definition and profile release in scope.',
  'Ensure instructing/instructed agent chain consistency and identifiers.',
  'Populate payment identifiers with stable, unique values; include UETR where applicable.',
  'Apply settlement and charges fields according to profile constraints.',
  'Respect conditional data requirements for remittance, purpose, and party information.',
]

const PACS008_SEMANTIC_ELEMENTS = [
  { path: '.../GrpHdr/MsgId', why: 'Core message traceability and uniqueness.' },
  { path: '.../GrpHdr/CreDtTm', why: 'Event timestamp for sequencing and controls.' },
  { path: '.../GrpHdr/NbOfTxs', why: 'Transaction count consistency checks.' },
  { path: '.../GrpHdr/SttlmInf/SttlmMtd', why: 'Settlement semantics and processing path.' },
  { path: '.../CdtTrfTxInf/PmtId', why: 'Business identifiers used for deduplication and tracking.' },
  { path: '.../CdtTrfTxInf/IntrBkSttlmAmt@Ccy', why: 'Mandatory amount/currency pair.' },
  { path: '.../CdtTrfTxInf/IntrBkSttlmDt', why: 'Interbank settlement scheduling.' },
  { path: '.../CdtTrfTxInf/ChrgBr', why: 'Charge handling model.' },
  { path: '.../Dbtr + DbtrAcct + DbtrAgt', why: 'Debit-side identity and routing.' },
  { path: '.../CdtrAgt + Cdtr + CdtrAcct', why: 'Beneficiary routing and posting integrity.' },
]

const TESTING_STRATEGY = [
  'Maintain positive and negative golden-file packs per release/profile.',
  'Test schema, profile, semantic, and mapping logic independently.',
  'Run deterministic MT field-level mapping tests in CI.',
  'Track compatibility matrix: XSD version, profile release, mapping version.',
  'Retain regression packs for every production incident class.',
]

const FAILURE_SCENARIOS = [
  {
    issue: 'Schema-valid but business-invalid',
    reason: 'Structure is correct, but party/agent/identifier semantics are inconsistent.',
    action: 'Add targeted semantic validators and precise error paths.',
  },
  {
    issue: 'Duplicate transaction processing',
    reason: 'Idempotency keys are missing or unstable.',
    action: 'Enforce deterministic dedupe keys and replay-safe persistence.',
  },
  {
    issue: 'Downstream MT rejection',
    reason: 'Formatting/tag variant/output syntax mismatch.',
    action: 'Introduce strict MT conformance tests before release.',
  },
  {
    issue: 'CBPR+ test mismatch',
    reason: 'Incorrect profile release applied in validation.',
    action: 'Pin profile version and expose it in logs/responses.',
  },
]

const SECURITY_CONTROLS = [
  'Encrypt payloads in transit and at rest based on enterprise key policy.',
  'Mask sensitive party/account data in logs and telemetry outputs.',
  'Apply least privilege on conversion APIs and admin interfaces.',
  'Maintain immutable conversion audit trails for traceability.',
  'Implement retention/deletion controls aligned with regulation and policy.',
]

const OPERATIONS_CHECKLIST = [
  'Define SLOs for latency, success ratio, and validation throughput.',
  'Expose metrics per validation stage and per error family.',
  'Use correlation IDs across ingress, validation, mapping, and output.',
  'Alert on error spikes, queue growth, and profile/version mismatches.',
  'Maintain runbooks for known failures and standard remediation paths.',
]

const GLOSSARY = [
  { term: 'FIN', meaning: 'Legacy SWIFT network/service carrying MT messages.' },
  { term: 'MT103', meaning: 'Legacy SWIFT customer credit transfer message.' },
  { term: 'ISO 20022 MX', meaning: 'Structured XML-based financial messaging model.' },
  { term: 'pacs.008', meaning: 'FI-to-FI customer credit transfer ISO 20022 message.' },
  { term: 'CBPR+', meaning: 'Cross-border payments and reporting market practice profile.' },
  { term: 'UETR', meaning: 'Unique End-to-End Transaction Reference for tracking.' },
]

const JAVA_EXAMPLE = `public Mt103 convertPacs008ToMt103(Pacs008Message mx) {
  validateSchema(mx);
  validateBusinessRules(mx);
  ensureCbprProfile(mx);

  Mt103 mt = new Mt103();
  mt.setField20(mx.getPmtId().getEndToEndId());
  mt.setField23B("CRED");
  mt.setField32A(format32A(mx.getIntrBkSttlmDt(), mx.getIntrBkSttlmAmt()));
  mt.setField50K(mapDebtor(mx));
  mt.setField59(mapCreditor(mx));
  mt.setField71A(mapCharges(mx.getChrgBr()));

  runOutputComplianceChecks(mt);
  return mt;
}`

const JAVA_VALIDATOR_EXAMPLE = `public ValidationResult validatePacs008(Pacs008Message mx) {
  ValidationResult result = new ValidationResult();

  if (isBlank(mx.getGrpHdr().getMsgId())) {
    result.addError("GrpHdr/MsgId", "Message ID is required");
  }

  if (mx.getTxInf().getIntrBkSttlmAmt() == null) {
    result.addError("CdtTrfTxInf/IntrBkSttlmAmt", "Settlement amount is required");
  }

  if (!isValidAgentChain(mx)) {
    result.addError("AgentChain", "Invalid instructing/instructed agent sequence");
  }

  return result;
}`

const PIPELINE_EXAMPLE = `1) Receive pacs.008 XML payload
2) Parse + XSD validation
3) Market profile validation (e.g., CBPR+)
4) Semantic validation (party, amount, identifiers)
5) Canonical mapping to internal payment model
6) Render MT103 field tags
7) Final compliance checks + persist + return response`

function SwiftDocumentationPage() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'swiftbridge-dark'
  const [activeSection, setActiveSection] = useState('overview')

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50px 0px -50% 0px',
      threshold: 0,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    TOC.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-base-200">
      <header className="border-b border-base-300/70 bg-base-100/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-10">
          <Link to={ROUTES.HOME} className="flex items-center gap-3 text-base-content transition-opacity hover:opacity-90">
            <span className="rounded-2xl bg-primary/10 p-2 text-primary">
              <FileCheck2 className="h-5 w-5" />
            </span>
            <div>
              <p className="eyebrow-text text-[0.65rem] text-base-content/60">SwiftBridge</p>
              <p className="text-sm font-semibold">Formal documentation</p>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <button type="button" className="btn btn-ghost btn-circle" onClick={toggleTheme} aria-label="Toggle theme">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Link className="btn btn-ghost btn-sm" to={ROUTES.HOME}>Home</Link>
            <Link className="btn btn-ghost btn-sm" to={ROUTES.LOGIN}>Sign in</Link>
            <Link className="btn btn-primary btn-sm" to={ROUTES.REGISTER}>Register</Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl gap-8 px-4 py-8 md:gap-10 md:px-10 md:py-12">
        {/* Sticky sidebar navigation */}
        <nav className="hidden md:block md:w-64 lg:w-72">
          <div className="sticky top-6 space-y-2 rounded-lg border border-base-300/70 bg-base-100/50 p-4 backdrop-blur">
            <p className="eyebrow-text text-xs font-semibold text-base-content/60">ON THIS PAGE</p>
            <ul className="space-y-1">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault()
                      document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className={`block rounded px-3 py-2 text-sm transition-all ${
                      activeSection === item.id
                        ? 'bg-primary/20 font-semibold text-primary'
                        : 'text-base-content/70 hover:bg-base-300/30 hover:text-base-content'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-8 md:gap-10">
        <section className="space-y-5" id="overview">
          <SectionHeader
            title="SWIFT messaging documentation"
            description="Extended reference guide for SWIFT FIN/MT, ISO 20022 MX, conversion architecture, CBPR+ profile handling, and pacs.008 validation readiness."
          />

          <CardSurface stretch>
            <div className="flex flex-wrap items-center gap-2 text-sm text-base-content/80">
              <BookOpenText className="h-4 w-4 text-primary" />
              This page is intended for operational, QA, and integration teams preparing message conversion and validation scenarios.
            </div>
          </CardSurface>

          <CardSurface title="Table of contents" subtitle="Navigate the handbook sections" stretch>
            <div className="grid gap-2 md:grid-cols-2">
              {TOC.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="link link-hover text-sm text-base-content/80">
                  {item.label}
                </a>
              ))}
            </div>
          </CardSurface>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <CardSurface title="SWIFT FIN and MT103" subtitle="Legacy payment messaging context" stretch>
            <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
              {FIN_OVERVIEW.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </CardSurface>

          <CardSurface title="ISO 20022 MX model" subtitle="New structured XML messaging model" stretch>
            <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
              {MX_OVERVIEW.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </CardSurface>
        </section>

        <section className="space-y-5" id="architecture">
          <SectionHeader
            title="Backend conversion architecture"
            description="A practical way to organize conversion in backend services for reliability, auditability, and maintainability."
          />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ARCHITECTURE_LAYERS.map((layer) => (
              <CardSurface key={layer.title} title={layer.title} subtitle={layer.detail} stretch />
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <CardSurface title="Java conversion service (illustrative)" subtitle="Likely backend style" stretch>
              <div className="mockup-code text-xs md:text-sm"><pre><code>{JAVA_EXAMPLE}</code></pre></div>
            </CardSurface>
            <CardSurface title="Java semantic validator (illustrative)" subtitle="Pre-mapping quality gate" stretch>
              <div className="mockup-code text-xs md:text-sm"><pre><code>{JAVA_VALIDATOR_EXAMPLE}</code></pre></div>
            </CardSurface>
            <CardSurface title="Operational pipeline" subtitle="From MX payload to MT103 output" stretch className="lg:col-span-2">
              <div className="mockup-code text-xs md:text-sm"><pre><code>{PIPELINE_EXAMPLE}</code></pre></div>
            </CardSurface>
          </div>
        </section>

        <section className="space-y-5" id="mapping">
          <SectionHeader
            title="MX to MT103 mapping model"
            description="Typical field-level translation matrix used by integration and QA teams."
          />
          <CardSurface stretch>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="eyebrow-text text-xs text-base-content/50">
                    <th scope="col">MT field</th>
                    <th scope="col">Likely pacs.008 source</th>
                    <th scope="col">Mapping note</th>
                  </tr>
                </thead>
                <tbody>
                  {MAPPING_GUIDE.map((row) => (
                    <tr key={row.mt}>
                      <td className="text-sm font-semibold text-base-content/80">{row.mt}</td>
                      <td className="font-mono text-xs text-base-content/80">{row.mx}</td>
                      <td className="text-sm text-base-content/80">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardSurface>
        </section>

        <section className="space-y-5" id="validation">
          <SectionHeader
            title="Validation layers"
            description="Production conversion systems usually validate in multiple layers to isolate defects early."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {VALIDATION_LAYERS.map((layer) => (
              <CardSurface key={layer.name} title={layer.name} stretch>
                <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
                  {layer.checks.map((check) => <li key={check}>{check}</li>)}
                </ul>
              </CardSurface>
            ))}
          </div>
        </section>

        <section className="space-y-5" id="cbpr">
          <SectionHeader
            title="CBPR+ rule considerations"
            description="Common profile-level expectations in cross-border ISO 20022 test and certification flows."
          />
          <CardSurface stretch>
            <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-info/25 bg-info/10 px-3 py-2 text-sm text-info">
              <Scale className="h-4 w-4" />
              Always align validation with the exact CBPR+ release and local market practice in scope.
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
              {CBPR_RULES.map((rule) => <li key={rule}>{rule}</li>)}
            </ul>
          </CardSurface>
        </section>

        <section className="space-y-5" id="pacs008">
          <SectionHeader
            title="MX validation and pacs.008 semantic requirements"
            description="Schema-valid XML is necessary, but semantic completeness and profile conformance are also required in most test suites."
          />
          <CardSurface stretch>
            <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-success/25 bg-success/10 px-3 py-2 text-sm text-success">
              <ShieldCheck className="h-4 w-4" />
              Typical quality gates combine XSD structure checks, profile rules, and semantic integrity checks.
            </div>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="eyebrow-text text-xs text-base-content/50">
                    <th scope="col">Semantic element (typical pacs.008 path)</th>
                    <th scope="col">Why it matters</th>
                  </tr>
                </thead>
                <tbody>
                  {PACS008_SEMANTIC_ELEMENTS.map((row) => (
                    <tr key={row.path}>
                      <td className="font-mono text-xs text-base-content/80">{row.path}</td>
                      <td className="text-sm text-base-content/80">{row.why}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardSurface>
        </section>

        <section className="space-y-5" id="testing">
          <SectionHeader
            title="Testing and certification strategy"
            description="Recommended approach for repeatable readiness and lower release risk."
          />
          <CardSurface stretch>
            <div className="mb-4 inline-flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-3 py-2 text-sm text-primary">
              <ListChecks className="h-4 w-4" />
              Layered test packs with version pinning reduce certification friction.
            </div>
            <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
              {TESTING_STRATEGY.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </CardSurface>
        </section>

        <section className="space-y-5" id="failures">
          <SectionHeader
            title="Common failure scenarios and remediation"
            description="Typical defects and practical remediations for teams operating conversion services."
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {FAILURE_SCENARIOS.map((item) => (
              <CardSurface key={item.issue} title={item.issue} stretch>
                <p className="text-sm text-base-content/80"><span className="font-semibold">Typical reason: </span>{item.reason}</p>
                <p className="mt-2 text-sm text-base-content/80"><span className="font-semibold">Suggested action: </span>{item.action}</p>
              </CardSurface>
            ))}
          </div>
        </section>

        <section className="space-y-5" id="security">
          <SectionHeader
            title="Security and compliance controls"
            description="Baseline controls typically required for payment-conversion platforms."
          />
          <CardSurface stretch>
            <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
              {SECURITY_CONTROLS.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </CardSurface>
        </section>

        <section className="space-y-5" id="operations">
          <SectionHeader
            title="Operations and observability"
            description="Operational practices for stable throughput, reliable diagnostics, and faster support cycles."
          />
          <CardSurface stretch>
            <ul className="list-disc space-y-2 pl-5 text-sm text-base-content/80">
              {OPERATIONS_CHECKLIST.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </CardSurface>
        </section>

        <section className="space-y-5" id="glossary">
          <SectionHeader
            title="Glossary"
            description="Quick reference definitions for onboarding teams and cross-functional stakeholders."
          />
          <CardSurface stretch>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr className="eyebrow-text text-xs text-base-content/50">
                    <th scope="col">Term</th>
                    <th scope="col">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {GLOSSARY.map((row) => (
                    <tr key={row.term}>
                      <td className="font-semibold text-base-content/80">{row.term}</td>
                      <td className="text-sm text-base-content/80">{row.meaning}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardSurface>
        </section>

        <CardSurface stretch>
          <div className="flex flex-wrap items-center gap-3 text-sm text-base-content/80">
            <Layers className="h-4 w-4 text-primary" />
            <span>
              Implementation note: exact mandatory elements vary by ISO 20022 version, CBPR+ release, market profile,
              and counterpart test-pack scope. Keep release metadata explicit in code and docs.
            </span>
          </div>
        </CardSurface>

        <CardSurface stretch>
          <div className="flex flex-wrap items-center gap-3 text-sm text-warning">
            <AlertTriangle className="h-4 w-4" />
            Treat message transformation as controlled compliance logic, not only as text formatting.
          </div>
        </CardSurface>

        <CardSurface stretch>
          <div className="flex flex-wrap items-center gap-3 text-sm text-success">
            <CheckCircle2 className="h-4 w-4" />
            Teams using versioned profiles + layered validation + deterministic mappings usually certify faster.
          </div>
        </CardSurface>

        <CardSurface className="border-primary/25 bg-gradient-to-r from-primary/10 via-base-100/90 to-secondary/10" stretch>
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="eyebrow-text text-xs text-base-content/60">Next step</p>
              <h2 className="mt-2 text-2xl font-semibold text-base-content">Ready to test conversion scenarios in the platform?</h2>
              <p className="mt-1 text-sm text-base-content/70">Create an account to track validations, outcomes, and historical runs.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to={ROUTES.REGISTER} className="btn btn-primary">Register</Link>
              <Link to={ROUTES.HOME} className="btn btn-ghost">Back to homepage</Link>
            </div>
          </div>
        </CardSurface>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SwiftDocumentationPage
