$apiUrl = "https://shopverse-ol0l.onrender.com/api"

Write-Host "Creating test user..." -ForegroundColor Yellow

# Create user
$registerBody = @{
    name = "Test User"
    email = "test@example.com"
    password = "test123"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$apiUrl/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "User created successfully!" -ForegroundColor Green
    Write-Host "User: $($response.user.name) - Email: $($response.user.email)" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "User already exists, trying to login..." -ForegroundColor Yellow
        
        # Try to login
        $loginBody = @{
            email = "test@example.com"
            password = "test123"
        } | ConvertTo-Json
        
        try {
            $loginResponse = Invoke-RestMethod -Uri "$apiUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
            Write-Host "Login successful!" -ForegroundColor Green
            Write-Host "Welcome: $($loginResponse.user.name)" -ForegroundColor Green
        } catch {
            Write-Host "Login failed: $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "Error creating user: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nTest credentials:" -ForegroundColor Cyan
Write-Host "Email: test@example.com" -ForegroundColor White
Write-Host "Password: test123" -ForegroundColor White
