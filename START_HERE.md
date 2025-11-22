# 🚀 Plant Disease Spotter - Quick Start Guide

## Prerequisites

- Docker Desktop installed and running
- Node.js 18+ (for local development)
- Your trained model files (if you have them)

## Step 1: Setup Environment Variables

### Backend Setup

1. Copy the example env file:
```bash
cd backend
copy env.example .env
```

2. Edit `backend/.env` and add your credentials:
```env
# Required
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/plant_disease
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:8080/api/auth/google/callback

# Gemini API (REQUIRED for cure descriptions)
GEMINI_API_KEY=your-gemini-api-key-here

# Inference service
INFERENCE_URL=http://inference:5000/predict

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend Setup (Optional - for local dev)

```bash
cd frontend
copy env.example .env
```

Edit `frontend/.env`:
```env
VITE_API_URL=http://localhost:8080/api
```

## Step 2: Add Your Trained Model (If Available)

If you have a trained model:

1. Place your model files in `backend/models/`:
   ```
   backend/models/
   ├── plant_disease_model.keras  (or .h5)
   └── class_names.txt
   ```

2. The `class_names.txt` should have one class name per line, format: `Plant___Disease`

Example:
```
Apple___Apple_scab
Apple___Black_rot
Tomato___Early_blight
Tomato___Late_blight
```

**Note**: If you don't have a model yet, the inference service will use fallback predictions. You can still test the full application flow.

## Step 3: Start the Application

### Option A: Using Docker Compose (Recommended)

```bash
cd backend
docker-compose up --build
```

This will start:
- ✅ PostgreSQL database
- ✅ Redis cache
- ✅ Python inference service (port 5000)
- ✅ Node.js backend API (port 8080)
- ✅ React frontend (port 5173)
- ✅ Nginx reverse proxy (port 80)

**Access the application at**: http://localhost

### Option B: Local Development

#### Terminal 1 - Backend:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

#### Terminal 3 - Inference Service:
```bash
cd backend/docker/inference
pip install -r requirements.txt
python app.py
```

## Step 4: Test the Application

1. **Open browser**: http://localhost (or http://localhost:5173 for local dev)

2. **Register/Login**:
   - Click "Get Started" or "Sign In"
   - Choose your role: Farmer, Agricultural Industry, or Pharmaceutical
   - Use manual login (or Google OAuth if configured)

3. **Upload an Image**:
   - Go to "Upload Image" page
   - Upload a plant leaf image
   - Wait for analysis (may take 10-30 seconds first time)

4. **View Results**:
   - See disease detection results
   - View AI-generated 10-step cure guide (powered by Gemini)
   - Check role-specific insights

## Step 5: Verify Gemini Integration

The Gemini API is used to generate detailed cure descriptions. Make sure:

1. ✅ `GEMINI_API_KEY` is set in `backend/.env`
2. ✅ The key is valid and has API access enabled
3. ✅ Results page shows "Treatment Plan - 10 Step Cure Guide"

## Troubleshooting

### Model Not Loading

**Symptoms**: Health check shows `model_loaded: false`

**Solutions**:
- Check `backend/models/plant_disease_model.keras` exists
- Verify model file is not corrupted
- Check Docker logs: `docker-compose logs inference`

### Gemini API Not Working

**Symptoms**: No cure steps shown in results

**Solutions**:
- Verify `GEMINI_API_KEY` in `.env` file
- Check API key is valid at https://makersuite.google.com/app/apikey
- Check backend logs: `docker-compose logs backend`

### Database Connection Issues

**Solutions**:
- Ensure PostgreSQL container is running: `docker-compose ps`
- Check `DATABASE_URL` in `.env` matches docker-compose settings
- Reset database: `docker-compose down -v && docker-compose up`

### Port Already in Use

**Solutions**:
- Stop other services using ports 80, 8080, 5000, 5173
- Or change ports in `docker-compose.yml`

## API Endpoints

- **Health Check**: http://localhost:5000/health (inference service)
- **Backend API**: http://localhost:8080/api
- **Frontend**: http://localhost

## Development Commands

```bash
# Rebuild everything
docker-compose up --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Reset database
docker-compose down -v
docker-compose up
```

## Next Steps

1. ✅ Add your trained model to `backend/models/`
2. ✅ Configure Google OAuth (optional)
3. ✅ Set up Gemini API key
4. ✅ Start services
5. ✅ Test with sample images
6. ✅ Deploy to production (when ready)

## Support

- Check logs: `docker-compose logs [service-name]`
- Verify environment variables
- Ensure all services are running: `docker-compose ps`

---

**Ready to start?** Run `docker-compose up --build` in the `backend` directory! 🚀

