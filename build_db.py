import sqlite3
import os

os.makedirs('data', exist_ok=True)
conn = sqlite3.connect('data/database.sqlite')
c = conn.cursor()

c.execute('''CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, category TEXT, title TEXT, content TEXT, tags TEXT)''')
c.execute('''INSERT OR IGNORE INTO articles VALUES ('01-001', '01_SU_YONETIMI', 'Doğada Filtresiz Su Bulma', 'Terleme torbası, yosun sıkma ve hayvan izi takibi ile su bulma yöntemleri...', 'su, susuzluk, filtre, terleme, yosun')''')

conn.commit()
conn.close()