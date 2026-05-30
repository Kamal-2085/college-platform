# College Compass

Full-stack college discovery platform with search, filters, comparisons, authentication, and saved items.

## Features

- Searchable college listings with filters and pagination
- Side-by-side comparison for 2-3 colleges
- Email OTP signup, password login, access/refresh tokens
- Saved colleges and comparisons per user

## Tech Stack

- Next.js App Router
- MongoDB + Mongoose
- JWT auth + refresh tokens
- Nodemailer for OTP and welcome email

## Environment Variables

Create a `.env.local` file (or copy `.env.example`) and provide the following:

```
MONGODB_URI=
JWT_SECRET=
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=College Compass <no-reply@collegecompass.com>
HUGGINGFACE_API_KEY=
HUGGINGFACE_MODEL=google/flan-t5-large
```

Notes:

- For Gmail, use `smtp.gmail.com` and an App Password.
- `JWT_SECRET` should be a long random string.
- Set `HUGGINGFACE_API_KEY` to enable the predictor tool. Optionally set `HUGGINGFACE_MODEL` to override the default model.

## Local Development

```bash
npm install
npm run dev
```

Visit http://localhost:3000

## Deployment

### Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. Add the environment variables from `.env.example` in the Vercel dashboard.
4. Deploy.

### Other hosts (Render/Railway/DigitalOcean)

1. Set the same environment variables.
2. Use build command: `npm run build`
3. Use start command: `npm run start`

## Production Checklist

- Set `NODE_ENV=production`
- Verify SMTP credentials
- Use a strong `JWT_SECRET`
- Ensure MongoDB IP access allows your host
