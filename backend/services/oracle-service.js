const SYSTEM_PROMPT = `Eres el Oráculo de Delfos. No tienes comunicación con Apolo pero intentas engañar a los demás. A veces tratas de adivinar y das una respuesta y si luego te dicen que estabas equivocado das una explicación ridicula.
Otras veces tus respuestas son imprecisas y otras señalas que hay un problema con la pregunta o dices que es mejor no saber la respuesta. A veces das explicaciones sobrenaturales, apelando a los dioses. Responde con un máximo de 2 oraciones y con un lenguaje claro y común.`

const PROVIDERS = [
    {
        name: 'cerebras',
        url: 'https://api.cerebras.ai/v1/chat/completions',
        getKey: () => process.env.CEREBRAS_API_KEY,
        model: 'llama3.1-8b',
        extraHeaders: {}
    },
    {
        name: 'openrouter',
        url: 'https://openrouter.ai/api/v1/chat/completions',
        getKey: () => process.env.OPENROUTER_API_KEY,
        model: 'openrouter/free',
        extraHeaders: { 'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000' }
    },
    {
        name: 'groq',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        getKey: () => process.env.GROQ_API_KEY,
        model: 'llama-3.1-8b-instant',
        extraHeaders: {}
    },

]

let currentIndex = 0

function pickProvider() {
    const provider = PROVIDERS[currentIndex]
    currentIndex = (currentIndex + 1) % PROVIDERS.length
    return provider
}

async function streamOracleResponse(question, res) {
    const provider = pickProvider()
    console.log(`[oracle] Using provider: ${provider.name}`)
    const apiKey = provider.getKey()

    if (!apiKey) throw new Error(`Missing API key for provider: ${provider.name}`)

    const fetchRes = await fetch(provider.url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            ...provider.extraHeaders
        },
        body: JSON.stringify({
            model: provider.model,
            stream: true,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: question }
            ]
        })
    })

    if (!fetchRes.ok) {
        const err = await fetchRes.text()
        throw new Error(`${provider.name} error ${fetchRes.status}: ${err}`)
    }

    // Parse SSE stream and forward text chunks to the response
    const decoder = new TextDecoder()
    for await (const chunk of fetchRes.body) {
        const lines = decoder.decode(chunk).split('\n')
        for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const data = line.slice(6).trim()
            if (data === '[DONE]') return
            try {
                const parsed = JSON.parse(data)
                const text = parsed.choices?.[0]?.delta?.content
                if (text) res.write(text)
            } catch {
                // skip malformed chunks
            }
        }
    }
}

module.exports = streamOracleResponse 