# Script para configurar el archivo hosts en Windows
# IMPORTANTE: Ejecutar como Administrador

# Agregar entrada al archivo hosts
echo "127.0.0.1 admin.bet30.local" >> C:\Windows\System32\drivers\etc\hosts

Write-Host "✅ Dominio admin.bet30.local agregado al archivo hosts"
Write-Host "🔧 Ahora puedes acceder a: https://admin.bet30.local:7182"

# Verificar que se agregó correctamente
Write-Host "`n📋 Contenido del archivo hosts relacionado con bet30:"
Get-Content C:\Windows\System32\drivers\etc\hosts | Select-String "bet30"