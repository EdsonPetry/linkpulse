import express from 'express'
import { supabase } from './supabaseClient'

const app = express()
const port = 3000

// Test route to check if server is running
app.get('/', (req, res) => {
    res.send('LinkPulse API is running')
})

// Test route to check db connection
app.get('/api/test-db', async (require, res) => {
    const { data, error } = await supabase
        .from('urls')
        .select('*')
        .limit(1)

    if (error) {
        return res.status(500).json({ error: error.message })
    }

    res.json({ success: true, data: data })
})

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})