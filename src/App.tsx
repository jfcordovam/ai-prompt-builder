import { useMemo, useState } from 'react'
import './App.css'

type PromptState = {
  role: string
  goal: string
  tone: string
  context: string
  format: string
}

const tonePresets = ['Professional', 'Friendly', 'Concise', 'Technical']
const formatPresets = ['Clean code + explanation', 'Step-by-step plan', 'Bullet list', 'JSON schema']

const initialPrompt: PromptState = {
  role: 'Senior Frontend Engineer',
  goal: 'Write a React component',
  tone: 'Professional',
  context: 'SaaS dashboard application',
  format: 'Clean code + explanation',
}

function buildPrompt({ role, goal, tone, context, format }: PromptState) {
  const cleanRole = role.trim()
  const cleanGoal = goal.trim()
  const cleanTone = tone.trim()
  const cleanContext = context.trim()
  const cleanFormat = format.trim()

  return [
    cleanRole ? `Act as a ${cleanRole}.` : 'Act as an expert assistant.',
    cleanGoal ? `${cleanGoal}.` : 'Help me create a clear, useful result.',
    cleanContext ? `Use this context: ${cleanContext}.` : '',
    cleanTone ? `Use a ${cleanTone.toLowerCase()} tone.` : '',
    cleanFormat ? `Provide the output as ${cleanFormat.toLowerCase()}.` : '',
  ]
    .filter(Boolean)
    .join(' ')
}

function App() {
  const [promptFields, setPromptFields] = useState<PromptState>(initialPrompt)
  const [darkMode, setDarkMode] = useState(true)
  const [copied, setCopied] = useState(false)

  const generatedPrompt = useMemo(() => buildPrompt(promptFields), [promptFields])

  const updateField = (field: keyof PromptState, value: string) => {
    setPromptFields((current) => ({ ...current, [field]: value }))
    setCopied(false)
  }

  const copyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  return (
    <main className={darkMode ? 'app app--dark' : 'app'}>
      <section className="builder" aria-labelledby="app-title">
        <div className="topbar">
          <p className="eyebrow">AI Prompt Builder</p>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setDarkMode((current) => !current)}
            aria-pressed={darkMode}
          >
            {darkMode ? 'Light mode' : 'Dark mode'}
          </button>
        </div>

        <div className="intro">
          <h1 id="app-title">Build better AI prompts in seconds</h1>
          <p>
            Shape role, task, tone, context, and output format, then copy a polished
            prompt for ChatGPT, Claude, or Copilot.
          </p>
        </div>

        <label className="prompt-shell" htmlFor="goal">
          <span>What should the AI help you create?</span>
          <textarea
            id="goal"
            value={promptFields.goal}
            onChange={(event) => updateField('goal', event.target.value)}
            placeholder="Ask for a component, plan, email, refactor, test suite..."
            rows={3}
          />
          <small>{promptFields.goal.length} characters</small>
        </label>

        <div className="workspace">
          <section className="controls" aria-label="Prompt settings">
            <label>
              Role
              <input
                value={promptFields.role}
                onChange={(event) => updateField('role', event.target.value)}
                placeholder="Senior Frontend Engineer"
              />
            </label>

            <label>
              Context
              <input
                value={promptFields.context}
                onChange={(event) => updateField('context', event.target.value)}
                placeholder="SaaS dashboard application"
              />
            </label>

            <div className="field-group">
              <span>Tone</span>
              <div className="preset-grid">
                {tonePresets.map((tone) => (
                  <button
                    className={promptFields.tone === tone ? 'preset active' : 'preset'}
                    key={tone}
                    type="button"
                    onClick={() => updateField('tone', tone)}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div className="field-group">
              <span>Output format</span>
              <div className="preset-grid">
                {formatPresets.map((format) => (
                  <button
                    className={promptFields.format === format ? 'preset active' : 'preset'}
                    key={format}
                    type="button"
                    onClick={() => updateField('format', format)}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="preview" aria-labelledby="preview-title">
            <div className="preview-header">
              <div>
                <p className="eyebrow">Live preview</p>
                <h2 id="preview-title">Generated prompt</h2>
              </div>
              <button className="copy-button" type="button" onClick={copyPrompt}>
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            <p className="generated">{generatedPrompt}</p>
          </section>
        </div>
      </section>
    </main>
  )
}

export default App
