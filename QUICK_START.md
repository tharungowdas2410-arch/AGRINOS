# ⚡ Quick Start - Run the Application

## One-Command Start (Windows PowerShell)

```powershell
.\start.ps1
```

This script will:
- ✅ Check Docker is running
- ✅ Create `.env` file if missing
- ✅ Check for model files
- ✅ Start all services

## Manual Start

### 1. Setup Environment

```powershell
cd backend
copy env.example .env
```

**Edit `backend/.env`** and add your Gemini API key:
```env
GEMINI_API_KEY=your-gemini-api-key-here
```

### 2. Start Services

```powershell
cd backend
docker-compose up --build
```

### 3. Access Application

Open browser: **http://localhost**

## What You'll See

1. **Homepage** - Landing page with features
2. **Login/Register** - Create account or sign in
3. **Upload Image** - Upload plant leaf image
4. **Results** - View:
   - Disease detection
   - **10-step cure guide** (AI-generated via Gemini)
   - Role-specific insights
   - Quality metrics

## Gemini API Key

Get your free API key:
1. Visit: https://makersuite.google.com/app/apikey
2. Create API key
3. Add to `backend/.env`:
   ```
   GEMINI_API_KEY=your-key-here
   ```

## Model Files (Optional)

If you have a trained model:
- Place at: `backend/models/plant_disease_model.keras`
- Add class names: `backend/models/class_names.txt`

**Without model**: App still works with fallback predictions!

## Troubleshooting

**Port in use?**
```powershell
docker-compose down
docker-compose up
```

**View logs:**
```powershell
docker-compose logs -f
```

**Reset everything:**
```powershell
docker-compose down -v
docker-compose up --build
```

---

**Ready?** Run `.\start.ps1` or `docker-compose up --build` in the `backend` folder! 🚀

