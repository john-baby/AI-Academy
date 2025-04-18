# import google.generativeai as genai
# import os
# from dotenv import load_dotenv
# load_dotenv()

# genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
# generation_config = {
#   "temperature": 0.6,
#   "top_p": 0.95,
#   "top_k": 64,
#   "max_output_tokens": 20000,
#   "response_mime_type": "text/plain",
# }

# model = genai.GenerativeModel(
#   model_name="learnlm-1.5-pro-experimental",
#   generation_config=generation_config,
# #   system_instruction="Be a friendly, supportive tutor. Guide the student to meet their goals, gently nudging them on task if they stray. Ask guiding questions to help your students take incremental steps toward understanding big concepts, and ask probing questions to help them dig deep into those ideas. Pose just one question per conversation turn so you don't overwhelm the student. Wrap up this conversation once the student has shown evidence of understanding."
#   system_instruction="""
#   Be a friendly, supportive tutor. Provide clear and detailed explanations when students ask about topics or concepts, ensuring they understand key 
#   concepts. Only When students ask homework-like questions, guide them toward the answers rather than giving direct solutions, 
#   helping them develop problem-solving skills. Ask guiding questions to encourage critical thinking and deeper understanding. 
#   Pose just one question per conversation turn to avoid overwhelming the student. Wrap up the conversation once the student 
#   demonstrates understanding.
#   """
# )

# short_contexts = ["test context ignore"]

# # Function to get initial response based on the subject
# def get_response(prevMessages, prompt, model):
#     """
#     Acts as an educational tutor to respond to queries flexibly.
#     Handles both detailed questions and topic names, providing structured,
#     engaging, and informative responses.
#     """
#     try:
#         # Define the prompt to guide the AI to act like a teacher
#         prompt = f"""
#         prevMessages: {prevMessages}
#         Query: {prompt}
#         """
#         # Generate response
#         response = model.generate_content(prompt)
#         if response and response.text:
#             return response.text.strip()
#         return "No response generated. Please try again."
#     except Exception as e:
#         return f"An error occurred: {str(e)}"

# # Function to shorten and store chat context
# def shorten_context(user, ai,query):
#     prompt = f"""
#     The user is visually impaired and has difficulty learning.
#     Based on the previous chat history:
#     context : {short_contexts[-1]}
#     User: {user}
#     AI: {ai}
#     current query : {query}

#     Summarize this interaction in 2-3 lines, making it precise and useful for context in future responses.
#     """
#     try:
#         response = model.generate_content(prompt)
#         if response and response.text:
#             short_contexts.append(response.text.strip())
#             return response.text.strip()
#         return "Context could not be shortened."
#     except Exception as e:
#         return f"An error occurred: {str(e)}"


# # Function to handle follow-up questions or new queries
# def ask_mor(user, ai, query):
#     try:
#         # Summarize context if history exists
#         context = shorten_context(user, ai ,query) if short_contexts else ""
#         print(context)
        
#         # Generate response
#         prompt = f"""
#         The user is visually impaired. Analyze the context carefully and respond based on it.
#         Context: {context}
#         new user Query: {query}
#         Provide a brief, friendly, and clear response. If the query is entirely new, handle it accordingly.
#         """
#         response = model.generate_content(prompt)
#         if response and response.text:
#             return {
#                 "info": response.text.strip(),
#                 "context": context
#             }
#         return {
#             "info": "I'm not sure about that.",
#             "context": context
#         }
#     except Exception as e:
#         return {
#             "info": f"Sorry, an error occurred: {str(e)}",
#             "context": ""
#         }
    
import google.generativeai as genai
import os
from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
generation_config = {
  "temperature": 0.6,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 20000,
  "response_mime_type": "text/plain",
}

short_contexts = ["test context ignore"]

# Function to get initial response based on the subject
def get_response(prevMessages, prompt, model_name):
    """
    Acts as an educational tutor to respond to queries flexibly.
    Handles both detailed questions and topic names, providing structured,
    engaging, and informative responses.
    """
    try:
        if model_name == 'LearnLM':
            model = genai.GenerativeModel(
                model_name='learnlm-1.5-pro-experimental',
                generation_config=generation_config,
                system_instruction="""
                Be a friendly, supportive tutor. Provide clear and detailed explanations when students ask about topics or concepts, ensuring they understand key 
                concepts. Only When students ask homework-like questions, guide them toward the answers rather than giving direct solutions, 
                helping them develop problem-solving skills. Ask guiding questions to encourage critical thinking and deeper understanding. 
                Pose just one question per conversation turn to avoid overwhelming the student. Wrap up the conversation once the student 
                demonstrates understanding.
                """
            )
        else:
             model = genai.GenerativeModel(
                model_name='gemini-2.0-flash',
                generation_config=generation_config,
                system_instruction="""
                Be a friendly, supportive tutor. Provide clear and detailed explanations when students ask about topics or concepts, ensuring they understand key 
                concepts. Ask guiding questions to encourage critical thinking and deeper understanding. Wrap up the conversation once the student 
                demonstrates understanding.
                """
            )
        # Define the prompt to guide the AI to act like a teacher
        prompt = f"""
        prevMessages: {prevMessages}
        Query: {prompt}
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
