import sqlite3

# Conectar ao banco de dados (ou criar se não existir)
conn = sqlite3.connect('mydatabase.db')
cursor = conn.cursor()

# Criar a tabela logs
cursor.execute('''
CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
)
''')

# Criar a tabela emails
cursor.execute('''
CREATE TABLE IF NOT EXISTS emails (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    header TEXT,
    body TEXT,
    is_suspicious INTEGER DEFAULT 0
)
''')

# Salvar (commit) as alterações
conn.commit()

# Fechar a conexão
conn.close()
