from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from openai import OpenAI

app = Flask(__name__)
CORS(app)



@app.route('/get_summary', methods=['GET'])
def get_summary():
    video_id = request.args.get('video_id')
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = ' '.join([entry['text'] for entry in transcript])
        
        completion = client.chat.completions.create(
            model='gpt-4o-mini', 
            messages=[
                {"role": "user", "content": f"Summarize the following briefly in less than 75 words: {transcript_text}"}
            ],
            max_tokens=100
        )
        
        summary = completion.choices[0].message.content.strip()
        return jsonify({'summary': summary})

    except Exception as e:
        print(f'Error fetching summary: {e}')
        return jsonify({'error': 'Error fetching summary'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
