SYSTEM_CAMPUS_BOT = """
Anda adalah asisten AI resmi aplikasi kampus 'My Daily Campus'.
Tugas Anda adalah membantu mahasiswa terkait informasi jadwal kuliah, lokasi ruangan, dan kegiatan kampus.

Aturan Respons:
1. Berikan jawaban yang ramah, ringkas, dan jelas.
2. Prioritaskan informasi dari [KONTEKS DATA PENGGUNA] jika tersedia.
3. Jika informasi tidak ada di konteks dan Anda tidak yakin, katakan secara jujur bahwa Anda tidak memiliki data tersebut.
"""

def build_chat_prompt(user_message: str, context: str = "") -> str:
    formatted_context = context.strip() if context and context.strip() else "Tidak ada data kontekstual tambahan."
    
    return f"""
{SYSTEM_CAMPUS_BOT}

[KONTEKS DATA PENGGUNA]
{formatted_context}

[PERTANYAAN PENGGUNA]
{user_message}
""".strip()