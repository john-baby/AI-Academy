import openai
import numpy as np
import fitz  # PyMuPDF for PDF processing
from flask import Flask, request, render_template, redirect, url_for
from sklearn.metrics.pairwise import cosine_similarity

# Set your OpenAI API key
openai.api_key = 'YOUR_API_KEY'

app = Flask(__name__)

# Function to extract and chunk text from PDF
def extract_and_chunk_text(pdf_file):
    doc = fitz.open(stream=pdf_file.read(), filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    chunks = [text[i:i+1000] for i in range(0, len(text), 1000)]
    return chunks

# Function to get embeddings for a text chunk
def get_embedding(text, model="text-embedding-ada-002"):
    response = openai.Embedding.create(input=text, model=model)
    embedding = response['data'][0]['embedding']
    return np.array(embedding)

# Generate embeddings for each chunk and store them
def generate_embeddings(chunks):
    embeddings = []
    for chunk in chunks:
        embeddings.append(get_embedding(chunk))
    return embeddings

# Retrieve relevant chunks based on question embedding similarity
def retrieve_relevant_chunks(question, chunks, embeddings):
    question_embedding = get_embedding(question)
    similarities = cosine_similarity([question_embedding], embeddings)[0]
    top_indices = np.argsort(similarities)[-3:]
    relevant_chunks = [chunks[i] for i in top_indices]
    return relevant_chunks

# Generate answer based on relevant chunks and question
def generate_answer(relevant_chunks, question):
    content = " ".join(relevant_chunks)
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a knowledgeable assistant."},
            {"role": "user", "content": f"Based on the following content, answer the question:\n\nContent: {content}\n\nQuestion: {question}"}
        ],
        max_tokens=200,
        temperature=0.5
    )
    return response.choices[0].message['content'].strip()

from flask import session
from flask_session import Session

app.secret_key = '1234'  # Replace with a secure secret key
app.config['SESSION_TYPE'] = 'filesystem'  # Store sessions on the filesystem

# Initialize the session
Session(app)

# Route to handle file upload and chunk extraction
@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        # Check if a file was uploaded
        if 'pdf_file' in request.files:
            pdf_file = request.files['pdf_file']
            chunks = extract_and_chunk_text(pdf_file)
            embeddings = generate_embeddings(chunks)
            session['chunks'] = chunks  # Store in session
            session['embeddings'] = embeddings  # Store in session
            return redirect(url_for('ask_question'))
    return render_template("index.html")

# Route to handle the question and return the answer
@app.route("/ask", methods=["GET", "POST"])
def ask_question():
    answer = None
    if request.method == "POST":
        question = request.form['question']
        chunks = session.get('chunks')
        embeddings = session.get('embeddings')
        if question and chunks and embeddings:
            relevant_chunks = retrieve_relevant_chunks(question, chunks, embeddings)
            answer = generate_answer(relevant_chunks, question)
    return render_template("ask.html", answer=answer)

if __name__ == "__main__":
    app.run(debug=True)

