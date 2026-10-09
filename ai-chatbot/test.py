from app.database import engine

try:
    with engine.connect() as connection:
        print("MySQL berhasil terhubung!")

except Exception as e:
    print("Gagal terhubung ke MySQL:")
    print(e)