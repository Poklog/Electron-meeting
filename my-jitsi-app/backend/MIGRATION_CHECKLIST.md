# SQLite → Supabase 遷移檢查清單

## ✅ 已完成的更改

### 1. **套件依賴更新** (`requirements.txt`)

- ✅ 新增 `psycopg[binary]==3.19.0` - PostgreSQL Python 驅動程式
- ✅ 新增 `python-dotenv==1.0.0` - .env 檔案支援
- ✅ 所有套件已驗證與 Python 3.11.9 相容

### 2. **資料庫配置更新** (`app/db.py`)

- ✅ 移除 SQLite 專用的 `check_same_thread` 配置
- ✅ 新增 PostgreSQL 連接池配置 (`pool_pre_ping`, `pool_size`)
- ✅ 自動檢測資料庫類型並應用相應配置

### 3. **環境變數配置** (`app/core/config.py`)

- ✅ 新增 `SUPABASE_URL` 和 `SUPABASE_ANON_KEY` 欄位
- ✅ 改進 `resolved_database_url` 邏輯
- ✅ 支援多種連接方式：`DATABASE_URL`、`SUPABASE_URL`、SQLite 備選

### 4. **ORM 模型修復** (`app/models.py`)

- ✅ 更換 SQLite 專用 JSON 類型為通用 `SQLAlchemy.JSON`
- ✅ 現在同時支援 SQLite 和 PostgreSQL

### 5. **環境變數範本更新** (`env.example`)

- ✅ 新增詳細的 Supabase 連接說明
- ✅ 提供完整的範例連接字串格式
- ✅ 包含步驟說明

### 6. **文檔和工具**

- ✅ 建立 `SUPABASE_SETUP.md` - 完整設定指南
- ✅ 建立 `test_connection.py` - 連接測試工具

---

## 📋 快速開始步驟

### 步驟 1: 準備虛擬環境

```bash
cd backend
python -m venv .venv
.\.venv\Scripts\activate    # Windows
# 或 source .venv/bin/activate  # macOS/Linux
```

### 步驟 2: 安裝更新的依賴

```bash
pip install -r requirements.txt
```

### 步驟 3: 配置 Supabase

1. 在 [Supabase Dashboard](https://app.supabase.com/) 建立新專案
2. 在 **Project Settings → Database** 取得連接字串
3. 建立 `.env` 檔案（複製自 `env.example`）
4. 填入 `DATABASE_URL`：
    ```env
    DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@YOUR_PROJECT_ID.supabase.co:5432/postgres
    ```

### 步驟 4: 測試連接

```bash
python test_connection.py
```

預期輸出：

```
✅ 連接成功！
```

### 步驟 5: 初始化資料庫

```bash
python -m app.seed
```

### 步驟 6: 啟動後端伺服器

```bash
uvicorn app.main:app --reload
```

---

## 🔍 驗證清單

執行以下命令確保一切正常：

```bash
# 1. 檢查 Python 版本
python --version
# 預期: Python 3.11.9 或更高版本

# 2. 驗證套件安裝
pip list | grep -E "psycopg|SQLAlchemy"
# 預期包含: psycopg 3.19.0, SQLAlchemy 2.0.36

# 3. 測試連接
python test_connection.py
# 預期: ✅ 連接成功！

# 4. 檢查資料庫表格
python
>>> from app.db import engine
>>> from app.models import Base
>>> Base.metadata.tables.keys()
# 預期顯示所有表格名稱
```

---

## ⚠️ 常見問題排除

### 問題：ModuleNotFoundError: No module named 'psycopg'

**解決：** 確保已執行 `pip install -r requirements.txt`

### 問題：連接超時或密碼錯誤

**解決：**

1. 驗證 DATABASE_URL 格式正確
2. 檢查 Supabase 專案是否運行中
3. 驗證密碼是否正確（特殊字符需要編碼）

### 問題：ImportError: cannot import name 'JSON' from 'sqlalchemy'

**解決：** 已在 `models.py` 中修正，確保執行了最新版本

---

## 📂 修改摘要

| 檔案                 | 修改內容                   |
| -------------------- | -------------------------- |
| `requirements.txt`   | 新增 PostgreSQL 驅動和工具 |
| `app/db.py`          | PostgreSQL 連接池配置      |
| `app/core/config.py` | Supabase 連接解析邏輯      |
| `app/models.py`      | JSON 類型相容性修復        |
| `env.example`        | Supabase 設定說明          |
| `SUPABASE_SETUP.md`  | 新增完整設定指南           |
| `test_connection.py` | 新增連接測試工具           |

---

## 🚀 後續步驟

1. **前端配置**（如需要）：
    - 更新前端 API 端點指向後端 URL
    - 確保 CORS_ORIGINS 在 `.env` 中正確設定

2. **生產環境部署**：
    - 使用環境變數管理敏感資訊
    - 考慮使用 Supabase Connection Pooling（PgBouncer）
    - 定期備份資料庫

3. **監控和維護**：
    - 監控連接池狀態
    - 定期檢查 Supabase 使用量和成本

---

## 📚 更多資源

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - 詳細設定指南
- [Supabase 官方文檔](https://supabase.com/docs)
- [SQLAlchemy PostgreSQL](https://docs.sqlalchemy.org/en/20/core/engines.html#postgresql)
- [psycopg 文檔](https://www.psycopg.org/psycopg3/)

---

**遷移完成日期：** 2026年2月7日
**測試環境：** Python 3.11.9
