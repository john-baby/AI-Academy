import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
model = genai.GenerativeModel('gemini-1.5-flash')

short_contexts = ["test context ignore"]

# Function to get initial response based on the subject
def get_response(query):
    """
    Acts as an educational tutor to respond to queries flexibly.
    Handles both detailed questions and topic names, providing structured,
    engaging, and informative responses.
    """
    try:
        # Define the prompt to guide the AI to act like a teacher
        prompt = f"""
        You are an educational tutor. Always respond like a teacher, adapting to the user's query.
        If the query is a topic name (e.g., "French Revolution"), provide detailed, structured notes covering:
        1. **Introduction**: A brief overview of the topic.
        2. **Key Points**: Highlight the essential aspects or milestones.
        3. **Significance**: Explain why this topic is important or interesting.
        4. **Examples or Illustrations**: Include specific examples, anecdotes, or case studies if applicable.
        5. **Follow-Up Questions**: Suggest related questions or areas for further exploration.

        If the query is a full question, address it with an in-depth and educational explanation, using examples where possible.

        For all responses:
        - Be engaging and easy to understand.
        - Provide additional context to make learning enjoyable.
        - Encourage the user to explore further by asking follow-up questions.

        Query: {query}
        Response:
        """
        # Generate response
        response = model.generate_content(prompt)
        if response and response.text:
            return response.text.strip()
        return "No response generated. Please try again."
    except Exception as e:
        return f"An error occurred: {str(e)}"

# Function to shorten and store chat context
def shorten_context(user, ai,query):
    prompt = f"""
    The user is visually impaired and has difficulty learning.
    Based on the previous chat history:
    context : {short_contexts[-1]}
    User: {user}
    AI: {ai}
    current query : {query}

    Summarize this interaction in 2-3 lines, making it precise and useful for context in future responses.
    """
    try:
        response = model.generate_content(prompt)
        if response and response.text:
            short_contexts.append(response.text.strip())
            return response.text.strip()
        return "Context could not be shortened."
    except Exception as e:
        return f"An error occurred: {str(e)}"


# Function to handle follow-up questions or new queries
def ask_mor(user, ai, query):
    try:
        # Summarize context if history exists
        context = shorten_context(user, ai ,query) if short_contexts else ""
        print(context)
        
        # Generate response
        prompt = f"""
        The user is visually impaired. Analyze the context carefully and respond based on it.
        Context: {context}
        new user Query: {query}
        Provide a brief, friendly, and clear response. If the query is entirely new, handle it accordingly.
        """
        response = model.generate_content(prompt)
        if response and response.text:
            return {
                "info": response.text.strip(),
                "context": context
            }
        return {
            "info": "I'm not sure about that.",
            "context": context
        }
    except Exception as e:
        return {
            "info": f"Sorry, an error occurred: {str(e)}",
            "context": ""
        }
    