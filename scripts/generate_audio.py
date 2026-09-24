"""
Generate TTS audio files for Kids Move & Learn using edge-tts.
Creates GENDER-SPECIFIC .mp3 files for each command in AZ, EN, RU languages.
Girl characters use female voices, boy characters use male voices.
No "Ela!" prefix - just say the action directly.
"""
import asyncio
import os
import edge_tts

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "assets", "audio")

# Voice mapping - female and male for each language
VOICES = {
    "az": {"girl": "az-AZ-BanuNeural", "boy": "az-AZ-BabekNeural"},
    "en": {"girl": "en-US-AnaNeural", "boy": "en-US-AndrewNeural"},
    "ru": {"girl": "ru-RU-SvetlanaNeural", "boy": "ru-RU-DmitryNeural"},
}

# Speech texts - NO "Ela!" prefix, just the action
TEXTS = {
    "az": {
        "sit": "Otururam.",
        "stand": "Qalxiram.",
        "walkForward": "Ireli gedirem.",
        "walkBackward": "Geriye gedirem.",
        "moveLeft": "Sola gedirem.",
        "moveRight": "Saga gedirem.",
        "jump": "Tullaniram!",
        "wave": "El sallayiram!",
        "nod": "Bashimi sallayiram.",
        "shakeHead": "Bashimi silkirem.",
        "spin": "Firlaniram!",
        "run": "Qachiram!",
        "stop": "Dayandim!",
        "clap": "El chaliram!",
        "dance": "Reqs edirem!",
        "read": "Kitab oxuyuram.",
        "write": "Yaziram.",
        "drink": "Su ichirem.",
        "eat": "Yemek yeyirem.",
        "sleep": "Yatiram.",
        "think": "Fikirleshirem.",
        "cry": "Aglayiram.",
        "laugh": "Gulurem!",
        "draw": "Shekil chekirem.",
        "sing": "Mahni oxuyuram!",
        "stretch": "Gerinirem.",
        "count": "Sayiram. Bir, iki, uch!",
        "point": "Gosterirem!",
    },
    "en": {
        "sit": "Sitting down.",
        "stand": "Standing up.",
        "walkForward": "Walking forward!",
        "walkBackward": "Walking backward!",
        "moveLeft": "Moving left!",
        "moveRight": "Moving right!",
        "jump": "Jumping!",
        "wave": "Waving hello!",
        "nod": "Nodding yes!",
        "shakeHead": "Shaking head no!",
        "spin": "Spinning around!",
        "run": "Running fast!",
        "stop": "Stopping now!",
        "clap": "Clapping hands!",
        "dance": "Dancing!",
        "read": "Reading a book.",
        "write": "Writing now.",
        "drink": "Drinking water.",
        "eat": "Eating food.",
        "sleep": "Going to sleep.",
        "think": "Thinking hard.",
        "cry": "Crying now.",
        "laugh": "Laughing!",
        "draw": "Drawing a picture.",
        "sing": "Singing a song!",
        "stretch": "Stretching out.",
        "count": "Counting. One, two, three!",
        "point": "Pointing!",
    },
    "ru": {
        "sit": "Сажусь.",
        "stand": "Встаю.",
        "walkForward": "Иду вперёд!",
        "walkBackward": "Иду назад!",
        "moveLeft": "Иду налево!",
        "moveRight": "Иду направо!",
        "jump": "Прыгаю!",
        "wave": "Машу рукой!",
        "nod": "Киваю!",
        "shakeHead": "Качаю головой!",
        "spin": "Кручусь!",
        "run": "Бегу!",
        "stop": "Остановился!",
        "clap": "Хлопаю!",
        "dance": "Танцую!",
        "read": "Читаю книгу.",
        "write": "Пишу.",
        "drink": "Пью воду.",
        "eat": "Ем.",
        "sleep": "Засыпаю.",
        "think": "Думаю.",
        "cry": "Плачу.",
        "laugh": "Смеюсь!",
        "draw": "Рисую.",
        "sing": "Пою песню!",
        "stretch": "Тянусь.",
        "count": "Считаю. Раз, два, три!",
        "point": "Показываю!",
    },
}

sem = asyncio.Semaphore(3)

async def generate_audio(text, voice, output_path):
    # Check if valid file already exists
    if os.path.exists(output_path) and os.path.getsize(output_path) > 100:
        return

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    for attempt in range(3):
        async with sem:
            try:
                communicate = edge_tts.Communicate(text, voice, rate="-5%")
                await communicate.save(output_path)
                if os.path.exists(output_path) and os.path.getsize(output_path) > 100:
                    print(f"  OK {os.path.basename(os.path.dirname(output_path))}/{os.path.basename(output_path)}")
                    return
            except Exception as e:
                if attempt == 2:
                    print(f"  ERROR: {e}")
                await asyncio.sleep(1)

async def main():
    tasks = []
    for lang, commands in TEXTS.items():
        for gender in ["girl", "boy"]:
            voice = VOICES[lang][gender]
            gender_dir = os.path.join(BASE_DIR, lang, gender)
            os.makedirs(gender_dir, exist_ok=True)
            for command, text in commands.items():
                output_path = os.path.join(gender_dir, f"{command}.mp3")
                tasks.append(generate_audio(text, voice, output_path))

    await asyncio.gather(*tasks)
    print("\nAll audio files generated successfully!")

if __name__ == "__main__":
    asyncio.run(main())
