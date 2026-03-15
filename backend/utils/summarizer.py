import json
from openai import OpenAI
from core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def clean_text(text: str):
    return " ".join(text.split())

async def summarize_article(text: str):

    text = clean_text(text)

    # skip summarizing very small articles
    if len(text.split()) < 60:
        return {
            "summary": [text],
            "bias": "Low"
        }

    MAX_CHARS = 3500
    truncated_text = text[:MAX_CHARS]

    # avoid cutting mid sentence
    last_period = truncated_text.rfind(".")
    if last_period != -1:
        truncated_text = truncated_text[:last_period + 1]


    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": "You summarize news articles and detect bias."
            },
            {
                "role": "user",
                "content": f"""
                Summarize the article in exactly 5 bullet points.

                Also classify bias as:
                Low
                Medium
                High

                Return STRICT JSON ONLY in this format:
    
                {{
                    "summary": [
                        "point1",
                        "point2",
                        "point3",
                        "point4",
                        "point5"
                    ],
                    "bias": "Low"
                }}

                Article:
                {truncated_text}
                """
            }
        ],
        max_tokens=200,
        temperature=0.3,
        response_format={"type": "json_object"}
    )

    content = response.choices[0].message.content

    if not content:
        return {
            "summary": ["Summary failed"],
            "bias": "Unknown"
        }

    try:
        parsed = json.loads(content)
        return parsed
    except Exception:
        print("AI RAW RESPONSE: ", content)
        return {
            "summary": [content.strip()],
            "bias": "Unknown"
        }
