import express from 'express'
import morgan from 'morgan'
import authRouter from './routes/auth';
import urlRouter from './routes/urls';

const app = express();
const port = 3000

// MiDDLEWARE
app.use(express.json());
app.use(morgan('dev'));

// Test route to check if server is running
app.get('/', (req, res) => {
    res.send('LinkPulse API is running')
})

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/urls', urlRouter);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})