# Database setup

## VS Code connection

This workspace includes SQLTools settings in `.vscode/settings.json`.

Install the recommended VS Code extensions when prompted:

- SQLTools
- SQLTools MySQL/MariaDB Driver

Then open SQLTools and connect to:

- Name: `Spa CRM MIS MySQL`
- Host: `127.0.0.1`
- Port: `3306`
- Database: `spa_crm_mis`
- User: `root`
- Password: empty by default

If your MySQL root user has a password, update both:

- `backend/.env`
- `.vscode/settings.json`

## Commands

Run these from `backend`:

```powershell
Start-Process -FilePath 'C:\Program Files\MariaDB 12.3\bin\mysqld.exe' -ArgumentList '--defaults-file="H:\HTTTQL\mariadb-data\my.ini" --datadir="H:\HTTTQL\mariadb-data" --console' -WorkingDirectory 'H:\HTTTQL\mariadb-data' -WindowStyle Hidden
& 'C:\Program Files\nodejs\npm.cmd' run db:check
& 'C:\Program Files\nodejs\npm.cmd' run db:import
& 'C:\Program Files\nodejs\npm.cmd' run dev
```

In VS Code you can also run:

- `Terminal > Run Task > Backend: check database`
- `Terminal > Run Task > Backend: import database`
- `Terminal > Run Task > Backend: start API`

## Current error meaning

`ECONNREFUSED` means MySQL/MariaDB is not running or is not listening on the configured host/port.

Start MySQL first, then run:

```powershell
& 'C:\Program Files\nodejs\npm.cmd' run db:import
& 'C:\Program Files\nodejs\npm.cmd' run db:check
```
